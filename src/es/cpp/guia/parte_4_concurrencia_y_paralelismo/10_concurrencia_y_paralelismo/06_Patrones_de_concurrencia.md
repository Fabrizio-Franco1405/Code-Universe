---
outline: [2, 3]
---

# Patrones de concurrencia

A lo largo de este módulo hemos aprendido las herramientas de la concurrencia: hilos, mutex, atómicos y futuros. Pero las herramientas no bastan: en el código real, hay **problemas que se repiten** y para los que existen **soluciones probadas**. Esos patrones de concurrencia son el tema de este capítulo final del módulo.

## 1. Productor-Consumidor

Uno de los patrones más clásicos: uno o varios hilos **producen** datos y otros los **consumen**, conectados por un **búfer**.

```
Productor ──► [ Búfer ] ──► Consumidor
```

**Ejemplo con cola y condition_variable:**

```cpp
#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <queue>
using namespace std;

mutex mtx;
condition_variable cv;
queue<int> buffer;
const int MAX_BUFFER = 5;

void productor() {
    for (int i = 1; i <= 10; i++) {
        unique_lock<mutex> lock(mtx);
        cv.wait(lock, []() { return buffer.size() < MAX_BUFFER; });

        buffer.push(i);
        cout << "Producido: " << i << " (tamaño: " << buffer.size() << ")" << endl;

        lock.unlock();
        cv.notify_one(); // Avisa al consumidor
    }
}

void consumidor() {
    for (int i = 1; i <= 10; i++) {
        unique_lock<mutex> lock(mtx);
        cv.wait(lock, []() { return !buffer.empty(); });

        int valor = buffer.front();
        buffer.pop();
        cout << "Consumido: " << valor << endl;

        lock.unlock();
        cv.notify_one(); // Avisa al productor de que hay espacio
    }
}

int main() {
    thread prod(productor);
    thread cons(consumidor);

    prod.join();
    cons.join();
    return 0;
}
```

::: tip
💡 El patrón productor-consumidor separa la **producción** de la **consumición**: cada lado avanza a su ritmo, y el búfer los desacopla. Es la base de las colas de mensajes y de los sistemas de eventos.
:::

## 2. Thread pool (grupo de hilos)

Crear y destruir hilos tiene coste. El patrón **thread pool** reutiliza un **grupo fijo de hilos** que toman tareas de una cola y las ejecutan. Así evitamos crear un hilo por cada tarea.

```cpp
#include <iostream>
#include <thread>
#include <vector>
#include <queue>
#include <mutex>
#include <condition_variable>
#include <functional>
using namespace std;

class ThreadPool {
private:
    vector<thread> hilos;
    queue<function<void()>> tareas;
    mutex mtx;
    condition_variable cv;
    bool detener = false;

public:
    ThreadPool(int numHilos) {
        for (int i = 0; i < numHilos; i++) {
            hilos.emplace_back([this]() {
                while (true) {
                    function<void()> tarea;
                    {
                        unique_lock<mutex> lock(mtx);
                        cv.wait(lock, [this]() {
                            return detener || !tareas.empty();
                        });
                        if (detener && tareas.empty()) return;
                        tarea = move(tareas.front());
                        tareas.pop();
                    }
                    tarea(); // Ejecutamos fuera del lock
                }
            });
        }
    }

    void agregarTarea(function<void()> tarea) {
        {
            lock_guard<mutex> lock(mtx);
            tareas.push(move(tarea));
        }
        cv.notify_one();
    }

    ~ThreadPool() {
        {
            lock_guard<mutex> lock(mtx);
            detener = true;
        }
        cv.notify_all();
        for (auto &hilo : hilos) hilo.join();
    }
};

int main() {
    ThreadPool pool(4); // 4 hilos reutilizables

    for (int i = 0; i < 8; i++) {
        pool.agregarTarea([i]() {
            cout << "Tarea " << i << " en el pool" << endl;
        });
    }
    // Al destruirse el pool, las tareas se ejecutan y los hilos terminan
    return 0;
}
```

::: info Nota
ℹ️ El thread pool es la arquitectura de los servidores web y las bibliotecas de E/S asíncrona: un número fijo de hilos atendiendo infinitas tareas.
:::

## 3. Double-checked locking

Un patrón para inicializar recursos **una sola vez** de forma segura: se comprueba dos veces (una sin lock y otra con lock) para evitar el coste del mutex cuando ya está inicializado.

