---
outline: [2, 3]
---

# Punteros inteligentes

En los capítulos anteriores dominaste el Ownership y las referencias, y viste que el compilador es un auditor implacable con la memoria. Pero hay patrones que las reglas básicas no pueden expresar con comodidad: ¿cómo defines una estructura que se contiene a sí misma? ¿Cómo haces que varios valores compartan la propiedad de un mismo dato? Para esos casos Rust ofrece los **punteros inteligentes**, valores que se comportan como punteros pero con superpoderes.

## 1. Por qué el ownership necesita refuerzos

Un puntero inteligente es un tipo que además de almacenar datos añade un comportamiento, como contar referencias o mover memoria al heap. Todos se apoyan en dos traits fundamentales: **`Deref`**, que permite que se comporten como una referencia normal, y **`Drop`**, que define qué pasa cuando se liberan. Gracias a `Drop`, la limpieza sigue siendo automática: cuando el puntero inteligente sale del alcance, el auditor se encarga de liberar lo que haya dentro.

:::info Nota
ℹ️ Aunque `String` y `Vec` también implementan `Deref` y `Drop`, a los punteros inteligentes los destacamos porque su propósito principal es gestionar el puntero, no el dato.
:::

## 2. `Box<T>`: el dato en el heap

El puntero más simple es **`Box<T>`**, que guarda el dato en el heap y mantiene en el stack un puntero a él. Su primera utilidad es romper el problema del tamaño infinito: imagina una lista que se contiene a sí misma, algo que ningún tipo puede medir en el stack.

```rust
enum Lista {
    Fin,
    Nodo(i32, Box<Lista>),
}

let lista = Lista::Nodo(1, Box::new(Lista::Nodo(2, Box::new(Lista::Fin))));
```

- `Box<Lista>`: en lugar de anidar un `Lista` completo (de tamaño infinito), cada nodo guarda un puntero de tamaño fijo.
- `Box::new(...)`: crea el dato en el heap y devuelve el puntero inteligente.

`Box` también es útil cuando quieres mover un dato enorme sin copiar su contenido: mueves el puntero pequeño, no los datos. Y como implementa `Deref`, puedes usarlo casi como un valor normal:

```rust
let numero = Box::new(5);
println!("{}", *numero + 1); // 6
```

- El operador `*` desreferencia el `Box` igual que lo harías con una referencia común.

## 3. El trait `Deref` y la coerción

El trait **`Deref`** es el que hace posible la magia de que `&Box<T>` funcione donde se espera `&T`. Esta transformación automática se llama **coerción de desreferencia** y se aplica en tiempo de compilación, sin ningún costo en la ejecución:

```rust
fn saludar(nombre: &str) {
    println!("Hola, {nombre}");
}

let nombre = Box::new(String::from("Rust"));
saludar(&nombre); // &Box<String> se convierte en &str
```

- El compilador encadena las desreferencias necesarias: `&Box<String>` → `&String` → `&str`.
- Tú no tienes que escribir la cadena de `*`; el auditor la resuelve por ti.

Gracias a `Deref` y `Drop`, cada puntero inteligente mantiene dos promesas: usarlo se siente como usar un puntero normal, y liberarlo siempre ocurre de forma segura.

## 4. `Rc<T>`: propiedad compartida

El Ownership permite un solo dueño por dato, pero a veces varios lugares necesitan leer el mismo valor sin duplicarlo. **`Rc<T>`** (por *reference counting*, conteo de referencias) resuelve eso: cada vez que clonas el `Rc`, el contador sube; cuando un clon se libera, baja; cuando llega a cero, el dato se destruye.

```rust
use std::rc::Rc;

let a = Rc::new(String::from("compartido"));
let b = Rc::clone(&a);
let c = Rc::clone(&a);

println!("Referencias: {}", Rc::strong_count(&a)); // 3
```

