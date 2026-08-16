---
outline: [2, 3]
---

# Tipos de datos

En el capítulo anterior aprendiste a guardar datos en variables y a decidir cuándo pueden cambiar. Pero los datos no son todos iguales: un número, un texto y un valor de sí/no se comportan de forma distinta, y el compilador necesita saber con qué "material" está trabajando. A eso lo llamamos **tipo de dato**.

En Rust, todo valor tiene un tipo, y ese tipo se conoce siempre: el compilador lo infiere solo, aunque también puedes anotarlo tú de forma explícita. No te preocupes si al principio parece mucha información; la mayoría de los tipos los verás de forma natural en poco tiempo.

## 1. Inferencia y anotación explícita

Cuando escribes `let edad = 30;`, el compilador deduce que `edad` es un número entero sin que tú digas nada. Eso es **inferencia de tipos**. Pero a veces conviene ser explícito, especialmente en constantes o cuando el contexto no deja claro el tipo:

```rust
let velocidad = 5;             // el compilador infiere el tipo
let peso: f64 = 72.5;          // anotación explícita con ":"
```

- `: f64`: La anotación de tipo. Se escribe el nombre del tipo después de los dos puntos.
- `5` sin decimales sugiere un entero; `72.5` con decimales sugiere un flotante.

## 2. Números enteros

Los enteros son números sin parte decimal. Rust ofrece varios tamaños para elegir el que mejor se ajuste a tus necesidades, en versiones con y sin signo:

| Tipo | Signo | Tamaño |
| ---- | ----- | ------ |
| `i8` / `u8` | con / sin signo | 8 bits |
| `i16` / `u16` | con / sin signo | 16 bits |
| `i32` / `u32` | con / sin signo | 32 bits |
| `i64` / `u64` | con / sin signo | 64 bits |
| `isize` / `usize` | con / sin signo | depende de la arquitectura |

- La **`i`** inicial significa *integer* con signo (acepta negativos).
- La **`u`** inicial significa *unsigned* (solo positivos).
- `i32` es el tipo por defecto cuando el compilador infiere un entero.

Cada tipo tiene un **rango** distinto. Por ejemplo, un `u8` va de `0` a `255`, y un `i8` de `-128` a `127`. Si intentas guardar un valor fuera del rango, el compilador o el programa te lo harán saber:

```rust
let temperatura: u8 = 200;   // válido: está dentro de 0..255
// let fuego: u8 = 500;      // ERROR: 500 no cabe en 8 bits
```

- `usize` y `isize` son especiales: toman el tamaño del puntero de tu máquina. Se usan para índices y tamaños de colecciones, como verás en capítulos futuros.

## 3. Números flotantes

Los **flotantes** son números con parte decimal. Rust tiene dos tipos: `f32` (32 bits, menor precisión) y `f64` (64 bits, mayor precisión). El tipo por defecto cuando el compilador infiere un decimal es `f64`.

```rust
let pi = 3.1416;             // f64 por defecto
let gravedad: f32 = 9.81;    // anotado explícitamente
```

- `f32`: Más liviano, ideal cuando el espacio importa (por ejemplo, en juegos).
- `f64`: Más preciso, es la opción recomendada por el lenguaje para el uso general.

:::warning Advertencia
⚠️ Los números flotantes nunca son 100% exactos. Comparar dos flotantes con `==` puede darte sorpresas, ya que la representación binaria introduce pequeños errores. Más adelante veremos cómo manejarlos con cuidado.
:::

## 4. Booleanos y caracteres

Para valores de sí o no existe el tipo **`bool`**, con exactamente dos valores posibles: `true` y `false`. Es el resultado natural de las comparaciones y lo usarás a diario en las estructuras de control del próximo capítulo.

```rust
let esta_lloviendo = true;
let es_viernes: bool = false;
```

- `bool`: Dos estados posibles, como un interruptor: encendido o apagado.
- `true` / `false`: Las únicas dos palabras que puede tomar un `bool`.

