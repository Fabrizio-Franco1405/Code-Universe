---
outline: [2, 3]
---

# Espacios de nombres

A medida que tus programas crecen y usan **múltiples librerías**, puede surgir un
problema: Nombres de variables, funciones o clases que se repiten. Imagina que dos
librerías distintas definen cada una una función llamada `calcular()`: cuando intentas
usarlas, ¿a cuál te refieres? Es como tener dos vecinos llamados "Juan" en el mismo
edificio: al final, nadie sabe a quién le estás hablando.

Para resolver esto, C++ utiliza **espacios de nombres** (*namespaces*), que permiten
organizar y agrupar identificadores bajo un nombre único. Un **namespace** define un
ámbito para nombres, evitando conflictos y facilitando la lectura y mantenimiento del
código.

## 1. Sintaxis básica de un namespace

Para declarar un namespace se usa la palabra clave `namespace` seguida de un
identificador y un bloque `{ }` que contiene sus miembros. Es como crear una carpeta en
tu computadora: todos los archivos que pongas adentro llevan el nombre de la carpeta
como apellido.

**Ejemplo práctico:**
```cpp
#include <iostream>
using namespace std;

namespace Matemáticas {
    int sumar(int a, int b) {
        return a + b;
    }
    int restar(int a, int b) {
        return a - b;
    }
}

int main() {
    cout << Matemáticas::sumar(5, 3) << endl;  // 8
    cout << Matemáticas::restar(5, 3) << endl; // 2
}
```

::: tip
💡 El operador `::` se conoce como operador de resolución de ámbito y permite acceder
a miembros de un namespace específico.
:::

## 2. Uso del namespace `std`

C++ incluye la **librería estándar** (`Standard Library`), cuyos elementos se
encuentran dentro del namespace `std`. Por ejemplo, `cout`, `vector` y `string`. Cada
vez que usas uno de estos elementos, `std::` te recuerda de dónde viene, como el apellido
que indica la familia.

**Ejemplo práctico:**
```cpp
#include <iostream>
#include <string>

int main() {
    std::string nombre = "Fabrizio";
    std::cout << "Hola " << nombre << std::endl;
}
```

::: tip
💡 Para no escribir `std::` cada vez, se puede usar el operador `using`:
```cpp
using namespace std;
```
Pero ten cuidado, ya que puede provocar conflictos si hay nombres repetidos.
:::

## 3. Namespaces anidados

Los namespaces pueden contener otros namespaces, lo que permite organizar el código en
jerarquías. Es como las carpetas dentro de carpetas: puedes ir metiendo niveles de
organización sin perder el orden.

**Ejemplo práctico:**

```cpp
#include <iostream>
using namespace std;

namespace Física {
    namespace Mecánica {
        double velocidad(double distancia, double tiempo) {
            return distancia / tiempo;
        }
    }
}

int main() {
    cout << Física::Mecánica::velocidad(100, 5) << " m/s" << endl; // 20 m/s
}
```

## 4. Alias de namespaces

Si un namespace tiene un nombre largo, puedes crear un alias para acortar su uso. Es
como ponerle un apodo a alguien para no repetir todo el nombre cada vez que lo
mencionas.

**Ejemplo práctico:**

```cpp
#include <iostream>
using namespace std;

namespace Física {
    namespace Termodinámica {
        double energia(double m, double c) { return m * c * c; }
    }
}

namespace TD = Física::Termodinámica; // Alias

int main() {
    cout << TD::energia(2, 3e8) << endl;
}
```

::: tip
💡 Los alias simplifican la lectura y escritura de código cuando se usan namespaces
largos o anidados.
:::

## 5. Buenas prácticas

- Evita `using namespace std;` en **archivos de cabecera**, ya que puede causar
  conflictos en otros archivos que lo incluyan.
- Agrupa funciones, clases y constantes relacionadas dentro de un mismo namespace.
- Usa namespaces anidados solo cuando la jerarquía lo justifique.
- Prefiere alias cuando los nombres de namespaces sean largos o complejos.

::: info Nota
ℹ️ Los namespaces no consumen memoria adicional. Solo sirven para organizar y resolver
nombres en tiempo de compilación.
:::

## Resumen rápido

- Un **namespace** agrupa identificadores bajo un nombre único.
- El operador `::` permite acceder a los miembros de un namespace.
- La librería estándar vive dentro de `std`.
- Los namespaces se pueden **anidar** para crear jerarquías.
- Los **alias** acortan nombres largos y facilitan la lectura.
- Evita `using namespace std;` en archivos de cabecera.

Con los espacios de nombres ya puedes mantener tu código organizado sin miedo a las
colisiones de nombres. En el siguiente capítulo comenzaremos a hablar de las
**funciones**, el ingrediente principal para hacer tu código reutilizable y ordenado.