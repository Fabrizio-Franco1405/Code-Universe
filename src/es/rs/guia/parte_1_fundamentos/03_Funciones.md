---
outline: [2, 3]
---

# Funciones

Hasta ahora tus programas han sido pequeñas listas de instrucciones. En este capítulo aprenderás a empaquetar esas instrucciones en bloques reutilizables: las **funciones**. Piensa en ellas como recetas de cocina: escribes la receta una sola vez y puedes prepararla todas las veces que quieras, con los ingredientes que le pases.

Las funciones son la unidad básica de organización en cualquier programa de Rust. Ya conoces una de memoria: `main`, el punto de entrada de todo binario. Ahora descubrirás cómo crear las tuyas propias y, sobre todo, una de las ideas más importantes y distintas de este lenguaje: la diferencia entre **expresiones** y **sentencias**.

## 1. Declarando funciones con `fn`

Para crear una función se usa la palabra clave `fn`, seguida del nombre y de un par de paréntesis:

```rust
fn saludar() {
    println!("¡Hola, mundo!");
}
```

- `fn`: La palabra clave que define una función.
- `saludar`: El nombre que elegimos. Por convención, las funciones se nombran en minúsculas con guiones bajos (snake_case).
- `()`: Los paréntesis vacíos indican que la función no recibe parámetros.
- `{ ... }`: El cuerpo, las instrucciones que se ejecutan al llamarla.

Para ejecutar una función escribes su nombre seguido de paréntesis:

```rust
fn main() {
    saludar();
    saludar();
}
```

- `saludar();`: La **llamada** a la función. En este caso, se ejecuta dos veces.

## 2. Parámetros con tipo

Las funciones se vuelven poderosas cuando reciben información del exterior. Esos datos se llaman **parámetros**, y en Rust cada uno debe declarar su tipo:

```rust
fn sumar(a: i32, b: i32) {
    println!("El resultado es {}", a + b);
}
```

- `a: i32, b: i32`: Dos parámetros, ambos enteros. Cada uno declara su tipo después de los dos puntos.
- `{}`: En el texto de `println!`, las llaves son un marcador de posición: se reemplazan por el valor que le pasas después.

Al llamarla, los valores que entregas se llaman **argumentos** y deben coincidir en cantidad y tipo:

```rust
sumar(3, 4);
```

:::info Nota
ℹ️ Anotar el tipo de cada parámetro es obligatorio en Rust. Puede parecerte verborrágico, pero le da al compilador (y a quien lee el código) información valiosa para detectar errores antes de ejecutar nada.
:::

## 3. Devolviendo valores con `->`

Una función puede devolver un valor para que quien la llama lo use. El tipo de retorno se declara con una flecha `->` después de los paréntesis:

```rust
fn doble(x: i32) -> i32 {
    x * 2
}
```

- `-> i32`: La flecha seguida del tipo indica que esta función devuelve un entero.
- `x * 2`: La última expresión del cuerpo, que es el valor que se devuelve.

Fíjate en algo crucial: `x * 2` **no lleva punto y coma**. Eso no es un descuido; es la clave de todo lo que sigue.

## 4. Expresiones vs sentencias

Rust hace una distinción fundamental entre dos tipos de "instrucciones":

- **Expresión**: algo que produce un valor. `5 + 3`, `x * 2` o `saludar()` son expresiones.
- **Sentencia**: algo que ejecuta una acción y no produce valor. Las declaraciones con `let` y las llamadas que terminan en `;` son sentencias.

La regla de oro: **las expresiones se evalúan a un valor, las sentencias no**, y en Rust el punto y coma `;` es exactamente lo que convierte una expresión en sentencia.

```rust
let y = {
    let x = 3;
    x + 1
};
```

- `x + 1`: Es una expresión sin `;`, así que produce el valor `4`.
- Ese `4` es el resultado del bloque `{ ... }`, que queda asignado a `y`.

Observa el contraste:

```rust
fn retorna_cinco() -> i32 {
    5          // expresión sin ";": devuelve 5
}

fn nada() {
    5;         // sentencia con ";": no devuelve nada
}
```

:::warning Advertencia
⚠️ El error más común al escribir funciones: olvidar que la última expresión se convierte en retorno. Si agregas `;` al final, esa expresión deja de devolver valor y el compilador te reclamará que falta el retorno que prometiste con `->`.
:::

## 5. El retorno implícito y `return`

En Rust, **la última expresión de una función es su retorno**, sin necesidad de escribir nada más. Es lo que viste en `x * 2` y en `5`:

```rust
fn area(base: i32, altura: i32) -> i32 {
    base * altura
}
```

- `base * altura`: Es la última expresión, así que el compilador sabe que es el valor de retorno. No hace falta `return`.

También existe la palabra clave `return` para salir de una función de forma anticipada, por ejemplo dentro de una condición:

```rust
fn mayor_de_edad(edad: i32) -> bool {
    if edad >= 18 {
        return true;
    }
    false
}
```

- `return true;`: Sale de la función de inmediato devolviendo `true`.
- `false`: La última expresión; si llegamos hasta acá, es el retorno.
- Nota que `return` **sí lleva punto y coma**, porque es una sentencia que produce un salto, no un valor.

:::tip
💡 Escribe el retorno de forma implícita (la última expresión sin `;`) siempre que puedas. Es el estilo idiomático de Rust. Reserva `return` para salidas tempranas dentro de condiciones o bucles.
:::

## Buenas prácticas

- Nombra tus funciones con snake_case (`calcular_promedio`, no `CalcularPromedio`).
- Una función debe hacer **una sola cosa** bien hecha; si se complica, divídela.
- Aprovecha el retorno implícito: la última expresión, sin `;`, es tu valor de retorno.
- Usa `return` solo para salir antes de tiempo, no para devolver el resultado normal.

## Resumen rápido

- `fn nombre(parametros) -> Tipo { ... }` declara una función con tipo de retorno.
- Los parámetros siempre declaran su tipo con `: tipo`.
- Una **expresión** produce un valor; una **sentencia** no.
- El `;` convierte una expresión en sentencia.
- La **última expresión sin `;`** es el retorno implícito de la función.
- `return valor;` permite salir de la función de forma anticipada.

Con las funciones ya puedes construir bloques lógicos reutilizables. En el próximo capítulo veremos los **comentarios**, las notas que le escribes a tu yo del futuro (y a tus compañeros) sin que el compilador se entere.