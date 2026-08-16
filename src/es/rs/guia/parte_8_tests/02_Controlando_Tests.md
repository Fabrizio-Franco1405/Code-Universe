---
outline: [2, 3]
---
# Controlando los tests

En el capítulo anterior aprendiste a escribir tests con `#[test]` y las macros de aserción. Ahora que tienes varias pruebas, llega el momento de aprender a **controlarlas**: ejecutarlas por grupos, filtrarlas por nombre, ver sus mensajes y decidir cuáles correr. Un buen runner de tests es como un director de orquesta: sabe cuándo silenciar cada instrumento y cuándo hacerlo sonar.

En este capítulo profundizamos en `cargo test`, la herramienta que ejecuta tus pruebas, y en las opciones que te permiten dominarla por completo. Acá encontrarás los flags que usarás a diario en tus proyectos, sin necesidad de memorizar nada extraño: todos son naturales una vez que entiendes su lógica.

## 1. cargo test: El runner de pruebas

El comando `cargo test` compila tu proyecto en modo de prueba y ejecuta todos los tests que encuentre:

```bash
cargo test
```

La salida típica se divide en dos partes:

```
running 2 tests
test longitud_de_una_palabra ... ok
test longitud_de_una_cadena_vacia ... ok

test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out
```

- `running N tests`: te indica cuántas pruebas se van a ejecutar.
- Cada línea con `test nombre ... ok` es el resultado individual de una prueba.
- La línea final resume el conteo: pasados, fallados, ignorados, medidos y filtrados.

:::tip
💡 Los tests se ejecutan **en paralelo** por defecto para aprovechar todos los núcleos de tu CPU. Cuantas más pruebas tengas, más notarás la diferencia de velocidad.
:::

## 2. Filtrando tests por nombre

Cuando tu proyecto crece, ejecutar todos los tests puede resultar innecesario. `cargo test` acepta un filtro opcional: solo correrá las pruebas cuyo nombre lo contenga:

```bash
cargo test longitud
```

Este comando ejecuta únicamente los tests que incluyan la palabra `longitud` en su nombre. Puedes afinar más:

```bash
cargo test longitud_de_una_cadena
```

- El filtro es una **subcadena**: basta con que el nombre contenga el texto, no tiene que coincidir exactamente.
- Si no hay coincidencias, verás `0 filtered out` y ninguna prueba ejecutada.
- Recuerda que el filtro también funciona a nivel de módulo: `cargo test tests` corre todas las pruebas de ese módulo.

:::info Nota
ℹ️ El filtro te ahorra tiempo de compilación y de ejecución mientras desarrollas una función concreta. Es la herramienta perfecta para el ciclo de "escribo código, corro solo su test, corrijo".
:::

## 3. Viendo los prints con `-- --nocapture`

Por defecto, Cargo captura la salida de cada test, incluidos los `println!`, y solo la muestra si el test falla. Para ver los mensajes de los tests que pasan, debes desactivar esa captura:

```bash
cargo test -- --nocapture
```

- El `--` separa los argumentos de `cargo` de los argumentos que se pasan al binario de tests. Todo lo que va después de `--` es para el runner.
- `--nocapture`: le indica al runner que no capture la salida, así puedes ver los `println!` de tus pruebas en tiempo real.
- Es una herramienta de depuración excelente mientras escribes tests, aunque no conviene abusar de ella en el día a día.

## 4. Ignorando tests: `ignore` y `--ignored`

A veces tienes un test que no debería correr siempre, por ejemplo porque depende de una conexión lenta o de una base de datos. Puedes marcarlo con el atributo `#[ignore]`:

```rust
#[test]
#[ignore]
fn una_prueba_muy_lenta() {
    // ...
}
```

- `#[ignore]`: el test se **salta** en las ejecuciones normales y aparece contado en la columna `ignored`.
- Para ejecutarlos, usa el flag correspondiente:

```bash
cargo test -- --ignored
```

:::warning Advertencia
⚠️ Un test ignorado se olvida con facilidad. Úsalo para pruebas lentas o dependientes del entorno, pero no como un cajón donde esconder tests rotos: los tests rotos deben arreglarse, no ignorarse.
:::

## 5. Ejecución en paralelo

Como ya viste, los tests corren en paralelo usando tantos hilos como núcleos tenga tu máquina. Esto es ideal en la mayoría de los casos, pero a veces tus pruebas comparten recursos y se pisan unas a otras. Para esas situaciones puedes limitar la concurrencia:

```bash
cargo test -- --test-threads=1
```

- `--test-threads=1`: ejecuta los tests de uno en uno, de forma secuencial. Útil cuando las pruebas comparten un archivo, un puerto o un recurso global.
- Si tus tests son independientes entre sí, déjalos correr en paralelo: es la recomendación estándar del ecosistema.

## Buenas prácticas

- Filtra por nombre mientras desarrollas una función concreta: `cargo test nombre_de_la_funcion`.
- Reserva `-- --nocapture` para depurar, no para la ejecución diaria.
- Usa `#[ignore]` solo para pruebas lentas o dependientes del entorno.
- Mantén tus tests independientes entre sí para que el paralelismo funcione sin problemas.

## Resumen rápido

- `cargo test`: ejecuta todos los tests.
- `cargo test filtro`: corre solo los tests cuyo nombre contiene el filtro.
- `cargo test -- --nocapture`: muestra los prints de los tests.
- `#[ignore]` más `cargo test -- --ignored`: pospone y recupera pruebas específicas.
- `--test-threads=1`: desactiva el paralelismo cuando es necesario.

Con el control de `cargo test` bajo el brazo, el siguiente capítulo revela cómo **organizar** los tests: dentro de los módulos con `#[cfg(test)]` y en la carpeta `tests/` para las pruebas de integración.