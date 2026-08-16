---
outline: [2, 3]
---

# Lambdas y funciones

En los capítulos anteriores viste que los algoritmos de la STL aceptaban funciones de
comparación o transformación sin que nos detuviéramos a preguntar cómo era eso posible.
Pero llegó el momento de la gran pregunta: **¿cómo pasamos una "función" a otra
función?** En C++ hay varias formas de hacerlo: punteros a función, **objetos función**
(functors) y las modernas **lambdas**. Este capítulo las presenta una por una y te
mostrará por qué las lambdas se convirtieron en la opción preferida por la comunidad.

## 1. El problema: pasar comportamiento como parámetro

Imaginemos que queremos ordenar un vector con un criterio personalizado. El algoritmo
`sort` necesita saber **cómo** comparar los elementos, es decir, necesita recibir ese
"cómo" como parámetro. La forma más directa es pasarle una función:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

bool mayorAMenor(int a, int b) {
    return a > b;
}

int main() {
    vector<int> v = {5, 2, 8, 1};

    // Pasamos el nombre de la función
    sort(v.begin(), v.end(), mayorAMenor);

    for (int n : v) cout << n << " "; // 8 5 2 1
    cout << endl;

    return 0;
}
```

Funciona, pero fíjate en un detalle incómodo: la función está **separada** del lugar
donde se usa. Si se trata de una lógica pequeña y de un solo uso, molesta tener que
definirla aparte, darle un nombre, y que la lectura del código quede fragmentada. De ahí
nace la búsqueda de alternativas más cómodas.

## 2. Punteros a función

La forma clásica es usar **punteros a función** (esa idea que ya vimos en el capítulo de
memoria y punteros). Un puntero a función almacena la dirección de una función
compatible, y luego podemos llamar a esa función a través del puntero:

```cpp
#include <iostream>
using namespace std;

int sumar(int a, int b) { return a + b; }
int restar(int a, int b) { return a - b; }

int main() {
    int (*operacion)(int, int); // Puntero a función

    operacion = sumar;
    cout << "Suma: " << operacion(5, 3) << endl; // 8

    operacion = restar;
    cout << "Resta: " << operacion(5, 3) << endl; // 2

    return 0;
}
```

Fíjate en la sintaxis de la declaración: `int (*operacion)(int, int)`. El asterisco y los
paréntesis son obligatorios para indicar que `operacion` es un puntero a función, no una
función que devuelve un puntero. Es un detalle que suele confundir al principio, y acá
ves por qué los punteros a función no son la opción más cómoda del mundo.

::: warning Advertencia
⚠️ Los punteros a función son útiles pero limitados: no pueden capturar variables del
contexto y su sintaxis es incómoda. Por eso la STL y el código moderno los evitan siempre
que pueden.
:::

## 3. Objetos función (functors)

Un **objeto función** es una clase que sobrecarga el operador `()` (el de llamada), de
modo que un **objeto** se pueda invocar como si fuera una función. Su gran ventaja frente
al puntero a función es que puede guardar **estado**, es decir, datos propios que
recuerda entre llamadas:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// Objeto función: un "comparador que recuerda su factor"
class Escalador {
private:
    int factor;

public:
    Escalador(int f) : factor(f) {}

    // Sobrecargamos el operador de llamada
    int operator()(int valor) {
        return valor * factor;
    }
};

int main() {
    Escalador porDiez(10);
    cout << porDiez(5) << endl; // 50 (se usa como una función)

    vector<int> v = {1, 2, 3};
    transform(v.begin(), v.end(), v.begin(), Escalador(2));

    for (int n : v) cout << n << " "; // 2 4 6
    cout << endl;

    return 0;
}
```

::: info Nota
ℹ️ El `operator()` permite que `Escalador(10)` se comporte como una función pero **con
estado** (el `factor`). Por eso se llaman "objetos función": son objetos que se invocan
como funciones. La desventaja es la cantidad de código que hay que escribir solo para una
pequeña lógica.
:::

## 4. Las lambdas: la solución moderna

