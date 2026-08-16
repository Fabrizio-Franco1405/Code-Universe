---
outline: [2, 3]
---

# Traits: Comportamiento compartido

En el capítulo anterior viste cómo los genéricos permiten escribir código para cualquier tipo, pero te quedaste con una duda en el aire: ¿qué era ese `T: PartialOrd` y por qué el compilador lo exige? La respuesta llega ahora con los **traits**, el mecanismo que define qué comportamientos comparte un tipo.

Piensa en un trait como un **contrato**: describe capacidades que un tipo se compromete a cumplir, sin especificar cómo las implementa. Gracias a ellos, el compilador, ese riguroso **auditor de seguridad**, puede garantizar que cualquier tipo genérico que recibas se comporta exactamente como prometiste.

## 1. La analogía del contrato

Imagina que tienes una licencia de conducir. Ese documento no te dice cómo manejar cada auto del mundo, pero certifica que sabes conducir. Cuando alquilas un vehículo, la agencia no necesita examinarte de nuevo: le basta con ver la licencia, porque ya firmaste el contrato de que sabes manejar.

En Rust, un trait es exactamente esa licencia. Declaras un conjunto de métodos ("sé describirme", "sé compararme") y luego cada tipo decide **cómo** cumplirlo. La ventaja es enorme: cualquier función que exija "algo con licencia" puede aceptar a cualquier tipo que lo tenga, sin importar su naturaleza interna.

## 2. Definiendo un trait

Para definir un trait se usa la palabra clave `trait` seguida de las firmas de los métodos que promete. Observa cómo declaramos uno que sirva para describir cualquier objeto:

```rust
trait Describible {
    fn describir(&self) -> String;
}
```

- `trait Describible`: Declara el contrato llamado `Describible`.
- `fn describir(&self) -> String`: Es la **firma** del método prometido. Recibe una referencia a sí mismo y devuelve un texto.
- La firma no tiene cuerpo: cada tipo que firme el contrato escribirá su propia versión.

Es importante notar que el trait solo define el *qué*, nunca el *cómo*. El método no tiene implementación aquí; eso lo decide cada tipo cuando decide firmar el contrato.

## 3. Implementando un trait para un tipo

Cuando un tipo quiere cumplir el contrato, lo hace con el bloque `impl ... for ...`. Allí escribe el cuerpo concreto de cada método prometido. Veamos cómo dos tipos muy distintos cumplen con `Describible`:

```rust
struct Gato {
    nombre: String,
}

struct Planeta {
    nombre: String,
    radio_km: u32,
}

impl Describible for Gato {
    fn describir(&self) -> String {
        format!("Un gato llamado {}", self.nombre)
    }
}

impl Describible for Planeta {
    fn describir(&self) -> String {
        format!("El planeta {} con {} km de radio", self.nombre, self.radio_km)
    }
}
```

- `impl Describible for Gato`: Le dice al compilador que `Gato` firma el contrato `Describible`.
- Cada bloque escribe el `cómo` concreto: un gato se describe distinto a un planeta.
- `format!`: La macro que ya conoces del capítulo de `String` para construir texto con variables.

Ahora `Gato` y `Planeta` comparten un comportamiento: ambos pueden describirse. Puedes llamar a `gato.describir()` y a `planeta.describir()`, y cada uno usará su propia versión del contrato.

## 4. Implementaciones por defecto

A veces quieres que el contrato ofrezca un comportamiento inicial que todos hereden, y que solo algunos tipos decidan sobreescribir. Rust lo permite con **implementaciones por defecto**: escribes el cuerpo directamente dentro del trait.

```rust
trait Describible {
    fn describir(&self) -> String {
        String::from("Algo por describir")
    }
}

impl Describible for Gato {}

fn main() {
    let gatito = Gato { nombre: String::from("Michifuz") };
    println!("{}", gatito.describir());
}
```

- La implementación por defecto vive dentro del `trait`, con cuerpo completo.
- `impl Describible for Gato {}`: Un bloque vacío es válido porque el tipo hereda el comportamiento por defecto.
- Si un tipo quisiera un mensaje propio, solo tendría que reescribir `describir` en su `impl`.

:::tip
💡 Las implementaciones por defecto son ideales cuando la mayoría de los tipos seguirá el mismo patrón y solo algunos necesitan personalizarlo. Escribes el comportamiento una sola vez y cada tipo decide si lo hereda o lo cambia.
:::

