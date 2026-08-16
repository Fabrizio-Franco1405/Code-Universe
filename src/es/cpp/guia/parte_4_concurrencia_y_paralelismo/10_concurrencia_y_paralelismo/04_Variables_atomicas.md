---
outline: [2, 3]
---

# Variables atómicas

En el capítulo anterior usamos mutex para proteger el famoso `contador++`. Funcionaba, pero había un detalle: proteger con un mutex es como poner una puerta con llave para contar una sola variable. ¿No sería mejor que esa variable misma fuera "a prueba de interferencias"?

Las **variables atómicas** (`std::atomic`) son exactamente eso: operaciones que se ejecutan como una única unidad indivisible, sin necesidad de mutex.

## 1. ¿Qué es una operación atómica?

Una operación es **atómica** cuando se ejecuta de una sola vez, sin que otro hilo pueda intercalarse a mitad de camino. En el capítulo anterior, `contador++` tenía 3 pasos (leer, sumar, guardar). Una versión atómica del mismo incremento es **una sola operación indivisible**.

```
contador++ normal:   lee ──► suma ──► guarda   (interrumpible)
contador++ atómico:  [leer+sumar+guardar]      (indivisible)
```

## 2. `std::atomic<T>`

La clase `std::atomic<T>` (en `<atomic>`) envuelve un valor de tipo `T` y ofrece operaciones atómicas. Los tipos más comunes son `std::atomic<int>`, `std::atomic<bool>` y `std::atomic<long long>`.

```cpp
#include <iostream>
#include <thread>
#include <atomic>
using namespace std;

atomic<int> contador(0); // Variable atómica

void incrementar() {
    for (int i = 0; i < 100000; i++) {
        contador++; // Operación atómica: sin mutex
    }
}

int main() {
    thread hilo1(incrementar);
    thread hilo2(incrementar);

    hilo1.join();
    hilo2.join();

    cout << "Contador final: " << contador << endl; // 200000
    return 0;
}
```

::: tip
💡 Sin ningún mutex, el resultado es siempre `200000`. El `++` sobre un `atomic` es indivisible, así que los dos hilos no pueden interferirse.
:::

## 3. Operaciones atómicas principales
| Operación | Método | Efecto |
|---|---|---|
| Cargar valor | `load()` | Lee de forma atómica |
| Guardar valor | `store(v)` | Escribe de forma atómica |
| Intercambiar | `exchange(v)` | Lee y escribe a la vez |
| Sumar | `fetch_add(n)` | Suma atómica (devuelve el valor anterior) |
| Restar | `fetch_sub(n)` | Resta atómica |
| Comparar e intercambiar | `compare_exchange` | CAS, para algoritmos avanzados |

```cpp
#include <iostream>
#include <atomic>
using namespace std;

int main() {
    atomic<int> valor(10);

    cout << valor.load() << endl;            // 10 (leer)
    valor.store(20);                         // 20 (escribir)

    int anterior = valor.fetch_add(5);       // 20 (devuelve el anterior)
    cout << "Anterior: " << anterior << endl; // 20
    cout << "Ahora: " << valor.load() << endl; // 25

    int intercambiado = valor.exchange(0);
    cout << "Intercambiado: " << intercambiado << endl; // 25
    cout << "Valor ahora: " << valor.load() << endl;     // 0

    return 0;
}
```

## 4. `std::atomic<bool>`: flags compartidos

Un uso muy común: un **flag** que varios hilos leen para saber si deben detenerse.

```cpp
#include <iostream>
#include <thread>
#include <atomic>
using namespace std;

atomic<bool> detener(false); // Compartida y segura

void trabajador() {
    while (!detener.load()) {
        // Trabajando...
        this_thread::sleep_for(chrono::milliseconds(50));
    }
    cout << "Trabajador detenido" << endl;
}

int main() {
    thread t(trabajador);

    this_thread::sleep_for(chrono::milliseconds(300));
    detener.store(true); // Pedimos la detención

    t.join();
    cout << "Main termina" << endl;
    return 0;
}
```

::: info Nota
ℹ️ Este patrón (flag de detención) es la forma estándar de detener un hilo de forma cooperativa, sin tener que matarlo abruptamente.
:::

## 5. Atómicos vs mutex
| Característica | Mutex | Atómicos |
|---|---|---|
| Complejidad | Mayor | Simple |
| Rendimiento | Menor (bloquea) | Mayor |
| Uso típico | Secciones críticas largas | Variables individuales |
| Tipos soportados | Cualquiera | Básicos (int, bool, ptr) |

```cpp
// Con mutex (para secciones críticas complejas)
mutex mtx;
int datos[100];
// lock_guard<mutex> lock(mtx);
// ... manipular datos[100] ...

// Con atómicos (para una variable simple)
atomic<int> contador(0);
contador++;
```

::: warning Advertencia
⚠️ Los atómicos **no son la solución para todo**. Si necesitas proteger varias variables o un bloque de código con varias operaciones, necesitas un mutex. Los atómicos brillan para **una variable a la vez**.
:::

## 6. Limpiando la sincronización: el problema del `cout`

Los atómicos son útiles incluso para entender por qué los `cout` se entremezclan: `cout <<` no es atómico. La solución simple es proteger la impresión con un mutex.

```cpp
#include <iostream>
#include <thread>
#include <mutex>
using namespace std;

mutex mtxPrint; // Protege la consola

void tarea(int id) {
    for (int i = 0; i < 3; i++) {
        lock_guard<mutex> lock(mtxPrint);
        cout << "Hilo " << id << " iteración " << i << endl;
    }
}

int main() {
    thread hilos[3];
    for (int i = 0; i < 3; i++) hilos[i] = thread(tarea, i);
    for (int i = 0; i < 3; i++) hilos[i].join();
    return 0;
}
```

## 7. Buenas prácticas

- Usa `std::atomic` para **variables individuales** compartidas (contadores, flags).
- Usa mutex para **secciones críticas** con varias operaciones.
- Prefiere `fetch_add`/`store`/`load` sobre operadores cuando la claridad importe.
- No intentes hacer `atomic` cosas grandes (vectores, strings): solo tipos básicos y punteros.
- Para lógica compleja de sincronización, vuelve a los mutex y condition_variables.

## 8. Resumen rápido

- Una operación **atómica** es indivisible para otros hilos.
- `std::atomic<T>` envuelve un valor con operaciones seguras.
- `load()`/`store()` leen y escriben; `fetch_add`/`fetch_sub` modifican.
- `std::atomic<bool>` es ideal para flags de detención.
- Los atómicos son más rápidos que los mutex para variables simples.
- Para secciones críticas complejas, sigue usando mutex.

Con atómicos y mutex ya puedes sincronizar hilos de forma segura. Pero a veces lo que quieres no es compartir estado, sino **obtener un resultado** de otro hilo. Para eso existen los **futuros y promesas**, el tema del siguiente capítulo.