Para un único carácter existe el tipo **`char`**. Rust no usa comillas dobles para los caracteres sino **comillas simples**, y un `char` puede guardar cualquier carácter Unicode, no solo letras del alfabeto latino:

```rust
let letra = 'R';
let simbolo = '🦀';
```

- `char`: Ocupa 4 bytes, porque puede representar cualquier símbolo Unicode.
- `'R'`: Las comillas simples son la marca de los caracteres en Rust.

:::info Nota
ℹ️ Recuerda la diferencia: `"texto"` (comillas dobles) es una cadena, mientras que `'x'` (comillas simples) es un solo carácter. Confundirlas es uno de los errores más comunes al empezar.
:::

## 5. Tuplas: agrupar varios valores

Una **tupla** agrupa varios valores en un solo paquete, y cada valor puede ser de un tipo distinto. Las tuplas tienen un tamaño fijo: no pueden crecer ni encogerse.

```rust
let coordenada = (4, 7);
let persona = ("Ada", 36, true);
```

- `(4, 7)`: Una tupla de dos enteros, como un punto en un plano.
- `("Ada", 36, true)`: Una tupla que mezcla texto, número y booleano.

Para acceder a un valor de la tupla se usa un punto seguido del **índice**, que empieza en `0`:

```rust
let coordenada = (4, 7);
let x = coordenada.0;   // 4
let y = coordenada.1;   // 7
```

- `coordenada.0`: El primer elemento de la tupla.
- El índice se escribe con `.`, no con corchetes.

También puedes **desestructurar** una tupla, separando sus valores en variables individuales:

```rust
let (x, y) = coordenada;
```

## 6. Arrays: colecciones de tamaño fijo

Un **array** guarda varios valores del **mismo tipo**, uno al lado del otro en la memoria. A diferencia de una tupla, todos sus elementos comparten tipo; y a diferencia de un vector (que verás mucho más adelante), su tamaño es fijo desde la declaración.

```rust
let dias = [1, 2, 3, 4, 5];
let pares = [0; 5];   // [0, 0, 0, 0, 0]
```

- `[1, 2, 3, 4, 5]`: Un array de cinco enteros.
- `[0; 5]`: La sintaxis abreviada: el valor `0` repetido cinco veces.
- Los elementos de un array se acceden con **corchetes** y su índice también empieza en `0`:

```rust
let primer = dias[0];   // 1
let ultimo = dias[4];   // 5
```

:::warning Advertencia
⚠️ En Rust, acceder a un índice que no existe (como `dias[9]`) hace que el programa **entre en pánico** y se detenga de inmediato. Es una decisión de seguridad: mejor detenerse que leer basura de la memoria. Recuerda que el último índice siempre es `tamaño - 1`.
:::

## Buenas prácticas

- Confía en la **inferencia** del compilador, pero anota el tipo cuando el valor no lo deje claro.
- Usa `i32` y `f64` como opciones por defecto; reserva los demás tamaños para casos concretos.
- Encierra los caracteres en **comillas simples** y las cadenas en **comillas dobles**.
- Para colecciones que no cambiarán de tamaño, un array es suficiente; para las que sí, más adelante conocerás a `Vec`.

## Resumen rápido

- Tipos **escalares**: enteros (`i8`..`i64`, `u8`..`u64`), flotantes (`f32`, `f64`), `bool` y `char`.
- La **`i`** admite negativos; la **`u`** solo positivos.
- Los flotantes por defecto son `f64`; los enteros por defecto son `i32`.
- Las **tuplas** agrupan distintos tipos y se acceden con `tupla.0`.
- Los **arrays** agrupan un mismo tipo con tamaño fijo y se acceden con `arreglo[0]`.

Ya sabes qué materiales puedes guardar en tus variables. En el siguiente capítulo aprenderás a construir **funciones**, la forma de empaquetar lógica reutilizable que hará que tu código deje de ser una lista de instrucciones sueltas.