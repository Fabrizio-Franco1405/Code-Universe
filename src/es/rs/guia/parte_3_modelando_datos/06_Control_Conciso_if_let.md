---
outline: [2, 3]
---

# Control conciso con `if let`

En el capítulo anterior viste que `match` es la herramienta definitiva para manejar enums y `Option<T>`, con la garantía de cubrir todas las variantes. Pero hay situaciones en las que solo te interesa **un patrón concreto** y el resto te da igual. Escribir un `match` completo con todos sus brazos para esos casos es como comprar toda la tienda cuando solo querías un producto.

Para esas ocasiones, Rust ofrece un azúcar sintáctico llamado **`if let`**: una forma abreviada de decir "si el valor coincide con este patrón, haz esto; si no, haz lo otro". Es más corto, más directo y expresa exactamente la intención.

## 1. El caso verboso de `match`

Imagina que quieres mostrar un número solo si existe, e ignorar por completo el caso de ausencia. Con `match` tendrías que escribir los dos brazos aunque solo te importe uno:

```rust
let valor = Some(7);

match valor {
    Some(n) => println!("El número es {n}"),
    None => (), // no hago nada
}
```

Funciona, pero ese `None => ()` es puro ruido: un brazo vacío que solo existe para que el `match` sea exhaustivo. Cada vez que solo te interesa un caso, te ves arrastrando brazos que no aportan nada a la lógica real del programa.

## 2. El azúcar `if let`

`if let` condensa ese código a una sola línea de intención clara. La sintaxis combina un `if` con un patrón de `match`:

```rust
let valor = Some(7);

if let Some(n) = valor {
    println!("El número es {n}");
}
```

- `if let Some(n) = valor`: compara `valor` contra el patrón `Some(n)`.
- Si coincide, `n` se enlaza al contenido y se ejecuta el bloque.
- Si no coincide, simplemente no pasa nada, sin necesidad de un brazo vacío.

El patrón funciona igual que en `match`: puedes desestructurar variantes con datos, enlazar valores y combinar con cualquier patrón que ya conozcas. La diferencia es que no exige cubrir todos los casos: si el patrón no encaja, el bloque se ignora.

:::tip
💡 Piensa en `if let` como un `match` de un solo brazo: perfecto cuando tienes un único caso que te importa y el resto no requiere acción alguna.
:::

## 3. Añadiendo `else`

A veces el caso general sí necesita hacer algo. `if let` acepta una rama `else` que se ejecuta cuando el patrón **no** coincide, exactamente como un `if` normal:

```rust
let valor = Option::<i32>::None;

if let Some(n) = valor {
    println!("El número es {n}");
} else {
    println!("No hay número");
}
```

- Si `valor` es `Some(n)`, se imprime el número.
- Si es `None`, se imprime "No hay número".
- La estructura se lee como una frase: "si hay un valor, úsalo; si no, haz esto".

Esta forma es muy común al leer datos que pueden faltar, como la primera letra de un texto vacío o una posición en una lista. El `else` te da el punto de salida seguro sin escribir un `match` completo.

## 4. `while let`

Existe una hermana de `if let` para los bucles: **`while let`**. Ejecuta un bloque repetidamente **mientras** el patrón siga coincidiendo. Es ideal para procesar colecciones o consumir datos hasta que se agoten:

```rust
let mut numeros = [10, 20, 30].iter();

while let Some(numero) = numeros.next() {
    println!("Procesando {numero}");
}
```

- `numeros.next()` devuelve `Some(...)` mientras queden elementos.
- Cuando se acaba la lista, devuelve `None` y el bucle termina.
- El patrón `Some(numero)` enlaza cada elemento antes de procesarlo.

Sin `while let`, este bucle requeriría un `loop` con un `match` interno o varias comprobaciones manuales. Acá toda la lógica de "sigue mientras haya algo" queda escrita en una sola línea legible.

:::info Nota
ℹ️ `while let` es la forma idiomática de iterar sobre valores que vienen como `Option`, como los `next()` de los iteradores. La verás muchísimo en código real de Rust, sobre todo antes de conocer los iteradores a fondo en capítulos avanzados.
:::

## 5. ¿Cuándo usar `if let` y cuándo `match`?

Ahora que conoces ambas herramientas, la elección se vuelve una cuestión de claridad:

- Usa **`match`** cuando necesites manejar varias variantes o debas ser exhaustivo.
- Usa **`if let`** cuando solo te importe un patrón y el resto pueda ignorarse.
- Si un `if let` con `else` crece y empiezas a añadir más casos, es hora de migrar a `match`.

La regla de oro es que el código comunique su intención. Si al leerlo ves que un `match` tiene muchos brazos vacíos con `()`, `if let` hará que el código respire mejor. Y si un `if let` se llena de ramas `else if`, `match` será más honesto con la complejidad real.

:::warning Advertencia
⚠️ `if let` pierde la exhaustividad de `match`: no hay forma de que el compilador verifique que cubres todos los casos. Esa es su naturaleza, así que úsalo solo cuando esté bien que los casos no cubiertos simplemente se ignoren.
:::

## Buenas prácticas

- Usa `if let` cuando solo te interese un patrón y el resto no requiera acción.
- Añade `else` cuando el caso general necesite un comportamiento por defecto.
- Recuerda `while let` para bucles que consumen `Option` hasta agotarse.
- Migra a `match` si el número de casos relevantes empieza a crecer.
- Aprovecha que los patrones de `if let` desestructuran igual que en `match`.

## Resumen rápido

- `if let` es un `match` de un solo brazo, sin exigir cobertura total.
- `if let patron = valor` ejecuta el bloque solo si el patrón coincide.
- `else` maneja el caso en que el patrón no coincide.
- `while let` repite el bloque mientras el patrón siga encajando.
- `match` para muchos casos; `if let` para un caso puntual.

Con `if let` cerramos el trío de herramientas para modelar datos: structs para agrupar, enums para enumerar y `match`/`if let` para decidir. En la próxima parte de esta travesía dejaremos atrás los datos sueltos para organizar proyectos completos: verás cómo Rust estructura programas con módulos, paquetes y crates.