---
outline: [2, 3]
---

# Use: Acortando el camino

En el capítulo anterior aprendiste a navegar por el árbol de módulos con rutas absolutas y relativas. Pero hay un problema evidente: escribir `crate::ventas::descuentos::calcular_descuento()` cada vez que necesitas la función es tan cansado como repetir una dirección completa en cada llamada. Para eso existe `use`, la palabra clave que acorta los caminos de una vez por todas.

`use` crea un **atajo** dentro del módulo actual: le dice al compilador "cuando diga este nombre corto, me refiero a esta ruta larga". Es como colocar un letrero en la entrada de tu oficina que diga "descuentos a la vuelta de la esquina". Una vez definido el atajo, escribes el nombre sin la ruta completa.

## 1. La forma básica de `use`

Para importar un item, escribes `use` seguido de la ruta completa al elemento:

```rust
mod ventas {
    pub mod descuentos {
        pub fn calcular_descuento(precio: f64) -> f64 {
            precio * 0.9
        }
    }
}

use crate::ventas::descuentos::calcular_descuento;

fn main() {
    let total = calcular_descuento(100.0);
    println!("{total}");
}
```

- `use crate::ventas::descuentos::calcular_descuento;`: importa la función en el ámbito actual.
- `calcular_descuento(100.0)`: a partir de ahora se usa el nombre corto.
- El `use` afecta solo al módulo donde se declara, como un atajo personal.

Convencionalmente, los `use` se colocan al inicio del archivo, para que cualquiera vea de un vistazo qué importa el código. La costumbre hace que el archivo se lea como una lista de "ingredientes" antes de entrar a la receta.

:::tip
💡 La mayoría de editores modernos (rust-analyzer) insertan y organizan los `use` por ti. No pierdas tiempo escribiéndolos a mano: acostúmbrate a pedir el auto-import al escribir un nombre.
:::

## 2. Importando funciones y structs

La regla más elegante de Rust es que **los structs, enums y otros items se importan por su nombre**, nunca por su ruta de módulo padre. Compara los dos estilos:

```rust
use std::collections::HashMap;   // importar el struct por su nombre

fn main() {
    let mut edades = HashMap::new();
    edades.insert("Ana", 30);
}
```

- `use std::collections::HashMap;`: trae el struct `HashMap` directamente.
- Después, `HashMap::new()` se usa sin recordar su módulo original.
- Importar el tipo por su nombre hace que el código se lea natural, sin ruido.

Esta convención se aplica a nivel de la comunidad y es una de las primeras cosas que notarás al leer código de Rust profesional. Los `use` que importan `struct` o `enum` rara vez usan alias: el nombre real ya es lo bastante claro.

## 3. Alias con `as`

¿Qué pasa si dos elementos importados tienen el mismo nombre? Rust te deja renombrar un import con la palabra clave `as`:

```rust
use std::io::Result as ResultadoIo;
use std::fmt::Result as ResultadoFormato;

fn main() {
    // ResultadoIo y ResultadoFormato conviven sin conflicto
}
```

- `as`: crea un nombre nuevo local para el item importado.
- Es como poner una etiqueta distinta a dos cajas con el mismo contenido.
- El alias solo existe dentro del módulo donde se declara el `use`.

Los alias son útiles también para dar nombres más cortos o más descriptivos en tu código, aunque la comunidad reserva el `as` sobre todo para resolver conflictos o para reexportar con nombres amigables.

:::info Nota
ℹ️ Además de resolver colisiones, `as` permite **reexportar** items con otro nombre: `pub use ruta::Item as NuevoNombre;` hace que el item esté disponible públicamente con ese nuevo nombre, una técnica habitual para diseñar la API de tus librerías.
:::

## 4. Importar glob con `*`

Cuando quieres traer **todo** lo que un módulo expone, existe el import global o glob, que usa el símbolo `*`:

```rust
use std::collections::*;

fn main() {
    let lista: Vec<i32> = Vec::new();
    let pares: HashMap<String, i32> = HashMap::new();
}
```

- `use std::collections::*;`: importa todos los items públicos de ese módulo.
- `Vec` y `HashMap` quedan disponibles sin escribir sus rutas.
- Es la opción más rápida de escribir... y la más peligrosa de abusar.

Un glob introduce **todo** en tu ámbito, incluido lo que no necesitas, y aumenta el riesgo de colisiones de nombres. Es una herramienta de conveniencia, no de organización.

:::warning Advertencia
⚠️ Abusar del glob `*` hace tu código menos legible: quien lo lee no sabe de dónde viene cada nombre. Úsalo con moderación (por ejemplo, para importar un preludio propio) y nunca como atajo generalizado.
:::

## 5. Buenas prácticas de imports

El estilo de imports en Rust es consistente y ordenado. Algunas normas que verás en todo código profesional:

- Los `use` van **al inicio del archivo**, agrupados y sin líneas de más.
- Se importan structs, enums y funciones por su **nombre**, no por su ruta.
- `as` se reserva para resolver **conflictos** o crear nombres más claros.
- El glob `*` se usa con moderación y solo cuando aporta de verdad.
- Si varios items comparten ruta, puedes anidarlos: `use std::collections::{HashMap, VecDeque};`.

## Resumen rápido

- `use ruta::item;` importa un item al ámbito actual.
- `use ruta::Item as Alias;` importa con un nombre alternativo.
- `use ruta::*;` importa todo lo público del módulo (glob).
- Los `use` se agrupan al inicio del archivo.
- Importa tipos por su nombre y reserva el glob para casos puntuales.

Con `use` dominado, tus archivos se leerán como listas claras de dependencias. En el siguiente capítulo veremos el último paso de la organización: separar cada módulo en su propio archivo para que la casa deje de ser un único bloque de texto y se convierta en una estructura de carpetas real.