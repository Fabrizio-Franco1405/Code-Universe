---
outline: [2, 3]
---

# Punteros a funciones

Hasta ahora vimos punteros a datos: variables que guardan la dirección donde vive un número, un
arreglo o un objeto. Pero C++ va un paso más allá: también podemos tener punteros a **funciones**.
Así como un puntero normal guarda la dirección de un dato, un **puntero a función** almacena la
dirección de una función, permitiendo invocarla de manera indirecta.

Esto abre un mundo de posibilidades: pasar funciones como argumentos a otras funciones, cambiar
comportamientos en tiempo de ejecución y escribir código mucho más flexible y dinámico. Es el
concepto que está detrás de los famosos **callbacks**, que verás en infinidad de librerías y
frameworks.

## 1. Concepto básico

La idea central es sencilla:

- Se declaran especificando el tipo de retorno y los parámetros de la función a la que apuntan.
- Se asignan con el nombre de la función (opcionalmente con `&`).
- Se llaman usando el puntero como si fuera la función original.

**Sintaxis general:**

```cpp
tipo_retorno (*nombre_puntero)(tipo_param1, tipo_param2, ...);
```

Fíjate en el paréntesis alrededor de `*nombre_puntero`: no es un capricho. Si lo omitiéramos, el
compilador interpretaría algo completamente distinto (una función que devuelve un puntero). Ese
paréntesis es lo que marca la diferencia entre "puntero a función" y "función que devuelve
puntero".

## 2. Uso típico

Los punteros a función se utilizan en escenarios donde necesitamos **flexibilidad** en la
ejecución de funciones, por ejemplo:

- Pasar funciones como argumentos a otras funciones (callbacks).
- Implementar estrategias que se seleccionan en tiempo de ejecución.
- Evitar duplicación de código en algoritmos genéricos que requieren diferentes comportamientos.

Esta técnica permite que el mismo bloque de código pueda operar con distintas funciones sin ser
modificado. En otras palabras: escribís el "esqueleto" una vez y después le enchufás la función
que quieras según el momento.

## 3. Ejemplo práctico

En este ejemplo vamos a demostrar cómo usar punteros a funciones para **cambiar dinámicamente la
operación matemática** que se aplica a dos valores enteros. Primero definimos dos funciones
simples (`sumar` y `multiplicar`), luego usamos un puntero a función para invocarlas y,
finalmente, mostramos cómo pasar estas funciones como argumentos a otra función (`operar`).

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

Notarás cómo `operar` no sabe (ni le importa) qué función recibe: simplemente la llama con `func(x, y)`.
Ese es el poder de la indirección: el mismo `operar` sirve para sumar, multiplicar o lo que sea.

**Notas importantes:**

- Los punteros a funciones permiten cambiar el comportamiento de la llamada sin modificar la
  función que los usa.
- Se pueden usar `typedef` o `using` para simplificar la declaración:

```cpp
using Operacion = int(*)(int,int);
Operacion op = sumar;
```

- Con C++11, también se puede usar `std::function` y `lambdas` para mayor flexibilidad y
  seguridad.

## 4. Buenas prácticas

- Cuando el tipo sea complejo, declara un alias con `using` para no repetir la sintaxis.
- Prefiere `std::function` y lambdas en código moderno: son más seguros y expresivos.
- Documenta qué tipo de funciones espera recibir un parámetro puntero a función.
- No olvides verificar que el puntero no sea nulo antes de invocarlo.

## 5. Resumen rápido

- Un puntero a función almacena la dirección de una función.
- Permite invocarla indirectamente y pasarla como argumento.
- Facilita callbacks, algoritmos genéricos y estrategias dinámicas.
- Se puede simplificar la sintaxis con `using` o `typedef` y combinar con `lambdas` en C++ moderno.

Con los punteros a funciones cerramos esta parte dedicada a la memoria y los punteros. Ya tenés
todas las piezas para entender cómo C++ maneja los datos por debajo: valor, referencia, dirección,
memoria dinámica y, ahora, comportamiento dinámico. En la siguiente parte pasaremos a lo que hace
a C++ tan especial a nivel de diseño: la Programación Orientada a Objetos.