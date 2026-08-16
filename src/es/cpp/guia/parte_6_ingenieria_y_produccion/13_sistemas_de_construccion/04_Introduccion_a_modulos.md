---
outline: [2, 3]
---

# Introducción a módulos

A lo largo de toda la guía hemos usado los `#include` para traer código de otros archivos. Es el sistema clásico, el que acompaña a C++ desde sus orígenes, pero no por eso está libre de problemas. De hecho, tiene problemas históricos bien conocidos: preprocesado lento, dependencias entre cabeceras que se pisan, macros que contaminan todo lo que tocan...

Desde **C++20** existe una alternativa moderna: los **módulos**. En este capítulo entenderás qué son, por qué nacieron y cómo cambian la forma de organizar el código. Y de paso, por qué muchos consideran que son el futuro de este lenguaje.

## 1. El problema del `#include`

Para entender los módulos, primero tenemos que mirar de frente el dolor de los headers clásicos. Cuando tu código dice `#include <vector>`, el preprocesador no "mira" el archivo: lo **copia entero** en tu archivo, línea por línea. Y lo hace una y otra vez, por cada archivo que lo incluya.

Con los headers clásicos, cada `.cpp` que hace `#include` debe **preprocesar** la cabecera completa, una y otra vez:

```cpp
// util.hpp
#include <vector>
#include <string>
#include <algorithm>

// main.cpp
#include "util.hpp"  // ¡Vuelve a preprocesar <vector>, <string>, ...
#include "util.hpp"  // ¡Y otra vez! (aunque la guarda lo evite)
```

El resultado: **compilación lenta** en proyectos grandes, con cada unidad de traducción reprocesando las mismas cabeceras. Imagínate un proyecto con cien archivos que incluyen `vector`: el preprocesador copia esa cabecera cien veces, con todo su contenido. Y si dos cabeceras usan macros con el mismo nombre... la guerra está servida.

::: warning Advertencia
⚠️ Los `#define` de una cabecera se filtran a todo lo que venga después. Un macro llamado `max` en una librería puede romper `std::max` en tu código. Los módulos **no sufren** este problema.
:::

## 2. ¿Qué es un módulo?

Un **módulo** es una unidad de compilación independiente que **exporta** sus símbolos de forma explícita y controlada. Nada se filtra: solo lo que declaras con `export` es visible desde fuera. Todo lo demás queda dentro, protegido, sin posibilidad de contaminar el código de quien importa.

```cpp
// matematicas.cppm  (archivo de módulo)
export module matematicas;   // Declara el módulo

export int duplicar(int x) { // Exporta la función
    return x * 2;
}

int privado(int x) {         // NO exportado: invisible fuera
    return x + 1;
}
```

```cpp
// main.cpp
import matematicas;  // Importa el módulo (¡no #include!)

int main() {
    return duplicar(21); // 42
    // privado(1);
    // ⚠️ Error: privado no está exportado
}
```

Fíjate en la última parte del código comentado: `privado` existe en el módulo, pero como no lleva `export`, nadie de afuera puede llamarla. Eso es justamente el punto: el módulo decide qué expone y qué no. No hay macros que se filtren, no hay símbolos que choquen.

## 3. Ventajas de los módulos frente a los headers
| Ventaja | Explicación |
|---|---|
| **Compilación más rápida** | Se procesa una vez, no una vez por cada `#include` |
| **Aislamiento** | Solo se ve lo exportado: adiós a las macros que se filtran |
| **Menos dependencias** | Cambiar la implementación no fuerza recompilar todo |
| **Claridad** | La interfaz se ve de un vistazo (`export`) |
El diagrama siguiente resume la diferencia de forma visual. Con headers, cada archivo que los incluye vuelve a preprocesar todo desde cero. Con módulos, la biblioteca se compila una sola vez y todos la reutilizan:

```
Headers:   main.cpp ──► preprocesar <vector> <string> <algorithm>... ──► compilar
           main2.cpp ─► preprocesar <vector> <string> <algorithm>... ──► compilar  (¡repetido!)

Módulos:   <vector> ──► compilar 1 vez ──► import desde main.cpp y main2.cpp
```

## 4. Módulos de la biblioteca estándar

La biblioteca estándar no se quedó atrás en esta revolución. **C++23** trae los **módulos estándar**: puedes importar la biblioteca estándar completa con una sola línea. Nada de enumerar `<iostream>`, `<vector>`, `<string>` y demás: un único `import std;` y tienes todo.

```cpp
import std; // Importa toda la biblioteca estándar

int main() {
    std::cout << "Hola desde import std" << std::endl;
    return 0;
}
```

::: info Nota
ℹ️ `import std;` es el futuro: ya no hay que enumerar `<iostream>`, `<vector>`, `<string>`... Los compiladores modernos lo soportan desde C++23.
:::

## 5. ¿Están listos para producción?

Los módulos son la apuesta de futuro del C++, pero conviene conocer su estado actual antes de lanzarse de cabeza. La tecnología es real y funciona, aunque su adopción todavía está en crecimiento:
| Aspecto | Estado |
|---|---|
| Soporte en compiladores | Bueno (GCC, Clang, MSVC) |
| Soporte en CMake | Sí (desde CMake 3.28) |
| Adopción en librerías | En crecimiento |
| Recomendación actual | Úsalos en proyectos nuevos; conviven con headers |
::: tip
💡 No tienes que reescribir todo: los módulos y los headers **pueden convivir** en el mismo proyecto. Empieza módulizando las partes nuevas.
:::

## 6. Buenas prácticas

- Exporta **solo lo público**; mantén los detalles internos sin `export`.
- Nombra los módulos con jerarquía de puntos: `matematicas.geometria`.
- Importa en el orden correcto: primero estándar, luego librerías, luego módulos propios.
- Convive con headers mientras migras poco a poco.

## 7. Resumen rápido

- Los `#include` re-preprocesan cabeceras una y otra vez (lento y propenso a conflictos).
- Los **módulos** (C++20) compilan una vez y exportan solo lo declarado.
- `export module nombre;` declara; `export` expone símbolos; `import` consume.
- **`import std;`** (C++23) importa toda la biblioteca estándar.
- Compilación más rápida, aislamiento total y menos dependencias.
- Los módulos conviven con los headers mientras migras.

Ya conoces la teoría de los módulos. En el siguiente capítulo veremos los **detalles de implementación**: los archivos de módulo, las particiones y el `export/import` en profundidad.
