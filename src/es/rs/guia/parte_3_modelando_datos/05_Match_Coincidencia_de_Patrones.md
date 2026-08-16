---
outline: [2, 3]
---

# Match: Coincidencia de patrones

En el capítulo anterior creaste enums con variantes que incluso transportan datos. Ahora llega la pregunta inevitable: si un valor puede ser cualquiera de varias variantes, ¿cómo hacemos que el programa haga algo distinto en cada caso? La respuesta es **`match`**, y es una de las herramientas más potentes y distintivas del lenguaje.

`match` es una estructura de control que compara un valor contra una serie de **patrones** y ejecuta el código del primero que coincida. Piensa en la máquina expendedora: cuando introduces una moneda, la máquina la reconoce y entrega el producto correspondiente. El `match` hace exactamente eso con tus datos.

## 1. `match` contra una lista de opciones

Empecemos con un enum sencillo y veamos cómo `match` maneja cada variante. Retomamos el semáforo del capítulo anterior y lo hacemos reaccionar:

```rust
enum Semáforo {
    Rojo,
    Ámbar,
    Verde,
}

fn actuar(semáforo: Semáforo) {
    match semáforo {
        Semáforo::Rojo => println!("Detente"),
        Semáforo::Ámbar => println!("Prepárate"),
        Semáforo::Verde => println!("Avanza"),
    }
}
```

- `match semáforo { ... }`: evaluamos el valor `semáforo`.
- `Semáforo::Rojo => ...`: cada **brazo** tiene un patrón, una flecha `=>` y el código a ejecutar.
- El valor solo puede coincidir con un brazo, y se ejecuta únicamente ese.

Fíjate en que la sintaxis es declarativa: en lugar de encadenar varios `if` preguntando "¿es esto? ¿es lo otro?", simplemente enumeramos las posibilidades. El código se lee como una tabla de decisiones.

## 2. `match` es exhaustivo

Aquí está la diferencia más importante con el `switch` de otros lenguajes: `match` es **exhaustivo**, es decir, debe cubrir **todas** las variantes posibles. Si olvidas una, el compilador se niega a compilar y te dice exactamente cuál te falta. Observa el error:

```rust
fn actuar(semáforo: Semáforo) {
    match semáforo {
        Semáforo::Rojo => println!("Detente"),
        Semáforo::Verde => println!("Avanza"),
        // ❌ Falta Semáforo::Ámbar
    }
}
```

El compilador responderá con un mensaje como `non-exhaustive patterns: Semáforo::Ámbar not covered`. Esta es una de las grandes ventajas del rigor del lenguaje: si mañana añades una variante nueva al enum, todos los `match` que lo usen se romperán hasta que los actualices. Nada se te escapa.

:::warning Advertencia
⚠️ El error `non-exhaustive patterns` te va a acompañar mucho al principio. No lo veas como una molestia: es el auditor de seguridad garantizando que nunca dejes un caso sin tratar. Añade el brazo que falta y listo.
:::

## 3. Enlazar valores: la cobertura total

La variante genérica (`_`) cubre **todo lo demás**. Es el "cajón de sastre" de `match`: captura cualquier patrón que no haya coincidido antes. Es indispensable cuando no te interesa tratar cada caso por separado:

```rust
fn actuar(semáforo: Semáforo) {
    match semáforo {
        Semáforo::Rojo => println!("Detente"),
        resto => println!("Avanza con cuidado: variante {resto:?}"),
    }
}
```

- `resto` enlaza el valor completo a esa variable, permitiendo usarlo dentro del brazo.
- Puedes nombrar el comodín como quieras; Rust lo enlaza automáticamente.
- El guion bajo `_` es el caso especial: captura el valor pero lo **ignora**, sin nombrarlo.

La diferencia es sutil pero útil: `resto` te deja trabajar con el valor que cayó en el caso general, mientras que `_` solo dice "no me importa qué es, haz esto". Usa `_` cuando no necesites el valor y un nombre cuando lo necesites.

## 4. `match` como expresión

Una de las características más elegantes de `match` es que es una **expresión**: produce un valor, y puedes asignar ese valor a una variable. Cada brazo devuelve algo, y lo que devuelven debe tener el mismo tipo:

```rust
let mensaje = match semáforo {
    Semáforo::Rojo => "detente",
    Semáforo::Ámbar => "prepárate",
    Semáforo::Verde => "avanza",
};
println!("Debes {mensaje}");
```

- Cada brazo devuelve un `&str` (el texto entre comillas).
- El resultado se asigna a `mensaje` con `let`.
- El tipo de todos los brazos debe coincidir, o el compilador lo rechazará.

:::info Nota
ℹ️ `match` comparte la lógica de las expresiones que viste en el capítulo de funciones: todo bloque que devuelve un valor es una expresión. `match` es una de las más versátiles, porque cada brazo puede ser un bloque completo con varias líneas.
:::

## 5. Enlazar datos de las variantes

Cuando las variantes llevan datos, `match` brilla de verdad. Puedes "abrir" el paquete en el patrón y darle nombre al contenido que trae. Recuerda el enum `Mensaje` del capítulo anterior:

```rust
enum Mensaje {
    Salir,
    Mover { x: i32, y: i32 },
    Escribir(String),
}

fn procesar(mensaje: Mensaje) {
    match mensaje {
        Mensaje::Salir => println!("Cerrando la aplicación"),
        Mensaje::Mover { x, y } => println!("Moviendo a ({x}, {y})"),
        Mensaje::Escribir(texto) => println!("Escribiendo: {texto}"),
    }
}
```

- `Mensaje::Mover { x, y }` descompone el struct interno y enlaza `x` e `y`.
- `Mensaje::Escribir(texto)` enlaza la `String` transportada a la variable `texto`.
- `Mensaje::Salir` no lleva datos, así que su brazo es simple.

Esta capacidad de **desestructurar** dentro del patrón es lo que hace a `match` tan expresivo: no solo decides qué hacer según la variante, sino que los datos viajan directamente a tus variables sin pasos extra.

## 6. `match` con `Option<T>`

El caso más importante de `match` en la práctica es manejando `Option<T>`. Es el momento de cobrar la promesa del capítulo anterior: como `Option` te obliga a tratar la ausencia, `match` es la forma canónica de hacerlo:

```rust
fn duplicar(valor: Option<i32>) -> Option<i32> {
    match valor {
        Some(n) => Some(n * 2),
        None => None,
    }
}
```

- `Some(n)` enlaza el valor contenido y lo usa para calcular el doble.
- `None` no tiene datos: solo devuelve `None`.
- Como `Option` tiene exactamente dos variantes, cubrir `Some` y `None` ya hace el `match` exhaustivo.

Observa la seguridad: el compilador no te deja escribir `duplicar` sin el brazo `None`. Estás **obligado** a decidir qué pasa cuando no hay valor, y esa decisión queda escrita de forma clara y revisable.

:::tip
💡 El par `Option<T>` + `match` es el reemplazo directo y seguro del manejo de `null`: en otros lenguajes olvidarías revisar si el valor existe; acá el compilador te fuerza a escribir ambos brazos antes de que el programa exista.
:::

## Buenas prácticas

- Cubre **todas** las variantes; deja que el compilador te recuerde las que falten.
- Usa `_` para ignorar casos que no te importan, y un nombre cuando necesites el valor.
- Aprovecha que `match` es una expresión para asignar resultados directamente.
- Desestructura los datos de las variantes dentro del patrón para ahorrar pasos.
- Con `Option<T>`, escribe siempre los brazos `Some` y `None` con intención.

## Resumen rápido

- `match` compara un valor contra patrones y ejecuta el primer brazo que coincide.
- Es **exhaustivo**: debe cubrir todas las variantes o el código no compila.
- Los patrones pueden **enlazar** los datos que transportan las variantes.
- `_` ignora el valor; un nombre lo captura para usarlo.
- `match` es una expresión: cada brazo devuelve un valor que puedes asignar.
- Con `Option<T>`, los brazos `Some` y `None` obligan a tratar la ausencia.

`match` es increíblemente expresivo, pero para los casos en que solo te interesa **un** patrón concreto, escribir todos los brazos se vuelve verboso. En el siguiente capítulo verás `if let`, el azúcar sintáctico que simplifica esa situación.