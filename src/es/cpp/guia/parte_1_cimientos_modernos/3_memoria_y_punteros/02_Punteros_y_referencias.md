---
outline: [2, 3]
---

# Punteros y referencias

En C++, los **punteros** y las **referencias** son herramientas fundamentales para trabajar
directamente con memoria y manipular datos de manera eficiente. Mientras que las referencias
actúan como alias seguros a una variable existente, los punteros permiten almacenar y manipular
**direcciones de memoria**, ofreciendo un control mucho más flexible pero que requiere disciplina
y cuidado.

Dominar estos conceptos es crucial para:

- Acceder y modificar variables desde múltiples funciones o contextos.
- Trabajar con estructuras dinámicas como arrays, listas enlazadas y objetos en memoria dinámica.
- Evitar errores comunes como punteros nulos, acceso a memoria no válida y fugas de memoria.

Este capítulo explora cómo declarar y usar punteros y referencias, sus diferencias y buenas
prácticas, con ejemplos claros para que comprendas no solo la sintaxis, sino el **comportamiento
real en memoria**. No te preocupes si al principio te parece un tema abstracto: es normal, todos
pasamos por ahí. La clave está en ir despacio y visualizar qué está pasando en la memoria.

## 1. Referencias

Las referencias en C++ son **alias de una variable existente**. Una vez definidas, deben ser
inicializadas y no pueden apuntar a otro objeto posteriormente. Esto las hace seguras y fáciles de
usar en comparación con los punteros. Es como ponerle dos nombres a la misma persona: cambia el
nombre, pero el que recibe el mensaje es el mismo.

### 1.1 Declaración y uso de referencias

Para declarar una referencia se utiliza el operador `&` en la definición de la variable:

```cpp
#include <iostream>
using namespace std;

int main() {
    int a = 10;
    int &ref = a; // ref es una referencia a a [!code ++]
    ref = 20;     // modifica a directamente
    cout << "a = " << a << endl; // Salida: 20
}
```

::: tip
💡 Las referencias **siempre deben inicializarse** al declararlas y no se pueden reasignar a otro
objeto. Esa rigidez es, paradójicamente, su mayor fortaleza: el compilador no te va a dejar
olvidar a qué se refieren.
:::

## 2. Punteros

Un puntero es una variable que almacena la **dirección de memoria** de otra variable. Esto permite
manipular datos indirectamente y crear estructuras dinámicas. A diferencia de la referencia, el
puntero no es "otro nombre" del dato: es una variable que *guarda la dirección* donde vive ese dato.

### 2.1 Declaración y asignación de punteros

Para declarar un puntero se utiliza el operador `*`:

```cpp
#include <iostream>
using namespace std;

int main() {
    int a = 10;
    int *p = &a; // p almacena la dirección de a [!code ++]
    cout << "Valor de a: " << *p << endl;  // Accedemos al valor mediante el puntero
}
```

El operador `&` acá hace de "direccionador": toma la dirección de `a` y la guarda en `p`. Luego,
el `*` hace el camino inverso: viaja a esa dirección y nos trae el valor.

::: tip
💡 `*` Se usa para desreferenciar un puntero y acceder al valor al que apunta.
:::

### 2.2 Punteros nulos y verificación

Es importante inicializar los punteros para evitar acceder a direcciones de memoria no válidas:

```cpp
#include <iostream>
using namespace std;

int main() {
    int *p = nullptr; // Puntero nulo [!code ++]
    if (p) {
        cout << *p << endl;
    } else {
        cout << "Puntero no inicializado" << endl;
    }
}
```

::: warning Advertencia
⚠️ Siempre verifica que un puntero no sea nulo antes de desreferenciarlo, para evitar **errores
de acceso a memoria** (segmentation fault). Es de esos errores que el programa "se muere" sin
explicación clara, y la causa suele estar acá.
:::

### 2.3 Diferencias entre punteros y referencias

| Características | Referencia | Puntero |
| --- | --- | --- |
|Inicialización | Obligatoria | Opcional (`nullptr`) |
|Reasignación | No | Sí |
|Seguridad | Alta | Media |
| Sintaxis de uso| Igual que variable | Necesita `*` para desreferenciar |
| Puede apuntar a nulo | No | Sí |

::: tip
💡 Usa referencias cuando quieras un **alias seguro** y punteros cuando necesites **flexibilidad
y control sobre memoria**.
:::

## 3. Punteros a estructuras y arrays

Los punteros permiten manipular estructuras y arrays de manera eficiente:

```cpp
#include <iostream>
using namespace std;

int main() {
    int arr[3] = {1, 2, 3};
    int *p = arr; // Apunta al primer elemento [!code ++]
    for (int i = 0; i < 3; i++) {
        cout << *(p + i) << " "; // Acceso mediante aritmética de punteros
    }
    cout << endl;
}
```

::: tip
💡 El nombre del array `arr` **ya actúa como puntero** al primer elemento, pero se puede manipular
con punteros explícitos para mayor flexibilidad.
:::

## 4. Ejemplo práctico

Supongamos que queremos modificar varios valores de un array desde una función:

```cpp{4-8}
#include <iostream>
using namespace std;

void incrementarArray(int *arr, int size) {     // [!code ++]
    for (int i = 0; i < size; i++) {            // [!code ++]
        arr[i] += 10;                           // [!code ++]
    }                                           // [!code ++]
}                                               // [!code ++]

int main() {
    int datos[3] = {5, 10, 15};
    incrementarArray(datos, 3);
    for (int val : datos) cout << val << " "; // Salida: 15 20 25
    cout << endl;
}
```

::: tip
💡 Pasar el array como puntero permite modificar directamente los valores originales sin hacer
copias. Es de los primeros ejemplos donde ves por qué los punteros existen: no queremos duplicar
tres valores cuando podemos trabajar sobre los mismos.
:::

## 5. Buenas prácticas

- Inicializa siempre los punteros (`nullptr` si no apuntan a algo).
- Prefiere **referencias** cuando no necesites reasignar la dirección, para mayor seguridad.
- Verifica los punteros antes de desreferenciarlos.
- Documenta claramente si una función modifica variables a través de punteros o referencias.

## 6. Resumen rápido

- **Referencia**: alias seguro de una variable, inicialización obligatoria, no puede apuntar a
  otro objeto.
- **Puntero**: almacena dirección de memoria, puede ser nulo o reasignable, requiere desreferencia
  para acceder al valor.
- Usar referencias para seguridad y claridad, punteros para flexibilidad y manipulación de memoria
  dinámica.
- Siempre verificar punteros antes de usarlos para evitar errores de acceso a memoria.

Ya tienes los punteros y las referencias bajo control. Pero los punteros tienen un superpoder
extra: se pueden sumar, restar y comparar. En el siguiente capítulo veremos la **aritmética de
punteros**, que es la llave para recorrer arreglos como lo hacen los programas de verdad.