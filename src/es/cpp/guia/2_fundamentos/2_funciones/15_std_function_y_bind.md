---
outline: [2, 3]
---

# `std::function` y `std::bind`

En C++ moderno, **`std::function`** es un contenedor de objetos invocables, como funciones, lambdas o punteros a funciones, que permite almacenarlos y pasarlos de manera uniforme.  
**`std::bind`** se utiliza para **fijar algunos parámetros de una función**, creando una nueva función con menos argumentos.

Estas herramientas facilitan la programación flexible y orientada a callbacks.

## 1. Concepto básico de std::function

- `std::function` es un **wrapper** que puede almacenar cualquier callable compatible con una firma específica.  
- Permite manejar **funciones, punteros a funciones, lambdas y objetos con operador()** de manera uniforme.

**Sintaxis:**
```cpp
#include <functional>

std::function<tipo_retorno(tipo_param1, tipo_param2, ...)> nombre;
```

## 2. Uso típico

`std::function` se usa cuando necesitamos **flexibilidad en el tipo de función** a invocar, por ejemplo:

- Pasar funciones, lambdas u objetos como callbacks.

- Guardar funciones en contenedores.

- Componer funciones dinámicamente.

`std::bind` permite **preconfigurar algunos parámetros** de una función, devolviendo un nuevo callable con menos argumentos.

## 3. Ejemplo práctico

En este ejemplo veremos cómo usar `std::function` para almacenar distintas funciones y lambdas, y cómo `std::bind` nos ayuda a fijar parámetros.

```cpp
#include <iostream>
#include <functional>
using namespace std;

// Función normal
int multiplicar(int a, int b) {
    return a * b;
}

int main() {
    // std::function que almacena una función con firma int(int,int)
    std::function<int(int,int)> operacion;

    // Asignar una función normal
    operacion = multiplicar;
    cout << "Multiplicación: " << operacion(3,4) << endl;

    // Asignar una lambda
    operacion = [](int a, int b){ return a + b; };
    cout << "Suma: " << operacion(3,4) << endl;

    // Usando std::bind para fijar el primer parámetro
    auto duplicar = std::bind(multiplicar, 2, std::placeholders::_1);
    cout << "Duplicar 5: " << duplicar(5) << endl;

    // std::function con bind
    std::function<int(int)> fDuplicar = std::bind(multiplicar, 2, std::placeholders::_1);
    cout << "Duplicar 7: " << fDuplicar(7) << endl;
}
```

**Notas importantes:**

- `std::placeholders::_1`, `_2`, etc, indican los argumentos que se pasan al callable final.

- `std::function` introduce cierta sobrecarga en tiempo de ejecución, pero ofrece gran **flexibilidad y uniformidad**.

- Con C++14 y superiores, las lambdas a menudo reemplazan `std::bind` por claridad.

## 4. Buenas prácticas

- Prefiere **lambdas** cuando sea posible; `std::bind` es más útil en composiciones complejas.

- Usa `std::function` para almacenar cualquier callable cuando necesites **tipado uniforme**.

- Evita asignaciones repetidas innecesarias a `std::function` en bucles de alto rendimiento.

## 5. Resumen rápido

- `std::function` permite almacenar y pasar **cualquier callable** compatible.

- `std::bind` fija algunos argumentos de una función, creando un nuevo callable.

- Usadas juntas, permiten **programación flexible y callbacks dinámicos**.

- Lambdas modernas pueden reemplazar muchas situaciones donde antes se usaba `std::bind`.