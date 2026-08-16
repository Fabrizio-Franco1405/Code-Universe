---
outline: [2, 3]
---

# Cierres y programación funcional

En el proyecto final del capítulo anterior viste cómo organizar tu código en funciones y módulos, pero todas esas funciones tenían un nombre y vivían en un lugar fijo. Rust también te permite crear comportamientos pequeños y anónimos justo donde los necesitas: los **cierres** (closures). Con ellos, tu código se vuelve más expresivo y comienza a acercarse al **estilo funcional**, donde transformar datos es tan natural como encadenar palabras en una oración.

## 1. Funciones que puedes definir al vuelo

Un **cierre** es una función anónima que puedes guardar en una variable y pasar de un lado a otro como cualquier otro valor. Su sintaxis es más ligera que la de una función normal: los parámetros van entre barras verticales `||` y el cuerpo no necesita `return`, porque la última expresión es el valor devuelto.

```rust
let sumar_dos = |numero| numero + 2;
println!("{}", sumar_dos(10)); // 12
```

- `|numero|`: así se declara el parámetro del cierre, sin tipado explícito; el compilador lo infiere a partir del uso.
- `numero + 2`: el cuerpo del cierre; al ser la última expresión, ese valor se devuelve automáticamente.
- `sumar_dos`: una variable común que guarda el cierre, lista para ser llamada como `sumar_dos(10)`.

No te preocupes si no especificas los tipos de los parámetros: el **auditor de seguridad** los deduce por ti en cuanto ve cómo usas el cierre. Esto mantiene el código limpio sin perder la seguridad que ya conoces.

## 2. La captura del entorno

Aquí aparece la gran diferencia con una función normal: los cierres pueden **capturar** variables de su entorno. Una función definida con `fn` solo ve sus propios parámetros; un cierre, en cambio, puede "atrapar" valores de la función que lo rodea. La forma de captura depende de lo que el cierre necesite hacer con la variable:

```rust
let mensaje = String::from("Hola");
let imprimir = || println!("{mensaje}");

imprimir();
println!("{mensaje}"); // sigue disponible
```

- Acá `imprimir` solo **lee** `mensaje`, así que el compilador captura una **referencia inmutable**.
- El préstamo termina cuando el cierre se usa por última vez, por lo que `mensaje` sigue siendo tuya después de llamarlo.

Si el cierre necesita **modificar** el entorno, el compilador captura una **referencia mutable**:

```rust
let mut contador = 0;
let mut incrementar = || {
    contador += 1;
};

incrementar();
incrementar();
println!("{contador}"); // 2
```

- `incrementar` debe declararse `mut` porque altera la variable capturada.
- Mientras el cierre esté vivo, nadie más puede tocar `contador`; recuerda que las reglas de préstamo se aplican igual que siempre.

:::tip
💡 Piensa en la captura como un favor que le haces a un amigo: si solo va a leer, le prestas el documento; si va a anotar, le das el lápiz. El compilador decide qué te conviene prestar según lo que el cierre haga.
:::

## 3. La keyword `move`

A veces no quieres prestar: quieres que el cierre **se convierta en el dueño** de las variables capturadas. Para eso existe la keyword `move`, que fuerza la captura por valor en lugar de por referencia:

```rust
let mensaje = String::from("hola");
let saludo = move || println!("{mensaje}");

saludo();
```

- Con `move`, `mensaje` se mueve al interior del cierre y tú pierdes el acceso a ella.
- Este patrón es esencial cuando el cierre debe viajar a otro hilo, un tema que veremos más adelante en el capítulo de concurrencia.

:::info Nota
ℹ️ Sin `move`, un cierre que se devuelve desde una función o se envía a un hilo podría capturar variables que ya no existen. Forzar la propiedad garantiza que el cierre sea autosuficiente.
:::

## 4. `Fn`, `FnMut` y `FnOnce`: Por qué importan

Los cierres no solo se llaman; también se pasan como argumentos a otras funciones y métodos. Para describir qué tipo de captura hace cada cierre, Rust define tres traits, y según cuál aceptes tendrás más o menos libertad:

- `Fn`: captura por referencia inmutable. Se puede llamar muchas veces y no modifica el entorno.
- `FnMut`: captura por referencia mutable. Puede llamarse varias veces y alterar su estado.
- `FnOnce`: consume los valores capturados y solo puede llamarse una vez, porque "se come" el entorno.

Estos traits funcionan como **bounds** en funciones genéricas. Observa este ejemplo:

```rust
fn aplicar(operacion: impl Fn(i32) -> i32) -> i32 {
    operacion(5)
}

let doble = |x| x * 2;
println!("{}", aplicar(doble)); // 10
```

- `impl Fn(i32) -> i32`: le dice al compilador que `operacion` es un cierre que recibe un `i32` y devuelve otro `i32`.
- El bound `Fn` garantiza que podemos llamar a `operacion` las veces que queramos sin sorpresas.

El compilador elige automáticamente el trait según lo que el cuerpo del cierre haga con las variables capturadas. Esta clasificación es importante porque te permite escribir APIs flexibles: aceptar `Fn` te da el mayor margen, y aceptar `FnOnce` te permite capturar por valor.

:::warning Advertencia
⚠️ Un error frecuente es pedir `Fn` cuando el cierre modifica su entorno. Si el compilador te sugiere `FnMut` o `FnOnce`, escúchalo: está describiendo con precisión lo que tu cierre realmente hace.
:::

## 5. Estilo funcional

Cuando combinas cierres con las herramientas de colecciones, tu código se vuelve declarativo: describes *qué* quieres obtener, no *cómo* recorrer los datos. Este estilo es la puerta de entrada a los **iteradores**, que protagonizan el siguiente capítulo:

```rust
let numeros = vec![1, 2, 3, 4, 5, 6, 7, 8];

let resultado: Vec<i32> = numeros
    .iter()
    .filter(|n| n % 2 == 0)
    .map(|n| n * 2)
    .collect();

println!("{resultado:?}"); // [4, 8, 12, 16]
```

- `filter`: conserva solo los números que cumplen la condición del cierre.
- `map`: transforma cada elemento con el cierre recibido.
- `collect`: reúne el resultado final en un `Vec`.

## Buenas prácticas

- Deja que el compilador infiera los tipos de los parámetros del cierre; el código queda más limpio.
- Usa `move` solo cuando el cierre necesite ser dueño del entorno, como al enviarlo a un hilo.
- Recuerda que `Fn`, `FnMut` y `FnOnce` describen la captura; elige el bound menos restrictivo que tu API necesite.
- Encadena cierres para describir transformaciones de datos en lugar de escribir bucles anidados.

## Resumen rápido

- Un **cierre** es una función anónima con sintaxis `|parámetros| cuerpo`.
- Captura el entorno por **referencia**, **referencia mutable** o **por valor**, según lo que haga.
- `move` fuerza la captura por valor y traspasa la propiedad.
- `Fn`, `FnMut` y `FnOnce` son los traits que describen cómo captura cada cierre.
- El estilo funcional combina cierres para transformar colecciones con claridad.

Con los cierres bajo la manga, es hora de conocer la herramienta que los vuelve realmente poderosos: los **iteradores**, con los que recorrerás y transformarás colecciones enteras con elegancia y sin costo de rendimiento.