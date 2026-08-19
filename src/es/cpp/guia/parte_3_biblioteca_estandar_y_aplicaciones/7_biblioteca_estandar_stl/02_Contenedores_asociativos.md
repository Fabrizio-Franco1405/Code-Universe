---
outline: [2, 3]
---

# Contenedores asociativos

En el capítulo anterior vimos los contenedores secuenciales, esos que guardan sus
elementos en un orden lineal, uno detrás de otro. Pero a menudo, en el mundo real,
necesitamos algo mucho más poderoso: guardar datos con una **clave** para poder
encontrarlos al instante. Imagina que tienes 10,000 productos en tu inventario y
necesitas buscar el del ID 8,473. Recorrerlos todos uno por uno sería lentísimo, ¿verdad?
Los **contenedores asociativos** resuelven exactamente ese problema, y lo resuelven de
una manera elegante y eficiente.

## 1. ¿Qué es un contenedor asociativo?

Un contenedor asociativo guarda pares de **clave → valor** y los organiza de forma que
las búsquedas por clave sean muy rápidas. La clave es como la matrícula de un auto: es
única y nos permite identificar al valor sin tener que examinarlo. En vez de buscar uno
por uno, estos contenedores usan estructuras internas eficientes, como árboles o tablas
hash, que le permiten a la computadora saltar directamente al dato que buscas.

```cpp
#include <iostream>
#include <map>
using namespace std;

int main() {
    map<string, int> edades;

    // Insertar pares clave -> valor
    edades["María"] = 25;
    edades["Carlos"] = 30;
    edades["Ana"] = 22;

    // Buscar por clave (muy rápido)
    cout << "Edad de María: " << edades["María"] << endl;

    return 0;
}
```

Fíjate lo natural que se lee: asociamos un nombre (la clave) con una edad (el valor), y
luego, para saber la edad de María, solo le pasamos su nombre. La estructura hace el resto
del trabajo pesado por nosotros.

## 2. Los dos grandes grupos

Los contenedores asociativos se dividen en dos grupos, según la estructura interna que
usan para organizar los datos. Esta distinción es clave porque define tanto el rendimiento
como el orden en el que recorres los elementos:

| Grupo | Estructura interna | Orden | Búsqueda |
|---|---|---|---|
| **Ordenados** (`map`, `set`) | Árbol balanceado | Ordenados por clave | O(log n) |
| **Sin orden** (`unordered_map`, `unordered_set`) | Tabla hash | Sin orden definido | O(1) promedio |

::: info Nota
ℹ️ "O(log n)" significa que la búsqueda crece muy poco aunque los datos crezcan mucho.
"O(1)" promedio significa tiempo constante: tan rápido con 10 elementos como con 10
millones. En otras palabras, los "unordered" suelen ser los más veloces, pero pierdes el
orden.
:::

## 3. `std::map`: Diccionario ordenado

`std::map` guarda pares clave→valor **ordenados por la clave**. Es exactamente como un
diccionario o una agenda: todo queda organizado alfabéticamente y puedes buscar cualquier
palabra en un abrir y cerrar de ojos.

```cpp
#include <iostream>
#include <map>
using namespace std;

int main() {
    map<string, double> notas;
    notas["Matemáticas"] = 9.5;
    notas["Física"] = 8.0;
    notas["Historia"] = 7.5;

    // Recorrer: se imprime ordenado por clave (Física, Historia, Matemáticas)
    for (const auto &par : notas) {
        cout << par.first << ": " << par.second << endl;
    }

    // Buscar si existe una clave
    if (notas.count("Física") > 0) {
        cout << "Sí hay nota de Física" << endl;
    }

    // Eliminar una clave
    notas.erase("Historia");

    return 0;
}
```

Como ves, el `map` se ocupa de mantener el orden por nosotros: al recorrerlo, las claves
aparecen ordenadas sin que tengamos que hacer nada extra. Acá te mostramos sus
complejidades para que veas lo equilibrado que es:

| Operación | Complejidad |
|---|---|
| Insertar | O(log n) |
| Buscar | O(log n) |
| Eliminar | O(log n) |
| Recorrer | O(n) en orden |

::: tip
💡 `par.first` es la clave y `par.second` es el valor. El `auto &par` evita copiar el par
completo durante el recorrido, lo cual es especialmente importante cuando los valores son
objetos grandes.
:::

## 4. `std::set`: Conjunto de claves únicas

`std::set` es como un `map` **sin valor**: solo guarda claves únicas y ordenadas. Es
perfecto para eliminar duplicados o para comprobar si un elemento pertenece a un grupo.
Piénsalo como la lista de invitados a una fiesta: cada persona aparece una sola vez, sin
importar cuántas veces la anotes.

```cpp
#include <iostream>
#include <set>
using namespace std;

int main() {
    set<int> numeros = {5, 3, 8, 3, 1, 5, 3};

    cout << "Tamaño: " << numeros.size() << endl; // 4 (los duplicados se ignoran)

    // Se recorren ordenados y sin repetir: 1 3 5 8
    for (int n : numeros) {
        cout << n << " ";
    }
    cout << endl;

    // Comprobar si existe
    if (numeros.count(8)) {
        cout << "El 8 está en el conjunto" << endl;
    }

    return 0;
}
```

