---
outline: [2, 3]
---
# Escribir tests

Hasta ahora el compilador ha sido nuestro auditor de seguridad, pero incluso un auditor incansable no puede detectar errores de lógica: si tu código hace lo que pides pero pediste algo equivocado, él no lo sabrá. Los **tests** son la segunda línea de defensa, pequeños programas que verifican que cada función hace exactamente lo que promete. La gran noticia es que en este ecosistema los tests no son una idea tardía, sino **ciudadanos de primera clase**: Cargo trae toda la infraestructura integrada y no necesitas instalar nada adicional.

Escribir pruebas desde el principio puede sentirse como un gasto de tiempo, pero no te preocupes si te cuesta al inicio: cada test que pasa se convierte en una red de seguridad que te permite refactorizar con confianza. En este capítulo aprenderás a declarar funciones de prueba, a usar las macros de aserción y a verificar que el código falla cuando debe fallar.

## 1. El atributo `#[test]`

Cargo viene preparado para ejecutar tests con un único comando: `cargo test`. Para que una función sea reconocida como prueba, se le antepone el atributo `#[test]`:

```rust
#[test]
fn la_suma_es_correcta() {
    assert!(2 + 2 == 4);
}
```

- `#[test]`: es un **atributo**, una anotación que le otorga poderes especiales a la función que la lleva. En este caso, la convierte en una prueba que el runner de Cargo puede ejecutar.
- El nombre de la función suele describir el comportamiento que se verifica, como una frase corta en español.
- Una función de test no devuelve nada visible: su trabajo es **pasar o fallar**.

:::tip
💡 Ejecuta `cargo test` en tu proyecto y verás un resumen como "running 1 test". Si el proyecto no tiene pruebas, Cargo no se queja: simplemente te informa que no hay nada que ejecutar.
:::

## 2. Las macros de aserción

Dentro de una función de test necesitas comprobar que los resultados coinciden con lo esperado. Para eso existen las **macros de aserción**, que se encargan de avisar con claridad cuando algo sale mal.

### La macro `assert!`

La macro `assert!` recibe una condición booleana y falla el test si esa condición es falsa:

```rust
let total = 2 + 2;
assert!(total == 4);
```

- `assert!`: evalúa la expresión que recibe. Si es `true`, el test continúa; si es `false`, el test falla y el mensaje de error señala la línea exacta.
- Es ideal cuando solo te interesa que una condición se cumpla, sin importar el valor concreto que la produjo.

### Las macros `assert_eq!` y `assert_ne!`

Cuando quieres comparar dos valores, Rust te ofrece versiones mucho más expresivas:

```rust
assert_eq!(2 + 2, 4);
assert_ne!(2 + 2, 5);
```

- `assert_eq!`: comprueba si dos valores son **iguales**. Si no lo son, el mensaje de error te muestra tanto el valor esperado como el obtenido, algo muy valioso para diagnosticar el fallo.
- `assert_ne!`: comprueba si dos valores son **distintos**. Se usa para verificar que un resultado no coincide con algo no deseado.
- Funcionan con cualquier tipo que implemente los traits `Debug` y `PartialEq`, que es el caso de casi todos los tipos estándar. Más adelante veremos qué implica implementar tus propios traits.

:::warning Advertencia
⚠️ El orden importa: en `assert_eq!(esperado, obtenido)`, el primer argumento es lo que esperabas y el segundo lo que produjo tu código. Cuando falle, el mensaje te mostrará `left` y `right` respetando ese orden.
:::

## 3. Dejando pasar los errores con `should_panic`

A veces el comportamiento correcto es precisamente fallar. Si una función debe entrar en pánico ante cierta entrada, puedes declararlo con el atributo `should_panic`:

```rust
#[test]
#[should_panic]
fn un_indice_fuera_de_rango_entra_en_panico() {
    let numeros = vec![1, 2, 3];
    let _ = numeros[10];
}
```

- `#[should_panic]`: indica que el test **espera** que el código entre en pánico. Si el código entra en pánico, el test pasa; si no lo hace, el test falla.
- Este mecanismo convierte un comportamiento extremo en una garantía: el error deja de ser accidental y pasa a ser una decisión de diseño verificada.

## 4. Un ejemplo completo

Acá tienes un ejemplo real para cerrar el capítulo. Imaginemos una función que calcula la longitud de una cadena, acompañada de sus pruebas:

```rust
fn longitud(cadena: &str) -> usize {
    cadena.len()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn longitud_de_una_palabra() {
        assert_eq!(longitud("hola"), 4);
    }

    #[test]
    fn longitud_de_una_cadena_vacia() {
        assert_eq!(longitud(""), 0);
    }

    #[test]
    #[should_panic]
    fn el_acceso_fuera_de_rango_paniquea() {
        let palabras = vec!["uno", "dos"];
        let _ = palabras[5];
    }
}
```

- El módulo `tests` con `#[cfg(test)]` garantiza que este código de prueba **no se incluya** en la compilación de producción: solo existe cuando ejecutas `cargo test`.
- `use super::*;` trae las funciones del módulo padre al alcance de los tests, para llamar a `longitud` directamente.
- Cada prueba verifica un pequeño contrato de la función: el caso normal y el caso extremo de la cadena vacía.

:::info Nota
ℹ️ Al ejecutar `cargo test`, verás la línea "running 3 tests" seguida de los puntos verdes por cada prueba que pasa. Si algo falla, el runner te mostrará exactamente qué aserción no se cumplió y en qué línea.
:::

## Buenas prácticas

- Nombra tus tests como frases que describen el comportamiento esperado, por ejemplo `longitud_de_una_cadena_vacia`.
- Prueba tanto los casos felices como los extremos: cadenas vacías, listas sin elementos, valores límite.
- Usa `assert_eq!` en lugar de `assert!` cuando compares valores: el mensaje de error es mucho más útil.
- No escribas tests para probar al compilador; concéntrate en la lógica de tu propio código.

## Resumen rápido

- `#[test]`: convierte una función en un test ejecutable con `cargo test`.
- `assert!`: falla el test si la condición es falsa.
- `assert_eq!` y `assert_ne!`: comparan dos valores y fallan si la relación no se cumple.
- `#[should_panic]`: espera que el código entre en pánico.
- Los tests son ciudadanos de primera clase: integrados en Cargo, sin configuración extra.

Ahora que sabes escribir tests, el próximo capítulo te enseña a **controlarlos**: filtrarlos por nombre, ver los prints intermedios y ejecutarlos en paralelo.