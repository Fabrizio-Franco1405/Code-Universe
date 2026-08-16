---
outline: [2, 3]
---
# Variables de entorno

Nuestro `minigrep` ya funciona y está respaldado por tests, pero los buscadores reales suelen tener un superpoder: la búsqueda que ignora mayúsculas y minúsculas. ¿Cómo activar ese modo sin añadir otro argumento complicado a la terminal? La respuesta de la industria es simple y elegante: **una variable de entorno**. Una variable de entorno es un valor que el sistema operativo guarda para todo programa que se ejecute, y Rust puede leerla con la misma naturalidad con la que lee los argumentos.

En este capítulo añadiremos el modo "case insensitive" activado con la variable `IGNORE_CASE`. Y lo haremos sin romper la arquitectura que ya tenemos: `Config` ganará un campo nuevo, `buscar` ganará una hermana, y el TDD volverá a guiar cada paso.

## 1. La idea: Búsqueda sin distinguir mayúsculas

Hasta ahora, `buscar` compara con `contains`, que distingue mayúsculas de minúsculas: buscar "rust" no encuentra "Rust". Queremos una función hermana, `buscar_sensible_mayusculas`, que compare en minúsculas para que las coincidencias ignoren el caso:

- `buscar`: busca tal cual se escribe la consulta.
- `buscar_sensible_mayusculas`: convierte todo a minúsculas antes de comparar.

La función `run` elegirá una u otra según la configuración. Esas dos funciones serán fáciles de probar por separado, justo lo que el TDD del capítulo anterior nos enseñó.

## 2. `std::env::var` y la variable `IGNORE_CASE`

Rust lee variables de entorno con `std::env::var`, que devuelve un `Result`:

```rust
let ignorar_mayusculas = env::var("IGNORE_CASE").is_ok();
```

- `env::var("IGNORE_CASE")`: busca la variable de entorno con ese nombre y devuelve `Ok(valor)` si existe.
- `.is_ok()`: nos interesa solo **si existe**, no su contenido. Si la variable está definida, activamos el modo.
- Esta expresión convierte la presencia de la variable en un booleano, perfecto para configurar el programa.

Para probarlo desde la terminal:

```bash
$env:IGNORE_CASE = "1"   # PowerShell
cargo run -- rust poema.txt
```

:::info Nota
ℹ️ En Linux o macOS usarías `IGNORE_CASE=1 cargo run -- rust poema.txt`, que define la variable solo para ese comando. En Windows, el `$env:` de PowerShell cumple el mismo papel.
:::

## 3. Config y el nuevo campo

Ahora `Config` debe conocer el modo de búsqueda. Añadimos el campo y lo llenamos en `new`:

```rust
use std::env;

pub struct Config {
    pub consulta: String,
    pub ruta: String,
    pub ignorar_mayusculas: bool,
}

impl Config {
    pub fn new(argumentos: &[String]) -> Config {
        if argumentos.len() < 3 {
            panic!("Uso: minigrep <consulta> <ruta_del_archivo>");
        }

        let consulta = argumentos[1].clone();
        let ruta = argumentos[2].clone();
        let ignorar_mayusculas = env::var("IGNORE_CASE").is_ok();

        Config {
            consulta,
            ruta,
            ignorar_mayusculas,
        }
    }
}
```

- El nuevo campo `ignorar_mayusculas: bool` resume la decisión del usuario.
- Se llena una sola vez, en la construcción, y el resto del programa solo lo consulta.
- La sintaxis abreviada `consulta, ruta, ...` copia el valor del campo que lleva su mismo nombre, sin repetirlo dos veces.

## 4. La búsqueda sensible

Implementamos la función hermana con el TDD en mente:

```rust
pub fn buscar_sensible_mayusculas<'a>(
    consulta: &str,
    contenido: &'a str,
) -> Vec<&'a str> {
    let consulta = consulta.to_lowercase();
    let mut resultados = Vec::new();

    for linea in contenido.lines() {
        if linea.to_lowercase().contains(&consulta) {
            resultados.push(linea);
        }
    }

    resultados
}
```

- `consulta.to_lowercase()`: convierte la consulta a minúsculas y la guarda en una nueva variable con el mismo nombre (**shadowing**).
- `linea.to_lowercase().contains(&consulta)`: compara cada línea también en minúsculas.
- El resultado: "RUST" coincide con "rust" y con "Rust".

Ahora `run` elige la función según la configuración:

```rust
let resultados = if config.ignorar_mayusculas {
    buscar_sensible_mayusculas(&config.consulta, &contenido)
} else {
    buscar(&config.consulta, &contenido)
};

for linea in resultados {
    println!("{linea}");
}
```

- El `if` funciona como **expresión**: devuelve el resultado de una rama u otra.
- `config.ignorar_mayusculas` es la única llave que decide el camino.
- `buscar` se mantiene intacta, con sus tests originales a salvo.

## 5. Tests para ambas funciones

El TDD vuelve a la escena: añadimos pruebas para la nueva función, cubriendo ambos comportamientos:

```rust
#[test]
fn la_busqueda_sensible_ignora_mayusculas() {
    let contenido = "\
Rust es seguro.
Sin coincidencias aquí.";
    let consulta = "RUST";

    assert_eq!(
        buscar_sensible_mayusculas(consulta, contenido),
        vec!["Rust es seguro."]
    );
}
```

- El test busca "RUST" en mayúsculas dentro de un texto donde aparece "Rust".
- La función hermana debe devolver la línea, demostrando que ignora el caso.
- Con este test y el original, cada `cargo test` verifica que **ambas** búsquedas cumplen su contrato.

:::warning Advertencia
⚠️ Observa que `buscar_sensible_mayusculas` **no** modifica las líneas devueltas: sigue devolviendo la línea original. Convertir a minúsculas sirve solo para comparar, nunca para transformar el resultado. Si devolvieras la línea en minúsculas, el programa mostraría texto alterado.
:::

## Buenas prácticas

- Lee variables de entorno en la construcción de `Config`, no dispersas por el código.
- Usa `.is_ok()` cuando solo te importe si la variable existe, no su contenido.
- Mantén las funciones de búsqueda puras y separadas: es fácil probarlas y elegir entre ellas.
- No transformes los datos de salida: las minúsculas son solo una herramienta de comparación.

## Resumen rápido

- `std::env::var("IGNORE_CASE")`: lee una variable de entorno y devuelve un `Result`.
- `.is_ok()`: convierte "existe" en un booleano de configuración.
- `to_lowercase()`: comparación sin distinguir mayúsculas.
- `buscar` y `buscar_sensible_mayusculas`: dos contratos verificados por tests.

Con el modo case insensitive funcionando, `minigrep` ya hace todo lo que promete. Solo queda pulir la experiencia: separar los mensajes de error de la salida real y terminar el programa con códigos de salida profesionales. Es la última pieza del viaje, y la vemos en el próximo capítulo.