---
outline: [2, 3]
---
# Aceptar argumentos de la CLI

Llegó el momento que todo programador espera en esta travesía: **el proyecto final**. Vamos a construir `minigrep`, un clon didáctico del famoso comando `grep`, esa herramienta que busca texto dentro de archivos. A diferencia de las piezas sueltas que viste hasta ahora, este proyecto es una aventura completa: combinarás argumentos de terminal, lectura de archivos, manejo de errores, tests y módulos en una sola aplicación real.

En este primer paso del viaje, nuestra misión es simple pero fundamental: **recibir lo que el usuario escribe en la terminal**. `minigrep` se usará así: `minigrep consulta ruta_del_archivo`. El resto de la construcción depende de que este primer eslabón esté sólido, así que vamos a dedicarle el cuidado que merece.

## 1. El proyecto: `minigrep`

Como cualquier proyecto en este ecosistema, empezamos con Cargo:

```bash
cargo new minigrep
cd minigrep
```

- Cargo crea la estructura estándar con `src/main.rs` y `Cargo.toml`.
- Nuestro objetivo: leer una **consulta** (la palabra a buscar) y una **ruta** (el archivo donde buscar).
- No te preocupes si el proyecto parece modesto: un clon funcional de `grep` es el ejemplo clásico para dominar los fundamentos de Rust, y es el capstone del libro oficial por una razón muy simple: te obliga a juntar casi todo lo aprendido.

## 2. Aceptando argumentos con `std::env::args`

Para leer los argumentos que el usuario pasa en la terminal, Rust ofrece `std::env::args`. Esta función devuelve un iterador con todo lo que se escribió después del nombre del programa:

```rust
use std::env;

fn main() {
    let argumentos: Vec<String> = env::args().collect();
    println!("{argumentos:?}");
}
```

- `std::env::args`: devuelve un **iterador** sobre los argumentos de la línea de comandos.
- `.collect()`: convierte ese iterador en un `Vec<String>`, la colección más cómoda para trabajar.
- El `:?` en el formato imprime el vector completo con su sintaxis de depuración, ideal para ver qué llegó realmente.

Si ejecutas `cargo run -- hola mundo.txt`, verás algo parecido a:

```
["target\\debug\\minigrep.exe", "hola", "mundo.txt"]
```

:::tip
💡 Usar `Vec<String>` es lo más sencillo para empezar. Si más adelante necesitas argumentos con caracteres no UTF-8, existe `std::env::args_os`, que trabaja con `OsString`; por ahora, `args` nos alcanza perfectamente.
:::

## 3. El índice 0: El nombre del binario

Observa la salida del ejemplo anterior: el primer elemento no es la consulta. El **índice 0** siempre contiene la ruta del ejecutable, que varía según el sistema y la forma de invocación. Ese dato no nos interesa para la búsqueda, pero entender que existe es clave para no tropezar con el vector.

```rust
let argumentos: Vec<String> = env::args().collect();
let consulta = &argumentos[1];
let ruta = &argumentos[2];
```

- `argumentos[0]`: el nombre (o ruta) del binario. No lo usaremos como dato, pero siempre está ahí.
- `argumentos[1]`: la consulta que el usuario quiere buscar.
- `argumentos[2]`: la ruta del archivo donde se buscará.

:::warning Advertencia
⚠️ Si el usuario no pasa suficientes argumentos, acceder a `argumentos[1]` o `argumentos[2]` entrará en pánico con un error de "index out of bounds". Es un comportamiento válido para un prototipo, pero en este mismo capítulo lo reemplazaremos por un mensaje amigable.
:::

## 4. Validando la cantidad de argumentos

Un programa robusto no depende de que el usuario recuerde todo. Antes de acceder al vector, validemos cuántos argumentos llegaron:

```rust
use std::env;

fn main() {
    let argumentos: Vec<String> = env::args().collect();

    if argumentos.len() < 3 {
        eprintln!("Uso: minigrep <consulta> <ruta_del_archivo>");
        return;
    }

    let consulta = &argumentos[1];
    let ruta = &argumentos[2];

    println!("Buscando '{consulta}' en {ruta}");
}
```

- `argumentos.len()`: devuelve la cantidad total de elementos del vector.
- La condición `< 3` contempla que el índice 0 siempre existe, por lo que se necesitan al menos tres elementos en total.
- `eprintln!`: imprime el mensaje en el error estándar. No te preocupes por la diferencia con `println!` todavía; la veremos a fondo al final del proyecto.

:::info Nota
ℹ️ Ejecuta tu programa con `cargo run -- hola poema.txt`. El `--` separa los argumentos de Cargo de los argumentos de tu programa, una regla que verás en acción durante toda la travesía.
:::

## Buenas prácticas

- Valida los argumentos antes de usarlos: nunca confíes en que el usuario los escriba todos.
- Guarda los argumentos en variables con nombres descriptivos: `consulta` y `ruta`.
- Muestra un mensaje de uso claro cuando falten argumentos: es un gesto de respeto hacia quien usa tu programa.

## Resumen rápido

- `std::env::args()`: iterador con los argumentos de la terminal.
- `.collect()`: lo transforma en `Vec<String>`.
- El índice 0 es el nombre del binario; los argumentos reales empiezan en 1.
- Valida con `len()` antes de acceder al vector.

Ya tenemos los argumentos en la mano. En el próximo capítulo daremos el siguiente paso: **leer el archivo** y encontrar las líneas que contienen la consulta.