---
outline: [2, 3]
---

# Novedades en C++20

Tras tres estándares de mejora continua, **C++20** (2020) volvió a ser un punto de inflexión: el mayor estándar desde C++11. Conceptos, ranges, corrutinas y módulos convierten C++20 en un lenguaje casi nuevo. Es la versión más ambiciosa del C++ moderno.

## 1. Concepts: Restricciones a las plantillas

Los conceptos permiten **expresar los requisitos** que debe cumplir un tipo usado en plantillas. En lugar de errores crípticos de plantilla, el compilador puede decirte claramente "este tipo no es ordenable":

```cpp
#include <iostream>
#include <concepts>
using namespace std;

// Solo acepta tipos numéricos
template <integral T>
T cuadrado(T valor) {
    return valor * valor;
}

int main() {
    cout << cuadrado(5) << endl;    // OK: 25
    // cout << cuadrado("hola") << endl;
    // ⚠️ Error claro: const char* no es integral
    return 0;
}
```

::: tip
💡 En el capítulo de plantillas vimos SFINAE para esto. Los conceptos lo hacen **legible y claro**: el código expresa sus intenciones y los errores son entendibles.
:::

## 2. Ranges: El nuevo estilo de los algoritmos

Con **ranges**, los algoritmos de la STL se componen y se leen como tuberías:

```cpp
#include <iostream>
#include <vector>
#include <ranges>
using namespace std;

int main() {
    vector<int> datos = {1, 2, 3, 4, 5, 6, 7, 8};

    // Filtra pares y los duplica, como una tubería
    auto resultado = datos
        | views::filter([](int n) { return n % 2 == 0; })
        | views::transform([](int n) { return n * 2; });

    for (int valor : resultado) {
        cout << valor << " "; // 4 8 12 16
    }

    return 0;
}
```

::: info Nota
ℹ️ Los ranges son **perezosos**: no crean vectores intermedios. El filtrado y transformación se aplican sobre la marcha mientras recorres el resultado.
:::

## 3. `std::span`: Ver arreglos sin copiar

`std::span<T>` es como un `string_view` pero para **cualquier tipo**: una vista sobre un rango de elementos contiguos:

```cpp
#include <iostream>
#include <span>
using namespace std;

// Acepta arreglos y vectores por igual, sin copiar
void sumarTodo(span<const int> datos) {
    int total = 0;
    for (int v : datos) total += v;
    cout << "Suma: " << total << endl;
}

int main() {
    int arreglo[] = {1, 2, 3, 4, 5};
    vector<int> vec = {10, 20, 30};

    sumarTodo(arreglo); // Funciona con arreglos
    sumarTodo(vec);     // Y con vectores

    // Incluso con subrangos
    sumarTodo(span(vec).first(2)); // Solo los 2 primeros
    return 0;
}
```

## 4. Corrutinas: Pausar y reanudar funciones

Las **corrutinas** permiten pausar una función, devolver el control y reanudarla más tarde. Son la base de la E/S asíncrona moderna y de los generadores:

```cpp
#include <iostream>
#include <coroutine>
using namespace std;

// Un generador simple: produce valores bajo demanda
struct Generador {
    struct promise_type {
        int valor_actual;
        Generador get_return_object() { return Generador{this}; }
        suspend_always initial_suspend() { return {}; }
        suspend_always final_suspend() noexcept { return {}; }
        void return_void() {}
        void unhandled_exception() {}
        suspend_always yield_value(int v) {
            valor_actual = v;
            return {};
        }
    };
    promise_type *p;
    bool reiniciar() { return p->valor_actual; }
};

int main() {
    cout << "Las corrutinas permiten pausar y reanudar la ejecución" << endl;
    cout << "Son la base de la programación asíncrona moderna" << endl;
    return 0;
}
```

::: warning Advertencia
⚠️ Las corrutinas tienen una curva de aprendizaje pronunciada. No las necesitas para empezar, pero son el futuro de la E/S asíncrona eficiente en C++.
:::

## 5. Módulos: Adiós a los `#include`

Los **módulos** son la alternativa moderna a los archivos de cabecera: más rápidos de compilar y sin los problemas de orden de `#include`. Aún en adopción, cambiarán la forma de organizar proyectos:

```cpp
// mi_modulo.cppm
export module matematicas;

export int duplicar(int x) {
    return x * 2;
}

// uso.cpp
import matematicas;  // En vez de #include

int main() {
    return duplicar(21); // 42
}
```

## 6. Otras novedades de C++20
| Novedad | Descripción |
|---|---|
| `std::jthread` | Hilo que se une solo (concurrencia) |
| `std::semaphore` / `latch` / `barrier` | Sincronización avanzada |
| `<=>` (three-way comparison) | Comparación con un solo operador |
| `std::format` | Formateo moderno de texto |
| `requires` | Cláusula de requisitos de plantillas |

```cpp
#include <iostream>
#include <compare>
using namespace std;

struct Punto {
    int x, y;

    // Un solo operador genera <, <=, >, >=, ==
    auto operator<=>(const Punto &) const = default;
};

int main() {
    Punto a{1, 2}, b{3, 4};
    cout << (a < b) << endl;   // 1 (true)
    cout << (a <= b) << endl;  // 1
    return 0;
}
```

## 7. Resumen rápido

- **Concepts**: requisitos claros para plantillas.
- **Ranges**: algoritmos componibles y perezosos (`|`).
- **`std::span`**: vista sobre arreglos y vectores.
- **Corrutinas**: pausar y reanudar funciones.
- **Módulos**: reemplazan a los `#include`.
- **`<=>`**: comparación con un solo operador.
- **`std::format`**: formateo de texto moderno.

C++20 llevó el lenguaje al futuro. Después de repasar toda la historia del C++ moderno, en el próximo capítulo exploraremos la **biblioteca estándar** en profundidad: las herramientas listas para usar que el lenguaje pone a tu disposición.
