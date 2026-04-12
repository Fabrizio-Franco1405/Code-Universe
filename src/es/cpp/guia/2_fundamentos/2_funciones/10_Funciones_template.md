# Funciones plantilla (Templates)

En C++, las **funciones plantilla** (`function templates`) permiten escribir funciones **genéricas** que pueden trabajar con distintos tipos de datos sin necesidad de duplicar código.  

Esto aporta flexibilidad, evita redundancia y es una base fundamental de la **programación genérica** en C++.

## 1. Sintaxis básica

Se define con la palabra clave `template` seguida de parámetros de tipo entre `<>`:

```cpp
#include <iostream>
using namespace std;

template <typename T>
T sumar(T a, T b) {
    return a + b;
}

int main() {
    cout << sumar(3, 4) << endl;       // T = int → 7
    cout << sumar(2.5, 1.1) << endl;   // T = double → 3.6
    cout << sumar('A', (char)1) << endl; // T = char → 'B'
}
```

- `T` es un **parámetro de tipo** que el compilador sustituye en cada invocación.

- El compilador genera la versión concreta de la función en tiempo de compilación (instanciación de plantilla).

## Múltiples parámetros de tipo

Una plantilla puede tener más de un parámetro de tipo:

```cpp
template <typename T, typename U>
auto multiplicar(T a, U b) -> decltype(a * b) {
    return a * b;
}

int main() {
    cout << multiplicar(3, 2.5) << endl; // Resultado: 7.5
}
```

Aquí `decltype` permite deducir el tipo de retorno a partir de la expresión `a * b`.

## 2. Deducción de tipos

Normalmente, el compilador deduce los parámetros de tipo a partir de los argumentos:

```cpp
template <typename T>
void mostrar(T valor) {
    cout << valor << endl;
}

int main() {
    mostrar(42);        // Deduce T = int
    mostrar(3.14);      // Deduce T = double
    mostrar("Hola");    // Deduce T = const char*
}
```

Pero también se pueden especificar explícitamente:
```cpp
mostrar<int>(99);
```

## 3. Sobrecarga y plantillas

Las funciones plantilla pueden **convivir** con funciones normales y sobrecargadas.

```cpp
void imprimir(int x) {
    cout << "Entero: " << x << endl;
}

template <typename T>
void imprimir(T x) {
    cout << "Genérico: " << x << endl;
}

int main() {
    imprimir(10);    // Usa la versión específica para int
    imprimir(3.14);  // Usa la plantilla genérica
}
```

El compilador **prefiere coincidencias exactas** antes que plantillas.

## 4. Restricciones de tipo (C++20)

Con **concepts** (C++20), se pueden restringir plantillas para que solo acepten ciertos tipos.

```cpp
#include <concepts>

template <typename T>
requires std::integral<T>   // Solo enteros
T cuadrado(T x) {
    return x * x;
}

int main() {
    cout << cuadrado(5) << endl;   // OK → 25
    cout << cuadrado(2.5);     // ❌ Error: no es entero [!code error]
}
```

Esto mejora la legibilidad y los mensajes de error en compilación.

## 5. Especialización de plantillas

Se puede **modificar el comportamiento** de una plantilla para un tipo específico.

```cpp
template <typename T>
T valorAbsoluto(T x) {
    return (x < 0) ? -x : x;
}

// Especialización para strings
template <>
string valorAbsoluto<string>(string s) {
    return s; // No tiene sentido el valor absoluto de un string
}
```

## 6. Ejemplo práctico

Vamos a ver cómo usar una función plantilla para encontrar el **máximo valor** en un vector de cualquier tipo de dato comparable:

```cpp
#include <iostream>
#include <vector>
using namespace std;

// Plantilla genérica para obtener el máximo de un vector
template <typename T>
T maximo(const vector<T>& datos) {
    T maxVal = datos[0];
    for (const auto& elem : datos) {
        if (elem > maxVal) maxVal = elem;
    }
    return maxVal;
}

int main() {
    vector<int> enteros = {1, 5, 3, 9, 2};
    vector<double> reales = {2.5, 4.8, 1.2};

    cout << "Máximo entero: " << maximo(enteros) << endl;   // 9
    cout << "Máximo real: " << maximo(reales) << endl;      // 4.8
}
```

**Explicación paso a paso**

1. La función `maximo` se define como **plantilla** con `template <typename T>`.

2. `T` se deduce automáticamente según el tipo de vector que pasemos.

3. El bucle compara todos los elementos y devuelve el valor más grande.

4. Con una sola plantilla podemos trabajar con vectores de `int`, `double` o cualquier otro tipo comparable.

**Salida esperada**

```yml
Máximo entero: 9
Máximo real: 4.8
```

**Análisis**

- Evita duplicar código para distintos tipos de datos.

- Permite crear funciones **genéricas y reutilizables**.

- Si usamos C++20, se pueden agregar concepts para restringir los tipos y obtener errores más claros en compilación.

## 7. Buenas prácticas

- Usa `template <typename T>` en lugar de `template <class T>` (ambos son equivalentes, pero `typename` es más claro).

- Aprovecha `auto` y `decltype` para deducir tipos de retorno.

- Con C++20, prefiere `concepts` para restringir plantillas y evitar errores confusos.

- No abuses de la sobrecarga entre plantillas y funciones normales: Puede introducir ambigüedad.

## 8. Resumen rápido

- Las funciones plantilla permiten **generalizar código** sin duplicarlo.

- El compilador **deduce tipos automáticamente** en la mayoría de casos.

- Pueden coexistir con funciones normales → El compilador elige la mejor coincidencia.

- Con C++20, los **conceptos** permiten limitar qué tipos acepta la plantilla.

- Se pueden especializar para tipos específicos si es necesario.