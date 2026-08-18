---
outline: [2, 3]
---

# SFINAE y conceptos

Hemos visto cómo las plantillas generan código para cualquier tipo. Pero,
¿qué pasa si una plantilla se usa con un tipo que **no soporta** las
operaciones que necesita? Hasta ahora el compilador simplemente daba un error
(y muchas veces un error enorme y confuso). En este capítulo veremos las
técnicas que permiten **restringir** y **adaptar** las plantillas según las
capacidades de los tipos: **SFINAE** y, su versión moderna y legible, los
**conceptos**.

Son temas avanzados, eso hay que decirlo, pero esenciales para entender el
código moderno de C++ y la biblioteca estándar. No te preocupes si al
principio parecen densos: iremos paso a paso y verás que no son tan
complicados como suenan.

## 1. El problema: Restringir una plantilla

Imagina que tienes una plantilla que suma dos valores. Funciona con `int`,
`double`... pero ¿qué pasa con un tipo que no tenga operador `+`? Acá lo
vemos en acción:

```cpp
#include <iostream>
using namespace std;

template <typename T>
T sumar(T a, T b) {
    return a + b; // Requiere que T tenga operator+
}

int main() {
    cout << sumar(5, 3) << endl; // OK
    // sumar("a", "b");  // Si T no soporta +, error confuso

    return 0;
}
```

Cuando la plantilla falla, el compilador produce errores enormes y difíciles
de leer, como si te lanzara mil líneas de texto en un idioma que nadie
entiende. Lo ideal sería poder decirle al compilador: "esta plantilla **solo**
funciona con tipos que cumplan ciertos requisitos". Acá es donde entran
SFINAE y los conceptos.

## 2. ¿Qué es SFINAE?

