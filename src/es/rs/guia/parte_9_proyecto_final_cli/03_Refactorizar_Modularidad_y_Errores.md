---
outline: [2, 3]
---
# Refactorizar: Modularidad y errores

Nuestro `minigrep` ya busca y muestra líneas, pero su código parece un cajón desordenado: la lectura, la validación y la búsqueda conviven en `main` sin separación alguna. Este es el momento perfecto para aplicar la disciplina que este ecosistema valora: **separar responsabilidades**. En este capítulo transformamos el prototipo en una aplicación bien organizada, con una librería que contiene la lógica y un `main` que solo orquesta.

Por el camino chocaremos con uno de los errores más famosos del lenguaje: el que nos impone el **borrow checker** cuando intentamos usar los argumentos directamente. Lejos de ser un obstáculo, ese error es el compilador actuando como auditor de seguridad y enseñándonos la forma correcta de hacer las cosas.

## 1. El problema: Todo amontonado en `main`

El programa que dejamos en el capítulo anterior hace varias cosas en un solo lugar: leer argumentos, validarlos, leer el archivo y buscar. Cada una de esas responsabilidades merece su propio espacio:

- Leer y validar los argumentos → construir una **configuración**.
- Leer el archivo y buscar → una función `run` que hace el trabajo pesado.
- `main` → apenas coordina: recibe la entrada y se encarga de la salida.

Esta separación no es un capricho estético. Permite probar la lógica con tests, reutilizarla desde otros programas y mantener cada pieza pequeña y comprensible. Es el mismo criterio que usarías en cualquier herramienta del ecosistema.

## 2. Creando la estructura Config

El primer paso es darle forma a los datos que el usuario nos entrega. Creamos una estructura `Config` que agrupa la consulta y la ruta:

```rust
pub struct Config {
    pub consulta: String,
    pub ruta: String,
}
```

- `Config`: agrupa los dos datos que el programa necesita para funcionar.
- `pub`: marca los campos como públicos para que `main` pueda leerlos.
- Guardamos `String` propias, no referencias, para no depender de la vida del vector de argumentos.

Ahora una función que construya un `Config` a partir de los argumentos:

```rust
impl Config {
    pub fn new(argumentos: &[String]) -> Config {
        if argumentos.len() < 3 {
            panic!("Uso: minigrep <consulta> <ruta_del_archivo>");
        }

        let consulta = argumentos[1].clone();
        let ruta = argumentos[2].clone();

        Config { consulta, ruta }
    }
}
```

- `argumentos: &[String]`: aceptamos una porción del vector, sin tomar posesión de él.
- `argumentos[1].clone()`: crea una copia propia del string. Necesitamos esto porque no podemos mover el elemento fuera del vector.
- El `panic!` es temporal; lo reemplazaremos por un `Result` en los próximos capítulos.

## 3. El famoso error del borrow checker

¿Qué pasaría si intentáramos mover los valores directamente, sin `clone()`?

```rust
let consulta = argumentos[1]; // ERROR: cannot move out of index of Vec<String>
```

- Este es el error `E0507`: el borrow checker nos impide **mover** un elemento fuera del vector porque eso dejaría al `Vec` en un estado inválido.
- El compilador no solo te dice qué está mal: sugiere soluciones como `clone()` o tomar la referencia con `&argumentos[1]`.
- La alternativa sin copia sería guardar referencias en `Config`, pero entonces tendríamos que lidiar con tiempos de vida (`lifetimes`), un tema que verás a fondo más adelante.

:::warning Advertencia
⚠️ Este error es tan común que merece respeto: aparece en cuanto intentas sacar un `String` de un `Vec` o de otra `String`. Cuando lo veas, piensa en `clone()` para datos pequeños o en referencias con lifetimes para datos grandes.
:::

## 4. Separando la lógica: La biblioteca y `run`

