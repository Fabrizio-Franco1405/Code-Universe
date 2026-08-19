---
outline: [2, 3]
---

# `typedef` y `using`

Imagina que tienes que escribir un tipo de dato muy largo y complicado muchas veces en tu código.
Cada vez que lo escribes, hay más posibilidades de cometer un error o de que una línea se vuelva
ilegible. ¿No sería genial poder inventar un nombre corto y fácil de recordar para ese tipo?

Eso es exactamente lo que hacen `typedef` y `using`: nos permiten crear **alias** (apodos) para
los tipos de datos. A partir de ese momento, podemos usar el apodo en lugar del nombre original.
Es una idea muy simple, pero como verás en este capítulo, esconde un poder enorme cuando los tipos
se vuelven largos y complejos.

## 1. ¿Qué es un alias de tipo?

Un alias de tipo es un **nombre alternativo** para un tipo existente. No crea un tipo nuevo: solo
le da otro nombre al mismo tipo. Piénsalo como un apodo en la escuela: la persona es la misma,
solo que ahora también la puedes llamar por su sobrenombre.

Por ejemplo, podríamos decir que `int` también se llame `entero`:

```cpp
typedef int entero;

entero edad = 25;   // Equivale a: int edad = 25;
int saldo = 100;    // Son el mismo tipo
```

::: info Nota
ℹ️ Como `entero` es solo un alias, puedes mezclar ambos nombres sin ningún problema: son
exactamente el mismo tipo para el compilador.
:::

## 2. `typedef`: La forma clásica

La palabra clave `typedef` existe desde los inicios de C. Su sintaxis puede parecer un poco
contraintuitiva al principio, porque el orden es `typedef` + tipo + nuevo nombre. En otras
palabras: primero decimos qué tipo queremos "apodar" y después el apodo.

**Sintaxis básica:**

```cpp
typedef tipo_original nuevo_nombre;
```

**Ejemplos:**

```cpp
typedef unsigned long long int tamano; // Alias para un entero muy grande
typedef char caracter;                 // Alias para char
typedef struct { double x, y; } Punto; // Alias para un struct anónimo
```

## 3. `using`: la forma moderna (C++11)

Desde C++11 contamos con la palabra clave `using`, que cumple la misma función pero con una
sintaxis más clara y natural. El orden ahora es: `using` + nuevo nombre + `=` + tipo original.
Fíjate en la diferencia: el nombre nuevo aparece primero, que es como solemos pensar cuando
inventamos un apodo.

**Sintaxis básica:**

```cpp
using nuevo_nombre = tipo_original;
```

**Ejemplos:**

```cpp
using tamano = unsigned long long int;
using caracter = char;
using Punto = struct { double x, y; };
```

::: tip
💡 La mayoría de la comunidad considera `using` más legible que `typedef`, por lo que en código
moderno es la opción preferida. Además, `using` puede hacer cosas que `typedef` no puede (como
los alias de plantillas).
:::

## 4. Alias de tipos complejos

El poder real de los alias se nota cuando los tipos son largos y complicados. Veamos un ejemplo
muy común en C++: punteros a funciones.

```cpp
// Una función que recibe dos enteros y devuelve un entero
typedef int (*operacion)(int, int);

// Con 'using' se lee mucho más claro
using operacion = int (*)(int, int);
```

Y en un programa completo:

```cpp
#include <iostream>
using namespace std;

using operacion = int (*)(int, int);

int sumar(int a, int b) { return a + b; }
int restar(int a, int b) { return a - b; }

int main() {
    operacion op;

    op = sumar;
    cout << "Suma: " << op(5, 3) << endl;   // 8

    op = restar;
    cout << "Resta: " << op(5, 3) << endl;  // 2
}
```

::: info Nota
ℹ️ No te preocupes si la sintaxis de los punteros a función parece extraña todavía. La veremos a
detalle más adelante; por ahora, fíjate en lo mucho que mejora la legibilidad el alias.
:::

## 5. Alias con tipos de la STL

En la práctica, los alias se usan muchísimo con los tipos de la Biblioteca Estándar, que suelen
ser largos. Por ejemplo, para crear un mapa que asocia nombres con notas:

```cpp
#include <iostream>
#include <map>
#include <string>
using namespace std;

using Calificaciones = map<string, double>;

int main() {
    Calificaciones notas;
    notas["María"] = 9.5;
    notas["Carlos"] = 8.0;

    for (const auto &alumno : notas) {
        cout << alumno.first << ": " << alumno.second << endl;
    }
}
```

Notarás que `Calificaciones` no solo es más corto de escribir: además le da un **significado**
al tipo. Cuando lees `Calificaciones notas;`, sabes de inmediato qué contiene esa variable, cosa
que no pasaría con `map<string, double> notas;`.

## 6. Alias de plantillas con `using`

Aquí es donde `using` supera a `typedef`. Los alias de plantillas solo pueden crearse con `using`,
lo que nos permite "fijar" algunos parámetros de una plantilla:

```cpp
#include <vector>
using namespace std;

// Un alias normal de vector de enteros
using VectorEnteros = vector<int>;

// Un alias de plantilla: 'Par' puede usarse con cualquier tipo T
template <typename T>
using Par = vector<pair<T, T>>;

int main() {
    Par<int> pares;              // vector<pair<int, int>>
    pares.push_back({1, 2});
    pares.push_back({3, 4});

    cout << "Primer par: (" << pares[0].first << ", " << pares[0].second << ")" << endl;
}
```

::: tip
💡 Los alias de plantillas son una característica muy poderosa que verás de nuevo cuando
estudiemos programación genérica.
:::

## 7. Cuándo crear un alias

Crear alias es una gran práctica en estas situaciones:

- **Tipos largos**: cuando un tipo es difícil de escribir y leer.
- **Tipos complejos**: punteros a función, punteros a miembros, etc.
- **Abstracción**: para que el código no dependa de un tipo concreto, facilitando cambios futuros.

```cpp
// En lugar de escribir el tipo completo...
map<string, vector<pair<int, double>>> datos_brutos;

// ...definimos un alias con significado
using Serie_de_datos = map<string, vector<pair<int, double>>>;
Serie_de_datos datos_brutos;
```

::: warning Advertencia
⚠️ Usar alias en exceso puede ocultar los tipos reales y hacer el código confuso. La regla es:
crea un alias cuando mejore la claridad, no cuando la reduzca.
:::

## 8. Buenas prácticas

- Prefiere `using` sobre `typedef` en código nuevo.
- Nombra los alias con **mayúscula inicial** (ej: `Calificaciones`, `VectorEnteros`) para
  distinguirlos de las variables.
- Usa alias para tipos largos, complejos o que quieras abstraer.
- No crees alias "solo porque sí": cada alias debe aportar claridad o flexibilidad.

## 9. Resumen rápido

- `typedef` y `using` crean **alias** (nombres alternativos) para tipos.
- `typedef tipo nombre;` es la forma clásica.
- `using nombre = tipo;` es la forma moderna (C++11).
- `using` permite crear alias de plantillas; `typedef` no.
- Los alias mejoran la legibilidad y el mantenimiento del código.

Con los tipos compuestos (`struct`, `enum` y `union`) y los alias ya tienes una caja de
herramientas mucho más completa para organizar tus datos. En la siguiente parte daremos el gran
salto hacia la memoria y los punteros, donde veremos qué sucede "por debajo del capó".