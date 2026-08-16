---
outline: [2, 3]
---

# Diseño del sistema

Antes de escribir una sola línea de código, un buen ingeniero **diseña**. En este capítulo definiremos la arquitectura del sistema de inventario: sus clases, sus responsabilidades y cómo se comunican. Es el plano de la casa antes de levantar los muros.

## 1. Los componentes del sistema

Dividimos el sistema en módulos con responsabilidades claras:

```
┌────────────┐     ┌──────────────┐     ┌─────────────┐
│  Producto  │     │  Inventario  │     │  JSON       │
│  (datos)   │◄───►│  (lógica)    │◄───►│  (persistencia)│
└────────────┘     └──────────────┘     └─────────────┘
                          ▲
                          │
                     ┌────┴────┐
                     │  Main   │
                     │  (menú) │
                     └─────────┘
```

| Componente | Responsabilidad |
|---|---|
| `Producto` | Representa los datos de un producto |
| `Inventario` | La lógica de negocio (CRUD, búsquedas, reportes) |
| JSON | Guardar y cargar del archivo |
| `main` | El menú interactivo y la orquestación |
## 2. La clase `Producto`

```cpp
// producto.hpp
#pragma once
#include <string>
#include <cstdint>

namespace inventario {

enum class Categoria { Electronica, Hogar, Ropa, Alimento, Otro };

struct Producto {
    uint32_t id = 0;
    std::string nombre;
    Categoria categoria = Categoria::Otro;
    int cantidad = 0;
    double precio = 0.0;
};

std::string categoriaAString(Categoria c);
Categoria stringACategoria(const std::string &s);

}
```

::: info Nota
ℹ️ Elegimos `enum class` (C++11) para las categorías: seguro, sin contaminar el namespace y con conversión explícita.
:::

## 3. La clase `Inventario`

El corazón de la lógica de negocio:

```cpp
// inventario.hpp
#pragma once
#include "inventario/producto.hpp"
#include <vector>
#include <string>
#include <optional>

namespace inventario {

class Inventario {
private:
    std::vector<Producto> productos;
    uint32_t siguienteId = 1;

public:
    // CRUD
    Producto &agregar(const std::string &nombre, Categoria cat, int cantidad, double precio);
    bool eliminar(uint32_t id);
    std::optional<Producto *> buscarPorId(uint32_t id);
    bool modificarPrecio(uint32_t id, double nuevoPrecio);
    bool modificarCantidad(uint32_t id, int nuevaCantidad);

    // Búsquedas y filtros
    std::vector<Producto> buscarPorNombre(const std::string &texto) const;
    std::vector<Producto> filtrarPorCategoria(Categoria c) const;
    std::vector<Producto> filtrarPorPrecio(double minimo, double maximo) const;

    // Reportes
    double valorTotal() const;
    std::vector<Producto> agotados() const;
    std::vector<Producto> masCaros(int n) const;

    // Persistencia
    void guardar(const std::string &archivo) const;
    void cargar(const std::string &archivo);

    size_t tamano() const { return productos.size(); }
};

}
```

::: tip
💡 Fíjate en el uso de `std::optional`: `buscarPorId` devuelve "no encontrado" de forma explícita, sin trucos de `-1` ni punteros nulos. Es el C++ moderno que aprendimos.
:::

## 4. Decisiones de diseño
| Decisión | Elección | Por qué |
|---|---|---|
| Contenedor de productos | `std::vector` | Contiguo, rápido de recorrer, ordenable |
| Búsqueda por ID | `std::optional<Producto*>` | Rápida y segura |
| Persistencia | JSON (nlohmann) | Legible, estándar, fácil de depurar |
| Categorías | `enum class` | Seguro y claro |
| Menú | En `main.cpp` | Separa UI de la lógica |
| Copia en filtros | Por valor (`vector`) | Simple y suficiente para este tamaño |
::: warning Advertencia
⚠️ Para un inventario pequeño, `vector` con búsquedas O(n) es perfecto. Si tuviera millones de productos, cambiaríamos a `unordered_map` por ID. Diseñamos para el **caso real**, no para hipotéticos.
:::

## 5. El flujo de interacción

```
Inicio ──► cargar(archivo) ──► menú
                                  │
                     ┌────────────┼────────────┐
                     ▼            ▼            ▼
                  operación   operación    salir
                  (CRUD)      (reporte)
                     │            │
                     └────┬───────┘
                          ▼
                   guardar(archivo)
                          ▼
                       Fin
```

El menú ofrece opciones y el programa se repite hasta que el usuario elige "Salir", momento en el que **guarda** el inventario.

## 6. Diagrama de clases en detalle

```
┌─────────────── Producto ───────────────┐
│ - id: uint32_t                         │
│ - nombre: string                       │
│ - categoria: Categoria                 │
│ - cantidad: int                        │
│ - precio: double                       │
└────────────────────────────────────────┘

┌─────────────── Inventario ─────────────┐
│ - productos: vector<Producto>          │
│ - siguienteId: uint32_t                │
├────────────────────────────────────────┤
│ + agregar(...): Producto&              │
│ + eliminar(id): bool                   │
│ + buscarPorId(id): optional<Producto*> │
│ + modificarPrecio(id, precio): bool    │
│ + modificarCantidad(id, cant): bool    │
│ + buscarPorNombre(texto): vector       │
│ + filtrarPorCategoria(cat): vector     │
│ + filtrarPorPrecio(min, max): vector   │
│ + valorTotal(): double                 │
│ + agotados(): vector                   │
│ + masCaros(n): vector                  │
│ + guardar(archivo): void               │
│ + cargar(archivo): void                │
│ + tamano(): size_t                     │
└────────────────────────────────────────┘
```

## 7. Buenas prácticas

- **Diseña antes de codificar**: este capítulo es el plano.
- Separa **UI** (menú) de **lógica de negocio** (Inventario) y **datos** (Producto).
- Usa `std::optional` para "no encontrado".
- Diseña para el **caso real**, no para hipotéticos.
- Mantén la API mínima: solo lo que el proyecto necesita.

## 8. Resumen rápido

- Tres componentes: **Producto** (datos), **Inventario** (lógica), **JSON** (persistencia).
- `main.cpp` solo orquesta el menú.
- `std::vector` como contenedor principal.
- `std::optional<Producto*>` para búsquedas.
- `enum class` para categorías.
- Persistencia en JSON (nlohmann).
- Diseña para el caso real y separa responsabilidades.

El diseño está listo. En el siguiente capítulo escribiremos el código **paso a paso**, de menos a más, verificando que todo compile en cada etapa.
