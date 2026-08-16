---
outline: [2, 3]
---

# Colas

Si en el capítulo anterior la pila era como apilar platos, la **cola** es como la fila del
supermercado: el primero que llega es el primero en ser atendido, sin excepciones. Esta
regla, llamada **FIFO** (*First In, First Out*), es decir, **primero en entrar, primero en
salir**, gobierna estructuras tan distintas como las colas de impresión, las peticiones a un
servidor o los semáforos de procesos.

En la STL encontramos `std::queue` para la cola clásica y `std::priority_queue` para la
cola con prioridad. Las dos tienen personalidades distintas, y acá vamos a conocerlas a
fondo.

## 1. ¿Qué es una cola?

Una **cola** sigue la regla **FIFO**: el primer elemento en entrar es el primero en salir.
Es el mismo trato justo que esperás en cualquier fila de la vida real.

```
Frente →  ┌──────┬──────┬──────┬──────┬──────┐
          │  A   │  B   │  C   │  D   │  E   │  ← Final
          └──────┴──────┴──────┴──────┴──────┘
          (sale primero)              (entra aquí)
```

- Añades por el **final** (push).
- Quitas por el **frente** (pop).
- Solo ves el **frente** (front).

Fíjate en la diferencia clave con la pila: acá el que entra primero se va primero, mientras
que en la pila el que entraba último era el que salía primero. Dos caras de la misma
moneda: controlar el orden de los elementos.

## 2. `std::queue`: la cola FIFO

La STL nos ofrece `std::queue` en el encabezado `<queue>`. Sus operaciones principales son:

| Operación | Descripción |
|---|---|
| `push(x)` | Añade `x` al final |
| `pop()` | Quita el elemento del frente |
| `front()` | Muestra el frente (el más antiguo) |
| `back()` | Muestra el final (el más reciente) |
| `empty()` / `size()` | Estado y tamaño |

```cpp
#include <iostream>
#include <queue>
using namespace std;

int main() {
    queue<string> cola;

    cola.push("Cliente 1");
    cola.push("Cliente 2");
    cola.push("Cliente 3");

    cout << "Atendiendo: " << cola.front() << endl; // Cliente 1
    cout << "Esperando: " << cola.back() << endl;   // Cliente 3

    cola.pop(); // Se va el Cliente 1
    cout << "Ahora: " << cola.front() << endl;      // Cliente 2

    return 0;
}
```

::: warning Advertencia
⚠️ Igual que en la pila, `front()`/`pop()` sobre una cola vacía es comportamiento indefinido. Verifica con `empty()` primero.
:::

## 3. Ejemplo práctico: simular una fila de atención

Veamos cómo se comporta una cola en una simulación sencilla de atención a clientes. Es el
mismo mecanismo de los turnos que tomás en el banco o en el médico:

```cpp
#include <iostream>
#include <queue>
using namespace std;

int main() {
    queue<int> turnos;

    // Llegan clientes
    for (int i = 1; i <= 5; i++) {
        turnos.push(i);
        cout << "Llega el cliente " << i << endl;
    }

    cout << "\n--- Atendiendo ---\n";
    int numeroTurno = 1;
    while (!turnos.empty()) {
        cout << "Turno " << numeroTurno << ": cliente " << turnos.front() << endl;
        turnos.pop();
        numeroTurno++;
    }

    return 0;
}
```

::: tip
💡 Observa cómo la cola respeta el **orden de llegada**: el cliente 1 se atiende primero. Si esto fuera una pila, se atendería el cliente 5 primero (lo cual sería injusto para una fila real).
:::

## 4. `std::priority_queue`: la cola con prioridad

Ahora vamos a agregarle una vuelta de tuerca interesante. En una cola con prioridad, los
elementos no salen por orden de llegada, sino según una **prioridad**: el elemento con
mayor prioridad sale primero, aunque haya llegado después. Por dentro se implementa con un
**montículo** (*heap*), que es una estructura que vamos a mencionar en el capítulo de
árboles.

