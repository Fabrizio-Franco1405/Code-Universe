---
outline: [2, 3]
---

# Listas enlazadas

En el capítulo de contenedores vimos `std::list`, que es una **lista doblemente enlazada**
de la STL. Ahora vamos a entender cómo funciona por dentro, porque las listas enlazadas son
una de las estructuras de datos más fundamentales que todo programador debe conocer, tanto
para entender realmente lo que hace la STL como para enfrentar las clásicas preguntas de
las entrevistas de trabajo.

## 1. ¿Qué es una lista enlazada?

Una **lista enlazada** es una secuencia de **nodos**, donde cada nodo contiene un **dato**
y un **puntero** al siguiente nodo. La palabra "enlazada" viene justamente de ahí: cada
nodo está enlazado con el siguiente, como los eslabones de una cadena.

```
┌──────┐     ┌──────┐     ┌──────┐     ┌──────┐
│ 10   │     │ 20   │     │ 30   │     │ 40   │
│ ────►│────►│ ────►│────►│ ────►│────►│ NULL │
└──────┘     └──────┘     └──────┘     └──────┘
```

- Cada nodo apunta al **siguiente**.
- El último apunta a `nullptr` (fin de la lista).
- El primer nodo se conoce como **cabeza** (*head*).

A diferencia de un `vector` (que guarda los elementos en un bloque contiguo de memoria),
los nodos de una lista pueden estar **dispersos** por toda la memoria: cada uno guarda la
dirección del siguiente. Es como si en lugar de guardar todos los libros juntos en un
estante, cada libro tuviera una nota pegada que dice dónde está el siguiente.

## 2. ¿Por qué existe? Ventajas y desventajas

| Característica | `vector` | Lista enlazada |
|---|---|---|
| Acceso por índice | O(1) | O(n) (hay que recorrer) |
| Insertar/eliminar al inicio | O(n) | O(1) |
| Insertar/eliminar al medio | O(n) | O(1)* |
| Memoria | Contigua | Dispersa (más punteros) |
* Si ya tienes el nodo anterior.

::: info Nota
ℹ️ La lista brilla cuando insertas o eliminas **con frecuencia en posiciones intermedias**, porque no hay que desplazar elementos: solo se reajustan punteros. El `vector`, en cambio, debe mover todos los elementos.
:::

## 3. Implementar una lista enlazada simple

La mejor forma de entender cómo funciona una estructura es construirla con tus propias
manos. Vamos a crear nuestra propia lista enlazada simple para ver exactamente qué pasa
por dentro:

```cpp
#include <iostream>
using namespace std;

// Un nodo: guarda el dato y un puntero al siguiente
struct Nodo {
    int dato;
    Nodo *siguiente;

    Nodo(int valor) : dato(valor), siguiente(nullptr) {}
};

// La lista: sabe dónde está la cabeza
class ListaEnlazada {
private:
    Nodo *cabeza = nullptr;

public:
    // Añadir al inicio
    void insertarInicio(int valor) {
        Nodo *nuevo = new Nodo(valor);
        nuevo->siguiente = cabeza;
        cabeza = nuevo;
    }

    // Añadir al final
    void insertarFinal(int valor) {
        Nodo *nuevo = new Nodo(valor);
        if (cabeza == nullptr) {
            cabeza = nuevo;
            return;
        }
        Nodo *actual = cabeza;
        while (actual->siguiente != nullptr) {
            actual = actual->siguiente; // Recorremos hasta el final
        }
        actual->siguiente = nuevo;
    }

    // Recorrer e imprimir
    void imprimir() {
        Nodo *actual = cabeza;
        while (actual != nullptr) {
            cout << actual->dato << " -> ";
            actual = actual->siguiente;
        }
        cout << "nullptr" << endl;
    }

    // Liberar memoria
    ~ListaEnlazada() {
        while (cabeza != nullptr) {
            Nodo *temp = cabeza;
            cabeza = cabeza->siguiente;
            delete temp;
        }
    }
};

int main() {
    ListaEnlazada lista;

    lista.insertarFinal(10);
    lista.insertarFinal(20);
    lista.insertarInicio(5);

    lista.imprimir(); // 5 -> 10 -> 20 -> nullptr

    return 0;
}
```

::: warning Advertencia
⚠️ Esta implementación usa `new`/`delete` manuales solo con fines educativos. En tu código real, usa `std::list` o `std::forward_list` que ya gestionan la memoria por ti.
:::

