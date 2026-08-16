---
outline: [2, 3]
---
# Desarrollando con TDD

En el capítulo anterior dejamos la búsqueda incrustada dentro de `run`, imposible de probar de forma aislada. Para corregirlo vamos a usar la estrategia que los profesionales llaman **TDD** (Test Driven Development, desarrollo guiado por pruebas): escribir el test primero, verlo fallar, implementar la solución mínima y luego refactorizar. Este ciclo de rojo, verde y refactor convierte la escritura de pruebas en un motor de diseño, no en un trámite final.

`minigrep` va a separar la búsqueda en una función pura llamada `buscar`, que recibe una consulta y un texto, y devuelve las líneas que contienen la consulta. Así podremos probarla sin tocar archivos ni terminal, y después enchufarla a `run` sin sorpresas.

## 1. ¿Qué es TDD?

El TDD invierte el orden natural del principiante. En lugar de "primero el código, después los tests", el flujo es:

- **Rojo**: escribes un test que describe el comportamiento deseado y lo ves fallar.
- **Verde**: implementas el mínimo necesario para que el test pase.
- **Refactor**: mejoras el código confiando en que el test te protege.

Ese primer fallo no es un fracaso: es una señal de que tu test realmente mide algo. Un test que pasa desde el inicio podría estar pasando por las razones equivocadas.

:::tip
💡 Escribir el test antes de la función te obliga a decidir primero el **nombre** y la **firma** de la función. Esa pequeña disciplina de diseño vale oro cuando el proyecto crece.
:::

## 2. Rojo: El test que falla

Añadimos un módulo de tests al final de `lib.rs` con una prueba que aún no puede pasar porque `buscar` no existe:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn buscar_devuelve_las_lineas_con_la_consulta() {
        let contenido = "\
Rust es seguro.
más allá del ascensor.
El auditor de seguridad trabaja.";
        let consulta = "seguro";

        assert_eq!(buscar(consulta, contenido), vec!["Rust es seguro."]);
    }
}
```

- La prueba define un `contenido` de tres líneas y una `consulta` que solo aparece en la primera.
- Esperamos que `buscar` devuelva un `Vec` con las líneas que coinciden.
- Al ejecutar `cargo test`, el compilador se queja: "cannot find function buscar in this scope". Ese es el rojo, y es exactamente lo que queremos ver.

```bash
cargo test
```

## 3. Verde: La implementación mínima

Ahora escribimos `buscar` de la forma más directa posible para que el test pase:

```rust
pub fn buscar<'a>(consulta: &str, contenido: &'a str) -> Vec<&'a str> {
    let mut resultados = Vec::new();

    for linea in contenido.lines() {
        if linea.contains(consulta) {
            resultados.push(linea);
        }
    }

    resultados
}
```

- `pub fn buscar`: la exponemos para poder probarla desde los tests y usarla desde `run`.
- `'a`: un **lifetime** que garantiza que las líneas devueltas viven tanto como `contenido`. No te preocupes si aún no dominas los lifetimes: más adelante los veremos en profundidad; aquí solo decimos "las referencias devueltas se originan en el texto de entrada".
- `contenido.lines()`: itera sobre las líneas.
- `linea.contains(consulta)`: la condición que decidió el test.
- `resultados.push(linea)`: acumula la línea coincidente.

Vuelve a ejecutar `cargo test`:

```
running 1 test
test tests::buscar_devuelve_las_lineas_con_la_consulta ... ok
```

El punto verde ha llegado. La función hace exactamente lo que el test exige, ni más ni menos.

## 4. Refactor: Enchufando buscar a `run`

Con la prueba verde, refactorizamos: reemplazamos la lógica duplicada dentro de `run` por una llamada a `buscar`:

```rust
pub fn run(config: Config) -> Result<(), Box<dyn Error>> {
    let contenido = fs::read_to_string(&config.ruta)?;

    for linea in buscar(&config.consulta, &contenido) {
        println!("{linea}");
    }

    Ok(())
}
```

- `buscar` ahora es la única dueña de la lógica de búsqueda.
- `run` se encarga de leer el archivo e imprimir los resultados.
- Cada ejecución de `cargo test` vuelve a verificar que el refactor no rompió nada.

:::info Nota
ℹ️ Prueba el programa completo con `cargo run -- seguro poema.txt`. Deberías ver exactamente la línea que contiene "seguro". Si el refactor hubiera roto algo, el test lo habría señalado al instante.
:::

## Buenas prácticas

- Sigue el ciclo rojo-verde-refactor: el rojo es parte del proceso, no un error.
- Escribe tests que describan el comportamiento, no los detalles de implementación.
- Mantén las funciones de búsqueda **puras**: que no toquen archivos ni terminal, para que los tests sean rápidos y deterministas.
- Refactoriza con frecuencia, confiando en tu red de pruebas.

## Resumen rápido

- TDD: escribir el test primero, verlo fallar, implementar y refactorizar.
- `buscar`: función pura que devuelve las líneas con la consulta.
- `lifetime 'a`: las referencias devueltas viven tanto como `contenido`.
- `cargo test` es tu red de seguridad en cada refactor.

`minigrep` ya busca con tests de por medio, pero hay una mejora clásica en el horizonte: la búsqueda que ignora mayúsculas y minúsculas. En el próximo capítulo la añadimos con una **variable de entorno**, sin tocar la lógica que acabamos de consolidar.