---
outline: [2, 3]
---

# Rutas: Navegando por el árbol de módulos

En el capítulo anterior organizaste tu código en módulos y aprendiste que `pub` abre las puertas de cada habitación. Ahora toca una pregunta práctica: ¿cómo llegamos hasta esas habitaciones? En Rust, cada elemento dentro del árbol de módulos tiene una **ruta** (path) que indica dónde vive, igual que una dirección postal indica dónde vive una persona.

Existen dos formas de referenciar un elemento: mediante una ruta **absoluta**, que parte de la raíz del crate, o mediante una ruta **relativa**, que parte del punto actual del árbol. Elegir una u otra es cuestión de contexto y de claridad, y en este capítulo aprenderás a dominar ambas sin titubeos.

## 1. La sintaxis básica de las rutas

Retomemos el árbol de la tienda del capítulo anterior. Cada elemento se nombra uniendo los módulos por los que pasas con `::`, el mismo operador que ya viste en acción:

```
crate
├── ventas
│   └── descuentos
└── clientes
```

Para llegar a una función `calcular_descuento` dentro de `descuentos`, tienes dos caminos posibles:

```rust
// Ruta absoluta
crate::ventas::descuentos::calcular_descuento();

// Ruta relativa
descuentos::calcular_descuento();
```

- `crate::...`: la ruta **absoluta** comienza siempre en la raíz del crate.
- `descuentos::...`: la ruta **relativa** comienza en el módulo actual.
- `::`: el separador entre niveles, como la barra `/` de un sistema de archivos.

El código que escribes dentro de un módulo "ve" de forma natural a sus módulos hijos, por eso la ruta relativa funciona sin más preámbulos.

## 2. Rutas absolutas con `crate`

La ruta absoluta es la más explícita: parte siempre de `crate`, la palabra clave que representa la raíz de tu crate. Desde cualquier lugar del código, sabes exactamente a qué elemento te refieres.

```rust
mod ventas {
    pub mod descuentos {
        pub fn calcular_descuento(precio: f64) -> f64 {
            precio * 0.9
        }
    }
}

fn main() {
    let total = crate::ventas::descuentos::calcular_descuento(100.0);
    println!("{total}");
}
```

- `crate`: el punto de partida, la puerta principal de la casa.
- `ventas` y `descuentos`: los niveles que recorres hacia abajo.
- `calcular_descuento(100.0)`: el elemento final al que llegas, con sus argumentos.

Las rutas absolutas son robustas: funcionan sin importar desde qué módulo las escribas. Si tu código se mueve de lugar, la ruta sigue apuntando al mismo destino.

:::tip
💡 Al empezar, escribir rutas absolutas con `crate::` te ayudará a entender la estructura del árbol. Es como usar un mapa en lugar de memorizar los atajos: más seguro al principio, más fluido después.
:::

## 3. Rutas relativas con `self` y `super`

Las rutas relativas parten del módulo actual. Dos palabras clave marcan los puntos de referencia: `self`, el propio módulo, y `super`, el módulo padre (un nivel hacia arriba).

```rust
mod ventas {
    fn comision_base() -> f64 {
        5.0
    }

    pub mod descuentos {
        pub fn calcular_descuento(precio: f64) -> f64 {
            let base = super::comision_base();
            precio - base
        }
    }
}
```

- `super::comision_base()`: sube un nivel hasta el módulo `ventas` para usar su función privada.
- `self::...`: referencia el módulo actual, útil cuando el contexto lo hace más legible.
- Con `super` los módulos hijos pueden usar recursos de su padre, como un empleado que consulta la normativa general de la empresa.

Imagina un edificio de oficinas: `self` es tu propia oficina, `super` el pasillo del piso anterior y `crate` la recepción del edificio. Saber dónde estás y a dónde quieres ir determina qué camino eliges.

:::info Nota
ℹ️ Las rutas relativas son más cortas y cómodas, pero dependen del punto donde te encuentres. Si reestructuras tus módulos, una ruta relativa puede romperse antes que una absoluta. Por eso el código público suele preferir rutas explícitas.
:::

## 4. Referenciando distintos tipos de items

Las rutas no solo apuntan a funciones: sirven para cualquier elemento del árbol, desde structs y enums hasta constantes y módulos. Todo lo que vive dentro de un módulo se referencia con la misma sintaxis.

```rust
mod inventario {
    pub const STOCK_MINIMO: u32 = 10;

    pub struct Producto {
        pub nombre: String,
        pub precio: f64,
    }
}

fn main() {
    let minimo = crate::inventario::STOCK_MINIMO;
    let producto = crate::inventario::Producto {
        nombre: String::from("Lámpara"),
        precio: 29.99,
    };
}
```

- Las **constantes** se nombran en MAYÚSCULAS y se acceden como cualquier otro item.
- Los **structs** se llevan a la ruta con su nombre y luego se instancian con `::` seguido del constructor.
- El mismo patrón se repite con enums, funciones y módulos anidados.

Cuando un item es privado, la ruta deja de funcionar: el compilador te avisará con un error de privacidad. Recuerda la regla del capítulo anterior: solo `pub` abre puertas, y las rutas son las llaves para cruzarlas.

:::warning Advertencia
⚠️ Si el compilador te dice que un item es privado, revisa dos cosas: que el elemento tenga `pub`, y que **todos** los módulos intermedios de la ruta también lo tengan. Una sola puerta cerrada detiene todo el camino.
:::

## Buenas prácticas

- Prefiere rutas **absolutas** (`crate::...`) para el código público y reutilizable.
- Usa rutas **relativas** y `super` dentro de un módulo, donde el contexto es claro.
- Mantén el árbol de módulos poco profundo: cuantos menos niveles, más legibles las rutas.
- Si una ruta se vuelve larga, es señal de que pronto conocerás `use` para acortarla.

## Resumen rápido

- `crate::` marca una ruta **absoluta** desde la raíz del crate.
- `self::` referencia el módulo actual; `super::` sube al módulo padre.
- `::` separa niveles, como `/` en un sistema de archivos.
- Las rutas funcionan con funciones, structs, constantes y enums.
- Cada módulo intermedio debe ser `pub` para que la ruta complete el viaje.

Ya sabes llegar a cualquier habitación de la casa. En el siguiente capítulo descubrirás cómo evitar escribir caminos largos una y otra vez con la palabra clave `use`, que acorta tus rutas y hace el código mucho más limpio.