```cpp
#include <iostream>
#include <thread>
#include <mutex>
using namespace std;

class Configuracion {
private:
    static Configuracion *instancia;
    static mutex mtx;

    Configuracion() {} // Constructor privado (singleton)

public:
    static Configuracion *getInstancia() {
        if (instancia == nullptr) {      // 1ª comprobación (rápida)
            lock_guard<mutex> lock(mtx); // Bloqueamos
            if (instancia == nullptr) {  // 2ª comprobación (segura)
                instancia = new Configuracion();
            }
        }
        return instancia;
    }
};

Configuracion *Configuracion::instancia = nullptr;
mutex Configuracion::mtx;

int main() {
    thread t1([]() { Configuracion::getInstancia(); });
    thread t2([]() { Configuracion::getInstancia(); });

    t1.join();
    t2.join();
    cout << "Instancia creada una sola vez" << endl;
    return 0;
}
```

::: warning Advertencia
⚠️ En C++11 y superior, la forma moderna de singleton seguro es mucho más simple: una **variable local estática** se inicializa de forma segura para hilos automáticamente. Prefiere esa antes que este patrón.
:::

```cpp
class Configuracion {
public:
    static Configuracion &getInstancia() {
        static Configuracion instancia; // Inicialización segura para hilos
        return instancia;
    }
};
```

## 4. Semáforo (con `counting_semaphore`, C++20)

C++20 añade semáforos a la biblioteca estándar: permiten que un máximo de `n` hilos entren a la vez.

```cpp
#include <iostream>
#include <thread>
#include <semaphore>
using namespace std;

counting_semaphore<3> permitidos(3); // Máximo 3 hilos a la vez

void tarea(int id) {
    permitidos.acquire(); // Pide un permiso
    cout << "Hilo " << id << " entrando (permisos: " << permitidos.max() << ")" << endl;
    this_thread::sleep_for(chrono::milliseconds(100));
    permitidos.release(); // Libera el permiso
}

int main() {
    thread hilos[6];
    for (int i = 0; i < 6; i++) hilos[i] = thread(tarea, i);
    for (int i = 0; i < 6; i++) hilos[i].join();
    return 0;
}
```

## 5. Barrera y latch (C++20)

- **`std::latch`**: espera a que un número concreto de hilos lleguen (una sola vez).
- **`std::barrier`**: como un latch, pero **reutilizable** en varias fases.

```cpp
#include <iostream>
#include <thread>
#include <latch>
using namespace std;

int main() {
    latch inicio(3); // Espera a 3 hilos

    auto trabajador = [&inicio](int id) {
        this_thread::sleep_for(chrono::milliseconds(id * 50));
        cout << "Hilo " << id << " listo" << endl;
        inicio.count_down(); // Uno menos esperado
    };

    thread hilos[3];
    for (int i = 0; i < 3; i++) hilos[i] = thread(trabajador, i);

    inicio.wait(); // Main espera a que TODOS lleguen
    cout << "Todos los hilos listos. ¡Adelante!" << endl;

    for (auto &h : hilos) h.join();
    return 0;
}
```

## 6. ¿Cuándo usar cada patrón?
| Patrón | Problema que resuelve | Uso típico |
|---|---|---|
| Productor-Consumidor | Desacoplar producción y consumo | Colas de mensajes |
| Thread pool | Evitar crear hilos constantemente | Servidores, E/S |
| Singleton con locks | Una sola instancia segura | Configuración global |
| Semáforo | Limitar acceso concurrente | Controlar recursos limitados |
| Latch/Barrier | Sincronizar fases de trabajo | Cómputo paralelo por fases |
## 7. Buenas prácticas

- Empieza con el patrón más **simple** que resuelva tu problema.
- Mantén los hilos de trabajo **reutilizados** (thread pool) en sistemas con muchas tareas.
- Usa condition_variables con predicado siempre.
- Prefiere las abstracciones de la biblioteca estándar (async, semaphore, latch) sobre implementaciones manuales.
- Prueba a fondo: la concurrencia es donde aparecen los bugs más difíciles de reproducir.

## 8. Resumen rápido

- **Productor-Consumidor**: productores y consumidores con un búfer entre ellos.
- **Thread pool**: grupo fijo de hilos que ejecutan tareas de una cola.
- **Singleton seguro**: con variable estática local (simple) o double-checked locking.
- **Semáforo** (C++20): limita el número de hilos simultáneos.
- **Latch/Barrier** (C++20): sincroniza llegadas de varios hilos.
- Elige el patrón más simple que funcione.

Con esto cerramos el módulo de concurrencia y paralelismo. En la siguiente parte daremos un salto histórico: el **C++ moderno**, recorriendo los estándares C++11, 14, 17 y 20 que han transformado el lenguaje.