```cpp
#include <iostream>
#include <queue>
using namespace std;

int main() {
    priority_queue<int> cola;

    cola.push(30);
    cola.push(10);
    cola.push(50);
    cola.push(20);

    // Sale primero el más grande
    while (!cola.empty()) {
        cout << cola.top() << " "; // 50 30 20 10
        cola.pop();
    }
    cout << endl;

    return 0;
}
```

::: info Nota
ℹ️ En `priority_queue` se usa `top()` (no `front()`) porque el elemento que sale es el de mayor prioridad. Por defecto, el mayor primero; con `greater<int>` puedes invertirlo.
:::

**Ejemplo de cola de emergencia en un hospital:**

Acá está el caso más claro que se me ocurre: un hospital. Cuando llega un paciente crítico,
no importa que haya llegado después que otros: se lo atiende primero. Veamos cómo se
traduce eso a código:

```cpp
#include <iostream>
#include <queue>
using namespace std;

// El paciente con mayor urgencia (número menor = más urgente) sale primero
struct Paciente {
    int urgencia;   // 1 = crítica, 5 = leve
    string nombre;

    // Para priority_queue, 'true' significa menor prioridad
    bool operator<(const Paciente &otro) const {
        return urgencia > otro.urgencia;
    }
};

int main() {
    priority_queue<Paciente> hospital;

    hospital.push({3, "Ana"});
    hospital.push({1, "Carlos"});  // Crítico
    hospital.push({5, "María"});

    while (!hospital.empty()) {
        Paciente p = hospital.top();
        cout << "Atendiendo a " << p.nombre << " (urgencia " << p.urgencia << ")" << endl;
        hospital.pop();
    }

    return 0;
}
```

::: tip
💡 Carlos (urgencia 1) se atiende primero aunque llegara en segundo lugar: eso es la prioridad en acción. Las `priority_queue` son la base de los **planificadores de tareas** de los sistemas operativos.
:::

## 5. Ejemplo práctico: imprimir en orden (FIFO)

Un ejemplo clásico de uso real: la **cola de impresión**. Los documentos se imprimen en el
orden en que se enviaron, como debe ser. Nadie quiere que su documento salga antes que el de
alguien que estaba esperando desde antes:

```cpp
#include <iostream>
#include <queue>
using namespace std;

int main() {
    queue<string> impresora;

    impresora.push("Informe.pdf");
    impresora.push("Fotos.png");
    impresora.push("Carta.txt");

    cout << "Trabajos en cola: " << impresora.size() << endl;

    while (!impresora.empty()) {
        cout << "Imprimiendo: " << impresora.front() << endl;
        impresora.pop();
    }

    return 0;
}
```

## 6. ¿Dónde se usan las colas?

- **Colas de impresión** (orden de llegada).
- **Colas de tareas** en servidores y sistemas operativos.
- **Búferes** en comunicaciones (los datos se procesan en orden).
- **Recorrido por niveles** de árboles (BFS, lo veremos en grafos).
- **Colas con prioridad** en planificadores y algoritmos como Dijkstra.

## 7. Buenas prácticas

- Comprueba `empty()` antes de `front()`/`pop()`.
- Usa `queue` para orden FIFO y `priority_queue` para prioridad.
- En `priority_queue` usa `top()` y define una comparación clara.
- No uses colas para acceso arbitrario: están diseñadas para extremos.

## 8. Resumen rápido

- Una **cola** sigue la regla FIFO (primero en entrar, primero en salir).
- `push` al final; `pop` del frente; `front`/`back` para ver los extremos.
- `priority_queue` saca el elemento de mayor prioridad con `top()`.
- `queue` = `std::queue` (encabezado `<queue>`).
- Las colas modelan filas, búferes y planificadores.

La cola y la pila son los dos extremos de una misma idea: controlar el **orden** de los
elementos. En el siguiente capítulo veremos una estructura que rompe ese esquema y permite
insertar y eliminar en cualquier posición: las **listas enlazadas**.