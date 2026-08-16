---
outline: [2, 3]
---

# Patrones en C++ moderno

Los patrones de diseño clásicos nacieron con Java y el polimorfismo por herencia. No está mal:
fue una manera fantástica de organizar el código en su momento. Pero el C++ moderno ofrece
herramientas que a veces los **reemplazan** por algo mucho más sencillo: **`std::function`**,
**lambdas**, **`std::variant`** y **plantillas**. Este capítulo muestra cómo versiones actuales
de los patrones se escriben con el idioma moderno.

La idea central: **usa la herramienta más simple que resuelva el problema**. Si una lambda
resuelve el patrón Strategy, no necesitas cinco clases. Es como elegir entre usar una
calculadora o armar una planilla de cálculo con macros para sumar dos números: no tiene sentido
sobredimensionar la solución cuando algo simple alcanza.

## 1. `std::function`: la interfaz de una sola función

Muchos patrones (Strategy, Observer, Command) existen para encapsular "una cosa que se puede
ejecutar". Pensalo un segundo: la mayoría de esos patrones terminan siendo, en el fondo, *una
función que se guarda y se llama en el momento justo*. Y `std::function` ya representa eso de
forma nativa, sin necesidad de clases ni herencia:

```cpp
#include <iostream>
#include <functional>
using namespace std;

void procesar(int v, function<int(int)> operacion) {
    cout << operacion(v) << endl;
}

int main() {
    procesar(5, [](int x) { return x * 2; });   // 10
    procesar(5, [](int x) { return x + 100; }); // 105
}
```

En lugar de definir una interfaz `Operacion` con herencia, pasas el comportamiento como **dato**.
Es el Strategy en su forma más ligera: podés cambiar el algoritmo en tiempo de ejecución sin
tocar la función `procesar` ni crear una sola clase.

::: tip
💡 El coste de `std::function` es una pequeña indirección y, en algunos casos, una asignación. Para la mayoría de casos reales es despreciable.
:::

## 2. Lambdas genéricas: el patrón Visitor moderno

El **Visitor** clásico (doble despacho con herencia) es uno de los patrones más verbosos que
existen: exige una jerarquía de clases, un método `accept` en cada elemento y otro `visit` en
cada visitante. Se vuelve innecesario cuando combinas `std::variant` con `std::visit`:

```cpp
#include <iostream>
#include <variant>
using namespace std;

// Todos los "tipos visitables" en un solo variante
using Valor = variant<int, double, string>;

int main() {
    Valor v = 42;
    Valor s = string("hola");

    auto imprime = [](auto& x) {
        cout << x << endl;   // la lambda genérica se genera por tipo
    };

    visit(imprime, v);   // 42
    visit(imprime, s);   // hola
}
```

La lambda genérica `[](auto& x)` se instancia para cada tipo del variante: es el **doble despacho
sin jerarquía de clases**. El compilador genera, por cada tipo que puede contener el variante,
la versión adecuada de la lambda, y `std::visit` se encarga de elegir la correcta según el valor
actual. Todo el andamiaje del Visitor clásico queda reducido a dos líneas.

## 3. `std::optional` y el patrón Null Object

Otro clásico: devolver punteros nulos que hay que comprobar en cada uso. El problema de un
`nullptr` es que la ausencia de valor queda implícita: hay que recordar que esa función puede
devolver `null` y acordarse de chequearlo en cada llamada. En lugar de eso, `std::optional` deja
**explícito** que un valor puede no existir:

```cpp
#include <iostream>
#include <optional>
using namespace std;

optional<double> raiz_cuadrada(double v) {
    if (v < 0) return nullopt;   // sin valor
    return sqrt(v);
}

int main() {
    auto r = raiz_cuadrada(-4);
    if (r.has_value()) {
        cout << "Raiz: " << r.value() << endl;
    } else {
        cout << "No tiene raiz real" << endl;
    }
}
```

La firma `optional<double>` ya te dice, solo con mirarla, que la raíz puede no existir. No hay
punteros, no hay `nullptr`, no hay ambigüedad. Es más seguro y legible que "devolver `nullptr`"
para comunicar ausencia. Pensalo como una caja que *puede* contener algo o estar vacía: la
ausencia es parte del diseño, no un accidente.

