---
outline: [2, 3]
---

# Las secciones del programa: `data`, `bss`, `text`

Ya sabes escribir líneas de ensamblador. Ahora vamos a ordenar la casa: los programas NASM se dividen en **secciones**, cada una con un propósito y unas características propias. Este capítulo te enseña a distribuir tus datos y tu código donde corresponde.

## 1. Las tres secciones clásicas

Todo programa bien organizado declara tres secciones. Cada una es un "barrio" distinto en la memoria del ejecutable:

| Sección | Contenido | ¿Se puede escribir? |
|---------|-----------|---------------------|
| `.data` | Datos **inicializados** (con valor definido) | Sí |
| `.bss`  | Datos **sin inicializar** (solo se reserva espacio) | Sí |
| `.text` | Código e instrucciones | No (solo lectura) |

```text
section .data
    mensaje db "Hola, mundo!", 0ah

section .bss
    resultado resq 1

section .text
    global _start

_start:
    ...
```

- `.data`: guarda los valores que tu programa necesita con un valor inicial concreto.
- `.bss`: reserva espacio para datos cuyo valor se calculará en tiempo de ejecución.
- `.text`: contiene las instrucciones; el sistema operativo lo marca como de solo lectura y ejecutable.

La separación no es decorativa: el sistema operativo protege cada sección, y conocer esa protección te evita fallos de segmentación tontos (como intentar escribir dentro del código).

## 2. Definiendo datos con `db`, `dw`, `dd`, `dq`

En `.data` defines bytes con valores concretos. Recordemos las directivas de tamaño, ahora con ejemplos:

```text
section .data
    edad      db 30              ; 1 byte
    puntos    dw 1000            ; 2 bytes
    precio    dd 1999            ; 4 bytes
    total     dq 0               ; 8 bytes
    saludo    db "Hola", 0       ; cadena de bytes + el 0 final
```

- `db 30`: un byte con valor 30.
- `dw 1000`: una palabra (2 bytes) con valor 1000.
- `dd 1999`: un doble palabra (4 bytes).
- `dq 0`: un cuádruple palabra (8 bytes), el tamaño natural de x86-64.
- `db "Hola", 0`: una cadena terminada en cero (lo estudiaremos en la Parte IV).

Puedes definir varias etiquetas en la misma sección; cada una apunta a su dirección correspondiente, en el orden en que las declaras.

:::info Nota
ℹ️ Los datos de `.data` ocupan espacio **real en el archivo ejecutable**: el sistema operativo los carga ya con sus valores. Por eso solo van aquí los valores que conoces desde el inicio.
:::

## 3. Reservando espacio con `resb`, `resw`, `resq`

En `.bss` no defines valores: **reservas espacio** que se llenará durante la ejecución. Las directivas son las mismas pero con el prefijo `res`:

```text
section .bss
    buffer    resb 64        ; 64 bytes para un texto
    numeros   resq 10        ; 10 números de 8 bytes
    temp      resd 1         ; 1 valor de 4 bytes
```

- `resb 64`: reserva 64 bytes (b = byte).
- `resq 10`: reserva 10 * 8 = 80 bytes (q = qword).
- `resd 1`: reserva 4 bytes (d = dword).

La diferencia con `.data` es clave: `.bss` **no ocupa espacio en el ejecutable**. El archivo solo registra "aquí habrá 64 bytes cuando el programa corra". Por eso los buffers grandes van siempre a `.bss`, no a `.data`.

:::warning Advertencia
⚠️ No escribas ni leas fuera del espacio reservado. `resb 64` te da exactamente 64 bytes; leer el byte 65 es leer memoria ajena y puede corromper el programa o provocar un fallo de segmentación. El ensamblador no controla los límites por ti.
:::

## 4. El código vive en `.text`

La sección `.text` contiene las instrucciones. Sus características:

- **Solo lectura:** el sistema operativo protege esta zona; intentar escribir aquí causa un error.
- **Ejecutable:** el procesador puede ejecutar lo que contiene.
- Contiene la etiqueta de entrada `_start` (o funciones que verás en la Parte III).

```text
section .text
    global _start

_start:
    mov rax, 60
    mov rdi, 0
    syscall
```

- `global _start`: expone la entrada del programa al enlazador.
- Dentro de `.text` puedes declarar constantes con `equ` si lo necesitas, pero el estándar es que los datos vivan en `.data`/`.bss`.

Una curiosidad: los **datos no deben ir en `.text`**. Además de ser mala práctica, el sistema operativo los marcaría como código ejecutable, lo que aumenta la superficie de ataque de tu programa (más adelante, en el capítulo de seguridad, entenderás por qué importa).

## 5. El orden importa

Aunque el orden de las secciones no altera el resultado de tu programa, sí afecta dónde viven las cosas en memoria. El enlazador sigue un orden típico:

```text
Direcciones bajas  →  .text   (código)
                     .data   (datos inicializados)
                     .bss    (datos sin inicializar)
Direcciones altas  →  pila
```

- El código va primero, en las direcciones bajas.
- Luego los datos inicializados y, después, los sin inicializar.
- Este es el orden que verás al inspeccionar ejecutables con `objdump` o herramientas como `readelf`.

No necesitas memorizar las direcciones, pero saber que `.text` está en la parte baja explica por qué tus programas de ejemplo corren en torno a `0x401000`.

:::tip
💡 Regla mental para decidir dónde va cada dato: si ya sabes su valor al escribir el programa, va a `.data`; si lo vas a llenar cuando corra, a `.bss`; si es código, a `.text`. Tres preguntas, tres secciones.
:::

## Resumen rápido

- `.data`: datos **inicializados** con `db`/`dw`/`dd`/`dq`; ocupan espacio en el ejecutable.
- `.bss`: datos **sin inicializar**, reservados con `resb`/`resw`/`resq`; no ocupan espacio en el archivo.
- `.text`: instrucciones, de **solo lectura** y ejecutable.
- El orden en memoria es `.text` → `.data` → `.bss`, de direcciones bajas a altas.
- Respeta los límites de lo que reservas: el ensamblador no te cuida la memoria.

Ya sabes distribuir datos y código. Ahora viene la instrucción más usada de todas: en el próximo capítulo veremos **el movimiento de datos con `mov`** y sus primos `lea`, `movzx` y `movsx`.