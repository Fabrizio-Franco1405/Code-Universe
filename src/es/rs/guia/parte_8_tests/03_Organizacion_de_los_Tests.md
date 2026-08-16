---
outline: [2, 3]
---
# Organización de los tests

Hasta ahora escribimos pruebas al lado de las funciones, pero a medida que un proyecto crece, la forma en que organizas los tests importa tanto como los tests mismos. Rust distingue dos grandes familias: los **unit tests**, que viven pegados al código que prueban, y los **integration tests**, que prueban el proyecto desde afuera como lo haría un usuario real. Saber cuándo usar cada una es parte del oficio.

En este capítulo verás cómo acomodar ambas familias sin ensuciar tu código de producción y cómo compartir lógica de preparación entre las pruebas de integración. Al finalizar tendrás el mapa completo de la organización de pruebas en este ecosistema.

## 1. Unit tests dentro del módulo

Los unit tests son los más comunes y viven **dentro del archivo** donde se encuentra el código que prueban. La convención es crear un módulo especial al final del archivo:

```rust
fn area(largo: u32, ancho: u32) -> u32 {
    largo * ancho
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn area_de_un_rectangulo() {
        assert_eq!(area(3, 4), 12);
    }
}
```

- `#[cfg(test)]`: es un atributo de configuración que le dice al compilador que este módulo **solo existe** durante la compilación de tests. Al compilar para producción, el módulo desaparece por completo.
- `use super::*;`: trae al alcance las funciones del módulo padre, permitiéndote llamar a `area` sin prefijos.
- Acá está la gran ventaja: los unit tests pueden acceder a **funciones privadas** del módulo, algo que los integration tests no pueden hacer.

:::tip
💡 Como los unit tests viven dentro del archivo, pueden probar detalles internos y funciones privadas. Esa cercanía los hace ideales para verificar el comportamiento de piezas individuales de lógica.
:::

## 2. Integration tests en la carpeta `tests/`

Los integration tests prueban tu proyecto **como un usuario externo**: llaman a tu librería a través de su interfaz pública. Para crearlos no necesitas configuración especial: cualquier archivo dentro de la carpeta `tests/` es automáticamente un integration test.

```
minigrep/
├── Cargo.toml
├── src/
│   └── lib.rs
└── tests/
    └── integracion.rs
```

- Cada archivo en `tests/` es tratado como un crate independiente y se compila por separado.
- No puedes acceder a funciones privadas: solo a la API pública que expones con `pub`.
- Por eso, para usar tu código, el archivo de test importa el crate con `use minigrep::...`.

Un ejemplo típico:

```rust
use minigrep;

#[test]
fn la_biblioteca_encuentra_la_consulta() {
    assert!(minigrep::buscar("rust", "El libro de Rust es genial").contains("Rust"));
}
```

:::info Nota
ℹ️ Los archivos dentro de `src/` se compilan junto a tu librería, mientras que cada archivo de `tests/` es un programa separado. Si ves un error de compilación en `tests/`, recuerda que tu librería ya debe estar exportando con `pub` lo que pruebas.
:::

## 3. Compartiendo código entre tests: La convención `tests/common`

Cuando varios archivos de integración necesitan preparar el mismo escenario (crear datos, levantar un recurso, configurar un estado), repetir el código en cada uno es un desperdicio. La solución es la convención `tests/common`:

```
tests/
├── common/
│   └── mod.rs
├── integracion.rs
└── otro_test.rs
```

- Los archivos dentro de `tests/` **no** se ejecutan como tests si viven en una subcarpeta. Esa es la clave: `common/mod.rs` existe para ser compartido, no para ser ejecutado.
- Para usarlo desde un test, lo importas como módulo:

```rust
mod common;

#[test]
fn algo_con_preparacion() {
    common::preparar_datos();
    // ...
}
```

:::warning Advertencia
⚠️ Si nombras un archivo `tests/common.rs`, Cargo lo tratará como un integration test y no podrás usarlo como módulo compartido. La carpeta `common/` con su `mod.rs` dentro es la convención correcta para compartir código.
:::

## Buenas prácticas

- Pon unit tests en el mismo archivo que el código, dentro de un módulo `#[cfg(test)]`.
- Usa la carpeta `tests/` para probar tu API pública desde afuera, como un usuario real.
- Reutiliza la preparación de datos con la convención `tests/common/mod.rs`.
- Mantén los tests de integración enfocados en comportamiento, no en detalles internos.

## Resumen rápido

- `#[cfg(test)]`: módulo que solo se compila durante los tests.
- Carpeta `tests/`: cada archivo es un integration test independiente.
- Los unit tests prueban el interior; los integration tests prueban la fachada pública.
- `tests/common/mod.rs`: código compartido que no se ejecuta como test.

Con esto completamos la base de los tests, y es momento de poner todo a prueba en el **proyecto final**: un clon didáctico de `grep` llamado `minigrep`. En el próximo capítulo comienza la travesía, aceptando los argumentos de la terminal.