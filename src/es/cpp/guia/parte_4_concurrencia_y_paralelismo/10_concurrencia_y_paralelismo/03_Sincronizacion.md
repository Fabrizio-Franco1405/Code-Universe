---
outline: [2, 3]
---

# Sincronización

En el capítulo de introducción vimos el data race: dos hilos modificando la misma variable a la vez, con resultados impredecibles. Ahora aprenderemos la herramienta que lo resuelve: la **sincronización**. Con mutex y otras técnicas, garantizaremos que los hilos accedan a los datos compartidos de forma **ordenada y segura**.

## 1. El problema otra vez: El data race

Recordemos el ejemplo peligroso:

```cpp
int contador = 0;

void incrementar() {
    for (int i = 0; i < 100000; i++) contador++;
}
```

`contador++` son 3 pasos (leer, sumar, guardar). Dos hilos pueden intercalarse:

```
Hilo 1:  lee contador (=5)
Hilo 2:  lee contador (=5)     ← ambos leyeron el mismo valor
Hilo 1:  guarda 6
Hilo 2:  guarda 6              ← se perdió un incremento
```

La solución: garantizar que el "leer-sumar-guardar" se ejecute **sin interrupciones**. Para eso existe el **mutex**.

## 2. ¿Qué es un mutex?

Un **mutex** (de *mutual exclusion*, exclusión mutua) es como la llave de un baño público: solo **una persona a la vez** puede usarlo.

- `lock()`: intenta obtener la llave. Si otro hilo la tiene, **espera** hasta que la libere.
- `unlock()`: devuelve la llave.

```cpp
#include <iostream>
#include <thread>
#include <mutex>
using namespace std;

int contador = 0;
mutex mtx; // La "llave"

void incrementar() {
    for (int i = 0; i < 100000; i++) {
        mtx.lock();      // Pedimos la llave
        contador++;      // Sección crítica (protegida)
        mtx.unlock();    // Devolvemos la llave
    }
}

int main() {
    thread hilo1(incrementar);
    thread hilo2(incrementar);

    hilo1.join();
    hilo2.join();

    cout << "Contador final: " << contador << endl; // Ahora sí: 200000
    return 0;
}
```

::: warning Advertencia
⚠️ `lock()`/`unlock()` manual es frágil: si ocurre una excepción entre ambos, el `unlock()` nunca se ejecuta y el mutex queda bloqueado para siempre (deadlock).
:::

## 3. `std::lock_guard`: RAII para mutex

La solución moderna aplica RAII (¡como los punteros inteligentes!): `std::lock_guard` **bloquea** al crearse y **desbloquea automáticamente** al salir del ámbito, pase lo que pase.

```cpp
#include <iostream>
#include <thread>
#include <mutex>
using namespace std;

int contador = 0;
mutex mtx;

void incrementar() {
    for (int i = 0; i < 100000; i++) {
        lock_guard<mutex> bloqueo(mtx); // Bloquea aquí
        contador++;                     // Sección crítica
        // Se desbloquea solo al salir del bloque
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
💡 `lock_guard` es la forma correcta de usar un mutex en casi todos los casos. Es imposible olvidarse del `unlock()` porque no existe: el destructor lo hace por ti.
:::

## 4. `std::unique_lock`: Más flexible

`unique_lock` es como `lock_guard` pero **más flexible**: permite bloquear y desbloquear manualmente, retrasar el bloqueo, o mover el lock entre ámbitos. Es lo que necesitan las `condition_variable`.

```cpp
#include <iostream>
#include <thread>
#include <mutex>
using namespace std;

mutex mtx;

void tarea() {
    unique_lock<mutex> bloqueo(mtx); // Bloquea

    // ... sección crítica ...

    bloqueo.unlock(); // Podemos desbloquear antes
    // ... código sin necesidad del mutex ...

    bloqueo.lock(); // Y volver a bloquear si hace falta
}

