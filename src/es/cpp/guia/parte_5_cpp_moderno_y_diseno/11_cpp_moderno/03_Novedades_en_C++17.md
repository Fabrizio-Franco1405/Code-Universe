---
outline: [2, 3]
---

# Novedades en C++17

Tres años después de C++14, llegó **C++17** (2017): un estándar con muchas novedades prácticas y centrado en simplificar el código cotidiano. Si C++11 fue la revolución y C++14 el pulido, **C++17 fue la comodidad**: resolver problemas comunes con la sintaxis más elegante posible.

## 1. Structured bindings: desempaquetar en una línea

La joya más vistosa de C++17: puedes **descomponer** un contenedor, tupla o struct en variables directamente:

```cpp
#include <iostream>
#include <map>
using namespace std;

int main() {
    map<string, int> edades = {{"Ana", 25}, {"Carlos", 30}};

    // Antes: iterador + first/second
    for (auto it = edades.begin(); it != edades.end(); it++) {
        cout << it->first << " tiene " << it->second << " años" << endl;
    }

    // C++17: structured bindings
    for (const auto &[nombre, edad] : edades) {
        cout << nombre << " tiene " << edad << " años" << endl;
    }

    // También con tuplas
    auto [x, y] = pair<int, int>{3, 4};
    cout << "x=" << x << " y=" << y << endl;

    return 0;
}
```

::: tip
💡 Los structured bindings eliminan el código repetitivo de `first`/`second` y de destrozar tuplas a mano. El estilo del mapa `for (const auto &[clave, valor])` es C++17 puro.
:::

## 2. `std::optional`: un valor que puede faltar

Cuántas veces has usado `-1` o `nullptr` para indicar "no hay resultado". `std::optional<T>` representa explícitamente **"hay valor o no hay valor"**:

```cpp
#include <iostream>
#include <optional>
using namespace std;

optional<int> buscarEnArreglo(int objetivo, const int datos[], size_t n) {
    for (size_t i = 0; i < n; i++) {
        if (datos[i] == objetivo) return datos[i];
    }
    return nullopt; // No hay valor
}

int main() {
    int datos[] = {10, 20, 30, 40};

    optional<int> encontrado = buscarEnArreglo(30, datos, 4);
    if (encontrado.has_value()) {
        cout << "Encontrado: " << *encontrado << endl;
    } else {
        cout << "No existe" << endl;
    }

    // Con valor por defecto si falta
    int seguro = buscarEnArreglo(99, datos, 4).value_or(-1);
    cout << "Seguro: " << seguro << endl; // -1

    return 0;
}
```

::: info Nota
ℹ️ `std::optional` hace el código **auto-documentado**: se ve claramente que el resultado puede no existir, sin trucos como `-1` o punteros nulos.
:::

## 3. `std::variant`: un valor de varios tipos posibles

¿Recuerdas las uniones de C? `std::variant` es la unión **segura y moderna**: guarda un valor de uno de varios tipos, con acceso comprobado:

```cpp
#include <iostream>
#include <variant>
using namespace std;

int main() {
    variant<int, double, string> valor;

    valor = 42;
    cout << "Int: " << get<int>(valor) << endl;

    valor = "hola";
    cout << "String: " << get<string>(valor) << endl;

    // Acceso seguro con visit
    auto imprime = [](auto const &v) { cout << "Valor: " << v << endl; };
    visit(imprime, valor); // Visita el tipo actual

    return 0;
}
```

## 4. `std::string_view`: ver strings sin copiar

En el mundo moderno del rendimiento, `std::string_view` es una **vista** de una cadena: te deja leerla sin copiarla. Perfecto para parámetros de funciones que solo leen:

```cpp
#include <iostream>
#include <string_view>
using namespace std;

// No copia la cadena: solo la observa
void imprimir(string_view texto) {
    cout << texto << endl;
}

int main() {
    string nombre = "Code Universe";
    imprimir(nombre);        // Funciona con string
    imprimir("literal");     // Y con literales
    return 0;
}
```

::: warning Advertencia
⚠️ `string_view` no posee la memoria: debes garantizar que el string original viva más que la vista. Sirve para **leer**, no para guardar para después.
:::

## 5. `if` con inicializador

C++17 permite declarar una variable dentro del propio `if`/`switch`:

```cpp
#include <iostream>
#include <map>
using namespace std;

int main() {
    map<string, int> edades = {{"Ana", 25}};

    // La inserción y la comprobación en una sola línea
    if (auto [it, insertado] = edades.insert({"Ana", 26}); insertado) {
        cout << "Insertado correctamente" << endl;
    } else {
        cout << "Ya existía: " << it->second << endl;
    }

    return 0;
}
```

::: tip
💡 La variable existe solo dentro del `if`/`else`, limitando su alcance y haciendo el código más seguro.
:::

## 6. `std::filesystem` (C++17)

Una librería completa para manejar **archivos y directorios**:

```cpp
#include <iostream>
#include <filesystem>
using namespace std;
namespace fs = filesystem;

int main() {
    fs::path ruta = "documentos/mis-notas.txt";

    cout << "Nombre: " << ruta.filename() << endl;
    cout << "Carpeta: " << ruta.parent_path() << endl;

    // Listar directorio
    for (const auto &entrada : fs::directory_iterator(".")) {
        cout << (entrada.is_directory() ? "[DIR] " : "      ") << entrada.path() << endl;
    }

    return 0;
}
```

## 7. Otras novedades de C++17
| Novedad | Descripción |
|---|---|
| `std::byte` | Byte real para datos binarios |
| `scoped_lock` | Bloquear varios mutex a la vez (concurrencia) |
| `std::invoke` | Invocar funciones y callables |
| Inline variables | Variables compartidas en cabeceras |
| Deducción de guías para `pair`/`tuple` | `pair p(1, "a")` sin tipos |
## 8. Resumen rápido

- **Structured bindings**: `auto [a, b] = ...` descompone valores.
- **`std::optional`**: un valor que puede faltar (`nullopt`).
- **`std::variant`**: unión segura de varios tipos.
- **`std::string_view`**: leer strings sin copiar.
- **`if` con inicializador**: variable local al `if`.
- **`std::filesystem`**: operaciones de archivos en el estándar.

C++17 hizo el C++ moderno aún más cómodo. Y justo cuando parecía completo, llegó la siguiente generación: **C++20**, con conceptos, `std::span` y los `modules`. Es el tema del próximo capítulo.
