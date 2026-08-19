---
outline: [2, 3]
---

# Uniones (`union`)

Hasta ahora, cada variable que declaramos ocupa su propio espacio en memoria. Pero, ¿qué pasaría
si quisiéramos ahorrar memoria permitiendo que varias variables **compartan el mismo espacio**?
¿O si necesitáramos que un dato pueda ser interpretado de distintas maneras en distintos momentos?

Para esos casos, C++ nos ofrece las **uniones** (`union`), un tipo compuesto muy particular que
casi podríamos describir como el primo ahorrador de los `structs`. Es un tema que tal vez no uses
todos los días, pero entenderlo te da una visión mucho más profunda de cómo piensa la memoria y
de qué hace C++ cuando le decimos "compartí este espacio".

## 1. ¿Qué es una unión?

Una `union` es un tipo compuesto que almacena **todas sus variables en el mismo espacio de
memoria**. Es decir, sus miembros se superponen: en un mismo momento, solo uno de ellos tiene un
valor válido.

**Sintaxis básica:**

```cpp
union Dato {
    int entero;
    float decimal;
    char caracter;
};
```

Visualízalo así: es una caja que puede contener un número entero **o** un decimal **o** un
carácter, pero **no todos al mismo tiempo**. El tamaño de la unión es el del miembro más grande.
La palabra `union` viene del inglés y se traduce como **unión**, y la idea es justamente esa:
varios miembros unidos en un solo espacio.

::: info Nota
ℹ️ Mientras que un `struct` suma el tamaño de sus miembros, una `union` toma el tamaño de su
miembro más grande. Por eso ahorran memoria cuando los miembros son de tipos muy distintos.
:::

## 2. Comparación rápida: `struct` vs `union`
| Característica | `struct` | `union` |
|---|---|---|
| Espacio en memoria | Suma de todos los miembros | El miembro más grande |
| Miembros activos a la vez | Todos | Solo uno |
| Escribir un miembro | No afecta a los demás | Puede invalidar a los demás |
| Uso típico | Agrupar datos relacionados | Optimizar memoria o reinterpretar datos |
## 3. Cómo usar una unión

Se usa igual que un `struct`, pero con la regla mental de que **solo debes leer el último
miembro que escribiste**. Esa regla es la que separa a los `structs` de las uniones: el `struct`
es una caja con compartimentos, mientras que la `union` es una sola caja que cambia de contenido:

```cpp
#include <iostream>
using namespace std;

union Dato {
    int entero;
    float decimal;
    char caracter;
};

int main() {
    Dato dato;

    dato.entero = 42;
    cout << "Como entero: " << dato.entero << endl;

    dato.caracter = 'A';
    cout << "Como carácter: " << dato.caracter << endl;
}
```

::: warning Advertencia
⚠️ **¡Atención!** En el ejemplo anterior, al escribir `dato.caracter = 'A'`, el valor `42` que
guardamos en `dato.entero` se pierde (o mejor dicho, se sobrescribe). Leer `dato.entero` después
de eso daría un valor sin sentido.
:::

## 4. El problema del miembro activo

Como acabamos de ver, la unión no sabe "qué miembro contiene actualmente". El control es
totalmente tuyo. Esto puede llevar a errores sutiles si no llevas un registro de qué miembro
escribiste por última vez. Es como una habitación que usas para distintas cosas: si la convertiste
en garaje, no tiene sentido seguir buscando la mesa del comedor.

La solución clásica es **combinar la unión con otra variable que indique el tipo actual**, formando
lo que se conoce como una unión etiquetada:

```cpp
#include <iostream>
using namespace std;

enum class TipoDato { ENTERO, DECIMAL, CARACTER };

union Valor {
    int entero;
    float decimal;
    char caracter;
};

int main() {
    Valor valor;
    TipoDato tipo = TipoDato::ENTERO;

    valor.entero = 100;      // Escribimos como entero
    tipo = TipoDato::ENTERO; // Y registramos qué tipo es

    // Leemos de forma segura según la etiqueta
    if (tipo == TipoDato::ENTERO) {
        cout << "Valor: " << valor.entero << endl;
    }
}
```

