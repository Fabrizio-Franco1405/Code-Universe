---
outline: [2, 3]
---

# Compilador

En este capítulo aprenderás qué es y cómo funciona el **compilador**, una de las herramientas más importantes que utilizarás al programar en C++. Aunque puede parecer invisible porque muchas veces basta con presionar un botón para “ejecutar”, el compilador es en realidad el encargado de transformar tu código fuente en un programa que la computadora pueda entender.

Conocer cómo trabaja no solo te ayuda a comprender mejor lo que ocurre tras bambalinas, sino también a interpretar errores de compilación y optimizar tu forma de programar.

## ¿Qué hace el compilador?

El compilador es un traductor entre dos mundos: El tuyo (código en C++) y el de la máquina (instrucciones en binario). Tu escribes instrucciones en un lenguaje legible, pero la computadora únicamente entiende ceros y unos. El compilador toma ese código y lo convierte en un **ejecutable**, realizando varios pasos intermedios.

En términos simples, sin compilador tu código sería solo texto sin sentido para la computadora. Con el compilador, ese texto se convierte en un programa funcional.

## Proceso de compilación

El proceso de compilación no ocurre en un solo paso, sino en una serie de fases. Cada fase cumple una función esencial para que tu programa pase de texto a ejecutable:

1. **Preprocesamiento**  
   Antes de compilar, se ejecutan las directivas que comienzan con `#` (como `#include` o `#define`). Aquí se insertan cabeceras, se sustituyen macros y se preparan los archivos para la siguiente etapa.

2. **Compilación**  
   El código fuente ya “limpio” pasa a ser traducido a un lenguaje intermedio más cercano al hardware, así que pasa a convertirse en **Ensamblador**. En este paso también se revisa la **sintaxis** y si cometes un error en el código, el compilador lo detectará aquí.

3. **Ensamblado**  
   El ensamblador convierte ese lenguaje intermedio en **código máquina**. El resultado son archivos binarios llamados objetos (`.o` en Linux/Mac o `.obj` en Windows).

4. **Enlazado (Linking)**  
   Finalmente, los archivos objeto se combinan con librerías externas (por ejemplo, la librería estándar de C++). De esta unión surge el **ejecutable final**, que ya puedes correr en tu sistema operativo.

## Principales compiladores de C++

No existe un único compilador de C++, sino varios desarrollados por diferentes comunidades y empresas. En esta guía te hablaremos de los más conocidos y utilizados:

- **GCC (GNU Compiler Collection):**  
  Probablemente el compilador más popular en el mundo del software libre. Es multiplataforma, de código abierto y ampliamente usado en sistemas Linux, aunque también puede instalarse en Windows y macOS.

- **Clang:**  
  Es un compilador moderno desarrollado por el proyecto LLVM. Destaca por su velocidad, mensajes de error más claros y ser el predeterminado en macOS. Es una excelente alternativa a GCC.

- **MSVC (Microsoft Visual C++):**  
  Es el compilador oficial de Microsoft. Viene integrado en Visual Studio y es el estándar para desarrollar aplicaciones en C++ para Windows de forma profesional.

Todos cumplen el mismo rol, pero según tu sistema operativo y tus necesidades puede que prefieras uno sobre otro. 

## Compilación en la práctica

Hasta ahora hemos visto el concepto, pero ¿cómo se traduce a la práctica?. Hagamos un ejemplo utilizando el compilador de GCC. Supongamos que tienes un archivo llamado `main.cpp` y quisieras compilarlo para generar un ejecutable llamado `main`, en ese caso deberíamos ejecutar lo siguiente en nuestra terminal:

```bash
g++ main.cpp -o main
./main
```

::: tip
💡 La extensión `.cpp` es la que indica que el archivo es de C++ y utiliza esas letras porque son las siglas en inglés de **C Plus Plus**.
:::

Explicación del comando:

- `g++`: Invoca al compilador GCC para ser utilizado.
- `main.cpp`: Es el archivo fuente que deseas compilar.
- `-o main`: Indica el nombre del ejecutable final.

::: warning Advertencia
⚠️ Si no colocas el `-o` el compilador generará un ejecutable con el nombre `a.out` en Linux/macOS o `a.exe` en windows.
:::

Este comando termina compilando tu archivo `main.cpp` y generando un ejecutable llamado `main`, el cual puedes ejecutar con `./main` y automaticamente estarás corriendo tu programa.