int main() {
    thread t(tarea);
    t.join();
    return 0;
}
```

::: info Nota
ℹ️ Regla general: `lock_guard` para lo simple, `unique_lock` cuando necesites flexibilidad (desbloquear/rebloquear, mover el lock, condition_variables).
:::

## 5. Bloques atómicos: `std::scoped_lock` (C++17)

Cuando necesitas **bloquear varios mutex a la vez** (sin riesgo de deadlock por orden invertido), usa `scoped_lock`:

```cpp
#include <iostream>
#include <thread>
#include <mutex>
using namespace std;

mutex mtxA, mtxB;

void tarea1() {
    scoped_lock bloqueo(mtxA, mtxB); // Bloquea ambos, en el orden seguro
    cout << "Tarea 1 con ambos mutex" << endl;
}

void tarea2() {
    scoped_lock bloqueo(mtxA, mtxB);
    cout << "Tarea 2 con ambos mutex" << endl;
}

int main() {
    thread t1(tarea1);
    thread t2(tarea2);
    t1.join();
    t2.join();
    return 0;
}
```

::: warning Advertencia
⚠️ Si cada hilo bloquea los mutex en distinto orden (uno A→B y otro B→A), pueden **esperarse mutuamente para siempre**: eso es un **deadlock**. `scoped_lock` evita este error bloqueándolos todos a la vez.
:::

## 6. `condition_variable`: Avisar cuando algo cambia

A veces un hilo debe **esperar a que algo ocurra** (por ejemplo, a que haya datos disponibles). Con `condition_variable`, un hilo puede dormir y ser **despertado** por otro.

```cpp
#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
using namespace std;

mutex mtx;
condition_variable cv;
bool datoListo = false;

void productor() {
    this_thread::sleep_for(chrono::milliseconds(100));
    {
        lock_guard<mutex> lock(mtx);
        datoListo = true;      // Marcamos que hay datos
    }
    cv.notify_one();           // Avisamos al consumidor
}

void consumidor() {
    unique_lock<mutex> lock(mtx);
    cv.wait(lock, []() { return datoListo; }); // Espera despierto hasta que sea true
    cout << "Consumidor: ¡los datos están listos!" << endl;
}

int main() {
    thread cons(consumidor);
    thread prod(productor);

    cons.join();
    prod.join();
    return 0;
}
```

::: tip
💡 El `wait` con predicado se despierta, comprueba la condición, y si sigue falsa vuelve a dormir. Esa es la forma segura de esperar: evita falsos despertares.
:::

## 7. Los problemas que evita la sincronización
| Problema | Causa | Solución |
|---|---|---|
| **Data race** | Acceso simultáneo a datos | Mutex / atómicos |
| **Deadlock** | Bloqueos circulares | Bloquear en orden, `scoped_lock` |
| **Uso de datos sin preparar** | Condiciones no sincronizadas | `condition_variable` |
| **Falsos despertares** | `notify` sin condición | `wait` con predicado |
## 8. Buenas prácticas

- Usa `lock_guard` (o `scoped_lock`) en lugar de `lock()`/`unlock()` manual.
- Mantén la sección crítica **lo más corta posible**.
- No bloquees el mutex más de lo necesario.
- Usa `condition_variable` con predicado en `wait`.
- Evita llamar funciones lentas (I/O) dentro de la sección crítica.

## 9. Resumen rápido

- El **mutex** garantiza exclusión mutua entre hilos.
- `lock_guard` bloquea/desbloquea con RAII (lo correcto).
- `unique_lock` añade flexibilidad para casos especiales.
- `scoped_lock` (C++17) bloquea varios mutex sin deadlock.
- `condition_variable` permite esperar/avisar condiciones.
- La sincronización resuelve data races y deadlocks.

Con mutex y condition_variables ya puedes sincronizar hilos. Pero a veces no necesitas un mutex: las **variables atómicas** son aún más eficientes, y son el tema del siguiente capítulo.
