---
outline: [2, 3]
---

# Variables, constantes y alcance

Hasta ahora ya conoces los tipos de datos, la estructura básica de un programa en C++ y has ejecutado tus primeros ejemplos. El siguiente paso es empezar a crear tus variables y entender como es posible que una computadora sepa cuando algo debe cambiar y cuando debe permanecer constante.

En esta sección veremos tres conceptos clave:

- **Variables**: Espacios de memoria con nombre, cuyo valor puede cambiar durante la ejecución.
- **Constantes**: Valores que permanecen fijos una vez definidos.
- **Alcance** (*scope*): El contexto en el que una variable o constante es visible y accesible.

Dominar estos conceptos te permitirá escribir programas más organizados, seguros y fáciles de mantener.

## 1. Variables

Una variable es un espacio en memoria que almacena un valor, esto significa que puede cambiar su valor durante la ejecución de un programa. Para declararla, debes indicar su tipo y su nombre. Opcionalmente, puedes asignarle un valor inicial.

**Ejemplo práctico:**
```cpp
#include <iostream>
using namespace std;

int main() {
    int edad;           // Declaración sin inicialización
    edad = 25;          // Asignación posterior

    float altura = 1.75; // Declaración e inicialización
    cout << "Edad: " << edad << ", Altura: " << altura << endl;
}
```

:::tip
💡 **Puntos clave sobre variables**:

- El tipo determina qué valores puede almacenar y qué operaciones admite.
- Si no se inicializa, su valor es indeterminado (puede contener basura de memoria).
- Usa nombres descriptivos y sigue las reglas de identificadores en C++.
:::

**Puntos clave:**

- El tipo de la variable determina qué valores puede almacenar y qué operaciones admite.
- Si no inicializas una variable, su valor será indeterminado (puede contener basura de memoria).
- Los nombres de variables deben ser descriptivos y seguir las reglas de identificadores en C++.

## 2. Constantes

Una **constante** es un valor que no puede cambiar después de ser inicializado. Se definen con `const` o `constexpr` (cuando el valor es conocido en tiempo de compilación).

**Ejemplo práctico:**
```cpp
#include <iostream>
using namespace std;

const int MAX_USUARIOS = 100;      // Constante global
constexpr float PI = 3.14159;      // Evaluada en tiempo de compilación

cout << "Máximo de usuarios: " << MAX_USUARIOS << ", PI: " << PI << endl;
```

:::warning Advertencia
⚠️ Intentar modificar una constante genera un error de compilación:
```cpp
MAX_USUARIOS = 200; // Error: no se puede modificar una constante [!code error]
```
:::

:::tip
💡 Ventajas de usar constantes:

- Mejoran la legibilidad del código.
- Evitan modificaciones accidentales.
- Facilitan el mantenimiento.
:::

## 3. Alcance (scope)

El **alcance** determina desde qué partes del código se puede acceder a una variable o constante y cuánto tiempo permanece en memoria.

| Tipo de alcance | Descripción | Ejemplo |
| --- | --- | --- |
| Local | Declarada dentro de una función o bloque `{}`. Solo existe mientras se ejecuta ese bloque. | Variable dentro de `main()` |
| Global | Declarada fuera de cualquier función. Visible desde cualquier parte del archivo (y otros si se declara `extern`). | Contador global |
| De bloque | Declarada dentro de un bloque específico como un `if`, `for` o `{}`. Solo existe dentro de ese bloque. | Variable en un bucle `for` |
| Estático local | Declarada con `static` dentro de una función. Mantiene su valor entre llamadas, pero solo es visible en esa función. | Contador de llamadas |

### 3.1 Ámbito Local

Una variable local o de ambito local es aquella que se declara dentro de una función o un bloque de código `{ }` y esta solo permite ser utilizada dentro del bloque donde fue creada:

**Ejemplo práctico:**
```cpp
int main() {
    int edad = 20; // Variable local
    cout << "Edad: " << edad << endl;
}
```

:::warning Advertencia
⚠️ Intentar acceder a una variable local desde otra función genera error:
```cpp
void funcion() {
    cout << edad << endl; // Error: 'edad' no está definida [!code error]
}
```
:::

### 3.2 Ámbito Global

Una variable global o de ambito global es aquella que se declara fuera de cualquier funcion y esta puede ser accedida desde cualquier parte del codigo:

**Ejemplo práctico:**
```cpp
#include <iostream>
using namespace std;

int a = 10; // Variable global

int main() {
    cout << a << endl; // Imprime 10
}
```

Si se declara una variable local con el mismo nombre, esta oculta la variable global dentro de su bloque.

```cpp
int a = 10; // Global

int main() {
    int a = 20;   // Local
    cout << a << endl;   // 20
    cout << ::a << endl; // 10 (operador de ámbito global)
}
```
:::tip
💡 Usa `::` para acceder a variables globales desde dentro de un bloque local.
:::

### 3.3 Ámbito de Bloque

Una variable de ámbito de bloque es aquella que se declara dentro de un bloque delimitado por llaves `{ }` y solo existe mientras se ejecuta ese bloque, incluso si está dentro de una función más grande. Esto es muy común en estructuras de control como if, for o while.

**Ejemplo práctico:**

```cpp
int main() {
    if (true) {
        int x = 10; // Ámbito de bloque
    }
    cout << x << endl; // Error: 'x' no está definida fuera del bloque [!code error]
}
```

En este caso, `x` solo existe dentro del bloque del if. Fuera de esas llaves, el compilador no la reconoce.

### 3.4 Ámbito estático local

Una variable estática local se declara dentro de una función usando la palabra clave `static`. A diferencia de una variable local normal, mantiene su valor entre llamadas a la función, pero sigue siendo invisible fuera de ella.

**Ejemplo práctico:**
```cpp
#include <iostream>
using namespace std;

void contadorLlamadas() {
    static int contador = 0; // Inicialización única
    contador++;
    cout << "Llamada número: " << contador << endl;
}

int main() {
    contadorLlamadas(); // 1
    contadorLlamadas(); // 2
    contadorLlamadas(); // 3
}
```

:::tip
💡 Útil para contadores, acumuladores o cualquier valor que deba persistir entre llamadas sin ser global.
:::

## 4. Buenas prácticas
- Usa **variables locales** siempre que sea posible.
- Prefiere `const` o `constexpr` cuando el valor no deba cambiar.
- Evita el uso excesivo de variables **globales**.
- Nombra las variables de forma **descriptiva** y **consistente**.
- Mantén la inicialización de variables clara y explícita.