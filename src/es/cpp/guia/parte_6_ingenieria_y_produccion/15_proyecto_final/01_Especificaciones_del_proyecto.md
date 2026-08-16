---
outline: [2, 3]
---

# Especificaciones del proyecto final

Has llegado al final de la guía. Todos los módulos anteriores (variables, POO, plantillas, STL, memoria, concurrencia, CMake, optimización...) ahora convergen en **un solo objetivo**: construir un proyecto real completo, de principio a fin, como se hace en la industria.

Este es el examen final, pero el bueno: el que se aprueba **construyendo**.

## 1. El proyecto: un sistema de gestión de inventario

Construiremos una aplicación de consola que gestiona un **inventario de productos** con las siguientes características:

- **Productos** con nombre, categoría, cantidad y precio.
- **Operaciones**: añadir, eliminar, buscar, modificar y listar productos.
- **Persistencia**: guardar y cargar el inventario en un archivo JSON.
- **Búsquedas y filtros**: por categoría, por rango de precio, ordenaciones.
- **Reportes**: valor total del inventario, productos agotados, más caros.

## 2. Requisitos funcionales
| ID | Requisito |
|---|---|
| R1 | Añadir un producto al inventario |
| R2 | Eliminar un producto por ID |
| R3 | Modificar cantidad o precio de un producto |
| R4 | Buscar productos por nombre (parcial) |
| R5 | Filtrar por categoría y por rango de precio |
| R6 | Listar el inventario ordenado por nombre, precio o cantidad |
| R7 | Guardar el inventario en un archivo JSON |
| R8 | Cargar el inventario desde el archivo al iniciar |
| R9 | Generar reportes (valor total, agotados, más caros) |
| R10 | Menú interactivo por consola |
## 3. Requisitos técnicos (lo que debes aplicar)

Aquí es donde entran **todos** los módulos de la guía:
| Módulo | Aplicación en el proyecto |
|---|---|
| **Tipos de datos** | `struct Producto`, `enum class Categoria` |
| **STL** | `vector`, `map`, `unordered_map`, `sort`, `find_if` |
| **Lambdas** | Comparadores y filtros como lambdas |
| **Memoria** | `make_unique`, `shared_ptr` si hace falta |
| **C++ moderno** | `std::optional` (búsquedas), `std::string_view`, `auto` |
| **E/S** | Lectura de archivos, serialización JSON |
| **Excepciones** | Manejo de errores de archivos |
| **Patrones** | Quizás un Factory para las categorías |
| **CMake** | Build con CMake y estructura profesional |
## 4. La estructura del proyecto

```
inventario/
├── CMakeLists.txt
├── include/
│   └── inventario/
│       ├── producto.hpp
│       ├── inventario.hpp
│       └── json.hpp
├── src/
│   ├── main.cpp
│   ├── producto.cpp
│   ├── inventario.cpp
│   └── json.cpp
├── tests/
│   └── test_inventario.cpp
└── README.md
```

## 5. Formato de datos (JSON)

El inventario se guarda como un arreglo de productos:

```json
[
  {
    "id": 1,
    "nombre": "Laptop",
    "categoria": "Electronica",
    "cantidad": 5,
    "precio": 899.99
  },
  {
    "id": 2,
    "nombre": "Auriculares",
    "categoria": "Electronica",
    "cantidad": 0,
    "precio": 49.50
  }
]
```

::: tip
💡 Puedes usar la librería **nlohmann/json** (header-only, la instalamos con vcpkg/Conan en el módulo 13) o implementar un serializador propio como desafío extra.
:::

## 6. Criterios de evaluación
| Criterio | Peso |
|---|---|
| Compila y funciona sin errores | 30% |
| Usa los conceptos del módulo correctamente | 30% |
| Código limpio (nombres, estructura, sin código muerto) | 20% |
| Manejo de errores y casos límite | 10% |
| Build reproducible con CMake | 10% |
## 7. Entregables

1. El código completo del proyecto.
2. Un `CMakeLists.txt` que compile con `cmake -B build && cmake --build build`.
3. Tests básicos del inventario.
4. Un README breve con cómo compilar y usar.

## 8. Buenas prácticas

- Haz que compile **desde el principio** (incremental: producto → inventario → menú).
- Estructura profesional: `include/`, `src/`, `tests/`.
- Aplica las técnicas del módulo de optimización solo si las necesitas.
- Usa excepciones para errores reales, no para el flujo normal.
- Mantén el menú y la lógica de negocio **separados**.

## 9. Resumen rápido

- Proyecto: **sistema de gestión de inventario** en consola.
- Funcionalidades: CRUD + búsquedas + filtros + reportes + JSON.
- Aplica **todos** los módulos: POO, STL, lambdas, C++ moderno, CMake.
- Estructura profesional con `include/`, `src/` y `tests/`.
- Compilación reproducible con CMake.
- Entregables: código + CMake + tests + README.

Ya tienes la especificación. En el siguiente capítulo diseñaremos la arquitectura del sistema antes de escribir código: **el diseño del sistema**.
