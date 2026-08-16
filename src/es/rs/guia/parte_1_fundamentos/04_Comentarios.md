---
outline: [2, 3]
---

# Comentarios

Ya sabes declarar variables, manejar tipos y crear funciones. En este capítulo toca un tema más ligero, pero igual de importante en la vida real del código: los **comentarios**. Son esas notas que escribimos para las personas que leerán el código, porque el compilador las ignora por completo.

Piensa en un comentario como una nota al margen en tu cuaderno de programación: no cambia el resultado de lo que haces, pero te recuerda por qué lo hiciste. En Rust hay dos formas de escribir comentarios, y ambas empiezan con dos barras inclinadas `//`.

## 1. Comentarios de una línea

La forma más sencilla es usar `//`: todo lo que sigue hasta el final de la línea es ignorado por el compilador.

```rust
// Esto es un comentario: el compilador lo ignora
let edad = 25; // y también puedes ponerlo al final de una línea
```

- `//`: Marca el inicio del comentario. Todo lo demás en esa línea se descarta.
- Puede ir solo en su propia línea o al final de una línea de código.

No existe una sintaxis de bloque multilínea como `/* */` en otros lenguajes; la convención en Rust es simplemente usar varios `//` apilados:

```rust
// Este comentario
// ocupa varias líneas
let ancho = 4;
```

:::tip
💡 Escribe comentarios que expliquen el **por qué** (la decisión, el contexto) y no el **qué** (lo que el código ya muestra). Un comentario como `// ahora sumo 1` no aporta nada: la línea `x + 1` ya lo dice todo.
:::

## 2. El mejor código se explica solo

Aquí llega la filosofía que guía a este ecosistema: **el mejor código no necesita comentarios para ser entendido**. Si tienes que explicar qué hace tu código, quizá el problema no es la falta de comentarios, sino el código mismo.

Observa este contraste. Primero, el estilo "con muletas":

```rust
// esto le suma 1 a la velocidad y luego la multiplica por 3
let velocidad = 5;
let resultado = (velocidad + 1) * 3;
```

Ahora, la versión que se explica sola:

```rust
let velocidad = 5;
let velocidad_con_impulso = (velocidad + 1) * 3;
```

- El nombre de la variable comunica la intención sin necesidad de comentarios.
- El comentario solo decía lo que el código ya mostraba: era ruido.

Por eso los nombres descriptivos que venimos eligiendo no son un capricho. Un buen nombre es una forma de documentación gratuita que nunca queda desactualizada, a diferencia de un comentario que puede volverse mentiroso cuando el código cambia y nadie lo actualiza.

:::warning Advertencia
⚠️ No uses comentarios para describir lo obvio. Un comentario que repite lo que dice el código es ruido; uno que explica una decisión o una trampa sutil es oro. Si el comentario contradice al código, el código gana: es lo que realmente se ejecuta.
:::

## 3. Documentación con `///`

Rust va un paso más allá: tiene comentarios especiales que no solo documentan, sino que **generan documentación automática** con `cargo doc`. Se escriben con tres barras `///` justo antes de la definición que documentan.

```rust
/// Calcula el área de un rectángulo.
///
/// Recibe la base y la altura y devuelve su producto.
fn area(base: i32, altura: i32) -> i32 {
    base * altura
}
```

- `///`: Comentario de documentación. Se coloca antes de la función, struct o enum que describe.
- `cargo doc` convierte estos comentarios en una página HTML legible y navegable.
- La línea en blanco entre párrafos separa secciones de la descripción.

Estos comentarios de documentación suelen incluir ejemplos de uso encerrados en tres acentos graves, que además se ejecutan como pruebas cuando corres `cargo test`. Es una forma elegante de garantizar que la documentación nunca mienta.

## 4. Documentación interna con `//!`

Existe una variante pensada para documentar el **contenedor completo** de código: el archivo o el módulo. Se escribe con `//!` y normalmente va al inicio del archivo, describiendo su propósito global.

```rust
//! Este módulo contiene utilidades para calcular
//! figuras geométricas básicas.
```

- `//!`: Documenta el módulo o el archivo donde aparece, no un elemento específico.
- Se coloca al principio del archivo, como una portada que explica qué encontrarás dentro.
- Funciona igual que `///` con `cargo doc`, pero para el contenedor en lugar de un elemento.

:::info Nota
ℹ️ Regla rápida: `///` documenta **lo que viene después** (una función, un struct); `//!` documenta **todo el archivo o módulo** donde está. Son hermanos: el primero mira hacia adelante, el segundo mira hacia adentro.
:::

## Buenas prácticas

- Comenta el **por qué**, no el **qué**: la intención detrás de la decisión.
- Prefiere nombres descriptivos para que el código se explique solo.
- Documenta las funciones públicas con `///` y deja que `cargo doc` genere la documentación.
- Usa `//!` al inicio de un archivo o módulo para presentar su propósito.
- Si un comentario repite el código, bórralo.

## Resumen rápido

- `//` crea un comentario de línea: el compilador lo ignora.
- El mejor código se explica solo con buenos nombres.
- `///` documenta funciones, structs y enums, y alimenta a `cargo doc`.
- `//!` documenta el archivo o módulo completo.
- Un buen comentario explica la intención, no la mecánica.

Ya sabes cómo dejar notas para el futuro. En el próximo capítulo pasamos a las **estructuras de control**: las herramientas que le permiten a tu programa decidir y repetir, para dejar de ser un guion lineal.