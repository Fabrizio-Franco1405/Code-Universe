---
outline: [2, 3]
---

# Referencias y Préstamos

En el capítulo anterior vimos que los datos que viven en el heap se **mueven** cuando los asignas o los pasas a una función. Eso garantiza la seguridad de la memoria, pero también es incómodo: ¿qué pasa si varias partes de tu programa necesitan leer el mismo dato sin quedarse con él? Moverlo a cada lugar sería un desastre. La solución de Rust son las **referencias**, que funcionan como un préstamo: puedes usar algo que no es tuyo, con la promesa de devolverlo en buen estado.

Piensa en una biblioteca: los libros no se regalan, se **prestan**. Quien pide prestado puede leerlos y trabajar con ellos, pero debe respetar las reglas de la biblioteca. En Rust, el préstamo tiene reglas tan estrictas que el compilador las hace cumplir antes de que tu programa siquiera se ejecute.

## 1. El problema de moverlo todo

Retomemos el ejemplo de la función del capítulo anterior: si queremos calcular el largo de una `String` sin quedárnosla, moverla dentro de la función nos dejaría sin poder usarla después.

```rust
fn calcular_largo(texto: String) -> usize {
    texto.len()
}

let saludo = String::from("hola");
let largo = calcular_largo(saludo);
// saludo ya no es válida aquí: se movió a la función
```

Funciona, pero es una pérdida: movimos un dato enorme para solo leerlo. Lo que necesitamos es la posibilidad de **mirar sin tocar**. Ahí entran las referencias.

## 2. Referencias inmutables (`&`)

Una **referencia inmutable** se escribe con el símbolo `&` y te permite acceder a un valor sin ser su dueño. Es como anotar la dirección de una casa en un papel: el papel no es la casa, solo te dice dónde está. Mientras exista la referencia, el valor sigue siendo propiedad de su variable original.

```rust
fn calcular_largo(texto: &String) -> usize {
    texto.len()
}

let saludo = String::from("hola");
let largo = calcular_largo(&saludo);
println!("{saludo} tiene {largo} caracteres"); // saludo sigue siendo válida
```

Observa la diferencia: la función recibe `&String`, es decir, un préstamo del valor, no el valor mismo. En la llamada escribimos `&saludo` para indicar "te presto mi dato". Cuando la función termina, el préstamo se devuelve y `saludo` sigue disponible para quien la pidió prestada. La propiedad nunca cambia de manos.

Algo importante: como es un préstamo, la función no puede destruir el valor ni alterarlo. Solo puede leerlo. Si intenta modificar el contenido, el compilador lo rechazará.

## 3. Referencias mutables (`&mut`)

¿Y si necesitas que la función pueda **modificar** el dato prestado? Para eso existen las referencias mutables, escritas como `&mut`. Con ellas, quien recibe el préstamo puede cambiar el valor, pero el préstamo es mucho más restrictivo: solo puede existir uno a la vez.

```rust
fn agregar_signo(texto: &mut String) {
    texto.push_str("!");
}

let mut saludo = String::from("hola");
agregar_signo(&mut saludo);
println!("{saludo}"); // hola!
```

Acá `saludo` debe declararse con `mut` porque vamos a prestarla de forma mutable. La función recibe `&mut String`, modifica el texto añadiendo un signo de exclamación, y al terminar el préstamo, `saludo` ya contiene el texto cambiado. La regla de "un solo dueño" sigue intacta: la propiedad siguió siendo de `saludo` en todo momento.

:::info Nota
ℹ️ La variable original necesita la palabra clave `mut` para prestar el dato de forma mutable. No puedes crear una `&mut` de una variable que declaraste sin `mut`: el compilador te pedirá que la marques explícitamente.
:::

## 4. Las reglas del préstamo

Las reglas del préstamo son el corazón de este capítulo, y son tan sencillas de enunciar como estrictas de cumplir:

- Puedes tener **tantas referencias inmutables como quieras** al mismo tiempo.
- Puedes tener **solo una referencia mutable** a la vez.
- **Nunca** puedes mezclar referencias inmutables y mutables al mismo tiempo.

