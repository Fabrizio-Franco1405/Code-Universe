---
outline: [2, 3]
---

# Iteradores

Si has usado la STL un poco, habrás visto llamadas como `v.begin()` y `v.end()` en cada
algoritmo, casi como si fueran un ritual obligatorio. Esas funciones devuelven
**iteradores**, y sin entender qué son, gran parte de la STL parece magia. En este
capítulo descubriremos que los iteradores son, en realidad, el pegamento que une
contenedores y algoritmos, la pieza que hace posible que ambos se entiendan sin importar
cómo guarden los datos internamente.

## 1. ¿Qué es un iterador?

Un **iterador** es un objeto que nos permite **recorrer** los elementos de un contenedor
de forma uniforme, sin importar cómo esté guardado cada elemento internamente. Es como un
"puntero" inteligente que sabe avanzar de un elemento al siguiente, y también sabe cuándo
ha llegado al final.

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {10, 20, 30, 40};

    // 'it' es un iterador al primer elemento
    vector<int>::iterator it = v.begin();

    cout << *it << endl;    // 10 (accedemos al valor con '*')
    it++;                   // Avanzamos al siguiente
    cout << *it << endl;    // 20
    it++;
    cout << *it << endl;    // 30

    return 0;
}
```

::: tip
💡 El iterador se usa parecido a un puntero: `*it` para acceder al valor y `++` para
avanzar. Pero a diferencia de los punteros crudos, sabe con qué contenedor trabaja y
cuándo llega al final. Esa consciencia extra es lo que evita un montón de errores.
:::

## 2. `begin()` y `end()`

Todos los contenedores de la STL proporcionan dos funciones clave que funcionan como los
extremos de un camino:

| Función | Devuelve |
|---|---|
| `begin()` | Iterador al **primer** elemento |
| `end()` | Iterador a un elemento **más allá del último** (centinela) |

Aquí está uno de los conceptos más importantes de toda la STL: `end()` **no apunta a un
elemento real**: marca el final. Piénsalo como la meta de una carrera: no es un corredor
más, es la línea que indica que la carrera terminó. Por eso recorrer un contenedor es
comparar con `end()`:

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {5, 6, 7};

    for (vector<int>::iterator it = v.begin(); it != v.end(); ++it) {
        cout << *it << " ";
    }
    cout << endl;

    return 0;
}
```

::: warning Advertencia
⚠️ Nunca desreferencies `end()`. No apunta a ningún elemento: hacer `*v.end()` es
comportamiento indefinido. Los algoritmos devuelven `end()` cuando no encuentran nada, y
debes comparar con él. Esta es una de las reglas de oro de la STL.
:::

## 3. `auto`: el mejor amigo de los iteradores

Escribir `vector<int>::iterator` es largo y frágil: si cambias el tipo del contenedor,
tienes que cambiar también el tipo del iterador a mano. Con `auto` (disponible desde
C++11) el compilador deduce el tipo por nosotros, y nos ahorramos dolores de cabeza.

```cpp
#include <iostream>
#include <map>
using namespace std;

int main() {
    map<string, int> edades = {{"Ana", 25}, {"Carlos", 30}};

    // 'it' será del tipo correcto automáticamente
    for (auto it = edades.begin(); it != edades.end(); ++it) {
        cout << it->first << ": " << it->second << endl;
    }

    return 0;
}
```

Fíjate en la elegancia: no le dijimos al compilador qué tipo de iterador es, él lo
dedujo. Y en el caso del `map`, cada iterador apunta a un par, por eso accedemos con
`it->first` (la clave) y `it->second` (el valor).

::: tip
💡 Con `auto`, el mismo código funciona con `vector`, `map`, `list`... sin cambiar nada.
Es la forma moderna de usar iteradores, y la que verás en casi todo el código
profesional actual.
:::

## 4. Iteradores constantes: `cbegin()` y `cend()`

Las versiones `cbegin()`/`cend()` devuelven iteradores de **solo lectura**. Son ideales
cuando solo quieres recorrer un contenedor sin modificarlo, y nos protegen de errores
accidentales. Es como tener un letrero de "no tocar" en una vitrina: puedes mirar todo lo
que quieras, pero no puedes sacar nada.

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3};

    // cbegin/cend: no se puede modificar el valor
    for (auto it = v.cbegin(); it != v.cend(); ++it) {
        cout << *it << " ";
        // *it = 99;
        // ⚠️ Error: iterador constante
    }
    cout << endl;

    return 0;
}
```

El comentario del código no es casual: si intentas descomentar `*it = 99;`, el compilador
te lo impedirá con un error. Y eso es justo lo que queremos: que los errores se detecten
en compilación, antes de que causen problemas en tiempo de ejecución.

## 5. Tipos de iteradores

Los contenedores ofrecen iteradores con distintas **capacidades**. Conocerlas ayuda a
entender qué algoritmos puede usar cada contenedor y por qué algunos operan más rápido
que otros:

| Tipo de iterador | Capacidades | Contenedores |
|---|---|---|
| De acceso aleatorio | Salto directo (`+n`, `[]`) | `vector`, `deque`, `array` |
| Bidireccional | Avanzar y retroceder (`++`, `--`) | `list`, `map`, `set` |
| Hacia adelante | Solo avanzar (`++`) | `forward_list` |
| De entrada/salida | Leer/escribir secuencial | Flujos (`istream_iterator`) |

```cpp
// Acceso aleatorio: puedo saltar posiciones
vector<int> v = {10, 20, 30, 40};
auto it = v.begin();
cout << it[2] << endl;   // 30 (salto directo)
cout << *(it + 3) << endl; // 40

