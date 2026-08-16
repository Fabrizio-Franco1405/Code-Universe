---
outline: [2, 3]
---

# Tipos de retorno en C++

El **tipo de retorno** indica qué valor entrega una función después de ejecutar su
lógica. Es la respuesta que la función te devuelve cuando la llamas. C++ permite
devolver **nada** (`void`) o un **valor específico** (`int`, `double`, `std::string`,
etc.). Elegir bien el tipo de retorno es como elegir la medida correcta de una receta:
si te equivocas, el resultado final no será el esperado.

## 1. Funciones que no retornan valor (`void`)

Cuando una función solo ejecuta instrucciones sin necesidad de devolver información,
se usa `void`. En español, `void` podemos traducirlo como **vacío**: la función hace su
trabajo y no te entrega nada a cambio.

```cpp
#include <iostream>
using namespace std;

void mostrarMensaje() {
    cout << "Esta función no devuelve nada." << endl;
}

int main() {
    mostrarMensaje();
    return 0;
}
```

En este caso, `mostrarMensaje()` no retorna nada, solo imprime un texto en consola.

## 2. Funciones que retornan un valor

Si una función debe entregar un resultado, se especifica el tipo de dato en la
declaración. El valor se envía mediante la palabra clave `return`. Acá la función sí
te "devuelve la mano": ejecuta su lógica y te entrega un resultado que puedes guardar
o usar.

```cpp
int sumar(int a, int b) {
    return a + b; // devuelve un entero
}

double dividir(double a, double b) {
    return a / b; // devuelve un double
}
```

En estos ejemplos:

- `sumar` devuelve un entero.
- `dividir` devuelve un número en coma flotante.

## 3. Uso de `return`

La palabra clave `return` en este contexto se usa para devolver un valor desde una
función. Esta instrucción hace lo siguiente:

- Finaliza la ejecución de la función.
- Devuelve el valor indicado (si corresponde al tipo de retorno).

::: warning Advertencia
⚠️ El valor retornado debe coincidir con el **tipo de retorno declarado**. Por ejemplo,
una función `int` no puede devolver una cadena de texto.
:::

Ejemplo incorrecto:
```cpp
int ejemplo() {
    return "texto"; // ❌ Error de compilación [!code error]
}
```

## 4. Implicaciones en la llamada

El tipo de retorno determina cómo se usa la función:

```cpp
int resultado = sumar(5, 3); // Se guarda en una variable entera
dividir(10.0, 2.0);          // Se puede usar dentro de otra expresión
```

::: info Nota
ℹ️ Si no se usa el valor retornado, el compilador puede ignorarlo silenciosamente,
aunque en algunos casos esto es riesgoso.
:::

## 5. `[[nodiscard]]` en C++17

Desde C++17 podemos usar el atributo `[[nodiscard]]` para advertir si el valor
retornado no es utilizado. En otras palabras, le decimos al compilador: "ojo, el
resultado de esta función es importante, avísame si alguien lo ignora".

```cpp
[[nodiscard]] int calcularSaldo() {
    return 100;
}

int main() {
    calcularSaldo(); // ⚠ Advertencia: el valor retornado se ignora [!code warning]
}
```

Esto ayuda a evitar errores donde el valor calculado es importante pero olvidamos usarlo.

## Resumen rápido

- `void` → la función no devuelve nada.
- Un tipo concreto (`int`, `double`, `std::string`, etc.) → la función entrega un valor.
- `return` finaliza la función y entrega el resultado.
- El valor retornado debe coincidir con el tipo declarado.
- `[[nodiscard]]` (C++17) advierte si se ignora el valor devuelto.

Ya sabes qué puede devolver una función. En el siguiente capítulo veremos cómo
**recibir información desde el exterior** con los parámetros, para que tus funciones
sean mucho más flexibles y reutilizables.