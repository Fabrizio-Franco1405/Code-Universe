---
outline: [2, 3]
---

# E/S asíncrona

Hasta ahora, todas las operaciones de entrada/salida que hemos visto son **síncronas**:
cuando el programa espera una entrada o escribe un archivo, se **detiene** hasta que la
operación termina. Pero ¿qué pasa si el archivo es enorme, o la red está lenta? El programa
se queda "congelado" mirando cómo pasan los segundos. Para esos casos existe la **E/S
asíncrona**: no bloquear el programa mientras los datos viajan.

Este capítulo es una introducción conceptual, porque la E/S asíncrona en C++ es un tema
avanzado que se apoya en los hilos que verás en el próximo capítulo.

## 1. E/S síncrona vs asíncrona

Imagina que pides comida en un restaurante:

- **Síncrono**: pides, te quedas **mirando fijo la cocina** hasta que llegue tu plato. No
  haces nada más mientras esperas.
- **Asíncrono**: pides, te sientas y **sigues haciendo otras cosas** (charlar, trabajar).
  Te avisan cuando tu comida está lista.

En programación, la diferencia es exactamente la misma:

| Característica | Síncrona | Asíncrona |
|---|---|---|
| El programa se detiene | Sí, hasta terminar | No, continúa |
| Complejidad | Simple | Mayor |
| Uso típico | Consola, archivos pequeños | Red, archivos grandes, servidores |
| Notificación | Al volver de la llamada | Callback, futuro, señal |

```cpp
// Síncrono: el programa espera hasta leer el archivo
ifstream archivo("grande.bin");
archivo.read(datos, tamanio); // El programa se detiene aquí
// ... el programa continúa solo cuando terminó de leer
```

## 2. ¿Cuándo importa realmente?

La E/S es cientos de veces más lenta que la CPU. Para un archivo de 10 MB, la CPU puede
procesar los datos en microsegundos, pero **leerlos del disco tarda milisegundos** (¡miles
de veces más!). Si el programa espera cada lectura, pasa la mayoría del tiempo sin hacer
nada, como un empleado que espera a que le traigan los papeles:

```
CPU  ████████████████░▒▒▒▒▒▒▒▒▒▒▒▒░░▒▒▒▒▒▒▒▒▒░░░
I/O  ░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒███▒▒▒▒▒▒▒▒▒▒▒███▒▒▒▒▒▒▒▒
     ───────────────────────────────► tiempo
     (la CPU espera ociosa a que la E/S termine)
```

::: info Nota
ℹ️ El objetivo de la E/S asíncrona: hacer que la CPU trabaje mientras el disco o la red hacen su parte. En servidores con miles de peticiones, es la diferencia entre atender 10 o 10,000 clientes.
:::

## 3. El bloqueo: El problema central

Toda operación de E/S bloquea al hilo que la ejecuta. Si tu programa es de un solo hilo, se
congela entero, y eso es un problema serio cuando hablamos de interfaces de usuario o
servidores. Por eso la E/S asíncrona se combina con **múltiples hilos** (que verás en el
capítulo de concurrencia):

- Un **hilo principal** se encarga de la interfaz (sin congelarse).
- Los **hilos de trabajo** hacen las E/S pesadas.
- Los resultados vuelven al hilo principal cuando están listos.

## 4. Enfoques para E/S no bloqueante en C++

Existen varias estrategias, de menos a más avanzadas. Vamos de la más cómoda a la más
profunda.

### 4.1 Operaciones con hilos (`std::async`)

La forma más cómoda: `std::async` lanza una tarea en segundo plano y devuelve un
**futuro** que podemos esperar cuando lo necesitemos. Mientras tanto, el programa sigue
haciendo su vida:

```cpp
#include <iostream>
#include <future>
#include <fstream>
#include <string>
using namespace std;

// Función que se ejecutará en segundo plano
string leerArchivo() {
    ifstream archivo("datos.txt");
    string contenido((istreambuf_iterator<char>(archivo)),
                      istreambuf_iterator<char>());
    return contenido;
}

int main() {
    cout << "Iniciando lectura en segundo plano..." << endl;

    // Lanzamos la lectura de forma asíncrona
    future<string> resultado = async(launch::async, leerArchivo);

    // Mientras tanto, hacemos otras cosas...
    cout << "El programa sigue haciendo su trabajo..." << endl;
    for (int i = 0; i < 5; i++) {
        cout << "Trabajo " << i << endl;
    }

    // Ahora sí esperamos el resultado de la lectura
    string contenido = resultado.get();
    cout << "Archivo leído (" << contenido.size() << " bytes)" << endl;

    return 0;
}
```

