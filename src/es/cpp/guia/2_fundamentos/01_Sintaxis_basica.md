---
outline: [2, 3]
---

# Sintaxis básica

Cuando aprendes un idioma nuevo, no basta con conocer palabras; también debes aprender cómo ordenarlas para que tengan sentido. En programación ocurre lo mismo: la **sintaxis** es el conjunto de reglas que define cómo escribir correctamente las instrucciones que el compilador entenderá.

En C++, si rompes estas reglas, el compilador no “adivina” lo que quisiste decir; simplemente arroja un error. Dominar la sintaxis básica es equivalente a aprender la gramática mínima para poder “hablar” con la computadora.

:::tip
💡 **Recuerda:** 
- **Sintaxis →** Cómo se escribe el código.
- **Semántica →** Qué significa el código que escribes.
:::

## 1. Estructura mínima de un programa en C++

El archivo principal de un programa en C++ suele llamarse `main.cpp`, y toda aplicación debe tener un **punto de entrada**, que es la función `main()`.

```cpp
#include <iostream> // Biblioteca estándar de entrada/salida

int main() {
    std::cout << "Hola mundo\n"; // Muestra un mensaje en pantalla
    return 0;                    // Indica que el programa terminó correctamente
}
```

:::info Nota
ℹ️ Todo lo que se escriba dentro de `main()` se ejecutará al compilar y ejecutar el programa. Declarar funciones o variables fuera de `main()` no las ejecuta automáticamente.
:::

## 2. Comentarios

Los comentarios son fragmentos de texto **ignorados por el compilador**, útiles para documentar la intención del código o dejar recordatorios.

- **De una sola línea:** Comienzan con `//` y llegan hasta el final de la línea.
```cpp
// Esto es un comentario de una línea
std::cout << "Hola\n";
```

- **De varias líneas:** Comienzan con `/*` y terminan con `*/`.
```cpp
/* Esto es un comentario
   que ocupa varias líneas */
std::cout << "Hola\n";
```

:::warning Advertencia
⚠️ No abuses de los comentarios para describir lo obvio. El mejor código se explica por sí mismo; los comentarios deben aclarar el por qué, no el qué.
:::

## 3. Sentencias y punto y coma

Cada instrucción completa en C++ se llama **sentencia** y debe terminar con un punto y coma `;`. Si lo omites, el compilador arrojará un error.

```cpp
int x = 5;    // Declaración de variable
x = x + 1;    // Asignación
```

Cuando varias sentencias se agrupan, se encierran entre llaves `{ }`, formando un **bloque**:

```cpp
if (x > 0) {
    std::cout << "Positivo\n";
    x--;
}
```

## 4. Sensibilidad a mayúsculas y minúsculas

C++ distingue entre mayúsculas y minúsculas. Por ejemplo, `variable`, `Variable` y `VARIABLE` son identificadores distintos.

```cpp
int valor = 5;
int Valor = 10;
int VARIABLE = 15;

std::cout << valor;    // 5
std::cout << Valor;    // 10
std::cout << VARIABLE; // 15
```

:::tip 
💡 Sé consistente con los nombres de variables para evitar errores difíciles de detectar.
:::

## 5. Espacios en blanco e indentación

Los **espacios, tabulaciones y saltos de línea** no afectan la ejecución, pero sí la legibilidad.

Ejemplo sin formato legible:
```cpp
if(x>0){std::cout<<"Positivo\n";}
```

Ejemplo bien indentado y legible:
```cpp
if (x > 0) {
    std::cout << "Positivo\n";
}
```

:::tip 
💡 Usa una indentación consistente (2 o 4 espacios) y coloca las llaves de forma coherente en todo el proyecto. Esto facilita la lectura y el trabajo en equipo.
:::

## 6. Delimitadores y bloques de código

Los bloques de código delimitados por `{}` son **estructuras que agrupan sentencias**. Se usan en funciones, condicionales y bucles. Esto permite que múltiples instrucciones se ejecuten como un conjunto dentro de la misma estructura de control.

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 0; i < 3; i++) {
        cout << "Iteración: " << i << endl;
    }
}
```

## 7. Ejemplo práctico: Programa completo mínimo

A continuación veremos un **programa mínimo en C++** que integra varias de las sintaxis básicas que hemos aprendido: Declaración de variables, operaciones aritméticas, bloques condicionales y salida en consola.

```cpp
#include <iostream>
using namespace std;

int main() {
    // Declaración de variables
    int a = 5;
    int b = 3;

    // Operación y salida
    int suma = a + b;
    cout << "Suma: " << suma << endl;

    // Bloque condicional
    if (suma > 5) {
        cout << "Mayor que cinco" << endl;
    } else {
        cout << "Cinco o menor" << endl;
    }

    return 0;
}
```

Este ejemplo muestra:

- Declaración de variables.
- Operaciones aritméticas.
- Uso de bloques condicionales.
- Salida de información en consola.

## 8. Buenas prácticas

- Mantén **indentación y formato consistentes**.
- Usa comentarios **para explicar el propósito**, no lo obvio.
- Elige nombres de variables claros y significativos.
- Respeta la sensibilidad a mayúsculas y minúsculas.
- Separa lógicamente los bloques de código con saltos de línea para mejorar la legibilidad.

## 9. Resumen rápido

- **Sintaxis**: reglas para escribir código correcto.
- **Comentarios**: documentación interna para facilitar comprensión.
- **Sentencias**: deben terminar con ;.
- **Bloques**: { } agrupa varias sentencias.
- **Identificadores**: sensibles a mayúsculas/minúsculas.
- **Indentación y espacios**: no afectan ejecución pero sí legibilidad.