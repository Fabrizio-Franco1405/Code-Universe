---
outline: [2, 3]
---

# Errores irrecuperables: `panic!`

En el capítulo anterior completaste la tríada de la seguridad de memoria con los lifetimes. Ahora cambiamos de frente: los programas no solo deben ser seguros, también deben **fallar bien**. Porque sí, van a fallar: archivos que no existen, datos inesperados, conexiones perdidas. La pregunta no es si fallarán, sino cómo reaccionarás cuando lo hagan.

Rust ofrece dos estrategias para enfrentar los errores, y este capítulo está dedicado a la primera: el **pánico**. Cuando un programa entra en pánico, reconoce que algo irreparable ha ocurrido y se detiene de forma controlada. Es un camino que conviene conocer a fondo, porque el compilador lo tomará por ti en más ocasiones de las que imaginas.

## 1. Dos caminos para los errores

Rust divide los errores en dos grandes familias. La primera son los **irrecuperables**, donde el programa no tiene sentido seguir: se declara el pánico y el proceso termina. La segunda son los **recuperables**, donde el código puede detectar el problema y decidir qué hacer; esos los explorarás en el próximo capítulo con `Result`.

La frontera la decides tú como diseñador, pero hay casos donde el lenguaje la decide por ti. Si el programa intenta leer el elemento en la posición 10 de una lista de 3, no hay una respuesta sensata: el pánico es la única opción razonable.

## 2. ¿Cuándo ocurre un pánico?

Hay dos grandes fuentes de pánico. La primera es tu propio código, cuando invocas explícitamente la macro `panic!` con un mensaje. La segunda son situaciones que el lenguaje detecta como imposibles, y entonces pánico por ti.

```rust
fn main() {
    let lista = vec![1, 2, 3];
    let elemento = lista[10];
}
```

- `vec![1, 2, 3]`: Una lista de tres elementos.
- `lista[10]`: Se accede a una posición inexistente, y el programa entra en pánico.

Otro caso clásico aparece con `Option`: si intentas sacar el valor de un `None` con `unwrap`, el programa entra en pánico. Veremos ese método con más detalle en el capítulo de `Result`, pero ya puedes intuir su poder destructivo.

:::warning Advertencia
⚠️ El acceso con `lista[10]` es el pánico más típico del principiante. En Rust, a diferencia de C, leer fuera de los límites no corrompe memoria: el compilador genera código que lo detecta y detiene el programa de forma segura.
:::

## 3. El mensaje de pánico

Cuando algo entra en pánico, la terminal muestra un mensaje que te dice exactamente qué falló y dónde. Es una información de oro para depurar, y por eso el lenguaje la formatea con cuidado. Ejecuta el programa anterior y verás algo parecido a esto:

```
thread 'main' panicked at src/main.rs:3:18:
index out of bounds: the len is 3 but the index is 10
```

- `thread 'main'`: Indica en qué hilo de ejecución ocurrió el pánico.
- `src/main.rs:3:18`: Archivo, línea y columna exacta del problema.
- `index out of bounds`: La explicación del fallo: índice fuera de los límites.

Esa primera línea es tu mapa del tesoro cuando algo se rompe: te lleva directo al punto exacto del código. Léela siempre, porque el compilador y el runtime ya hicieron el trabajo de investigación por ti.

## 4. `RUST_BACKTRACE`: la huella del desastre

Cuando un pánico ocurre dentro de una función que a su vez fue llamada por otra, el mensaje inicial puede no bastar. Para ver el **camino completo** que llevó hasta el fallo, activas el *backtrace* con una variable de entorno:

```bash
RUST_BACKTRACE=1 cargo run
```

- `RUST_BACKTRACE=1`: Activa el rastreo de la pila de llamadas.
- `cargo run`: Compila y ejecuta el programa con esa configuración.

El resultado es una lista de todas las funciones que estaban en juego cuando ocurrió el pánico, desde la más interna hasta `main`. La lees de arriba hacia abajo: el fallo está en la parte superior, y cada línea siguiente muestra quién llamó a quién.

:::tip
💡 A partir de la versión 1.65 de Rust, el backtrace se muestra automáticamente cuando activas la compilación con `debug`. En perfiles de release no se incluye, así que si necesitas depurar un binario de producción, compílalo en modo `debug` o con los símbolos adecuados.
:::

## 5. El desenrollado de la pila

¿Qué pasa con toda la memoria que el programa estaba usando cuando entró en pánico? Rust realiza un **desenrollado de la pila** (*unwinding*): recorre hacia atrás las llamadas activas, liberando cada recurso y ejecutando las rutinas de limpieza pendientes. Es la forma que tiene el lenguaje de marcharse sin dejar desorden.

- **Desenrollado**: Cada marco de pila se libera en orden inverso, como desarmar una torre de bloques.
- **Destructores**: Los datos que poseían recursos se limpian correctamente, evitando fugas.
- **Abortar**: Existe una alternativa más agresiva que termina el proceso sin limpiar, configurable en `Cargo.toml` para casos extremos.

En la práctica, no necesitas controlar este proceso: Rust lo gestiona por ti. Solo te interesa saber que, cuando el pánico ocurre, el lenguaje se encarga de dejar la memoria limpia y no deja referencias colgando por el camino.

## Buenas prácticas

- Trata el pánico como la excepción, no la regla: es para situaciones que no deberían suceder.
- Usa `panic!` con mensajes descriptivos que expliquen qué invariante se rompió.
- Activa `RUST_BACKTRACE=1` cuando un pánico no te dé pistas suficientes.
- Recuerda que en modo `debug` el backtrace aparece solo, para que depures rápido durante el desarrollo.

## Resumen rápido

- `panic!` declara un **error irrecuperable** y detiene el programa.
- Ocurre por decisión propia (macro `panic!`) o por situaciones imposibles como un índice fuera de rango.
- El **mensaje de pánico** indica archivo, línea y columna del fallo.
- `RUST_BACKTRACE=1` muestra la cadena completa de llamadas que llevaron al fallo.
- El **desenrollado de la pila** libera los recursos de forma limpia durante el pánico.

Ya conoces el lado catastrófico de los errores, pero es el menos habitual en código bien diseñado. La mayoría de las fallas son evitables y predecibles: un archivo que no existe, un formato inválido, una entrada vacía. En el próximo capítulo conocerás `Result`, la herramienta con la que Rust te permite atrapar esas fallas y decidir tú qué hacer con ellas.