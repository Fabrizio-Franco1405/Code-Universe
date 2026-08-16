---
outline: [2, 3]
---

# El tipo String y UTF-8

En el capítulo anterior dominaste los vectores, listas de datos del mismo tipo. Ahora subimos la apuesta con un tipo que parece sencillo y esconde una complejidad fascinante: el texto. Todos usamos cadenas en la mayoría de programas, pero en Rust el `String` funciona de una manera distinta a la que quizá esperas, y entenderla te evitará más de un susto.

La clave está en que el texto, para Rust, no es una secuencia de "letras" sino un **buffer de bytes en UTF-8**. Cada carácter ocupa un número variable de bytes según su idioma y símbolo. Por eso las operaciones que en otros lenguajes son triviales aquí exigen cierta precisión, algo que encaja a la perfección con la filosofía del lenguaje: rigor desde el inicio.

## 1. `String` vs `&str`

Antes de manipular texto conviene distinguir los dos tipos de cadena de Rust:

- **`String`**: una cadena **propietaria** y **mutable**, que puede crecer o encogerse. Vive en el heap, como un vector de bytes.
- **`&str`**: una **vista** (slice) de una cadena, inmutable y sin propiedad. Piensa en ella como una ventana que mira un texto que pertenece a otro lugar.

```rust
let nombre = String::from("Ada");   // String propietaria
let vista: &str = &nombre;           // vista inmutable del texto
let literal = "Ada";                 // un &str literal, incrustado en el binario
```

- `String::from("...")`: convierte un literal en una `String` propietaria.
- `"..."`: en el código es un `&str` literal, no una `String`.
- Una vista `&str` no posee el texto: solo lo observa.

Esta distinción es análoga a la de `Vec<T>` y su slice `&[T]` que conociste al hablar de memoria: un dueño que puede cambiar de tamaño y una ventana prestada que no puede.

:::info Nota
ℹ️ Los literales `"..."` son `&str` porque el compilador puede incrustarlos en el binario, sin necesidad de gestión de memoria. Solo cuando necesitas una cadena que cambia de tamaño recurres a `String`.
:::

## 2. Creciendo con `push_str` y `push`

Una `String` puede crecer en tiempo de ejecución. Para añadir un texto completo se usa `push_str`, y para un solo carácter, `push`:

```rust
let mut mensaje = String::from("Hola");
mensaje.push_str(", mundo");
mensaje.push('!');
println!("{mensaje}"); // Hola, mundo!
```

- `push_str("...")`: añade un `&str` completo al final, sin consumirlo.
- `push('!')`: añade un único `char`.
- Ambos necesitan `mut`, porque modifican la cadena en el sitio.

Fíjate en que `push_str` recibe una vista prestada: después de llamarlo, el argumento sigue disponible. Es una operación de **préstamo**, no de movimiento, en línea con lo que aprendiste en la parte de ownership.

## 3. Concatenando con `+` y `format!`

Para unir cadenas existen dos caminos. El operador `+` es directo pero exige cuidado con la propiedad:

```rust
let saludo = String::from("Hola, ");
let nombre = String::from("Ana");
let completo = saludo + &nombre; // saludo se consume
```

- `saludo + &nombre`: toma `saludo` por **propiedad** (la consume) y añade `&nombre` como vista.
- El resultado es una nueva `String`: `completo` = "Hola, Ana".
- Tras la operación, `saludo` ya no existe; solo se puede usar `&nombre`.

La forma más cómoda y flexible de construir texto es la macro `format!`, que no consume nada y admite tantos fragmentos como quieras:

```rust
let nombre = "Ana";
let edad = 30;
let perfil = format!("{nombre}, {edad} años");
```

- `format!`: devuelve una `String` nueva con el texto combinado.
- Acepta cualquier cantidad de argumentos y mezcla tipos sin esfuerzo.
- No consume sus argumentos: todos siguen disponibles después.

:::tip
💡 Usa `format!` como tu herramienta por defecto para construir textos. Es más legible que encadenar `+` y evita los dolores de cabeza de la propiedad en las concatenaciones largas.
:::

## 4. Índices por bytes, no por caracteres

Aquí llega la sorpresa: **no puedes indexar un `String` con corchetes**. Intenta lo siguiente y el compilador lo rechazará:

```rust
let texto = String::from("hola");
// let letra = texto[0]; // ERROR: no se indexa por índice de bytes
```

La razón es que los índices en Rust se cuentan en **bytes**, no en caracteres. En UTF-8, un carácter como "ñ" o un emoji ocupa varios bytes, así que `texto[0]` no siempre caería en el inicio de un carácter completo. Indexar a ciegas podría partir un carácter por la mitad y producir texto corrupto.

En cambio, las operaciones que sí están permitidas son las que devuelven **slices** o **recorridos**:

```rust
let texto = String::from("hola");
let vista = &texto[0..2]; // "ho"
```

- `&texto[0..2]`: devuelve una vista `&str` con los **bytes** del 0 al 2.
- El slice es seguro porque Rust verifica que los límites caigan en fronteras de carácter.
- Si eliges un límite incorrecto, el programa entra en pánico en lugar de corromper texto.

:::warning Advertencia
⚠️ La notación `texto[índice]` no existe para cadenas. Y cuidado con los slices: `&texto[0..1]` sobre "ñ" reventaría en runtime, porque partirías un carácter multibyte. Siempre recorta en fronteras seguras.
:::

## 5. Recorriendo caracteres con `chars`

Cuando necesitas trabajar con las letras reales del texto, la solución es recorrer los caracteres con el método `chars`:

```rust
let texto = String::from("café");
for letra in texto.chars() {
    println!("{letra}");
}
```

- `chars()`: devuelve un iterador de `char`, uno por carácter real.
- "café" recorre como `c`, `a`, `f`, `é` — cuatro caracteres, aunque la "é" ocupe dos bytes.
- No importa el idioma ni los emojis: `chars()` respeta siempre el carácter completo.

Esta es la manera idiomática de operar sobre el contenido textual real de una cadena, en lugar de sobre sus bytes crudos. Para la mayoría de tareas de texto, `chars()` es exactamente lo que necesitas. Y si tu programa maneja acentos, ñ o emojis, recuerda siempre contar en caracteres y no en bytes: confundir ambos es una fuente clásica de bugs sutiles en software multilingüe.

## Buenas prácticas

- Usa `String` para texto que cambia y `&str` para vistas inmutables.
- Construye textos con `format!` en lugar de encadenar `+`.
- No intentes indexar cadenas con corchetes: usa `chars()` para caracteres.
- Recorta con slices solo en fronteras de carácter seguras.
- Piensa en UTF-8: la longitud en bytes casi nunca es la longitud en caracteres.

## Resumen rápido

- `String` es un buffer UTF-8 propietario y mutable; `&str` es una vista inmutable.
- `push_str` añade texto; `push` añade un `char`.
- `+` consume el operando izquierdo; `format!` no consume nada.
- Los índices de cadena cuentan **bytes**, por eso no se indexa con corchetes.
- `chars()` recorre los caracteres reales, respetando el UTF-8.
- Los slices de cadena son seguros solo en fronteras de carácter.

El texto ya no tiene secretos para ti. En el siguiente capítulo cerrarás la tríada de colecciones con el **HashMap**, un diccionario que guarda pares de claves y valores, ideal para buscar datos por nombre en lugar de por posición.