---
outline: [2, 3]
---

# Plantillas de función

En el capítulo anterior vimos el concepto general de plantillas y su primer
ejemplo: una función `maximo()` que funciona con cualquier tipo. Ahora es el
momento de profundizar en las **plantillas de función**: sus variantes, la
deducción de tipos, la especialización y cómo se combinan con otros
mecanismos de C++. En la práctica, son el primer escalón real de la
programación genérica, así que vale la pena dominarlas a fondo.

## 1. Sintaxis completa

La forma general de una plantilla de función es:

```cpp
template <typename T1, typename T2, ...>
tipo_retorno nombre(parametros) {
    // cuerpo
}
```

Como ves, la estructura es muy parecida a la de una función normal, con la
diferencia de que antes del nombre aparece la línea de `template` declarando
los tipos genéricos. Veamos varios ejemplos de plantillas de función útiles
en la vida real:

```cpp
#include <iostream>
using namespace std;

// Suma de dos valores
template <typename T>
T sumar(T a, T b) {
    return a + b;
}

// Intercambio de valores
template <typename T>
void intercambiar(T &a, T &b) {
    T temporal = a;
    a = b;
    b = temporal;
}

int main() {
    cout << sumar(5, 3) << endl;        // 8 (int)

    int x = 10, y = 20;
    intercambiar(x, y);
    cout << x << ", " << y << endl;     // 20, 10

    string a = "hola", b = "mundo";
    intercambiar(a, b);
    cout << a << ", " << b << endl;     // mundo, hola

    return 0;
}
```

::: tip
💡 Fíjate en `intercambiar(string, string)`: la misma plantilla funciona con
cadenas porque la lógica (guardar, asignar, restaurar) es idéntica para
cualquier tipo. No importa qué tipo uses, el algoritmo siempre hace lo mismo.
:::

## 2. Deducción de tipos: automática y explícita

En la mayoría de los casos, el compilador **deduce** el tipo `T` a partir de
los argumentos que le pasamos, sin que tengamos que hacer absolutamente nada:

```cpp
sumar(1, 2);      // T = int (deducido)
sumar(1.5, 2.5);  // T = double (deducido)
```

Pero a veces conviene (o es necesario) indicarlo **explícitamente** usando
`<Tipo>` justo después del nombre de la función. Esto ocurre, por ejemplo,
cuando el tipo no aparece en los parámetros:

```cpp
#include <iostream>
using namespace std;

template <typename T>
T convertir(int valor) {
    return static_cast<T>(valor);
}

int main() {
    // No hay argumentos para deducir T, así que lo indicamos nosotros
    double d = convertir<double>(100);
    float f = convertir<float>(100);

    cout << d << endl; // 100
    cout << f << endl; // 100
    return 0;
}
```

::: info Nota
ℹ️ Cuando el tipo no puede deducirse de los argumentos (por ejemplo, porque
solo aparece en el retorno), debes especificarlo explícitamente con
`funcion<Tipo>(...)`.
:::

## 3. Tipos distintos en la misma llamada

¿Qué pasa si pasamos un `int` y un `double` a una plantilla que espera el
mismo tipo `T`? El compilador no podrá deducir un único `T` y te lanzará un
error:

```cpp
// ⚠️ Error: no hay un único tipo T que sirva para int y double
```

Para estos casos, tenemos dos soluciones muy prácticas:

**Solución 1: dos parámetros de tipo**

La más elegante: declaramos la plantilla con dos tipos genéricos y dejamos
que el compilador deduzca cada uno por su lado.

```cpp
template <typename T, typename U>
auto sumar(T a, U b) {
    return a + b;
}

int main() {
    cout << sumar(1, 2.5) << endl; // 3.5 (int + double)
    return 0;
}
```

**Solución 2: convertimos explícitamente**

También podemos forzar el tipo de la llamada para que ambos argumentos
terminen siendo del mismo tipo:

