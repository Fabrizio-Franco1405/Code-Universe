---
outline: [2, 3]
---

# Lanzamiento y captura

En el capítulo anterior vimos el concepto general de excepciones con las
palabras clave `try`, `throw` y `catch`. Ahora profundizaremos en los detalles
prácticos: cómo lanzar correctamente, cómo capturar varios tipos de error, y
las técnicas más importantes para manejarlos con elegancia.

## 1. Cómo lanzar una excepción

La palabra clave `throw` lanza la excepción. Lo más común es lanzar **objetos**,
idealmente de tipos derivados de `std::exception`:

```cpp
#include <iostream>
#include <stdexcept>
using namespace std;

double dividir(double a, double b) {
    if (b == 0) {
        throw runtime_error("División entre cero"); // Lanzamos el error
    }
    return a / b;
}

int main() {
    try {
        double resultado = dividir(10, 0); // Aquí ocurrirá el throw
        cout << resultado << endl;
    }
    catch (const runtime_error &e) {
        cout << "Error: " << e.what() << endl;
    }
    return 0;
}
```

::: tip
💡 Lanzamos en la función `dividir` y capturamos en `main()`. La excepción
"viaja" automáticamente hasta el `catch`, sin necesidad de devolver códigos de
error.
:::

Fíjate en la división de responsabilidades: `dividir()` solo se preocupa por
detectar el problema y lanzarlo; `main()` es quien decide qué hacer con él. Esa
separación es una de las grandes ventajas de las excepciones.

## 2. Capturar por referencia `const`

Siempre deberías capturar por **referencia const**: `catch (const runtime_error
&e)`. ¿Por qué?

- Evitas copias innecesarias del objeto de excepción.
- Puedes capturar objetos de clases derivadas sin "rebanarlos" (slicing).

```cpp
try {
    throw out_of_range("Índice fuera de rango");
}
catch (const out_of_range &e) {
    cout << "Fuera de rango: " << e.what() << endl;
}
```

El término "slicing" (rebanado) viene de la imagen de cortar una fruta: si
capturas por valor una excepción derivada dentro de un parámetro de tipo base,
te quedas solo con la parte de la base y pierdes la información de la clase
derivada. Capturar por referencia preserva el objeto completo.

## 3. Múltiples bloques `catch`

Un bloque `try` puede tener varios `catch`, cada uno para un tipo distinto de
error. El compilador elige el **más específico** que coincida:

```cpp
#include <iostream>
#include <stdexcept>
using namespace std;

int main() {
    try {
        // throw runtime_error("Error genérico");
        throw out_of_range("Índice fuera de rango");
    }
    catch (const out_of_range &e) {
        cout << "Capturado como out_of_range: " << e.what() << endl;
    }
    catch (const runtime_error &e) {
        cout << "Capturado como runtime_error: " << e.what() << endl;
    }
    catch (const exception &e) {
        cout << "Capturado como exception: " << e.what() << endl;
    }
    return 0;
}
```

Puedes ver los `catch` como una lista de "puertas" con etiquetas: la excepción
entra por la primera puerta cuya etiqueta coincida. Si lanzas `out_of_range`,
entra por la primera; si lanzas un `runtime_error` genérico, entra por la
segunda.

::: info Nota
ℹ️ El orden importa: como `out_of_range` **deriva** de `runtime_error`, que a su
vez deriva de `exception`, debes capturar primero los tipos más específicos. Si
capturas `exception` primero, todos los demás `catch` serán ignorados.
:::

## 4. Capturar cualquier excepción: `...`

A veces no sabes (o no te importa) qué excepción puede ocurrir, pero quieres
asegurarte de capturar todas. Para eso existe la captura universal con tres
puntos:

```cpp
#include <iostream>
using namespace std;

int main() {
    try {
        // ... código que podría fallar de muchas formas ...
        throw "un error de tipo cadena";
    }
    catch (const exception &e) {
        cout << "Excepción estándar: " << e.what() << endl;
    }
    catch (...) {
        cout << "Excepción desconocida capturada" << endl;
    }
    return 0;
}
```