## 4. Fábricas con `std::function` y `map`

En el capítulo de Factory vimos cómo un `map<string, function<...>>` sustituye a la cascada de
`if` en la creación de objetos. Acá queremos destacar algo más: es la unión de dos patrones,
**Factory** + **Strategy de registro**. Cada tipo queda registrado junto a su función de creación,
y la decisión de cuál usar se convierte en una simple búsqueda en el mapa:

```cpp
#include <iostream>
#include <functional>
#include <map>
#include <memory>
using namespace std;

struct Notificacion {
    virtual ~Notificacion() = default;
    virtual void enviar() const = 0;
};
struct Email : Notificacion {
    void enviar() const override { cout << "Enviando email" << endl; }
};
struct SMS : Notificacion {
    void enviar() const override { cout << "Enviando SMS" << endl; }
};

using Creador = function<unique_ptr<Notificacion>()>;

int main() {
    map<string, Creador> fabrica = {
        {"email", [] { return make_unique<Email>(); }},
        {"sms",   [] { return make_unique<SMS>(); }},
    };

    auto n = fabrica["sms"]();   // crear sin if-else
    n->enviar();
}
```

Si mañana aparece un canal nuevo (WhatsApp, por ejemplo), no tocás la lógica de creación:
agregás una clase y una entrada más al mapa. El `if-else` desaparece por completo, y con él
desaparecen también los errores de "me olvidé de cubrir este caso".

## 5. `concepts` como contrato de interfaz

Las interfaces por herencia (patrón clásico) exigen una clase base: para que `Robot` sea
"aceptado" donde se espera un `Energiable`, `Robot` debe heredar de una clase `Energiable`. Con
**concepts**, el contrato es **estructural**: cualquier tipo que cumpla los requisitos sirve, sin
herencia. No importa de dónde venga el tipo, solo que haga lo que promete:

```cpp
#include <iostream>
#include <concepts>
using namespace std;

template <typename T>
concept Energiable = requires(T t) {
    { t.energia() } -> convertible_to<int>;
};

void reporte(Energiable auto& obj) {
    cout << "Energia: " << obj.energia() << endl;
}

struct Robot {
    int energia() const { return 90; }
};

int main() {
    Robot r;
    reporte(r);   // 90
}
```

`Robot` no hereda de nada: cumple el concepto y ya es aceptado. Es la diferencia entre exigir un
apellido (herencia) y exigir una habilidad (concepto): da igual quién seas mientras sepas hacer
lo que se pide. Y como el chequeo ocurre en tiempo de compilación, un error de contrato se
detecta al compilar, no en ejecución.

## 6. Tabla comparativa

Para que te lleves una visión de conjunto, esta tabla resume cómo se ve cada patrón clásico en el
C++ moderno:

| Patrón clásico | Herramienta moderna |
|---|---|
| Strategy | `std::function` + lambdas |
| Observer | `std::function` + lambdas (callbacks) |
| Command | `std::function` + lambdas |
| Visitor | `std::variant` + `std::visit` |
| Null Object | `std::optional` |
| Factory (registro) | `std::map` + `std::function` |
| Interfaz/Contrato | `concepts` |

Cabe destacar que esto no quiere decir que la herencia esté muerta: quiere decir que ya no es la
única herramienta, ni muchas veces la mejor. La clave es elegir la que resuelva el problema con
menos fricción.

## 7. Buenas prácticas

- Empieza con la **herramienta más simple**: lambda > `std::function` > interfaz con herencia.
- Usa `std::variant` cuando el conjunto de tipos sea **finito y conocido**.
- Prefiere `std::optional` para "valor posiblemente ausente".
- Los concepts reemplazan a las interfaces por herencia en código genérico.
- Mantén las lambdas **pequeñas y con nombre claro**.

## 8. Resumen rápido

- `std::function` + lambdas resuelven Strategy, Observer y Command de forma ligera.
- `std::variant` + `std::visit` eliminan la necesidad de Visitor por herencia.
- `std::optional` expresa ausencia de valor de forma explícita.
- Los `concepts` definen contratos estructurales sin clases base.
- **La herramienta más simple siempre gana.**

Con los patrones ya dominados, queda un paso importante: conocer los **antipatrones**, esas
prácticas que parecen buenas pero que conviene evitar.