---
outline: [2, 3]
---

# Definiendo un enum

En los capítulos anteriores aprendiste a modelar datos que siempre tienen la misma estructura, como un `Rectangulo` con `ancho` y `alto`. Pero el mundo real no siempre es tan rígido: un semáforo puede estar en rojo, ámbar o verde; un pago puede ser con tarjeta, efectivo o transferencia. Cuando un dato puede tomar **una de varias formas distintas**, necesitamos los **enums**.

Un **enum** (abreviatura de *enumeration*) declara un tipo que puede ser exactamente una de un conjunto de variantes. Piensa en el menú de un restaurante: puedes pedir el plato A, el B o el C, pero siempre uno solo. El menú no es un plato, es la lista de posibilidades; el enum tampoco es un valor, es la definición de qué valores pueden existir.

## 1. Definiendo un enum simple

La sintaxis usa la palabra clave `enum`, seguida del nombre del tipo y la lista de variantes separadas por comas. Las variantes empiezan con mayúscula, igual que los structs:

```rust
enum Semáforo {
    Rojo,
    Ámbar,
    Verde,
}
```

- `enum Semáforo`: declara el nuevo tipo.
- `Rojo`, `Ámbar` y `Verde` son las **variantes** posibles.
- Un valor de tipo `Semáforo` solo puede ser una de ellas.

Para crear un valor, usamos el nombre del enum, `::` y la variante:

```rust
let actual = Semáforo::Verde;
let siguiente = Semáforo::Rojo;
```

Acá `actual` y `siguiente` son dos valores del mismo tipo, pero cada uno representa un estado distinto. El compilador sabe cuáles son las variantes válidas, así que cualquier variante inventada provoca un error al instante.

## 2. El enum es un tipo cerrado

Una propiedad clave del enum es que la lista de variantes es **cerrada**: no puedes añadir una variante nueva desde fuera de la definición. Esto puede parecer una restricción, pero es una fortaleza. Imagina que el software de un semáforo usa este enum: como el compilador conoce todas las posibilidades, puede verificar que tu código las maneje **todas**. No existe la posibilidad de que aparezca un estado inesperado en tiempo de ejecución.

Este rigor es parte de la filosofía del lenguaje que viste en la introducción: detección temprana y rigor en el diseño. Al cerrar el conjunto de posibilidades, eliminamos de raíz toda una familia de errores.

## 3. Variantes con datos

Aquí viene la parte más poderosa: cada variante de un enum puede llevar **datos propios**, incluso de tipos distintos entre sí. La variante no solo dice "soy un tipo de cosa", sino que además guarda la información que le corresponde:

```rust
enum Mensaje {
    Salir,
    Mover { x: i32, y: i32 },
    Escribir(String),
    CambiarColor(i32, i32, i32),
}
```

- `Salir`: una variante sin datos, como las del semáforo.
- `Mover { x: i32, y: i32 }`: lleva un struct anónimo con dos campos.
- `Escribir(String)`: lleva una tupla con una `String`.
- `CambiarColor(i32, i32, i32)`: lleva una tupla con tres enteros.

Observa lo flexible que es: cada variante puede guardar exactamente lo que necesita, con la forma que necesite. Eso significa que un solo tipo `Mensaje` puede representar acciones tan distintas como salir del programa o pintar la pantalla de un color.

```rust
let mensaje = Mensaje::Escribir(String::from("hola"));
let movimiento = Mensaje::Mover { x: 10, y: 20 };
```

- `Mensaje::Escribir("hola")` crea un mensaje que transporta texto.
- `Mensaje::Mover { x: 10, y: 20 }` crea uno que transporta coordenadas.
- Ambos son del mismo tipo `Mensaje`, pero cada uno carga su propia clase de datos.

:::tip
💡 Cuando veas enums con datos como estos, piensa en cada variante como un struct con su propio molde: el enum es el menú, y cada variante es un plato con sus ingredientes específicos.
:::

## 4. El enum `Option<T>`

Ahora prepárate para conocer al enum más famoso del lenguaje, tan importante que viene **incluido en Rust**: `Option<T>`. Su definición es asombrosamente simple:

```rust
enum Option<T> {
    None,
    Some(T),
}
```

El `<T>` indica que `Option` es un enum **genérico**: puede contener cualquier tipo. La idea es sencilla: o hay un valor (`Some(valor)`), o no hay nada (`None`). Es como un regalo: puede que el paquete contenga el objeto (`Some`) o que esté vacío (`None`).

```rust
let presente = Some(5);           // hay un valor: el 5
let ausente: Option<i32> = None;  // no hay valor
```

El truco está en que `Option<T>` **no es** un `T` normal. No puedes sumar un `Option<i32>` con un `i32`, ni usar una `Option<String>` donde se espera una `String`. El lenguaje te obliga a abrir el paquete antes de usar su contenido, lo que cambia por completo la forma de trabajar.

## 5. El fin de los errores `null`

Aquí llegamos al punto que justifica la fama de este enum. En lenguajes como Java, C o JavaScript, un dato puede ser `null`: un valor que existe pero no contiene nada, y usarlo sin revisarlo provoca fallos catastróficos en tiempo de ejecución. Es una de las fuentes más grandes de bugs en la industria.

Rust elimina el `null` por diseño. Si un dato puede estar ausente, su tipo debe ser `Option<T>`, y el compilador **te obliga** a manejar el caso de ausencia. No puedes olvidarlo: o escribes código para `None`, o el programa no compila.

```rust
fn mitad(x: i32) -> Option<i32> {
    if x % 2 == 0 {
        Some(x / 2)
    } else {
        None
    }
}
```

- La función devuelve `Some(...)` cuando la división tiene sentido.
- Devuelve `None` cuando no se puede calcular.
- Quien llame a `mitad` sabrá por el tipo que el resultado puede no existir, y deberá decidir qué hacer en ese caso.

:::warning Advertencia
⚠️ No intentes usar un `Option<T>` como si fuera un `T` directo. Rust no lo permite, y el error te parecerá molesto al principio. Pero es exactamente esa molestia la que te ahorra los errores de `null` que persiguen a otros lenguajes. El error es el auditor haciendo su trabajo.
:::

:::info Nota
ℹ️ Rust no es el único lenguaje con esta idea, pero sí uno de los más disciplinados en aplicarla: aquí el `Option<T>` no es una recomendación, es la única forma de representar la ausencia de un valor, y el compilador no te deja ignorarla.
:::

## Buenas prácticas

- Usa enums para representar datos que pueden ser **una de varias variantes**.
- Aprovecha que cada variante puede llevar datos propios para no crear structs separados.
- Declara funciones que puedan fallar devolviendo `Option<T>` en lugar de un valor directo.
- Nunca conviertas un `Option<T>` en un `T` a la fuerza: primero decide qué hacer con `None`.
- Piensa en `Option` como el reemplazo moderno y seguro del `null`.

## Resumen rápido

- Un **enum** declara un conjunto cerrado de variantes posibles.
- Cada variante puede llevar datos propios, incluso con formas distintas entre sí.
- `Option<T>` es el enum del lenguaje para valores que pueden existir (`Some`) o no (`None`).
- `Option<T>` obliga a manejar la ausencia en tiempo de compilación.
- Rust no tiene `null`: la ausencia se modela siempre de forma explícita.

Ya tienes enums con datos como `Mensaje` y el poderoso `Option<T>`. Pero ahora surge una pregunta inevitable: si un enum puede tener varias variantes y cada una con datos distintos, ¿cómo hacemos que el programa reaccione de forma distinta según la variante? En el siguiente capítulo descubrirás **match**, la herramienta perfecta para manejar cada caso.