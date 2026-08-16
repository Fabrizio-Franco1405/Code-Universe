---
outline: [2, 3]
---

# Excepciones personalizadas

La jerarquía de excepciones estándar cubre los errores más comunes, pero en una
aplicación real surgen errores **específicos de tu dominio**: "saldo
insuficiente", "cliente no encontrado", "formato de archivo inválido"... La
solución es crear tus **propias clases de excepción**.

En este capítulo aprenderás a diseñar excepciones personalizadas que se
integren perfectamente con el sistema de excepciones de C++.

## 1. La forma básica

La manera correcta de crear una excepción personalizada es **heredar de
`std::exception`** (o de una derivada como `std::runtime_error`) y sobrescribir
`what()`.

La forma más simple:

```cpp
#include <iostream>
#include <stdexcept>
using namespace std;

// Heredamos de runtime_error para aprovechar su funcionalidad
class ErrorSaldoInsuficiente : public runtime_error {
public:
    // Pasamos el mensaje al constructor de la base
    ErrorSaldoInsuficiente() : runtime_error("Saldo insuficiente para la operación") {}
};

int main() {
    try {
        throw ErrorSaldoInsuficiente();
    }
    catch (const ErrorSaldoInsuficiente &e) {
        cout << "Error capturado: " << e.what() << endl;
    }
    return 0;
}
```

::: tip
💡 Heredar de `runtime_error` (o `logic_error`) es lo más habitual: ya
implementan `what()` y se integran con la jerarquía estándar. Solo necesitas
pasarle el mensaje.
:::

Fíjate en lo elegante que resulta: no tuvimos que escribir casi nada. Al heredar
de `runtime_error`, la clase ya "sabe" guardar el mensaje y devolverlo con
`what()`. Nuestra única tarea fue darle un mensaje apropiado para el dominio de
nuestra aplicación.

## 2. Excepciones con mensaje dinámico

En la mayoría de casos querrás que la excepción incluya **información del
contexto**: qué valor falló, en qué archivo, etc.

```cpp
#include <iostream>
#include <stdexcept>
#include <string>
using namespace std;

class ErrorProductoNoEncontrado : public runtime_error {
public:
    // Aceptamos el ID y construimos un mensaje descriptivo
    ErrorProductoNoEncontrado(int id)
        : runtime_error("Producto con ID " + to_string(id) + " no encontrado") {}
};

int main() {
    try {
        int idBuscado = 123;
        throw ErrorProductoNoEncontrado(idBuscado);
    }
    catch (const ErrorProductoNoEncontrado &e) {
        cout << e.what() << endl;
    }
    return 0;
}
```

::: info Nota
ℹ️ `std::to_string(int)` convierte un número a `std::string`, permitiéndonos
construir mensajes como `"Producto con ID 123 no encontrado"`. El constructor de
`runtime_error` acepta un `string`.
:::

Este es el gran salto de calidad: en lugar de un mensaje genérico, el error nos
dice exactamente **cuál** producto no se encontró. Cuando estés depurando una
aplicación con miles de productos, esa pequeña diferencia es oro puro.

## 3. Almacenar información adicional

A veces el mensaje no basta: quizás necesitas el **código de error** o valores
numéricos para procesar el error después.

```cpp
#include <iostream>
#include <stdexcept>
#include <string>
using namespace std;

class ErrorBancario : public runtime_error {
private:
    int codigoError;
    double montoSolicitado;

public:
    ErrorBancario(int codigo, double monto, const string &mensaje)
        : runtime_error(mensaje), codigoError(codigo), montoSolicitado(monto) {}

    // Métodos de acceso a la información extra
    int getCodigo() const { return codigoError; }
    double getMonto() const { return montoSolicitado; }
};

int main() {
    try {
        throw ErrorBancario(502, 1500.75, "Operación rechazada");
    }
    catch (const ErrorBancario &e) {
        cout << "Mensaje: " << e.what() << endl;
        cout << "Código: " << e.getCodigo() << endl;
        cout << "Monto: " << e.getMonto() << endl;
    }
    return 0;
}
```

Tu excepción ya no es solo un mensaje: es una **ficha completa** del error, con
código y montos, lista para que la interfaz de usuario la muestre o el sistema
de registro la procese. Es exactamente lo que necesita una aplicación bancaria
seria.

## 4. Jerarquía de excepciones propias

