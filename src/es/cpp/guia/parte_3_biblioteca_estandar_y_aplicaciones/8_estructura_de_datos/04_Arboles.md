---
outline: [2, 3]
---

# Árboles

Las listas enlazadas organizan los datos en una línea, y las pilas y colas en un orden
estricto. Pero muchos problemas del mundo real tienen una estructura **jerárquica**: un
directorio de archivos, la organización de una empresa, un árbol genealógico. Para modelar
esa jerarquía, la informática usa los **árboles**, y el nombre no es casualidad: la
estructura se parece muchísimo a un árbol real, con su tronco (la raíz) y sus ramas que se
van dividiendo.

Y no es un tema teórico ni mucho menos: los árboles están por todas partes en C++. Los
`std::map` y `std::set` que ya conocés están implementados internamente con un árbol
balanceado. Cuando los uses, vas a estar tocando un árbol sin saberlo.

## 1. ¿Qué es un árbol?

Un **árbol** es una estructura de datos jerárquica formada por **nodos** conectados entre
sí. A diferencia de las listas (que van en línea recta), acá un nodo puede apuntar a
**varios hijos**:

```
              ┌─────────┐
              │   10    │   ← raíz
              └─────────┘
            /            \
   ┌─────────┐         ┌─────────┐
   │    5    │         │   20    │   ← nodos
   └─────────┘         └─────────┘
       /    \                \
┌─────────┐ ┌─────────┐   ┌─────────┐
│    2    │ │    8    │   │   25    │   ← hojas
└─────────┘ └─────────┘   └─────────┘
```

**Vocabulario esencial:**

| Término | Descripción |
|---|---|
| **Raíz** | El nodo superior, sin padre. |
| **Hijo** | Nodo que cuelga de otro. |
| **Padre** | Nodo del que cuelga un hijo. |
| **Hoja** | Nodo sin hijos. |
| **Nivel** | Profundidad desde la raíz. |
| **Subárbol** | Cualquier nodo con todos sus descendientes. |

## 2. Árboles binarios

El tipo más importante es el **árbol binario**: cada nodo tiene **como máximo dos hijos**
(el **izquierdo** y el **derecho**). Es la base de los árboles de búsqueda, los montículos
y los árboles de expresión, entre muchos otros. En código, un nodo binario se ve así:

```cpp
#include <iostream>
using namespace std;

struct NodoArbol {
    int dato;
    NodoArbol *izquierdo;
    NodoArbol *derecho;

    NodoArbol(int valor)
        : dato(valor), izquierdo(nullptr), derecho(nullptr) {}
};
```

## 3. Árbol binario de búsqueda (BST)

Un **árbol binario de búsqueda** (*Binary Search Tree*, BST) añade una regla mágica que
convierte al árbol en una máquina de buscar increíblemente eficiente:

- Todo lo que es **menor** que el nodo va a la **izquierda**.
- Todo lo que es **mayor** va a la **derecha**.

```
            ┌─────────┐
            │   10    │
            └─────────┘
           /           \
    ┌─────────┐      ┌─────────┐
    │    5    │      │   20    │
    └─────────┘      └─────────┘
    /        \            \
┌─────────┐ ┌─────────┐ ┌─────────┐
│    2    │ │    8    │ │   25    │
└─────────┘ └─────────┘ └─────────┘
```

Gracias a esta regla, **buscar un elemento es rapidísimo**: en cada paso descartamos la
mitad del árbol, porque sabemos que el dato que buscamos solo puede estar en un lado. La
búsqueda es **O(log n)**.

```cpp
#include <iostream>
using namespace std;

struct NodoArbol {
    int dato;
    NodoArbol *izquierdo, *derecho;
    NodoArbol(int v) : dato(v), izquierdo(nullptr), derecho(nullptr) {}
};

class ArbolBinario {
private:
    NodoArbol *raiz = nullptr;

    NodoArbol *insertarRecursivo(NodoArbol *nodo, int valor) {
        if (nodo == nullptr) {
            return new NodoArbol(valor); // Lugar encontrado
        }
        if (valor < nodo->dato) {
            nodo->izquierdo = insertarRecursivo(nodo->izquierdo, valor);
        } else {
            nodo->derecho = insertarRecursivo(nodo->derecho, valor);
        }
        return nodo;
    }

    bool buscarRecursivo(NodoArbol *nodo, int valor) {
        if (nodo == nullptr) return false;
        if (nodo->dato == valor) return true;
        if (valor < nodo->dato) {
            return buscarRecursivo(nodo->izquierdo, valor);
        }
        return buscarRecursivo(nodo->derecho, valor);
    }

public:
    void insertar(int valor) {
        raiz = insertarRecursivo(raiz, valor);
    }

    bool buscar(int valor) {
        return buscarRecursivo(raiz, valor);
    }
};

int main() {
    ArbolBinario arbol;

    arbol.insertar(10);
    arbol.insertar(5);
    arbol.insertar(20);
    arbol.insertar(2);
    arbol.insertar(8);

    cout << "¿Está el 8? " << (arbol.buscar(8) ? "sí" : "no") << endl;
    cout << "¿Está el 15? " << (arbol.buscar(15) ? "sí" : "no") << endl;

    return 0;
}
```

