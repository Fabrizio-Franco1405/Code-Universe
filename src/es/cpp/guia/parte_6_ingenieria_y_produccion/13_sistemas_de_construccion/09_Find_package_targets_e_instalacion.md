---
outline: [2, 3]
---

# Find_package, targets e instalación

Has creado tus propias librerías y usado gestores de paquetes. Ahora falta la pieza profesional que lo une todo: **`find_package`** para localizar librerías de terceros, los **targets** que las exponen, y la **instalación** de tu proyecto para que otros lo encuentren.

Es como montar una tienda: necesitas saber dónde comprar (find_package) y, a la vez, preparar tu mercancía para que otros la compren (install).

## 1. `find_package`: encontrar librerías de terceros

CMake localiza librerías instaladas con `find_package`:

```cmake
find_package(fmt CONFIG REQUIRED)  # Busca fmt
find_package(SDL2 REQUIRED)        # Busca SDL2

target_link_libraries(mi_programa PRIVATE fmt::fmt)
```

`find_package` busca de dos formas:
| Modo | Busca | Ejemplo |
|---|---|---|
| **MODULE** | Un script `.cmake` propio de CMake | `FindSDL2.cmake` |
| **CONFIG** | Archivos de config de la librería | `fmt-config.cmake` |
::: tip
💡 Las librerías modernas generan su propia configuración (`CONFIG`). Los gestores de paquetes (vcpkg/Conan) entregan precisamente esos archivos.
:::

## 2. Los targets importados

Las librerías expuestas por `find_package` llegan como **targets importados** con el doble `::`:

```cmake
find_package(fmt CONFIG REQUIRED)

# fmt::fmt es un target importado por la librería
target_link_libraries(mi_programa PRIVATE fmt::fmt)
```

Los targets importados son la forma **moderna** de usar librerías: propagan includes, flags y dependencias automáticamente, como tus targets propios.
| Estilo | Código |
|---|---|
| Antiguo (deprecado) | `find_package(fmt)` + `target_link_libraries(... fmt)` |
| **Moderno** | `find_package(fmt CONFIG)` + `target_link_libraries(... fmt::fmt)` |
## 3. `find_package(... CONFIG REQUIRED)`

Las dos palabras clave importantes:

- **`CONFIG`**: usa la configuración generada por la librería (no el script manual).
- **`REQUIRED`**: error de configuración si no se encuentra la librería.

```cmake
find_package(nlohmann_json CONFIG REQUIRED)

target_link_libraries(mi_programa PRIVATE nlohmann_json::nlohmann_json)
```

::: warning Advertencia
⚠️ Sin `REQUIRED`, CMake continúa si no encuentra la librería, y el fallo aparece después de forma confusa. Con `REQUIRED`, el error es claro e inmediato.
:::

## 4. Instalar tu proyecto: `install()`

Para que **otros** encuentren tu librería, debes instalarla. CMake copia headers y binarios a una ubicación del sistema:

```cmake
# Instala el binario de la librería
install(TARGETS util EXPORT utilTargets
    ARCHIVE DESTINATION lib      # .a/.lib
    LIBRARY DESTINATION lib      # .so/.dylib
    RUNTIME DESTINATION bin      # .dll/.exe
    INCLUDES DESTINATION include
)

# Instala los headers
install(DIRECTORY include/ DESTINATION include)

# Exporta la configuración para find_package
install(EXPORT utilTargets
    FILE util-config.cmake
    DESTINATION lib/cmake/util
)
```

Luego instalas con:

```bash
cmake --install build
```

## 5. La estructura instalada

Después de `cmake --install build`, la librería queda disponible en el sistema:

```
/usr/local/
├── include/
│   └── util/matematicas.hpp
├── lib/
│   ├── libutil.so        (o .a, .dll)
│   └── cmake/
│       └── util/
│           └── util-config.cmake   ← para find_package(util CONFIG)
```

Otro proyecto ahora puede hacer:

```cmake
find_package(util CONFIG REQUIRED)
target_link_libraries(mi_programa PRIVATE util::util)
```

## 6. El ciclo completo

```
Tu proyecto                       Otro proyecto
─────────────                     ─────────────
cmake --build build               find_package(util CONFIG REQUIRED)
cmake --install build ──────────► target_link_libraries(... util::util)
  lib/ + include/ + config
```

::: info Nota
ℹ️ `install(EXPORT ...)` es la pieza mágica: genera la configuración que permite a `find_package` encontrar tu librería con target moderno.
:::

## 7. `find_package` vs gestores de paquetes
| Criterio | `find_package` | vcpkg / Conan |
|---|---|---|
| Qué hace | Encuentra librerías **ya instaladas** | Descarga y compila las librerías |
| Quién instala | Tú (o el sistema) | El gestor |
| Reproducible | Depende de la máquina | Sí (manifiesto) |
| Uso combinado | Consume lo que el gestor instaló | Genera los `CONFIG` para `find_package` |

```bash
# Flujo típico con vcpkg: el gestor instala, find_package consume
cmake -B build -S . -DCMAKE_TOOLCHAIN_FILE=vcpkg.cmake
```

## 8. Buenas prácticas

- Usa siempre el **estilo moderno**: targets con `::`.
- Añade `CONFIG REQUIRED` a tus `find_package`.
- Instala con `install(EXPORT ...)` para generar la configuración.
- Separa `ARCHIVE`/`LIBRARY`/`RUNTIME` según el sistema.
- Documenta el `find_package` que tu librería espera.

## 9. Resumen rápido

- `find_package` localiza librerías instaladas (MODULE o CONFIG).
- Los targets modernos usan `::` (p. ej. `fmt::fmt`).
- `CONFIG REQUIRED` = claro y a prueba de fallos confusos.
- `install()` copia binarios, headers y genera la config.
- `install(EXPORT ...)` permite que otros usen `find_package` contigo.
- Los gestores instalan; `find_package` consume.

Tu librería ya es distribuible. En el siguiente capítulo veremos cómo **organizar el proyecto como un profesional**: estructura de carpetas, namespaces y diseño de la API pública.
