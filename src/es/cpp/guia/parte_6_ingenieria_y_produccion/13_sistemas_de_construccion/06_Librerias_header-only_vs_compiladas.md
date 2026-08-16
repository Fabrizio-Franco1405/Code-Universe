---
outline: [2, 3]
---

# Librerías header-only vs compiladas

En los capítulos anteriores viste cómo funciona CMake y cómo se estructuran los proyectos. Pero
antes de lanzarnos a crear librerías, hay una decisión de arquitectura que tenés que tomar y que
afecta a la velocidad de compilación, al uso y a la mantenibilidad: cuando creas una librería,
tienes que decidir **cómo se distribuye** — ¿todo el código en cabeceras (**header-only**) o
separado en archivos compilados (`.cpp` + `.hpp`)?

Pensalo como elegir entre vender una receta escrita en un papel o un pastel ya horneado: hay pros
y contras para cada enfoque. La receta es flexible y fácil de adaptar, pero quien la recibe tiene
que hacer todo el trabajo; el pastel ya viene listo, pero no se puede cambiar nada sin volver a la
cocina.

## 1. ¿Qué es una librería header-only?

Una librería **header-only** es un conjunto de archivos de cabecera (`.hpp`) que **no se compilan
aparte**: todo el código se define dentro de las cabeceras y se compila en cada punto de uso. No
hay `.cpp`, no hay binario, no hay nada que enlazar.

```cpp
// mi_libreria.hpp — TODO el código aquí
#pragma once

namespace util {

template <typename T>
T duplicar(T valor) {
    return valor * 2;
}

inline int triplicar(int x) {
    return x * 3;
}

}
```

Para usarla solo haces `#include "mi_libreria.hpp"`. Ni `cmake`, ni enlazado, ni nada. El usuario
de la librería no necesita saber cómo se construye: copia la carpeta, la incluye y listo.

## 2. ¿Qué es una librería compilada?

Una librería **compilada** separa la interfaz (`.hpp`) de la implementación (`.cpp`), que se
compila una vez para producir un binario (`.a`, `.so`, `.lib`, `.dll`) que se enlaza. El `.hpp`
solo contiene declaraciones; la lógica queda escondida en el `.cpp` y, más tarde, dentro del
binario:

```cpp
// mi_libreria.hpp — solo declaraciones
#pragma once

namespace util {
int duplicar(int valor);
}
```

```cpp
// mi_libreria.cpp — implementación
#include "mi_libreria.hpp"

int util::duplicar(int valor) {
    return valor * 2;
}
```

## 3. Las dos caras de la moneda

Cada enfoque tiene su fuerte y su debilidad. Esta tabla resume la comparación para que veas de un
vistazo cómo se comportan en cada aspecto:

| Característica | Header-only | Compilada |
|---|---|---|
| Distribución | Copiar la carpeta y listo | Compilar y enlazar binarios |
| Tiempo de compilación | Mayor (se compila en cada uso) | Menor (se compila una vez) |
| Complejidad para el usuario | Mínima | Necesita build system |
| Ocultar implementación | No (todo visible) | Sí |
| Tamaño del binario final | Puede inflarse (copias inline) | Controlado |
| Plantillas | Perfecto | Complicado (instanciación) |

## 4. ¿Cuándo elegir cada una?

### Header-only es ideal cuando:

- La librería es **pequeña** y se usa mucho.
- Está basada en **plantillas** (el compilador necesita el código para instanciar).
- Quieres la máxima **facilidad de integración** (solo un `#include`).

```cpp
// Ejemplos famosos header-only:
// nlohmann/json → json.hpp (un solo archivo)
// doctest        → doctest.h
// tl/optional    → optional.hpp
```

::: tip
💡 El patrón clásico: una librería basada en plantillas es **casi siempre** header-only, porque el compilador debe ver la implementación para instanciar los tipos.
:::

### Compilada es ideal cuando:

- La librería es **grande** o con lógica estable.
- Quieres **ocultar** la implementación (código propietario).
- El rendimiento de compilación **importa** en proyectos grandes.

```cpp
// Ejemplos famosos compiladas:
// fmt         → biblioteca compilada (aunque también hay header-only)
// OpenSSL     → .so / .lib
// Qt          → enorme, compilada
```

## 5. El truco de las `inline` variables

Las librerías header-only tienen un secreto técnico que vale la pena entender. Cuando un `.hpp` se
incluye en varios `.cpp`, sus definiciones aparecen varias veces en la compilación. Para que una
librería header-only no duplique símbolos al enlazar, las definiciones deben ser `inline` (o
plantillas):

```cpp
// mi_libreria.hpp
#pragma once

inline int version = 3; // inline evita duplicados en el enlazado

inline const char *nombre() {
    return "Mi Librería";
}

template <typename T>
T identidad(T v) { return v; } // Las plantillas son inline por defecto
```

::: warning Advertencia
⚠️ Si defines una **función no-inline** en una cabecera incluida en varios `.cpp`, tendrás errores de *"multiple definition"* al enlazar. Las cabeceras header-only usan `inline` o plantillas precisamente para evitarlo.
:::

## 6. El caso de las plantillas compiladas

Las plantillas pueden estar en `.cpp`, pero con una condición: debes **instanciarlas
explícitamente** para los tipos que uses. En otras palabras, si la implementación vive en un
`.cpp`, tenés que declarar de antemano para qué tipos la querés materializar:

```cpp
// util.cpp
template <typename T>
T duplicar(T v) { return v * 2; }

// Instancias explícitas solo para estos tipos
template int duplicar<int>(int);
template double duplicar<double>(double);
```

```cpp
// util.hpp
template <typename T> T duplicar(T v); // Declaración
```

::: info Nota
ℹ️ Si el usuario necesita `duplicar(long long)`, no existe la instanciación y falla el enlazado. Por eso las plantillas suelen vivir en cabeceras o módulos.
:::

## 7. Una solución intermedia: módulos

¿Y si no querés elegir entre compilar en cada uso o perder flexibilidad? El C++20/23 ofrece un
punto medio con los **módulos**: la interfaz se compila una vez (rápido) y las plantillas se
exportan con normalidad. Es lo mejor de ambos mundos:

```
Header-only:     compila en cada uso        (flexible, lento)
Compilada:       compila una vez            (rápido, rígido)
Módulos:         interfaz una vez + templates (lo mejor de ambos)
```

## 8. Buenas prácticas

- Librerías de **plantillas** → header-only (o módulos).
- Librerías **grandes y estables** → compiladas.
- Comienza **header-only** y migra a compilada si el tiempo de compilación duele.
- Usa `inline` para funciones y variables en cabeceras.
- Considera los **módulos** como el punto medio del futuro.

## 9. Resumen rápido

- **Header-only**: todo en cabeceras, facilísimo de usar, compila en cada punto.
- **Compilada**: interfaz + binario, rápida de compilar, oculta detalles.
- Las **plantillas** favorecen header-only.
- Usa `inline` en cabeceras para no duplicar símbolos.
- Empieza simple (header-only) y optimiza cuando haga falta.
- Los **módulos** son el punto medio moderno.

Ya sabes elegir el formato de tu librería. En el siguiente capítulo lo llevaremos a la práctica:
**crear una librería estática con CMake** paso a paso.