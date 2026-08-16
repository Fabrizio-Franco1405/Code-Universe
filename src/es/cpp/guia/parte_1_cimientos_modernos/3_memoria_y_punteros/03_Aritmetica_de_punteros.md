---
outline: [2, 3]
---

# Aritmética de punteros

En el capítulo anterior vimos que un puntero almacena la **dirección de memoria** de una variable.
Pero los punteros no solo sirven para guardar direcciones: también se pueden **sumar, restar y
comparar**. A este conjunto de operaciones se le conoce como **aritmética de punteros**, y es una
de las herramientas más poderosas (y a la vez peligrosas) de C++.

Entenderla es clave para trabajar con arreglos, recorrer estructuras de datos y escribir código
eficiente. Eso sí: no te asustes si al principio te parece extraño sumar direcciones de memoria.
Con un par de ejemplos y la analogía correcta, vas a ver que tiene todo el sentido del mundo.

## 1. La relación entre punteros y arreglos

Antes de hablar de aritmética, debemos recordar un detalle clave: el nombre de un arreglo actúa
como un puntero a su **primer elemento**.

```cpp
int numeros[3] = {10, 20, 30};
int *p = numeros; // p apunta al primer elemento (10)
```

Como los elementos de un arreglo están **contiguos en memoria**, si `p` apunta al primer elemento,
entonces `p + 1` apunta al segundo, `p + 2` al tercero, y así sucesivamente. Piénsalo como una fila
de casilleros uno al lado del otro: conocés el primero y, desde ahí, contás los siguientes.

## 2. Sumar y restar: moverse entre elementos

La aritmética de punteros no funciona como la aritmética normal con números: **sumar 1 a un
puntero no suma 1 byte**, sino que avanza hasta el siguiente elemento del tipo al que apunta.

```cpp
#include <iostream>
using namespace std;

int main() {
    int numeros[3] = {10, 20, 30};
    int *p = numeros; // Apunta al primer elemento

    cout << *p << endl;       // 10 (primer elemento)
    cout << *(p + 1) << endl; // 20 (segundo elemento)
    cout << *(p + 2) << endl; // 30 (tercer elemento)

    p++;                      // Avanza al siguiente elemento
    cout << *p << endl;       // 20
    p--;                      // Vuelve al anterior
    cout << *p << endl;       // 10
}
```

::: info Nota
ℹ️ Si un `int` ocupa 4 bytes, `p + 1` en realidad suma 4 bytes a la dirección, porque debe saltar
exactamente un elemento completo. El compilador hace ese cálculo por nosotros: nosotros solo
pensamos en "elementos".
:::

## 3. Distancia entre punteros: restar punteros

Restar dos punteros que apuntan al mismo arreglo nos da el **número de elementos** que hay entre
ellos (no el número de bytes). Es como preguntar "¿cuántos casilleros hay entre el primero y el
quinto?" y que la respuesta sea 4, sin importar cuánto mida cada casillero.

```cpp
#include <iostream>
using namespace std;

int main() {
    int numeros[5] = {1, 2, 3, 4, 5};
    int *inicio = numeros;      // Elemento 0
    int *final = numeros + 4;   // Elemento 4

    int cantidad = final - inicio;
    cout << "Elementos entre inicio y final: " << cantidad << endl; // 4
}
```

## 4. Recorrer un arreglo con punteros

La forma clásica de recorrer un arreglo con índices es:

```cpp
for (int i = 0; i < 5; i++) {
    cout << numeros[i] << " ";
}
```

Con aritmética de punteros podemos hacer exactamente lo mismo:

```cpp
#include <iostream>
using namespace std;

int main() {
    int numeros[5] = {10, 20, 30, 40, 50};

    for (int *p = numeros; p < numeros + 5; p++) {
        cout << *p << " ";
    }
    cout << endl;
}
```

