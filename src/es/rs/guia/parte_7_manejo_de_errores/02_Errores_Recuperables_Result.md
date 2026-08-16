---
outline: [2, 3]
---

# Errores recuperables: `Result`

En el capítulo anterior viste el pánico, el camino de los errores irrecuperables. Pero la gran mayoría de los fallos en un programa real no son catástrofes: son eventos esperables que el código debe manejar. Un archivo que no existe, una entrada con formato inválido, una conexión perdida. Para esas situaciones, Rust te ofrece **`Result<T, E>`**, la herramienta más importante del manejo de errores.

La idea es elegante: en lugar de lanzar excepciones al vacío como hacen otros lenguajes, una función que puede fallar **devuelve** el resultado de su intento, éxito o fracaso, y tú decides qué hacer con él. El compilador, ese riguroso **auditor de seguridad**, te obliga a mirar ese resultado cada vez. Nada de errores que pasan de largo en silencio.

## 1. `Result<T, E>`: El resultado que puede fallar

`Result` es un `enum` genérico con dos variantes, y aquí sí puedes apreciar en vivo el poder de los genéricos del capítulo anterior:

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

- `Ok(T)`: La operación tuvo éxito y guarda el valor esperado, del tipo `T`.
- `Err(E)`: La operación falló y guarda información del error, del tipo `E`.

Cada vez que una función puede fallar, su tipo de retorno lo declara. Así, al ver la firma, ya sabes qué puede pasar y qué datos trae cada caso. Es una comunicación honesta que no existe en lenguajes donde cualquier cosa puede lanzar una excepción en cualquier momento.

## 2. La diferencia con `Option`

Puede que recuerdes a `Option<T>` del capítulo de `enums`: sus variantes eran `Some(T)` y `None`. ¿No son lo mismo? Casi, pero hay una diferencia esencial de intención.

- `Option<T>`: Representa **ausencia**. El valor puede estar o no estar; si no está, no hay nada más que decir.
- `Result<T, E>`: Representa **fracaso**. Cuando el valor no está, hay un motivo, y ese motivo vive en `E`.

Buscar un elemento en un `HashMap` devuelve `Option`: o existe o no existe. Abrir un archivo devuelve `Result`: o se abre o falló, y quieres saber *por qué*. Son dos herramientas complementarias, y elegir la correcta comunica mucho sobre tu diseño.

:::info Nota
ℹ️ Regla rápida: si la ausencia es un resultado legítimo (como no encontrar una clave), usa `Option`. Si la ausencia implica un error que el llamador merece conocer (como no poder abrir un archivo), usa `Result`.
:::

## 3. Manoseando `Result` con `match`

Para saber qué pasó, la forma más directa es un `match` sobre el resultado. Retomemos el ejemplo de leer un archivo, una operación que falla con frecuencia en la vida real:

```rust
use std::fs::File;

fn main() {
    let resultado = File::open("config.txt");

    match resultado {
        Ok(archivo) => println!("Archivo abierto: {:?}", archivo),
        Err(error) => println!("No se pudo abrir: {}", error),
    }
}
```

- `File::open("config.txt")`: Devuelve un `Result<File, std::io::Error>`.
- `match resultado`: Obliga a contemplar ambos casos, éxito y fracaso.
- `Ok(archivo) => ...`: Enlaza el valor interno y lo usa.
- `Err(error) => ...`: Enlaza el error y muestra qué salió mal.

El `match` te obliga a pensar en el caso de error, y ahí está la magia: no puedes olvidarte de él porque el compilador no te deja compilar sin contemplar las dos ramas. La seguridad no depende de tu memoria, sino de la estructura del lenguaje.

## 4. `unwrap` y `expect`: Atajos con cuchillo

A veces, en código de prueba o en situaciones donde estás seguro de que la operación no fallará, usar `match` se siente pesado. Para eso existen dos atajos peligrosamente cómodos: `unwrap` y `expect`.

```rust
let archivo = File::open("config.txt").unwrap();
let archivo = File::open("config.txt").expect("Falta el archivo de configuración");
```

- `unwrap()`: Si es `Ok`, saca el valor; si es `Err`, entra en **pánico** con el mensaje del error.
- `expect("mensaje")`: Igual que `unwrap`, pero con un mensaje propio que mejora la depuración.