::: tip
💡 `std::async` es el puente perfecto hacia la E/S asíncrona: la operación corre en otro hilo y el programa principal no se congela. Lo verás a fondo en el capítulo de concurrencia.
:::

### 4.2 Formato no bloqueante con `std::future`

La idea general con futuros y promesas: una **promesa** es el compromiso de que un valor
va a estar listo en el futuro, y el **futuro** es la "casilla" donde ese valor va a
aparecer. Podés comprobar si ya está listo sin bloquear nada:

```cpp
#include <iostream>
#include <future>
using namespace std;

int main() {
    // Promesa: producirá un valor en el futuro
    promise<int> promesa;
    future<int> futuro = promesa.get_future();

    // Simulamos una operación de E/S lenta
    future<int> tarea = async(launch::async, [&promesa]() {
        // ... operación de E/S lenta ...
        promesa.set_value(42); // Entregamos el resultado
    });

    // Comprobar si ya está listo sin bloquear
    if (futuro.wait_for(chrono::milliseconds(0)) == future_status::ready) {
        cout << "¡Ya está listo! Valor: " << futuro.get() << endl;
    } else {
        cout << "Todavía no está listo, sigo haciendo otras cosas" << endl;
    }

    tarea.get(); // Esperamos a que termine
    return 0;
}
```

### 4.3 E/S propiamente asíncrona del sistema

A nivel de sistema operativo, existen mecanismos de E/S **no bloqueante de verdad** (no
requieren hilos). Cada sistema operativo tiene el suyo, y conocer sus nombres te va a
ayudar cuando leas documentación avanzada:

| Mecanismo | Sistema |
|---|---|
| `select` / `poll` | Unix/Linux |
| `epoll` | Linux (muy eficiente) |
| `IOCP` (I/O Completion Ports) | Windows |
| `io_uring` | Linux moderno (el más rápido) |

::: warning Advertencia
⚠️ Estas APIs son específicas de cada sistema operativo y su uso directo en C++ es muy avanzado. En la práctica, se usan a través de bibliotecas como **Boost.Asio** o **standalone ASIO**, que las abstraen.
:::

## 5. Bibliotecas de E/S asíncrona en C++

| Biblioteca | Descripción |
|---|---|
| **Boost.Asio** | La más famosa; E/S asíncrona multiplataforma |
| **ASIO standalone** | La misma librería sin Boost |
| **C++20 `std::jthread` + async** | Soporte básico de la biblioteca estándar |
| **Libuv** | La que usa Node.js, escrita en C |

Un vistazo a Boost.Asio, para que veas cómo se ve el mundo real de la E/S asíncrona:

```cpp
#include <boost/asio.hpp>
#include <iostream>

int main() {
    boost::asio::io_context io;
    boost::asio::steady_timer t(io, boost::asio::chrono::seconds(1));

    // Función de retorno: se ejecutará cuando el temporizador se complete
    t.async_wait([](const boost::system::error_code &) {
        std::cout << "Temporizador asíncrono completado" << std::endl;
    });

    std::cout << "Sigo haciendo cosas mientras espero..." << std::endl;

    io.run(); // Procesa los eventos asíncronos pendientes
    return 0;
}
```

::: info Nota
ℹ️ No necesitas dominar Boost.Asio ahora, pero saber que existe te prepara para cuando construyas servidores o aplicaciones de red.
:::

## 6. Buenas prácticas

- Usa E/S **síncrona** para programas simples (es más fácil de leer y depurar).
- Pasa a E/S asíncrona cuando tengas **múltiples operaciones de E/S** o latencia real.
- Combínala con hilos para no congelar la interfaz.
- Usa bibliotecas probadas (ASIO) en lugar de escribir APIs de sistema a mano.
- No uses `future::get()` prematuramente: pierde la ventaja de la asincronía.

## 7. Resumen rápido

- La E/S **síncrona** bloquea; la **asíncrona** no.
- El disco y la red son miles de veces más lentos que la CPU.
- `std::async` + `std::future` ofrecen asincronía básica de la biblioteca estándar.
- `promise` produce valores y `future` los consume en el futuro.
- Los mecanismos de sistema (`epoll`, `IOCP`) son avanzados y específicos.
- **Boost.Asio** es la biblioteca estándar de facto para E/S asíncrona.

La E/S asíncrona te prepara para construir sistemas rápidos y escalables, de esos que
atienden miles de clientes sin congelarse. El siguiente capítulo profundiza en la
herramienta sobre la que se apoya: la **concurrencia y el paralelismo**.