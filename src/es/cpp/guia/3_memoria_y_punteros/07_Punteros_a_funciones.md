---
outline: [2, 3]
---

# Punteros a funciones

En C++, un **puntero a función** es una variable que almacena la dirección de una función, permitiendo invocarla de manera indirecta. Esto permite mayor flexibilidad y dinamismo en la ejecución del código, como pasar funciones como argumentos o cambiar comportamientos en tiempo de ejecución.

## 1. Concepto básico

- Se declaran especificando el tipo de retorno y los parámetros de la función a la que apuntan.
- Se asignan con el nombre de la función (opcionalmente con `&`).
- Se llaman usando el puntero como si fuera la función original.

**Sintaxis general:**
```cpp
tipo_retorno (*nombre_puntero)(tipo_param1, tipo_param2, ...);
```

## 2. Uso típico

Los punteros a función se utilizan en escenarios donde necesitamos **flexibilidad** en la ejecución de funciones, por ejemplo:

- Pasar funciones como argumentos a otras funciones (callbacks).

- Implementar estrategias que se seleccionan en tiempo de ejecución.

- Evitar duplicación de código en algoritmos genéricos que requieren diferentes comportamientos.

Esta técnica permite que el mismo bloque de código pueda operar con distintas funciones sin ser modificado.

## 3. Ejemplo práctico

En este ejemplo vamos a demostrar cómo usar punteros a funciones para **cambiar dinámicamente la operación matemática** que se aplica a dos valores enteros. Primero definimos dos funciones simples (`sumar` y `multiplicar`), luego usamos un puntero a función para invocarlas y, finalmente, mostramos cómo pasar estas funciones como argumentos a otra función (`operar`).

```cpp
#include <iostream>
using namespace std;

// Funciones simples
int sumar(int a, int b) {
    return a + b;
}

int multiplicar(int a, int b) {
    return a * b;
}

// Función que recibe un puntero a función
int operar(int x, int y, int (*func)(int, int)) {
    return func(x, y);
}

int main() {
    int (*ptrFunc)(int, int);

    ptrFunc = sumar;
    cout << "Suma: " << ptrFunc(5, 3) << endl;

    ptrFunc = multiplicar;
    cout << "Multiplicación: " << ptrFunc(5, 3) << endl;

    cout << "Operar suma: " << operar(7, 2, sumar) << endl;
    cout << "Operar multiplicación: " << operar(7, 2, multiplicar) << endl;
}
```

**Notas importantes:**

- Los punteros a funciones permiten cambiar el comportamiento de la llamada sin modificar la función que los usa.

- Se pueden usar `typedef` o `using` para simplificar la declaración:
```cpp
using Operacion = int(*)(int,int);
Operacion op = sumar;
```

- Con C++11, también se puede usar `std::function` y `lambdas` para mayor flexibilidad y seguridad.

## 4. Resumen rápido

- Un puntero a función almacena la dirección de una función.

- Permite invocarla indirectamente y pasarla como argumento.

- Facilita callbacks, algoritmos genéricos y estrategias dinámicas.

- Se puede simplificar la sintaxis con `using` o `typedef` y combinar con `lambdas` en C++ moderno.