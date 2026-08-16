---
outline: [2, 3]
---

# Lifetimes: Validando referencias

Ya conoces el ownership y las referencias: el primer capítulo de esta parte te enseñó a generalizar tipos y el segundo a exigir contratos con traits. Pero queda un problema por resolver: cuando pasas una referencia de un lado a otro, ¿quién garantiza que el dato al que apunta siga vivo? Esa es exactamente la misión de los **lifetimes** (tiempos de vida).

No te preocupes si el nombre suena intimidante. La idea detrás es de lo más humana: una referencia **no puede vivir más que el dato al que apunta**. Los lifetimes son la forma en que Rust hace que esta regla sea verificable en tiempo de compilación, y por eso son el pilar que completa la tríada de la seguridad de memoria.

## 1. El problema: Referencias que apuntan a la nada

Imagina que pides prestado un libro de la biblioteca y alguien lo devuelve mientras tú aún lo lees. Tu préstamo quedaría colgado: apuntarías a algo que ya no existe. En programación esto se llama **referencia colgante** (*dangling reference*), y es uno de los errores de memoria más peligrosos que existen en lenguajes como C o C++.

```rust
fn colgar() -> &String {
    let texto = String::from("adiós");
    &texto
}
```

- `fn colgar() -> &String`: Promete devolver una referencia a un `String`.
- `texto`: Se crea dentro de la función.
- `&texto`: Se intenta devolver... pero `texto` se destruye al salir de la función.

En C o C++, este código compila y luego explota cuando el programa toca una dirección de memoria que ya no le pertenece. En Rust, el compilador lo **rechaza directamente** en tiempo de compilación, sin darte la oportunidad de sufrir. Ese rechazo es el precio de la tranquilidad: la **detección temprana** que el lenguaje prometió en la visión general.

## 2. La anotación `'a`: Etiquetando el tiempo de vida

Para que el compilador pueda razonar sobre cuánto vive una referencia, a veces necesita que le ayudes con **anotaciones de lifetime**. Se escriben con un apóstrofo y una letra: `'a`, `'b`, y así sucesivamente. La `'a` no tiene ningún significado oculto: es solo una etiqueta que une dos referencias para decir "estas dos viven lo mismo".

Observa la función que toma dos textos y devuelve el más largo:

```rust
fn texto_mas_largo<'a>(primero: &'a str, segundo: &'a str) -> &'a str {
    if primero.len() > segundo.len() {
        primero
    } else {
        segundo
    }
}
```

- `<'a>`: Declara el lifetime genérico, igual que se declara un tipo genérico `T`.
- `primero: &'a str` y `segundo: &'a str`: Ambas referencias llevan la misma etiqueta `'a`.
- `-> &'a str`: El resultado también vive `'a`, es decir, es una referencia a uno de los dos textos de entrada.

La etiqueta `'a` une los tres elementos en un mismo contrato: si las entradas viven un cierto tiempo, la salida vive ese mismo tiempo. El compilador verifica en cada llamada concreta que esto se cumpla, garantizando que nunca devolverás una referencia muerta.

## 3. ¿Qué está diciendo realmente el compilador?

Cuando usas `texto_mas_largo`, el compilador comprueba en el punto de llamada que la referencia devuelta no sobrevive a ninguno de los dos textos que le pasaste. Si intentaras devolver un `String` creado dentro de la función, el compilador sabría que ese valor muere al salir y te lo prohibiría, porque la etiqueta `'a` lo delataría.

La anotación no *cambia* cuánto vive un dato: ese dato vive según las reglas normales del ownership. El lifetime solo *describe* esa relación para que el auditor de seguridad pueda validarla. Por eso se dice que los lifetimes son una herramienta de verificación, no de control. Un lifetime más largo no hace que un dato viva más: solo dice que la referencia puede seguir en uso durante ese tiempo.

## 4. Elisión de lifetimes: El compilador te perdona

¿Te preocupa anotar lifetimes en cada función? Tranquilo: Rust tiene un mecanismo llamado **elisión** que inserta los lifetimes por ti en la mayoría de los casos. Las reglas son sencillas: si una función recibe una o más referencias y devuelve una, el compilador asume que la devuelta tiene el mismo lifetime que la primera referencia recibida.

