---
outline: [2, 3]
---

# Un ejemplo con structs

En el capítulo anterior aprendiste a definir structs, pero la teoría cobra sentido cuando la aplicamos a un problema real. En este capítulo vamos a resolver un problema de la vida cotidiana: calcular el **área de un rectángulo**. Es un ejercicio clásico y perfecto para ver, en tres pasos, cómo el diseño del código mejora a medida que aprendemos a modelar mejor los datos.

Verás algo fascinante: el programa hará lo mismo en las tres versiones, pero cada una será más clara, más segura y más fácil de mantener. Este es el verdadero oficio del programador: no solo lograr que el código funcione, sino hacer que el código comunique su intención.

## 1. El problema

Necesitamos una función que reciba el ancho y el alto de un rectángulo y devuelva su área. Parece trivial, pero conforme avancemos nos daremos cuenta de que los parámetros sueltos generan confusión: ¿cuál es el ancho y cuál es el alto? ¿Se pasan en ese orden? Empecemos por la versión más ingenua.

## 2. Primera versión: Variables sueltas

La forma más directa es crear dos variables, `ancho` y `alto`, y pasarlas a una función que recibe dos números:

```rust
fn calcular_area(ancho: u32, alto: u32) -> u32 {
    ancho * alto
}

fn main() {
    let ancho = 30;
    let alto = 50;
    println!("El área es {}", calcular_area(ancho, alto));
}
```

Funciona a la perfección: multiplica `30 * 50` y muestra `1500`. Pero fíjate en un problema sutil: la función recibe dos `u32` sin ningún vínculo entre ellos. Nada impide que en una llamada escribas `calcular_area(alto, ancho)` por accidente, y el compilador no podría notar la diferencia, porque son solo dos números.

## 3. Segunda versión: Tuplas

Para agrupar los dos datos, podríamos usar una tupla. Así pasamos un solo valor a la función, lo que al menos deja claro que ambos números viajan juntos:

```rust
fn calcular_area(dimensiones: (u32, u32)) -> u32 {
    dimensiones.0 * dimensiones.1
}

fn main() {
    let rectangulo = (30, 50);
    println!("El área es {}", calcular_area(rectangulo));
}
```

La tupla agrupa el ancho y el alto en una sola variable, `rectangulo`. Pero ahora aparece otro problema: dentro de la función, ¿qué es `dimensiones.0`? El ancho, claro... pero solo si lo recuerdas, porque la tupla no le pone nombre a sus posiciones. Un código que depende de la memoria del programador es un código frágil.

:::info Nota
ℹ️ Las tuplas son geniales para grupos pequeños y temporales, pero cuando los datos tienen un significado claro en tu dominio, exigir nombres hace la diferencia. Ahí es donde los structs brillan.
:::

## 4. Tercera versión: El struct

Ahora llegamos a la solución elegante. Definimos un struct `Rectangulo` con campos `ancho` y `alto`, y la función recibe una referencia al struct:

```rust
struct Rectangulo {
    ancho: u32,
    alto: u32,
}

fn calcular_area(rectangulo: &Rectangulo) -> u32 {
    rectangulo.ancho * rectangulo.alto
}

fn main() {
    let rectangulo = Rectangulo { ancho: 30, alto: 50 };
    println!("El área es {}", calcular_area(&rectangulo));
}
```

- `struct Rectangulo { ancho: u32, alto: u32 }`: define el molde con dos campos nombrados.
- `fn calcular_area(rectangulo: &Rectangulo) -> u32`: recibe un **préstamo** del struct, siguiendo lo que viste en el capítulo de referencias.
- `rectangulo.ancho * rectangulo.alto`: multiplica los campos usando su nombre.
- `Rectangulo { ancho: 30, alto: 50 }`: crea la instancia con valores concretos.

Fíjate en lo que ganamos: ahora es imposible confundir el ancho con el alto, porque cada uno tiene su etiqueta. Además, el tipo `Rectangulo` es reutilizable: cualquier otra función puede recibir el mismo struct sin reescribir nada. El código se lee como una frase, no como un galimatías de posiciones.

## 5. Mostrando el rectángulo en pantalla

Hay un pequeño detalle: si intentamos imprimir el struct directamente con `println!("{rectangulo}")`, el compilador se quejará. Eso ocurre porque el tipo `Rectangulo` no sabe cómo mostrarse a sí mismo. Para arreglarlo, podemos añadir `#[derive(Debug)]` justo encima del struct, lo que le enseña al tipo a imprimirse de forma legible:

```rust
#[derive(Debug)]
struct Rectangulo {
    ancho: u32,
    alto: u32,
}

fn main() {
    let rectangulo = Rectangulo { ancho: 30, alto: 50 };
    println!("{rectangulo:?}");
}
```

- `#[derive(Debug)]`: es un **atributo** que genera automáticamente el código para mostrar el struct.
- `{:?}`: es la sintaxis de impresión para datos con `Debug`.
- La salida será algo como `Rectangulo { ancho: 30, alto: 50 }`.

No te preocupes si los atributos y el formato `{:?}` parecen magia por ahora; más adelante los entenderás a fondo. Por el momento, recuerda que `#[derive(Debug)]` es tu mejor amigo para inspeccionar tus tipos durante el desarrollo.

:::warning Advertencia
⚠️ Sin `#[derive(Debug)]`, imprimir un struct con `{:?}` o `{}` produce un error de compilación. Es el recordatorio de Rust de que no puede adivinar cómo quieres representar tu tipo en pantalla.
:::

## 6. ¿Hacia dónde mejora esto?

El struct ha mejorado mucho el código, pero todavía hay una incomodidad: la función `calcular_area` está **fuera** del struct, separada de los datos que opera. Sería más natural que el área fuera algo que el propio rectángulo sabe calcular. Esa unión entre un tipo y sus comportamientos es justo lo que veremos en el siguiente capítulo con los **métodos**.

## Buenas prácticas

- Modela con structs cualquier entidad con varios datos relacionados y nombrados.
- Pasa los structs por **referencia** (`&Rectangulo`) cuando solo necesites leerlos.
- Añade `#[derive(Debug)]` a tus tipos para poder imprimirlos durante el desarrollo.
- Diseña evolucionando: primero haz que funcione, después mejora la claridad de los datos.
- Usa tuplas solo para agrupar datos temporales sin significado propio.

## Resumen rápido

- Las **variables sueltas** funcionan pero no relacionan los datos entre sí.
- Las **tuplas** agrupan los datos pero pierden los nombres.
- Los **structs** nombran cada campo y crean un tipo reutilizable.
- `#[derive(Debug)]` permite imprimir el struct con `{:?}`.
- Pasar `&Rectangulo` presta el struct sin moverlo.

El struct `Rectangulo` ya es un tipo respetable, pero todavía le falta un superpoder: que sepa calcular su propia área. En el siguiente capítulo descubrirás los **métodos**, la forma de dotar a tus tipos de comportamiento.