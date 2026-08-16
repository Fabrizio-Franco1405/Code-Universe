---
outline: [2, 3]
---

# Cargo: el arquitecto de tu proyecto

Cuando hablamos de Rust, no solo hablamos de un lenguaje: hablamos de un ecosistema completo. En el centro de ese ecosistema vive **Cargo**, el gestor de paquetes y sistema de construcción oficial. Si el compilador es quien traduce tu código, Cargo es quien coordina todo el proceso: crea proyectos, gestiona dependencias, compila, ejecuta, corre tests y hasta publica tus librerías. Es, en pocas palabras, el arquitecto que sostiene tus proyectos.

En el capítulo anterior ya lo usaste sin saberlo. Ahora es momento de conocerlo a fondo para que trabajar con Rust se sienta tan cómodo como escribir el código mismo.

## ¿Qué es Cargo?

**Cargo** es la herramienta que integra todas las tareas repetitivas de un proyecto de Rust en una sola interfaz de comandos. Gracias a él no necesitas configurar compiladores a mano ni memorizar cadenas de flags para cada operación: escribes un comando sencillo y Cargo se encarga del resto.

Esto se traduce en una de las mayores ventajas del lenguaje: la **ergonomía**. Recuerda que uno de los pilares de Rust es *"empoderamiento a través de la ergonomía"*, y Cargo es su manifestación más práctica. Mientras que en otros lenguajes de bajo nivel configurar el entorno es toda una odisea, aquí el entorno viene incluido desde el primer `cargo new`.

## El archivo Cargo.toml

Todo proyecto de Rust gira alrededor de un archivo: `Cargo.toml`. Es el corazón administrativo de tu código. Abre el de tu proyecto anterior y observa su contenido:

```toml
[package]
name = "hola_mundo"
version = "0.1.0"
edition = "2021"

[dependencies]
```

- `[package]`: Define los metadatos de tu proyecto.
- `name`: El nombre del paquete, que coincide con el de la carpeta.
- `version`: La versión del proyecto, siguiendo el estándar **SemVer** (`mayor.menor.parches`).
- `edition`: La edición del lenguaje que usará tu código. Define qué reglas sintácticas aplican.
- `[dependencies]`: El apartado donde se declaran las librerías externas que usará tu proyecto.

:::info Nota
ℹ️ El formato TOML es un lenguaje de configuración sencillo basado en claves y valores, muy legible para los humanos. Si has trabajado con `package.json` o `pyproject.toml`, te sentirás en casa.
:::

## El ciclo de desarrollo

Cargo simplifica el flujo de trabajo diario con una serie de comandos intuitivos. Vamos a recorrer los más importantes:

### 1. Compilar sin ejecutar

```bash
cargo build
```

Este comando compila tu proyecto y genera el ejecutable dentro de la carpeta `target/`. Es útil cuando solo quieres verificar que todo compila.

### 2. Compilar y ejecutar

```bash
cargo run
```

Es el comando estrella del desarrollo: compila si es necesario y ejecuta tu programa inmediatamente. Cuando algo no ha cambiado, Cargo es lo bastante inteligente para no recompilar y ejecuta directamente.

### 3. Verificar sin generar

```bash
cargo check
```

Revisa que el código sea correcto **sin** generar el ejecutable final. Es la opción más rápida y la que usarás para validar tu código mientras trabajas.

:::tip
💡 A medida que tus proyectos crezcan, la compilación tardará más. Por eso la estrategia ganadora es: `cargo check` mientras escribes y `cargo run` cuando quieras ver resultados.
:::

### 4. Compilar en modo release

```bash
cargo build --release
```

Esta variante compila tu código con optimizaciones máximas, pensada para entregar o desplegar. El ejecutable aparecerá en `target/release/` y será notablemente más rápido.

:::warning Advertencia
⚠️ En modo `release` la compilación tarda más porque el compilador invierte tiempo extra en optimizar. No lo uses para el desarrollo diario; reserva las optimizaciones para cuando tu proyecto esté listo.
:::

## Gestionando dependencias

La verdadera magia de Cargo aparece cuando necesitas usar librerías de la comunidad. Para añadir una dependencia solo tienes que ejecutar:

```bash
cargo add nombre_de_la_libreria
```

Cargo descargará la librería, la añadirá a tu `Cargo.toml` y generará un archivo `Cargo.lock` que fija las versiones exactas. Este último archivo garantiza que tu proyecto se compile siempre con las mismas versiones, sin importar en qué máquina se ejecute.

```bash
cargo add serde
```

:::info Nota
ℹ️ El `Cargo.lock` es sagrado en proyectos binarios: asegura la **reproducibilidad**. En librerías se suele ignorar, pero en aplicaciones finales siempre se comparte con el equipo.
:::

## El linter y el formateador

Cargo también te acompaña en el cuidado del estilo de tu código:

- `cargo clippy`: Un linter que analiza tu código y sugiere mejoras para hacerlo más idiomático, seguro y eficiente.
- `cargo fmt`: Formatea tu código automáticamente, unificando la indentación y los espacios para que todo el equipo escriba igual.

```bash
cargo clippy
cargo fmt
```

:::tip
💡 Ejecuta `cargo fmt` y `cargo clippy` antes de cada commit. Es la forma más sencilla de mantener un código limpio y profesional sin esfuerzo consciente.
:::

## Buenas prácticas

- Ejecuta `cargo check` con frecuencia para detectar errores temprano.
- Usa `cargo run` solo cuando quieras ver el resultado real.
- Añade dependencias con `cargo add` en lugar de editar el `Cargo.toml` a mano.
- Conserva el `Cargo.lock` en proyectos binarios.
- Formatea con `cargo fmt` y analiza con `cargo clippy` antes de compartir tu código.

## Resumen rápido

- `Cargo.toml`: configuración del proyecto (nombre, versión, dependencias).
- `cargo build`: compila. `cargo run`: compila y ejecuta.
- `cargo check`: valida sin generar el ejecutable.
- `cargo build --release`: compila optimizado para producción.
- `cargo add`: agrega dependencias de la comunidad.
- `cargo clippy` y `cargo fmt`: cuidan la calidad y el estilo.

Con Cargo dominado, ya tienes las herramientas para construir. En la siguiente parte iniciaremos el camino por los fundamentos del lenguaje, empezando por las variables y la mutabilidad.