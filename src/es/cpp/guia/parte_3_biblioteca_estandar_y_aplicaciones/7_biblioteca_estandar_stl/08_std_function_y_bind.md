---
outline: [2, 3]
---

# `std::function` y `std::bind`

En el capítulo anterior viste que las lambdas se pueden guardar en variables con `auto`.
Pero `auto` tiene una limitación: el tipo de la variable es exactamente el de la lambda
que creaste, y no sirve para cualquier callable. Es acá donde entran dos utilidades muy
poderosas del C++ moderno:

**`std::function`** es un contenedor de objetos invocables, como funciones, lambdas o
punteros a funciones, que permite almacenarlos y pasarlos de manera uniforme. En otras
palabras, es una "caja genérica" donde cabe cualquier cosa que se pueda llamar, siempre
que tenga la misma firma.

**`std::bind`** se utiliza para **fijar algunos parámetros de una función**, creando una
nueva función con menos argumentos. Piénsalo como preparar una mezcla instantánea: ya
dejaste los ingredientes fijos y solo falta agregar el último.

Estas herramientas facilitan la programación flexible y orientada a callbacks, y
aparecen constantemente en bibliotecas y código profesional.

## 1. Concepto básico de `std::function`

- `std::function` es un **wrapper** que puede almacenar cualquier callable compatible con
  una firma específica.
- Permite manejar **funciones, punteros a funciones, lambdas y objetos con operador()**
  de manera uniforme.

**Sintaxis:**

```cpp
#include <functional>

std::function<tipo_retorno(tipo_param1, tipo_param2, ...)> nombre;
```

La firma que le pasas entre los `< >` define el "contrato": qué devuelve y qué recibe.
Después, cualquier callable que respete ese contrato puede entrar en la caja, sin
importar si es una función normal, una lambda o un functor.

## 2. Uso típico

`std::function` se usa cuando necesitamos **flexibilidad en el tipo de función** a
invocar. Algunos casos muy comunes:

- Pasar funciones, lambdas u objetos como callbacks.
- Guardar funciones en contenedores (por ejemplo, un `vector<function<void(int)>>`).
- Componer funciones dinámicamente, decidiendo en tiempo de ejecución cuál usar.

`std::bind` permite **preconfigurar algunos parámetros** de una función, devolviendo un
nuevo callable con menos argumentos. Es ideal para "especializar" una función general sin
tener que escribir una nueva.

## 3. Ejemplo práctico

En este ejemplo veremos cómo usar `std::function` para almacenar distintas funciones y
lambdas, y cómo `std::bind` nos ayuda a fijar parámetros:

```cpp
#include <iostream>
#include <functional>
using namespace std;

// Función normal
int multiplicar(int a, int b) {
    return a * b;
}

int main() {
    // std::function que almacena una función con firma int(int,int)
    std::function<int(int,int)> operacion;

    // Asignar una función normal
    operacion = multiplicar;
    cout << "Multiplicación: " << operacion(3,4) << endl;

    // Asignar una lambda
    operacion = [](int a, int b){ return a + b; };
    cout << "Suma: " << operacion(3,4) << endl;

    // Usando std::bind para fijar el primer parámetro
    auto duplicar = std::bind(multiplicar, 2, std::placeholders::_1);
    cout << "Duplicar 5: " << duplicar(5) << endl;

    // std::function con bind
    std::function<int(int)> fDuplicar = std::bind(multiplicar, 2, std::placeholders::_1);
    cout << "Duplicar 7: " << fDuplicar(7) << endl;
}
```

Fíjate en la magia de `std::bind`: tomamos `multiplicar` que necesita **dos** argumentos,
fijamos el primero en `2`, y dejamos el segundo libre con `std::placeholders::_1`. El
resultado es un nuevo callable `duplicar` que solo necesita un argumento y siempre lo
multiplica por 2. Los `placeholders` son los "huecos" que dejamos para que quien llame a
la función los rellene después.

**Notas importantes:**

- `std::placeholders::_1`, `_2`, etc, indican los argumentos que se pasan al callable
  final. `_1` es el primer argumento, `_2` el segundo, y así sucesivamente.
- `std::function` introduce cierta sobrecarga en tiempo de ejecución, pero ofrece gran
  **flexibilidad y uniformidad**. Es el precio de poder cambiar de callable cuando
  quieras.
- Con C++14 y superiores, las lambdas a menudo reemplazan `std::bind` por claridad. Un
  `[factor](int x) { return multiplicar(factor, x); }` suele leerse mejor que un `bind`.

::: tip
💡 Si en tu versión de C++ puedes usar lambdas, prefiérelas sobre `std::bind` en código
nuevo: son más legibles y no tienen la sintaxis un poco críptica de los `placeholders`.
`std::bind` sigue siendo útil en composiciones complejas o cuando trabajas con
bibliotecas que lo esperan.
:::

## 4. Buenas prácticas

- Prefiere **lambdas** cuando sea posible; `std::bind` es más útil en composiciones
  complejas.
- Usa `std::function` para almacenar cualquier callable cuando necesites **tipado
  uniforme**.
- Evita asignaciones repetidas innecesarias a `std::function` en bucles de alto
  rendimiento.

::: warning Advertencia
⚠️ La flexibilidad de `std::function` tiene un costo: oculta el tipo real del callable y
agrega una indirección en cada llamada. En bucles que se ejecutan millones de veces o en
código donde el rendimiento es crítico, esa sobrecarga puede notarse. Para esos casos,
una plantilla o una lambda con `auto` suele ser más eficiente.
:::

## 5. Resumen rápido

- `std::function` permite almacenar y pasar **cualquier callable** compatible.
- `std::bind` fija algunos argumentos de una función, creando un nuevo callable.
- Usadas juntas, permiten **programación flexible y callbacks dinámicos**.
- Lambdas modernas pueden reemplazar muchas situaciones donde antes se usaba `std::bind`.

Con esto cerramos el viaje por la STL: contenedores, algoritmos, iteradores, lambdas y
estas utilidades para manejar callables. Pero la STL es solo una parte del arsenal:
ahora es momento de usar todo lo aprendido para construir **estructuras de datos** desde
cero, empezando por las pilas y las colas en el siguiente capítulo.