La lógica es simple: leer un dato entre varios mientras nadie lo modifica es seguro, como varios lectores compartiendo un periódico. Pero si alguien lo está editando mientras otros leen, la información se vuelve contradictoria. Rust no permite esa situación en tiempo de compilación, así que jamás llegarás a experimentarla en tiempo de ejecución.

```rust
let mut texto = String::from("rust");

let r1 = &texto;  // ✅ inmutable
let r2 = &texto;  // ✅ otra inmutable, permitido
println!("{r1} {r2}");

let r3 = &mut texto; // ✅ ahora sí: las inmutables ya terminaron
r3.push_str("!");
```

## 5. El error del doble préstamo mutable

Para que veas al auditor en acción, intentemos violar la regla de la única referencia mutable. El siguiente código parece inofensivo, pero el compilador lo rechazará con un mensaje inconfundible:

```rust
let mut numero = 42;

let ref_a = &mut numero; // préstamo mutable #1
let ref_b = &mut numero; // ❌ ERROR: ya existe un préstamo mutable

ref_a += 1;
println!("{ref_b}");
```

El error que recibirás dice algo como `cannot borrow numero as mutable more than once at a time`. El compilador te está avisando de que dos variables pretenden tener control exclusivo sobre el mismo dato a la vez, algo que simplemente no está permitido.

¿Por qué tanta rigidez? Porque si ambas referencias pudieran escribir, el programa dependería del orden de ejecución y sería propenso a errores sutiles difíciles de rastrear. Con una sola referencia mutable, Rust elimina toda una categoría de bugs por diseño.

:::warning Advertencia
⚠️ La solución a este error **no** es ignorar la regla, sino limitar la vida de cada préstamo. Si separas los usos en bloques distintos o haces que el primer préstamo termine antes de empezar el segundo, el código compila sin problemas.
:::

## 6. Referencias colgantes (dangling)

Rust también te protege de las **referencias colgantes**: referencias que apuntan a memoria que ya se liberó. Imagina que alguien te presta un libro y, antes de que lo devuelvas, el dueño lo vende. Tu nota con la dirección ahora apunta a una casa vacía. Eso es un *dangling pointer*, y en otros lenguajes causa fallos misteriosos.

En Rust, si intentas devolver una referencia a un dato que se creó dentro de la función y ya murió, el compilador lo detecta al instante:

```rust
fn referencia_peligrosa() -> &String {
    let texto = String::from("fantasma");
    &texto // ❌ ERROR: texto se destruye al salir del alcance
}
```

El error te dirá que `texto` no vive lo suficiente. La referencia no puede sobrevivir a su dueño: es como un préstamo que no puede durar más que la vida del prestamista. El lenguaje garantiza que esto nunca ocurra, de modo que no necesitas preocuparte por punteros colgantes mientras sigas sus reglas.

:::tip
💡 Si una función necesita crear un dato y devolverlo, devuelve el valor completo (moviéndolo) en lugar de una referencia. Mover es seguro y el compilador te lo agradecerá.
:::

## Buenas prácticas

- Usa referencias **inmutables** siempre que solo necesites leer: son baratas y puedes tener muchas.
- Reserva `&mut` para cuando de verdad necesites modificar el dato prestado.
- Mantén los préstamos con la vida más corta posible; termina un préstamo antes de empezar otro.
- Cuando una función reciba un dato solo para leerlo, pide `&String` en lugar de `String`.

## Resumen rápido

- Una referencia (`&`) es un **préstamo**: lee sin apropiarse.
- Una referencia mutable (`&mut`) permite modificar, pero solo puede existir una a la vez.
- Reglas del préstamo: N inmutables, o 1 mutable, nunca ambas mezcladas.
- El compilador rechaza dobles préstamos mutables y referencias colgantes en tiempo de compilación.
- Las referencias no toman la propiedad: al terminar, el valor sigue siendo del dueño original.

Ahora que sabes prestar datos, hay un caso especial muy poderoso: cuando solo te interesa una **porción** de un dato. En el siguiente capítulo descubrirás los slices, la forma segura y eficiente de apuntar a un pedazo de una colección sin copiarla.