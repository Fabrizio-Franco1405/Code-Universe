---
outline: [2, 3]
---

# Herramientas y flags del compilador

Ya tienes tu compilador instalado y tu primer programa funcionando. Pero, ¿qué pasaría si te dijéramos que el compilador es mucho más que un simple "traductor"? Así como un chef tiene a su disposición distintos cuchillos, ollas y técnicas para obtener el mejor platillo, el compilador también cuenta con un conjunto de herramientas y opciones que nos permiten controlar exactamente cómo se transforma nuestro código en un programa ejecutable.

A esas opciones se les conoce como **flags** (banderas), y conocerlas es el primer paso para dejar de ser un simple usuario del compilador y convertirte en alguien que realmente lo domina.

En esta sección veremos:

- Las principales herramientas que acompañan al compilador.
- Los flags más utilizados y para qué sirve cada uno.
- Cómo combinar flags para crear programas más rápidos, seguros y fáciles de depurar.

## 1. Las herramientas que vienen con el compilador

Cuando instalaste tu compilador (GCC, Clang o MSVC), no solo obtuviste el compilador en sí, sino un conjunto de programas que trabajan en equipo. Piénsalo como una caja de herramientas completa:
| Herramienta | Función | Ejemplo de uso |
|---|---|---|
| **Compilador** | Traduce el código fuente a código de máquina. | `g++`, `clang++` |
| **Preprocesador** | Procesa las directivas como `#include` y `#define` antes de compilar. | Forma parte del compilador |
| **Enlazador** | Une los archivos objeto y las librerías para generar el ejecutable final. | `ld`, `link` |
| **Depurador** | Te permite ejecutar el programa paso a paso para encontrar errores. | `gdb`, `lldb` |
| **Analizador de rendimiento** | Mide qué tan rápido y eficiente es tu programa. | `perf`, `valgrind` |
En este capítulo nos enfocaremos en los **flags del compilador**, que es la herramienta que más usarás durante tu aprendizaje.

::: tip
💡 No memorices todos los flags de una vez. Conocer los básicos y saber que los demás existen es más que suficiente para empezar.
:::

## 2. ¿Qué es un flag?

Un **flag** es una opción que le pasamos al compilador en el momento de compilar, escrita generalmente con un guion (`-`) antes de la opción. Sirve para indicarle **cómo** debe comportarse.

**Sintaxis general:**

```Bash
g++ mi_programa.cpp -o mi_programa
```

- `g++` es el compilador.
- `mi_programa.cpp` es el archivo fuente.
- `-o mi_programa` es el flag que indica el nombre del ejecutable de salida.

::: warning Advertencia
⚠️ Si no usas el flag `-o`, el compilador creará un archivo por defecto llamado `a.out` (en Linux/macOS) o `a.exe` (en Windows), lo cual puede ser confuso cuando tienes varios programas.
:::

## 3. Flags fundamentales

Existen muchos flags, pero hay un grupo que usarás prácticamente desde el primer día. Vamos a verlos uno por uno con ejemplos prácticos.

### 3.1 Definir el nombre del ejecutable: `-o`

Como ya vimos, permite elegir el nombre del archivo de salida.

```Bash
g++ hola.cpp -o hola
```

Esto crea un ejecutable llamado `hola` (o `hola.exe` en Windows).

### 3.2 Activar advertencias: `-Wall`

El compilador siempre está "mirando" tu código en busca de problemas. Con `-Wall` le pedimos que nos avise de los posibles errores que no son fatales, pero que podrían causar bugs más adelante.

```Bash
g++ mi_programa.cpp -o mi_programa -Wall
```

```cpp
int main() {
    int x;
    // No se usa 'x'...
}
```

::: warning Advertencia
⚠️ Ignorar las advertencias es como ignorar la luz de "revisar motor" de tu auto: puede que funcione ahora, pero esconde un problema que tarde o temprano saldrá a la luz.
:::

### 3.3 Elegir el estándar del lenguaje: `-std`

C++ ha ido evolucionando con los años (C++11, C++14, C++17, C++20...). Con el flag `-std` le indicamos al compilador qué versión queremos usar.

```Bash
g++ mi_programa.cpp -o mi_programa -std=c++17
```

