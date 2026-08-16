---
outline: [2, 3]
---

# Paquetes y crates

En los capítulos anteriores aprendiste a modelar datos con structs y enums, y a dotarlos de comportamiento con métodos. Todo ese trabajo vivía en un único archivo, pero los proyectos reales crecen sin avisar: llega un momento en que tu casa necesita más de una habitación, y cada habitación, su propio orden. Ese es exactamente el salto que damos ahora: dejar de escribir código en un solo archivo para organizarlo en unidades más grandes.

Esta parte marca un antes y un después en tu travesía. Aquí no aprenderás sintaxis nueva para resolver problemas matemáticos, sino las herramientas que te permiten estructurar proyectos medianos y grandes sin perder la cabeza. La idea central es simple: Rust separa tu código en piezas con responsabilidades claras, y para eso introduce tres conceptos que recorreremos en este capítulo: **crates**, **packages** y **módulos**.

## 1. El crate: La unidad de compilación

Un **crate** es la unidad más pequeña de código que el compilador considera como un todo. Cuando `rustc` recibe código para transformarlo en un programa, lo que recibe realmente es un crate. Podrías imaginarlo como el bloque de construcción fundamental de todo proyecto de Rust.

Todo crate tiene dos posibles formas de vida:

- **Crate binario**: Un programa que se puede ejecutar. Siempre tiene una función `main` que actúa como su puerta de entrada.
- **Crate de librería**: Código pensado para ser reutilizado por otros, sin interfaz de ejecución propia. No necesita `main`.

:::info Nota
ℹ️ A lo largo del curso estuviste creando crates binarios sin saberlo: cada `cargo new` generó uno. Ahora entenderás qué significaba realmente esa palabra en los mensajes del compilador.
:::

## 2. El package: El proyecto completo

Un **package** es un conjunto de uno o más crates que comparten un `Cargo.toml`, el archivo que describe cómo construirlos y qué dependencias usan. Es la "carpeta de proyecto" que Cargo entiende y gestiona.

La regla de oro de los packages es la siguiente: un package puede contener **como máximo un crate de librería** y **tantos crates binarios como quiera**, pero siempre **al menos un crate**. En la práctica, la mayoría de los proyectos de Rust contienen exactamente un crate, ya sea binario o de librería.

La confusión más común es usar ambos términos como sinónimos. Piensa en un restaurante: el **package** es el restaurante entero, con su licencia y su menú; el **crate** es cada cocina concreta donde se prepara la comida. Un restaurante puede tener una cocina principal y, si crece, varias auxiliares.

## 3. ¿Binario o librería? `cargo new --lib`

Cuando creas un proyecto con `cargo new`, Cargo decide por defecto que se trata de un crate binario:

```bash
cargo new mi_proyecto
```

Este comando genera un proyecto cuyo `src/main.rs` contiene la función `main`. Si, en cambio, quieres construir una librería para reutilizar código, añades el flag `--lib`:

```bash
cargo new mi_libreria --lib
```

El resultado será un `src/lib.rs` sin función `main`. La diferencia entre ambas estructuras se nota al instante:

```
mi_proyecto/            mi_libreria/
├── Cargo.toml          ├── Cargo.toml
└── src/                └── src/
    └── main.rs             └── lib.rs
```

- `cargo new nombre`: crea un crate **binario** con `main.rs`.
- `cargo new nombre --lib`: crea un crate de **librería** con `lib.rs`.

:::tip
💡 No te preocupes si ahora te parece menor esta diferencia. Más adelante veremos cómo dividir un binario grande en una librería con toda la lógica, dejando el `main` fino y elegante, una práctica profesional imprescindible.
:::

## 4. La estructura interna de un crate

Todos los crates, sean binarios o librerías, comparten una raíz donde el compilador empieza a leer: el archivo de entrada. En un crate binario es `main.rs`; en uno de librería, `lib.rs`.

Ese archivo raíz no tiene por qué contener todo el código. Al contrario, puede declarar **módulos** que viven en otros archivos, como una casa que declara sus habitaciones en un plano y luego las construye en distintos lugares. Ese plano es exactamente lo que verás en el próximo capítulo, cuando introduzcamos la palabra clave `mod`.

Cuando escribes `cargo build`, Cargo localiza la raíz del crate correspondiente, compila cada pieza declarada y produce el resultado final en `target/`. Es un flujo tan automático que rara vez tendrás que preocuparte por él: tu trabajo es declarar qué existe y dónde.

:::warning Advertencia
⚠️ Un crate binario sin función `main` no compila. Si Cargo te avisa de que falta, revisa que el archivo raíz de tu proyecto binario sea `src/main.rs` y que contenga `fn main()`.
:::

## 5. El `Cargo.toml` como certificado del package

Recuerdas el `Cargo.toml` del capítulo de Cargo: es precisamente la presencia de ese archivo lo que convierte una carpeta en un package. Cargo lo lee para saber qué crates existen y cómo compilarlos:

```toml
[package]
name = "mi_libreria"
version = "0.1.0"
edition = "2021"

[dependencies]
```

- `[package]`: los metadatos del package, el nombre que lo identifica en el ecosistema.
- La existencia de `Cargo.toml` es lo que define que un directorio sea un package.
- Cargo deduce si el crate es binario o librería según qué archivo raíz exista.

Si creas un proyecto binario, no necesitas declarar nada más: `src/main.rs` lo convierte en un crate binario automáticamente. Para las librerías ocurre lo mismo con `src/lib.rs`. Esta magia implícita es parte de la **ergonomía** que hace a este ecosistema tan cómodo de usar.

## Buenas prácticas

- Distingue siempre entre **package** (proyecto con `Cargo.toml`) y **crate** (unidad de compilación).
- Usa `cargo new --lib` cuando quieras reutilizar código en otros proyectos.
- Mantén la raíz del crate (`.rs`) ligera: la lógica real vivirá en módulos.
- Consulta `Cargo.toml` para saber si un proyecto es binario o librería.

## Resumen rápido

- Un **crate** es la unidad de compilación; puede ser **binario** o de **librería**.
- Un **package** es uno o más crates con un `Cargo.toml` común.
- `cargo new` crea binarios; `cargo new --lib` crea librerías.
- La raíz de un crate binario es `main.rs`; la de una librería es `lib.rs`.

Ya conoces los contenedores más grandes del ecosistema. En el siguiente capítulo entraremos en la casa: los **módulos**, las habitaciones donde organizarás tu código, con sus puertas y sus zonas privadas.