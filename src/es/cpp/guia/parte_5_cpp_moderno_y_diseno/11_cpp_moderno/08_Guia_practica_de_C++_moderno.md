---
outline: [2, 3]
---

# Guía práctica de C++ moderno

A lo largo de este módulo hemos visto cada estándar por separado: C++11, 14, 17, 20 y 23. Ahora es momento de **unirlo todo**: una guía práctica con las reglas y herramientas que debes aplicar en tu código real, mezclando lo mejor de cada versión.

## 1. Las herramientas imprescindibles del C++ moderno
| Herramienta | Estándar | Uso |
|---|---|---|
| `auto` | C++11 | Deducción de tipos |
| Smart pointers | C++11 | `unique_ptr`, `shared_ptr` |
| Lambdas | C++11 | Funciones anónimas |
| `constexpr` | C++11 | Cálculo en compilación |
| `auto` en retorno | C++14 | Funciones con retorno deducido |
| Lambdas genéricas | C++14 | Parámetros `auto` |
| Structured bindings | C++17 | `auto [a, b] = ...` |
| `std::optional` | C++17 | Valor que puede faltar |
| `std::string_view` | C++17 | Leer strings sin copiar |
| `if` con inicializador | C++17 | Variables locales al `if` |
| `std::filesystem` | C++17 | Archivos y directorios |
| Concepts | C++20 | Restricciones de plantillas |
| Ranges | C++20 | Algoritmos componibles |
| `std::format` | C++20 | Formateo moderno |
| `std::print` | C++23 | Impresión con formato |
## 2. El estilo moderno: de C++ clásico a moderno

La mejor forma de entender el C++ moderno es ver la **evolución del mismo código**:

```cpp
// ─── C++ clásico ───
int *ptr = new int(42);
vector<int> v;
for (int i = 0; i < 10; i++) v.push_back(i * i);
delete ptr;

// ─── C++ moderno ───
auto ptr = make_unique<int>(42);         // Sin new/delete
vector<int> v;
for (int i : views::iota(0, 10)) {       // Ranges (C++20)
    v.push_back(i * i);
}
```

## 3. Regla de oro: Smart pointers y RAII

Nunca uses `new` y `delete` a mano en código nuevo:

```cpp
// Mal: gestión manual (fugaz y peligroso)
int *p = new int(5);
// ... olvidé el delete
delete p;

// Bien: RAII con punteros inteligentes
auto p = make_unique<int>(5); // Se libera solo al salir del ámbito
```

::: tip
💡 Si en tu código aparece `new` o `delete` manual, casi siempre hay una forma moderna mejor: `make_unique`, `make_shared`, `make_optional`, contenedores de la STL...
:::

## 4. Prefiere `std::string_view` y `std::span` para lectura

Para funciones que solo **leen** datos, no copies innecesariamente:

```cpp
#include <iostream>
#include <string_view>
#include <span>
using namespace std;

void procesarTexto(string_view texto) {   // Sin copiar
    cout << "Texto: " << texto << endl;
}

void sumarElementos(span<const int> datos) { // Sin copiar
    int total = 0;
    for (int d : datos) total += d;
    cout << "Suma: " << total << endl;
}

int main() {
    procesarTexto("hola mundo");
    int arr[] = {1, 2, 3};
    sumarElementos(arr);
    return 0;
}
```

## 5. Usa `std::optional` para "tal vez hay valor"

Evita los trucos del pasado (`-1`, `nullptr`, `false`) como indicadores de ausencia:

```cpp
// Mal: el -1 es "secreto" y confuso
int buscar(int objetivo, const vector<int> &v) {
    for (int x : v) if (x == objetivo) return x;
    return -1;
}

// Bien: el tipo expresa la posibilidad de ausencia
optional<int> buscar(int objetivo, const vector<int> &v) {
    for (int x : v) if (x == objetivo) return x;
    return nullopt;
}
```

## 6. El patrón del `if` con inicializador y bindings

Combina las novedades de C++17 para código más limpio:

```cpp
#include <iostream>
#include <map>
using namespace std;

int main() {
    map<string, int> datos;

    // Todo en una línea: insertar, comprobar y usar
    if (auto [it, exito] = datos.insert({"clave", 42}); exito) {
        cout << "Insertado con valor " << it->second << endl;
    } else {
        cout << "Ya existía con valor " << it->second << endl;
    }

    return 0;
}
```

## 7. Comparaciones: `<=>` y `= default`

Con C++20, comparar estructuras es una línea:

```cpp
#include <compare>
#include <iostream>
using namespace std;

struct Punto {
    int x, y;
    auto operator<=>(const Punto &) const = default;
};

int main() {
    Punto a{1, 2}, b{1, 3};
    cout << (a == b) << endl;   // 0
    cout << (a < b) << endl;    // 1 (true)
    cout << (b >= a) << endl;   // 1
    return 0;
}
```

## 8. Tabla: Cuándo usar cada herramienta
| Situación | Herramienta moderna |
|---|---|
| Quiero un valor que puede faltar | `std::optional` |
| Quiero un valor de varios tipos | `std::variant` |
| Una función que devuelve error | `std::expected` (C++23) |
| Solo quiero leer una cadena | `std::string_view` |
| Solo quiero leer un arreglo | `std::span` |
| Recorrer en paralelo dos colecciones | `views::zip` (C++23) |
| Filtrar/transformar datos | ranges (C++20) |
| Formatear texto | `std::format` / `std::print` |
| Gestionar memoria | smart pointers |
| Requisitos de plantillas | concepts |
## 9. Buenas prácticas

- Usa **C++ moderno siempre**: elige la versión más reciente que tu compilador soporte.
- No mezcles estilos antiguos y modernos en el mismo código sin motivo.
- Prefiere **RAII** sobre gestión manual de recursos.
- Usa `auto` para tipos largos, pero **no lo abuses** donde el tipo aporta claridad.
- Compila con los flags de advertencia y el estándar más reciente:

```bash
g++ -std=c++23 -Wall -Wextra main.cpp -o programa
```

## 10. Resumen rápido

- Cada estándar añadió herramientas: C++11 (revolución), 14 (pulido), 17 (comodidad), 20 (concepts/ranges), 23 (expected/print).
- El C++ moderno prefiere RAII, `auto`, lambdas y smart pointers.
- `optional`, `variant`, `expected` expresan casos de uso sin trucos.
- `string_view` y `span` leen sin copiar.
- Aplica las herramientas según la situación, no por moda.

Con el C++ moderno dominado, llega la última pieza del módulo de diseño: los **patrones de diseño**, esas soluciones probadas que usarás en cada proyecto profesional.
