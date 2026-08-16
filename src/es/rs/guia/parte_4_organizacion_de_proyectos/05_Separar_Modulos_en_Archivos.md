---
outline: [2, 3]
---

# Separar módulos en archivos

En los capítulos anteriores tus módulos vivían todos dentro de un único archivo, definidos con `mod nombre { ... }`. Eso funciona para aprender, pero imagina una casa entera construida en una sola estancia: tarde o temprano querrás paredes reales. En Rust, cada módulo puede ocupar su propio archivo, y esa separación es lo que convierte a tu proyecto en una estructura profesional.

La buena noticia es que no necesitas aprender casi nada nuevo: el árbol de módulos que ya conoces se traduce directamente en archivos y carpetas. Solo hay que cambiar **dónde** se declara el contenido de cada `mod`. Vamos a verlo paso a paso.

## 1. Moviendo un módulo a su propio archivo

Retomemos el módulo `ventas` del capítulo anterior, declarado dentro de `main.rs`:

```rust
mod ventas {
    pub fn registrar_venta() {
        // ...
    }
}

fn main() {
    ventas::registrar_venta();
}
```

Para moverlo a su propio archivo, creas `src/ventas.rs` y trasladas ahí el contenido del bloque, sin la palabra clave `mod` ni las llaves:

```rust
pub fn registrar_venta() {
    // ...
}
```

Después, en `main.rs` solo declaras la **existencia** del módulo, sin su cuerpo:

```rust
mod ventas;

fn main() {
    ventas::registrar_venta();
}
```

- `mod ventas;`: sin llaves, le dice a Rust "existe un módulo `ventas` y su código vive en `ventas.rs`".
- El archivo `ventas.rs` ya no repite `mod ventas`: el nombre lo da el archivo.
- La llamada desde `main` no cambia en absoluto: la ruta `ventas::registrar_venta()` sigue igual.

Observa que el código que usa el módulo no se entera de la mudanza. Esta es la magia de la organización: mover archivos no debería alterar el comportamiento del programa.

:::tip
💡 Aprovecha esta separación desde que un módulo supera unas pocas docenas de líneas. Cambiar de archivo es trivial al principio, pero mover cientos de líneas a mitad de proyecto no lo es.
:::

## 2. Módulos anidados en carpetas

¿Y si un módulo contiene otros módulos? La estructura de archivos lo refleja con **carpetas**. Un módulo `ventas` que contiene a `descuentos` se convierte en una carpeta `ventas/` con su archivo raíz y un módulo hijo:

```
src/
├── main.rs
└── ventas/
    ├── mod.rs
    └── descuentos.rs
```

- `ventas/mod.rs`: el archivo raíz de la carpeta `ventas`, donde se declaran sus sub-módulos.
- `descuentos.rs`: el código del módulo hijo `ventas::descuentos`.

Dentro de `ventas/mod.rs`, declaras la existencia del hijo:

```rust
pub mod descuentos;
```

Y desde `main.rs` la ruta completa sigue funcionando como siempre: `ventas::descuentos::calcular_descuento()`.

:::info Nota
ℹ️ La versión moderna de Rust (edition 2021) permite alternar la estructura anterior con `ventas.rs` como raíz y un archivo `ventas/descuentos.rs` para los hijos. El estilo con `mod.rs` sigue siendo válido y abundante en el ecosistema; elige uno y mantén la consistencia.
:::

## 3. Un ejemplo completo: binario y librería

Veamos cómo se organiza un proyecto real que mezcla las dos estructuras que conociste en el primer capítulo. Supón una librería con dos módulos:

```
mi_libreria/
├── Cargo.toml
└── src/
    ├── lib.rs
    ├── ventas.rs
    └── clientes.rs
```

El archivo raíz `lib.rs` declara los módulos y los expone públicamente:

```rust
pub mod clientes;
pub mod ventas;
```

Y el resto de los archivos implementa cada módulo. Este patrón es la base de casi toda librería de Rust: una raíz ligera que actúa como índice, y un archivo por responsabilidad.

- `lib.rs`: la raíz, declara y reexporta los módulos de la librería.
- `ventas.rs` y `clientes.rs`: cada uno implementa su área de negocio.
- `pub mod`: hace que los módulos sean visibles para quien use la librería.

## 4. Mantener el árbol en orden

Con la separación en archivos, el árbol de módulos se vuelve **visible** en el explorador de archivos: lo que antes era un plano mental ahora es una estructura física. Eso trae una gran ventaja: puedes ver de un vistazo el tamaño y la organización de cada área del proyecto.

Para conservar ese orden, vale la pena seguir algunas convenciones:

- Un archivo = un módulo = una responsabilidad clara.
- Nombres de archivo en minúsculas, igual que el nombre del módulo.
- Carpetas para agrupaciones reales de módulos, no para decorar.
- Revisa de vez en cuando que los archivos no se vuelvan "testamentos" de cientos de líneas.

:::warning Advertencia
⚠️ Si mueves un módulo a su archivo pero olvidas la declaración `mod ventas;` en la raíz, el código simplemente no existe para el compilador. La declaración sin llaves es la que conecta el archivo con el árbol de módulos.
:::

## Buenas prácticas

- Mueve a un archivo propio cada módulo que crezca, desde el inicio.
- Declara con `mod nombre;` la existencia del módulo en su archivo padre.
- Usa carpetas solo para módulos anidados reales.
- Mantén `main.rs` o `lib.rs` como un índice ligero de módulos.
- Aprovecha `cargo run` y `cargo check` para verificar que cada mudanza no rompió nada.

## Resumen rápido

- `mod ventas;` sin llaves apunta al archivo `ventas.rs`.
- Los módulos anidados usan carpetas: `ventas/mod.rs` + `ventas/descuentos.rs`.
- Mover código a otro archivo no cambia las rutas: el árbol se mantiene.
- `lib.rs` y `main.rs` actúan como raíces del árbol de módulos.
- Un archivo por módulo mantiene el proyecto legible y escalable.

Con esto completas el mapa de la organización de proyectos: crates, módulos, rutas, `use` y archivos separados. En la siguiente parte cambiarás de terreno y explorarás las **colecciones**, los contenedores de datos dinámicos con los que tu código podrá manejar listas, textos y diccionarios sin tallas fijas.