Ahora la parte central del refactor: mover la lógica de búsqueda a una **biblioteca**. Creamos `src/lib.rs` y trasladamos allí la configuración y la función `run`:

```rust
use std::fs;

pub fn run(config: Config) {
    let contenido = fs::read_to_string(&config.ruta)
        .expect("No se pudo leer el archivo");

    for linea in contenido.lines() {
        if linea.contains(&config.consulta) {
            println!("{linea}");
        }
    }
}
```

- `lib.rs` expone la lógica como una **API pública** que otros archivos pueden importar con `use minigrep::...`.
- `run` recibe el `Config` por valor y hace todo el trabajo de lectura y búsqueda.
- `main.rs` queda como un caparazón delgado que solo prepara y ejecuta.

## 5. El operador `?` y la propagación de errores

El `expect` dentro de `run` sigue siendo una muleta. Rust tiene una herramienta idiomática para propagar errores hacia arriba: el **operador `?`**. Pero `?` solo funciona en funciones que devuelven `Result`. Cambiemos la firma:

```rust
use std::error::Error;
use std::fs;

pub fn run(config: Config) -> Result<(), Box<dyn Error>> {
    let contenido = fs::read_to_string(&config.ruta)?;

    for linea in contenido.lines() {
        if linea.contains(&config.consulta) {
            println!("{linea}");
        }
    }

    Ok(())
}
```

- `Result<(), Box<dyn Error>>`: la función devuelve un resultado sin valor de éxito, pero con la capacidad de devolver **cualquier** tipo de error.
- `Box<dyn Error>`: un puntero a un error de tipo dinámico; en la práctica, cualquier error de la biblioteca estándar cabe ahí.
- `?`: si la operación devuelve `Err`, lo propaga inmediatamente como retorno de la función; si devuelve `Ok`, extrae el valor y continúa. Es una sintaxis muy humana para manejar el camino del error.
- `Ok(())`: el éxito no necesita devolver datos, solo la confirmación.

## 6. `main`: El director de orquesta

Con la lógica fuera de `main`, este queda limpio y legible:

```rust
use std::env;
use std::process;

use minigrep::Config;

fn main() {
    let argumentos: Vec<String> = env::args().collect();

    let config = Config::new(&argumentos);

    if let Err(error) = minigrep::run(config) {
        eprintln!("Error al ejecutar: {error}");
        process::exit(1);
    }
}
```

- `minigrep::run` y `minigrep::Config`: el binario usa la librería como si fuera externa.
- `if let Err(error) = ...`: si `run` devuelve un error, imprimimos el mensaje y salimos con código de error `1`.
- `process::exit(1)`: termina el programa señalando que algo salió mal. En el último capítulo del proyecto profundizaremos en esta decisión.

:::tip
💡 El `panic!` de `Config::new` todavía puede estallar si faltan argumentos. No te preocupes: lo convertiremos en un `Result` elegante en los próximos capítulos, junto con la llegada de los tests.
:::

## Buenas prácticas

- Una función, una responsabilidad: `Config::new` construye, `run` ejecuta, `main` orquesta.
- Usa `clone()` para datos pequeños y entiende el error E0507 como una lección de ownership.
- Devuelve `Result` con `?` en vez de `panic!` cuando el fallo depende del entorno, como archivos o red.
- Deja `main` delgado y la lógica en la librería: así podrás testearla.

## Resumen rápido

- `Config`: estructura pública con `consulta` y `ruta`.
- E0507: no puedes mover valores fuera de un `Vec`; usa `clone()` o referencias.
- `lib.rs` más `main.rs`: la lógica en la librería, la orquestación en el binario.
- `Result<(), Box<dyn Error>>` más `?`: propagación de errores idiomática.

Nuestro código ya está organizado, pero no hay ni un solo test que lo respalde. En el próximo capítulo cambiamos de marcha y desarrollamos la búsqueda **con tests desde el principio**: primero escribimos la prueba, luego la implementación, y veremos el rojo y el verde del TDD.