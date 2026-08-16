---
outline: [2, 3]
---

# ¿Pánico o no pánico?

En los dos capítulos anteriores conociste las dos herramientas del manejo de errores: `panic!` para lo irreparable y `Result` para lo manejable. Ahora llega la pregunta que divide a los diseños bien pensados de los caóticos: **¿cuándo usar cada una?** No hay una respuesta automática, pero sí hay criterios claros que puedes aplicar en cada función que escribas.

La decisión correcta convierte tus errores en mensajes útiles y tus flujos en predecibles. La incorrecta convierte pequeñas fallas en explosiones innecesarias, o peor, silencia problemas que deberían haber detenido el programa. Este capítulo te da el mapa para navegar esa frontera con confianza.

## 1. La pregunta clave: ¿Puede el llamador recuperarse?

Antes de elegir, pregúntate por el escenario de uso: ¿tiene sentido que quien llama a tu función intente resolver el problema? Si la respuesta es **sí**, el error debe ser recuperable y devolverás `Result`. Si es **no**, porque no hay forma sensata de seguir, entonces el pánico es honesto.

Un archivo que no existe puede reintentarse con otra ruta; una entrada inválida puede volver a pedirse al usuario. Ambos son errores recuperables. Pero un índice de lista que se sale de los límites por un bug interno no tiene recuperación posible: el programa está mal y lo mejor es detenerlo. La recuperabilidad del llamador es tu brújula principal.

## 2. Cuándo usar `panic!`

El pánico no es un error de diseño: es una declaración de que un **invariante se rompió** y el programa ya no puede confiar en sí mismo. Hay situaciones concretas donde es la elección correcta y profesional:

- **Estado inválido:** Si la lógica interna llegó a un punto imposible según las reglas del programa, es mejor fallar rápido que seguir con datos corruptos.
- **Prototipos y ejemplos:** Cuando estás explorando ideas, `unwrap` y `expect` te dejan avanzar sin distracciones. El capítulo de `Result` ya te advirtió de su costo.
- **Tests:** En las pruebas, fallar en el acto es exactamente lo que quieres. Si una condición no se cumple, que el test grite.
- **Invariantes de biblioteca:** Si tu tipo declara garantías que alguien violó, como construir un `Vec` con una capacidad negativa, el pánico protege la integridad del resto del programa.

En todos estos casos, el pánico no es una rendición: es una **alerta temprana**. El fallo aparece en el punto exacto del problema, con su mensaje y su backtrace, en lugar de corromper datos silenciosamente hasta explotar horas después.

:::warning Advertencia
⚠️ Usar `panic!` para controlar errores esperables es un error clásico: convierte una falla que el usuario podría resolver en la muerte del proceso. Antes de lanzar un pánico, pregúntate si algún código razonable podría querer continuar tras el error.
:::

## 3. Cuándo usar `Result`

La mayoría de las funciones reales deberían devolver `Result`. La regla práctica es casi automática: **si el error es esperable, usa `Result`**. Veamos los casos más habituales del día a día:

- **Contratos públicos:** Cuando expones una función a otros módulos o usuarios, no sabes cómo la llamarán. Darles `Result` les da el poder de decidir.
- **Interacción con el mundo exterior:** Archivos, red, bases de datos, entrada del usuario. Todo lo que depende de algo fuera de tu control puede fallar, y esas fallas merecen ser manejadas.
- **Validación de entrada:** Si recibes datos que podrían estar mal formados, devuelve `Result` con un error descriptivo en lugar de asumir que siempre vendrán correctos.
- **Bibliotecas:** Un código que otros usarán nunca debe imponer sus propias reglas de pánico. `Result` entrega el control al consumidor de tu API.

En todos estos escenarios, `Result` es la opción empoderadora: le da al llamador la información y la decisión. El operador `?` que viste en el capítulo anterior hace que ese traspaso sea además cómodo y legible.

## 4. Diseñando errores útiles

Cuando devuelves `Result`, la calidad de tu error determina la calidad de la experiencia. Un error vago como "algo falló" no ayuda a nadie; un error bien diseñado acelera la depuración y el manejo. Tres ingredientes marcan la diferencia:

- **Describe el problema:** Explica qué falló y, si es posible, qué dato estaba involucrado.
- **Ofrece contexto:** La función que falló y las circunstancias ayudan al llamador a entender el alcance.
- **Usa la jerarquía de errores de Rust:** Para errores de entrada y salida existe `std::io::Error`, para otros casos puedes construir los tuyos.

```rust
fn validar_edad(edad: i32) -> Result<i32, String> {
    if edad < 0 {
        return Err(format!("Edad inválida: {}", edad));
    }
    Ok(edad)
}
```

- `Result<i32, String>`: El tipo del error puede ser un simple texto explicativo.
- `Err(format!(...))`: El mensaje incluye el dato culpable, imposible de ignorar.
- `Ok(edad)`: El éxito devuelve el valor validado.

:::tip
💡 No subestimes el poder de un error claro: en un proyecto grande, más del tiempo de depuración se consume descifrando mensajes de error pobres. Escribe cada error como si otra persona, o tú mismo en tres meses, fuera a leerlo.
:::

## 5. El flujo típico en código real

En la práctica, los proyectos combinan ambas herramientas con naturalidad. El patrón más común es claro: la **capa de interfaz** (lo que el usuario toca) usa `Result` para ser tolerante, mientras las capas internas confían en invariantes y pueden permitirse pánico cuando algo imposible sucede.

- El programa lee un archivo con `Result`: el archivo puede faltar, eso se maneja.
- Valida los datos leídos con `Result`: pueden estar corruptos, eso se informa.
- Procesa y supone que las estructuras internas están sanas: si un índice se sale, `panic!` es legítimo porque indica un bug de programación, no un problema del usuario.

Recuerda también la combinación práctica: `unwrap` en la función `main` de un ejemplo sencillo es aceptable, porque el error terminará mostrándose en la terminal igualmente. La clave siempre es la misma: **piensa en quién llama a tu código y qué necesita saber para decidir.**

## Buenas prácticas

- Pregúntate siempre si el llamador puede recuperarse del error; eso define tu elección.
- Usa `Result` en contratos públicos, entrada del usuario y cualquier operación con el mundo exterior.
- Reserva `panic!` para invariantes rotos, prototipos y tests.
- Escribe errores descriptivos con contexto y dato culpable.
- No conviertas errores recuperables en pánico dentro de bibliotecas que otros usarán.

## Resumen rápido

- **`Result`**: para fallas esperables que el llamador puede manejar.
- **`panic!`**: para invariantes rotos, prototipos, ejemplos y tests.
- Los contratos públicos y la interacción con el mundo exterior piden `Result` casi siempre.
- Un buen error describe el problema, da contexto y facilita la decisión del llamador.
- En proyectos reales conviven ambos: capas externas tolerantes, capas internas confiadas en sus invariantes.

Con esto cierras el manejo de errores y ya tienes el arsenal para construir programas robustos que fallan con elegancia. En el próximo capítulo darás el siguiente paso natural: aprender a **escribir tests** que verifiquen que todo lo que construiste se comporta exactamente como esperas.