---
outline: [2, 3]
---

# Uso avanzado de la STL

Ya conoces los contenedores, los algoritmos, los iteradores y las lambdas. Con eso podrías
resolver muchísimos problemas, pero la STL es un océano con muchísimas más herramientas
esperando a ser descubiertas. En este capítulo veremos un conjunto de utilidades y
técnicas avanzadas que aparecen constantemente en el código profesional: `std::optional`,
`std::variant`, `std::tuple`, `std::string_view`, funciones con plantillas variádicas y
más.

No necesitas memorizarlas todas hoy, pero **saber que existen** te ahorrará reinventarlas
después. Es como conocer los atajos de tu ciudad: no los usas todos todos los días, pero
cuando los necesitas, te ahorran un montón de tiempo.

## 1. `std::optional`: Un valor que puede no existir

¿Cuántas veces has usado `-1` o `nullptr` para indicar "no hay resultado"? Esos son los
llamados **valores mágicos**: números o punteros que usamos con un significado que no es
evidente. `std::optional` (C++17) expresa esa idea de forma clara y segura: contiene un
valor **o** nada, sin ambigüedades:

```cpp
#include <iostream>
#include <optional>
using namespace std;

// Devuelve el primer número par, o "nada" si no existe
optional<int> buscarPar(const vector<int> &v) {
    for (int n : v) {
        if (n % 2 == 0) return n;
    }
    return nullopt; // No hay resultado
}

int main() {
    vector<int> v1 = {1, 3, 5, 7};
    vector<int> v2 = {1, 4, 3, 7};

    optional<int> r1 = buscarPar(v1);
    optional<int> r2 = buscarPar(v2);

    if (r1.has_value()) {
        cout << "Primer par de v1: " << *r1 << endl;
    } else {
        cout << "v1 no tiene pares" << endl;
    }

    if (r2.has_value()) {
        cout << "Primer par de v2: " << r2.value() << endl; // 4
    }

    return 0;
}
```

Fíjate en la elegancia: la función `buscarPar` devuelve `nullopt` cuando no hay un número
par, y el que la llama lo comprueba con `has_value()`. Nada de adivinar si un `-1` era un
valor real o un error.

::: tip
💡 `std::optional` elimina los "valores mágicos" que significan error. En vez de `-1` o
punteros nulos, la ausencia de valor se expresa de forma explícita y segura. Tu código se
vuelve más honesto y mucho más fácil de leer.
:::

## 2. `std::variant`: Una variable que puede ser de varios tipos

`std::variant` (C++17) es la alternativa **segura** a las uniones que vimos en tipos
compuestos. Guarda un valor de uno de varios tipos posibles, y **recuerda** cuál es en
cada momento. Es como una caja que puede contener una pelota, un libro o una llave, y
siempre sabe qué hay dentro:

```cpp
#include <iostream>
#include <variant>
using namespace std;

int main() {
    variant<int, double, string> dato;

    dato = 42;
    cout << "Entero: " << get<int>(dato) << endl;

    dato = 3.14;
    cout << "Double: " << get<double>(dato) << endl;

    dato = "hola";
    cout << "String: " << get<string>(dato) << endl;

    // get_if devuelve nullptr si el tipo no es el actual
    if (auto *s = get_if<string>(&dato)) {
        cout << "Es un string: " << *s << endl;
    }

    return 0;
}
```

::: warning Advertencia
⚠️ Si llamas a `get<int>` cuando el variant contiene otro tipo, lanza `std::bad_variant_access`.
Usa `get_if` cuando no estés seguro del tipo actual: en ese caso devuelve `nullptr` en
lugar de lanzar una excepción, y puedes comprobarlo con un simple `if`.
:::

## 3. `std::tuple`: Agrupación de valores fija

Un `tuple` es como un `struct` anónimo: agrupa **varios valores** de tipos
potencialmente distintos sin necesidad de definir una estructura. Es ideal cuando quieres
devolver varios datos de una función o agruparlos temporalmente:

```cpp
#include <iostream>
#include <tuple>
using namespace std;

int main() {
    // Un producto: nombre, precio, stock
    tuple<string, double, int> producto = {"Teclado", 49.99, 120};

    // Acceder con get<índice>
    cout << get<0>(producto) << endl; // Teclado
    cout << get<1>(producto) << endl; // 49.99

    // Con structured bindings (C++17) se lee mucho mejor
    auto [nombre, precio, stock] = producto;
    cout << nombre << " cuesta " << precio << " y hay " << stock << " unidades" << endl;

    return 0;
}
```

Compara las dos formas de acceder: `get<0>`, `get<1>`... es funcional, pero poco legible.
En cambio, `auto [nombre, precio, stock] = producto;` lee casi como lenguaje natural.
¿Ves por qué los **structured bindings** se volvieron tan populares?

::: tip
💡 Los **structured bindings** (`auto [a, b, c] = ...`) funcionan con `tuple`, `pair`, y
también con `structs` y `maps`. Son una forma moderna y legible de "desempaquetar"
valores. Una vez que los usas, cuesta volver atrás.
:::

## 4. `std::string_view`: Ver una cadena sin copiarla

`std::string_view` (C++17) es una **vista** de una cadena: apunta a una parte de memoria
que contiene texto, sin ser dueño de ella ni copiarla. Es ideal para parámetros de solo
lectura, porque evita copias innecesarias de cadenas grandes:

