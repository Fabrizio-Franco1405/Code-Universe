---
outline: [2, 3]
---

# Implementación paso a paso

El diseño ya está en el papel: tenemos el plano de la casa, las clases definidas
y cada componente con su responsabilidad. Ahora llega el momento de **escribir el
código**, pero ojo, no cualquier código: código escrito con método, de menos a más,
compilando y verificando en cada etapa. Nada de sentarse a escribir quinientas
líneas a ciegas para descubrir al final que nada compila y no saber por dónde
empezar a corregir.

La idea acá es construir el proyecto como se sube una escalera: **un peldaño a la
vez**, comprobando que cada uno aguanta nuestro peso antes de subir el siguiente.
Si un paso se rompe, sabremos exactamente cuál fue, porque el anterior ya quedó
verificado. Es la diferencia entre un error que se arregla en cinco minutos y uno
que te roba una tarde entera.

## 1. Paso 0: El esqueleto que compila

Todo proyecto empieza por su estructura. Acá no buscamos funcionalidad todavía,
solo un **esqueleto mínimo** que compile sin errores. Es la base sobre la que iremos
apoyando cada pieza, así que no escatimes en este paso: si el esqueleto no compila,
nada de lo demás tiene sentido.

Crea la estructura de directorios y un `CMakeLists.txt` mínimo:

```cmake
# CMakeLists.txt
cmake_minimum_required(VERSION 3.16)
project(inventario LANGUAGES CXX)

add_subdirectory(src)
```

```cmake
# src/CMakeLists.txt
add_executable(inventario main.cpp)

target_compile_features(inventario PRIVATE cxx_std_20)
```

```cpp
// src/main.cpp
int main() {
    return 0;
}
```

Fíjate que el `main` por ahora no hace absolutamente nada: solo existe para que el
proyecto tenga un punto de entrada y podamos compilarlo de punta a punta. Es como
encender la luz de una casa antes de amueblarla: verificamos que la instalación
eléctrica funciona.

Compila y verifica que todo funciona antes de seguir:

```bash
cmake -B build -S .
cmake --build build
```

::: tip
💡 Si este primer build falla, revisa primero tu versión de CMake y que el
compilador que tienes configurado soporte C++20. Es mejor resolver esto ahora,
con un proyecto vacío, que en medio de la implementación.
:::

## 2. Paso 1: La clase Producto

Con el esqueleto en pie, empezamos por la pieza más básica: la clase **Producto**.
La elegimos primero porque es el **dato puro**, sin lógica que lo complique. Es lo
más simple del sistema, y empezar por lo simple nos da confianza y un punto de
referencia para los pasos siguientes.

Crea `include/inventario/producto.hpp` y `src/producto.cpp`:

```cpp
// src/producto.cpp
#include "inventario/producto.hpp"
#include <stdexcept>
using namespace inventario;

std::string inventario::categoriaAString(Categoria c) {
    switch (c) {
        case Categoria::Electronica: return "Electronica";
        case Categoria::Hogar:       return "Hogar";
        case Categoria::Ropa:        return "Ropa";
        case Categoria::Alimento:    return "Alimento";
        case Categoria::Otro:        return "Otro";
    }
    return "Otro";
}

Categoria inventario::stringACategoria(const std::string &s) {
    if (s == "Electronica") return Categoria::Electronica;
    if (s == "Hogar")       return Categoria::Hogar;
    if (s == "Ropa")        return Categoria::Ropa;
    if (s == "Alimento")    return Categoria::Alimento;
    return Categoria::Otro;
}
```

Acá vemos dos funciones que se encargan de **traducir** entre las categorías y su
representación como texto. La primera pasa de `Categoria` a `std::string`, la
segunda hace el camino inverso. Son pequeñas, pero cumplen un papel fundamental:
nos permiten guardar y leer categorías como texto legible (por ejemplo, en el
archivo JSON) sin perder el tipo seguro que nos da `enum class`.

::: tip
💡 Actualiza `src/CMakeLists.txt` añadiendo `producto.cpp` a los fuentes del
ejecutable. Recuerda: compila y verifica tras cada paso.
:::

## 3. Paso 2: La clase Inventario (CRUD)

Ahora sí, la lógica de negocio. La clase **Inventario** es el corazón del sistema,
y acá empezamos por su parte esencial: las operaciones **CRUD** —*Create, Read,
Update, Delete*—, es decir, agregar, eliminar y buscar productos. Todo lo demás
que haga el sistema girará alrededor de estas operaciones.

```cpp
// src/inventario.cpp
#include "inventario/inventario.hpp"
#include <algorithm>
using namespace inventario;

Producto &Inventario::agregar(const std::string &nombre, Categoria cat,
                              int cantidad, double precio) {
    productos.push_back({siguienteId++, nombre, cat, cantidad, precio});
    return productos.back();
}

bool Inventario::eliminar(uint32_t id) {
    auto it = std::find_if(productos.begin(), productos.end(),
        [id](const Producto &p) { return p.id == id; });

    if (it == productos.end()) return false;
    productos.erase(it);
    return true;
}

std::optional<Producto *> Inventario::buscarPorId(uint32_t id) {
    auto it = std::find_if(productos.begin(), productos.end(),
        [id](const Producto &p) { return p.id == id; });

    if (it == productos.end()) return std::nullopt;
    return &*it;
}
```