Igual que la biblioteca estándar, puedes crear tu **propia jerarquía** de
errores. Es muy útil en aplicaciones grandes: capturas la clase base para
manejar todos los errores de tu dominio, o la derivada para casos específicos.

```cpp
#include <iostream>
#include <stdexcept>
using namespace std;

// Base de todos los errores de la aplicación
class ErrorAplicacion : public runtime_error {
public:
    ErrorAplicacion(const string &mensaje) : runtime_error(mensaje) {}
};

// Errores relacionados con la base de datos
class ErrorBaseDatos : public ErrorAplicacion {
public:
    ErrorBaseDatos(const string &mensaje) : ErrorAplicacion(mensaje) {}
};

// Error específico: no se pudo conectar
class ErrorConexion : public ErrorBaseDatos {
public:
    ErrorConexion() : ErrorBaseDatos("No se pudo conectar a la base de datos") {}
};

int main() {
    try {
        throw ErrorConexion();
    }
    catch (const ErrorConexion &e) {
        cout << "Específico: " << e.what() << endl;
    }
    catch (const ErrorBaseDatos &e) {
        cout << "Error de BD: " << e.what() << endl;
    }
    catch (const ErrorAplicacion &e) {
        cout << "Error de app: " << e.what() << endl;
    }
    return 0;
}
```

::: tip
💡 Diseña tu jerarquía pensando en **cómo la vas a capturar**. Si tienes 20
clases que nunca se capturan de forma específica, probablemente sea mejor tener
menos niveles.
:::

Este diseño te da el mejor de ambos mundos: puedes capturar el error de conexión
para actuar con precisión, agrupar todos los errores de base de datos, o
atrapar cualquier error de tu aplicación con un solo `catch`. El nivel de detalle
lo eliges tú, según el contexto.

## 5. Sobrescribir `what()` manualmente

Si heredas directamente de `std::exception` (sin usar `runtime_error`), debes
implementar `what()` tú mismo. La forma correcta es **guardar el mensaje** como
atributo, porque `what()` devuelve un `const char*` que debe seguir siendo
válido:

```cpp
#include <iostream>
#include <exception>
#include <string>
using namespace std;

class ErrorPersonalizado : public exception {
private:
    string mensaje;

public:
    explicit ErrorPersonalizado(const string &msg) : mensaje(msg) {}

    // Sobrescribimos what() para devolver nuestro mensaje
    const char *what() const noexcept override {
        return mensaje.c_str();
    }
};

int main() {
    try {
        throw ErrorPersonalizado("Algo falló en mi clase");
    }
    catch (const ErrorPersonalizado &e) {
        cout << e.what() << endl;
    }
    return 0;
}
```

::: warning Advertencia
⚠️ No devuelvas un puntero a un literal local o a un objeto temporal: el puntero
debe apuntar a memoria que siga viva. Por eso guardamos el `string` como miembro
de la clase.
:::

El detalle crítico está en `what()`: devuelve un `const char*` (un puntero a
caracteres), y ese puntero debe seguir apuntando a algo válido mientras el
objeto de excepción exista. Si guardamos el mensaje como atributo `string`, el
puntero devuelto por `mensaje.c_str()` siempre será seguro. Guardar el mensaje
como miembro de la clase es la forma de garantizarlo.

## 6. Buenas prácticas

- Hereda de `std::exception` o de una derivada (`runtime_error`,
  `logic_error`).
- Nombra tus excepciones con el sufijo `Error` o `Exception` (ej:
  `ErrorSaldoInsuficiente`).
- Incluye en la excepción la información necesaria para **manejarla** (códigos,
  valores).
- Crea jerarquías propias solo cuando aporten valor al manejo de errores.
- Marca `what()` como `noexcept` (como exige la interfaz base).

## 7. Resumen rápido

- Las excepciones personalizadas **heredan de `std::exception`** (o derivadas).
- Pueden llevar mensajes dinámicos con `to_string()`.
- Pueden **almacenar información extra** (códigos, montos, valores).
- Se pueden organizar en **jerarquías propias**.
- Al heredar de `exception` directamente, implementa `what()` guardando el
  mensaje como atributo.

Con excepciones personalizadas, tu aplicación puede comunicar sus errores con
precisión y elegancia. En el siguiente capítulo veremos cómo se combinan las
excepciones con la gestión de recursos: **RAII y excepciones**.