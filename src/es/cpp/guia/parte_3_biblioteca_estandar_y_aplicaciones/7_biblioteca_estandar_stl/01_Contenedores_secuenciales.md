---
outline: [2, 3]
---

# Contenedores secuenciales

En los capítulos anteriores hemos usado varias piezas de la **Biblioteca Estándar de
Plantillas (STL)** casi sin darnos cuenta: `std::vector`, `std::string`, `std::map`...
Las tomábamos de la estantería como quien agarra una herramienta conocida y listo. Pero
ahora ha llegado el momento de mirarlas con lupa y entender realmente qué son, cómo
funcionan por dentro y, sobre todo, cuándo conviene usar cada una.

La STL es un conjunto de contenedores, algoritmos, iteradores y utilidades que resuelven
los problemas más comunes de la programación sin que tengas que reinventar la rueda.
Piénsalo como una caja de herramientas ya probada y pulida durante décadas: en lugar de
construir tus propias estructuras desde cero, tomas la pieza exacta que tu problema
necesita. En este capítulo nos enfocaremos en los **contenedores secuenciales**, es
decir, aquellos que almacenan sus elementos en una **secuencia ordenada**, uno detrás de
otro, como los libros en un estante.

## 1. ¿Qué es un contenedor?

Un **contenedor** es, en pocas palabras, una estructura de datos que almacena y organiza
elementos. Es el lugar donde viven tus datos mientras tu programa trabaja con ellos. La
STL los divide en dos grandes familias, y es importante que desde ya sepas distinguirlas
porque cada una resuelve un tipo de problema distinto:

| Familia | Característica | Ejemplos |
|---|---|---|
| **Secuenciales** | Los elementos se guardan en un orden lineal. | `vector`, `list`, `deque`, `array` |
| **Asociativos** | Los elementos se guardan con claves para búsquedas rápidas. | `map`, `set`, `unordered_map` |

En este capítulo nos centramos en los secuenciales. No es casualidad que sean los
primeros en estudiarse: son los más usados y los que necesitarás casi a diario,
incluso sin proponértelo.

## 2. `std::vector`: El contenedor estrella

Si tuvieras que quedarte con un solo contenedor de toda la STL, te decimos sin dudar que
sería `std::vector`. Es un **arreglo dinámico**: crece automáticamente cuando añades
elementos y te ofrece un acceso muy rápido por índice. Es, en la práctica, el caballo de
batalla de la programación en C++ moderna.

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> numeros = {1, 2, 3, 4, 5};

    // Añadir elementos
    numeros.push_back(6);
    numeros.push_back(7);

    // Acceder por índice (rápido)
    cout << "Primero: " << numeros[0] << endl;
    cout << "Tamaño: " << numeros.size() << endl;

    // Recorrer con for basado en rango
    for (int n : numeros) {
        cout << n << " ";
    }
    cout << endl;

    return 0;
}
```

¿Por qué es tan popular? Porque combina lo mejor de dos mundos: la velocidad de acceso
de un arreglo clásico y la comodidad de crecer solo cuando lo necesita. Fíjate en la
tabla de complejidades y entenderás por qué domina casi todos los escenarios:

| Operación | Complejidad | Nota |
|---|---|---|
| Acceso por índice (`[]`) | O(1) | Rápidísimo |
| Añadir al final (`push_back`) | O(1)* | Amortizado |
| Insertar/borrar al medio | O(n) | Desplaza elementos |

::: tip
💡 `std::vector` es el contenedor por defecto en C++. Si no sabes cuál elegir, empieza
por este. En la mayoría de los casos será la decisión correcta, y cambiarlo después es
más sencillo de lo que imaginas.
:::

## 3. `std::array`: Tamaño fijo en compilación

Ahora, ¿qué pasa si ya conoces el tamaño **de antemano** y sabes que no cambiará jamás?
Ahí es donde brilla `std::array`. Es un envoltorio moderno del arreglo clásico, pero con
todas las ventajas que nos da la STL: métodos, funciones y esa misma sensación de estar
trabajando con un contenedor de verdad.

```cpp
#include <iostream>
#include <array>
using namespace std;

int main() {
    array<int, 5> numeros = {10, 20, 30, 40, 50};

    cout << "Tamaño: " << numeros.size() << endl;  // 5
    cout << "Primero: " << numeros.front() << endl; // 10
    cout << "Último: " << numeros.back() << endl;   // 50

    // A diferencia del vector, NO tiene push_back (tamaño fijo)
    return 0;
}
```

::: info Nota
ℹ️ `std::array` almacena sus elementos en la **pila** (como un arreglo clásico), no en el
montón. Esto puede ser más rápido, pero el tamaño debe conocerse en tiempo de
compilación. Es el precio de esa velocidad extra.
:::

## 4. `std::deque`: Cola de doble extremo

Su nombre viene del inglés *double-ended queue*, que podemos traducir como **cola de
doble extremo**. Y eso es exactamente lo que hace: te permite añadir y quitar elementos
**rápidamente por ambos extremos**, tanto por el inicio como por el final. Piénsalo como
una fila donde puedes atender tanto al primero como al último sin esfuerzo.

```cpp
#include <iostream>
#include <deque>
using namespace std;