// Bidireccional: retroceder
list<int> l = {1, 2, 3};
auto lit = l.end();
--lit;   // Ahora apunta al 3
--lit;   // Ahora apunta al 2
cout << *lit << endl; // 2
```

Mira la diferencia: con el `vector` podemos saltar directamente a la posición 3
(`it + 3`), mientras que con la `list` debemos retroceder paso a paso. Esa capacidad de
salto directo es la que permite a ciertos algoritmos ser mucho más rápidos en unos
contenedores que en otros.

## 6. Iteradores de inserción

A veces queremos que un algoritmo **inserte** en un contenedor en lugar de sobrescribir
lo que ya hay. Para eso existen los **iteradores de inserción**, que viven en el
encabezado `<iterator>`:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <iterator>
using namespace std;

int main() {
    vector<int> origen = {1, 2, 3};
    vector<int> destino;

    // back_inserter inserta al final en vez de sobrescribir
    transform(origen.begin(), origen.end(),
              back_inserter(destino),
              [](int n) { return n * 10; });

    for (int n : destino) {
        cout << n << " "; // 10 20 30
    }
    cout << endl;

    return 0;
}
```

::: tip
💡 `back_inserter` crea un iterador que llama a `push_back` automáticamente. Muy útil
cuando el destino no tiene el tamaño adecuado aún, como en este caso, donde `destino`
arranca vacío y crece solo mientras `transform` va produciendo resultados.
:::

## 7. Iteradores de flujo (iostream)

Los iteradores no solo funcionan con contenedores: también con la entrada/salida.
`istream_iterator` y `ostream_iterator` nos permiten usar algoritmos directamente con
`cin`/`cout`, conectando la terminal con la STL de una manera muy elegante:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <iterator>
using namespace std;

int main() {
    // Leer números desde la entrada hasta EOF y copiarlos a un vector
    vector<int> numeros;
    copy(istream_iterator<int>(cin),
         istream_iterator<int>(),
         back_inserter(numeros));

    // Imprimir en orden inverso
    for (auto it = numeros.rbegin(); it != numeros.rend(); ++it) {
        cout << *it << " ";
    }
    cout << endl;

    return 0;
}
```

Este programa lee todos los números que escribas en la terminal hasta que indiques el
final de la entrada (EOF), los guarda en un vector y los imprime en orden inverso. Todo
con los mismos algoritmos y patrones que usamos con los contenedores: la entrada de la
terminal se comporta como un contenedor más.

## 8. Los iteradores inversos: `rbegin()` y `rend()`

Recorrer un contenedor en orden inverso es tan fácil como usar `rbegin()`/`rend()` en
lugar de `begin()`/`end()`. La lógica es exactamente la misma, solo que caminamos desde
el final hacia el principio:

```cpp
vector<int> v = {1, 2, 3, 4, 5};

// Recorrido inverso
for (auto it = v.rbegin(); it != v.rend(); ++it) {
    cout << *it << " "; // 5 4 3 2 1
}
```

## 9. Buenas prácticas

- Usa `auto` para los iteradores.
- Compara siempre con `end()` antes de desreferenciar.
- Usa `cbegin()`/`cend()` cuando solo leas.
- Prefiere `rbegin()`/`rend()` para recorridos inversos.
- Aprovecha `back_inserter` para insertar con algoritmos.

## 10. Resumen rápido

- Un **iterador** permite recorrer un contenedor de forma uniforme.
- `begin()` → primer elemento; `end()` → centinela del final.
- Nunca desreferencies `end()`.
- Con `auto` los iteradores se deducen automáticamente.
- Existen iteradores de acceso aleatorio, bidireccional, etc.
- `back_inserter` y los iteradores de flujo amplían su uso.
- `rbegin()`/`rend()` recorren en orden inverso.

Con los iteradores entendidos, ya tienes la pieza que conecta contenedores y algoritmos.
Pero todavía falta la última pieza del rompecabezas: en el siguiente capítulo veremos las
**lambdas**, el mecanismo moderno para personalizar esos algoritmos.