::: info Nota
ℹ️ Si no especificas el estándar, el compilador usa uno por defecto que suele ser conservador. Para aprovechar las funciones más modernas, siempre especifícalo.
:::

### 3.4 Niveles de optimización: `-O0`, `-O1`, `-O2`, `-O3`

La optimización es el arte de hacer que tu programa sea más rápido y consuma menos recursos. El compilador puede "pulir" tu código automáticamente, pero ese pulido toma tiempo de compilación.
| Flag | Nivel | Uso recomendado |
|---|---|---|
| `-O0` | Sin optimización | Ideal para aprender y depurar |
| `-O1` | Optimización básica | Buen equilibrio |
| `-O2` | Optimización intermedia | El estándar para programas en producción |
| `-O3` | Máxima optimización | Cuando el rendimiento es crítico |

```Bash
g++ mi_programa.cpp -o mi_programa -O2
```

::: tip
💡 Mientras estés aprendiendo, usa `-O0`. Un programa sin optimizar es mucho más fácil de seguir y depurar.
:::

### 3.5 Información de depuración: `-g`

Cuando depuras (es decir, cuando buscas errores paso a paso), el depurador necesita información extra sobre tu código. El flag `-g` incluye esa información en el ejecutable.

```Bash
g++ mi_programa.cpp -o mi_programa -g
```

### 3.6 Enlazar librerías: `-l` y `-L`

Cuando tu programa usa librerías externas (como matemáticas o gráficas), debes indicarle al compilador que las enlace.

```Bash
g++ mi_programa.cpp -o mi_programa -lm
```

En este caso `-lm` enlaza la librería de matemáticas (`m` de math).

### 3.7 Definir macros en tiempo de compilación: `-D`

Permite definir una macro directamente desde la línea de comandos, sin necesidad de escribirla en el código.

```Bash
g++ mi_programa.cpp -o mi_programa -DVERSION=2
```

## 4. Combinando flags: un ejemplo real

En la práctica, rara vez usamos un solo flag. Es común combinarlos para obtener un programa completo:

```Bash
g++ mi_programa.cpp -o mi_programa -std=c++17 -Wall -O2 -g
```

**¿Qué estamos haciendo?**

1. `-o mi_programa` → Definimos el nombre del ejecutable.
2. `-std=c++17` → Usamos el estándar C++17.
3. `-Wall` → Activamos las advertencias.
4. `-O2` → Optimizamos el código.
5. `-g` → Incluimos información de depuración.

## 5. Flags específicos por compilador

Aunque la mayoría de flags funcionan igual en GCC y Clang, MSVC (el compilador de Windows) usa una sintaxis distinta que comienza con `/`.
| Acción | GCC / Clang | MSVC |
|---|---|---|
| Nombre del ejecutable | `-o nombre` | `/Fe:nombre` |
| Advertencias | `-Wall` | `/W4` |
| Estándar | `-std=c++17` | `/std:c++17` |
| Optimización | `-O2` | `/O2` |
| Depuración | `-g` | `/Zi` |
::: info Nota
ℹ️ Si usas Visual Studio, normalmente no escribirás estos flags a mano: el IDE los genera por ti según la configuración que elijas en el menú de propiedades del proyecto.
:::

## 6. Buenas prácticas

- Usa siempre `-Wall` para detectar problemas temprano.
- Especifica el estándar (`-std=c++17` o superior) para aprovechar el C++ moderno.
- Durante el desarrollo, compila con `-O0 -g` para facilitar la depuración.
- Para la versión final de tu programa, compila con `-O2` (o `-O3` si el rendimiento es crítico).
- No combines optimización con depuración si los errores aparecen "de repente": el código optimizado puede comportarse de forma distinta al depurar.

## 7. Resumen rápido

- Los **flags** son opciones que controlan el comportamiento del compilador.
- `-o` define el nombre del ejecutable.
- `-Wall` activa las advertencias.
- `-std` elige la versión de C++.
- `-O0` hasta `-O3` controlan el nivel de optimización.
- `-g` incluye información para el depurador.
- MSVC usa una sintaxis con `/` en lugar de `-`.

Con estos flags ya puedes "hablar" de forma mucho más precisa con tu compilador. En el siguiente capítulo daremos el siguiente paso y veremos cómo funcionan las herramientas y flags en la práctica dentro de proyectos más reales.
