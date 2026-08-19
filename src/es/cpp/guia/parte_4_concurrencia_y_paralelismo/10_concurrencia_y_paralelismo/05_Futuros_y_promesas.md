---
outline: [2, 3]
---

# Futuros y promesas

Con los hilos aprendimos a lanzar tareas en paralelo y a sincronizarlas con mutex. Pero hay un caso muy común que aún no cubrimos bien: **obtener un resultado** de un hilo. Esperar a que un hilo calcule un valor, guardarlo en una variable compartida y protegerlo con un mutex es tedioso. C++ moderno tiene una herramienta mucho más elegante: los **futuros y las promesas**.

## 1. La analogía del pedido online

Imagina que pides un producto por internet:

- **Promesa**: es la orden de compra. Tú prometes que enviarás el producto.
- **Futuro**: es el ticket de seguimiento. Te permite esperar y, cuando llega, obtener el paquete.

En C++:

- `std::promise<T>` produce el valor (el "productor").
- `std::future<T>` lo consume (el "consumidor").
- `get()` espera el valor y lo devuelve cuando esté listo.

```
Productor:                       Consumidor:
promise<int> p;                  future<int> f = p.get_future();
// ... trabajo ...                // ... otras cosas ...
p.set_value(42);  ─────────────►  int valor = f.get(); // 42
```

## 2. `std::async`: La forma más sencilla

Para el caso más común (lanzar una tarea y esperar su resultado), `std::async` es lo más cómodo: lanza la tarea en segundo plano y devuelve un `future` directamente.

```cpp
#include <iostream>
#include <future>
using namespace std;

int calcularArea(int ancho, int alto) {
    this_thread::sleep_for(chrono::milliseconds(200)); // Simulamos trabajo
    return ancho * alto;
}

int main() {
    cout << "Lanzando el cálculo..." << endl;

    // Lanzamos la tarea y obtenemos un future<int>
    future<int> area = async(calcularArea, 5, 3);

    // Mientras tanto, hacemos otras cosas
    cout << "Haciendo otras cosas..." << endl;

    // Ahora sí, esperamos el resultado
    int resultado = area.get();
    cout << "Área: " << resultado << endl; // 15

    return 0;
}
```

::: tip
💡 `async` combina hilos + futuros con la mínima sintaxis. Es la herramienta recomendada para tareas que devuelven un valor.
:::

## 3. `get()` solo se puede llamar una vez

Un detalle importante: `future::get()` consume el valor. **Solo puedes llamarlo una vez**; una segunda llamada lanza `std::future_error`.

```cpp
future<int> f = async([]() { return 42; });

cout << f.get() << endl; // 42
// cout << f.get() << endl;
// ⚠️ Error: el future ya fue consumido
```

Si necesitas ver el valor sin consumirlo, existe `wait()` (espera sin devolver) o `get()` una única vez y guardar el resultado.

## 4. `std::promise`: Control manual

Cuando quieres controlar **tú mismo** cuándo entregar el valor (en lugar de delegar en `async`), usa `promise` directamente:

```cpp
#include <iostream>
#include <thread>
#include <future>
using namespace std;

int main() {
    promise<int> promesa;
    future<int> futuro = promesa.get_future();

    // Un hilo produce el valor cuando esté listo
    thread productor([&promesa]() {
        this_thread::sleep_for(chrono::milliseconds(200));
        promesa.set_value(100); // Entregamos el resultado
    });

    // El hilo principal espera y consume
    cout << "Esperando el valor..." << endl;
    int valor = futuro.get();
    cout << "Recibido: " << valor << endl;

    productor.join();
    return 0;
}
```

::: info Nota
ℹ️ `promise::set_value` entrega el valor al futuro. Si varios hilos necesitan el resultado, un `future` compartido (`shared_future`) permite que varios lo lean.
:::

## 5. Esperas: `wait` y `wait_for`

No siempre quieres bloquearte hasta el final. Puedes esperar un tiempo límite y comprobar si el resultado está listo:

```cpp
#include <iostream>
#include <future>
#include <chrono>
using namespace std;

int main() {
    future<int> f = async(launch::async, []() {
        this_thread::sleep_for(chrono::milliseconds(500));
        return 42;
    });

    // ¿Está listo ya?
    if (f.wait_for(chrono::milliseconds(100)) == future_status::ready) {
        cout << "¡Listo rápido! " << f.get() << endl;
    } else {
        cout << "Todavía no está listo, seguimos trabajando..." << endl;
    }

    // Esperamos lo que haga falta
    f.wait();
    cout << "Valor final: " << f.get() << endl; // 42

    return 0;
}
```

::: tip
💡 `wait_for` es perfecto para la E/S asíncrona que vimos: compruebas si los datos llegaron sin bloquear el programa para siempre.
:::

## 6. `std::packaged_task`: Tarea lista para ejecutar

`packaged_task` envuelve una función y expone un `future` para su resultado. Es útil cuando quieres **programar** cuándo ejecutar la tarea.

```cpp
#include <iostream>
#include <future>
using namespace std;

int multiplicar(int a, int b) { return a * b; }

int main() {
    // Envolvemos la función
    packaged_task<int(int, int)> tarea(multiplicar);
    future<int> resultado = tarea.get_future();

    // Ejecutamos la tarea
    tarea(4, 7);

    cout << "Resultado: " << resultado.get() << endl; // 28
    return 0;
}
```

## 7. Excepciones en futuros

Las excepciones lanzadas dentro de una tarea asíncrona se **capturan en el futuro** y se relanzan en `get()`:

```cpp
#include <iostream>
#include <future>
#include <stdexcept>
using namespace std;

int dividir(int a, int b) {
    if (b == 0) throw runtime_error("División entre cero");
    return a / b;
}

int main() {
    future<int> f = async(dividir, 10, 0);

    try {
        int resultado = f.get(); // Aquí se relanza la excepción
        cout << resultado << endl;
    }
    catch (const runtime_error &e) {
        cout << "Excepción desde el futuro: " << e.what() << endl;
    }

    return 0;
}
```

::: tip
💡 Las excepciones viajan de forma segura entre hilos a través del futuro. Es una forma elegante de manejar errores en tareas paralelas.
:::

## 8. Buenas prácticas

- Usa `std::async` para tareas que devuelven un valor.
- Llama a `get()` una sola vez por `future`.
- Usa `wait_for` cuando quieras no bloquearte indefinidamente.
- Usa `promise` cuando controles manualmente la entrega del valor.
- Captura las excepciones que relanza `get()`.

## 9. Resumen rápido

- `promise` produce el valor; `future` lo consume.
- `std::async` lanza una tarea y devuelve un `future`.
- `get()` espera y consume el valor (solo una vez).
- `wait()` espera sin consumir; `wait_for()` espera con tiempo límite.
- `packaged_task` envuelve funciones listas para ejecutar.
- Las excepciones viajan en los futuros y se relanzan en `get()`.

Los futuros y promesas hacen la concurrencia mucho más limpia. En el siguiente capítulo veremos los **patrones de concurrencia**: las soluciones probadas para los problemas que aparecen una y otra vez.
