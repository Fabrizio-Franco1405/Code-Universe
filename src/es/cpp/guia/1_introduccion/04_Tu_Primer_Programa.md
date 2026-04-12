---
outline: [2, 3]
---

# Tu primer programa

Antes de adentrarnos en temas más avanzados, es momento de escribir nuestro primer programa en C++. Tradicionalmente, el inicio en casi todos los lenguajes es el famoso "Hello World". Aunque parezca sencillo, este ejercicio es un ritual para programadores y significa que tu entorno está funcionando y que ya puedes comunicarte con la computadora.

## Primer Hola Mundo

A llegado el momento de dar inicio a nuestro primer programa en C++ y que mejor manera que el clásico `Hello World` de toda la vida y que acá luce algo así:

```cpp
#include <iostream>

int main() {
    std::cout << "Hello World" << std::endl;
    return 0;
}
```

No te preocupes si no entiendes nada todavía, en unos segundos estarás viendo a detalle que significa cada línea de código que has visto anteriormente, pero de momento solo trata de compilar esto para ver si tú código ya funciona.

## Compilar y ejecutar

Si estás usando VS Code debes crear un archivo `main.cpp` y compilarlo con el siguiente comando:

```bash
g++ main.cpp -o programa
./main
```

Deberías ver una salida por tu terminal con el siguiente mensaje:

```
Hello World
```

Con esto ya estarías confirmando que tu programa está funcionando correctamente y ese es el primer paso para comenzar a crear tus proyectos.

## Estructura básica

Ahora que hemos visto el código anterior, es importante aclarar para que sirven todas y cada una de esas líneas para que todo quede claro y puedas entender las bases necesarias para poder crear un programa, la estructura básica de un programa en C++ es la siguiente:

### 1. Inclusión de bibliotecas

Siempre que vayamos a importar una biblioteca independientemente sea propia o externa hay que hacerlo con la siguiente estructura: `#include <nombre_de_la_biblioteca>`.

```cpp
#include <iostream>
```

- `#include`: Es una expresión para indicarle al compilador que vamos a importar una biblioteca.

- `<iostream>`: Es el nombre de la biblioteca que permite la entrada y salida de datos.

El nombre de la biblioteca no es un capricho, realmente `io` significa **input/output** que en español se traduce como **entrada/salida** y `stream` significa **flujo**. No obstante el nombre completo de la librería quedaría como **Flujo de entrada y salida**.

### 2. Función principal

Todos los programas en C++ corren dentro de una función principal que es el punto de entrada de la aplicación es por eso que lleva el nombre `main` que podemos traducir como **principal**.

```cpp
int main() {
    return 0;
}
```

- `int`: Es el tipo de dato que retorna la función, en este caso `int` significa **integer** que en español significa **entero** y obliga a que la función retorne un valor de tipo **entero**.

- `main`: Es el nombre de la función.

- `()`: Son los paréntesis que indican que la función no recibe parámetros (lo explicaremos más adelante).

- `{}`: Las llaves indican el cuerpo de la función, es decir, el bloque de código que se ejecutará cuando se llame a la función.

- `return 0;`: Es el valor de retorno de la función, en este caso `0` significa que la función terminó correctamente.

::: warning
La función `main` es obligatoria en C++ y es la que se ejecuta cuando se compila el programa, si el compilador no puede encontrar esta función, generará un error.
:::

### 3. Salida de datos

En C++ hay varias formas de mostrar datos por la terminal, la más común es usar la librería `iostream` que ya hemos importado anteriormente que se escribe así:

```cpp
std::cout << "Hello World" << std::endl;
```

- `std`: Es el `namespace` o espacio de nombres donde vive gran parte de la biblioteca estandar de C++.

- `cout`: Es un objeto que representa el flujo de salida estándar (standard output stream). Por defecto, ese flujo está conectado a la pantalla, así que todo lo que enviemos a cout aparecerá en la consola.

- `<<`: Es el **operador de inserción** que se encarga de "empujar" los datos hacia el flujo de salida y se lee de izquierda a derecha.

- `"Hello World"`: Es el dato que se va a mostrar por la terminal.

- `endl`: Inserta un salto de línea y, además, vacía el buffer de salida para que el texto se muestre inmediatamente.

::: info Nota
ℹ️ El operador `endl` es similar al comando `\n` en C, pero `endl` también vacía el buffer de salida, lo que significa que el texto se mostrará inmediatamente en la terminal.
:::

### 4. Otra forma de hacerlo

Existe una forma alternativa de eliminar el molesto `std` en cada declaración, para ello debes agregar la siguiente línea de código:

```cpp
using namespace std;
```

Acá le estás diciendo al compilador: **"A partir de aquí, si menciono algo que esté dentro del espacio de nombres std, no me hagas escribir std:: delante, asume que me refiero a ese”**.

**En otras palabras:**

- `namespace`: Es como una carpeta o contenedor que agrupa identificadores (funciones, clases, objetos, etc.) para evitar que choquen con otros que tengan el mismo nombre en tu código o en otras bibliotecas.

- `std`: Es el espacio de nombres donde vive la biblioteca estándar de C++ (Standard Library).

- `using namespace std`: Importa todo el contenido de `std` al “espacio global” de tu programa, así puedes escribir simplemente `cout` en lugar de `std::cout`.

**Ejemplo completo:**

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello World" << endl;
    return 0;
}
```

::: info Nota
ℹ️ La forma en la que imprimimos en pantalla es `cout`, algunos creen que es una forma de decir `C Output` (Salida de C), otros creen que es `Console Output` (Salida de Consola), pero la realidad es que aún no hay información oficial sobre esto.
:::