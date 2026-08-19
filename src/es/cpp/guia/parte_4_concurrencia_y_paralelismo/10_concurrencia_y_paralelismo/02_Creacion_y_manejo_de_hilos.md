---
outline: [2, 3]
---

# Creación y manejo de hilos

En el capítulo anterior vimos la teoría y el peligro de los data races. Ahora es el momento de la práctica: aprender a **crear hilos** con `std::thread` y gestionarlos correctamente. Es la base sobre la que se construye toda la concurrencia de C++.

## 1. Crear un hilo con `std::thread`

Un hilo se crea pasando una función al constructor de `std::thread`:

```cpp
#include <iostream>
#include <thread>
using namespace std;

void saludo() {
    cout << "Hola desde el hilo" << endl;
}

int main() {
    thread t(saludo); // Crea y lanza el hilo

    cout << "Hola desde el hilo principal" << endl;

    t.join(); // Esperamos a que termine
    return 0;
}
```

Los hilos también pueden lanzar **lambdas**:

```cpp
#include <iostream>
#include <thread>
using namespace std;

int main() {
    thread t([]() {
        cout << "Soy un hilo lambda" << endl;
    });

    t.join();
    return 0;
}
```

::: warning Advertencia
⚠️ Un `std::thread` **destruido sin `join()` ni `detach()`** provoca que el programa termine abruptamente (`std::terminate`). Todo hilo debe unirse o separarse antes de morir.
:::

## 2. `join()` y `detach()`: El ciclo de vida

Todo hilo tiene dos destinos posibles:
| Método | Efecto |
|---|---|
| `join()` | El programa **espera** a que el hilo termine |
| `detach()` | El hilo sigue **por su cuenta** (se "suelta") |

```cpp
#include <iostream>
#include <thread>
using namespace std;

void tarea() {
    for (int i = 0; i < 3; i++) {
        cout << "Trabajando... " << i << endl;
    }
}

int main() {
    thread t(tarea);

    t.join(); // Esperamos: main no continúa hasta que tarea termine

    cout << "El hilo terminó, main continúa" << endl;
    return 0;
}
```

::: tip
💡 Usa `join()` en casi todos los casos: garantiza que el hilo terminó antes de seguir. `detach()` es arriesgado: si el hilo accede a datos que main destruye, es un error.
:::

## 3. Pasar argumentos al hilo

Los argumentos se pasan como parámetros extra al constructor de `std::thread`:

```cpp
#include <iostream>
#include <thread>
using namespace std;

void sumar(int a, int b, int id) {
    cout << "Hilo " << id << ": " << a << " + " << b << " = " << a + b << endl;
}

int main() {
    thread t1(sumar, 3, 4, 1);
    thread t2(sumar, 10, 20, 2);

    t1.join();
    t2.join();
    return 0;
}
```

::: warning Advertencia
⚠️ Los argumentos se copian al hilo. Si pasas una **referencia** para modificar el original, debes envolverla con `std::ref`, o el hilo trabajará con una copia.
:::

```cpp
#include <iostream>
#include <thread>
using namespace std;

void incrementar(int &valor) {
    valor++;
}

int main() {
    int contador = 0;

    // std::ref permite pasar una referencia real al hilo
    thread t(incrementar, ref(contador));
    t.join();

    cout << contador << endl; // 1
    return 0;
}
```

## 4. Múltiples hilos: El poder del paralelismo

Con varios hilos, el orden de ejecución es **impredecible** (lo decide el sistema operativo):

```cpp
#include <iostream>
#include <thread>
using namespace std;

void tarea(int id) {
    cout << "Hilo " << id << " ejecutándose" << endl;
}

int main() {
    thread hilos[4];

    for (int i = 0; i < 4; i++) {
        hilos[i] = thread(tarea, i);
    }

    for (int i = 0; i < 4; i++) {
        hilos[i].join();
    }

    return 0;
}
```

::: info Nota
ℹ️ La salida puede aparecer en cualquier orden (0, 2, 1, 3...). Además, sin sincronización, los `cout` pueden incluso **entremezclarse**. Eso es la concurrencia en su estado más puro.
:::

## 5. Hilos en bucles y números de núcleos

Una pregunta común: ¿cuántos hilos crear? Depende del hardware. Puedes consultar los núcleos con:

```cpp
#include <iostream>
#include <thread>
using namespace std;

int main() {
    unsigned int nucleos = thread::hardware_concurrency();
    cout << "Tu CPU tiene " << nucleos << " núcleos lógicos" << endl;
    return 0;
}
```

::: tip
💡 Crear **más hilos que núcleos** no acelera el cómputo: los hilos extra solo se turnan los mismos núcleos, con el coste de cambiar de contexto.
:::

## 6. `std::jthread`: El hilo seguro (C++20)

Desde **C++20** existe `std::jthread` ("joining thread"): se **une automáticamente** en su destructor, evitando el `std::terminate` si olvidamos `join()`. Además soporta cancelación cooperativa.

```cpp
#include <iostream>
#include <thread>
using namespace std;

int main() {
    jthread t([]() {
        cout << "Trabajo del jthread" << endl;
    });

    // No necesitamos join(): el destructor de t lo hace
    cout << "Main termina y el jthread se une solo" << endl;
    return 0;
}
```

::: tip
💡 `std::jthread` es la opción recomendada en código moderno: olvidarse del `join()` ya no es un error fatal.
:::

## 7. ¿Hilos o `std::async`?

Para tareas que devuelven un resultado, `std::async` es más cómodo que gestionar hilos a mano (lo veremos en el capítulo de futuros):

```cpp
#include <iostream>
#include <future>
using namespace std;

int calcular() { return 6 * 7; }

int main() {
    future<int> resultado = async(calcular);
    cout << "Resultado: " << resultado.get() << endl; // 42
    return 0;
}
```

## 8. Buenas prácticas

- Siempre `join()` (o `detach()` explícito) tus hilos.
- Usa `std::jthread` en código moderno.
- Pasa referencias con `std::ref` si el hilo debe modificar el original.
- No crees más hilos que núcleos para cómputo intensivo.
- Evita acceder a datos compartidos sin sincronización.

## 9. Resumen rápido

- `std::thread(funcion, args...)` crea y lanza un hilo.
- `join()` espera; `detach()` suelta el hilo.
- Sin `join()`/`detach()`, destruir el hilo provoca `std::terminate`.
- Los argumentos se pasan como parámetros; `std::ref` para referencias.
- `std::jthread` (C++20) se une automáticamente.
- `std::async` es más cómodo para tareas con resultado.
- El orden de ejecución de los hilos es impredecible.

Ya sabes lanzar hilos. Ahora viene la parte crítica: **sincronizarlos** para que no pisen los datos compartidos. Ese es el tema del siguiente capítulo.
