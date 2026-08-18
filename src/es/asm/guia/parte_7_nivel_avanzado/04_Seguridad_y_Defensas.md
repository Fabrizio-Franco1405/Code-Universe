---
outline: [2, 3]
---

# Seguridad y defensas

El poder del ensamblador tiene dos caras: control total para construir, y control total para romper. Este capítulo te enseña las **vulnerabilidades clásicas de la memoria** —especialmente el desbordamiento de buffer— y las defensas que existen hoy. Entenderlas a nivel de instrucción te convierte en un programador que no las comete... y que sabe reconocerlas cuando aparecen.

## 1. El desbordamiento de buffer

La vulnerabilidad más famosa de la historia del software: escribir **más bytes de los que caben** en un buffer. En ensamblador no hay límites automáticos, así que la responsabilidad es tuya.

```nasm
section .bss
    buffer resb 16       ; solo 16 bytes reservados

section .text
    ; ... copiamos 32 bytes a buffer (¡desbordando!)
    mov rcx, 32
copiar:
    mov al, [rsi]
    mov [rdi], al
    inc rsi
    inc rdi
    loop copiar
```

- El buffer solo reservó 16 bytes.
- El bucle escribe 32: los 16 últimos pisan la memoria vecina.
- Si esa memoria vecina es la **pila**, la corrupción puede ser catastrófica.

El desbordamiento no "avisa": sobrescribe silenciosamente lo que haya al lado. Por eso es tan peligroso y tan difícil de encontrar con un fallo limpio.

:::danger
Nunca copies datos a un buffer sin verificar el tamaño de destino. Escribir de más no solo corrompe tus datos: puede permitir que un atacante ejecute código arbitrario. Es el error de seguridad más grave que existe.
:::

## 2. El ataque clásico: Corromper el retorno

¿Por qué el desbordamiento es una puerta de entrada? Porque al desbordar un buffer en la pila puedes alcanzar la **dirección de retorno** que guardó `call`. Si la sobrescribes con una dirección maliciosa, el `ret` saltará ahí.

```text
Pila antes del ataque:           Pila después:
+------------------------+       +------------------------+
| datos del buffer       |       | datos del buffer       |
| (16 bytes)             |       | (se llena a propósito) |
+------------------------+       +------------------------+
| dirección de retorno ← | ←═══  | dirección MALICIOSA ←─ |
| (la que puso call)     |       | (el atacante la puso)  |
+------------------------+       +------------------------+
```

- El buffer desbordado puede llegar hasta el retorno.
- El atacante escribe ahí la dirección de su propio código (o de una función del sistema).
- Al ejecutar `ret`, la CPU salta a la dirección controlada: **control total del programa**.

Este ataque clásico se llama *stack smashing*, y es la base de infinidad de exploits históricos. La buena noticia: el hardware y los sistemas modernos lo hacen mucho más difícil, como veremos a continuación.

## 3. Las defensas modernas

Contra este ataque, la industria construyó capas de defensa. Toda defensa es profunda:

**NX bit (memoria no ejecutable):**

```bash
# los datos y la pila NO son ejecutables
```

- La pila y los datos se marcan como **no ejecutables**: aunque el atacante meta código ahí, la CPU se niega a ejecutarlo.

**ASLR (Address Space Layout Randomization):**

```bash
# las direcciones de la pila y el código cambian en cada ejecución
```

- El sistema coloca la pila, el montículo y el código en direcciones **aleatorias**.
- El atacante no sabe a qué dirección apuntar su retorno.

**Canarios (stack canaries):**

```nasm
; el compilador inserta un valor centinela antes del retorno
    mov [rbp-8], canario      ; valor secreto
    ; ... cuerpo que usa el buffer ...
    cmp [rbp-8], canario      ; ¿sigue intacto?
    jne  detener              ; si cambió → desbordamiento → abortar
```

- Antes del retorno se coloca un valor secreto (el **canario**).
- Antes de `ret`, se verifica que siga intacto.
- Si el desbordamiento lo tocó, el programa aborta en lugar de saltar.

Con estas tres defensas, el ataque clásico de *stack smashing* necesita además técnicas avanzadas (ROP, leaking de direcciones...). Por eso la seguridad moderna es una carrera de gato y ratón.

:::info Nota
ℹ️ Puedes verificar estas defensas en tu sistema con `checksec` (o `readelf -l`). La mayoría de los ejecutables modernos compilan con NX activado, PIE (ASLR) y canarios cuando el compilador los pide.
:::

## 4. Escribir código seguro en Ensamblador

Si escribes ensamblador, eres tú quien controla la memoria. Las prácticas que te protegen:

- **Verifica el tamaño de cada copia** antes de escribir (nunca copies a ciegas).
- **Usa `resb`/`resq` con el tamaño correcto** y respétalo en tus bucles.
- **Comprueba los punteros** antes de dereferenciarlos (`test` + `jz`).
- **Cierra los archivos y libera lo que pidas** para no agotar recursos.
- **Mantén los datos y el código separados** (datos en `.data`, no en `.text`).

```nasm
; copia SEGURA: solo copia si el destino tiene espacio
    cmp rdx, 16          ; cantidad a copiar
    ja  demaciado        ; > 16 → rechazar
    mov rcx, rdx
copiar:
    mov al, [rsi]
    mov [rdi], al
    inc rsi
    inc rdi
    loop copiar
```

- `cmp rdx, 16` + `ja`: rechazamos las copias que excedan el tamaño del buffer.
- El resto del bucle copia solo la cantidad validada.
- Esta validación previa es lo que separa el código seguro del vulnerable.

La regla de oro es una sola frase: **verifica antes de confiar**. Todo dato externo (teclado, archivo, red) es sospechoso hasta que se valida.

:::warning Advertencia
⚠️ En código de sistemas y de seguridad, la entrada del usuario es un campo de batalla. Toda longitud, puntero y tamaño que venga de afuera debe validarse antes de usarse. El ensamblador no te protege: eres tú la protección.
:::

## 5. Leer ensamblador para encontrar vulnerabilidades

Entender el ensamblador también te sirve como **auditor**: la ingeniería inversa de binarios usa estas mismas herramientas.

```bash
objdump -d programa        # desensambla y busca patrones
gdb programa               # sigue la ejecución instrucción por instrucción
strings programa           # encuentra cadenas reveladoras
checksec --file programa   # evalúa las defensas activas
```

- `objdump -d`: el mapa completo de instrucciones, ideal para buscar `mov` de copia sin límites.
- `gdb`: ejecución paso a paso para confirmar sospechas.
- `checksec`: saber qué defensas tiene el binario objetivo.

Patrones que delatan vulnerabilidades: bucles de copia sin comparación de tamaño, `mov` con índices que vienen de variables sin validar, buffers sin `cmp` previo. Aprender a verlos es el superpoder del auditor de seguridad.

## Resumen rápido

- El **desbordamiento de buffer** escribe de más en memoria sin avisar; puede corromper el **retorno**.
- Defensas modernas: **NX** (no ejecutar pila/datos), **ASLR** (direcciones aleatorias), **canarios**.
- La seguridad en ensamblador es manual: **verifica tamaños y punteros antes de usarlos**.
- El patrón seguro es `cmp` de límite + rechazo antes de copiar.
- `objdump`, `gdb` y `strings` son tus herramientas de auditoría.

Con la seguridad dominada, tienes todas las piezas del curso. En la **Parte VIII** llegó la hora de ponerlas a trabajar: un **proyecto final completo**, una calculadora CLI, con su depuración y su documentación.