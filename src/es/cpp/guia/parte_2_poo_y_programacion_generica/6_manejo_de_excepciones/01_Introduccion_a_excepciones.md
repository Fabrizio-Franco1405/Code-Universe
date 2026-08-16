---
outline: [2, 3]
---

# Introducción a excepciones

Hasta ahora, cuando un programa encontraba un error (dividir entre cero, abrir
un archivo inexistente, quedarse sin memoria...), lo más común era que
simplemente **fallara o terminara de forma abrupta**. Pero un programa real no
puede permitirse eso: necesita una forma de detectar que algo salió mal y
**reaccionar** de manera controlada.

Para eso sirven las **excepciones**: el mecanismo de C++ para manejar errores
en tiempo de ejecución.

## 1. ¿Qué es una excepción?

Una **excepción** es una situación anormal que interrumpe el flujo normal de un
programa. En C++ las excepciones son **objetos** que se "lanzan" (throw) cuando
ocurre un error y se "capturan" (catch) en otro lugar del programa para
manejarlo.

Piénsalo como el sistema de alarma de una casa: cuando algo sale mal, la alarma
suena (se lanza la excepción) y los responsables pueden reaccionar (capturarla)
en lugar de que la casa se queme en silencio.

```cpp
#include <iostream>
#include <stdexcept>
using namespace std;

int main() {
    try {
        // Intentamos dividir entre cero (esto lanzará una excepción)
        int numerador = 10;
        int denominador = 0;

        if (denominador == 0) {
            throw runtime_error("¡No se puede dividir entre cero!");
        }

        cout << "Resultado: " << numerador / denominador << endl;
    }
    catch (const runtime_error &e) {
        // Capturamos la excepción y manejamos el error
        cout << "Error detectado: " << e.what() << endl;
    }

    return 0;
}
```

Observa la estructura: todo el código que *podría* fallar va dentro del bloque
`try`, y la respuesta al error va en el `catch`. Si todo sale bien, el `catch`
nunca se ejecuta; si algo sale mal, el programa no se cae: **reacciona**.

## 2. Las palabras clave: `try`, `throw`, `catch`

El sistema de excepciones de C++ se basa en tres palabras clave:

| Palabra clave | Función |
|---|---|
| `try` | Inicia un bloque donde **podría** ocurrir un error. |
| `throw` | **Lanza** la excepción cuando ocurre el error. |
| `catch` | **Captura** la excepción y la maneja. |

**Flujo de ejecución:**

1. Se entra en el bloque `try`.
2. Si ocurre un `throw`, se detiene la ejecución normal.
3. Se busca un `catch` compatible con la excepción lanzada.
4. Se ejecuta el código del `catch` para manejar el error.
5. El programa continúa después del bloque `try/catch`.

::: info Nota
ℹ️ Si no se encuentra ningún `catch` compatible, el programa termina llamando a
`std::terminate()`, que por defecto aborta la ejecución.
:::

## 3. ¿Por qué usar excepciones?

¿No sería más fácil verificar los errores con `if`? A veces sí, pero las
excepciones tienen ventajas importantes:

- **Separación de la lógica del error**: el código que funciona bien se
  mantiene limpio, sin `if` de errores por todas partes.
- **Propagación automática**: si una función no maneja el error, la excepción
  "sube" por las llamadas hasta encontrar un `catch`.
- **Imposibilidad de ignorar el error**: en C (el lenguaje padre), era común
  olvidarse de revisar el código de retorno. Con excepciones, un error no
  manejado se nota.

```cpp
#include <iostream>
using namespace std;

void funcionA() { cout << "A" << endl; throw 42; }
void funcionB() { funcionA(); }
void funcionC() { funcionB(); }

int main() {
    try {
        funcionC(); // El throw de funcionA "sube" hasta aquí
    }
    catch (int error) {
        cout << "Capturado: " << error << endl;
    }
    return 0;
}
```

::: tip
💡 En este ejemplo, el `throw 42` ocurre en `funcionA`, pero como ninguna
función intermedia lo captura, la excepción viaja por la pila de llamadas hasta
llegar al `catch` de `main()`. Eso es la **propagación de excepciones**.
:::

## 4. ¿Qué se puede lanzar?

En C++ se puede lanzar **cualquier objeto**: enteros, cadenas, o mejor aún,
objetos de clases derivadas de `std::exception`. En la práctica, casi siempre
se lanzan objetos de tipos que indican claramente el error.

```cpp
#include <iostream>
#include <stdexcept>
using namespace std;

int main() {
    try {
        throw runtime_error("Fallo al leer el archivo");
    }
    catch (const runtime_error &e) {
        cout << e.what() << endl;
    }
    return 0;
}
```

La clase `std::runtime_error` (y otras que veremos en el capítulo de jerarquías)
proporciona el método `.what()` que devuelve un mensaje descriptivo. Esa es la
forma en que la excepción nos cuenta qué fue lo que falló.

## 5. Excepciones vs códigos de error

| Característica | Códigos de error | Excepciones |
|---|---|---|
| Claro para el programador | Depende | Sí |
| Propagación | Manual | Automática |
| Riesgo de ignorarlos | Alto | Bajo |
| Coste cuando no hay error | Casi nulo | Pequeño (algunas plataformas) |
| Uso típico | C, APIs de bajo nivel | C++ moderno, STL |

::: warning Advertencia
⚠️ Las excepciones tienen un pequeño coste de rendimiento **solo cuando se
lanzan**. El código sin errores funciona igual de rápido. Eso sí: no uses
excepciones para el control de flujo normal (como un `if`), sino para errores
realmente excepcionales.
:::

## 6. Buenas prácticas

- Usa excepciones para **errores realmente excepcionales**, no para el flujo
  normal.
- Lanza objetos de tipos derivados de `std::exception`.
- Captura por **referencia const** (`catch (const Tipo &e)`).
- Mantén los bloques `try` tan pequeños como sea posible.

## 7. Resumen rápido

- Las **excepciones** manejan errores en tiempo de ejecución.
- `try` / `throw` / `catch` son las tres palabras clave.
- La excepción **propaga** por las llamadas hasta encontrar un `catch`.
- Se puede lanzar cualquier objeto, pero se recomienda derivar de
  `std::exception`.
- Las excepciones no tienen coste si no se lanzan.
- Evita usarlas para el flujo normal del programa.

Ahora que sabes qué son las excepciones, en el siguiente capítulo veremos en
detalle cómo **lanzarlas y capturarlas** correctamente, incluyendo las técnicas
para manejar varios tipos de error a la vez.