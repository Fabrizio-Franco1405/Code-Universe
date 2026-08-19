---
outline: [2, 3]
---

# RAII y excepciones

Cuando presentamos los punteros inteligentes hablamos del principio **RAII**
(*Resource Acquisition Is Initialization*): los recursos se adquieren en el
constructor y se liberan automáticamente en el destructor. Ahora, con las
excepciones en mente, veremos por qué este principio es **absolutamente
esencial**: sin RAII, una excepción puede dejar tu programa con fugas de memoria
y recursos sin liberar.

## 1. El problema: Excepciones y memoria

Imagina este código con gestión manual de memoria:

```cpp
#include <iostream>
#include <stdexcept>
using namespace std;

int main() {
    int *datos = new int[100]; // Reservamos memoria

    // ... algún procesamiento ...
    if (/* ocurre un error */) {
        throw runtime_error("Falló el procesamiento");
        // ⚠️ 'datos' nunca se libera: fuga de memoria
    }

    delete[] datos; // Este código nunca se alcanza si hay throw
    return 0;
}
```

Cuando se lanza la excepción, la ejecución salta directamente al `catch`,
**saltándose** el `delete[]`. El resultado: memoria reservada que nunca se
libera.

::: danger Peligro
🛑 Cada vez que una excepción interrumpe un bloque con gestión manual de
memoria, tienes una fuga. En un programa con muchos puntos de fallo, esto es
una bomba de tiempo.
:::

El problema es sutil pero devastador: el `delete[]` está *después* del punto de
fallo, y la excepción corta camino directo al `catch`. Nunca llegamos a
liberar. Y lo peor: el programa no se detiene ni avisa; la memoria simplemente
se pierde en silencio.

## 2. La solución: RAII

Con RAII, el recurso se guarda en un **objeto** que lo libera en su destructor.
Y como los destructores **siempre se ejecutan** (incluso cuando hay una
excepción), el recurso se libera automáticamente.

```cpp
#include <iostream>
#include <memory>
#include <stdexcept>
using namespace std;

int main() {
    // El puntero inteligente libera la memoria en su destructor
    unique_ptr<int[]> datos = make_unique<int[]>(100);

    try {
        throw runtime_error("Falló el procesamiento");
    }
    catch (const runtime_error &e) {
        cout << "Error: " << e.what() << endl;
    }

    // 'datos' se libera aquí automáticamente, pase lo que pase
    return 0;
}
```

::: tip
💡 La clave: aunque lancemos una excepción, el destructor del `unique_ptr` se
ejecuta cuando la pila se desenrolla. La memoria se libera siempre. **Cero
fugas, cero esfuerzo.**
:::

Compara con el ejemplo anterior: acá no hay `delete` en ninguna parte, y sin
embargo la memoria se libera. El `unique_ptr` es el encargado de hacerlo en su
destructor, y ese destructor se ejecuta pase lo que pase. Esa es la esencia de
RAII: **la liberación está atada a la vida del objeto, no a tu memoria
disciplinada.**

## 3. Desenrollado de la pila (stack unwinding)

Cuando una excepción se propaga, C++ ejecuta un proceso llamado **desenrollado
de la pila**: todas las variables locales con destructores se destruyen en
orden inverso a su creación, mientras la excepción "sube" buscando un `catch`.

```cpp
#include <iostream>
#include <string>
using namespace std;

class Recurso {
private:
    string nombre;

public:
    Recurso(string n) : nombre(n) {
        cout << "Adquiriendo: " << nombre << endl;
    }
    ~Recurso() {
        cout << "Liberando: " << nombre << endl;
    }
};

void capaInterna() {
    Recurso r2("archivo.log");
    throw runtime_error("¡Ups!");
}

void capaMedia() {
    Recurso r1("conexión BD");
    capaInterna();
}

int main() {
    try {
        capaMedia();
    }
    catch (const runtime_error &e) {
        cout << "Capturado: " << e.what() << endl;
    }
    return 0;
}
```

**Salida:**

```
Adquiriendo: conexión BD
Adquiriendo: archivo.log
Liberando: archivo.log
Liberando: conexión BD
Capturado: ¡Ups!
```

::: info Nota
ℹ️ Observa el orden: los recursos se liberan en orden **inverso** a como se
adquirieron (LIFO). Cada objeto se destruye limpio, aunque la excepción viaje
hacia arriba. Eso es el desenrollado de la pila.
:::

Es como apilar platos: el último plato que pones es el primero que quitas. La
excepción sube "quemando" cada capa a su paso, pero antes de pasar de largo,
destruye cada objeto local y su destructor limpia el recurso. Nada queda
olvidado.

## 4. RAII con archivos: `std::fstream`

El ejemplo más cotidiano de RAII son los **archivos**. Con `std::fstream` no
necesitas `close()` explícito: el destructor lo cierra por ti, incluso si hay
una excepción.

