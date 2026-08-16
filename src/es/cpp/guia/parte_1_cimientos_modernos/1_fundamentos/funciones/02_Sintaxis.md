---
outline: [2, 3]
---

# Sintaxis de una función en C++

Ya sabemos qué es una función y por qué nos conviene usarlas. Ahora vamos a aprender a
escribirlas. La estructura general de una función en C++ incluye varios elementos: El
**tipo de retorno**, el **nombre**, la **lista de parámetros** y el **cuerpo**. Cada
pieza tiene un rol específico, como las partes de un motor: si falta una, el motor no
arranca.

## Forma general

```cpp
tipo_de_retorno nombre_funcion(parametros) {
    // Cuerpo de la función
    // Instrucciones que se ejecutan cuando la función es llamada
}
```

**Componentes principales**

1. **Tipo de retorno**
   Especifica el tipo de dato que devolverá la función (ej: `int`, `double`,
   `std::string`). Si no devuelve nada, se usa la palabra clave `void`.

2. **Nombre de la función**
   Debe ser descriptivo y seguir las reglas de los identificadores en C++.

3. **Parámetros (opcional)**
   Entre paréntesis se definen las variables que recibirá la función.
   Si no necesita parámetros, se dejan los paréntesis vacíos `()`.

4. **Cuerpo**
   Contiene el bloque de código encerrado entre `{}` que define qué hace la función.

**Ejemplo básico**
```cpp
#include <iostream>
using namespace std;

// Declaración y definición
void saludar() {
    cout << "Hola, bienvenido al mundo de C++!" << endl;
}

int main() {
    saludar(); // Llamada a la función
    return 0;
}
```

En este ejemplo:

- El tipo de retorno es `void` (no devuelve nada).
- El nombre de la función es `saludar`.
- No recibe parámetros.
- El cuerpo imprime un mensaje en pantalla.

## Declaración vs. Definición

En C++ es común **declarar** funciones antes de `main()` y **definirlas** más abajo o
en otro archivo. La declaración es como una promesa: le dices al compilador "esta
función existe y se ve así". La definición es el cumplimiento de esa promesa: el código
real que la implementa.

```cpp
#include <iostream>
using namespace std;

// Declaración (prototipo)
int sumar(int a, int b);

int main() {
    cout << sumar(5, 7) << endl;
    return 0;
}

// Definición
int sumar(int a, int b) {
    return a + b;
}
```

::: info Nota
ℹ️ Separar **declaración** y **definición** es útil cuando trabajamos con múltiples
archivos (`.h` y `.cpp`).
:::

## Llamada a funciones

Una función se ejecuta cuando es **llamada** desde otra parte del programa. Para
llamarla, escribimos su nombre seguido de paréntesis con los argumentos
correspondientes. Es como pulsar el botón de encendido: en ese momento la función
cobra vida.

**Ejemplo:**
```cpp
int resultado = sumar(10, 20);
```

Aquí la función `sumar` recibe dos enteros (`10` y `20`) y devuelve un valor que se
guarda en `resultado`.

## Resumen rápido

- Una función tiene **tipo de retorno**, **nombre**, **parámetros** y **cuerpo**.
- `void` indica que la función no devuelve nada.
- La **declaración** anuncia la función; la **definición** la implementa.
- Para ejecutar una función hay que **llamarla** con su nombre y sus argumentos.

Ya sabes escribir y llamar funciones. En el siguiente capítulo profundizaremos en los
**tipos de retorno**: qué puede devolver una función y cómo aprovecharlo.