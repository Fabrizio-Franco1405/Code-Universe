---
outline: [2, 3]
---

# Definiendo structs

Hasta ahora hemos trabajado con tipos que el lenguaje nos da hechos: enteros, booleanos, tuplas y arrays. Son útiles, pero el mundo real está lleno de entidades con varios datos relacionados entre sí: un usuario tiene nombre, edad y correo; una cuenta bancaria tiene titular, saldo y número. Agrupar esas piezas sueltas en una sola entidad es el siguiente gran paso en tu travesía, y para eso Rust nos ofrece los **structs**.

Un **struct** es un tipo de datos que agrupa varios valores bajo un mismo nombre. En el capítulo anterior viste las tuplas, que también agrupan valores; el struct va un paso más allá porque además **nombra** cada dato. Esa diferencia de nombrar las partes convierte código confuso en código que se lee solo.

## 1. El struct como molde

Piensa en un struct como una **plantilla** o **molde**: define qué campos tendrá toda entidad de ese tipo, pero no es una entidad en sí. Es como el molde de una galleta, que define la forma de todas las galletas pero no es una galleta. Cuando quieres una entidad concreta, "sacas" una instancia del molde con sus valores particulares.

La ventaja frente a las tuplas es que los campos tienen nombre. En una tupla, saber si el segundo valor es la edad o el peso depende de la memoria. En un struct, cada campo se presenta con su etiqueta, así que la intención queda escrita en el propio código.

## 2. Definiendo un struct

La sintaxis comienza con la palabra clave `struct`, seguida del nombre del tipo y un bloque de campos. Cada campo se declara con su nombre y su tipo, separados por dos puntos:

```rust
struct Usuario {
    nombre: String,
    edad: u8,
    activo: bool,
}
```

- `struct Usuario`: declara un nuevo tipo llamado `Usuario`.
- `nombre: String`: el campo `nombre`, de tipo `String`.
- `edad: u8`: el campo `edad`, de tipo `u8` (un entero pequeño que sobra para una edad).
- `activo: bool`: el campo `activo`, que indica si la cuenta está en uso.

Acá hay un detalle interesante: el struct solo **declara** qué campos existirán, pero no les asigna ningún valor. Es el molde vacío. Los valores llegan cuando creamos una instancia.

## 3. Creando instancias

Para crear una instancia del struct, escribimos el nombre del tipo seguido de llaves con cada campo y su valor. El orden de los campos no importa, gracias a que cada uno lleva su nombre:

```rust
let usuario = Usuario {
    nombre: String::from("Ana"),
    edad: 25,
    activo: true,
};
```

Cada campo se asigna con su etiqueta, como llenando un formulario. Una vez creada, para leer o modificar un campo usamos el **punto** (`.`), que se lee como "de": `usuario.nombre` significa "el nombre de usuario".

```rust
println!("{} tiene {} años", usuario.nombre, usuario.edad);
```

Observa que la variable `usuario` se declara con `let`, sin `mut`. Eso significa que sus campos son de solo lectura. Si intentas cambiar `usuario.edad`, el compilador te lo impedirá.

## 4. Mutabilidad de los campos

En Rust, la mutabilidad es una propiedad de la **variable completa**, no de campos individuales. No puedes declarar "este campo es mutable y este otro no": o la instancia es mutable (con `mut`) o no lo es. Para poder modificar cualquier campo, debes crear la instancia con `mut`:

```rust
let mut usuario = Usuario {
    nombre: String::from("Ana"),
    edad: 25,
    activo: true,
};

usuario.edad = 26;       // ✅ permitido: la instancia es mutable
usuario.activo = false;  // ✅ también permitido
```

Esto es distinto a otros lenguajes donde cada atributo define su propio acceso. Acá el lenguaje simplifica: toda la instancia es mutable o inmutable, y el compilador se encarga de recordártelo si lo olvidas.

## 5. Atajos al construir: field init shorthand

Cuando el nombre de un campo coincide con el nombre de la variable que guarda su valor, no necesitas repetirlo dos veces. Este atajo se llama **field init shorthand** y reduce el ruido en tu código:

```rust
let nombre = String::from("Luis");
let edad = 30;

let usuario = Usuario {
    nombre, // es lo mismo que nombre: nombre
    edad,
    activo: true,
};
```

- `nombre` y `edad` son las variables existentes.
- Al escribirlas a secas dentro del struct, Rust interpreta que el campo se llama igual que la variable.
- Solo los campos que coinciden con variables usan el atajo; el resto se escribe con su `campo: valor` normal.

:::tip
💡 El *field init shorthand* es tan común que lo verás por todas partes en proyectos reales de Rust. Ahorra escribir dos veces el mismo nombre y hace que las estructuras largas se lean mucho más rápido.
:::

## 6. El resto de los campos: struct update syntax

A veces quieres crear una instancia nueva pero casi igual a una que ya existe. Copiar campo por campo sería tedioso; Rust ofrece la **struct update syntax** con `..`, que llena los campos restantes con los valores de otra instancia:

```rust
let original = Usuario {
    nombre: String::from("Ana"),
    edad: 25,
    activo: true,
};

let copia = Usuario {
    edad: 40,     // solo cambiamos la edad
    ..original    // el resto se copia de original
};
```

`copia` tendrá el mismo nombre y el mismo estado de `original`, pero con `edad` actualizada a `40`. El operador `..` debe ir al final, porque indica "todo lo que falta, tómalo de acá".

:::warning Advertencia
⚠️ Los campos que son `String` (o cualquier tipo del heap) se **mueven** al usar `..`, no se copian. Después de crear `copia`, `original.nombre` ya no será válido porque su propiedad pasó a la nueva instancia. Si quieres conservar ambos, usa `.clone()` en los campos que te importen.
:::

## 7. Tuple structs y unit structs

No todos los structs necesitan campos con nombre. Rust ofrece dos variantes más ligeras:

- **Tuple struct**: es un struct cuyos campos se declaran como una tupla, sin nombres. Útil cuando quieres crear un tipo nuevo a partir de una tupla, como `struct Color(i32, i32, i32)`. Se instancia con `Color(255, 0, 0)` y se accede con `.0`, `.1`, `.2`.
- **Unit struct**: es un struct sin ningún campo, como `struct Marca;`. Se usa raramente, sobre todo para marcadores o estados, porque no almacena datos.

Los tuple structs son cómodos cuando el significado de cada posición es evidente por contexto. Si necesitas más claridad o campos que cambian, el struct clásico con nombres siempre será la opción más legible.

## Buenas prácticas

- Usa **structs con nombres** para representar entidades con varios datos relacionados.
- Nombra los structs con mayúscula inicial (`Usuario`, `CuentaBancaria`) y los campos en minúscula.
- Aprovecha el *field init shorthand* cuando nombres y variables coincidan.
- Declara `mut` solo cuando de verdad vayas a modificar la instancia.
- Recuerda que `..` mueve los campos del heap: clona si necesitas conservar el original.

## Resumen rápido

- Un **struct** agrupa datos relacionados bajo un tipo con nombre, como un molde.
- Se define con `struct Nombre { campo: tipo, ... }`.
- Se instancia con llaves y se accede con el punto: `usuario.edad`.
- La mutabilidad se declara en la instancia completa con `mut`.
- El *field init shorthand* omite nombres repetidos; `..` copia los campos restantes.
- Los tuple structs usan tuplas sin nombres; los unit structs no guardan nada.

Ya sabes modelar tus propios tipos. Ahora veamos cómo estos conocimientos se combinan en un programa real: en el siguiente capítulo construiremos un ejemplo completo que usa un struct para resolver un problema de la vida cotidiana.