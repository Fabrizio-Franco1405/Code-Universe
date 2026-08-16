---
outline: [2, 3]
---

# Variables y mutabilidad

En el capítulo anterior viste tu primer programa en acción y descubriste que `cargo` es el arquitecto de tus proyectos. Ahora es momento de hablar de los cimientos mismos de todo programa: las **variables**, esos cajones donde guardamos datos para usarlos más adelante.

En Rust, sin embargo, guardar un dato no es lo mismo que tener libertad para cambiarlo cuando quieras. El lenguaje introduce una idea que puede sorprenderte al principio: la **inmutabilidad por defecto**. No te preocupes si te parece extraño, en este capítulo entenderás por qué esta "rigidez" es en realidad una de tus mejores aliadas.

## 1. Declarando variables con `let`

Para declarar una variable en Rust se usa la palabra clave `let`:

```rust
let edad = 30;
let nombre = "Ada";
```

- `let`: La palabra clave que crea una nueva variable.
- `edad` y `nombre`: Los nombres que elegimos para nuestros cajones. Deben ser descriptivos.
- `=` y el valor: Asignan el dato inicial a la variable.

El compilador, ese riguroso **auditor de seguridad** del que hablamos en la visión general, deduce el tipo de cada variable por sí solo. No tienes que decírselo; él mira el valor y lo infiere. En el próximo capítulo exploraremos los tipos de datos a fondo.

## 2. Inmutabilidad por defecto

Aquí viene la gran diferencia con otros lenguajes: **por defecto, una variable en Rust no puede cambiar de valor**. Una vez que le asignas un dato con `let`, ese dato queda "sellado" hasta que la variable deje de existir.

Observa qué pasa si intentas modificarla:

```rust
let años = 5;
años = 6; // ERROR: no puedes asignar dos veces a una variable inmutable
```

El compilador se negará a generar el ejecutable y te mostrará un mensaje claro: *"cannot assign twice to immutable variable"*. Esta es la filosofía de la **detección temprana**: el error se descubre al compilar, no cuando el programa ya está corriendo.

¿Por qué tanto drama con un simple `=`? Porque un dato que nunca cambia es imposible de corromper por accidente. Si una variable no puede modificarse, no existe la posibilidad de que otro fragmento de código la "estropee" sin que te des cuenta.

:::warning Advertencia
⚠️ Si vienes de lenguajes donde todo es mutable por defecto, esta restricción puede frustrarte al principio. Respira: es una decisión deliberada del lenguaje para protegerte de errores sutiles, y en pocos capítulos la sentirás natural.
:::

## 3. Haciendo variables mutables con `mut`

Claro que el lenguaje no te quita la posibilidad de cambiar un valor; solo te obliga a ser explícito al respecto. Para declarar una variable que puedas modificar, antepones la palabra clave `mut`:

```rust
let mut puntos = 0;
puntos = 10;
puntos = puntos + 5;
```

- `mut`: Abreviación de *mutable*. Le dice al compilador: "esta variable sí cambiará a lo largo del programa".
- `puntos = puntos + 5`: Toma el valor actual, le suma 5 y guarda el resultado.

Es como firmar un permiso escrito: solo tú decides qué variables pueden mutar. Si algo cambia, es porque lo pediste explícitamente. Esto vuelve el código mucho más fácil de leer y de razonar, porque cada mutación es un acto deliberado y visible.

## 4. `const` vs `let`

Existe otra forma de guardar valores inmutables: la palabra clave `const`, que declara una **constante**.

```rust
const VELOCIDAD_MAXIMA: u32 = 120;
```

- `const`: Declara una constante que nunca cambiará, durante todo el programa.
- `VELOCIDAD_MAXIMA`: Por convención, las constantes se nombran en MAYÚSCULAS.
- `: u32`: Las constantes **siempre** requieren anotar el tipo de forma explícita.

A diferencia de `let`, una constante no es un cajón que puedes abrir: es un valor fijo, grabado directamente en el código, que no cambia jamás. Además, las constantes se pueden declarar en cualquier ámbito, incluso fuera de las funciones, cosa que las variables de `let` no permiten.

:::info Nota
ℹ️ Usa `const` para valores fijos y conocidos (como configuraciones o límites) y `let` para datos que pertenecen a la lógica del programa. La regla es simple: si no va a cambiar jamás, es candidata a `const`.
:::

## 5. Shadowing: sombrear variables

Ahora viene un mecanismo que suele confundir: el **shadowing**. Puedes declarar una variable nueva con el mismo nombre que una anterior, y la nueva "sombrea" a la vieja, como si le tapara la luz. Para esto no hace falta `mut`.

```rust
let numero = 5;
let numero = numero + 2; // la nueva variable "tapa" a la anterior
let numero = numero * 2; // y otra vez, con su valor ya transformado
```

- La primera `numero` guarda `5`.
- La segunda `numero` es una variable distinta que toma el valor `7` (5 + 2).
- La tercera toma `14` (7 * 2).

El resultado final es `14`, pero ojo: en realidad hemos creado tres variables distintas, cada una "tapando" a la anterior. Es un mecanismo distinto a la mutación: con `mut` modificas el mismo cajón; con shadowing creas un cajón nuevo que esconde al viejo.

Esto es muy útil porque te permite **transformar un valor sin cambiar su tipo de mutabilidad** y reutilizar nombres cómodos en cada etapa:

```rust
let espacios = "   ";              // texto
let espacios = espacios.len();     // ahora es un número, mismo nombre
```

Aquí el segundo `espacios` no necesita `mut`: no estamos modificando el primero, lo estamos reemplazando por un dato de otro tipo. El shadowing es la forma en que Rust te deja "reencarnar" un nombre.

:::tip
💡 Usa el shadowing para transformar valores paso a paso o cambiar de tipo manteniendo un nombre significativo. Es más legible que inventar nombres como `espacios1`, `espacios2`, `espacios3`.
:::

## Buenas prácticas

- Prefiere variables **inmutables** por defecto; agrega `mut` solo cuando realmente lo necesites.
- Usa `const` para valores fijos, en MAYÚSCULAS y con su tipo anotado.
- Aprovecha el shadowing para transformar valores sin acumular nombres absurdos.
- Declara las variables cerca de donde se usan, para mantener su contexto claro.

## Resumen rápido

- `let` declara variables **inmutables** por defecto.
- `let mut` permite que una variable cambie de valor.
- `const` crea constantes fijas, siempre con tipo explícito.
- El **shadowing** crea una variable nueva que esconde a la anterior, sin necesitar `mut`.
- El compilador infiere los tipos por ti, aunque en el próximo capítulo aprenderás a anotarlos tú mismo.

Ya sabes cómo guardar y proteger tus datos. En el siguiente capítulo exploraremos los **tipos de datos**, los distintos "materiales" que puedes guardar en esos cajones: números, textos, y estructuras más complejas.