```cpp
#include <iostream>
#include <fstream>
using namespace std;

int main() {
    try {
        ofstream archivo("datos.txt");
        archivo << "Hola desde RAII" << endl;

        // Si ocurriera una excepción aquí, el archivo igual se cerraría
        throw runtime_error("Error inesperado");

        archivo << "Esto no se escribe" << endl;
    }
    catch (const runtime_error &e) {
        cout << "Error: " << e.what() << endl;
    }
    // El archivo ya está cerrado y sus datos guardados
    return 0;
}
```

¿Cuántas veces has visto código que "olvida" cerrar un archivo? Con
`ofstream`, ese problema desaparece: el archivo se cierra solo al salir del
ámbito, con excepción o sin ella. Lo que ya se escribió (el "Hola desde RAII")
se guarda correctamente.

## 5. Excepciones y constructores

Hay un caso delicado: si un constructor lanza una excepción, el objeto **no se
considera creado**, por lo que su destructor **no se ejecuta**. Pero los
sub-objetos y miembros ya construidos sí se destruyen.

```cpp
#include <iostream>
#include <memory>
#include <stdexcept>
using namespace std;

class Ejemplo {
private:
    int *datos;

public:
    Ejemplo() {
        datos = new int[10]; // Primero reservamos...
        throw runtime_error("Fallo en el constructor");
        // ⚠️ 'datos' se pierde: el destructor NO se ejecutará
    }

    ~Ejemplo() {
        delete[] datos;
    }
};

int main() {
    try {
        Ejemplo e;
    }
    catch (const runtime_error &e) {
        cout << "Capturado: " << e.what() << endl;
    }
    return 0;
}
```

::: warning Advertencia
⚠️ Si un constructor lanza una excepción, el destructor no se llama. Por eso, en
constructores debes usar RAII (punteros inteligentes, etc.) para que los
recursos se liberen por los destructores de los **miembros**.
:::

Esta es la trampa clásica: el objeto no terminó de nacer, así que C++ no llama
a su destructor (no tiene sentido destruir algo que nunca existió). Pero la
memoria ya se reservó dentro del constructor... y se pierde. Por eso, en
constructores, cada recurso debe estar en manos de un miembro con RAII.

La solución moderna:

```cpp
#include <iostream>
#include <memory>
#include <stdexcept>
using namespace std;

class Ejemplo {
private:
    unique_ptr<int[]> datos; // RAII: se libera solo

public:
    Ejemplo() : datos(make_unique<int[]>(10)) {
        throw runtime_error("Fallo en el constructor");
    }
    // No hace falta destructor manual: unique_ptr se encarga
};

int main() {
    try {
        Ejemplo e;
    }
    catch (const runtime_error &e) {
        cout << "Capturado: " << e.what() << endl;
    }
    return 0;
}
```

La diferencia es radical: `datos` ya no es un puntero crudo, sino un
`unique_ptr`. Cuando el constructor falla, los **miembros ya construidos** se
destruyen (aunque el objeto no). Y como `unique_ptr` es un miembro, su
destructor libera la memoria. Sin escribir ni una línea extra.

## 6. Regla de oro: RAII en todo

La combinación RAII + excepciones hace que C++ moderno sea sorprendentemente
seguro. La regla general:

| Recurso | Gestión clásica (frágil) | RAII (seguro) |
|---|---|---|
| Memoria | `new` / `delete` | `unique_ptr`, `shared_ptr` |
| Archivos | `open()` / `close()` | `fstream` (cierra solo) |
| Hilos | `join()` manual | `std::thread` (une en destructor) |
| Locks | `lock()` / `unlock()` | `std::lock_guard` (desbloquea solo) |
| Conexiones | abrir/cerrar manual | Clases que cierran en destructor |

## 7. Buenas prácticas

- Adquiere recursos en constructores y libéralos en destructores (**RAII**).
- Usa punteros inteligentes en lugar de `new`/`delete`.
- No gestiones recursos manualmente en constructores que puedan lanzar.
- Confía en el desenrollado de la pila: es automático y correcto.

## 8. Resumen rápido

- Sin RAII, las excepciones causan **fugas de memoria**.
- Los destructores **siempre se ejecutan** (desenrollado de la pila).
- Los recursos se liberan en orden inverso a su adquisición (LIFO).
- Un constructor que lanza no ejecuta su destructor, pero sí los de sus
  miembros.
- Los punteros inteligentes, `fstream`, `thread` y `lock_guard` aplican RAII.
- RAII hace que C++ moderno sea seguro ante excepciones.

Con RAII dominado, tu código resistirá excepciones sin fugas ni recursos
colgados. En el siguiente capítulo cerraremos esta sección con las **buenas
prácticas** generales del manejo de excepciones.