---
outline: [2, 3]
---

# Novedades en C++23

La historia del C++ moderno continúa. Después de C++20, llegó **C++23** (2023): un estándar de "consolidación", que afina lo anterior y añade mejoras muy prácticas sin romper la compatibilidad. Es la prueba de que C++ sigue evolucionando en ciclos regulares de 3 años.

## 1. `std::expected`: El retorno que puede ser error

Uno de los problemas clásicos de C++: las funciones que deben devolver "un valor **o** un error". Antes tenías excepciones (lanzar/capturar) o códigos de error. `std::expected` (C++23) devuelve **ambas posibilidades de forma explícita**:

```cpp
#include <iostream>
#include <expected>
using namespace std;

expected<int, string> dividir(int a, int b) {
    if (b == 0) return unexpected("División entre cero");
    return a / b;
}

int main() {
    auto resultado = dividir(10, 2);

    if (resultado.has_value()) {
        cout << "Resultado: " << *resultado << endl; // 5
    } else {
        cout << "Error: " << resultado.error() << endl;
    }

    // Comprobar error directamente
    if (dividir(4, 0)) {
        cout << "OK" << endl;
    } else {
        cout << "Fallo: " << dividir(4, 0).error() << endl;
    }

    return 0;
}
```

::: tip
💡 `std::expected` es perfecto para errores esperables (validación, parseo) donde lanzar excepciones es demasiado costoso o el error es parte del flujo normal.
:::

## 2. `std::views::zip`: Recorrer varios contenedores a la vez

La vieja duda: "¿cómo recorro dos vectores en paralelo?". C++23 añade `views::zip`:

```cpp
#include <iostream>
#include <vector>
#include <ranges>
using namespace std;

int main() {
    vector<string> nombres = {"Ana", "Carlos", "Marta"};
    vector<int> edades = {25, 30, 28};

    // Recorre ambos a la vez
    for (const auto &[nombre, edad] : views::zip(nombres, edades)) {
        cout << nombre << " tiene " << edad << " años" << endl;
    }

    return 0;
}
```

::: info Nota
ℹ️ La longitud del recorrido es la del contenedor más corto. Combinado con structured bindings, es extremadamente legible.
:::

## 3. `std::print`: Impresión sin `cout` (¡y con formato!)

`std::print` llega para modernizar la salida, usando la sintaxis de formato de `std::format`:

```cpp
#include <iostream>
#include <print>
using namespace std;

int main() {
    string nombre = "Code Universe";
    int version = 23;

    // Formato moderno, sin encadenar <<
    print("Bienvenido a {} versión {}\n", nombre, version);

    // Y formateo detallado
    print("Pi: {:.2f}\n", 3.14159);        // 3.14
    print("Alineado: {:>10}\n", 42);       // "        42"

    return 0;
}
```

::: tip
💡 `std::print` es más seguro (evita problemas de formato), más rápido y más legible. Es el futuro de la salida por consola en C++.
:::

## 4. `std::mdspan`: Arreglos multidimensionales

Para computación científica y matemáticas, `std::mdspan` permite ver un arreglo como **multidimensional** sin copiarlo:

```cpp
#include <iostream>
#include <mdspan>
#include <vector>
using namespace std;

int main() {
    vector<int> datos = {1, 2, 3, 4, 5, 6};

    // Vemos los 6 elementos como una matriz de 2x3
    mdspan<int, extents<int, 2, 3>> matriz(datos.data());

    cout << "Elemento (1, 2): " << matriz[1, 2] << endl; // 6
    cout << "Elemento (0, 0): " << matriz[0, 0] << endl; // 1

    return 0;
}
```

## 5. Otras novedades de C++23
| Novedad | Descripción |
|---|---|
| `std::flat_map` | Mapas más eficientes en memoria |
| `this` deducido | Permite CRTP simplificado en POO |
| `std::move_only_function` | Guardar lambdas movibles |
| `std::generator` | Generadores con corrutinas |
| `char8_t` | Soporte explícito de UTF-8 |
| Módulos aún más maduros | Importar más piezas del estándar |

```cpp
#include <iostream>
#include <flat_map>
using namespace std;

int main() {
    flat_map<string, int> edades;
    edades["Ana"] = 25;
    edades["Carlos"] = 30;

    for (const auto &[nombre, edad] : edades) {
        cout << nombre << ": " << edad << endl;
    }
    return 0;
}
```

## 6. ¿Y el futuro?

- **C++26** ya está en desarrollo: espera más mejoras en módulos, reflexión en compilación y librerías estándar.
- C++ mantiene su promesa histórica: **evolución sin romper** lo existente.
- El lenguaje sigue siendo el estándar del rendimiento y la programación de sistemas.

## 7. Resumen rápido

- **`std::expected`**: devolver valor o error explícitamente.
- **`views::zip`**: recorrer varios contenedores en paralelo.
- **`std::print`**: impresión moderna con formato.
- **`std::mdspan`**: arreglos multidimensionales sin copias.
- **`std::flat_map`**: mapas eficientes en memoria.
- C++23 consolida y afina lo aprendido en C++20.

C++23 cierra este recorrido por la evolución del lenguaje. Ahora que dominas el C++ moderno, pasemos a la parte práctica: los **patrones de diseño**, las soluciones probadas para los problemas que todo programador se encuentra una y otra vez.