- `Rc::new`: crea el dato con un contador inicial de uno.
- `Rc::clone`: no copia el dato, solo aumenta el contador y entrega otra "mano" que lo sujeta.
- `strong_count`: te dice cuántos dueños hay; el dato vive mientras ese número sea mayor que cero.

Piensa en un libro compartido entre amigos: todos pueden leer el mismo ejemplar (referencia inmutable), y cuando el último lo suelta, se recicla.

:::warning Advertencia
⚠️ `Rc` no es seguro para hilos: su contador no es atómico. Cuando lleguemos a la concurrencia verás a su hermano `Arc`, que hace lo mismo pero pensando en varios hilos.
:::

## 5. `RefCell<T>`: mutabilidad interior

El Ownership exige que para mutar un valor tengas una referencia mutable. **`RefCell<T>`** introduce la **mutabilidad interior**: permite modificar el dato aunque solo tengas una referencia inmutable, trasladando la comprobación de préstamos del tiempo de compilación al tiempo de ejecución.

```rust
use std::cell::RefCell;

let celda = RefCell::new(5);
{
    let mut dato = celda.borrow_mut();
    *dato = 10;
}
println!("{}", *celda.borrow()); // 10
```

- `borrow_mut()`: pide un préstamo mutable; si ya hay otro activo, el programa entra en pánico.
- `borrow()`: pide un préstamo inmutable para leer el valor.

La combinación clásica es **`Rc<RefCell<T>>`**: varios dueños que además pueden modificar el dato compartido. Es un patrón muy usado en estructuras de datos como árboles:

```rust
use std::cell::RefCell;
use std::rc::Rc;

let valor = Rc::new(RefCell::new(0));
let copia = Rc::clone(&valor);
*copia.borrow_mut() += 1;
println!("{}", *valor.borrow()); // 1
```

- `Rc` permite que `valor` y `copia` compartan el dato.
- `RefCell` permite que cualquiera de los dos lo modifique.

:::tip
💡 Regla mnemotécnica: `Rc` multiplica los dueños, `RefCell` permite la mutación, `Box` manda el dato al heap. Combínalos según lo que tu problema pida.
:::

## 6. ¿Cuál elegir?

- `Box<T>`: un solo dueño, dato en el heap, lectura y escritura normales.
- `Rc<T>`: varios dueños de solo lectura, dentro de un mismo hilo.
- `RefCell<T>`: un solo dueño con mutabilidad interior, comprobada en ejecución.
- `Rc<RefCell<T>>`: varios dueños que además pueden mutar, todo dentro del mismo hilo.

En general, prefiere el mecanismo más simple que resuelva tu problema: empieza por `Box`, y solo sube de complejidad cuando el Ownership básico no baste. Recuerda que toda esta potencia sigue al servicio de la seguridad que el auditor garantiza.

## Buenas prácticas

- Usa `Box<T>` para tipos recursivos y para mover datos grandes sin copiarlos.
- Elige `Rc<T>` cuando varios dueños deban leer el mismo dato y no haya hilos.
- Recurre a `RefCell<T>` solo cuando la mutabilidad interior sea realmente necesaria; mover los préstamos a la ejecución elimina garantías del compilador.
- Combina `Rc<RefCell<T>>` para árboles y grafos, pero siempre dentro de un solo hilo.

## Resumen rápido

- Los punteros inteligentes implementan `Deref` (se usan como referencias) y `Drop` (se liberan solos).
- `Box<T>` coloca datos en el heap y rompe la recursión de tipos.
- `Rc<T>` permite propiedad compartida mediante conteo de referencias.
- `RefCell<T>` ofrece mutabilidad interior con comprobación en tiempo de ejecución.
- `Rc<RefCell<T>>` combina ambos para datos compartidos y mutables dentro de un hilo.

Ahora que sabes compartir datos dentro de un solo hilo, la pregunta natural es: ¿y entre varios hilos? En el próximo capítulo descubrirás la **concurrencia sin miedo**, donde el auditor extiende sus garantías al mundo paralelo.