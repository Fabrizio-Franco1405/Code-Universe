---
outline: [2, 3]
---

# Tu primer programa

Antes de sumergirnos en conceptos avanzados, es momento de escribir nuestro primer programa en Rust. Como es tradición en el mundo de la programación, comenzaremos con el clásico `Hello World`. Aunque parezca un ejercicio trivial, este ritual tiene un significado profundo: te confirma que tu entorno está configurado correctamente y que ya puedes comunicarte con la máquina a través de este nuevo lenguaje.

## Creando tu proyecto

A diferencia de otros lenguajes donde creas archivos a mano, en Rust los proyectos se crean con `cargo`, la herramienta oficial que gestiona todo tu proyecto. Para iniciar, abre tu terminal y ejecuta:

```bash
cargo new hola_mundo
```

Este comando crea una carpeta llamada `hola_mundo` con la siguiente estructura:

```
hola_mundo/
├── Cargo.toml
└── src/
    └── main.rs
```

- `Cargo.toml`: Es el archivo de configuración del proyecto. Aquí se declara el nombre, la versión y las dependencias.
- `src/main.rs`: Es donde vivirá el código fuente de nuestro programa.

:::tip
💡 Si prefieres trabajar en el directorio actual en lugar de crear uno nuevo, puedes usar `cargo new .` siempre y cuando la carpeta ya exista.
:::

## El clásico Hola Mundo

Cargo ya nos deja un programa de ejemplo listo para ejecutar. Abre `src/main.rs` y verás algo muy parecido a esto:

```rust
fn main() {
    println!("Hello, world!");
}
```

No te preocupes si todavía no entiendes cada línea, en un momento la desglosaremos por completo. Primero compila y ejecuta tu programa para comprobar que todo funciona:

```bash
cd hola_mundo
cargo run
```

Deberías ver una salida similar a esta:

```
   Compiling hola_mundo v0.1.0 (C:\...\hola_mundo)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.31s
     Running `target\debug\hola_mundo.exe`
Hello, world!
```

La última línea, `Hello, world!`, es el resultado de nuestro programa. Todo lo demás es información que Cargo nos muestra sobre el proceso de compilación, algo muy valioso una vez que tus proyectos crezcan.

## Desglosando el código

Ahora que ya viste tu primer programa en acción, es importante que entiendas qué ocurre en cada parte para construir bases sólidas:

### 1. La función `main`

```rust
fn main() {
```

- `fn`: Es la palabra clave que define una función.
- `main`: Es el punto de entrada de todo programa de Rust. La ejecución siempre comienza aquí, como la puerta principal de tu casa: no importa cuántas habitaciones tenga tu código, siempre se entra por `main`.
- `()`: Indica que la función no recibe parámetros.
- `{`: Marca el inicio del cuerpo de la función, el bloque de código que se ejecutará.

:::warning Advertencia
⚠️ En Rust, la función `main` es obligatoria en los binarios. Si el compilador no la encuentra, no podrá generar el ejecutable y te lo hará saber con un error.
:::

### 2. La macro `println!`

```rust
    println!("Hello, world!");
}
```

- `println!`: Es una **macro** que imprime texto en la terminal y añade un salto de línea al final. El signo `!` es lo que la distingue de una función normal; más adelante descubrirás que las macros son una de las superpoderes del lenguaje.
- `"Hello, world!"`: Es el texto que se mostrará en pantalla.
- `;`: Marca el final de la sentencia. En Rust, la mayoría de las sentencias terminan con punto y coma.

El `!` de `println!` no es casualidad: le indica al compilador que ejecute un fragmento de código especial que "expande" la llamada. Por eso no llevan punto y coma los bloques de cierre de función, pero sí cada instrucción dentro de ellos.

## Los comandos esenciales de Cargo

Antes de continuar, familiarízate con los comandos que usarás a diario:

- `cargo build`: Compila el proyecto sin ejecutarlo.
- `cargo run`: Compila (si es necesario) y ejecuta el programa.
- `cargo check`: Revisa que el código compile correctamente **sin generar** el ejecutable. Es el más rápido de todos y lo usarás constantemente.

:::tip
💡 Acostúmbrate a usar `cargo check` mientras escribes código para detectar errores al instante, y reserva `cargo build` o `cargo run` cuando quieras ver el programa en acción. Así ahorrarás tiempo de compilación.
:::

## Buenas prácticas

- Mantén una sola responsabilidad por función desde el inicio.
- Dale nombres claros y descriptivos a tus archivos y variables (en español si así lo prefieres).
- Usa `cargo check` con frecuencia para no acumular errores.
- Respeta la estructura `src/` que genera Cargo: todo el código va dentro de esa carpeta.

## Resumen rápido

- `cargo new nombre`: crea un proyecto nuevo.
- `cargo run`: compila y ejecuta tu programa.
- `cargo check`: verifica que compile sin generar el ejecutable.
- `fn main()`: el punto de entrada obligatorio de todo binario.
- `println!`: imprime texto con salto de línea incluido.

Con esto ya diste tus primeros pasos en Rust. En el siguiente capítulo conocerás a fondo a Cargo, el arquitecto que gestionará cada uno de tus proyectos de ahora en adelante.