Una **función lambda** es una función anónima definida **en el lugar** donde se necesita,
sin necesidad de darle un nombre ni declararla aparte. Es la forma concisa de crear un
objeto función sin definir una clase completa, y por eso se volvió tan popular:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> v = {5, 2, 8, 1, 9};

    // Lambda como comparador
    sort(v.begin(), v.end(), [](int a, int b) {
        return a > b; // Orden descendente
    });

    for (int n : v) cout << n << " "; // 9 8 5 2 1
    cout << endl;

    return 0;
}
```

**Sintaxis de una lambda:**

```cpp
[capturas](parametros) -> tipo_retorno {
    // cuerpo
}
```

Desglosemos cada parte para que no quede ninguna duda:

- **Capturas `[ ]`**: qué variables del entorno se traen.
- **Parámetros `( )`**: como cualquier función.
- **Retorno `->`**: opcional si se deduce.
- **Cuerpo `{ }`**: las instrucciones.

## 5. Las lambdas pueden capturar estado

Aquí está la magia que mencionábamos con los functors: las lambdas pueden **capturar**
variables del entorno, igual que un functor guarda su estado, pero con muchísima menos
sintaxis. En este ejemplo, la lambda "recuerda" el valor de `minimo` para usarlo en su
condición:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int minimo = 3;

    vector<int> v = {1, 5, 2, 8, 3};

    // Capturamos 'minimo' por valor: contamos los mayores o iguales
    int cuantos = count_if(v.begin(), v.end(),
        [minimo](int n) { return n >= minimo; });

    cout << "Elementos >= " << minimo << ": " << cuantos << endl; // 3

    return 0;
}
```

Las formas de capturar son varias, y cada una tiene su propósito. Esta tabla te las
resume de un vistazo:

| Captura | Significado |
|---|---|
| `[x]` | Captura `x` **por valor** (copia) |
| `[&x]` | Captura `x` **por referencia** |
| `[=]` | Captura **todas** las variables por valor |
| `[&]` | Captura **todas** por referencia |
| `[x, &y]` | Mezcla (x por valor, y por referencia) |

::: tip
💡 Si la lambda necesita **modificar** las variables capturadas por valor, debes añadir
`mutable`. Pero recuerda: los cambios no afectan al original. Es como hacer una fotocopia
y anotar sobre la copia: el documento original queda intacto.
:::

## 6. Lambdas vs functors vs punteros a función

Ya conoces las tres formas, así que te dejamos una comparación directa para que decidas
cuál usar en cada situación:

| Característica | Puntero a función | Functor | Lambda |
|---|---|---|---|
| Sintaxis | Verbosa | Muy verbosa | Concisa |
| Captura variables | No | Sí (como atributos) | Sí (`[ ]`) |
| Se define donde se usa | No | No | Sí |
| Uso en la STL | Raro | Antiguo | **Estándar moderno** |

::: info Nota
ℹ️ Internamente, una lambda es un objeto función anónimo que el compilador crea por ti.
Por eso se integran tan bien con los algoritmos de la STL: son exactamente lo que esos
algoritmos esperan. No es magia, es el compilador escribiendo por nosotros la clase que
antes teníamos que escribir a mano.
:::

## 7. Buenas prácticas

- Usa lambdas para lógica corta y local a los algoritmos.
- Captura solo lo que necesites (`[x]`, `[&x]`) en lugar de `[=]`/`[&]` indiscriminadamente.
- Prefiere lambdas a functors en código nuevo.
- Guarda las lambdas con `auto` o `std::function` cuando necesites reutilizarlas.
- Usa punteros a función solo para interacciones con C o APIs antiguas.

## 8. Resumen rápido

- Los **punteros a función** guardan la dirección de una función (forma clásica).
- Los **functors** son objetos con `operator()` que pueden guardar estado.
- Las **lambdas** son funciones anónimas concisas y con captura.
- La sintaxis lambda es `[capturas](parámetros) -> retorno { cuerpo }`.
- Las lambdas se integran perfectamente con los algoritmos de la STL.
- En C++ moderno, las lambdas son la opción estándar.

Ahora tienes el trío completo: contenedores, algoritmos e iteradores con lambdas. En el
siguiente capítulo exploraremos el **uso avanzado de la STL**, con técnicas y patrones
que verás constantemente en el código profesional.