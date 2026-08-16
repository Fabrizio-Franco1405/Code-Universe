---
outline: [2, 3]
---

# El tipo slice

En el capítulo anterior aprendiste a prestar datos con referencias, pero a veces no necesitas todo el dato: solo una parte. Imagina que tienes un libro de cien páginas y te interesa únicamente el capítulo tres. Copiarlo entero sería un desperdicio, y arrancar las páginas que no te sirven destruiría el libro. El **slice** (porción) de Rust resuelve exactamente este problema: te da una vista de una parte del dato sin copiarlo ni moverlo.

Un slice es, en esencia, una referencia a un segmento contiguo de datos. A diferencia de una referencia completa, el slice recuerda **dónde empieza** y **cuántos elementos abarca**, de modo que nunca podrás leer más allá de sus límites. Seguimos dentro de la familia de los préstamos: el slice no es dueño del dato, solo lo observa.

## 1. ¿Qué es un slice?

Un slice se escribe como `&T` para un solo valor, o como `&[T]` para una porción de una colección. En el caso de las cadenas, el tipo es `&str`: una referencia a un pedazo de texto. Piensa en él como un marcador dentro de un documento: el marcador no es el documento, pero sabes exactamente dónde comienza y dónde termina la sección que te interesa.

Lo más importante es que un slice **no posee** los datos que observa. Solo presta su vista, y por eso los slices siguen las reglas del préstamo que viste en el capítulo anterior: mientras un slice exista, su dato de origen no puede ser modificado si el slice lo está leyendo.

## 2. Obteniendo un slice de un `String`

Para crear un slice a partir de un `String`, usamos la notación de rangos con corchetes. El rango `[inicio..fin]` indica dónde empieza el slice y dónde termina: el índice de inicio se incluye y el de fin **no**. Observa el ejemplo:

```rust
let saludo = String::from("hola mundo");
let hola = &saludo[0..4];
let mundo = &saludo[5..10];

println!("{hola}");   // hola
println!("{mundo}");  // mundo
```

- `[0..4]`: abarca los índices 0, 1, 2 y 3, es decir, "hola".
- `[5..10]`: abarca las letras desde la posición 5 hasta la 9, es decir, "mundo".
- El resultado es un `&str`: una vista de una parte de `saludo`, sin copiar nada.

Para llegar a los índices, piensa en las posiciones entre caracteres: el índice 0 está antes de la primera letra, el 1 entre la primera y la segunda, y así sucesivamente. Por eso `[0..4]` incluye cuatro letras: va de la posición 0 a la 4.

:::tip
💡 Rust ofrece atajos: `[0..4]` se puede escribir como `[..4]`, `[4..]` llega hasta el final, y `[..]` toma todo el dato. Son formas más concisas de decir lo mismo.
:::

## 3. Seguridad contra los desbordes

Los slices eliminan por diseño una de las pesadillas clásicas de los lenguajes de bajo nivel: leer fuera de los límites. Si tu slice termina más allá del final del texto, el compilador no lo permite:

```rust
let saludo = String::from("hola");
let raro = &saludo[0..100]; // ❌ ERROR en tiempo de ejecución (panic)
```

Este caso es un poco distinto a los que viste antes: los rangos se comprueban en tiempo de ejecución, y si te pasas de largo, el programa entra en pánico y se detiene de forma controlada. Más adelante veremos qué es un `panic!` y cómo manejarlo, pero por ahora basta con saber que nunca obtendrás datos basura de memoria ajena: o el slice es válido, o el programa se detiene antes de dañar nada.

:::warning Advertencia
⚠️ El *out of bounds* es el error más típico con slices. Acostúmbrate a comprobar mentalmente cuántos elementos tiene tu dato antes de escribir rangos a ciegas, y aprovecha los atajos `[..]`, `[n..]` y `[..n]` cuando te sirvan.
:::

## 4. Slices de arrays y vectores

