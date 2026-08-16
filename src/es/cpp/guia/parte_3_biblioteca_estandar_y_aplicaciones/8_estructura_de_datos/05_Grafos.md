---
outline: [2, 3]
---

# Grafos

Un árbol solo permite que cada nodo tenga un padre y varios hijos, siempre en una jerarquía
ordenada. Pero el mundo real no es tan ordenado: un mapa de carreteras conecta ciudades de
cualquier forma, las redes sociales conectan personas sin jerarquías, y las redes eléctricas
conectan nodos en todas direcciones. Para modelar estos sistemas existe el **grafo**, la
estructura de datos más general y versátil de todas. La palabra viene del griego
*graphos*, que significa **escritura** o **descripción**: justamente, un grafo "describe"
las conexiones entre las cosas.

## 1. ¿Qué es un grafo?

Un **grafo** es un conjunto de **nodos** (o **vértices**) conectados por **aristas** (o
**arcos**). A diferencia de los árboles:

- No hay raíz ni jerarquía.
- Cualquier nodo puede conectarse con cualquier otro.
- Pueden existir ciclos (volver al punto de partida).

```
        A ──────── B
        │ \       / │
        │   \   /   │
        │     X     │
        │   /   \   │
        │ /       \ │
        D ──────── C
```

Los grafos pueden ser de varios tipos, según cómo sean sus aristas:

| Tipo | Descripción | Ejemplo |
|---|---|---|
| **Dirigido** | Las aristas tienen dirección | Redes sociales (seguidores) |
| **No dirigido** | Las aristas son bidireccionales | Carreteras entre ciudades |
| **Ponderado** | Las aristas tienen peso/coste | Distancias, tiempos |
| **Con ciclos / sin ciclos** | Según si se puede volver al inicio | Árboles = grafos sin ciclos |

## 2. ¿Cómo representar un grafo en código?

Para trabajar con grafos en un programa, primero hay que decidir cómo guardarlos. Hay dos
formas clásicas, y cada una tiene sus ventajas.

### 2.1 Matriz de adyacencia

Una **matriz de adyacencia** es una matriz `n x n` donde `[i][j]` indica si existe conexión
entre el nodo `i` y el nodo `j`. En el ejemplo de arriba, con 4 nodos:

```cpp
// Grafo de 4 nodos
bool grafo[4][4] = {
    {0, 1, 0, 1},  // A conecta con B y D
    {1, 0, 1, 0},  // B conecta con A y C
    {0, 1, 0, 1},  // C conecta con B y D
    {1, 0, 1, 0},  // D conecta con A y C
};
```

**Ventaja**: comprobar si dos nodos están conectados es O(1). **Desventaja**: ocupa mucho
espacio (O(n²)), aunque el grafo tenga pocas aristas.

### 2.2 Lista de adyacencia

Para cada nodo, guardamos la **lista** de sus vecinos. Es la representación más usada en la
práctica, porque solo guarda las conexiones que realmente existen:

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    // 4 nodos (0=A, 1=B, 2=C, 3=D)
    vector<vector<int>> grafo(4);

    grafo[0].push_back(1); // A -> B
    grafo[0].push_back(3); // A -> D
    grafo[1].push_back(0); // B -> A
    grafo[1].push_back(2); // B -> C
    grafo[2].push_back(1); // C -> B
    grafo[2].push_back(3); // C -> D
    grafo[3].push_back(0); // D -> A
    grafo[3].push_back(2); // D -> C

    // Imprimir vecinos de cada nodo
    for (int nodo = 0; nodo < 4; nodo++) {
        cout << "Vecinos de " << nodo << ": ";
        for (int vecino : grafo[nodo]) {
            cout << vecino << " ";
        }
        cout << endl;
    }

    return 0;
}
```

::: tip
💡 En grafos **ponderados**, la lista guarda pares `(vecino, peso)`. En grafos con etiquetas, se usa `map<string, vector<string>>`.
:::

## 3. Recorrido en profundidad (DFS)

Una vez que tenemos el grafo, lo que queremos es **recorrerlo**. La primera estrategia es
**DFS** (*Depth First Search*, **búsqueda en profundidad**): recorre el grafo yendo "lo más
profundo que pueda" antes de retroceder, como quien baja hasta el fondo de una cueva antes
de volver a probar otro pasillo. Se implementa con recursión (o una pila explícita, ¡mirá
qué bien se conectan los capítulos!).

```
Recorrido DFS desde A: A → B → C → D
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

void dfs(int nodo, const vector<vector<int>> &grafo, vector<bool> &visitado) {
    visitado[nodo] = true;
    cout << nodo << " ";

    for (int vecino : grafo[nodo]) {
        if (!visitado[vecino]) {
            dfs(vecino, grafo, visitado);
        }
    }
}

int main() {
    vector<vector<int>> grafo(4);
    grafo[0] = {1, 3};
    grafo[1] = {0, 2};
    grafo[2] = {1, 3};
    grafo[3] = {0, 2};

    vector<bool> visitado(4, false);
    dfs(0, grafo, visitado); // 0 1 2 3

    return 0;
}
```

::: info Nota
ℹ️ El `vector<bool> visitado` evita caer en ciclos infinitos. Sin él, un grafo con ciclos nunca terminaría de recorrerse.
:::

## 4. Recorrido en amplitud (BFS)

La segunda estrategia es **BFS** (*Breadth First Search*, **búsqueda en amplitud**): recorre
el grafo **por niveles**, primero los vecinos directos, luego los vecinos de esos vecinos, y
así sucesivamente. Se implementa con una **cola**, de la misma manera que vimos en el
capítulo de colas:

```cpp
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

