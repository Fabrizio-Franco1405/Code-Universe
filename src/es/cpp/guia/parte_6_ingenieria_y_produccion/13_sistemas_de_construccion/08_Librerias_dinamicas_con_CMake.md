---
outline: [2, 3]
---

# Librerías dinámicas con CMake

La librería estática se incrusta en cada programa que la usa. Las **librerías dinámicas** (o compartidas) son el otro enfoque: un único binario (`.so`, `.dll`, `.dylib`) que **varios programas comparten** en tiempo de ejecución.

Imagina una biblioteca pública con un solo libro: todos los lectores van a la biblioteca y lo leen allí. No se llevan una copia cada uno: comparten el mismo ejemplar.

## 1. ¿Qué es una librería dinámica?

Una librería dinámica es un binario separado que se **carga en memoria** cuando el programa lo necesita (al inicio o bajo demanda).

```
libutil.so (un solo binario compartido)
     ▲            ▲
     │            │
mi_programa   otra_app   (ambos usan la MISMA libutil.so)
```

**Ventaja:** un solo ejemplar en disco y memoria; actualizas la librería y todos los programas la usan. **Desventaja:** el ejecutable necesita encontrar la librería en tiempo de ejecución.

## 2. Los formatos según el sistema
| Sistema | Extensión | Notas |
|---|---|---|
| Linux | `.so` | *shared object* |
| macOS | `.dylib` | *dynamic library* |
| Windows | `.dll` | *dynamic link library* |
## 3. Crear la librería dinámica

Solo cambia `STATIC` por `SHARED`:

```cmake
# libs/util/CMakeLists.txt
cmake_minimum_required(VERSION 3.16)
project(util LANGUAGES CXX)

# LIBRERÍA DINÁMICA
add_library(util SHARED
    src/matematicas.cpp
)

target_include_directories(util PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)
```

El resto del proyecto es idéntico al de la estática:

```cmake
# CMakeLists.txt
add_subdirectory(libs/util)
add_executable(mi_programa src/main.cpp)
target_link_libraries(mi_programa PRIVATE util)
```

## 4. Windows: `__declspec(dllexport)`

En Windows, los símbolos de una DLL **no se exportan por defecto**. Debes marcarlos explícitamente:

```cpp
// util/matematicas.hpp
#pragma once

#ifdef UTIL_EXPORTS
#define UTIL_API __declspec(dllexport)   // Al compilar la DLL
#else
#define UTIL_API __declspec(dllimport)   // Al usarla
#endif

namespace util {
UTIL_API int sumar(int a, int b);
}
```

```cmake
# El macro se define automáticamente al compilar la SHARED
target_compile_definitions(util PRIVATE UTIL_EXPORTS)
```

::: warning Advertencia
⚠️ Sin `__declspec(dllexport)`, la DLL compila pero **no expone** funciones: el enlazador fallará con símbolos no resueltos. Es el error clásico de las DLLs.
:::

::: info Nota
ℹ️ En Linux y macOS **no hace falta** nada especial: todos los símbolos se exportan por defecto.
:::

## 5. Encontrar la librería en tiempo de ejecución

El ejecutable debe **localizar** la DLL/SO al arrancar. Opciones:

```bash
# Linux: LD_LIBRARY_PATH apunta a la carpeta de la .so
LD_LIBRARY_PATH=./build/libutil.so ./build/mi_programa

# Windows: la DLL debe estar junto al .exe (o en PATH)
copy build\Release\util.dll build\Release\mi_programa.exe
```

En Linux también puedes "incrustar" la ruta en el binario con `rpath`:

```cmake
target_link_options(mi_programa PRIVATE "-Wl,-rpath,$ORIGIN")
```

## 6. Verificar la dinámica

Con `ldd` (Linux) verás la dependencia:

```bash
ldd build/mi_programa
# libutil.so → /.../libutil.so   (¡ahora SÍ aparece!)
```

| Librería | `ldd` | `nm` |
|---|---|---|
| Estática | No aparece (incrustada) | Muestra los `.o` internos |
| Dinámica | Aparece como dependencia | Muestra los símbolos exportados |
## 7. Estática vs dinámica
| Característica | Estática | Dinámica |
|---|---|---|
| Ubicación | Dentro del ejecutable | Archivo externo |
| Actualizar librería | Recompilar el programa | Reemplazar el `.so`/`.dll` |
| Memoria en varios programas | Duplicada | Compartida |
| Distribución | Un solo archivo | Ejecutable + librerías |
| Dependencias en runtime | Ninguna | Deben estar disponibles |
::: tip
💡 La elección depende del contexto: estática para distribuir un único binario; dinámica para plugins, actualizaciones frecuentes y compartir memoria entre programas.
:::

## 8. Buenas prácticas

- En Windows, exporta símbolos con `UTIL_API` (dllexport/dllimport).
- Asegúrate de que el runtime encuentre la librería (`LD_LIBRARY_PATH`, `PATH`, `rpath`).
- Usa `SHARED` para plugins y librerías que se actualizan a menudo.
- Mantén la interfaz estable: cambiar la ABI de una DLL rompe a los que la usan.
- Documenta dónde debe colocarse la librería en cada sistema.

## 9. Resumen rápido

- La librería **dinámica** (`SHARED`) es un binario compartido por varios programas.
- Formatos: `.so` (Linux), `.dylib` (macOS), `.dll` (Windows).
- En Windows necesitas `__declspec(dllexport)` para exponer símbolos.
- El runtime debe encontrar la librería (`LD_LIBRARY_PATH`, `PATH`, `rpath`).
- `ldd` muestra las dependencias dinámicas.
- Estática = incrustada; dinámica = compartida.

Ya creas librerías estáticas y dinámicas. En el siguiente capítulo veremos cómo **integrar librerías de terceros** con `find_package`, targets y la instalación de tu proyecto.