Los slices no son exclusivos de las cadenas. Cualquier colección contigua, como un array o un `Vec`, puede prestar porciones de sí misma con el tipo `&[T]`, donde `T` es el tipo de sus elementos:

```rust
let numeros = [10, 20, 30, 40, 50];
let primeras_tres = &numeros[..3];

for numero in primeras_tres {
    println!("{numero}");
}
```

- `[10, 20, 30, 40, 50]` es un array de cinco enteros.
- `&numeros[..3]` crea un slice que abarca los tres primeros elementos.
- El tipo de `primeras_tres` es `&[i32]`, y se recorre con un `for` igual que el array original.

La belleza de esto es que podemos escribir funciones que acepten `&[i32]` y así servirán tanto para arrays como para vectores, sin importar el tamaño. Más adelante, cuando veas las colecciones, esta flexibilidad se volverá una de tus herramientas favoritas.

## 5. Los literales de cadena ya son slices

Aquí viene un dato revelador: cuando escribes `"hola"` en tu código, su tipo no es `String`, sino `&str`. Los literales de cadena son slices que apuntan a un lugar especial de tu programa compilado. Por eso funcionan en cualquier lugar donde se espere `&str`, y por eso no necesitas crear un `String` para la mayoría de los textos fijos.

```rust
let frase: &str = "los literales son slices";
println!("{frase}");
```

Esta es la diferencia clave con el `String`: `String` es el dueño de su memoria en el heap, mientras que `&str` solo es una vista. Saber cuál usar es parte del oficio: si el texto crece o cambia, necesitarás `String`; si solo vas a leer un texto que ya existe, `&str` es más ligero.

:::info Nota
ℹ️ `String` y `&str` son primos: el primero posee y puede crecer, el segundo solo observa una porción de texto ya existente. Convertir uno en el otro es trivial: `&String` se convierte en `&str` de forma automática al pasarlo a una función que espere `&str`.
:::

## 6. Slices y el préstamo

Como los slices son referencias, heredan todas las reglas del préstamo que estudiaste en el capítulo anterior. Mientras un slice `&str` esté vigente, el `String` que lo origina no puede modificarse, porque eso invalidaría la vista que el slice ofrece:

```rust
let mut texto = String::from("hola mundo");
let primer_palabra = &texto[..4];
texto.push_str(" rust"); // ❌ ERROR: texto prestado de forma inmutable
println!("{primer_palabra}");
```

El compilador te dirá que no puedes modificar `texto` mientras exista un préstamo inmutable. Es la misma regla de siempre: quien lee no puede ser interrumpido por quien escribe. Una vez que `primer_palabra` deje de usarse, el préstamo termina y podrás volver a modificar `texto` con tranquilidad.

## Buenas prácticas

- Usa `&str` para parámetros de lectura en vez de `String`: es más flexible y no copia datos.
- Aprovecha los atajos de rango `[..]`, `[n..]` y `[..n]` para escribir menos.
- Verifica mentalmente la longitud de tus datos antes de fijar rangos, y evita `out of bounds`.
- Recuerda que los slices son préstamos: no intentes modificar el dato mientras un slice lo observa.

## Resumen rápido

- Un **slice** es una vista de una porción de datos, sin copiarlos ni poseerlos.
- `&str` es el slice de las cadenas; `&[T]` es el slice de colecciones como arrays y vectores.
- Los rangos `[inicio..fin]` marcan el segmento: el inicio se incluye, el fin no.
- Leer fuera de los límites provoca un pánico controlado, nunca basura de memoria.
- Los literales de cadena (`"texto"`) ya son `&str`, no `String`.
- Un slice sigue las reglas del préstamo: el dato observado no puede cambiar mientras exista.

Con los slices dominas el trío de la memoria de Rust: propiedad, préstamo y vistas. Es momento de dar un salto creativo y empezar a **modelar tus propios tipos de datos**. En el siguiente capítulo aprenderás a definir tus propios `struct` para representar el mundo real en tu código.