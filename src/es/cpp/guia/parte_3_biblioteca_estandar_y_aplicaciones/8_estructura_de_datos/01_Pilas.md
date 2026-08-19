---
outline: [2, 3]
---

# Pilas

¿Alguna vez has apilado platos en tu cocina? El plato que pones primero queda abajo y es el
último que vas a usar, mientras que el que pones al final es el primero que sacas. Esa regla
tan simple, casi intuitiva, es la base de una de las estructuras de datos más importantes de
la informática: la **pila** (*stack* en inglés, que podemos traducir justamente como
**pila** o **montón**).

En la STL la pila se llama `std::stack`. Pero antes de ver su sintaxis, es importante que
entendamos por qué esta estructura es tan fundamental: de hecho, el propio C++ la utiliza
por dentro para las llamadas a funciones. Vamos a descubrirlo juntos.

## 1. ¿Qué es una pila?

Una **pila** es una estructura de datos que sigue la regla **LIFO** (*Last In, First Out*),
es decir, **el último en entrar es el primero en salir**. En otras palabras, la traducción de
esa regla al español sería algo así como "último en entrar, primero en salir".

Piénsalo como la torre de platos o la pila de libros que mencionábamos recién:

- Solo puedes **añadir** al tope (push).
- Solo puedes **quitar** del tope (pop).
- Solo puedes **ver** el tope (top).

```
            ┌──────┐  ← top (el último en entrar)
            │  C   │
            │  B   │
            │  A   │  ← el primero en entrar
            └──────┘
```

Nunca puedes meter la mano a la mitad de la torre: la regla es estricta y por eso la pila es
tan predecible. Y esa previsibilidad, te adelanto, es exactamente lo que la hace tan útil.

## 2. La pila de llamadas (call stack)

Antes de ver `std::stack`, quiero contarte un dato fascinante: **C++ usa una pila
internamente** para las llamadas a funciones. Cuando `main()` llama a `funcionA()` y esta a
`funcionB()`, cada llamada se "apila" sobre la anterior:

```cpp
int main() {
    funcionA();  // Se apila main
    // ...
}

void funcionA() {
    funcionB();  // Se apila funcionA sobre main
}

void funcionB() {
    // Aquí la pila tiene: main, funcionA, funcionB
}
```

Cuando `funcionB` termina, se "desapila" y el control vuelve a `funcionA`. Por eso, si una
función se llama a sí misma infinitamente sin caso base, ocurre un **desbordamiento de
pila** (*stack overflow*): la pila se llena y no hay más espacio para seguir apilando
llamadas.

::: info Nota
ℹ️ Ese es el famoso "stack overflow" que da nombre a la web de programadores: se llena la memoria de llamadas cuando las funciones no terminan nunca.
:::

## 3. `std::stack`: La pila de la STL

La STL nos ofrece `std::stack` en el encabezado `<stack>`. Sus operaciones principales son
las siguientes:

| Operación | Descripción |
|---|---|
| `push(x)` | Añade `x` al tope |
| `pop()` | Quita el elemento del tope |
| `top()` | Muestra el elemento del tope (sin quitarlo) |
| `empty()` | Dice si la pila está vacía |
| `size()` | Cantidad de elementos |

```cpp
#include <iostream>
#include <stack>
using namespace std;

int main() {
    stack<int> pila;

    pila.push(10);
    pila.push(20);
    pila.push(30);

    cout << "Tope: " << pila.top() << endl; // 30
    cout << "Tamaño: " << pila.size() << endl; // 3

    pila.pop(); // Quitamos el 30
    cout << "Nuevo tope: " << pila.top() << endl; // 20

    return 0;
}
```

Fíjate en cómo el último valor que entró (el `30`) es el primero que vemos y el primero que
se va: es la regla LIFO funcionando en tiempo real.

::: warning Advertencia
⚠️ `top()` y `pop()` sobre una pila vacía son **comportamiento indefinido**. Siempre comprueba con `empty()` antes de usarlos.
:::

## 4. Recorrer una pila

Las pilas no se recorren con índices como un vector: solo puedes acceder al tope. La forma
de "leer" toda la pila es ir desapilando uno por uno, sin prisa:

```cpp
#include <iostream>
#include <stack>
using namespace std;

int main() {
    stack<int> pila;
    for (int i = 1; i <= 5; i++) pila.push(i);

    while (!pila.empty()) {
        cout << pila.top() << " "; // 5 4 3 2 1
        pila.pop();
    }
    cout << endl;

    return 0;
}
```

::: tip
💡 Fíjate en que el recorrido es **en orden inverso** a la inserción: eso es precisamente la regla LIFO en acción.
:::

## 5. Ejemplo práctico: Invertir una palabra

Un uso clásico de la pila es **invertir el orden** de algo. Si apilamos las letras de una
palabra y luego las desapilamos, obtenemos la palabra al revés. Es una idea sencilla pero
increíblemente poderosa:

```cpp
#include <iostream>
#include <stack>
using namespace std;

string invertir(string texto) {
    stack<char> pila;
    string resultado;

    // Apilamos cada carácter
    for (char c : texto) {
        pila.push(c);
    }

    // Desapilamos: salen en orden inverso
    while (!pila.empty()) {
        resultado += pila.top();
        pila.pop();
    }

    return resultado;
}

int main() {
    cout << invertir("hola") << endl;   // aloh
    cout << invertir("C++") << endl;    // ++C
    return 0;
}
```

## 6. Ejemplo práctico: Paréntesis balanceados

Otro uso muy real: verificar que una expresión tiene los paréntesis correctamente
balanceados, algo que los compiladores hacen todo el tiempo. La idea es sencilla: cada vez
que aparece un símbolo de apertura lo apilamos, y cada vez que aparece uno de cierre, lo
desapilamos comprobando que haga pareja con el tope.

```cpp
#include <iostream>
#include <stack>
using namespace std;

bool balanceado(string expresion) {
    stack<char> pila;

    for (char c : expresion) {
        if (c == '(' || c == '[' || c == '{') {
            pila.push(c); // Abre: apilamos
        }
        else if (c == ')' || c == ']' || c == '}') {
            if (pila.empty()) return false; // Cierra sin haber abierto

            char tope = pila.top();
            pila.pop();

            // El tope debe corresponder con el cierre
            if ((c == ')' && tope != '(') ||
                (c == ']' && tope != '[') ||
                (c == '}' && tope != '{')) {
                return false;
            }
        }
    }

    return pila.empty(); // Si quedan abiertos, no está balanceado
}

int main() {
    cout << balanceado("(a+b)*[c-d]") << endl;   // true
    cout << balanceado("((a+b)") << endl;        // false
    cout << balanceado("([)]") << endl;          // false
    return 0;
}
```

::: info Nota
ℹ️ Este es un ejemplo típico de entrevistas de programación y del funcionamiento real de los analizadores de código: las pilas aparecen donde hay que comprobar "emparejamientos".
:::

## 7. ¿Dónde se usan las pilas?

- **Llamadas a funciones** (pila de ejecución).
- **Deshacer/rehacer** (undo/redo) en editores.
- **Navegación** de un navegador (volver atrás).
- **Paréntesis balanceados** y analizadores de expresiones.
- **Recorridos de árboles** (lo veremos en el capítulo de árboles).

## 8. Buenas prácticas

- Comprueba `empty()` antes de `top()` o `pop()`.
- Usa `size()` para conocer el número de elementos.
- No intentes recorrer con índices: las pilas son LIFO por diseño.
- Elige `std::stack` cuando la regla LIFO sea lo que necesitas, y no la uses para acceso
  arbitrario.

## 9. Resumen rápido

- Una **pila** sigue la regla LIFO (el último en entrar, primero en salir).
- `push` añade al tope; `pop` quita del tope; `top` lo muestra.
- C++ usa una pila internamente para las llamadas a funciones.
- Las pilas sirven para invertir, balancear y gestionar "deshacer".
- En la STL se usa `std::stack` (encabezado `<stack>`).

La pila es simple pero omnipresente: está en los editores, en los navegadores y hasta en el
corazón del propio C++. En el siguiente capítulo veremos a su "hermana": la **cola**, que
invierte la regla y sigue el principio FIFO.