---
outline: [2, 3]
---

# Novedades en C++14

Si C++11 fue la gran revolución, **C++14** (publicado en 2014) fue el pulido: un estándar más pequeño y centrado en **refinar y completar** lo que C++11 trajo, sin romper nada. Es el capítulo de la "mejora continua".

## 1. Deducción de retorno con `auto`

En C++11 podías usar `auto` para variables, pero para el **tipo de retorno** de una función necesitabas escribirlo o usar las técnicas de trailing. C++14 permite que el compilador deduzca el tipo de retorno automáticamente:

```cpp
// C++14: el retorno se deduce
auto sumar(int a, int b) {
    return a + b; // Deduce int
}

auto obtenerValor() {
    return vector<int>{1, 2, 3}; // Deduce vector<int>
}

int main() {
    cout << sumar(3, 4) << endl; // 7
    return 0;
}
```

::: tip
💡 Es especialmente útil para funciones con tipos complicados (como iteradores). El compilador deduce el tipo exacto en compilación: mismo rendimiento, menos escritura.
:::

## 2. Lambdas genéricas

En C++11, los parámetros de las lambdas debían tener un tipo explícito. C++14 permite parámetros `auto`, creando lambdas que funcionan con cualquier tipo:

```cpp
// C++11: tipo explícito
auto duplicar = [](int x) { return x * 2; };

// C++14: lambda genérica (funciona con cualquier tipo)
auto duplicar = [](auto x) { return x * 2; };

int main() {
    cout << duplicar(21) << endl;      // 42 (int)
    cout << duplicar(3.5) << endl;     // 7.0 (double)
    return 0;
}
```

::: info Nota
ℹ️ Cada tipo con el que se usa la lambda genérica genera su propia instancia en compilación, igual que las plantillas.
:::

## 3. Captura por movimiento en lambdas

En C++11, capturar un `unique_ptr` (que no se copia) era un problema. C++14 permite **inicializar capturas**, moviendo el valor a la lambda:

```cpp
#include <iostream>
#include <memory>
using namespace std;

int main() {
    unique_ptr<int> puntero = make_unique<int>(42);

    // Captura por movimiento (se mueve dentro de la lambda)
    auto lambda = [p = move(puntero)]() {
        cout << "Valor: " << *p << endl;
    };

    lambda(); // 42
    return 0;
}
```

## 4. Literales definidos por el usuario

C++14 permite definir sufijos propios para literales, facilitando la lectura:

```cpp
#include <iostream>
using namespace std;

constexpr long double operator""_km(long double km) {
    return km * 1000; // Convertir a metros
}

int main() {
    auto distancia = 5.0_km;
    cout << "5 km en metros: " << distancia << endl; // 5000
    return 0;
}
```

::: tip
💡 La STL usa esto para los literales de tiempo en C++14: `500ms`, `2s`, `1min` funcionan con `<chrono>`.
:::

```cpp
#include <iostream>
#include <chrono>
using namespace std;
using namespace chrono_literals;

int main() {
    auto espera = 500ms;          // 500 milisegundos
    auto descanso = 1h;           // 1 hora
    cout << "500ms = " << espera.count() << " ms" << endl;
    return 0;
}
```

## 5. Otros añadidos de C++14
| Novedad | Descripción |
|---|---|
| `std::make_unique` | Crear `unique_ptr` (faltaba en C++11) |
| `std::integer_sequence` | Secuencias de enteros en compilación |
| `[[deprecated]]` | Marcar funciones obsoletas |
| `constexpr` más flexible | Bucles y más funciones en compilación |
| Variables de plantilla | Variables con `<T>` (C++14) |

```cpp
#include <memory>
using namespace std;

// make_unique: llega en C++14
unique_ptr<int> p = make_unique<int>(7);

// [[deprecated]]: avisa al compilar
[[deprecated("Usa nuevaFuncion()")]]
void viejaFuncion() {}

int main() {
    // viejaFuncion(); // El compilador avisará
    return 0;
}
```

## 6. Resumen rápido

- `auto` también deduce el **tipo de retorno** de funciones.
- Las **lambdas genéricas** aceptan parámetros con `auto`.
- **Captura por movimiento** permite mover objetos no copiables a lambdas.
- **Literales definidos por el usuario** y literales de tiempo (`500ms`).
- `std::make_unique`, `[[deprecated]]`, `constexpr` más potente.
- C++14 pulió C++11 sin romper nada.

C++14 fue refinamiento. El siguiente gran paso llegaría tres años después: **C++17**, con novedades como `std::optional`, `std::variant` y los `structured bindings`.