Fíjate en dos detalles que ya conoces de capítulos anteriores y que brillan acá:

- `siguienteId++` asigna un **ID único automático** a cada producto. Nosotros no
  elegimos el ID; el sistema lo hace por nosotros, evitando duplicados.
- `std::find_if` con una **lambda** busca el producto cuyo `id` coincida. Si no lo
  encuentra, `eliminar` devuelve `false` y `buscarPorId` devuelve `std::nullopt`,
  justo para lo que diseñamos `std::optional<Producto*>`: distinguir "encontrado"
  de "no existe" sin ambigüedades.

## 4. Paso 3: Búsquedas y filtros con lambdas

Una vez que el CRUD funciona, pasamos a las búsquedas y filtros. Acá ya no
buscamos por un ID exacto, sino que devolvemos **listas** de productos que
cumplen una condición: que su nombre contenga un texto, que pertenezcan a una
categoría, que estén dentro de un rango de precios.

Las búsquedas se hacen con lambdas y `copy_if`, como vimos en la STL:

```cpp
std::vector<Producto> Inventario::buscarPorNombre(const std::string &texto) const {
    std::vector<Producto> resultado;

    std::copy_if(productos.begin(), productos.end(), std::back_inserter(resultado),
        [&](const Producto &p) {
            return p.nombre.find(texto) != std::string::npos;
        });

    return resultado;
}

std::vector<Producto> Inventario::filtrarPorCategoria(Categoria c) const {
    std::vector<Producto> resultado;

    std::copy_if(productos.begin(), productos.end(), std::back_inserter(resultado),
        [c](const Producto &p) { return p.categoria == c; });

    return resultado;
}

std::vector<Producto> Inventario::filtrarPorPrecio(double minimo, double maximo) const {
    std::vector<Producto> resultado;

    std::copy_if(productos.begin(), productos.end(), std::back_inserter(resultado),
        [=](const Producto &p) {
            return p.precio >= minimo && p.precio <= maximo;
        });

    return resultado;
}
```

Observa cómo el patrón se repite: `copy_if` recorre todos los productos, y por
cada uno pregunta a la lambda "¿cumples la condición?". Si la respuesta es sí, lo
copia al resultado. La condición cambia en cada función, pero la estructura es la
misma. Eso es exactamente el poder de las lambdas: encapsular una pequeña regla y
pasarla como argumento.

::: info Nota
ℹ️ `std::back_inserter` añade los elementos al vector de resultado sin conocer su
tamaño de antemano. Es la herramienta perfecta para filtros: no necesitamos
calcular cuántos productos coincidirán, simplemente dejamos que el resultado
crezca solo.
:::

## 5. Paso 4: Reportes

Con las búsquedas listas, vamos por los **reportes**: los cálculos y listados que
dan valor al inventario. Acá el sistema empieza a "pensar", a decirnos cosas que
no son obvias con solo mirar la lista de productos.

```cpp
double Inventario::valorTotal() const {
    double total = 0.0;
    for (const auto &p : productos) {
        total += p.precio * p.cantidad;
    }
    return total;
}

std::vector<Producto> Inventario::agotados() const {
    std::vector<Producto> resultado;

    std::copy_if(productos.begin(), productos.end(), std::back_inserter(resultado),
        [](const Producto &p) { return p.cantidad == 0; });

    return resultado;
}

std::vector<Producto> Inventario::masCaros(int n) const {
    std::vector<Producto> copia = productos;

    std::sort(copia.begin(), copia.end(),
        [](const Producto &a, const Producto &b) { return a.precio > b.precio; });

    if (static_cast<size_t>(n) >= copia.size()) return copia;
    copia.resize(n);
    return copia;
}
```

Tres reportes con tres enfoques distintos:

- `valorTotal` recorre el vector con un bucle simple y suma `precio * cantidad`.
- `agotados` vuelve a usar `copy_if` con una lambda que detecta cantidad cero.
- `masCaros` es el más interesante: **copia** el vector, lo ordena de mayor a
  menor precio con `std::sort` y luego lo recorta al tamaño pedido. Fíjate que
  trabajamos sobre una copia: no queremos modificar el orden original del
  inventario solo para generar un reporte.

## 6. Paso 5: El menú principal

Ya tenemos toda la lógica. Ahora falta la **cara del sistema**: el menú
interactivo que permite a una persona usar el inventario sin escribir código. Acá
es donde la UI y la lógica se encuentran, y lo mejor es que están bien separadas:
el menú solo llama a las funciones de `Inventario`, sin meterse en cómo se
implementan.

Con la lógica lista, creamos el menú interactivo:

```cpp
// src/main.cpp
#include "inventario/inventario.hpp"
#include <iostream>
using namespace inventario;
using namespace std;

void mostrarMenu() {
    cout << "\n=== GESTIÓN DE INVENTARIO ===\n";
    cout << "1. Añadir producto\n";
    cout << "2. Eliminar producto\n";
    cout << "3. Buscar por nombre\n";
    cout << "4. Filtrar por categoría\n";
    cout << "5. Listar por precio (reporte)\n";
    cout << "6. Valor total del inventario\n";
    cout << "7. Productos agotados\n";
    cout << "0. Salir\n";
    cout << "Opción: ";
}

int main() {
    Inventario inv;
    int opcion = -1;

    while (opcion != 0) {
        mostrarMenu();
        cin >> opcion;

        switch (opcion) {
            case 1: {
                string nombre; int cant; double precio;
                cout << "Nombre: "; cin >> nombre;
                cout << "Cantidad: "; cin >> cant;
                cout << "Precio: "; cin >> precio;
                inv.agregar(nombre, Categoria::Otro, cant, precio);
                cout << "Añadido correctamente.\n";
                break;
            }
            case 2: {
                uint32_t id;
                cout << "ID a eliminar: "; cin >> id;
                if (inv.eliminar(id)) cout << "Eliminado.\n";
                else cout << "No existe ese ID.\n";
                break;
            }
            // ... resto de opciones ...
            case 0:
                cout << "¡Hasta luego!\n";
                break;
            default:
                cout << "Opción inválida.\n";
        }
    }

    return 0;
}
```

El patrón del menú es sencillo y poderoso: un bucle `while` que se repite hasta
que el usuario elige la opción `0`, un `switch` que ejecuta la acción pedida, y un
`default` para atrapar opciones inválidas sin romper el programa. Es un bucle que
nunca termina por accidente, sino cuando el usuario lo decide.

::: warning Advertencia
⚠️ Los filtros y reportes devuelven **copias** (`vector` por valor). Para este
tamaño es correcto y simple. Si el inventario fuera enorme, cambiaríamos a
devolver vistas o IDs.
:::

## 7. Paso 6: La persistencia JSON

El último paso de la implementación es la **persistencia**: que el inventario
sobreviva al cierre del programa. Sin esto, cada vez que cerramos la aplicación
perdemos todo lo que añadimos. La guardamos para el final a propósito: cuando no
hay datos que guardar, no hay JSON que valga la pena escribir.

Con la librería **nlohmann/json** (que instalamos en el capítulo de sistemas de
construcción):

```cpp
// src/json.cpp
#include "inventario/producto.hpp"
#include <nlohmann/json.hpp>
#include <fstream>
using namespace inventario;
using json = nlohmann::json;

json productoAJson(const Producto &p) {
    return json{
        {"id", p.id},
        {"nombre", p.nombre},
        {"categoria", categoriaAString(p.categoria)},
        {"cantidad", p.cantidad},
        {"precio", p.precio}
    };
}

void guardarInventario(const std::vector<Producto> &productos, const std::string &archivo) {
    json j = json::array();
    for (const auto &p : productos) j.push_back(productoAJson(p));

    std::ofstream salida(archivo);
    salida << j.dump(2); // 2 = indentación legible
}
```

`productoAJson` convierte un `Producto` a un objeto JSON, y `guardarInventario`
recorre todos los productos construyendo un arreglo. Acá se nota el trabajo de los
pasos anteriores: `categoriaAString`, que creamos en el paso 1, es justo lo que
necesitamos para guardar la categoría como texto legible.

```cmake
# src/CMakeLists.txt
find_package(nlohmann_json CONFIG REQUIRED)

target_link_libraries(inventario PRIVATE nlohmann_json::nlohmann_json)
```

## 8. La secuencia de implementación en resumen

| Paso | Qué haces | Verificación |
|---|---|---|
| 0 | Esqueleto que compila | `cmake --build build` |
| 1 | Clase `Producto` | Compila |
| 2 | Inventario: CRUD | Compila + prueba manual |
| 3 | Búsquedas y filtros | Compila + prueba |
| 4 | Reportes | Compila + prueba |
| 5 | Menú principal | Funciona end-to-end |
| 6 | Persistencia JSON | Guardar/cargar funciona |

## 9. Buenas prácticas

- **Compila tras cada paso**: los errores se corrigen en 5 minutos ahora, no en 5
  horas al final.
- Empieza por los **datos** y termina por la **UI**.
- Añade los reportes **después** de que el CRUD funcione.
- Usa el menú para probar cada función manualmente.
- Deja la persistencia para el final: sin datos que guardar, no hay JSON.

## 10. Resumen rápido

- Sube por peldaños: esqueleto → Producto → CRUD → filtros → reportes → menú →
  JSON.
- Compila y verifica **en cada paso**.
- Lambdas + `copy_if` para filtros; `sort` para reportes.
- `std::optional` para búsquedas; `nlohmann_json` para persistencia.
- El menú es la capa de presentación, separada de la lógica.
- La persistencia llega al final, cuando hay datos que guardar.

La implementación base está lista. En el siguiente capítulo añadiremos las
**pruebas**: cómo verificar que todo lo que acabamos de escribir funciona de
verdad, y no solo en el camino feliz.