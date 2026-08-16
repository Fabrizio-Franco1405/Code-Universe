---
outline: [2, 3]
---

# Gestión manual de memoria (new/delete)

Hasta ahora, todas las variables que hemos creado han sido **automáticas**: nacen cuando se
ejecuta su bloque y mueren cuando el bloque termina, y el compilador se encarga de todo ese
proceso por nosotros. Pero hay situaciones donde necesitamos más control: queremos que un dato
**viva más tiempo** que el bloque donde se creó, o que su tamaño sea **desconocido hasta la
ejecución** del programa.

Para esos casos, C++ nos ofrece la **memoria dinámica**, gestionada con las palabras clave `new`
y `delete`. Es una de las herramientas que más distingue a C++ de otros lenguajes, y también una
de las que más errores provoca si se usa sin cuidado. Por eso este capítulo es de los más
importantes de toda la guía: acá está la diferencia entre un programa que funciona y uno que
"funciona por ahora".

## 1. Memoria automática vs memoria dinámica

Antes de entrar en la sintaxis, veamos la diferencia entre los dos tipos de memoria que
encontraremos:

| Característica | Memoria automática (pila) | Memoria dinámica (montón/heap) |
|---|---|---|
| Quién la reserva | El compilador | El programador |
| Cuándo se libera | Al salir del bloque | Solo cuando se llama `delete` |
| Tamaño | Fijo en compilación | Puede ser variable en ejecución |
| Velocidad | Rápida | Más lenta |
| Riesgo de errores | Bajo | Alto (fugas, accesos inválidos) |

::: info Nota
ℹ️ La memoria dinámica vive en el **montón** (heap), una zona de memoria más grande que la pila
pero más lenta. El programador es el dueño absoluto de todo lo que reserva allí. Como en una casa
alquilada sin contrato: nadie más la va a limpiar por vos.
:::

## 2. Reservar memoria con `new`

La palabra clave `new` reserva memoria en el montón para una variable o un arreglo, y nos devuelve
un **puntero** a esa memoria.

```cpp
#include <iostream>
using namespace std;

int main() {
    // Reservamos memoria para un solo entero
    int *numero = new int(42);

    // Reservamos memoria para un arreglo de 10 enteros
    int *arreglo = new int[10];

    cout << "Valor: " << *numero << endl; // 42

    // Debemos liberar la memoria al terminar
    delete numero;      // Libera la variable
    delete[] arreglo;   // Libera el arreglo

    return 0;
}
```

Observa las diferencias:

- `new int(42)` reserva un solo entero inicializado con `42`.
- `new int[10]` reserva un arreglo de 10 enteros (sin inicializar).
- `delete` libera un solo objeto; `delete[]` libera un arreglo.

::: warning Advertencia
⚠️ Debes usar `delete` con la forma que corresponde a cómo reservaste. Usar `delete[]` con algo
reservado con `new` (o al revés) es **comportamiento indefinido**. Lleva siempre la cuenta de
qué reservaste con qué.
:::

## 3. ¿Qué pasa si olvidamos liberar la memoria?

Si reservamos memoria con `new` y nunca la liberamos con `delete`, el programa **pierde** el
control de esa memoria. A esto se le llama **fuga de memoria** (memory leak).

```cpp
void funcion() {
    int *temp = new int[1000];
    // ... hacemos cosas ...
    // Omitimos delete[] -> los 1000 enteros quedan "perdidos"
}
```

Cada vez que se llame a `funcion()`, se perderán más bytes. En programas que corren durante mucho
tiempo (servidores, videojuegos), esto puede agotar toda la memoria disponible y provocar que el
sistema colapse. Es como dejar la canilla abierta: cada gota parece inofensiva, pero el tanque
eventualmente se llena (o se vacía).

::: danger Peligro
🛑 Una fuga de memoria es silenciosa: no genera un error inmediato, pero con el tiempo degrada el
rendimiento hasta hacer el programa inservible.
:::

## 4. Puntero colgante (dangling pointer)

El error opuesto a la fuga es el **puntero colgante**: un puntero que apunta a memoria que ya fue
liberada.

```cpp
#include <iostream>
using namespace std;

int main() {
    int *p = new int(10);
    delete p;

    // 'p' sigue existiendo, pero apunta a memoria liberada
    cout << *p << endl;
    // ⚠️ Comportamiento indefinido: leemos memoria que ya no es nuestra
}
```

::: danger Peligro
🛑 Acceder a un puntero colgante puede corromper datos, hacer que el programa falle o ser
explotado como vulnerabilidad de seguridad. La regla de oro es: tras liberar con `delete`, asigna
`nullptr` al puntero.
:::

## 5. Doble liberación (double delete)

Otro error clásico es liberar la **misma memoria dos veces**. Si tienes dos punteros apuntando al
mismo lugar y liberas ambos, el segundo `delete` es un error.

```cpp
int *a = new int(5);
int *b = a; // Ambos apuntan al mismo sitio

delete a;
delete b;
// ⚠️ Comportamiento indefinido: liberamos memoria ya liberada
```

Acá también la solución es el `nullptr`: si después de `delete a` le asignamos `nullptr`, el
segundo `delete` sobre `b` sigue siendo un problema porque `b` aún apunta al mismo lugar. La
lección es clara: controla quién es dueño de cada memoria y cuántas veces se libera.

## 6. La solución moderna: olvidar `new` y `delete`

A estas alturas probablemente te estés preguntando: "¿y esto es tan peligroso que mejor no lo
uso?" La respuesta es: **C++ moderno piensa exactamente igual**. Desde C++11, la recomendación es
**nunca usar `new` y `delete` a mano** y, en su lugar, usar los **punteros inteligentes** que
veremos en el siguiente capítulo (`std::unique_ptr`, `std::shared_ptr`).

```cpp
#include <iostream>
#include <memory>
using namespace std;

int main() {
    // Con punteros inteligentes no necesitamos delete
    unique_ptr<int> numero = make_unique<int>(42);
    cout << *numero << endl; // 42

    // La memoria se libera automáticamente al salir de la función
    return 0;
}
```

::: tip
💡 Aprender `new` y `delete` es importante para entender código antiguo y conceptos de memoria,
pero en todo código nuevo deberías usar punteros inteligentes. Ellos hacen exactamente lo mismo,
pero sin que puedas olvidarte del `delete`.
:::

## 7. Buenas prácticas

- Si usas `new`, asocia siempre el `delete` correspondiente lo antes posible.
- Usa `delete[]` para arreglos y `delete` para objetos individuales.
- Asigna `nullptr` a los punteros después de liberarlos.
- En código nuevo, prefiere punteros inteligentes (`std::unique_ptr`, `std::shared_ptr`).
- Evita dos punteros que apunten a la misma memoria dinámica sin control claro de propiedad.

## 8. Resumen rápido

- `new` reserva memoria en el montón; `delete` la libera.
- `new[]`/`delete[]` son para arreglos.
- **Fuga de memoria**: olvidarse de liberar.
- **Puntero colgante**: usar memoria ya liberada.
- **Doble liberación**: liberar la misma memoria dos veces.
- En C++ moderno, usa punteros inteligentes y deja `new`/`delete` para casos muy específicos.

La gestión manual de memoria es el origen de muchos de los errores más famosos de C++. Por eso la
siguiente lección, sobre punteros inteligentes, es quizás la más importante de esta parte: te
mostrará cómo tener todos los beneficios de la memoria dinámica sin sus peligros.