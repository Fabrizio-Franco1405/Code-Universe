---
outline: [2, 3]
---
# Leyendo un archivo

En el capítulo anterior conseguimos que `minigrep` acepte la consulta y la ruta del archivo desde la terminal. Ahora llega el momento de darle vida: **abrir el archivo y leer su contenido**. Acá entra en escena el manejo de errores que exploramos en el capítulo de errores: abrir un archivo que no existe o que está protegido es algo que puede pasar en cualquier momento, y nuestro programa debe estar preparado.

Este paso transforma a `minigrep` de un simple eco de la terminal a una herramienta que realmente hace trabajo de lectura. Recuerda que en Rust no hay lectura "silenciosa": toda operación que puede fallar te avisa, y aprender a escuchar ese aviso es parte del oficio.

## 1. Leyendo el archivo con `std::fs::read_to_string`

La biblioteca estándar simplifica la lectura de archivos de texto con `std::fs::read_to_string`. Un solo llamado se encarga de abrir el archivo, leerlo completo y devolverlo como `String`:

```rust
use std::env;
use std::fs;

fn main() {
    let argumentos: Vec<String> = env::args().collect();
    if argumentos.len() < 3 {
        eprintln!("Uso: minigrep <consulta> <ruta_del_archivo>");
        return;
    }

    let consulta = &argumentos[1];
    let ruta = &argumentos[2];

    let contenido = fs::read_to_string(ruta).expect("No se pudo leer el archivo");

    println!("El archivo tiene {} caracteres", contenido.len());
}
```

- `std::fs::read_to_string`: lee todo el contenido del archivo y lo devuelve como `String`.
- Recibe una referencia a la ruta (`&String`), que se convierte automáticamente al `&str` que espera.
- Por ahora usamos `expect` para salir del paso; en el próximo capítulo reemplazaremos esa muleta por un manejo de errores profesional.

:::tip
💡 Crea un archivo de prueba llamado `poema.txt` en la carpeta del proyecto con un par de líneas de texto. Lo usarás una y otra vez para probar `minigrep` durante toda la travesía.
:::

## 2. Manejando el Result que devuelve

`read_to_string` no devuelve un `String` directamente: devuelve un `Result<String, io::Error>`. Eso significa que la operación puede terminar en dos caminos posibles, y Rust te obliga a contemplar ambos:

```rust
match fs::read_to_string(ruta) {
    Ok(contenido) => println!("El archivo tiene {} caracteres", contenido.len()),
    Err(error) => eprintln!("No se pudo leer el archivo: {error}"),
}
```

- `Ok(contenido)`: la lectura fue exitosa y aquí tienes el texto.
- `Err(error)`: algo salió mal (archivo inexistente, permisos, directorio) y el error describe el motivo.
- El compilador, ese auditor de seguridad incansable, no te dejará avanzar mientras uno de estos dos caminos quede sin contemplar.

:::warning Advertencia
⚠️ ¿Probaste `cargo run -- consulta ruta_inexistente`? Verás un error de "No such file or directory". Ese es el `Err` en acción: sin manejarlo, el programa entraría en pánico de forma poco elegante.
:::

## 3. Un vistazo temporal: `unwrap` y `expect`

Antes de construir el manejo de errores definitivo, usaremos un atajo temporal para que el proyecto avance. `expect` es como `unwrap` pero con un mensaje propio:

```rust
let contenido = fs::read_to_string(ruta).expect("No se pudo leer el archivo");
```

- `expect("mensaje")`: extrae el valor de un `Ok`, o entra en pánico con el mensaje si encuentra un `Err`.
- `unwrap()`: hace lo mismo, pero sin un mensaje descriptivo.
- Ambos son herramientas de prototipado: perfectas mientras exploras, peligrosas en producción porque convierten un error en un pánico.

:::info Nota
ℹ️ No te preocupes si usar `expect` se siente como un parche. Es el camino natural: primero construyes el flujo feliz, y en los próximos capítulos lo blindamos con errores elegantes. Más adelante veremos el operador `?`, la forma idiomática de propagar errores.
:::

## 4. Buscando la consulta con `.lines()` y `.contains()`

Ahora sí, la parte divertida: encontrar las líneas que contienen la consulta. Como el contenido es un `String` completo, lo recorremos línea por línea y nos quedamos con las que coinciden:

```rust
for linea in contenido.lines() {
    if linea.contains(consulta) {
        println!("{linea}");
    }
}
```

- `.lines()`: transforma el texto en un iterador que devuelve cada línea sin su salto de línea final.
- `.contains(consulta)`: pregunta si la línea actual incluye el texto buscado.
- Cuando la respuesta es `true`, imprimimos la línea completa: ese es exactamente el comportamiento de `grep`.

El programa de este capítulo ya busca y muestra, pero sigue siendo un prototipo. Todos los `expect`, las referencias y la lógica viven amontonados en `main`, y eso es justo lo que arreglaremos a continuación.

## Buenas prácticas

- Crea siempre un archivo de prueba y pruébalo con distintos escenarios, incluyendo rutas inexistentes.
- Usa `expect` solo como muleta temporal y recuerda marcarlo para reemplazarlo.
- Verifica tus búsquedas con texto que sabes que está y con texto que no está.

## Resumen rápido

- `std::fs::read_to_string`: lee un archivo y devuelve un `Result<String, io::Error>`.
- `match` sobre `Result`: contempla siempre los caminos `Ok` y `Err`.
- `.lines()` más `.contains()`: la receta para buscar texto dentro de un archivo.

`minigrep` ya encuentra líneas, pero su código pide a gritos organización. En el próximo capítulo lo refactorizamos en módulos separados y le damos un manejo de errores digno: separaremos la lógica, crearemos un `Config`, y por el camino chocaremos con el famoso préstamo de la memoria.