Ambos bucles producen la misma salida: `10 20 30 40 50`. La diferencia es que con punteros
estamos trabajando con direcciones de memoria directamente. Fíjate que incluso la condición del
bucle usa una comparación de punteros: seguimos mientras `p` no pase del último elemento.

::: tip
💡 En C++ moderno, para recorrer arreglos casi siempre se prefiere un `for` basado en rango
(`for (int n : numeros)`), pero entender la aritmética de punteros te permite comprender qué
ocurre "por debajo".
:::

## 5. Aritmética con tipos distintos

Es importante recordar que el avance del puntero depende del **tipo** al que apunta. Veamos la
diferencia:

```cpp
#include <iostream>
using namespace std;

int main() {
    char letras[3] = {'a', 'b', 'c'};
    char *pc = letras;

    double valores[3] = {1.5, 2.5, 3.5};
    double *pd = valores;

    cout << "pc + 1 avanza: " << (pc + 1) - pc << " elemento (1 byte por char)" << endl;
    cout << "pd + 1 avanza: " << (pd + 1) - pd << " elemento (8 bytes por double)" << endl;
}
```

En ambos casos avanzamos "un elemento", pero el puntero a `double` salta 8 bytes porque cada
`double` ocupa más espacio. El compilador siempre usa el tamaño del tipo al que apunta el puntero,
nunca un tamaño fijo.

## 6. Comparación de punteros

Los punteros se pueden comparar con operadores relacionales (`<`, `>`, `==`, etc.) siempre que
apunten a elementos del **mismo arreglo**.

```cpp
#include <iostream>
using namespace std;

int main() {
    int numeros[5] = {1, 2, 3, 4, 5};
    int *p1 = numeros;      // Primer elemento
    int *p2 = numeros + 3;  // Cuarto elemento

    if (p1 < p2) {
        cout << "p1 apunta a un elemento anterior que p2" << endl;
    }

    if (p1 == numeros) {
        cout << "p1 apunta al inicio del arreglo" << endl;
    }
}
```

::: warning Advertencia
⚠️ Comparar punteros que no pertenecen al mismo arreglo es **comportamiento indefinido**. El
compilador no te avisará, pero el resultado puede ser impredecible.
:::

## 7. Cuidado: el puntero fuera de los límites

La mayor fuente de errores con la aritmética de punteros es **salirse de los límites** del
arreglo. El compilador no comprueba que tu puntero apunte a memoria válida; esa responsabilidad
es tuya. Es como manejar un auto sin límites de velocidad: el vehículo no te frena solo.

```cpp
#include <iostream>
using namespace std;

int main() {
    int numeros[3] = {10, 20, 30};
    int *p = numeros;

    cout << *(p + 5) << endl;
    // ⚠️ Estamos leyendo memoria que no pertenece al arreglo
}
```

::: danger Peligro
🛑 Leer o escribir fuera de los límites de un arreglo puede corromper datos de otras variables,
hacer que el programa falle o provocar vulnerabilidades de seguridad. Este es uno de los errores
más peligrosos de C++.
:::

## 8. Buenas prácticas

- Usa aritmética de punteros solo cuando aporte claridad o rendimiento real.
- Verifica siempre los límites antes de desreferenciar.
- Prefiere índices o rangos cuando la lectura del código sea más importante.
- Inicializa los punteros a `nullptr` y comprueba que no lo sean antes de usarlos.

## 9. Resumen rápido

- Sumar/restar a un puntero avanza **elementos**, no bytes.
- El nombre de un arreglo actúa como puntero al primer elemento.
- Restar dos punteros del mismo arreglo da la **cantidad de elementos** entre ellos.
- Los punteros se pueden comparar dentro del mismo arreglo.
- Salirse de los límites es comportamiento indefinido y un peligro real.

La aritmética de punteros es una herramienta potente, pero con gran poder viene gran
responsabilidad. En el siguiente capítulo veremos cómo gestionar la memoria dinámica, donde el
control de la memoria pasa a estar totalmente en tus manos.