Los tres puntos `...` funcionan como una red de seguridad que atrapa cualquier
cosa que se lance, sea lo que sea. En el ejemplo, lanzamos una cadena (un
`const char*`), que no deriva de `exception`, así que pasa directo a la red.

::: warning Advertencia
⚠️ La captura `catch (...)` debe ir siempre **al final**. Úsala como red de
seguridad para evitar que el programa termine abruptamente, pero recuerda: al no
conocer el tipo, no puedes saber qué falló realmente.
:::

## 5. Relanzar una excepción: `throw;`

A veces quieres hacer algo con el error y **dejarlo seguir** hacia niveles
superiores. Se usa `throw;` (sin argumentos) dentro de un `catch`:

```cpp
#include <iostream>
#include <stdexcept>
using namespace std;

void proceso() {
    try {
        throw runtime_error("Fallo crítico");
    }
    catch (const runtime_error &e) {
        cout << "Registrando error: " << e.what() << endl;
        throw; // Relanzamos la misma excepción
    }
}

int main() {
    try {
        proceso();
    }
    catch (const runtime_error &e) {
        cout << "Manejado en main: " << e.what() << endl;
    }
    return 0;
}
```

::: tip
💡 `throw;` es útil para registrar el error en un nivel y manejarlo en otro. Se
usa mucho en arquitecturas en capas (por ejemplo, la capa de datos registra y
relanza, la interfaz de usuario captura y muestra).
:::

Es como pasar una nota de incidencia: cada nivel anota lo que sabe y la pasa al
siguiente nivel para que decida qué hacer con ella.

## 6. Listas de excepciones (`noexcept`)

En C++ moderno se recomienda declarar explícitamente si una función puede lanzar
excepciones. La palabra clave `noexcept` indica que **no lanza ninguna**:

```cpp
#include <iostream>
using namespace std;

// Esta función promete no lanzar excepciones
int sumar(int a, int b) noexcept {
    return a + b;
}

int main() {
    cout << sumar(3, 4) << endl; // 7
    return 0;
}
```

`noexcept` funciona como una promesa al compilador: "esta función no va a
fallar". Con esa información, el compilador puede optimizar mejor el código. El
nombre se lee como *no exceptions* (sin excepciones).

::: warning Advertencia
⚠️ Si una función `noexcept` intenta lanzar una excepción, el programa termina
inmediatamente (llama a `std::terminate`). Solo marca como `noexcept` funciones
que realmente no lanzan, como operaciones de tipos primitivos o funciones de
movimiento.
:::

## 7. Errores comunes al lanzar y capturar

1. **Olvidar el `&`**: `catch (runtime_error e)` copia el objeto y puede perder
   información de tipos derivados.
2. **Capturar por valor clases base antes que derivadas**: el slicing rompe el
   polimorfismo.
3. **Lanzar punteros**: `throw new runtime_error(...)` obliga a liberar memoria
   manualmente y es propenso a fugas.
4. **Usar excepciones para control de flujo**: son costosas y hacen el código
   difícil de leer.

## 8. Buenas prácticas

- Lanza objetos (no punteros) derivados de `std::exception`.
- Captura por referencia const.
- Ordena los `catch` de lo más específico a lo más general.
- Usa `catch (...)` solo como red final de seguridad.
- Marca como `noexcept` las funciones que no lanzan.
- Mantén bloques `try` pequeños y claros.

## 9. Resumen rápido

- `throw` lanza; `catch` captura; el compilador elige el `catch` más específico.
- Captura por referencia const para evitar copias y slicing.
- Múltiples `catch` manejan distintos tipos de error.
- `catch (...)` captura cualquier excepción (y va al final).
- `throw;` relanza la misma excepción.
- `noexcept` declara funciones que no lanzan.

Con el lanzamiento y captura dominados, el siguiente paso es conocer las
excepciones que ya trae la biblioteca estándar y cómo se organizan: la
**jerarquía de excepciones**.