Ambos convierten un error recuperable en un pánico. Eso puede ser aceptable en un prototipo o en un `main` sencillo, pero es un arma de doble filo en código de producción: conviertes una falla manejable en una explosión.

:::danger
⚠️ **Usa `unwrap` y `expect` con moderación.** En una biblioteca o en código crítico, lanzar un pánico en un error que el llamador podría haber manejado es romper su confianza. Reserva estos atajos para pruebas y para casos donde el error sea genuinamente imposible.
:::

## 5. El operador `?`

El patrón más elegante de Rust para propagar errores es el operador **`?`**. Su comportamiento es casi mágico: si el `Result` es `Ok`, extrae el valor y continúa; si es `Err`, devuelve ese error automáticamente desde la función en la que te encuentras.

```rust
use std::fs::File;

fn abrir_configuracion() -> Result<File, std::io::Error> {
    let archivo = File::open("config.txt")?;
    Ok(archivo)
}
```

- `File::open(...)?`: Si falla, el error se **propaga** hacia arriba como retorno de la función.
- `-> Result<File, std::io::Error>`: La firma declara que esta función puede fallar igual.
- `Ok(archivo)`: Envuelve el valor para devolver el éxito de forma explícita.

Nota la diferencia con `unwrap`: `?` no entra en pánico, **delega** el problema al llamador. Es la forma en que Rust te permite escribir código limpio y lineal sin sacrificar el manejo cuidadoso de errores, porque el operador solo funciona en funciones que devuelven `Result` (o `Option`).

## 6. Encadenando errores con `?`

La verdadera potencia de `?` aparece cuando lo usas en secuencia: cada paso falla o avanza, y un solo error se propaga cortando la cadena. Así escribes flujos complejos con una claridad asombrosa.

```rust
use std::fs;
use std::fs::File;

fn procesar_archivo(ruta: &str) -> Result<String, std::io::Error> {
    let contenido = fs::read_to_string(ruta)?;
    if contenido.is_empty() {
        return Err(std::io::Error::new(
            std::io::ErrorKind::InvalidData,
            "El archivo está vacío",
        ));
    }
    Ok(contenido)
}
```

- `fs::read_to_string(ruta)?`: Lee el archivo o propaga el error al instante.
- `return Err(...)`: Crea un error propio cuando el contenido no cumple las expectativas.
- `Ok(contenido)`: Solo se llega aquí si todos los pasos anteriores fueron exitosos.

Cada `?` es un mini `match` que decide por ti: éxito, continúa; fallo, abandona. Encadenados, te permiten escribir una lógica lineal donde la rama de error queda escondida y centralizada, en lugar de anidar `match` dentro de `match`.

:::tip
💡 El operador `?` también funciona con `Option`: si la operación devuelve `None`, la función retorna `None` directamente. Es útil en funciones que devuelven `Option` y quieres encadenar búsquedas sin anidar `match`.
:::

## Buenas prácticas

- Prefiere `Result` sobre `panic!` para fallas que el llamador pueda esperar y manejar.
- Deja que el `match` te recuerde contemplar siempre el caso de error.
- Reserva `unwrap` y `expect` para prototipos y pruebas; no para bibliotecas ni producción.
- Usa `?` para propagar errores y mantener tu lógica principal limpia y lineal.

## Resumen rápido

- `Result<T, E>` tiene dos variantes: `Ok(T)` para el éxito y `Err(E)` para el fracaso.
- A diferencia de `Option`, `Result` lleva información sobre **por qué** falló.
- `match` sobre `Result` obliga a contemplar ambos caminos.
- `unwrap` y `expect` extraen el valor o entran en pánico: úsalos con cuidado.
- El operador `?` propaga el error automáticamente hacia el llamador, sin pánico.
- Encadenando `?` escribes flujos complejos con la lógica de error centralizada.

Ya tienes las dos herramientas del manejo de errores: `panic!` para lo irreparable y `Result` para lo manejable. Pero saber cuándo usar cada una es un arte que separa a los buenos diseños de los caóticos. En el próximo capítulo cerramos este tema con la guía definitiva: **cuándo entrar en pánico y cuándo no**.