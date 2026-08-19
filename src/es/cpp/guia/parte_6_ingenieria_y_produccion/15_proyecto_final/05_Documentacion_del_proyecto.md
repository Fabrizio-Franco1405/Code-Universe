---
outline: [2, 3]
---

# Documentación del proyecto

Un proyecto sin documentación es como un mapa sin leyenda: solo lo entiende quien lo hizo. La documentación profesional permite que **cualquiera** (tu yo del futuro incluido) pueda compilar, usar y ampliar el proyecto en minutos.

En este capítulo documentaremos el sistema de inventario: README, comentarios en el código y la documentación de la API.

## 1. El README: La puerta de entrada

Todo proyecto profesional empieza con un **README** claro. Lo mínimo indispensable:

```markdown
# Sistema de Gestión de Inventario

Aplicación de consola para gestionar un inventario de productos,
desarrollada como proyecto final de la guía de C++ moderno.

## Requisitos

- Compilador C++20 (GCC, Clang o MSVC)
- CMake 3.16 o superior
- nlohmann/json (se instala con vcpkg/Conan)

## Compilación

```

bash
cmake -B build -S .
cmake --build build
./build/inventario

```<h2 id="uso" tabindex="-1">Uso <a class="header-anchor" href="#uso" aria-label="Permalink to “Uso”">​</a></h2><p>Al ejecutar, aparece un menú interactivo con las operaciones disponibles (añadir, eliminar, buscar, filtrar, reportes).</p><h2 id="tests" tabindex="-1">Tests <a class="header-anchor" href="#tests" aria-label="Permalink to “Tests”">​</a></h2>```

bash
cmake -B build -S . -DBUILD_TESTING=ON
ctest --test-dir build --output-on-failure

```<h2 id="estructura" tabindex="-1">Estructura <a class="header-anchor" href="#estructura" aria-label="Permalink to “Estructura”">​</a></h2>```

include/inventario/  Headers públicos
src/                 Implementación
tests/               Pruebas (doctest)

```<h2 id="licencia" tabindex="-1">Licencia <a class="header-anchor" href="#licencia" aria-label="Permalink to “Licencia”">​</a></h2><p>MIT</p>```

:::tip
💡 El README debe responder tres preguntas en 30 segundos: **¿qué es?, ¿cómo se compila?, ¿cómo se usa?** Todo lo demás puede ir después.
:::

## 2. Documentar con Doxygen

**Doxygen** genera documentación automática a partir de comentarios especiales. Es el estándar de facto en C++:

```cpp
/**
 * @brief Representa un producto del inventario.
 *
 * Contiene los datos de un producto y su categoría.
 */
struct Producto {
    uint32_t id;           ///< Identificador único
    std::string nombre;    ///< Nombre del producto
    Categoria categoria;   ///< Categoría (Electronica, Hogar...)
    int cantidad;          ///< Unidades en stock
    double precio;         ///< Precio unitario
};

/**
 * @brief Agrega un producto al inventario.
 *
 * @param nombre   Nombre del producto.
 * @param cat      Categoría del producto.
 * @param cantidad Unidades a agregar.
 * @param precio   Precio unitario.
 * @return Referencia al producto recién agregado.
 */
Producto &agregar(const std::string &nombre, Categoria cat,
                  int cantidad, double precio);
```

```bash
# Genera la documentación HTML
doxygen Doxyfile
# → docs/html/index.html
```

## 3. Doxygen en C++ moderno

Doxygen soporta las sintaxis modernas de C++ (concepts, lambdas, `auto`). Un ejemplo con `std::optional`:

```cpp
/**
 * @brief Busca un producto por su ID.
 *
 * @param id Identificador del producto.
 * @return El producto si existe, o `std::nullopt` si no.
 *
 * @code
 * auto p = inv.buscarPorId(42);
 * if (p) { std::cout << (*p)->nombre; }
 * @endcode
 */
std::optional<Producto *> buscarPorId(uint32_t id);
```

## 4. Comentarios: Cantidad correcta

Los comentarios no son un premio: son un **recurso**. La regla profesional:
| Situación | Comentario |
|---|---|
| **El porqué** (motivo de una decisión) | Sí, imprescindible |
| **El qué** (qué hace el código) | No: el código lo dice |
| **El cómo** (cómo lo hace) | Solo si no es obvio |
| Algoritmos complejos | Sí, resume la lógica |

```cpp
// No: el código ya dice esto
// Incrementa i de 0 a n
for (int i = 0; i < n; i++) { ... }

// Sí: explica la decisión no obvia
// Se guarda en la caché porque fibonacci se repite mucho
static std::unordered_map<int, long long> cache;
```

::: warning Advertencia
⚠️ Un comentario **mentiroso** (que ya no coincide con el código) es peor que ningún comentario. Mantén los comentarios sincronizados al refactorizar.
:::

## 5. Documentar la API con auto-documentación

Además de Doxygen, el **código mismo** documenta si eliges bien los nombres:

```cpp
// Mal: nombres genéricos que obligan a comentar
void proc(Producto &p, int a, double b);

// Bien: los nombres son auto-documentados
void aplicarDescuento(Producto &producto, int porcentaje);
```

```cpp
// La API pública con nombres claros se explica sola
Inventario inv;
inv.agregar("Laptop", Categoria::Electronica, 5, 899.99);
auto agotados = inv.agotados();
double total = inv.valorTotal();
```

## 6. La documentación del sistema

Para el inventario, documenta también **decisiones de diseño**:

```markdown
## Decisiones de diseño

- **`std::vector`** como contenedor: contiguo y rápido para recorrer.
  Si el inventario creciera a millones de elementos, se cambiaría
  a `unordered_map` por ID.

- **`std::optional`** para búsquedas: evita valores centinela (-1)
  y expresa la ausencia de forma explícita.

- **nlohmann/json** para persistencia: header-only y legible.
```

::: info Nota
ℹ️ Documentar las decisiones (*por qué* se hizo así) es lo más valioso que puedes dejar. Los futuros mantenedores (tú incluido) te lo agradecerán.
:::

## 7. La estructura de documentación final

```
inventario/
├── README.md          ← qué es, compilar, usar
├── LICENSE            ← MIT (u otra licencia)
├── docs/              ← Doxygen generado
│   └── html/
├── include/
│   └── inventario/
│       ├── producto.hpp      ← comentarios Doxygen
│       └── inventario.hpp    ← comentarios Doxygen
└── ...
```

## 8. Buenas prácticas

- Escribe el README **primero** (antes incluso del código), y actualízalo.
- Comenta el **porqué**, no el obvio.
- Usa **Doxygen** (`/** @brief ... */`) para la API pública.
- Nombres claros = auto-documentación.
- Documenta las **decisiones de diseño** y sus motivos.
- Mantén los comentarios **sincronizados** con el código.

## 9. Resumen rápido

- El **README** responde: ¿qué es?, ¿cómo compilo?, ¿cómo uso?
- **Doxygen** genera la documentación de la API desde comentarios.
- Comenta el **porqué**, no el qué.
- Los comentarios mentirosos son peores que ninguno.
- Nombres claros documentan mejor que cualquier comentario.
- Documenta las decisiones de diseño y añade una licencia.

El proyecto está documentado. En el último capítulo cerramos la guía con el **despliegue**: cómo entregar tu proyecto al mundo.