::: tip
💡 La **recursión** es la forma natural de trabajar con árboles: cada subárbol es a su vez un árbol. Si te sientes inseguro con la recursión, repasa el capítulo de funciones recursivas.
:::

## 4. Recorridos de un árbol

¿Cómo "leemos" todos los elementos de un árbol? Existen tres recorridos clásicos, y la
diferencia entre ellos está solo en **cuándo** visitamos el nodo respecto de sus hijos:

| Recorrido | Orden | Resultado del ejemplo |
|---|---|---|
| **Inorden** | Izquierda → Nodo → Derecha | 2, 5, 8, 10, 20, 25 |
| **Preorden** | Nodo → Izquierda → Derecha | 10, 5, 2, 8, 20, 25 |
| **Postorden** | Izquierda → Derecha → Nodo | 2, 8, 5, 25, 20, 10 |

::: info Nota
ℹ️ Fíjate que el **inorden** de un BST imprime los elementos **ordenados de menor a mayor**. Por eso `std::map` recorre en orden: internamente es un árbol balanceado.
:::

```cpp
#include <iostream>
using namespace std;

struct NodoArbol {
    int dato;
    NodoArbol *izquierdo, *derecho;
    NodoArbol(int v) : dato(v), izquierdo(nullptr), derecho(nullptr) {}
};

void inorden(NodoArbol *nodo) {
    if (nodo == nullptr) return;
    inorden(nodo->izquierdo);
    cout << nodo->dato << " ";
    inorden(nodo->derecho);
}

int main() {
    NodoArbol *raiz = new NodoArbol(10);
    raiz->izquierdo = new NodoArbol(5);
    raiz->derecho = new NodoArbol(20);
    raiz->izquierdo->izquierdo = new NodoArbol(2);
    raiz->izquierdo->derecho = new NodoArbol(8);

    inorden(raiz); // 2 5 8 10 20
    cout << endl;

    return 0;
}
```

## 5. Árboles balanceados: la clave del rendimiento

Acá viene una advertencia muy importante: un BST es O(log n) **solo si está balanceado**,
es decir, si los niveles están equilibrados. Si insertamos valores ya ordenados (1, 2, 3,
4...), el árbol se degenera en una lista enlazada y la búsqueda pasa a ser O(n), perdiendo
toda su ventaja.

```
Mal (degenerado):          Bien (balanceado):
┌──1──┐                    ┌─────3─────┐
     └──2──┐               ┌─1─┐      ┌─5─┐
           └──3──┐         │   │      │   │
                 └──4      │   2      4   6
```

Para evitarlo existen los **árboles balanceados** (AVL, Red-Black), que se auto-ajustan tras
cada inserción para mantener la altura mínima. Los `std::map` y `std::set` de la STL usan un
**árbol Red-Black**, y por eso sus operaciones son O(log n) garantizado.

::: warning Advertencia
⚠️ Si estás implementando tu propio BST (para aprender o en entrevistas), recuerda que el rendimiento solo es bueno con datos que no lleguen ya ordenados. En la práctica, deja el balanceo a la STL.
:::

## 6. Otros tipos de árboles

| Tipo | Característica | Uso |
|---|---|---|
| Árbol Red-Black | Auto-balanceado | `std::map`, `std::set` |
| Montículo (heap) | El padre es mayor (o menor) que los hijos | `std::priority_queue` |
| Trie | Árbol de caracteres | Autocompletar, diccionarios |
| Árbol B | Muchos hijos por nodo | Bases de datos, sistemas de archivos |

## 7. Ejemplo real: `std::map` es un árbol

¿Recordás el capítulo de contenedores asociativos? `std::map` guarda las claves ordenadas y
las recorre en orden. Eso es posible precisamente porque **por dentro es un árbol
balanceado**, y esa es la prueba más cercana de que los árboles no son solo teoría:

```cpp
#include <iostream>
#include <map>
using namespace std;

int main() {
    map<int, string> agenda;

    agenda[25] = "Ana";
    agenda[10] = "Carlos";
    agenda[42] = "María";

    // Se recorren en orden de clave: 10, 25, 42
    for (const auto &par : agenda) {
        cout << par.first << ": " << par.second << endl;
    }

    return 0;
}
```

## 8. Buenas prácticas

- Usa los contenedores de la STL (map, set, priority_queue) en lugar de implementar árboles
  en producción.
- Implementa árboles a mano para **aprender** y en ejercicios.
- Piensa siempre en la **recursión** al trabajar con árboles.
- Ten presente el balanceo: un árbol degenerado pierde toda su ventaja.

## 9. Resumen rápido

- Un **árbol** es una estructura jerárquica de nodos.
- En un árbol **binario**, cada nodo tiene como máximo dos hijos.
- En un **BST**, menores a la izquierda y mayores a la derecha.
- La búsqueda en un BST balanceado es O(log n).
- Los recorridos inorden, preorden y postorden definen cómo leer el árbol.
- `std::map`/`std::set` usan árboles Red-Black internamente.

Los árboles resuelven problemas de jerarquía y búsqueda rápida, y ya los venís usando sin
saberlo cada vez que tocas un `std::map`. En el siguiente capítulo veremos su generalización
más poderosa: los **grafos**, donde cualquier nodo puede conectarse con cualquier otro.