---
outline: [2, 3]
---

# HashMap: pares de claves y valores

En los dos capítulos anteriores trabajaste con colecciones que organizan los datos en secuencia: un vector guarda valores en orden y un `String` guarda texto. Pero muchas veces lo que necesitas no es una lista, sino un **diccionario**: buscar un valor por una clave, como buscar una palabra en un diccionario real o un contacto en tu agenda por su nombre.

Para eso existe el **`HashMap<K, V>`**, la colección que asocia una clave `K` con un valor `V`. Guardar un dato con una clave y recuperarlo por esa misma clave es su operación por excelencia. En este capítulo aprenderás a crearlo, llenarlo, consultarlo y actualizarlo con elegancia.

## 1. Creando un HashMap

`HashMap` vive en la biblioteca estándar y no se crea con una macro propia, sino con `HashMap::new()`. Recuerda importarlo con `use`:

```rust
use std::collections::HashMap;

let mut edades = HashMap::new();
edades.insert(String::from("Ana"), 30);
edades.insert(String::from("Luis"), 28);
```

- `use std::collections::HashMap;`: importa el tipo desde la estándar.
- `HashMap::new()`: crea un diccionario vacío.
- `insert(clave, valor)`: añade un par clave-valor; necesita `mut` porque modifica el mapa.

El compilador infiere los tipos `K` y `V` de los valores que insertas: en el ejemplo, `String` y `i32`. También puedes declarar el tipo explícitamente cuando lo necesites: `HashMap<String, i32>`. Ojo con un detalle: a diferencia de los vectores, el `HashMap` no preserva el orden de inserción. Si tu lógica depende del orden de los datos, mejor usa un vector; el diccionario prioriza la velocidad de búsqueda, no el orden.

## 2. Leyendo con `get`

Para recuperar un valor se usa `get`, que devuelve un `Option<&V>`: `Some` si la clave existe, `None` si no. Es la misma filosofía segura que viste en los vectores.

```rust
use std::collections::HashMap;

let mut edades = HashMap::new();
edades.insert(String::from("Ana"), 30);

match edades.get("Ana") {
    Some(edad) => println!("Ana tiene {edad} años"),
    None => println!("No encontramos a Ana"),
}
```

- `get("Ana")`: busca la clave y devuelve `Option<&i32>`.
- `Some(edad)`: la clave existe y `edad` es una referencia al valor.
- `None`: la clave no está; tu código decide cómo responder.

Puedes comprobar si una clave existe con `contains_key`, pero en general `match` con `get` es más expresivo, porque de paso obtienes el valor. Recuerda que `get` devuelve una **referencia**, no una copia: el valor sigue viviendo en el mapa.

:::info Nota
ℹ️ Recuperar valores con `get` devuelve siempre una referencia prestada. Esto significa que no puedes "sacar" un valor del mapa sin más: moverlo requiere métodos como `remove`, que verás cuando tu código crezca.
:::

## 3. La propiedad de las claves

Una de las particularidades del `HashMap` en Rust es que **las claves pasan a ser propiedad del mapa**. Cuando insertas una clave, la clave misma se mueve al diccionario y no puedes seguir usándola:

```rust
let nombre = String::from("Ana");
let mut edades = HashMap::new();
edades.insert(nombre, 30);
// println!("{nombre}"); // ERROR: nombre se movió al mapa
```

- Al insertar, `nombre` se **mueve** a `edades`.
- El mapa pasa a ser el dueño de la clave, como el vector es dueño de sus elementos.
- El valor `30` es de tipo `Copy` (`i32`), así que se copia y no hay conflicto.

Si tu clave es una `String`, el movimiento es inevitable. Si prefieres no ceder la propiedad, puedes insertar una referencia, pero entonces el mapa dependerá de que esa referencia siga viva, un tema de lifetimes que veremos más adelante.

:::warning Advertencia
⚠️ Cuando insertes claves del tipo `String`, recuerda que las pierdes: quedan en el mapa. Si intentas usarlas después, el compilador te lo hará saber con un error de movimiento. Planifica tu código para no necesitarlas fuera del diccionario.
:::

## 4. Actualizando con `entry` y `or_insert`

El problema clásico del diccionario es actualizar un valor sin sobreescribir lo que ya existe. Imaginemos un contador de palabras: cada vez que aparece una palabra, sumamos 1. La forma ingenua de hacerlo en muchos lenguajes se complica aquí porque la clave puede no existir todavía.

La solución idiomática de Rust usa `entry` y `or_insert`:

```rust
use std::collections::HashMap;

let texto = "hola mundo hola";
let mut contador = HashMap::new();

for palabra in texto.split_whitespace() {
    let cuenta = contador.entry(palabra).or_insert(0);
    *cuenta += 1;
}

println!("{contador:?}");
```

- `contador.entry(palabra)`: devuelve una **entrada** del mapa para esa clave.
- `.or_insert(0)`: si la clave no existe, la inserta con valor inicial `0`; si existe, deja su valor actual.
- El resultado es una **referencia mutable** al valor, sea cual sea el caso.
- `*cuenta += 1`: suma 1 al valor existente, sin sobreescribirlo por accidente.

Esta combinación resuelve en una línea lo que en otros lenguajes requiere varios pasos: consultar, decidir, insertar o actualizar. Es uno de los patrones más elegantes de la estándar, y el compilador te garantiza que no hay carrera de condiciones.

:::tip
💡 Memoriza el patrón `entry(clave).or_insert(valor)` para contar, agrupar o actualizar. Ahorra líneas, evita errores de lógica y es el estilo que verás en cualquier código profesional de Rust.
:::

## 5. ¿Cuándo usar un HashMap?

Elegir la colección correcta es la mitad del diseño de un programa. El `HashMap` brilla cuando la operación central es **buscar por clave**: listas de contactos, configuración por nombre, conteos de ocurrencias, cachés simples o cualquier asociación clave-valor.

Por el contrario, no es la mejor opción cuando:

- Necesitas los datos **en orden** de inserción o de clave: el vector o un ordenamiento manual lo hace mejor.
- Tu cantidad de datos es **pequeña y fija**: un array o un vector es más simple y rápido.
- Solo necesitas una **secuencia**: el vector sigue siendo la colección por defecto.

En resumen: lista ordenada, vector; texto mutable, `String`; búsqueda por clave, `HashMap`. Esta regla mental te ahorrará mucho tiempo de ida y vuelta al decidir.

## Buenas prácticas

- Importa `HashMap` con `use std::collections::HashMap;`.
- Usa `insert` para añadir y `get` + `match` para leer de forma segura.
- Recuerda que las claves se **mueven** al mapa: no las uses después de insertarlas.
- Actualiza con `entry(...).or_insert(...)` en lugar de consultar e insertar a mano.
- Elige `HashMap` para búsquedas por clave y `Vec` para datos en secuencia.

## Resumen rápido

- `HashMap<K, V>` asocia claves únicas con valores, sin orden garantizado.
- `insert(clave, valor)` añade pares; la clave pasa a ser propiedad del mapa.
- `get(clave)` devuelve `Option<&V>`: `Some` si existe, `None` si no.
- `entry(clave).or_insert(valor)` inserta si falta y devuelve una referencia mutable.
- Úsalo para búsquedas por clave; reserva `Vec` para secuencias ordenadas.

Con el `HashMap` cierras la tríada de colecciones esenciales: listas, textos y diccionarios. En la siguiente parte darás un salto conceptual y aprenderás a escribir código que funciona para cualquier tipo con **genéricos y traits**, la abstracción que hace a tus programas reutilizables de verdad.