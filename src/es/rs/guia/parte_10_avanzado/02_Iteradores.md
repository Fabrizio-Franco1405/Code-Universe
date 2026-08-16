---
outline: [2, 3]
---

# Iteradores

En el capítulo anterior viste cómo crear cierres para definir comportamiento sobre la marcha. Ahora vamos a combinarlos con los **iteradores**, la forma más elegante que tiene Rust de recorrer y transformar colecciones. Un iterador no es solo un bucle más bonito: es una abstracción que se compila a código tan eficiente como el bucle escrito a mano, un ejemplo perfecto de las **abstracciones de coste cero** que prometía la filosofía del lenguaje.

## 1. El trait `Iterator` y `next()`

Un **iterador** es cualquier tipo que implementa el trait `Iterator`, lo que básicamente significa que sabe responder a la pregunta "¿cuál es el siguiente elemento?". La pieza clave es el método `next()`, que devuelve `Option`: `Some(elemento)` mientras quede algo por recorrer, y `None` cuando se agota.

```rust
let numeros = vec![1, 2, 3];
let mut iterador = numeros.iter();

println!("{:?}", iterador.next()); // Some(1)
println!("{:?}", iterador.next()); // Some(2)
println!("{:?}", iterador.next()); // Some(3)
println!("{:?}", iterador.next()); // None
```

- `next()`: avanza una posición y devuelve la referencia al elemento.
- El patrón `Some`/`None` es el mismo de `Option` que ya conoces, así que no hay nada nuevo que memorizar.

:::info Nota
ℹ️ Los iteradores son **perezosos**: construir uno no ejecuta nada. Solo cuando alguien llama a `next()` (o a un método que lo haga) el recorrido realmente ocurre. Esta pereza es la que permite encadenar operaciones sin pagar por ellas de antemano.
:::

## 2. Los adaptadores

Los **adaptadores** son métodos que reciben un iterador y devuelven otro, transformando la secuencia. No consumen los datos: solo preparan la siguiente fase del recorrido, como los tramos de una cadena de montaje.

```rust
let numeros = 1..=10;

let primeros_pares: Vec<i32> = numeros
    .filter(|n| n % 2 == 0)
    .take(3)
    .collect();

println!("{primeros_pares:?}"); // [2, 4, 6]
```

- `filter`: conserva solo los elementos que cumplen la condición del cierre.
- `take(3)`: corta el recorrido tras los primeros tres elementos.
- `collect`: el consumidor final que reúne todo en el `Vec`.

Otro adaptador muy útil es `enumerate`, que añade el índice de cada posición, y `map`, que transforma cada elemento con un cierre:

```rust
let frutas = vec!["manzana", "pera", "uva"];

for (indice, fruta) in frutas.iter().enumerate() {
    println!("{indice}: {fruta}");
}
```

- `enumerate`: convierte cada elemento en una tupla `(índice, valor)`.
- Este estilo con `for` es idéntico a recorrer un `Vec`, pero funciona con cualquier iterador.

:::warning Advertencia
⚠️ Recuerda la pereza: si encadenas adaptadores y no terminas con un consumidor, tu código no hace absolutamente nada. Un iterador sin consumir es como una receta que nunca se pone en la cocina.
:::

## 3. Los consumidores

Los **consumidores** son el extremo opuesto: arrancan el recorrido y producen un resultado. Cualquier método que llame a `next()` internamente es un consumidor, y algunos de los más comunes hacen gran parte del trabajo por ti:

```rust
let numeros = 1..=5;

let suma: i32 = numeros.clone().sum();
let cantidad: usize = numeros.clone().count();
let dobles: Vec<i32> = numeros.clone().map(|n| n * 2).collect();

println!("suma: {suma}, cantidad: {cantidad}");
println!("dobles: {dobles:?}");
```

- `sum`: suma todos los elementos y consume el iterador.
- `count`: cuenta cuántos elementos quedaban.
- `collect`: reúne los resultados en la colección que declares en el tipo.
- `.clone()`: como cada consumidor "se traga" el iterador, duplicamos el rango para reutilizarlo.

`for_each` es otro consumidor que aplica un cierre a cada elemento sin acumular nada:

```rust
(1..=3).for_each(|n| print!("{n} "));
println!();
```

## 4. `iter`, `iter_mut` e `into_iter`

Las colecciones de Rust ofrecen tres formas de obtener un iterador, y cada una presta sus datos de manera distinta. Elegir la correcta es cuestión de preguntarse qué quieres hacer con los elementos:

```rust
let mut numeros = vec![1, 2, 3];

for numero in numeros.iter() {
    println!("{numero}");
}

for numero in numeros.iter_mut() {
    *numero *= 10;
}

for numero in numeros {
    println!("{numero}");
}
```

- `iter()`: presta una **referencia inmutable** a cada elemento; el `Vec` sigue intacto.
- `iter_mut()`: presta una **referencia mutable**; puedes modificar cada elemento con `*numero`.
- `into_iter()`: **toma posesión** del vector y entrega los valores, dejando a `numeros` inutilizable.

:::tip
💡 El bucle `for` usa `into_iter()` por defecto, por eso `for numero in numeros` consume el vector. Si quieres solo leer, escribe `for numero in &numeros`; si quieres modificar, `for numero in &mut numeros`.
:::

## 5. Abstracciones de coste cero

Quizá te preguntes si toda esta elegancia tiene un precio en velocidad. La respuesta es no: los iteradores son una **abstracción de coste cero**. Gracias a la monomorfización y a las optimizaciones del compilador, la cadena de adaptadores se "aplancha" y se convierte en las mismas instrucciones que escribirías a mano con un bucle. Compara estas dos versiones equivalentes:

```rust
let mut total_manual = 0;
for numero in &numeros {
    if *numero % 2 == 0 {
        total_manual += *numero * 2;
    }
}
```

```rust
let total_iterador: i32 = numeros
    .iter()
    .filter(|n| *n % 2 == 0)
    .map(|n| n * 2)
    .sum();
```

- Ambos calculan exactamente lo mismo, sumando el doble de los números pares.
- En una compilación de **release**, el compilador reduce la versión con iteradores al mismo código optimizado del bucle manual.

Recuerda la promesa del inicio: no pagas un precio en velocidad por usar herramientas más humanas. El **auditor de seguridad** se asegura, además, de que nunca recorras una colección con referencias que ya no son válidas.

## Buenas prácticas

- Termina siempre tus cadenas de adaptadores con un consumidor (`collect`, `sum`, `count`, `for_each`).
- Prefiere `iter()` para leer, `iter_mut()` para modificar e `into_iter()` cuando quieras mover los datos.
- Usa `enumerate` para índices y `take` para límites en lugar de llevar contadores manuales.
- Confía en que el compilador optimiza las cadenas; mide solo si la realidad te pide otra cosa.

## Resumen rápido

- `next()` devuelve `Option` y define el comportamiento de todo iterador.
- Los adaptadores (`map`, `filter`, `take`, `enumerate`) transforman sin consumir.
- Los consumidores (`collect`, `sum`, `count`, `for_each`) disparan el recorrido.
- `iter`, `iter_mut` e `into_iter` controlan cómo se prestan o mueven los datos.
- Los iteradores son una abstracción de coste cero: no son más lentos que un bucle manual.

Los iteradores te permiten procesar colecciones con una claridad difícil de igualar. En el siguiente capítulo vamos a dar un paso atrás para entender cómo Rust gestiona la memoria en patrones más complejos, con los **punteros inteligentes**.