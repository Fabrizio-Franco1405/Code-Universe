---
outline: [2, 3]
---

# Introducción a plantillas

Imagina que necesitas una función que devuelva el mayor de dos números.
Primero la escribes para enteros. Después descubres que también la necesitas
para `double`. Luego para `char`. ¿Vas a escribir tres funciones casi
idénticas que solo cambian el tipo de dato? Eso no solo es tedioso, sino que
además viola uno de los principios más sagrados de la programación: **no
repetir código**.

Acá es donde entran las **plantillas** (templates), la solución que C++
encontró a este problema. Nos permiten escribir **código genérico** que
funciona con cualquier tipo, escribiendo la lógica **una sola vez** y dejando
que el compilador haga el resto del trabajo pesado por nosotros.

## 1. ¿Qué es una plantilla?

Una plantilla es un "molde de código" que le dice al compilador: "esta
función o clase puede funcionar con cualquier tipo T". Cuando la usas con un
tipo concreto, el compilador **genera automáticamente** la versión para ese
tipo.

Piénsalo de la misma manera que un molde para galletas: el molde no es la
galleta en sí, pero con él puedes preparar todas las galletas que quieras con
la misma forma. Si las funciones normales son como recetas escritas para un
ingrediente específico, las plantillas son recetas que dicen "usa el
ingrediente que quieras".

Cabe destacar que la palabra `template` viene del inglés y significa
**plantilla** o **molde**, un nombre que describe a la perfección lo que
estamos haciendo.

**Sintaxis básica:**

```cpp
template <typename T>
T maximo(T a, T b) {
    return (a > b) ? a : b;
}
```

- `template` indica que estamos frente a una plantilla.
- `typename T` (o `class T`) declara el tipo genérico, el "hueco" que el
  compilador llenará más adelante.
- Dentro de la función, `T` se usa como si fuera un tipo real cualquiera.

## 2. Primer ejemplo: función genérica

Vamos a poner manos a la obra con el ejemplo clásico, la función `maximo`.
Con una sola plantilla podremos usarla con enteros, con decimales y hasta con
caracteres, sin escribir una línea más de código:

```cpp
#include <iostream>
using namespace std;

template <typename T>
T maximo(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    cout << maximo(3, 7) << endl;        // 7 (int)
    cout << maximo(3.5, 2.9) << endl;    // 3.5 (double)
    cout << maximo('a', 'z') << endl;    // z (char)

    return 0;
}
```

::: info Nota
ℹ️ El compilador deduce el tipo `T` automáticamente a partir de los
argumentos. Para `maximo(3, 7)`, deduce `T = int` y genera una función
especializada para enteros.
:::

## 3. ¿Qué hace el compilador "por debajo"?

Lo que ocurre al compilar es algo fascinante, y entenderlo te va a ayudar a
dominar todo el resto de la programación genérica: el compilador **genera una
copia de la función por cada tipo distinto** que uses. A este proceso se le
llama **instanciación de plantillas**.

```cpp
// Lo que escribimos:
maximo(3, 7);
maximo(3.5, 2.9);

// Lo que genera el compilador:
int maximo(int a, int b) { return (a > b) ? a : b; }
double maximo(double a, double b) { return (a > b) ? a : b; }
```

En otras palabras: cada instanciación es código real y optimizado para ese
tipo concreto. No pagas nada por los tipos que no usas, el compilador solo
genera lo necesario.

::: tip
💡 Esta es una diferencia clave con otros lenguajes: las plantillas de C++ se
resuelven en **tiempo de compilación**, no en tiempo de ejecución. No hay
ningún costo de rendimiento en la ejecución.
:::

## 4. ¿`typename` o `class`?

Puedes usar cualquiera de las dos, son totalmente equivalentes:

```cpp
template <typename T> void f() {}
template <class T> void f() {} // Equivalente
```

::: info Nota
ℹ️ Históricamente `class` apareció primero, y `typename` se añadió después
para dejar claro que `T` es un tipo y no una clase en particular. Hoy en día
la comunidad suele preferir `typename` para tipos genéricos y reservar
`class` para el contexto de clases.
:::

## 5. Plantillas con varios parámetros

Una plantilla no tiene por qué limitarse a un solo tipo: puede tener varios
parámetros de tipo a la vez. Esto es muy útil cuando necesitas combinar tipos
distintos, como verás en el siguiente ejemplo:

```cpp
#include <iostream>
using namespace std;

template <typename T, typename U>
void imprimirPar(T primero, U segundo) {
    cout << "(" << primero << ", " << segundo << ")" << endl;
}

int main() {
    imprimirPar(1, "hola");        // (1, hola)
    imprimirPar(3.14, 'x');        // (3.14, x)
    imprimirPar("auto", 2024);     // (auto, 2024)
    return 0;
}
```

Acá `T` y `U` pueden ser el mismo tipo o tipos completamente distintos; el
compilador deduce cada uno de forma independiente.

## 6. Tipos de plantillas

Las plantillas no solo funcionan con funciones. De hecho, C++ cuenta con
varias "variedades" de plantillas, cada una con su propósito particular:

| Tipo de plantilla | Uso |
|---|---|
| Plantilla de función | Funciones genéricas |
| Plantilla de clase | Clases genéricas (ej: `std::vector<T>`) |
| Plantilla de alias | Alias genéricos con `using` |
| Plantilla de variable | Variables genéricas |

En este módulo veremos las funciones y las clases en detalle, pero ten en
mente que toda la **STL** está construida sobre plantillas: `std::vector<int>`,
`std::string`, `std::map<string, int>`... Todo lo que lleva `<T>` es, en el
fondo, una plantilla.

## 7. Buenas prácticas

- Nombra los parámetros de tipo con mayúscula (`T`, `U`, `Contenedor`), así
  será fácil distinguirlos de las variables comunes.
- Usa `typename` de forma preferente sobre `class`.
- Mantén el código genérico simple: si la plantilla se vuelve ilegible,
  quizás necesitas refactorizar.
- Compila con `-Wall` para detectar errores de instanciación temprano.

## 8. Resumen rápido

- Las plantillas permiten **código genérico** reutilizable.
- `template <typename T>` declara un tipo genérico.
- El compilador genera una versión por cada tipo usado (**instanciación**).
- Se resuelven en **tiempo de compilación**, sin costo en ejecución.
- Existen plantillas de función, clase, alias y variable.
- La STL completa está construida sobre plantillas.

Las plantillas son el corazón de la programación genérica de C++ y de gran
parte de la biblioteca estándar. En el siguiente capítulo profundizaremos en
las **plantillas de función** y todas sus variaciones.