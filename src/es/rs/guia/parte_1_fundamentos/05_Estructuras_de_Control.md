---
outline: [2, 3]
---

# Estructuras de control

Hasta ahora nuestros programas han sido guiones lineales: se ejecutan línea por línea, de arriba hacia abajo, y se acabó. Pero el software real necesita **decidir** y **repetir**. Las estructuras de control son las herramientas que le dan ese superpoder a tu código, y en Rust tienen un sabor especial: muchas de ellas producen valores, como las expresiones que aprendiste en el capítulo de funciones.

Este capítulo cubre los cuatro cimientos del control de flujo: `if` para decidir, y `loop`, `while` y `for` para repetir. No te preocupes si al principio te parecen muchos: son piezas que usarás en prácticamente todos tus programas futuros.

## 1. `if` y `else`: decidir

La estructura `if` ejecuta un bloque de código solo si una condición es verdadera. En Rust, la condición **no necesita paréntesis** y debe ser siempre un `bool`, es decir, `true` o `false`:

```rust
let temperatura = 35;

if temperatura > 30 {
    println!("Hace calor");
} else {
    println!("Está agradable");
}
```

- `if temperatura > 30`: Evalúa la condición. Si es verdadera, ejecuta el primer bloque.
- `else`: El bloque que se ejecuta cuando la condición es falsa.
- La comparación `>` devuelve un `bool`, exactamente lo que `if` espera.

También puedes encadenar condiciones con `else if`, útil cuando hay más de dos caminos:

```rust
if nota >= 90 {
    println!("Excelente");
} else if nota >= 70 {
    println!("Aprobado");
} else {
    println!("A estudiar más");
}
```

:::warning Advertencia
⚠️ En Rust, el `if` solo acepta condiciones de tipo `bool`. A diferencia de otros lenguajes, no puedes escribir `if nota { ... }` esperando que un número distinto de cero se interprete como verdadero. El compilador te corregirá al instante.
:::

## 2. `if` como expresión

Aquí está el sabor especial de Rust: como las estructuras de control son **expresiones**, un `if` puede devolver un valor que asignas a una variable. Cada rama debe producir el mismo tipo:

```rust
let estado = if temperatura > 30 { "caluroso" } else { "fresco" };
```

- El `if` completo se evalúa como un valor: `"caluroso"` o `"fresco"`.
- Ese valor queda guardado en la variable `estado`.
- Las ramas terminan en una expresión **sin `;`**, igual que en las funciones.

:::tip
💡 Usa el `if` como expresión para asignar valores de forma elegante y concisa. Es más legible que declarar la variable vacía y luego asignarla dentro de cada rama.
:::

## 3. `loop`: repetición infinita

El bucle `loop` repite un bloque de código para siempre, hasta que el programa decida salir con `break`. Es como una cinta que no termina:

```rust
loop {
    println!("Dando vueltas...");
    break;
}
```

- `loop { ... }`: Repite el bloque indefinidamente.
- `break`: Detiene el bucle y sale de él. Sin él, el programa nunca terminaría.

Y como todo en Rust, `loop` también puede devolver un valor con `break`:

```rust
let mut intentos = 0;
let resultado = loop {
    intentos += 1;
    if intentos == 3 {
        break intentos * 10;
    }
};
```

- `break intentos * 10`: Detiene el bucle y entrega ese valor como resultado. `resultado` valdrá `30`.
- `continue`: También existe; en lugar de salir del bucle, salta directamente a la siguiente vuelta, saltándose lo que quede de la iteración.

## 4. `while`: repetir mientras se cumpla una condición

El bucle `while` repite mientras una condición sea verdadera, y se detiene en cuanto deja de serlo. Es el bucle ideal cuando no sabes cuántas vueltas darás:

```rust
let mut contador = 0;

while contador < 3 {
    println!("Vuelta {}", contador);
    contador += 1;
}
```

- `while contador < 3`: La condición se evalúa al inicio de cada vuelta; `contador += 1` la va agotando hasta que falla y el bucle termina.

A diferencia de `loop`, `while` no necesita `break` para terminar: la condición se encarga de eso. Pero sí puedes usar `break` y `continue` dentro de él cuando quieras salir o saltar de forma anticipada.

:::info Nota
ℹ️ La condición de `while` debe ser un `bool`, igual que en `if`. Si nunca se vuelve falsa (por ejemplo, si olvidas incrementar el contador), tendrás un bucle infinito y tu programa quedará atrapado.
:::

## 5. `for`: recorrer rangos y colecciones

El bucle `for` es el más cómodo y el más usado en Rust: recorre cada elemento de una colección o de un **rango**. Para crear un rango de números se usa la sintaxis `0..n`, que incluye el inicio pero **no** incluye el final:

```rust
for i in 0..3 {
    println!("Iteración {}", i);
}
```

- `0..3`: Un rango que genera los números `0, 1, 2`. El `3` no se incluye.
- `i`: Toma el valor de cada número, uno por vuelta.

```
Iteración 0
Iteración 1
Iteración 2
```

La misma mecánica funciona sobre colecciones como los arrays que viste en el capítulo de tipos:

```rust
let dias = ["lunes", "martes", "miércoles"];

for dia in dias {
    println!("Hoy es {}", dia);
}
```

- `for dia in dias`: Recorre el array elemento por elemento, sin necesidad de índices.
- `dia`: En cada vuelta toma un valor del array, de principio a fin.

## Buenas prácticas

- Usa `if` como expresión para asignar valores según condiciones.
- Reserva `loop` para repeticiones que necesitas controlar con `break` a mano.
- Usa `while` cuando la repetición dependa de una condición variable.
- Prefiere `for` para recorrer rangos y colecciones: es el más seguro y legible.
- Cuidado con las condiciones que nunca se vuelven falsas: terminan en bucles infinitos.

## Resumen rápido

- `if` / `else if` / `else` deciden qué bloque ejecutar, con condiciones de tipo `bool`.
- El `if` es una expresión: cada rama devuelve un valor sin `;`.
- `loop` repite para siempre; `break` sale y `continue` salta a la siguiente vuelta.
- `while` repite mientras la condición sea verdadera.
- `for i in 0..n` recorre un rango; `for x in coleccion` recorre sus elementos.
- `0..n` incluye el inicio pero excluye el final.

Con estas estructuras tu código ya puede decidir y repetir, que es la esencia de casi cualquier programa real. En el siguiente capítulo comenzaremos el tema más importante de todo Rust: el **Ownership**, la regla que le da a este lenguaje su fama de seguro y veloz al mismo tiempo.