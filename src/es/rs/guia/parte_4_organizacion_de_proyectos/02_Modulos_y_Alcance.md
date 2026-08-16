---
outline: [2, 3]
---

# Módulos y alcance

En el capítulo anterior conociste los contenedores más grandes del ecosistema: los crates y los packages. Ahora es momento de entrar en la casa y organizar sus habitaciones. Esas habitaciones se llaman **módulos**, y son la herramienta principal de Rust para dividir un proyecto en piezas con sentido propio.

Los módulos cumplen dos funciones que se complementan: por un lado te ayudan a **organizar** el código en grupos lógicos y legibles; por otro, controlan la **privacidad**, es decir, quién puede acceder a qué. Es la diferencia entre dejar la puerta de tu despacho abierta para que todos vean tus apuntes, o cerrarla con llave. No te preocupes si al principio la sintaxis parece adicional; en pocos minutos verás la enorme claridad que aporta.

## 1. Declarando módulos con `mod`

Imagina una oficina donde cada equipo tiene su propia sala: ventas, finanzas y soporte. En Rust, cada sala se declara con la palabra clave `mod`:

```rust
mod ventas {
    fn registrar_venta() {
        // ...
    }
}

mod finanzas {
    fn calcular_impuestos() {
        // ...
    }
}
```

- `mod ventas`: declara un módulo llamado `ventas`.
- `{ ... }`: encierra el contenido del módulo, sus funciones, structs o constantes.
- Cada módulo es como una habitación: su contenido vive **dentro** de él y no se ve desde fuera sin permiso.

Por defecto, los módulos se anidan dentro de la raíz del crate. Puedes crear módulos dentro de módulos, formando un árbol que crece tanto como tu proyecto lo necesite.

:::info Nota
ℹ️ El nombre de un módulo define también su **espacio de nombres**: dos funciones llamadas igual en módulos distintos no chocan, porque cada una vive en su propia habitación.
:::

## 2. El árbol de módulos

Los módulos forman una estructura jerárquica conocida como el **árbol de módulos**. La raíz de ese árbol es el archivo de entrada del crate (`main.rs` o `lib.rs`), y cada `mod` cuelga de él como una rama.

Para un proyecto de una tienda, el árbol podría verse así:

```
crate (raíz)
├── ventas
│   └── descuentos
├── inventario
└── clientes
```

Esta organización replica la del mundo real: la tienda tiene un área de ventas, dentro de ella un sistema de descuentos, un área de inventario y otra de clientes. Cuando alguien revisa tu código, ve de un vistazo dónde está cada cosa, sin necesidad de buscar en cientos de líneas.

- La **raíz** del árbol siempre es el archivo de entrada del crate.
- Cada `mod` añade un nivel de profundidad.
- Los módulos pueden contener otros módulos, como cajas dentro de cajas.

## 3. Privacidad por defecto

Aquí aparece una de las decisiones de diseño más características de Rust: **todo es privado por defecto**. Una función, un struct o una constante declarada dentro de un módulo no puede usarse desde fuera de ese módulo, a menos que lo permitas explícitamente.

Intenta usar la función del ejemplo anterior desde la raíz:

```rust
mod ventas {
    fn registrar_venta() {
        // ...
    }
}

fn main() {
    ventas::registrar_venta(); // ERROR: la función es privada
}
```

El compilador se negará. Y lo hace con una razón poderosa: si algo es privado, significa que puedes cambiar su implementación sin avisar a nadie, porque nadie más depende de ello. Es la base de los sistemas robustos: los detalles internos se esconden, y la parte pública se convierte en un contrato estable.

## 4. Abriendo puertas con `pub`

Cuando un elemento debe ser visible más allá de su módulo, se marca con la palabra clave `pub`:

```rust
mod ventas {
    pub fn registrar_venta() {
        // ...
    }

    fn calcular_comision() {
        // ...
    }
}

fn main() {
    ventas::registrar_venta(); // OK: la función es pública
}
```

- `pub fn`: hace que la función sea visible y llamable desde fuera del módulo.
- Sin `pub`, todo permanece privado: el código que no se comparte es código que no se rompe.
- `ventas::registrar_venta()`: la sintaxis `::` permite navegar hacia el interior de un módulo, un tema que veremos a fondo en el próximo capítulo.

La privacidad no es una restricción caprichosa: es un **contrato**. Lo público es lo que prometes mantener; lo privado es libre de evolucionar. Cuanto más estricto seas al marcar `pub`, más fácil será modificar tu código en el futuro sin quebrar a quienes lo usan.

:::warning Advertencia
⚠️ El error más común al empezar es olvidar el `pub` y preguntarse por qué "la función no existe". Recuerda que, si algo está en otro módulo, tienes que pedirlo explícitamente: sin `pub`, es invisible desde fuera.
:::

## 5. El control del alcance (scope)

Los módulos también ordenan qué nombres son visibles en cada punto del código, el famoso **alcance** o scope. Cuando escribes `ventas::registrar_venta()`, estás diciéndole al compilador: "busca la función `registrar_venta` dentro de la habitación `ventas`".

Esta estructura evita colisiones de nombres. En una oficina pueden existir dos carpetas llamadas "informe", siempre que estén en habitaciones distintas:

```rust
mod ventas {
    pub fn informe() {
        // ...
    }
}

mod finanzas {
    pub fn informe() {
        // ...
    }
}

fn main() {
    ventas::informe();
    finanzas::informe();
}
```

Aquí tienes dos funciones `informe` que conviven sin conflicto gracias a sus módulos. Escribir la ruta completa cada vez resulta incómodo, claro, y por eso en dos capítulos más descubrirás la palabra clave `use`, que acorta estos caminos de un plumazo.

:::tip
💡 Piensa en los módulos como **archivadores etiquetados** de una oficina. Mientras cada documento esté en su archivador correcto, puedes tener nombres repetidos sin miedo a perderte, y cualquiera que entre sabrá dónde buscar.
:::

## Buenas prácticas

- Agrupa código relacionado en un módulo, no módulos por archivo sin criterio.
- Marca con `pub` únicamente lo que realmente debe ser accesible desde fuera.
- Mantén la privacidad estricta: lo interno debe poder cambiar sin romper contratos.
- Usa nombres de módulo cortos, en minúsculas y descriptivos.

## Resumen rápido

- `mod nombre { ... }` define un módulo, una habitación lógica de tu código.
- Los módulos forman un **árbol** cuya raíz es `main.rs` o `lib.rs`.
- Todo es **privado por defecto**: solo lo marcado con `pub` es visible fuera.
- `::` navega hacia el interior de un módulo.
- Los módulos evitan colisiones de nombres y protegen el alcance.

Ya tienes las habitaciones y sabes cerrar sus puertas. En el siguiente capítulo veremos cómo moverte por la casa con las **rutas**: los caminos absolutos y relativos para llegar a cualquier habitación del árbol de módulos.