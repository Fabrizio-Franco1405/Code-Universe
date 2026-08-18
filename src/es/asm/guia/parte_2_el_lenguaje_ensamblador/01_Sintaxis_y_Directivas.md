---
outline: [2, 3]
---

# Sintaxis, directivas y etiquetas

En la Parte I entendiste la máquina: registros, memoria y el ciclo de ejecución. Ahora empezamos a escribir. Este capítulo es la gramática del ensamblador NASM: cómo se estructura una línea, qué son las directivas y para qué sirven las etiquetas.

## 1. La anatomía de una línea

En NASM, casi todo el código se escribe con una instrucción por línea, en un formato fijo que conviene dominar:

```text
etiqueta:   mnemónico   operando, operando   ; comentario
```

```text
inicio:
    mov     rax, 1       ; syscall para escribir
```

- `inicio:`: la **etiqueta** (opcional), seguida de dos puntos.
- `mov`: el **mnemónico**, la operación que ejecuta la CPU.
- `rax, 1`: los **operandos**, separados por coma. En general, primero el destino y luego el origen.
- `;`: todo lo que sigue es un **comentario** y se ignora al ensamblar.

El mnemónico y los operandos son las únicas partes obligatorias. Los comentarios no son decoración: en un lenguaje tan conciso, son la mejor forma de que tu código siga teniendo sentido al día siguiente.

:::info Nota
ℹ️ NASM no distingue mayúsculas de minúsculas en mnemónicos ni registros: `MOV` es igual a `mov`. La convención es escribir las instrucciones en minúsculas y las etiquetas en minúsculas con `_` (snake_case).
:::

## 2. Tipos de operandos

Los operandos pueden ser de tres clases fundamentales. Distinguirlas es la mitad del dominio del ensamblador:

- **Registro:** `rax`, `rbx`, `ecx`... Un valor que ya está dentro de la CPU.
- **Inmediato:** un número literal como `1`, `60` o `0ah`. Se escribe tal cual; la CPU lo trae en la propia instrucción.
- **Memoria:** entre corchetes `[dirección]`, accede a lo que hay guardado en esa dirección.

```text
mov rax, 1        ; inmediato → registro
mov rax, rbx      ; registro → registro
mov rax, [suma]   ; memoria → registro (lee el valor en la dirección "suma")
```

- `mov rax, 1`: copia el número `1` a `RAX`.
- `mov rax, rbx`: copia el valor de `RBX` a `RAX`.
- `mov rax, [suma]`: lee el valor almacenado en la dirección `suma` y lo copia a `RAX`.

:::warning Advertencia
⚠️ En NASM, escribir `mov rax, suma` (sin corchetes) copia la **dirección** de `suma`, no su valor. Los corchetes significan "el contenido de esa dirección". Confundirlos es el error número uno de los principiantes y produce valores absurdos.
:::

## 3. Directivas: Instrucciones para el ensamblador

Las **directivas** son órdenes que recibe el *ensamblador* (no la CPU) durante la traducción. Se distinguen porque no son instrucciones que se ejecuten: controlan cómo se genera el código.

Las más comunes:

```text
section .data            ; declara una sección del programa
    mensaje db "Hola", 0 ; define bytes en esa sección

section .text
    global _start        ; exporta la etiqueta _start

    extern printf        ; importa un símbolo definido en otro archivo

    equ ENTERO: equ 10   ; define una constante
```

- `section`: declara una sección (`.data`, `.bss`, `.text`). El siguiente capítulo las estudia a fondo.
- `global`: hace pública una etiqueta, visible para el enlazador y otros archivos.
- `extern`: declara un símbolo definido en otro archivo (por ejemplo, una función de la biblioteca de C).
- `equ`: define una **constante simbólica**. `DIEZ equ 10` permite escribir `DIEZ` en lugar de `10` en todo el archivo.

Las directivas existen porque el ensamblador necesita más información de la que el código de máquina conoce: qué símbolos compartir, cuánto espacio reservar, cómo interpretar los datos.

## 4. Etiquetas: Nombres para direcciones

Una **etiqueta** es un nombre que le pones a una dirección de memoria. Cuando el ensamblador la encuentra, anota la posición actual; cuando el resto del programa usa ese nombre, lo reemplaza por esa dirección.

```text
section .data
mensaje:  db "Hola", 0    ; "mensaje" apunta al inicio de estos bytes

section .text
    mov rsi, mensaje      ; rsi recibe la dirección de "mensaje"
```

- `mensaje:` declara la etiqueta en la dirección donde comienza el dato.
- `mov rsi, mensaje` copia esa **dirección**, no el contenido.
- Las etiquetas pueden ser **locales** (con punto: `.siguiente`) o **globales**, y se usan también para marcar saltos y bucles, como verás en los próximos capítulos.

Las etiquetas son la forma en que el ensamblador te deja trabajar con direcciones sin memorizar números. El enlazador (o el ensamblador) calcula el valor real por ti.

:::tip
💡 Usa nombres de etiquetas descriptivos en español: `mensaje`, `contador`, `_start`, `fin_de_bucle`. Un buen nombre hace que el ensamblador, normalmente críptico, se lea casi como pseudocódigo.
:::

## 5. El orden de los campos y el estilo

Aunque NASM es flexible con los espacios, mantener un estilo consistente hace el código mucho más legible. Esta es la convención que usaremos en toda la guía:

```text
section .data
    mensaje db "Hola", 0

section .text
    global _start

_start:
    mov rax, 1
    mov rdi, 1
    mov rsi, mensaje
    mov rdx, 5
    syscall

    mov rax, 60
    mov rdi, 0
    syscall
```

- Los mnemónicos alineados en la misma columna.
- Los operandos separados por una coma y un espacio.
- Los comentarios en una columna aparte cuando hay espacio.
- Las etiquetas de sección sin sangría; las instrucciones, con cuatro espacios.

Ese orden visual no es obligatorio, pero facilita leer decenas de líneas de ensamblador sin perder el hilo, y en la Parte VIII verás cómo las buenas herramientas de depuración se apoyan en líneas claras.

## Resumen rápido

- Una línea NASM es `etiqueta: mnemónico operando, operando ; comentario`.
- Los operandos pueden ser **registro**, **inmediato** (número) o **memoria** (`[ ]`).
- Las **directivas** (`section`, `global`, `extern`, `equ`) ordenan al ensamblador, no a la CPU.
- Las **etiquetas** son nombres para direcciones de memoria.
- `[suma]` es el contenido; `suma` es la dirección. No los confundas.

Con la gramática clara, vamos a organizar el programa en su hábitat natural: en el próximo capítulo estudiaremos **las secciones del programa** (`data`, `bss`, `text`) y qué vive en cada una.