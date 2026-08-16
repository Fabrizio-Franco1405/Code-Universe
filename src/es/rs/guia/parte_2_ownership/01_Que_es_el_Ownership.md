---
outline: [2, 3]
---

# Ownership: La Propiedad de los Datos

Hasta ahora hemos visto variables, tipos y funciones, las piezas básicas de cualquier programa. Pero Rust tiene una carta bajo la manga que lo distingue de casi todos los demás lenguajes: el **Ownership** (propiedad). Este concepto no es un detalle técnico más, es el corazón del lenguaje, la razón de que puedas trabajar con la precisión de un cirujano sobre el hardware sin sacrificar la seguridad.

No te preocupes si al principio te parece extraño: es el tema que más cuesta asimilar a los programadores que llegan de otros lenguajes. Pero una vez que lo domines, entenderás por qué el compilador actúa como un riguroso auditor de seguridad que no te deja dar ni un paso en falso con la memoria.

## 1. ¿Qué es el Ownership?

El **Ownership** es un conjunto de reglas que decide, en todo momento, quién es el **dueño** de cada dato y qué le ocurre a ese dato cuando su dueño desaparece. Pensemos en la vida real: un libro tiene un dueño, y es el dueño quien decide qué hacer con él. Si quieres leerlo, alguien debe prestártelo, y en algún momento ese préstamo termina y el libro vuelve a su propietario.

En Rust, cada valor en tu programa tiene exactamente un dueño. El lenguaje se asegura de que las reglas se cumplan en tiempo de compilación, de modo que los errores de memoria se detectan antes de ejecutar el programa, no cuando ya está en producción. Las reglas son tres, y conviene memorizarlas:

- **Cada valor tiene un dueño.** Solo una variable puede ser el dueño de un dato en cada momento.
- **Solo existe un dueño a la vez.** Cuando el dato pasa de un dueño a otro, el anterior deja de tener derecho sobre él.
- **Cuando el dueño sale del alcance, el valor se libera.** La memoria se devuelve automáticamente, sin que tengas que pedirlo.

## 2. Stack vs Heap

Para entender por qué el Ownership existe, primero debes conocer los dos lugares donde los programas guardan datos: el **stack** (pila) y el **heap** (montón). Imagina el stack como una torre de platos: los platos se apilan uno sobre otro y solo puedes añadir o quitar platos desde arriba. Es rápido, ordenado y de tamaño limitado.

El heap, en cambio, es como un enorme almacén sin pasillos ordenados. Cuando pides espacio, el sistema busca un hueco libre, te entrega una dirección (un "número de casillero") y tú la guardas para volver más tarde. Es más flexible, pero también más lento de gestionar.

- **Stack:** rápido, automático, datos de tamaño conocido y fijo como enteros o booleanos.
- **Heap:** flexible, datos de tamaño dinámico como cadenas de texto o listas que pueden crecer.

Los tipos como `String` necesitan del heap porque su tamaño puede cambiar durante la ejecución. El problema histórico de lenguajes como C es que alguien debe liberar ese espacio manualmente, y olvidarlo causa fugas de memoria. Rust resuelve esto con el Ownership: el dueño del dato es el responsable de liberarlo, y lo hace en el momento exacto en que deja de ser necesario.

## 3. La regla del alcance (scope)

En Rust, el **alcance** de una variable es el bloque de código donde puede ser usada, delimitado por llaves `{}`. El momento en que el dueño "muere" es cuando su variable sale del alcance, y en ese instante Rust libera la memoria automáticamente. Observa este ejemplo:

```rust
{
    let saludo = String::from("hola");
    // aquí saludo es válida y es la dueña de su memoria
    println!("{saludo}");
} // acá saludo sale del alcance y su memoria se libera
```

Acá la lógica es directa: mientras el bloque está abierto, `saludo` existe y puede usarse; cuando el bloque termina, Rust llama internamente a lo que en otros lenguajes se conoce como `free` y devuelve la memoria al sistema. Tú no escribes ninguna instrucción de liberación, el lenguaje se encarga.

Este comportamiento se conoce como **RAII** en el mundo de C++, pero acá está integrado de forma natural en las reglas del lenguaje. Lo importante es que la liberación siempre ocurre, sin importar si el programa termina con éxito o con un error.

## 4. Copiar vs Mover

Llegamos a la parte que más sorprende a los principiantes. Cuando asignas una variable a otra, el resultado depende del tipo de dato. Con tipos simples como los enteros, la asignación **copia** el valor:

```rust
let x = 5;
let y = x;
println!("x = {x} y y = {y}"); // ambos siguen siendo válidos
```

