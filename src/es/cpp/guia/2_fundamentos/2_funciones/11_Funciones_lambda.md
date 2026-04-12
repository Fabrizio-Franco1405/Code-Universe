---
outline: [2, 3]
---

# Funciones Lambda

Las **funciones lambda** son funciones anónimas que se definen directamente en el lugar donde se necesitan, sin necesidad de declararlas previamente con un nombre. Introducidas en **C++11**, se han convertido en una herramienta esencial para escribir código más expresivo y conciso.

## 1. Sintaxis básica

La sintaxis general es:

```cpp
[capturas](parámetros) -> tipo_retorno {
    // Cuerpo
}
```

- **Capturas (`[]`)**: Indican qué variables del entorno estarán disponibles dentro de la lambda.

- **Parámetros (`()`)**: Funcionan como en cualquier otra función.

- **Tipo de retorno (`->`)**: Puede omitirse si el compilador puede deducirlo.

- **Cuerpo (`{}`)**: Contiene las instrucciones a ejecutar.

Ejemplo básico:

```cpp
#include <iostream>

int main() {
    auto suma = [](int a, int b) { return a + b; };
    std::cout << suma(3, 4) << std::endl; // 7
}
```

## 2. Capturas de variables

Las lambdas pueden capturar variables del contexto donde se definen. Esto se especifica dentro de `[]`.

### 2.1 Captura por valor (`[=]`)

Se copian las variables del entorno al momento de la creación de la lambda.
```cpp
int x = 10;
auto f = [=]() { return x + 5; };
std::cout << f() << std::endl; // 15
```

Cambios posteriores en `x` **no afectan** a la lambda.

### 2.2 Captura por referencia (`[&]`)

Permite modificar las variables externas directamente.
```cpp
int x = 10;
auto f = [&]() { x += 5; };
f();
std::cout << x << std::endl; // 15
```

### 2.3 Captura explícita

Se puede indicar qué variables capturar por valor o referencia.
```cpp
int a = 5, b = 10;

// Captura 'a' por valor y 'b' por referencia
auto f = [a, &b]() { return a + (++b); };
std::cout << f() << std::endl; // 16
std::cout << b << std::endl;   // 11
```

### 2.4 Captura mutable

Por defecto, las variables capturadas por valor son de solo lectura.
Con `mutable`, se permite modificarlas dentro de la lambda (aunque los cambios no afectan a la variable original).
```cpp
int x = 10;
auto f = [x]() mutable {
    x += 5;
    return x;
};
std::cout << f() << std::endl; // 15
std::cout << x << std::endl;   // 10 (No cambió)
```

### 2.5 Captura por movimiento (C++14/17)

Con `std::move`, se pueden mover recursos a la lambda.
```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> datos = {1, 2, 3};

    auto f = [v = std::move(datos)]() {
        for (int n : v) std::cout << n << " ";
    };

    f(); // 1 2 3
    // 'datos' ya no es usable aquí
}
```

## 3. Uso de lambdas en la STL

Las lambdas se integran perfectamente con algoritmos de la STL como `std::for_each`, `std::sort`, `std::find_if`, etc.

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> v = {1, 2, 3, 4, 5};

    std::for_each(v.begin(), v.end(), [](int n) {
        std::cout << n * n << " ";
    });
    // Salida: 1 4 9 16 25
}
```

Ejemplo con `std::sort`:
```cpp
std::vector<int> nums = {5, 2, 9, 1};
std::sort(nums.begin(), nums.end(), [](int a, int b) {
    return a < b;
});
```

## 4. Ventajas y desventajas

**Ventajas**

- Código más conciso y expresivo.

- Permiten trabajar con funciones de orden superior (callbacks, predicados, etc.).

- Se integran muy bien con la STL.

**Desventajas**

- Sintaxis puede ser confusa al inicio.

- Excesivo uso de lambdas puede dificultar la lectura del código.

- Capturas mal gestionadas (especialmente referencias) pueden provocar bugs sutiles.

## 5. Resumen rápido

- Las **lambdas** son funciones anónimas definidas en línea.

- Pueden capturar variables por valor, referencia o movimiento.

- Con `mutable` se permite modificar capturas por valor.

- Son ampliamente utilizadas en la STL y en programación moderna con C++.