Acá la `enum class` actúa como la etiqueta que siempre nos dice qué hay dentro de la caja antes
de abrirla. Notarás que estamos combinando lo que viste en los capítulos anteriores: una unión
guardando el dato y una enumeración guardando "qué tipo es ese dato".

## 5. Unión anónima

C++ permite declarar una unión **sin nombre**, en cuyo caso sus miembros se comportan como
variables del ámbito donde se declaró. Es una forma compacta, aunque puede resultar confusa:

```cpp
#include <iostream>
using namespace std;

int main() {
    union {
        int entero;
        float decimal;
    };

    entero = 7; // Accedemos directamente, sin nombre de unión
    cout << "Entero: " << entero << endl;
}
```

::: warning Advertencia
⚠️ Las uniones anónimas no pueden tener funciones miembro y su uso en exceso puede hacer el
código difícil de leer. Úsalas con moderación.
:::

## 6. Reinterpretar datos con una unión

Uno de los usos más interesantes de las uniones es **reinterpretar los bytes** de un dato. Como
todos los miembros comparten la misma memoria, podemos ver los bytes de un entero como si fueran
caracteres. En la práctica, esto es algo que se hace mucho en protocolos de bajo nivel y en
sistemas embebidos:

```cpp
#include <iostream>
using namespace std;

union Convertidor {
    int entero;
    unsigned char bytes[4]; // 4 bytes (en la mayoría de sistemas)
};

int main() {
    Convertidor conv;
    conv.entero = 16909060; // En binario: 00000001 00000010 00000011 00000100

    cout << "Bytes del entero:" << endl;
    for (int i = 0; i < 4; i++) {
        cout << (int)conv.bytes[i] << " ";
    }
    cout << endl;
}
```

::: info Nota
ℹ️ En C++ moderno esta técnica de reinterpretación se considera arriesgada (comportamiento no
especificado en ciertos casos). Si la ves en código real, es normalmente para optimizar o para
protocolos de bajo nivel.
:::

## 7. `std::variant`: La alternativa moderna

Desde **C++17**, la biblioteca estándar nos ofrece `std::variant`, que es básicamente una unión
**segura**: recuerda automáticamente qué valor contiene y lanza un error si intentas leer el que
no toca. En la práctica, si estás escribiendo código nuevo, casi siempre es mejor usar
`std::variant` que una `union` manual:

```cpp
#include <iostream>
#include <variant>
using namespace std;

int main() {
    variant<int, float, char> dato;

    dato = 42;
    cout << "Entero: " << get<int>(dato) << endl;

    dato = 'A';
    cout << "Carácter: " << get<char>(dato) << endl;
}
```

::: tip
💡 Aunque esta guía te enseña las uniones por su valor histórico y para que entiendas el código
antiguo, si puedes elegir, prefiere `std::variant` en proyectos modernos.
:::

## 8. Buenas prácticas

- Usa `union` solo cuando el ahorro de memoria sea realmente importante.
- Lleva siempre un registro de qué miembro está activo (unión etiquetada).
- Evita reinterpretar datos salvo que sea estrictamente necesario.
- En código moderno, prefiere `std::variant` sobre `union`.

## 9. Resumen rápido

- Una `union` comparte memoria entre sus miembros.
- Solo un miembro tiene un valor válido a la vez.
- Ocupa el espacio del miembro más grande.
- Escribir un miembro puede invalidar a los otros.
- Las uniones etiquetadas permiten usarlas de forma segura.
- `std::variant` (C++17) es la alternativa moderna y segura.

Las uniones son un tema poco frecuente en el día a día, pero entenderlas te da una visión más
profunda de cómo la memoria puede optimizarse. En el siguiente capítulo veremos cómo crear alias
para los tipos con `typedef` y `using`.