## 4. Lista simple vs doblemente enlazada

La lista que implementamos es **simplemente enlazada**, porque cada nodo apunta solo al
siguiente. La STL también nos ofrece la **doblemente enlazada**, donde cada nodo guarda dos
punteros: uno al anterior y otro al siguiente. La ventaja es que podés recorrerla en ambos
sentidos:

| Tipo | Nodos apuntan | Puedo recorrer | STL |
|---|---|---|---|
| Simple | Al siguiente | Solo hacia adelante | `std::forward_list` |
| Doble | Al anterior y al siguiente | En ambos sentidos | `std::list` |

```
Lista doblemente enlazada:
┌─────────┐   ┌─────────┐   ┌─────────┐
│ NULL ◄──┼──►│ 20 ◄────┼──►│ 30 ◄──► NULL │
└─────────┘   └─────────┘   └─────────┘
```

## 5. Ejemplo: Invertir una lista enlazada

Un clásico de entrevistas: invertir la dirección de todos los punteros. Parece simple, pero
tiene un truco muy importante que conviene interiorizar bien:

```cpp
#include <iostream>
using namespace std;

struct Nodo {
    int dato;
    Nodo *siguiente;
    Nodo(int v) : dato(v), siguiente(nullptr) {}
};

void invertir(Nodo *&cabeza) {
    Nodo *anterior = nullptr;
    Nodo *actual = cabeza;

    while (actual != nullptr) {
        Nodo *siguiente = actual->siguiente; // Guardamos el siguiente
        actual->siguiente = anterior;        // Invertimos el puntero
        anterior = actual;                   // Avanzamos
        actual = siguiente;
    }

    cabeza = anterior; // La nueva cabeza es el último
}

int main() {
    Nodo *cabeza = new Nodo(1);
    cabeza->siguiente = new Nodo(2);
    cabeza->siguiente->siguiente = new Nodo(3);

    invertir(cabeza);

    // 3 -> 2 -> 1
    for (Nodo *n = cabeza; n != nullptr; n = n->siguiente) {
        cout << n->dato << " ";
    }
    cout << endl;

    return 0;
}
```

::: tip
💡 La clave de la inversión: guardar el nodo siguiente antes de cambiar el puntero, para no perder el resto de la lista.
:::

## 6. La lista en la práctica: `std::list` y `std::forward_list`

Como ya vimos en la STL, en la práctica casi nunca necesitás implementar listas a mano.
`std::list` te da todo lo que necesitás listo para usar, incluyendo la inserción en
cualquier posición con iteradores:

```cpp
#include <iostream>
#include <list>
using namespace std;

int main() {
    list<int> lista = {1, 2, 3, 4};

    lista.push_front(0);
    lista.push_back(5);

    // Insertar en el medio con iterador
    auto it = lista.begin();
    advance(it, 2);
    lista.insert(it, 99);

    for (int n : lista) cout << n << " "; // 0 1 99 2 3 4 5
    cout << endl;

    return 0;
}
```

::: warning Advertencia
⚠️ Recuerda la advertencia del capítulo de contenedores: `std::vector` suele ser más rápido incluso con inserciones al medio, gracias a la localidad de caché. Mide antes de asumir que la lista es mejor.
:::

## 7. ¿Dónde se usan las listas enlazadas?

- Como base de otras estructuras (pilas, colas).
- En sistemas con memoria fragmentada donde los bloques contiguos no son posibles.
- En editores de texto para insertar/eliminar caracteres frecuentemente.
- En tablas hash para resolver colisiones.

## 8. Buenas prácticas

- En tu código real, usa `std::list` o `std::forward_list`.
- Implementa listas a mano solo para **aprender** o para entrevistas.
- Libera siempre la memoria de los nodos al destruir la lista.
- Prefiere `vector` salvo que midas y justifiques la lista.

## 9. Resumen rápido

- Una **lista enlazada** une nodos con punteros.
- Insertar/eliminar es rápido; acceder por índice es lento.
- Simple = solo siguiente; doble = anterior y siguiente.
- La STL ofrece `std::list` (doble) y `std::forward_list` (simple).
- Implementar listas a mano es un ejercicio formativo clásico.

Las listas enlazadas te enseñan a pensar en términos de punteros y estructura, que es una
forma de razonar que te va a acompañar toda la vida como programador. En el siguiente
capítulo subiremos de nivel con los **árboles**, estructuras jerárquicas usadas en mapas,
bases de datos y muchos algoritmos.