void bfs(int inicio, const vector<vector<int>> &grafo) {
    vector<bool> visitado(grafo.size(), false);
    queue<int> cola;

    visitado[inicio] = true;
    cola.push(inicio);

    while (!cola.empty()) {
        int nodo = cola.front();
        cola.pop();
        cout << nodo << " ";

        for (int vecino : grafo[nodo]) {
            if (!visitado[vecino]) {
                visitado[vecino] = true;
                cola.push(vecino);
            }
        }
    }
}

int main() {
    vector<vector<int>> grafo(4);
    grafo[0] = {1, 3};
    grafo[1] = {0, 2};
    grafo[2] = {1, 3};
    grafo[3] = {0, 2};

    bfs(0, grafo); // 0 1 3 2

    return 0;
}
```

### ¿DFS o BFS?

| Algoritmo | Recorrido | Uso típico |
|---|---|---|
| **DFS** | Profundidad | Detectar ciclos, resolver laberintos |
| **BFS** | Por niveles | **Camino más corto** en grafos no ponderados |

::: tip
💡 Si necesitas el **camino más corto** entre dos nodos en un grafo sin pesos, BFS es tu algoritmo: el primer nivel en el que encuentras el destino es el más corto.
:::

## 5. El camino más corto: Dijkstra

En grafos **ponderados**, donde las aristas tienen coste, la historia cambia: el camino más
corto no siempre es el que tiene menos pasos, sino el que tiene el menor coste total. Para
eso existe el algoritmo de **Dijkstra**, que usa una `priority_queue` (como vimos en el
capítulo de colas) para siempre explorar primero el nodo más barato:

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <limits>
using namespace std;

// Grafo ponderado: cada vecino es un par (nodo, peso)
void dijkstra(int inicio, const vector<vector<pair<int, int>>> &grafo) {
    int n = grafo.size();
    vector<int> distancia(n, numeric_limits<int>::max());
    vector<bool> visitado(n, false);

    distancia[inicio] = 0;
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> cola;
    cola.push({0, inicio}); // (distancia, nodo)

    while (!cola.empty()) {
        auto [dist, nodo] = cola.top();
        cola.pop();

        if (visitado[nodo]) continue;
        visitado[nodo] = true;

        for (auto [vecino, peso] : grafo[nodo]) {
            int nuevaDistancia = dist + peso;
            if (nuevaDistancia < distancia[vecino]) {
                distancia[vecino] = nuevaDistancia;
                cola.push({nuevaDistancia, vecino});
            }
        }
    }

    cout << "Distancias desde " << inicio << ":\n";
    for (int i = 0; i < n; i++) {
        cout << "  Nodo " << i << ": " << distancia[i] << endl;
    }
}

int main() {
    vector<vector<pair<int, int>>> grafo(4);
    grafo[0] = {{1, 5}, {3, 10}};  // A->B(5), A->D(10)
    grafo[1] = {{2, 3}};            // B->C(3)
    grafo[2] = {{3, 1}};            // C->D(1)
    grafo[3] = {};

    dijkstra(0, grafo);

    return 0;
}
```

::: info Nota
ℹ️ No te preocupes si Dijkstra parece complejo: es uno de los algoritmos más famosos de la informática y aparece en los GPS. Con el tiempo y la práctica te resultará natural.
:::

## 6. ¿Dónde se usan los grafos?

- **Mapas y GPS**: calcular rutas (Dijkstra, A*).
- **Redes sociales**: sugerencias de amigos, propagación.
- **Internet**: enrutamiento de paquetes.
- **Bases de datos**: modelos de grafos (Neo4j).
- **Motores de búsqueda**: el ranking de páginas (PageRank de Google es un algoritmo sobre
  grafos).

## 7. Buenas prácticas

- Representa grafos con **lista de adyacencia** salvo que la matriz sea imprescindible.
- Usa `vector<bool> visitado` en todos los recorridos para evitar ciclos.
- BFS para caminos más cortos sin pesos; Dijkstra para grafos ponderados.
- Usa `priority_queue` para Dijkstra.

## 8. Resumen rápido

- Un **grafo** conecta nodos con aristas sin jerarquía.
- Puede ser dirigido, no dirigido y ponderado.
- Se representa con matriz o **lista de adyacencia**.
- **DFS** recorre en profundidad (recursión o pila).
- **BFS** recorre por niveles (cola) y halla caminos más cortos.
- **Dijkstra** halla el camino de menor coste en grafos ponderados.
- Los grafos modelan mapas, redes y conexiones de todo tipo.

Con pilas, colas, listas, árboles y grafos, ya tenés un arsenal completo de estructuras de
datos, el mismo que usás todos los días aunque no lo veas. En el siguiente capítulo
dejaremos la teoría de datos y nos centraremos en la **entrada/salida** de C++: cómo
comunicarte con el mundo exterior.