```rust
fn primer_elemento(lista: &[String]) -> &str {
    &lista[0]
}
```

- No hay ninguna anotación `'a`, y sin embargo compila.
- La regla de elisión deduce que la salida vive tanto como `lista`.
- Verás elisión aplicada en la mayoría de las funciones de la biblioteca estándar.

No te preocupes si no memorizas las reglas de la elisión. La intuición es la correcta: si una función recibe referencias y devuelve una, lo más razonable es que la salida esté ligada a alguna entrada. El compilador usa el sentido común y solo te pedirá anotar cuando haya ambigüedad real.

:::tip
💡 Si el compilador te pide anotar lifetimes, casi siempre es porque tu función devuelve una referencia que podría venir de más de una fuente. Unir las entradas con `'a` y la salida con la misma `'a` resuelve la mayoría de los casos.
:::

## 5. Lifetimes en `structs`

Los `structs` también pueden guardar referencias, y cuando lo hacen deben declarar sus lifetimes. Esto tiene todo el sentido: si tu estructura contiene una referencia a un dato externo, debe garantizar que ese dato siga vivo mientras la estructura exista.

```rust
struct Fragmento<'a> {
    contenido: &'a str,
}

fn main() {
    let frase = String::from("Rust es genial");
    let parte = Fragmento { contenido: &frase[0..4] };
    println!("{}", parte.contenido);
}
```

- `struct Fragmento<'a>`: Declara que el `struct` tiene un lifetime asociado.
- `contenido: &'a str`: El campo guarda una referencia con ese lifetime.
- `let parte = Fragmento { ... }`: Mientras `frase` esté viva, `parte` puede usarse; si `frase` se destruyera antes, el compilador lo prohibiría.

La regla de oro se mantiene intacta: una referencia **no puede vivir más que su dato**. Si tu `struct` guarda una referencia, el dato referenciado debe sobrevivir a la estructura, y el lifetime es la prueba que el compilador exige.

:::warning Advertencia
⚠️ Un `struct` con referencias tiene un lifetime en su declaración (`Fragmento<'a>`), y ese lifetime suele aparecer en cada `impl` que escribas para él. Si lo olvidas, el compilador te lo recordará con un error claro, así que no temas equivocarte.
:::

## 6. `'static`: La referencia eterna

Existe un lifetime especial llamado `'static`, que indica que la referencia vive durante **todo el programa**. Se usa, por ejemplo, con los literales de texto, que van grabados directamente en el binario y existen desde que el programa arranca hasta que termina.

```rust
let saludo: &'static str = "Hola, mundo";
```

- `&'static str`: Una referencia a texto que vive para siempre.
- `"Hola, mundo"`: Es un literal, incrustado en el ejecutable, por eso puede vivir `'static`.

:::danger
⚠️ **No confundas `'static` con "una referencia larga"**: significa literalmente "toda la vida del programa". Si intentas usar `'static` en una referencia a datos que podrían morir antes, el compilador te rechazará. Muchos principiantes la usan como parche sin entenderla; úsala solo cuando el dato realmente viva siempre.
:::

## Buenas prácticas

- Piensa en los lifetimes como etiquetas que **describen** relaciones, no como controles que alargan la vida de los datos.
- Confía en la **elisión** para la mayoría de tus funciones y anota solo cuando el compilador lo exija.
- En `structs` con referencias, declara el lifetime una vez y úsalo consistentemente en campos e `impl`.
- Reserva `'static` para datos que genuinamente viven todo el programa, como los literales de texto.

## Resumen rápido

- Un **lifetime** garantiza que una referencia no sobreviva al dato al que apunta.
- Se anota con `'a`, `'b`, etc., para **unir** el tiempo de vida de entradas y salidas.
- La **elisión** inserta los lifetimes automáticamente en la mayoría de los casos.
- Los `structs` que guardan referencias declaran lifetimes, y sus datos deben sobrevivir a la estructura.
- `'static` indica que la referencia vive durante todo el programa.

Con esto completas la tríada de la seguridad de memoria: ownership, borrows y lifetimes trabajando juntos. Has cubierto lo esencial de la abstracción y ahora es hora de un tema que te tocará a diario: en el próximo capítulo aprenderás a **manejar los errores** con elegancia, desde los pánicos hasta el todopoderoso `Result`.