---
outline: [2, 3]
---

# Tipos de datos genéricos

En los capítulos anteriores modelaste datos con `structs`, `enums` y colecciones como `Vec`. Ahora llega el momento de dar el gran salto hacia la **abstracción**: aprender a escribir código que funciona para cualquier tipo sin importar cuál sea. Es el cimiento de la filosofía que mencionamos en la visión general: **abstracciones de coste cero**, donde la comodidad no paga un precio en velocidad.

Para lograrlo, Rust pone a tu disposición los **genéricos** y el parámetro de tipo `T`. No te preocupes si al principio te parecen un poco abstractos; en este capítulo los verás aterrizados en funciones, `structs` y `enums`, y descubrirás por qué son la pieza que une todo el ecosistema.

## 1. El problema: Escribir lo mismo una y otra vez

Imagina que necesitas una función que devuelva el número mayor de una lista. La escribes para enteros y funciona. Pero luego necesitas lo mismo para números decimales, y después para textos... ¿Vas a copiar y pegar la misma lógica cambiando solo el tipo? Eso sería duplicar código, y el código duplicado es una fábrica de errores: cuando arregles un bug en una copia, las otras seguirán rotas.

```rust
fn mayor_entero(lista: &[i32]) -> i32 {
    let mut maximo = lista[0];
    for &item in lista {
        if item > maximo {
            maximo = item;
        }
    }
    maximo
}

fn mayor_decimal(lista: &[f64]) -> f64 {
    let mut maximo = lista[0];
    for &item in lista {
        if item > maximo {
            maximo = item;
        }
    }
    maximo
}
```

- `lista: &[i32]`: Recibe una porción (`slice`) de enteros por referencia, algo que ya conoces del capítulo de colecciones.
- El cuerpo es **idéntico** en ambas funciones; solo cambia el tipo anotado.

Observa el desperdicio: dos funciones que hacen exactamente lo mismo. Lo ideal sería una sola que sirviera para cualquier tipo que se pueda comparar. Eso, precisamente, es lo que los genéricos te permiten escribir.

## 2. Primeros pasos con `T`

El parámetro de tipo genérico se escribe entre ángulos `<>` justo después del nombre de la función. La convención es usar una sola letra en mayúsculas: `T`, `U`, `E`, y así sucesivamente. Reescribamos la función anterior en su versión genérica:

```rust
fn mayor<T: std::cmp::PartialOrd>(lista: &[T]) -> T {
    let mut maximo = &lista[0];
    for item in lista {
        if item > maximo {
            maximo = item;
        }
    }
    *maximo
}
```

- `fn mayor<T>`: Declara que esta función tiene un tipo genérico llamado `T`.
- `T: std::cmp::PartialOrd`: Es una **restricción de tipo** (bound). Le dice al compilador: "`T` debe poder compararse con `>`". No te preocupes por los detalles todavía; en el próximo capítulo dominarás esto con los *traits*.
- `lista: &[T]`: La función recibe un slice de elementos del tipo `T`, cualquiera que sea.
- `-> T`: Devuelve un valor del mismo tipo genérico.

```rust
fn main() {
    let numeros = vec![3, 7, 2, 9];
    let mayor_numero = mayor(&numeros);

    let precios = vec![2.5, 9.9, 4.1];
    let mayor_precio = mayor(&precios);
}
```

- `mayor(&numeros)`: El compilador **infiere** que `T` es `i32` mirando los argumentos.
- `mayor(&precios)`: Aquí infiere que `T` es `f64`. La misma función, dos tipos distintos.

:::tip
💡 El compilador deduce el tipo de `T` por ti en la mayoría de los casos. Solo necesitas anotarlo explícitamente cuando la inferencia no tiene suficiente información, algo que verás en pocas ocasiones.
:::

## 3. Genéricos en `structs`

Los genéricos no viven solo en funciones: puedes usarlos para definir estructuras que almacenan datos de cualquier tipo. Así como definiste `Rectangulo` en el capítulo de modelado de datos, ahora puedes crear un `Punto` que funcione en un plano de coordenadas enteras, decimales o incluso tridimensionales con otra dimensión.

```rust
struct Punto<T> {
    x: T,
    y: T,
}

fn main() {
    let punto_entero = Punto { x: 5, y: 10 };
    let punto_decimal = Punto { x: 1.5, y: 4.2 };
}
```

- `struct Punto<T>`: Declara que el tipo `Punto` tiene un parámetro genérico.
- `x: T, y: T`: Ambos campos guardan datos del mismo tipo `T`. Si `x` es `i32`, `y` también debe serlo.
- `Punto { x: 5, y: 10 }`: Crea una instancia concreta; el compilador infiere `T = i32`.

