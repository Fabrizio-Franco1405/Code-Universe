---
outline: [2, 3]
---

# Funciones Recursivas

La **recursión** es una técnica de programación en la que una función se llama a sí misma, de manera directa o indirecta, para resolver un problema dividiéndolo en subproblemas más pequeños. Es un recurso muy poderoso en C++, aunque debe usarse con cuidado.

## 1. Concepto básico

Una función recursiva se compone de **dos partes fundamentales**:

1. **Caso base** → Condición que detiene la recursión.
2. **Caso recursivo** → Llamada a la propia función con un subproblema más simple.

Ejemplo clásico: Cálculo del **factorial**.

```cpp
#include <iostream>

int factorial(int n) {
    if (n <= 1) return 1;        // Caso base
    return n * factorial(n - 1); // Caso recursivo
}

int main() {
    std::cout << factorial(5) << std::endl; // 120
}
```

Si falta un caso base correcto o no se reduce el problema en cada llamada, la recursión se vuelve infinita y provoca *stack overflow*.

## 2. Tipos de recursión

Existen diferentes patrones de recursión, y elegir el adecuado depende de la naturaleza del problema y de consideraciones de rendimiento.

### 2.1 Recursión directa

La función se invoca a sí misma dentro de su propio cuerpo. Es la forma más simple y la más común.

**Ejemplo:**
```cpp
void cuentaAtras(int n) {
    if (n <= 0) return;           // Caso base
    std::cout << n << " ";
    cuentaAtras(n - 1);           // Llamada directa
}
```

**Uso típico:** algoritmos donde cada subproblema es exactamente la misma operación con un parámetro reducido (factorial, recorridos lineales con decremento).

### 2.2 Recursión indirecta (mutua)

La recursión se produce cuando una función A llama a B y B vuelve a llamar a A (o a otra cadena de funciones que regresa a A). Se denomina recursión mutua o indirecta.

**Ejemplo:**
```cpp
void A(int x);
void B(int x);

void A(int x) {
    if (x <= 0) return;
    // ... lógica ...
    B(x - 1);
}

void B(int x) {
    if (x <= 0) return;
    // ... lógica ...
    A(x - 1);
}
```

**Uso típico:** problemas con dos (o más) estados alternantes donde cada estado tiene su propia función (autómatas simples, ciertos algoritmos de parsers).

### 2.3 Recursión múltiple

Ocurre cuando la llamada recursiva genera más de una llamada recursiva por invocación (ej.: Fibonacci naïve).

**Ejemplo — Fibonacci naïve:**

```cpp
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2); // Dos llamadas recursivas
}
```

::: warning Advertencia
⚠️ La recursión múltiple puede tener combinatorial explosion en tiempo (exponencial) si no se memoiza o transforma a una versión iterativa/dinámica.
:::

## 3. Ejemplos prácticos

A continuación, algunos ejemplos clásicos de funciones recursivas en C++. Estos casos ilustran cómo aplicar la recursión en problemas matemáticos y algorítmicos, mostrando tanto sus beneficios como sus limitaciones.

### 3.1 Factorial (recursión directa)
```cpp
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
```

**Explicación:** Cada llamada multiplica `n` por el factorial de `n-1` hasta llegar al caso base.

### 3.2 Fibonacci (recursión múltiple — mala práctica sin memorización)
```cpp
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
```

**Explicación:** La función genera múltiples llamadas recursivas para cada número anterior. Para `n` grande, conviene usar memoización o versión iterativa.

### 3.3 Búsqueda binaria (recursión directa sobre rango)
```cpp
int busquedaBinaria(const std::vector<int>& v, int izq, int der, int clave) {
    if (izq > der) return -1;
    int mid = izq + (der - izq) / 2;
    if (v[mid] == clave) return mid;
    if (clave < v[mid]) return busquedaBinaria(v, izq, mid - 1, clave);
    return busquedaBinaria(v, mid + 1, der, clave);
}
```

**Explicación:** Divide el rango a la mitad en cada llamada hasta encontrar la clave o agotar el rango.

### 3.4 Factorial estilo tail recursion
```cpp
#include <iostream>
using namespace std;

int factorialTail(int n, int acc = 1) {
    if (n <= 1) return acc;          // Caso base
    return factorialTail(n - 1, acc * n); // Llamada en cola
}

int main() {
    cout << factorialTail(5) << endl; // 120
}
```

**Explicación:** La llamada recursiva es la última operación de la función, lo que permite optimización en compiladores que soporten tail call optimization.

## 4. Pila de llamadas y consumo de memoria

Cada llamada recursiva añade un marco (stack frame) que contiene parámetros, variables locales y la dirección de retorno. Por tanto:

- Profundidad alta → Mayor uso de pila.
- Sin caso base o con decremento incorrecto → Stack overflow.
- En sistemas embebidos o con límites de pila bajos, la recursión debe usarse con precaución.

Para depurar recursión profunda, imprime la profundidad actual o utiliza herramientas de profiling para ver consumo de pila.

## 5. Ventajas y desventajas

**Ventajas**

- Permite escribir código claro para problemas naturalmente recursivos (árboles, backtracking, divide & conquer).

- Traduce directamente la especificación matemática o definida por recurrencia.

**Desventajas**

- Puede consumir mucha pila y ser menos eficiente que versiones iterativas.

- La recursión múltiple sin optimización es costosa en tiempo.

- Requiere cuidado en la definición del caso base.

## 6. Optimización: tail recursion (recursión en cola)

La **recursión en cola** sucede cuando la llamada recursiva es la última operación de la función. Algunos compiladores aplican tail call optimization que permite reutilizar el marco de pila.

**Ejemplo (factorial con acumulador — estilo tail recursion):**
```cpp
int factorialTail(int n, int acc = 1) {
    if (n <= 1) return acc;
    return factorialTail(n - 1, acc * n); // Llamada en cola
}
```

No todos los compiladores realizan optimización de recursión en cola en C++ en todos los casos. No confíes automáticamente en que la versión recursiva en cola evitará desbordamientos en todos los entornos.

## 5. Resumen rápido

- La recursión divide un problema en subproblemas hasta alcanzar un caso base.

- **Tipos:** directa, indirecta (mutua), múltiple.

- La recursión múltiple puede ser ineficiente sin memoización.

- Cada llamada ocupa espacio en la pila → riesgo de stack overflow.

- Considera transformar recursión a iteración o usar memoización/DP cuando el coste sea alto.

- Tail recursion puede ayudar, pero la optimización depende del compilador.