int main() {
    deque<int> cola;

    cola.push_back(30);    // Añade al final
    cola.push_front(10);   // Añade al inicio
    cola.push_back(40);
    cola.push_front(0);

    for (int n : cola) {
        cout << n << " "; // 0 10 30 40
    }
    cout << endl;

    cout << "Primero: " << cola.front() << endl; // 0
    cout << "Último: " << cola.back() << endl;   // 40

    cola.pop_front(); // Quita el primero
    cola.pop_back();  // Quita el último

    return 0;
}
```

::: tip
💡 Usa `deque` cuando necesites inserciones/eliminaciones en **ambos extremos**. En un
`vector` insertar al inicio es costoso (O(n)), porque debe desplazar todos los elementos;
el `deque` resuelve esa situación en tiempo constante.
:::

## 5. `std::list`: Lista doblemente enlazada

`std::list` implementa una **lista doblemente enlazada**. ¿Qué significa eso en criollo?
Que cada elemento guarda un enlace al anterior y al siguiente, como los vagones de un
tren conectados entre sí. La consecuencia es clara: insertar o eliminar en cualquier
posición es muy rápido (O(1)) si tienes el iterador, pero el acceso por índice se vuelve
lento (O(n)), porque para llegar al elemento 50 debes recorrer los 49 anteriores.

```cpp
#include <iostream>
#include <list>
using namespace std;

int main() {
    list<int> valores = {1, 2, 3, 4};

    valores.push_front(0);
    valores.push_back(5);

    // Insertar en el medio con un iterador
    auto it = valores.begin();
    advance(it, 3);           // Avanzamos hasta la posición 3
    valores.insert(it, 99);

    for (int n : valores) {
        cout << n << " "; // 0 1 2 99 3 4 5
    }
    cout << endl;

    return 0;
}
```

::: warning Advertencia
⚠️ En la práctica, `std::list` se usa menos de lo que parece: `std::vector` suele ser más
rápido incluso con inserciones al medio, gracias a la **localidad de caché**. En criollo:
el procesador accede muchísimo más rápido a datos que están juntos en memoria, y eso le
da una ventaja enorme al `vector`. Mide antes de decidir, no te dejes llevar por la
teoría.
:::

## 6. Comparación rápida

Para que tengas el panorama completo de un vistazo, acá te dejamos la comparación de los
cuatro contenedores que hemos visto. Fíjate bien en la fila de cada uno y notarás que no
existe el contenedor perfecto: cada fortaleza viene acompañada de una debilidad:

| Contenedor | Acceso por índice | Insertar al final | Insertar al inicio | Insertar al medio |
|---|---|---|---|---|
| `vector` | O(1) | O(1)* | O(n) | O(n) |
| `array` | O(1) | No | No | No |
| `deque` | O(1) | O(1) | O(1) | O(n) |
| `list` | O(n) | O(1) | O(1) | O(1)** |

\* Amortizado (a veces reasigna). ** Si ya tienes el iterador.

## 7. Cómo elegir el contenedor correcto

Elegir el contenedor adecuado es una de las decisiones más importantes que tomarás al
escribir código con la STL. La buena noticia es que la elección casi siempre responde a
una única pregunta: **¿qué operación necesito hacer con más frecuencia?** Esta tabla te
ayuda a responderla:

| Necesidad | Contenedor |
|---|---|
| Uso general, acceso rápido por índice | `vector` |
| Tamaño fijo conocido en compilación | `array` |
| Añadir/quitar en ambos extremos | `deque` |
| Inserciones/eliminaciones frecuentes con iteradores | `list` |
| No lo sé | `vector` |

::: tip
💡 **Regla práctica**: cuando dudes, usa `std::vector`. Es el contenedor más rápido en la
mayoría de escenarios reales, y cambiarlo después es sencillo. Empezar con él nunca es
un error.
:::

## 8. Buenas prácticas

A lo largo del capítulo hemos visto mucho contenido, así que te dejamos un resumen de las
buenas prácticas que conviene que tengas siempre presente:

- Inicia con `vector` y cambia solo si medimos y lo justifica. No optimices por intuición.
- Prefiere `push_back` sobre `insert` cuando el orden no importe.
- Recorre con `for (auto &elem : contenedor)` en lugar de índices cuando no necesites la
  posición.
- Reserva capacidad con `reserve()` en vectores grandes para evitar reasignaciones.

## 9. Resumen rápido

- Los contenedores **secuenciales** guardan elementos en orden lineal.
- `vector`: arreglo dinámico, el contenedor por defecto.
- `array`: tamaño fijo en compilación.
- `deque`: rápido por ambos extremos.
- `list`: inserción rápida con iteradores, acceso lento.
- Elige `vector` salvo que necesites algo específico.

Los contenedores secuenciales son la base sobre la que se construye casi todo el resto de
la STL. Pero a veces guardar datos en orden lineal no alcanza: en el siguiente capítulo
veremos los **contenedores asociativos**, que organizan los datos con claves para
búsquedas instantáneas.