```cpp
#include <iostream>
#include <string_view>
using namespace std;

// Acepta cualquier texto sin copiarlo
void imprimirMensaje(string_view texto) {
    cout << texto << endl;
}

int main() {
    string saludo = "¡Hola mundo!";
    imprimirMensaje(saludo);           // Acepta string
    imprimirMensaje("texto literal");  // Acepta literales
    imprimirMensaje(saludo.substr(1, 4)); // Vista de una subcadena

    return 0;
}
```

::: info Nota
ℹ️ `string_view` evita las copias que ocurrían al pasar `string` por valor. Pero recuerda:
**no posee la memoria**. La cadena original debe seguir viva mientras exista la vista. Si
la original se destruye, la vista queda apuntando a memoria inválida, así que trátala
como una invitación a leer, no como la dueña del texto.
:::

## 5. Funciones variádicas: Número variable de argumentos

La STL y el C++ moderno permiten funciones que aceptan **cualquier cantidad** de
argumentos con plantillas variádicas (los `...`). Así funciona `std::make_unique`, por
ejemplo. Es una técnica que se usa en dos pasos: un caso base y un caso recursivo que
se va "comiendo" los argumentos de a uno:

```cpp
#include <iostream>
using namespace std;

// Caso base: solo un argumento
void imprimirTodo() {
    cout << endl;
}

// Caso recursivo: un argumento + el resto
template <typename T, typename... Resto>
void imprimirTodo(T primero, Resto... resto) {
    cout << primero << " ";
    imprimirTodo(resto...); // Llamada con el resto
}

int main() {
    imprimirTodo(1, "hola", 3.14, 'x'); // 1 hola 3.14 x
    return 0;
}
```

::: warning Advertencia
⚠️ No te preocupes si esto parece complicado: las plantillas variádicas son un tema
avanzado. Solo ten en cuenta que existen y que la STL las usa por debajo (por ejemplo,
para `std::tuple`). Con saber que existen y verlas de vez en cuando en código ajeno, es
más que suficiente por ahora.
:::

## 6. `std::pair`: El dúo inseparable

`std::pair` es el caso particular de tuple con **dos** valores. Es el tipo que devuelven
contenedores como `map` al iterar, por eso lo verás por todas partes:

```cpp
#include <iostream>
#include <map>
#include <utility>
using namespace std;

int main() {
    pair<string, int> usuario = {"Ana", 25};

    cout << usuario.first << " tiene " << usuario.second << " años" << endl;

    // En un map, cada elemento es un par
    map<string, int> edades = {{"Ana", 25}, {"Carlos", 30}};
    for (const auto &par : edades) {
        cout << par.first << " -> " << par.second << endl;
    }

    return 0;
}
```

Piénsalo así: cada vez que recorres un `map` con `for (const auto &par : edades)`, el
`par` que recibes es, literalmente, un `pair<string, int>`. La clave es `par.first` y el
valor es `par.second`.

## 7. Otras utilidades valiosas

La STL tiene muchas más herramientas que conviene conocer al menos por nombre. Esta tabla
te sirve de mapa para saber qué existe y cuándo ir a buscarlo:

| Utilidad | Uso |
|---|---|
| `std::span` (C++20) | Vista de un rango contiguo (como `string_view` pero genérico) |
| `std::function` | Guardar cualquier función/lambda en una variable |
| `std::ranges` (C++20) | Algoritmos con sintaxis moderna sin iteradores manuales |
| `std::bind` | Fijar argumentos de funciones |
| `std::reference_wrapper` | Referencias en contenedores |

Veamos un ejemplo con `std::function`, una utilidad que nos permite guardar en una misma
variable cualquier cosa que se pueda llamar, ya sea una función, una lambda o un functor:

```cpp
#include <iostream>
#include <functional>
using namespace std;

int main() {
    // Guardamos cualquier cosa que se pueda llamar
    function<int(int, int)> operacion;

    operacion = [](int a, int b) { return a + b; };
    cout << "Suma: " << operacion(4, 5) << endl; // 9

    operacion = [](int a, int b) { return a * b; };
    cout << "Multiplicación: " << operacion(4, 5) << endl; // 20

    return 0;
}
```

Fíjate cómo la misma variable `operacion` cambia de comportamiento en tiempo de
ejecución: primero suma, después multiplica. Esa flexibilidad es la que hace a
`std::function` tan valiosa en código que maneja callbacks o configuraciones dinámicas.

## 8. Buenas prácticas

- Usa `optional` para valores que pueden no existir.
- Usa `variant` en lugar de uniones manuales.
- Aprovecha `string_view` para parámetros de solo lectura.
- Usa structured bindings para desempacar tuples y pares.
- Prefiere los tipos de la STL antes que reinventar los tuyos.

## 9. Resumen rápido

- `optional` expresa "valor o nada".
- `variant` guarda uno de varios tipos de forma segura.
- `tuple`/`pair` agrupan valores fijos.
- `string_view` observa cadenas sin copiarlas.
- Las plantillas variádicas aceptan cualquier número de argumentos.
- `function` guarda funciones/lambdas en variables.
- Los structured bindings desempacan valores de forma legible.

Con estas herramientas, la STL se convierte en un arsenal completo para resolver
problemas cotidianos. En el siguiente capítulo veremos a fondo las **funciones lambda**,
que ya hemos usado y que merecen un capítulo propio por su importancia.