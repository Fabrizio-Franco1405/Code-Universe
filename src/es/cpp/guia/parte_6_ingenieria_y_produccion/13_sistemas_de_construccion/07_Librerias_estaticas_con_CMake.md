---
outline: [2, 3]
---

# Librerías estáticas con CMake

Llega la hora de crear tu **propia librería** con CMake. En este capítulo aprenderás a empaquetar tu código como **librería estática** (`.a` en Linux, `.lib` en Windows): un binario que se incrusta dentro del ejecutable final al enlazar.

Imagina que tienes una caja de herramientas: montas las herramientas una vez y las metes en una caja. Cada vez que la necesitas, la abres y usas lo que hay dentro, sin volver a fabricarlas.

## 1. ¿Qué es una librería estática?

Una librería estática es una **colección de código objeto** (`.o`) empaquetada en un solo archivo (`.a` o `.lib`). Al enlazar tu programa, el código de la librería se **copia dentro** del ejecutable final.

```
util.cpp ──► util.o ──┐
mat.cpp  ──► mat.o  ──┼──► libutil.a (librería estática)
                      │
main.cpp ──► main.o ──┼──► enlazar ──► mi_programa (incluye util y mat)
                      ┘
```

**Ventaja:** el ejecutable es autónomo, no necesita archivos extra. **Desventaja:** cada programa que la use lleva su propia copia.

## 2. La estructura del proyecto

```
mi_proyecto/
├── CMakeLists.txt
├── src/
│   └── main.cpp
└── libs/
    └── util/
        ├── CMakeLists.txt
        ├── include/
        │   └── util/matematicas.hpp
        └── src/
            └── matematicas.cpp
```

Separar `include/` de `src/` es la convención profesional: headers en un sitio, implementación en otro.

## 3. El `CMakeLists.txt` de la librería

Creamos la librería con `add_library` y el tipo `STATIC`:

```cmake
# libs/util/CMakeLists.txt
cmake_minimum_required(VERSION 3.16)
project(util LANGUAGES CXX)

# Librería estática a partir de un archivo .cpp
add_library(util STATIC
    src/matematicas.cpp
)

# Exponemos la carpeta include con el TARGET de la librería
target_include_directories(util PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)
```

El secreto está en `target_include_directories(util PUBLIC ...)`: quien enlace `util` recibirá automáticamente la carpeta `include/`.

## 4. El archivo de la librería

```cpp
// libs/util/include/util/matematicas.hpp
#pragma once

namespace util {
int sumar(int a, int b);
int multiplicar(int a, int b);
}
```

```cpp
// libs/util/src/matematicas.cpp
#include "util/matematicas.hpp"

int util::sumar(int a, int b) {
    return a + b;
}

int util::multiplicar(int a, int b) {
    return a * b;
}
```

::: tip
💡 Fíjate en el `#include "util/matematicas.hpp"`: la subcarpeta `util/` dentro de `include/` evita colisiones de nombres entre librerías.
:::

## 5. El `CMakeLists.txt` principal

```cmake
# CMakeLists.txt
cmake_minimum_required(VERSION 3.16)
project(mi_proyecto LANGUAGES CXX)

# Añade la librería desde su carpeta
add_subdirectory(libs/util)

# El ejecutable
add_executable(mi_programa
    src/main.cpp
)

# Enlaza la librería (y sus includes)
target_link_libraries(mi_programa PRIVATE util)
```

```cpp
// src/main.cpp
#include <iostream>
#include "util/matematicas.hpp"
using namespace std;

int main() {
    cout << "Suma: " << util::sumar(3, 4) << endl;       // 7
    cout << "Multiplicación: " << util::multiplicar(3, 4) << endl; // 12
    return 0;
}
```

## 6. Compilar y verificar

```bash
cmake -B build -S .
cmake --build build
./build/mi_programa
```

Para **confirmar** que el código quedó dentro del ejecutable (Linux):

```bash
nm build/libutil.a   # Lista los símbolos de la librería
ldd build/mi_programa # No muestra libutil: ¡está incrustada!
```

::: info Nota
ℹ️ En el ejecutable, la librería estática **no aparece** como dependencia (`ldd`): su código ya forma parte del programa.
:::

## 7. `PUBLIC`, `PRIVATE` y `INTERFACE`

Los tres visores de `target_include_directories` deciden qué se propaga:
| Visor | Quién lo ve |
|---|---|
| `PRIVATE` | Solo la propia librería |
| `PUBLIC` | La librería y quien la enlaza |
| `INTERFACE` | Solo quien la enlaza (sin includes para la librería) |

```cmake
target_include_directories(util
    PUBLIC  ${CMAKE_CURRENT_SOURCE_DIR}/include   # headers públicos
    PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src       # internos
)
```

::: warning Advertencia
⚠️ La regla práctica: si tu header público usa otra librería, esa dependencia debe ser `PUBLIC`. Si solo la usa tu `.cpp`, es `PRIVATE`.
:::

## 8. Buenas prácticas

- Usa `STATIC` para librerías pequeñas o con poco uso compartido.
- Mantén `include/` separado de `src/`.
- Escribe headers con `#pragma once` y namespaces.
- Enlaza con `PRIVATE` si el ejecutable no expone la librería a nadie más.
- Verifica con `nm` y `ldd` que todo quedó como esperas.

## 9. Resumen rápido

- La librería **estática** (`STATIC`) se incrusta en el ejecutable (`.a`/`.lib`).
- `add_library(nombre STATIC archivos...)` crea la librería.
- `target_include_directories` propaga los includes con `PUBLIC`.
- `target_link_libraries(ejecutable PRIVATE nombre)` la enlaza.
- `PRIVATE`/`PUBLIC`/`INTERFACE` controlan qué ve cada uno.
- `nm` y `ldd` te dejan verificar el resultado.

La estática ya está dominada. En el siguiente capítulo verás la alternativa: las **librerías dinámicas**, compartidas entre programas.