**SFINAE** significa *Substitution Failure Is Not An Error* ("un fallo de
sustitución no es un error"). Es una regla de C++ que dice: si durante la
sustitución de un tipo en una plantilla ocurre un error **dentro de la
declaración** (no en el cuerpo), ese candidato simplemente **se descarta**,
sin producir error.

En la práctica, esto permite **sobrecargar** plantillas y dejar que el
compilador elija la que mejor se adapte a cada tipo. Es como tener varios
candidatos para un puesto y que el encargado elija al que mejor cumple los
requisitos, descartando en silencio a los que no aplican.

Un ejemplo clásico con `<type_traits>`:

```cpp
#include <iostream>
#include <type_traits>
using namespace std;

// Solo participa si T es un tipo entero
template <typename T>
enable_if_t<is_integral_v<T>, T> mitad(T valor) {
    return valor / 2;
}

// Solo participa si T es un tipo de punto flotante
template <typename T>
enable_if_t<is_floating_point_v<T>, T> mitad(T valor) {
    return valor / 2.0;
}

int main() {
    cout << mitad(10) << endl;    // 5 (versión entera)
    cout << mitad(10.0) << endl;  // 5 (versión flotante)

    return 0;
}
```

::: info Nota
ℹ️ `enable_if_t` es una herramienta de la biblioteca estándar: si la
condición es `true`, "activa" el tipo; si es `false`, la función se descarta
de la sobrecarga (gracias a SFINAE). `is_integral_v<T>` y
`is_floating_point_v<T>` son comprobaciones de tipos de `<type_traits>`.
:::

## 3. Los conceptos (C++20): SFINAE con sintaxis legible

SFINAE funciona, pero hay que ser honestos: su sintaxis es difícil de leer,
incluso para programadores experimentados. Por eso, **C++20** introdujo los
**conceptos**: una forma declarativa y legible de expresar los requisitos de
una plantilla.

Un concepto se define con la palabra clave `concept`:

```cpp
#include <iostream>
#include <concepts>
using namespace std;

// Definimos un concepto: "T debe ser un tipo integral"
template <typename T>
concept Integral = is_integral_v<T>;

// La plantilla solo acepta tipos que cumplan el concepto
template <Integral T>
T mitad(T valor) {
    return valor / 2;
}

int main() {
    cout << mitad(10) << endl;   // 5
    // mitad(10.5);
    // ⚠️ Error claro: double no cumple el concepto Integral

    return 0;
}
```

::: tip
💡 La gran ventaja de los conceptos frente a SFINAE es la **claridad**: el
código se lee casi como lenguaje natural y los errores del compilador son
mucho más comprensibles ("el tipo double no satisface el concepto Integral").
:::

## 4. Sintaxis de los conceptos

Hay varias formas de aplicar un concepto a una plantilla, y todas son
equivalentes. La elección depende del estilo y de lo que resulte más claro en
cada caso:

```cpp
template <typename T> concept Integral = is_integral_v<T>;

// Forma 1: con template <Integral T>
template <Integral T> void f1(T) {}

// Forma 2: con requires
template <typename T> requires Integral<T> void f2(T) {}

// Forma 3: en el parámetro
template <typename T> void f3(T valor) requires Integral<T> {}

// Forma 4: directamente en el parámetro de la función
void f4(Integral auto valor) {}
```

## 5. Conceptos de la biblioteca estándar

C++20 trae una colección de conceptos listos para usar en el encabezado
`<concepts>`. Es una buena práctica empezar por ellos antes de crear los
propios:

| Concepto | Requiere que el tipo... |
|---|---|
| `Integral` | Sea un tipo entero |
| `FloatingPoint` | Sea un tipo de punto flotante |
| `SignedIntegral` / `UnsignedIntegral` | Sea entero con/sin signo |
| `SameAs<T>` | Sea exactamente el tipo T |
| `DerivedFrom<T>` | Derive de T |
| `ConvertibleTo<T>` | Se pueda convertir a T |
| `Invocable` | Se pueda llamar como función |

Veamos un ejemplo con `Invocable`, que acepta cualquier cosa que se pueda
llamar como si fuera una función:

```cpp
#include <iostream>
#include <concepts>
using namespace std;

// Acepta cualquier tipo que se pueda invocar y devuelva algo
template <typename Funcion>
requires Invocable<Funcion>
void ejecutar(Funcion f) {
    f();
}

int main() {
    ejecutar([]() { cout << "Lambda ejecutada" << endl; });
    return 0;
}
```

## 6. Conceptos personalizados con `requires`

¿Qué pasa si ninguno de los conceptos estándar cubre lo que necesitas?
Podemos crear conceptos más específicos comprobando expresiones con una
cláusula `requires`:

```cpp
#include <iostream>
#include <concepts>
using namespace std;

// Concepto personalizado: T debe soportar el operador +
template <typename T>
concept Sumable = requires(T a, T b) {
    a + b; // La expresión 'a + b' debe ser válida
};

template <Sumable T>
T sumar(T a, T b) {
    return a + b;
}

int main() {
    cout << sumar(3, 4) << endl;     // 7
    cout << sumar(2.5, 1.5) << endl; // 4

    // string soporta + (concatenación)
    cout << sumar(string("hola "), string("mundo")) << endl;

    return 0;
}
```

::: info Nota
ℹ️ La cláusula `requires` en la definición de un concepto comprueba que
ciertas expresiones sean **válidas** para el tipo T. Si no lo son, el tipo no
satisface el concepto.
:::

## 7. ¿Cuándo usar conceptos y cuándo SFINAE?

La respuesta corta: depende de tu contexto. Acá te dejamos una tabla para que
lo tengas claro de un vistazo:

| Situación | Recomendación |
|---|---|
| Código nuevo (C++20 o superior) | **Conceptos** |
| Restricciones simples y legibles | **Conceptos** |
| Código compatible con C++11/14/17 | SFINAE |
| Detección de capacidades complejas | Conceptos con `requires` |

::: tip
💡 Los conceptos no solo mejoran la legibilidad: también **acortan los
tiempos de compilación** y producen errores mucho más claros. Si tu proyecto
puede usar C++20, elige conceptos.
:::

## 8. Buenas prácticas

- Usa **conceptos** en lugar de SFINAE cuando tu estándar lo permita.
- Comienza con los conceptos de la biblioteca estándar antes de crear los
  propios.
- Mantén los conceptos personalizados **pequeños y con un solo propósito**.
- Combina conceptos con el operador `&&` para requisitos múltiples.
- Documenta qué significa cada concepto para tu dominio.

## 9. Resumen rápido

- **SFINAE** descarta candidatos inválidos en la sustitución, permitiendo
  sobrecargas condicionales.
- `enable_if` y `<type_traits>` implementan SFINAE de forma práctica.
- Los **conceptos** (C++20) expresan requisitos de forma legible y
  declarativa.
- `template <Integral T>` restringe una plantilla a ciertos tipos.
- `<concepts>` trae conceptos estándar (`Integral`, `FloatingPoint`,
  `Invocable`...).
- Con `requires` se crean conceptos personalizados.
- Los conceptos dan errores más claros y código más limpio.

Con SFINAE y conceptos, la programación genérica alcanza su máximo nivel de
expresividad y seguridad. En el siguiente módulo daremos un giro hacia la
gestión de errores en tiempo de ejecución: las **excepciones**.