Como `5` cabe en un espacio fijo del stack, Rust simplemente duplica el valor. `x` y `y` son dos variables independientes, cada una con su propio `5`. No hay ningún conflicto.

El problema aparece con tipos que usan el heap, como `String`. Un `String` en realidad guarda tres cosas: un puntero a la memoria del heap, su longitud y su capacidad. Si al asignar `let s2 = s1;` copiáramos solo esos tres datos, ambos apuntarían a la **misma** memoria, y cuando ambos salieran del alcance liberarían el mismo espacio dos veces. Eso se llama *double free* y corrompe el programa.

Rust lo resuelve con una regla brillante: en lugar de copiar, **mueve** el dato:

```rust
let s1 = String::from("hola");
let s2 = s1;          // s1 se mueve a s2
println!("{s1}");     // ❌ ERROR: s1 ya no es válida
```

Después de la asignación, `s2` es la nueva dueña de la memoria y `s1` queda "desocupada". Si intentas usar `s1`, el compilador te lo impedirá en tiempo de compilación, así que el error de doble liberación es imposible de escribir. A este traspaso de la propiedad se le llama **mover** (move).

:::warning Advertencia
⚠️ El error de usar una variable que ha sido movida es uno de los más frecuentes al empezar. Si el compilador te dice `value borrowed here after move`, significa que intentaste usar un dato cuyo dueño ya es otro. No es un bug de tu lógica: es el lenguaje protegiendo la memoria.
:::

## 5. El trait `Copy`

Los tipos simples como enteros, flotantes y booleanos se copian en lugar de moverse. En Rust esto se marca con el trait **`Copy`**: cuando un tipo implementa `Copy`, la asignación siempre duplica el valor y las dos variables siguen siendo válidas. Los tipos que usan heap, como `String`, no pueden implementar `Copy`, porque duplicar su contenido sería caro e impredecible.

- Enteros, flotantes, `bool`, `char` y tuplas de tipos `Copy`: se copian.
- `String`, `Vec` y la mayoría de tipos con memoria en el heap: se mueven.

`String` sí implementa otro trait llamado `Clone`, que copia el dato de forma **explícita** cuando tú lo pides con el método `.clone()`. La diferencia es clave: la copia automática de `Copy` es barata y ocurre sola; la clonación es costosa y requiere tu intención, así que no ocurre por accidente.

:::tip
💡 Piensa en `Copy` como un folio de papel que fotocopias sin costo, y en `Clone` como copiar un documento enorme página por página: solo hazlo cuando de verdad lo necesites.
:::

## 6. El mismo juego con funciones

Las mismas reglas se aplican cuando pasas valores a funciones. Al llamar a una función, los argumentos se mueven o se copian según su tipo, y el valor devuelto se entrega al dueño que lo recibe. Esto te permite "transferir" datos sin duplicarlos:

```rust
fn construir_nombre(inicial: String) -> String {
    let completo = format!("{inicial} Rust");
    completo // se mueve el resultado al llamador
}

let base = String::from("Aprendiendo");
let frase = construir_nombre(base); // base se mueve a la función
```

Acá `base` se mueve a la función, que la usa para construir una nueva `String`. El resultado se devuelve y pasa a ser propiedad de `frase`. Mover valores de un lado a otro es la forma natural de compartir datos en Rust, aunque pronto verás que existe una manera mucho más cómoda de hacerlo sin renunciar a la propiedad.

## Buenas prácticas

- Recuerda que cada dato tiene **un solo dueño** y que el dueño es quien libera la memoria.
- Si necesitas usar un dato después de asignarlo a otra variable, usa `.clone()` solo cuando el costo lo justifique.
- No luches contra el compilador cuando reporte un *move*: casi siempre la solución es reordenar tu código, no "arreglarlo a la fuerza".
- Distingue los tipos `Copy` (se copian solos) de los tipos de heap (se mueven) para predecir el comportamiento.

## Resumen rápido

- El **Ownership** son tres reglas que garantizan una gestión de memoria segura y automática.
- El **stack** es rápido y fijo; el **heap** es flexible y necesita gestión.
- Cuando el dueño sale del alcance, la memoria se libera sola.
- Los tipos `Copy` se copian en la asignación; los tipos de heap se **mueven**.
- Usar una variable movida provoca un error en tiempo de compilación, nunca en tiempo de ejecución.

Ahora que entiendes la propiedad, la pregunta natural es: ¿qué pasa si necesitas usar un dato sin moverlo ni duplicarlo? La respuesta son las **referencias**, que veremos en el siguiente capítulo.