¿Y si quieres que `x` e `y` puedan ser de tipos distintos? Ahí entran los múltiples parámetros genéricos.

## 4. Múltiples tipos: `<T, U>`

No tienes por qué limitarte a un solo parámetro. Puedes declarar varios separados por comas, cada uno controla un campo de forma independiente. Esto da una flexibilidad enorme para modelar datos heterogéneos sin perder la seguridad de tipos.

```rust
struct Par<T, U> {
    primer_valor: T,
    segundo_valor: U,
}

fn main() {
    let par_mixto = Par {
        primer_valor: "Hola".to_string(),
        segundo_valor: 42,
    };
}
```

- `struct Par<T, U>`: Dos parámetros genéricos, cada uno independiente del otro.
- `primer_valor: T`: Guarda un valor del primer tipo.
- `segundo_valor: U`: Guarda un valor del segundo tipo, que puede ser distinto.
- `"Hola".to_string()` y `42`: Aquí `T` es `String` y `U` es `i32`.

:::warning Advertencia
⚠️ El nombre que uses para cada parámetro no tiene por qué coincidir entre declaración y uso, pero debes mantener el orden y la cantidad. Un `Punto<T, U>` siempre requerirá dos tipos, nunca uno ni tres.
:::

## 5. Genéricos en `enums`

Los `enums` también se benefician de la generación de tipos. De hecho, ya usas dos famosos sin saberlo: `Option<T>` y `Result<T, E>`. No te preocupes si no los has visto aún; el primero lo usaste en el capítulo de `match`, y el segundo será protagonista del próximo capítulo sobre errores.

```rust
enum Resultado<T, E> {
    Exito(T),
    Falla(E),
}
```

- `enum Resultado<T, E>`: Declara un enumerado con dos tipos genéricos.
- `Exito(T)`: La variante guarda un dato de éxito, del tipo `T`.
- `Falla(E)`: La variante guarda un dato de error, del tipo `E`.

Los `enums` genéricos son tan valiosos porque te permiten expresar "un valor que puede ser una cosa u otra" sin acoplar el enumerado a un tipo concreto. Es la esencia de los tipos `Option<T>` y `Result<T, E>` que la biblioteca estándar te regala.

## 6. Monomorfización: abstracciones de coste cero

Llegamos a la pregunta del millón: si escribo código genérico, ¿pago un costo extra en tiempo de ejecución? La respuesta es un rotundo **no**, y aquí está la magia de la **monomorfización**.

Cuando compilas tu programa, Rust toma cada uso concreto de una función genérica y genera una copia especializada de esa función para cada tipo. Es decir, tu `mayor<T>` se convierte internamente en una `mayor_i32`, una `mayor_f64`, y así sucesivamente, cada una con el tipo ya resuelto.

- **Antes de compilar:** Tú escribes una sola función genérica, cómoda y legible.
- **Durante la compilación:** El compilador genera una copia por cada tipo usado.
- **En la ejecución:** El programa corre con funciones concretas y directas, sin ninguna capa de indirección.

Esto es exactamente la promesa de las **abstracciones de coste cero**: usas herramientas más humanas y expresivas, pero el código resultante es tan eficiente como si hubieras escrito cada variante a mano, casi como si lo hubieras hecho en ensamblador. La comodidad no te cuesta un solo ciclo de CPU.

:::info Nota
ℹ️ El costo de la monomorfización no es de velocidad sino de tamaño: cada tipo concreto genera su propia copia en el binario. En la práctica esto es imperceptible y vale muchísimo la pena frente a la claridad que ganas.
:::

## Buenas prácticas

- Usa letras mayúsculas únicas y convencionales para los parámetros de tipo: `T`, `U`, `E`.
- Prefiere una función genérica bien diseñada antes que copiar y pegar código cambiando tipos.
- Aprovecha los genéricos en `structs` y `enums` para modelar datos reutilizables sin acoplamiento.
- No anotes el tipo de `T` a mano cuando el compilador pueda inferirlo.

## Resumen rápido

- Los **genéricos** permiten escribir código que funciona para múltiples tipos usando `T`.
- Se aplican a **funciones**, `structs` y `enums`, y se combinan con varios parámetros como `<T, U>`.
- `Option<T>` y `Result<T, E>` son `enums` genéricos de la biblioteca estándar.
- La **monomorfización** convierte cada uso genérico en una versión concreta al compilar, sin costo en tiempo de ejecución: abstracciones de coste cero en acción.

Ya sabes cómo generalizar código para cualquier tipo. Pero hay una pregunta pendiente: cuando escribimos `mayor<T: std::cmp::PartialOrd>`, ¿qué es exactamente ese `PartialOrd` y por qué lo necesitamos? La respuesta te espera en el próximo capítulo: los **traits**, los contratos que definen qué puede hacer cada tipo.