## 5. Trait bounds en genéricos

Ahora sí, conectamos con el capítulo anterior. La restricción `T: Describible` se llama **trait bound**: una cláusula que le exige al tipo genérico `T` cumplir el contrato. Es la forma en que el compilador sabe qué métodos puede llamar sin tener que conocer el tipo real.

```rust
fn imprimir_descripcion<T: Describible>(item: &T) {
    println!("{}", item.describir());
}
```

- `T: Describible`: El tipo `T` debe firmar el contrato `Describible`.
- `item.describir()`: Es seguro llamar al método, porque el compilador ya verificó que `T` lo tiene.
- Si intentas pasar un tipo que no implementa el trait, la compilación fallará con un error claro.

Gracias a los bounds, tus funciones genéricas dejan de ser cajas ciegas: pueden exigir comportamientos concretos y usarlos con total seguridad. Es la combinación perfecta entre flexibilidad de tipos y rigor del auditor de seguridad.

## 6. La sintaxis `where`

Cuando una función tiene varios parámetros genéricos con varias restricciones, la firma puede volverse ilegible. Para esos casos, Rust ofrece la sintaxis `where`, que saca los bounds de la declaración y los lista más abajo, con más aire.

```rust
fn mostrar_detalle<T, U>(valor_t: &T, valor_u: &U)
where
    T: Describible,
    U: Describible,
{
    println!("{}", valor_t.describir());
    println!("{}", valor_u.describir());
}
```

- `where`: Introduce un bloque donde se listan las restricciones, una por línea.
- Cada bound se separa con comas y no lleva punto y coma.
- La firma queda corta y legible, mientras las exigencias quedan claras al final.

:::info Nota
ℹ️ Usa `where` cuando acumules varias restricciones y prefieres la firma limpia. Para una sola restricción, escribirla inline como `T: Describible` es perfectamente válido y habitual.
:::

## 7. La regla del huérfano

Existe una regla de diseño que debes conocer para no chocar con el compilador: la **regla de la huérfana** (*orphan rule*). Solo puedes implementar un trait si el trait o el tipo (o ambos) son definidos en tu propia crate.

- Puedes implementar `Describible` (tuyo) para `Gato` (tuyo): permitido.
- Puedes implementar `Describible` (tuyo) para `String` (ajeno): permitido, el trait es tuyo.
- No puedes implementar `Display` (ajeno) para `String` (ajeno): **prohibido**.

¿Por qué? Porque si dos crates distintas implementaran el mismo trait para el mismo tipo ajeno, el compilador no sabría cuál usar. Es una protección para evitar conflictos silenciosos. No te preocupes si la regla te parece extraña; en la práctica, lo normal es implementar traits de la biblioteca estándar para tus propios tipos, y eso siempre está permitido.

:::warning Advertencia
⚠️ Cuando importes un trait de la biblioteca estándar para usarlo en un bound, recuerda traerlo al alcance con `use` si es necesario. En Rust moderno algunos están en el *prelude*, pero otros, como `Iterator` en ciertos casos, requieren el `use` explícito.
:::

## Buenas prácticas

- Define traits con una única responsabilidad clara, como contratos pequeños y bien nombrados.
- Aprovecha las implementaciones por defecto para evitar repetir lógica idéntica.
- Usa bounds `T: MiTrait` para exigir comportamiento en funciones genéricas y deja el `where` para firmas cargadas.
- Respeta la regla de la huérfana: implementa traits ajenos solo para tipos propios.

## Resumen rápido

- Un **trait** es un contrato que define qué métodos debe implementar un tipo.
- Se define con `trait` y se cumple con `impl Trait for Tipo`.
- Las **implementaciones por defecto** heredan comportamiento que los tipos pueden sobreescribir.
- Los **trait bounds** (`T: Trait`) restringen los genéricos y garantizan que `T` tenga ciertos métodos.
- La sintaxis `where` ordena múltiples restricciones.
- La **regla de la huérfana** prohíbe implementar traits ajenos para tipos ajenos.

Con los genéricos y los traits ya puedes escribir abstracciones flexibles y con contrato. Pero hay un tercer pilar que falta para completar el trío: en el próximo capítulo descubrirás los **lifetimes**, el mecanismo que garantiza que las referencias nunca apunten a datos que ya no existen.