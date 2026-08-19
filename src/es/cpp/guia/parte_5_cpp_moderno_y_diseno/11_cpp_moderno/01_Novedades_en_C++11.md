---
outline: [2, 3]
---

# Novedades en C++11

Si hay un momento que marcó un antes y un después en la historia de C++, fue el año **2011**. Tras más de una década de "sequía" (el último estándar era de 1998), C++11 llegó con una revolución: tantos cambios que a este nuevo estilo se le bautizó como **C++ moderno**, en contraposición al C++ clásico.

De hecho, casi todo lo que has aprendido en esta guía es C++ moderno. Este capítulo es un recorrido por las novedades más importantes de C++11, ese año que reinventó el lenguaje.

## 1. `auto`: El compilador deduce los tipos

En lugar de escribir el tipo completo, deja que el compilador lo deduzca:

```cpp
// Antes (C++ clásico)
vector<int>::iterator it = v.begin();

// Después (C++11)
auto it = v.begin();
```

::: tip
💡 `auto` no es "no tener tipo": el compilador deduce el tipo exacto en compilación. Es igual de seguro y mucho más legible.
:::

## 2. Smart pointers: punteros inteligentes

Adiós a gestionar `new`/`delete` a mano. C++11 trajo los punteros inteligentes que estudiamos en memoria:

```cpp
#include <memory>
using namespace std;

unique_ptr<int> a = make_unique<int>(42);
shared_ptr<int> b = make_shared<int>(100);
```

Nunca más fugas de memoria por olvidar un `delete`. Esta fue una de las mayores victorias de C++11.

## 3. `nullptr`: El puntero nulo correcto

En el C++ clásico, el puntero nulo era `NULL` o `0`. Con `nullptr` (C++11) tenemos un tipo propio y seguro:

```cpp
int *p = nullptr; // Claro y seguro
if (p == nullptr) { /* ... */ }
```

::: info Nota
ℹ️ `NULL` en realidad es un entero `0`, lo que causaba ambigüedades en sobrecargas. `nullptr` es un valor de puntero puro y resuelve el problema.
:::

## 4. Lambdas: Funciones anónimas

Las funciones anónimas que vimos en la STL nacieron en C++11:

```cpp
#include <vector>
#include <algorithm>
using namespace std;

vector<int> v = {5, 2, 8, 1};
sort(v.begin(), v.end(), [](int a, int b) { return a < b; });
```

## 5. Range-based for: recorrer sin índices

Recorrer contenedores sin gestionar índices ni iteradores manualmente:

```cpp
vector<int> numeros = {1, 2, 3, 4, 5};

for (int n : numeros) {
    cout << n << " ";
}
```

## 6. `constexpr`: Cálculo en tiempo de compilación

La palabra clave `constexpr` permite que ciertas funciones y variables se calculen en **tiempo de compilación**, no de ejecución:

```cpp
constexpr int factorial(int n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}

int main() {
    constexpr int resultado = factorial(5); // 120 (calculado al compilar)
    return 0;
}
```

::: tip
💡 Si el compilador puede calcularlo en compilación, lo hace: cero coste en ejecución. Es una optimización automática y elegante.
:::

## 7. Semántica de movimiento y rvalue references

La gran innovación de rendimiento: mover en lugar de copiar objetos grandes. Ya la estudiamos en POO:

```cpp
vector<int> origen = {1, 2, 3};
vector<int> destino = move(origen); // Sin copias
```

## 8. `std::thread`: Hilos en la biblioteca estándar

Antes de C++11, la concurrencia dependía de librerías externas. Desde C++11, los hilos son parte del estándar:

```cpp
#include <thread>
using namespace std;

int main() {
    thread t([]() { cout << "¡Hola desde un hilo!" << endl; });
    t.join();
    return 0;
}
```

## 9. Otros añadidos importantes
| Novedad | Descripción |
|---|---|
| `override` / `final` | Marcar sobrescrituras en POO |
| `enum class` | Enumeraciones seguras |
| `= delete` / `= default` | Controlar funciones especiales |
| `std::array` | Arreglo con las ventajas de la STL |
| `std::tuple` | Agrupación de valores |
| `std::unordered_map` | Tablas hash |
| `std::function` | Guardar cualquier función |
| Initializer lists | `{1, 2, 3}` para inicializar contenedores |

```cpp
// Initializer lists: inicialización con llaves
vector<int> v = {1, 2, 3, 4};
map<string, int> m = {{"Ana", 25}, {"Carlos", 30}};
```

## 10. ¿Por qué fue tan importante?

C++11 no solo añadió funciones: cambió la **forma de escribir C++**. Con smart pointers, lambdas, `auto` y la semántica de movimiento, el lenguaje se volvió:

- **Más seguro** (menos fugas, menos punteros nulos).
- **Más expresivo** (menos código repetido).
- **Más eficiente** (movimiento, constexpr).
- **Más moderno** (hilos en el estándar).

::: info Nota
ℹ️ Si ves un código "antiguo" con `new`, `delete`, `NULL` y bucles con índices por todas partes, estás viendo C++ clásico. El C++ moderno lo hace de otra forma.
:::

## 11. Resumen rápido

- `auto` deduce tipos; `nullptr` es el puntero nulo seguro.
- Smart pointers y semántica de movimiento eliminan fugas.
- Las lambdas hacen el código conciso.
- `range-based for` y initializer lists simplifican el recorrido.
- `constexpr` calcula en tiempo de compilación.
- `std::thread` lleva la concurrencia al estándar.
- C++11 marcó el nacimiento del **C++ moderno**.

C++11 fue el gran despertar. En el siguiente capítulo veremos cómo **C++14** lo refinó y pulió con mejoras que hacen la vida más fácil.