::: info Nota
ℹ️ Los `set` **no admiten duplicados**: insertar un elemento ya existente simplemente se
ignora. Si necesitas repetidos, existe `std::multiset`, del que hablaremos en breve.
:::

## 5. Versiones sin orden: `unordered_map` y `unordered_set`

Cuando no te importa el orden y priorizas la **velocidad máxima**, llegan las versiones
"unordered", basadas en tablas hash. Son la opción ideal para esos casos donde lo único
que importa es guardar y buscar datos lo más rápido posible.

```cpp
#include <iostream>
#include <unordered_map>
using namespace std;

int main() {
    unordered_map<string, int> contador;

    contador["hola"]++;
    contador["mundo"]++;
    contador["hola"]++;

    cout << "'hola' aparece: " << contador["hola"] << " veces" << endl; // 2
    cout << "'mundo' aparece: " << contador["mundo"] << " veces" << endl; // 1

    return 0;
}
```

Fíjate en el ejemplo de arriba cómo `contador["hola"]++` funciona como un truco genial
para contar palabras: la primera vez inserta la clave con valor 0 y luego la incrementa,
y si la clave ya existe, solo incrementa. En este caso, el `unordered_map` es perfecto.

::: warning Advertencia
⚠️ `unordered_map` es más rápido en la mayoría de casos (O(1) promedio), pero **no
mantiene orden** y su rendimiento puede degradarse si las claves colisionan mucho. Si
necesitas recorrer en orden, usa `map`. No es que uno sea mejor que el otro, es que cada
uno brilla en su terreno.
:::

## 6. Comparación: Ordenado vs sin orden

Para que decidas con fundamentos, acá tienes la comparación lado a lado entre los dos
grupos. Mírala con calma y fíjate en la última fila, que resume cuándo conviene cada uno:

| Característica | `map` / `set` | `unordered_map` / `unordered_set` |
|---|---|---|
| Búsqueda | O(log n) | O(1) promedio |
| Orden de recorrido | Ordenado | Sin orden |
| Requiere clave ordenable | Sí (`<`) | Sí (`hash`) |
| Uso típico | Necesitas orden o rangos | Solo búsquedas rápidas |

::: tip
💡 Si tu aplicación solo guarda y busca datos sin necesidad de recorrerlos en orden, los
contenedores "unordered" suelen ganar. Si recorres en orden o buscas rangos, los
ordenados son mejores. Resumiendo: decide según lo que necesites hacer con los datos,
no según lo que leíste que es "mejor".
:::

## 7. `multimap` y `multiset`

Las versiones `multi` permiten **claves repetidas**. Es decir, una misma clave puede
aparecer varias veces, cada una con su propio valor. En un `multimap`, Juan puede tener
dos notas, y ambas se conservan.

```cpp
#include <iostream>
#include <multimap>
using namespace std;

int main() {
    multimap<string, int> notas;
    notas.insert({"Juan", 8});
    notas.insert({"Juan", 9});
    notas.insert({"Ana", 10});

    // Juan aparece con dos valores
    cout << "Notas de Juan: ";
    auto rango = notas.equal_range("Juan");
    for (auto it = rango.first; it != rango.second; ++it) {
        cout << it->second << " "; // 8 9
    }
    cout << endl;

    return 0;
}
```

Acá aparece la función `equal_range`, que nos devuelve el rango completo de valores
asociados a una clave, desde el primero hasta el último. Es la forma estándar de recorrer
todas las apariciones de una clave repetida.

::: info Nota
ℹ️ Las versiones `multi` son menos comunes. Antes de usarlas, pregúntate si no sería más
claro un `map<string, vector<int>>`, que agrupa todos los valores de una clave en un
vector. En la mayoría de los casos, esa opción es más ordenada y fácil de entender.
:::

## 8. Cómo elegir el contenedor asociativo

Al igual que con los secuenciales, la elección depende de tu necesidad concreta. Esta
tabla te servirá de guía rápida:

| Necesidad | Contenedor |
|---|---|
| Diccionario clave→valor ordenado | `map` |
| Conjunto de valores únicos ordenados | `set` |
| Diccionario de búsqueda rapidísima sin orden | `unordered_map` |
| Conjunto sin orden ni duplicados | `unordered_set` |
| Claves repetidas | `multimap`, `multiset` |

## 9. Buenas prácticas

- Usa `count()` (no `[]`) para comprobar si una clave existe sin crearla. Recuerda que
  `[]` **inserta** la clave si no existe, lo cual puede ser un efecto secundario
  indeseado.
- Recorre con referencias (`auto &`) para evitar copias de pares grandes.
- Prefiere `unordered_map` cuando solo busques, y `map` cuando necesites orden.
- Evita contenedores asociativos dentro de bucles calientes si la clave es compleja de
  hashear.

## 10. Resumen rápido

- Los asociativos guardan **clave → valor** para búsquedas rápidas.
- `map`/`set`: ordenados, búsqueda O(log n).
- `unordered_map`/`unordered_set`: tablas hash, búsqueda O(1) promedio.
- `count()` comprueba existencia sin crear la clave.
- Los ordenados recorren en orden; los "unordered" no.

Los contenedores asociativos te dan la potencia de buscar datos al instante. Pero un
contenedor solo almacena: para **procesar** los datos es donde brillan los algoritmos de
la STL, tema del siguiente capítulo.