---
outline: [2, 3]
---

# Vectores

En la parte anterior aprendiste a organizar tu código en módulos y archivos, dándole estructura a proyectos que crecen. Ahora damos un giro y volvemos a los datos: ¿qué haces cuando necesitas guardar más de un valor del mismo tipo? Hasta aquí usabas arrays de talla fija, pero la vida real cambia: los datos llegan de a poco. Para eso existen las **colecciones**, y la primera que conocerás es el **vector**.

Un **vector** (`Vec<T>`) es una lista que puede crecer y encogerse en tiempo de ejecución. Es como una estantería que admite más estantes cuando la necesitas. Los vectores son la colección más usada de Rust, presentes en prácticamente todo programa real, así que vale la pena dominarlos con precisión.

## 1. Creando vectores

Hay dos formas principales de crear un vector. La primera, con la macro `vec!` cuando ya conoces los valores iniciales:

```rust
let numeros = vec![1, 2, 3, 4, 5];
let nombres = vec!["Ana".to_string(), "Luis".to_string()];
```

La segunda, con `Vec::new()`, cuando la lista comienza vacía y se llenará más adelante:

```rust
let mut precios = Vec::new();
precios.push(19.99);
precios.push(24.50);
```

- `vec![...]`: la macro que crea un vector con los valores listados.
- `Vec::new()`: crea un vector vacío; necesita `mut` si luego vas a modificarlo.
- `let mut`: imprescindible para poder añadir elementos. Recuerda la inmutabilidad por defecto del capítulo de variables.

Como siempre, el compilador infiere el tipo `T` del vector a partir de los datos que recibe. En `Vec::new()`, sin embargo, no hay pistas, por lo que suele ser necesario anotarlo: `let mut precios: Vec<f64> = Vec::new();`.

:::info Nota
ℹ️ La notación `Vec<T>` indica que el vector guarda valores de un único tipo `T`. Todos sus elementos deben ser del mismo tipo; si necesitas mezclar, más adelante verás cómo combinar vectores con enums.
:::

## 2. Añadiendo elementos con `push`

El método `push` añade un elemento al final del vector, como encolar a alguien en una fila:

```rust
let mut lista = Vec::new();
lista.push(10);
lista.push(20);
lista.push(30);
```

Cada `push` coloca el nuevo valor al final y el vector crece automáticamente. No tienes que reservar espacio ni preocuparte por la capacidad interna: Rust se encarga de todo ese trabajo de gestión.

- `push(valor)`: agrega `valor` al final del vector.
- El orden se respeta: los elementos salen en el mismo orden en que entraron.
- `mut` es obligatorio, porque `push` modifica el vector.

## 3. Accediendo a los elementos

Existen dos formas de leer un elemento por su índice, y conviene conocer bien la diferencia. La primera usa corchetes:

```rust
let letras = vec!['a', 'b', 'c'];
let primera = letras[0]; // 'a'
```

La segunda usa el método `get`, que devuelve un `Option<&T>`:

```rust
let letras = vec!['a', 'b', 'c'];
match letras.get(5) {
    Some(valor) => println!("Encontrado: {valor}"),
    None => println!("No existe ese índice"),
}
```

- `letras[índice]`: acceso directo; si el índice está fuera de rango, el programa **entra en pánico** y se detiene.
- `letras.get(índice)`: acceso seguro; devuelve `Some` si existe o `None` si no.
- Con `get` **tú** decides qué hacer cuando el índice no existe, gracias a `match` que ya conoces.

La elección depende del contexto. Si sabes con certeza que el índice existe (por ejemplo, porque acabas de calcularlo tú), los corchetes son cómodos y directos. Si el índice viene de datos externos, `get` te protege de un fallo inesperado.

:::warning Advertencia
⚠️ El acceso con corchetes a un índice fuera de rango provoca un **panic**: el programa se aborta en el acto. Cuando el índice no sea 100 % seguro, usa `get` y maneja el `None` con elegancia.
:::

## 4. Iterando con `for`

La operación más habitual sobre un vector es recorrerlo. El bucle `for` lo hace de forma natural:

```rust
let notas = vec![8, 9, 7];
for nota in &notas {
    println!("Nota: {nota}");
}
```

- `for nota in &notas`: itera sobre **referencias** a los elementos, sin consumir el vector.
- Dentro del cuerpo, `nota` es una referencia a cada elemento.
- Tras el bucle, `notas` sigue disponible porque solo prestamos sus valores.

Si necesitas modificar cada elemento, itera sobre una referencia mutable:

```rust
let mut numeros = vec![1, 2, 3];
for numero in &mut numeros {
    *numero += 10;
}
```

- `for numero in &mut numeros`: da acceso mutable a cada elemento.
- `*numero += 10`: el `*` desreferencia para poder modificar el valor original.

:::tip
💡 Iterar con referencias (`&`) y referencias mutables (`&mut`) es la forma idiomática de recorrer un vector. Evita consumirlo entero (por ejemplo, con `for n in numeros`) a menos que realmente ya no lo necesites.
:::

## 5. Ownership y mutabilidad

Los vectores siguen las mismas reglas de **ownership** que viste en la parte de memoria: al guardar un valor, el vector pasa a ser su dueño. Cuando el vector se destruye, también se destruyen todos sus elementos, liberando su memoria de golpe.

Un detalle práctico importante: mover valores de un tipo `Copy` (como `i32` o `char`) dentro de un vector no te complica la vida, pero los valores que no son `Copy` (como `String`) se **mueven** al vector:

```rust
let nombre = String::from("Ada");
let lista = vec![nombre]; // nombre se mueve al vector
// println!("{nombre}"); // ERROR: ya no lo poseemos
```

Una vez que `String` vive en el vector, esa es su única residencia. Para leerlo sin moverlo, usamos referencias. Esta es la contrapartida del diseño seguro de Rust, y entenderla evita el dolor de cabeza de los errores de movimiento: si intentas usar un valor no-`Copy` después de haberlo movido al vector, el compilador te lo negará. No es un capricho, es la garantía de que nunca existan dos dueños para el mismo dato.

## Buenas prácticas

- Usa `vec![...]` para crear listas conocidas y `Vec::new()` para listas que crecen.
- Anota el tipo en `Vec::new()` si el compilador no puede inferirlo.
- Usa `get()` cuando el índice no sea seguro y los corchetes cuando sí lo sea.
- Itera con `for` sobre referencias para no consumir el vector.
- Recuerda que el vector es dueño de sus elementos.

## Resumen rápido

- `Vec<T>` guarda valores del mismo tipo y crece en tiempo de ejecución.
- `vec![...]` crea un vector con valores; `Vec::new()` lo crea vacío.
- `push` añade al final; necesita `mut`.
- `vector[índice]` puede causar panic; `vector.get(índice)` devuelve `Option`.
- `for` recorre los elementos, con `&` para leer y `&mut` para modificar.
- El vector es dueño de sus elementos y los mueve al guardarlos.

Dominas el vector, la estantería de datos más versátil del lenguaje. En el siguiente capítulo te enfrentarás a una bestia más sutil: el tipo `String`, un texto que esconde sorpresas en cada byte cuando hablamos de UTF-8.