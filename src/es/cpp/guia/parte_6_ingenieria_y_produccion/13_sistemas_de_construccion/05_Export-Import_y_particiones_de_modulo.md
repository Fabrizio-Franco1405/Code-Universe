---
outline: [2, 3]
---

# Export-Import y particiones de módulo

En el capítulo anterior vimos los módulos por encima: `export module`, `export` e
`import`. Ya sabes qué son y para qué sirven, pero la teoría es solo la mitad del
camino. Ahora toca la parte práctica y detallada: los tipos de archivos de módulo,
cómo se exporta e importa, y cómo dividir un módulo grande en **particiones**.

## 1. Los archivos de un módulo

Un módulo no vive en un solo archivo. En la práctica, suele repartirse en varios,
cada uno con un rol claro. Piénsalo como un libro: hay una portada (la interfaz,
lo que el mundo ve) y un interior (la implementación, los detalles que nadie más
lee).

Un módulo suele tener varios archivos:

| Archivo | Extensión | Contenido |
|---|---|---|
| Archivo de interfaz | `.cppm` | La declaración y lo que se exporta |
| Archivo de implementación | `.cpp` | La implementación interna |
| Archivos de partición | `.cppm` | Módulos internos para dividir el grande |

```
┌───────────── matematicas.cppm ─────────────┐
│  export module matematicas;                │
│  export int sumar(int, int);  (declaración)│
└────────────────────────────────────────────┘
┌───────────── matematicas.cpp ──────────────┐
│  module matematicas;                       │
│  int sumar(int a, int b) { ... } (impl)    │
└────────────────────────────────────────────┘
```

## 2. Interfaz vs implementación

La distinción entre interfaz e implementación no es un capricho: es una de las
ventajas más grandes de los módulos. Separar la declaración de la implementación
tiene ventajas: puedes cambiar la implementación **sin recompilar** todo lo que usa
el módulo.

```cpp
// matematicas.cppm — interfaz
export module matematicas;

export int duplicar(int x); // Solo la declaración
```

```cpp
// matematicas.cpp — implementación
module matematicas; // Retoma el módulo declarado

int duplicar(int x) {
    return x * 2; // Detalle interno
}
```

```cpp
// main.cpp
import matematicas;

int main() { return duplicar(21); } // 42
```

Con los headers clásicos, cambiar una implementación podía forzar a recompilar todo
el proyecto. Con los módulos, quien consume el módulo solo ve la interfaz: si la
firma no cambia, no hay motivos para recompilar lo de afuera.

## 3. `export` en detalle

`export` es la palabra que abre las puertas del módulo. Se puede aplicar a
funciones, clases, variables y bloques. Todo lo que lleve `export` delante es
visible para quien importa el módulo; lo que no, queda resguardado en el interior.

`export` puede aplicarse a funciones, clases, variables y bloques:

```cpp
export module libreria;

export int publico = 42;           // Variable exportada

export class Usuario {             // Clase exportada
public:
    string nombre;
};

export {                            // Bloque exportado
    int uno() { return 1; }
    int dos() { return 2; }
}

int privado() { return 0; }        // No exportado: interno
```

::: tip
💡 Lo que no lleva `export` es **invisible** para quien importa el módulo. Es tu
caja fuerte privada.
:::

## 4. Re-exportar módulos

A veces tu módulo necesita apoyarse en otros, y quieres que quien importe el tuyo
vea también esos otros. Acá entra el **re-export**: la combinación `export import`,
que toma otro módulo y lo hace visible a través del tuyo.

Puedes **re-exportar** otro módulo, de forma que quien importa el tuyo vea también
el otro:

```cpp
// graficos.cppm
export module graficos;

export import matematicas; // Re-exporta todo lo de matematicas
export int dibujar();
```

```cpp
// main.cpp
import graficos;

int main() {
    duplicar(3); // ¡Visible sin importar matematicas!
    return 0;
}
```

