---
outline: [2, 3]
---

# Sintaxis de métodos

En el capítulo anterior construimos un `Rectangulo` con campos `ancho` y `alto`, pero el área la calculaba una función suelta, separada del struct. Eso funciona, pero hay algo artificial en la separación: ¿por qué el área no es algo que el propio rectángulo sepa calcular? Los **métodos** son exactamente eso: funciones que viven dentro de un tipo y que operan sobre sus datos.

Pensemos en la vida real: un reloj no es un simple conjunto de piezas; el reloj **sabe** decir la hora. Del mismo modo, un método le da a tus tipos un comportamiento propio. En lugar de tener funciones sueltas que "atacan" a tus datos desde afuera, agrupas los datos y sus comportamientos en un solo lugar.

## 1. Los bloques `impl`

Para añadir métodos a un tipo, usamos un bloque **`impl`** (abreviatura de *implementation*). Dentro de él escribimos funciones que reciben el propio tipo como primer parámetro. Veamos cómo convertir la función suelta del capítulo anterior en un método:

```rust
struct Rectangulo {
    ancho: u32,
    alto: u32,
}

impl Rectangulo {
    fn area(&self) -> u32 {
        self.ancho * self.alto
    }
}

fn main() {
    let rectangulo = Rectangulo { ancho: 30, alto: 50 };
    println!("El área es {}", rectangulo.area());
}
```

- `impl Rectangulo { ... }`: abre el bloque de comportamiento del tipo `Rectangulo`.
- `fn area(&self) -> u32`: define el método `area`, que recibe `&self` (una referencia al propio rectángulo).
- `self.ancho * self.alto`: dentro del método, `self` es el objeto que llamó al método.
- `rectangulo.area()`: se llama con el punto, igual que accedías a los campos.

La diferencia con la función suelta es elegante: `rectangulo.area()` se lee como "el área de rectángulo". El comportamiento ahora pertenece al dato, y el código expresa esa relación de forma natural.

## 2. Los tres sabores de `self`

Un método puede recibir el objeto de tres formas distintas, y cada una dice cuánto control necesita:

- **`&self`**: solo lee el objeto. Es el más común, porque no mueve ni modifica nada, solo presta.
- **`&mut self`**: modifica el objeto. Permite cambiar sus campos porque recibe un préstamo mutable.
- **`self`**: se **consume** el objeto. El método se queda con la propiedad y este deja de existir para quien lo llamó.

Veamos los tres en acción sobre un mismo tipo:

```rust
struct Contador {
    valor: i32,
}

impl Contador {
    fn nuevo(valor_inicial: i32) -> Contador {
        Contador { valor: valor_inicial }
    }

    fn leer(&self) -> i32 {
        self.valor
    }

    fn incrementar(&mut self) {
        self.valor += 1;
    }

    fn destruir(self) -> i32 {
        self.valor
    }
}
```

- `nuevo` es una función asociada que crea un `Contador` (lo veremos en la sección 4).
- `leer(&self)` devuelve el valor sin tocarlo.
- `incrementar(&mut self)` suma uno al valor porque necesita modificarlo.
- `destruir(self)` toma el contador completo y devuelve su valor, dejándolo inutilizable después.

:::tip
💡 La regla práctica: usa `&self` por defecto, `&mut self` solo si modificas campos, y `self` únicamente cuando el método deba consumir el objeto (por ejemplo, para transformarlo en otro tipo).
:::

## 3. El punto y la auto-referencia

Aquí viene una de las magias más cómodas de Rust: el operador `.` hace que no tengas que escribir la referencia a mano. Cuando tienes una variable `rectangulo` (sin `&`) y llamas a un método que espera `&self`, Rust añade la referencia por ti. A eso se le llama **auto-referencia** o *auto-ref*.

```rust
let mut contador = Contador::nuevo(10);

contador.leer();        // espera &self → Rust pasa &contador
contador.incrementar(); // espera &mut self → Rust pasa &mut contador
contador.destruir();    // espera self → Rust pasa contador
```

No escribes `&contador`, `&mut contador` ni nada parecido: solo usas el punto y el compilador deduce la referencia correcta según lo que el método pida. Si el método necesita `&mut self`, tu variable debe ser mutable; de lo contrario, Rust te lo recordará con un error.

:::info Nota
ℹ️ Esta comodidad no es magia gratuita: en lenguajes como C++ tendrías que distinguir `objeto.metodo()`, `objeto->metodo()` o `(*objeto).metodo()`. En Rust, el `.` decide solo, lo que elimina un montón de ruido visual.
:::

## 4. Funciones asociadas

Un bloque `impl` también puede contener funciones que **no** reciben `self`. Se llaman **funciones asociadas**, porque viven asociadas al tipo, y se invocan con `::` en lugar de `.`. La más famosa la conoces desde el primer capítulo: `String::from`.

```rust
impl Contador {
    fn nuevo(valor_inicial: i32) -> Contador {
        Contador { valor: valor_inicial }
    }
}

fn main() {
    let contador = Contador::nuevo(5);
}
```

- `Contador::nuevo(5)` llama a la función asociada usando `::`.
- No recibe `self`, así que no necesita una instancia para existir.
- Su uso clásico es el **constructor**: una función que crea e inicializa una instancia nueva.

Acostúmbrate a este patrón: los constructores suelen llamarse `nuevo` en el código de Rust, y son la forma estándar de crear instancias que necesitan lógica de inicialización.

:::warning Advertencia
⚠️ La regla de oro para no confundirlos: los **métodos** usan punto y reciben `self` (operan sobre una instancia ya creada); las **funciones asociadas** usan `::` y no reciben `self` (operan sobre el tipo en general).
:::

## 5. Varios bloques `impl`

No hay ninguna limitación que te obligue a tener un solo bloque `impl` por tipo. Puedes dividir los métodos en varios bloques, lo que resulta útil para organizar código extenso por categorías:

```rust
impl Contador {
    fn nuevo(valor_inicial: i32) -> Contador {
        Contador { valor: valor_inicial }
    }
}

impl Contador {
    fn leer(&self) -> i32 {
        self.valor
    }
}
```

El lenguaje los trata como si fueran uno solo; es simplemente una herramienta de organización. Más adelante, cuando veas los traits, esta característica se volverá indispensable.

## Buenas prácticas

- Usa `&self` por defecto y sube de nivel solo cuando el método lo necesite.
- Nombra el constructor `nuevo` y usa `Tipo::nuevo(...)` para crear instancias.
- Agrupa métodos relacionados en el mismo bloque `impl` para mantener el orden.
- No conviertas todo en método: deja como función suelta lo que no necesita del tipo.
- Recuerda que `self` consume el objeto: úsalo solo para transformaciones finales.

## Resumen rápido

- Los **métodos** viven en bloques `impl` y reciben `self`.
- `&self` lee, `&mut self` modifica y `self` consume el objeto.
- El operador `.` deduce la referencia necesaria automáticamente (*auto-ref*).
- Las **funciones asociadas** (`Tipo::nombre`) no reciben `self` y suelen crear instancias.
- Puedes tener varios bloques `impl` para el mismo tipo.

Ahora tus tipos saben comportarse. El siguiente gran tipo de Rust lleva el modelado de datos un paso más allá: en el siguiente capítulo descubrirás los **enums**, la herramienta para representar datos que pueden ser una de varias variantes posibles.