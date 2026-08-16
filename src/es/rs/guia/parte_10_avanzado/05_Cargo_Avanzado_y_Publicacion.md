---
outline: [2, 3]
---

# Cargo avanzado y publicación

Has llegado al final de la travesía. Desde aquel primer "Hola, mundo" hasta hilos que comparten memoria con seguridad, has recorrido todo lo que hace único a este ecosistema. Pero un programador profesional no solo escribe código: también sabe organizar proyectos grandes, documentarlos y compartirlos con el mundo. Este capítulo final te entrega las herramientas de Cargo para empaquetar tu trabajo, y de paso, el empujón para seguir explorando lo que viene después.

## 1. Workspaces: varios crates, un solo proyecto

Cuando un proyecto crece, conviene dividirlo en varios **crates** más pequeños y enfocados: una librería `motor` y una aplicación `interfaz`, por ejemplo. Un **workspace** de Cargo agrupa varios crates bajo un mismo techo, con un único `Cargo.lock` y un único directorio `target`, de modo que todo se compila y versiona en conjunto.

```
mi_arsenal/
├── Cargo.toml
└── crates/
    ├── motor/
    │   ├── Cargo.toml
    │   └── src/lib.rs
    └── interfaz/
        ├── Cargo.toml
        └── src/main.rs
```

El `Cargo.toml` raíz no contiene código, solo declara el workspace:

```toml
[workspace]
members = ["crates/motor", "crates/interfaz"]
resolver = "2"
```

- `members`: la lista de crates que forman parte del workspace.
- Con `cargo build` desde la raíz se compila todo el proyecto con una sola orden.
- Los crates pueden depender unos de otros usando rutas de paquete como `motor = { path = "../motor" }`.

:::tip
💡 Divide tu proyecto en librerías pequeñas y con responsabilidades claras. Es más fácil de probar, de mantener y de reutilizar en otros proyectos.
:::

## 2. Perfiles de compilación

Cargo compila con dos perfiles principales: **`dev`** (el que usas mientras desarrollas, compilación rápida y sin optimizar) y **`release`** (optimizado al máximo, listo para correr sobre el metal). Cuando el rendimiento importa, el perfil es la diferencia entre un programa lento y uno veloz.

```bash
cargo run
cargo run --release
```

- `dev`: compilación rápida con información de depuración, ideal para iterar.
- `release`: optimizaciones agresivas, la versión que compartirías con otros.

Puedes ajustar el perfil de release en tu `Cargo.toml` para afinar el equilibrio entre velocidad de compilación y de ejecución:

```toml
[profile.release]
opt-level = 3
lto = true
codegen-units = 1
```

- `opt-level = 3`: máximo nivel de optimización.
- `lto`: optimización de tiempo de enlace, que puede hacer tu binario aún más rápido.
- `codegen-units = 1`: le da al compilador más contexto para optimizar, a cambio de compilar más lento.

:::info Nota
ℹ️ Siempre mide tus programas con el perfil `release` antes de sacar conclusiones sobre el rendimiento. Las diferencias con `dev` pueden ser enormes, y los resultados en modo de depuración no son representativos.
:::

## 3. Documentación con cargo doc

Documentar es parte del trabajo, y en Rust la documentación vive dentro del código, junto al dato que explica. Los comentarios con tres barras `///` no solo describen lo que sigue: Cargo los convierte en un sitio web de documentación completo, listo para tus usuarios y para ti mismo.

```rust
/// Calcula el área de un rectángulo.
///
/// # Ejemplos
///
/// ```
/// let area = calcular_area(4, 5);
/// assert_eq!(area, 20);
/// ```
pub fn calcular_area(base: u32, altura: u32) -> u32 {
    base * altura
}
```

- `///`: documenta el elemento que le sigue, con soporte de Markdown.
- Los bloques de código de la documentación se **compilan y ejecutan** durante los tests, así que los ejemplos siempre son reales.
- `cargo doc --open`: genera el sitio y lo abre en tu navegador.
- `cargo test`: también ejecuta los ejemplos de la documentación.

## 4. Publicar en crates.io

Cuando tu librería está pulida, puedes compartirla con todo el ecosistema publicándola en **crates.io**, el registro oficial de crates. Antes de publicar, tu paquete debe estar presentable: un `README` que explique el propósito, una `description` y una `license` en el `Cargo.toml`, y una versión semántica clara.

```bash
cargo package --list
cargo doc --open
cargo publish
```

- `cargo package --list`: te muestra exactamente qué archivos se incluirán en el paquete.
- `cargo publish`: sube el crate a crates.io, donde cualquiera podrá usarlo con una dependencia.

:::warning Advertencia
⚠️ Publicar es un acto de responsabilidad: una vez que un crate se publica, esa versión no puede eliminarse para no romper a quienes ya la usan. Publica solo lo que estés dispuesto a mantener, y haz pruebas antes de dar el salto.
:::

## 5. El siguiente paso: Tu travesía continúa

Esta guía termina, pero tu viaje en este ecosistema apenas comienza. Has construido el **Arsenal del Programador**: ownership, traits, iteradores, punteros inteligentes y concurrencia segura. Ese cimiento te prepara para las siguientes aventuras que el ecosistema ofrece, y una de las más emocionantes es el mundo **`async/await`**, la forma que tiene Rust de manejar miles de tareas en un solo hilo sin sacrificar la velocidad.

Más allá del código está la comunidad: un grupo mundial de personas apasionadas que construye bibliotecas, responde dudas y mantiene vivo el lenguaje. Crates.io, el foro oficial, los repositorios y las conferencias son tu próxima parada para aprender, contribuir y compartir lo que has logrado. Recuerda que este lenguaje nació como la respuesta de un ingeniero a un ascensor averiado; hoy es la base de infraestructura crítica en todo el mundo, y tú ya formas parte de quienes la sostienen.

## Buenas prácticas

- Usa **workspaces** para dividir proyectos grandes en crates pequeños y enfocados.
- Reserva el perfil `release` para evaluar el rendimiento real de tus programas.
- Documenta con `///` desde el principio; los ejemplos compilables son tests gratuitos.
- Antes de publicar, revisa `cargo package --list`, el README y la licencia.
- Sigue aprendiendo: async/await y la comunidad son el siguiente capítulo natural de tu travesía.

## Resumen rápido

- Un **workspace** agrupa varios crates con un solo `Cargo.lock` y `target`.
- `dev` compila rápido; `release` optimiza para correr sobre el metal.
- `cargo doc` convierte tus comentarios `///` en un sitio de documentación.
- `cargo publish` comparte tu crate con el mundo a través de crates.io.
- La comunidad y `async/await` te esperan como siguiente paso.

La travesía no termina acá: cambia de forma. Has aprendido a escribir código seguro, veloz y bien organizado; ahora te toca explorar, crear y compartir. Todo lo aprendido aquí te acompañará en cada línea que escribas a partir de hoy.