Observa lo que pasa en `main.cpp`: solo importamos `graficos`, y sin embargo podemos
llamar a `duplicar`, que pertenece a `matematicas`. El re-export actúa como un
punto de reunión: quien usa `graficos` obtiene todo lo que ese módulo decidió
reunir.

## 5. Particiones de módulo

Cuando un módulo crece demasiado, llega el momento de dividirlo. Acá aparecen las
**particiones**: sub-módulos internos que pertenecen al módulo principal y lo
ayudan a organizarse. Es exactamente como dividir un tema largo en secciones:
quien lee el tema completo no necesita saber cómo está dividido por dentro.

Cuando un módulo crece demasiado, lo divides en **particiones internas**:

```cpp
// matematicas.cppm — el módulo principal
export module matematicas;

export import :aritmetica;   // Importa la partición y la re-exporta
export import :geometria;
```

```cpp
// aritmetica.cppm — partición
export module matematicas:aritmetica; // Partición del módulo

export int sumar(int a, int b) { return a + b; }
export int restar(int a, int b) { return a - b; }
```

```cpp
// geometria.cppm — otra partición
export module matematicas:geometria;

export double areaCirculo(double r) { return 3.14159 * r * r; }
```

```cpp
// main.cpp
import matematicas; // Todo llega a través del módulo principal

int main() {
    sumar(2, 3);           // De la partición aritmetica
    areaCirculo(2.0);      // De la partición geometria
    return 0;
}
```

La sintaxis es elegante: el módulo principal declara `export import :aritmetica` y
`:geometria`, y las particiones se nombran con el prefijo `modulo:parte`. Quien usa
`matematicas` no distingue entre una función que viene de una partición u otra: todo
llega unificado a través del módulo principal.

::: info Nota
ℹ️ Las particiones son un detalle **interno** del módulo: quien usa `matematicas`
no sabe (ni le importa) cómo se organiza por dentro.
:::

## 6. Reglas de oro del `import`

Para cerrar, repasemos las reglas que rigen el `import`. Algunas son obvias y otras
te van a sorprender gratamente si vienes del mundo de los headers:

| Regla | Explicación |
|---|---|
| Importa una sola vez | Los módulos se importan una vez por compilación |
| El orden no importa | A diferencia de los headers, el orden de `import` no afecta |
| No hay guards | Los módulos no necesitan `#pragma once` |
| Puedes importar headers | `import <vector>` funciona como alternativa a `#include` |

```cpp
import <iostream>;  // Importa la cabecera como módulo
import <vector>;
import matematicas;

// El orden no influye: todo está aislado
```

El hecho de que el orden no importe es una maravilla silenciosa. Con los headers,
el orden de los `#include` era fuente de bugs infinitos. Con los módulos, esa
preocupación desaparece: cada módulo está aislado, y el orden simplemente no tiene
forma de afectar el resultado.

::: warning Advertencia
⚠️ No mezcles `#include` e `import` del mismo archivo de forma descuidada: los
símbolos pueden duplicarse. Elige un estilo por archivo.
:::

## 7. Buenas prácticas

- Nombra los módulos con jerarquía: `libreria.nombre_limpo` (puntos).
- Exporta **solo la interfaz**; implementación en el archivo `.cpp`.
- Usa particiones solo cuando el módulo sea **realmente grande**.
- Re-exporta solo lo que de verdad quieres hacer visible.
- Escribe una línea por import, en orden estándar → librerías → propias.

## 8. Resumen rápido

- Interfaz `.cppm` (declaraciones) + implementación `.cpp` (detalles).
- `export` expone; sin él, todo es **privado** al módulo.
- `export import otro;` re-exporta módulos.
- Las **particiones** (`modulo:parte`) dividen módulos grandes.
- El orden de `import` no importa y no hay guards.
- Los módulos y headers conviven; úsalos con cabeza.

Con los módulos dominados, en el siguiente capítulo veremos cómo se organizan
físicamente las librerías: **header-only vs compiladas**, y cuándo elegir cada
una.