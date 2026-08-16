---
outline: [2, 3]
---
# Mensajes de error estándar

Estamos en el último capítulo del proyecto y `minigrep` funciona: busca, ignora mayúsculas, maneja errores y tiene tests. Pero un buen programa se distingue en los detalles que un usuario atento nota. Hoy hablaremos de la diferencia entre **imprimir resultados** e **imprimir errores**, y por qué el programa debe tratar esas dos salidas como mundos separados.

Esta distinción, que parece un tecnicismo, es la que permite encadenar herramientas en la terminal como piezas de una tubería. Al final de este capítulo tendrás el `minigrep` completo, un programa digno de llamarse parte del ecosistema.

## 1. Dos canales: `stdout` y `stderr`

Cuando un programa escribe en la terminal, usa dos canales independientes:

- **stdout** (salida estándar): el canal para los **resultados** reales, las líneas que el usuario pidió.
- **stderr** (error estándar): el canal para los **mensajes de error y diagnóstico**.

En Rust, `println!` escribe en stdout y `eprintln!` en stderr:

```rust
println!("Línea encontrada: {linea}"); // stdout: el resultado
eprintln!("No se pudo leer el archivo"); // stderr: el error
```

- `println!`: imprime el resultado que el usuario quiere ver y capturar.
- `eprintln!`: imprime los avisos y errores sin contaminar esa salida.
- A simple vista en la terminal se ven igual, pero por dentro son canales distintos que podemos redirigir por separado.

## 2. Redirigiendo la salida en la terminal

La terminal permite separar ambos canales con redirecciones. El `1>` redirige stdout y el `2>` redirige stderr:

```bash
minigrep rust poema.txt 1> resultados.txt
```

Este comando envía solo las líneas encontradas al archivo `resultados.txt`, dejando cualquier error en la pantalla. También puedes aislar los errores:

```bash
minigrep rust archivo_inexistente.txt 2> errores.txt
```

- `1>`: redirige la **salida estándar** al archivo indicado.
- `2>`: redirige el **error estándar** al archivo indicado.
- Gracias a esta separación, un usuario puede guardar los resultados limpios aunque el programa reporte avisos por otro lado.

:::tip
💡 Ejecuta tu `minigrep` con `cargo run -- rust archivo_inexistente.txt 2> errores.txt`. Abre `errores.txt` y verás el mensaje de error perfectamente aislado de la pantalla.
:::

## 3. Por qué los errores no deben mezclarse

Imagina que un programa escribe sus errores por el mismo canal que sus resultados. Quien quiera procesar la salida (otro programa, un script, un archivo) recibiría basura mezclada con datos válidos. Romper una tubería por un mensaje de error es un fallo de diseño clásico.

- Los resultados deben poder **capturarse** sin contaminación: para guardarlos, pasarlos a otro programa o compararlos.
- Los errores deben **verse** en la terminal mientras los resultados viajan a otro destino.
- Esta disciplina es la diferencia entre una herramienta profesional y un programa de juguete.

:::warning Advertencia
⚠️ ¿Notaste que nuestro `Config::new` aún entra en pánico cuando faltan argumentos? Un pánico imprime su propio mensaje por stderr y corta la ejecución de golpe. Es aceptable para prototipos, pero no es la forma elegante de terminar. Lo corregimos ahora mismo.
:::

## 4. Códigos de salida con `process::exit`

Los programas terminan con un **código de salida**: un número que dice a la terminal si todo fue bien. El `0` significa éxito y cualquier otro valor indica error. Veamos el cierre del programa:

```rust
fn main() {
    let argumentos: Vec<String> = env::args().collect();

    let config = Config::new(&argumentos);

    if let Err(error) = minigrep::run(config) {
        eprintln!("Error al ejecutar: {error}");
        process::exit(1);
    }
}
```

- `process::exit(1)`: termina el programa con código `1`, la señal universal de error.
- `eprintln!`: el mensaje de error viaja por stderr, sin tocar la salida real.
- Si no hay error, `main` termina solo y devuelve `0` implícitamente: éxito silencioso.

Ahora, `Config::new` también debería devolver un `Result` en lugar de paniquear, para que `main` informe del error con clase:

```rust
use std::env;

impl Config {
    pub fn new(argumentos: &[String]) -> Result<Config, &'static str> {
        if argumentos.len() < 3 {
            return Err("Uso: minigrep <consulta> <ruta_del_archivo>");
        }

        let consulta = argumentos[1].clone();
        let ruta = argumentos[2].clone();
        let ignorar_mayusculas = env::var("IGNORE_CASE").is_ok();

        Ok(Config {
            consulta,
            ruta,
            ignorar_mayusculas,
        })
    }
}
```

- `Result<Config, &'static str>`: en el error devolvemos un mensaje de texto simple.
- `return Err(...)`: salimos temprano con la instrucción de uso.
- `Ok(Config { ... })`: en el camino feliz, entregamos la configuración construida.

Y en `main`, el manejador del error se encarga del resto:

```rust
let config = match Config::new(&argumentos) {
    Ok(config) => config,
    Err(mensaje) => {
        eprintln!("{mensaje}");
        process::exit(1);
    }
};
```

## 5. El programa completo final

Reunamos las piezas: `lib.rs` con `Config`, `buscar`, `buscar_sensible_mayusculas` y `run`; `main.rs` como director delgado que lee argumentos, construye la configuración y ejecuta. El resultado es un `minigrep` que:

- Acepta `consulta` y `ruta` con validación y mensaje de uso.
- Lee archivos con errores propagados mediante `?`.
- Busca con o sin distinción de mayúsculas según `IGNORE_CASE`.
- Separa resultados (stdout) de errores (stderr) y termina con códigos correctos.
- Está protegido por una red de tests que corre con `cargo test`.

:::info Nota
ℹ️ Este es tu primer programa completo en Rust, y sigue la misma arquitectura que usan las herramientas reales del ecosistema: binario delgado, librería con la lógica, errores separados y tests. Puedes estar orgulloso de la travesía.
:::

## Buenas prácticas

- Usa `println!` para resultados y `eprintln!` para errores, siempre.
- Piensa en los consumidores de tu salida: alguien podría estar capturándola.
- Termina con `process::exit(1)` ante errores fatales y deja el `0` implícito para el éxito.
- Devuelve `Result` desde las funciones de configuración; reserva el pánico para bugs reales.

## Resumen rápido

- `stdout` más `println!`: los resultados; `stderr` más `eprintln!`: los errores.
- `1>` redirige stdout y `2>` redirige stderr en la terminal.
- Código `0` igual a éxito; cualquier otro valor significa error.
- `minigrep` está completo: argumentos, archivos, búsquedas, entorno, errores y tests.

La travesía del proyecto final llegó a su meta. `minigrep` no solo busca texto: es la prueba viva de todo lo aprendido, desde el ownership hasta el TDD. En los próximos capítulos del ecosistema daremos el siguiente salto: cierres, iteradores y concurrencia, las herramientas que harán tu código más expresivo y veloz.