```cpp
sumar<double>(1, 2.5); // Convierte 1 a double
```

::: tip
💡 Con `auto` como tipo de retorno (disponible desde C++14), el compilador
deduce el resultado correcto sin que nos preocupemos por los tipos. Es la
forma más cómoda cuando el resultado depende de los parámetros.
:::

## 4. Parámetros por referencia: evitar copias

Como las plantillas pueden recibir tipos grandes (vectores, cadenas,
objetos), es muy común pasarlos por **referencia constante** para evitar
copias costosas. De la misma manera que no vas a fotocopiar un libro entero
si solo necesitas leerlo, no tiene sentido copiar un vector enorme si solo
vamos a mirarlo:

```cpp
#include <iostream>
#include <vector>
using namespace std;

template <typename T>
void imprimir(const vector<T> &v) {
    for (const T &elemento : v) {
        cout << elemento << " ";
    }
    cout << endl;
}

int main() {
    vector<int> enteros = {1, 2, 3};
    vector<string> palabras = {"hola", "mundo"};

    imprimir(enteros);  // 1 2 3
    imprimir(palabras); // hola mundo

    return 0;
}
```

## 5. Especialización de plantillas de función

A veces, el comportamiento genérico no es el adecuado para un tipo concreto.
La **especialización** nos permite escribir una versión específica para ese
tipo. Imagina que queremos describir valores, pero los `bool` merecen un
tratamiento especial:

```cpp
#include <iostream>
using namespace std;

// Versión genérica
template <typename T>
void describir(T valor) {
    cout << "Valor genérico: " << valor << endl;
}

// Especialización para bool
template <>
void describir(bool valor) {
    cout << "Es un booleano: " << (valor ? "verdadero" : "falso") << endl;
}

int main() {
    describir(42);       // Valor genérico: 42
    describir("hola");   // Valor genérico: hola
    describir(true);     // Es un booleano: verdadero
    return 0;
}
```

::: warning Advertencia
⚠️ La especialización de funciones es válida y útil, pero las
especializaciones de **clases** (que veremos más adelante) son mucho más
frecuentes. Prefiere la sobrecarga normal cuando la diferencia sea solo de
tipos de parámetros.
:::

## 6. Sobrecarga vs plantillas

C++ te permite mezclar **sobrecarga** (misma función con distintos
parámetros) y **plantillas** sin ningún problema. El compilador elegirá la
versión más específica cuando exista:

```cpp
#include <iostream>
using namespace std;

// Plantilla genérica
template <typename T>
void imprimir(T valor) {
    cout << "Genérica: " << valor << endl;
}

// Sobrecarga concreta (se prefiere para int)
void imprimir(int valor) {
    cout << "Int: " << valor << endl;
}

int main() {
    imprimir(10);      // Int: 10 (la sobrecarga es más específica)
    imprimir(2.5);     // Genérica: 2.5
    imprimir("texto"); // Genérica: texto
    return 0;
}
```

## 7. Buenas prácticas

- Aprovecha la **deducción de tipos** para que el código sea legible.
- Usa `auto` como retorno cuando el tipo dependa de los parámetros.
- Pasa parámetros grandes por **referencia constante**.
- Especifica tipos explícitamente solo cuando la deducción no sea posible.
- Prefiere sobrecarga para casos específicos y plantillas para lógica
  genérica.

## 8. Resumen rápido

- Las plantillas de función permiten código genérico reutilizable.
- El compilador deduce `T` de los argumentos (o lo especificamos con
  `<Tipo>`).
- Con varios parámetros de tipo se mezclan tipos distintos.
- La **especialización** permite una versión concreta para un tipo.
- Sobrecarga y plantillas se pueden combinar.
- Pasa objetos grandes por referencia para evitar copias.

Las plantillas de función son solo la mitad de la historia. En el siguiente
capítulo veremos las **plantillas de clase**, que nos permitirán crear
contenedores y estructuras genéricas como los que usa la propia STL.