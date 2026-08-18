---
outline: [2, 3]
---

# Bucles en Ensamblador

En el capítulo anterior aprendiste a tomar decisiones con `cmp` y saltos. Ahora verás cómo combinar ese poder para **repetir**: los bucles. En ensamblador no existen `for` ni `while`; existen etiquetas, saltos y el registro contador `RCX`. Con esas tres piezas se construye cualquier repetición.

## 1. La instrucción `loop`

NASM ofrece la instrucción **`loop`**, que usa el registro `RCX` como contador automático:

```text
mov rcx, 5          ; repetimos 5 veces
inicio_bucle:
    ; ... cuerpo del bucle ...
    loop inicio_bucle
```

- `mov rcx, 5`: el contador arranca en 5.
- `inicio_bucle:`: la etiqueta a la que volvemos.
- `loop inicio_bucle`: resta 1 a `RCX`; si `RCX != 0`, salta a la etiqueta; si llega a 0, continúa.

Cada `loop` hace tres cosas: decrementa, compara con cero y salta. Es el "for de un solo registro" del ensamblador.

```text
section .data
    mensaje db "vuelta", 0ah

section .text
    global _start

_start:
    mov rcx, 3          ; tres vueltas
volver:
    mov rax, 1
    mov rdi, 1
    mov rsi, mensaje
    mov rdx, 6
    syscall
    loop volver

    mov rax, 60
    mov rdi, 0
    syscall
```

- El cuerpo del bucle imprime `vuelta`.
- `loop volver` repite hasta que `RCX` llega a 0.
- El resultado: la palabra `vuelta` aparece 3 veces.

:::info Nota
ℹ️ `loop` usa **`RCX`** (o `ECX`/`CX` según el modo). Ten cuidado: si tu cuerpo de bucle también usa `RCX`, el contador se corrompe y el bucle se comporta de forma impredecible.
:::

## 2. Bucles con `cmp` y `jmp`

A veces necesitas más control que el que da `loop` (por ejemplo, salir a mitad del bucle). Entonces construyes el bucle a mano con `cmp` y `jmp`:

```text
mov rcx, 10
inicio:
    ; ... cuerpo ...
    dec rcx
    jnz inicio          ; si rcx != 0, repetir
```

- `dec rcx`: decrementa el contador manualmente.
- `jnz inicio`: mientras no sea cero, vuelve a `inicio`.
- Este patrón es el "while" del ensamblador: la condición la pones tú.

Y la versión ascendente (contando hacia arriba):

```text
mov rcx, 0
inicio:
    inc rcx
    cmp rcx, 10
    jl inicio           ; mientras rcx < 10
```

- `inc rcx` avanza el contador.
- `cmp rcx, 10` y `jl inicio` repiten mientras sea menor que 10.
- Aquí `rcx` termina valiendo 10, y sabes cuántas vueltas diste.

La ventaja de `cmp`/`jmp` es la flexibilidad: puedes usar cualquier registro como contador y salir cuando quieras con un `je` o un `jmp` extra.

:::tip
💡 Usa `loop` para repeticiones simples (contar vueltas) y `cmp`/`jmp` cuando el bucle necesite condiciones de salida o un contador que no sea `RCX`. Ambos estilos conviven en cualquier programa real.
:::

## 3. Sumando con un bucle

El ejemplo clásico: sumar los primeros N números. Veamos el patrón completo con datos en memoria:

```text
section .data
    n         dq 10
section .bss
    suma      resq 1

section .text
    global _start

_start:
    mov rax, 0          ; suma = 0
    mov rcx, [n]        ; contador = 10
bucle:
    add rax, rcx        ; suma += contador
    dec rcx
    jnz bucle           ; repetir hasta que el contador sea 0
    mov [suma], rax     ; guardamos el resultado

    mov rax, 60
    mov rdi, 0
    syscall
```

- `add rax, rcx`: acumulamos el valor actual del contador.
- `dec rcx` + `jnz bucle`: repetimos 10 veces.
- El resultado (`0+1+2+...+10 = 55`) se guarda en `suma`.

Observa cómo el acumulador vive en `RAX` y el contador en `RCX`, cada uno con su rol. Esa separación de responsabilidades es típica de los bucles en ensamblador.

## 4. Bucles anidados

Un bucle dentro de otro (anidamiento) requiere **dos contadores**. Como `loop` solo usa `RCX`, hay que guardar y restaurar su valor alrededor del bucle interno:

```text
mov rcx, 3          ; bucle externo: 3 vueltas
externo:
    mov r9, rcx      ; respaldamos el contador externo
    mov rcx, 2       ; bucle interno: 2 vueltas
interno:
    ; ... cuerpo ...
    loop interno
    mov rcx, r9      ; restauramos el contador externo
    loop externo
```

- `mov r9, rcx`: respalda el contador externo antes de que el interno lo pise.
- El bucle interno usa `RCX` libremente.
- `mov rcx, r9`: restaura el valor externo y `loop externo` sigue.

El patrón de **respaldar y restaurar** el contador es obligatorio con `loop`. Si no lo haces, el bucle interno "consume" el contador del externo y todo se descontrola.

:::warning Advertencia
⚠️ El bucle interno reinicia su contador en cada vuelta del externo. Si el cuerpo interno modifica `RCX`, guarda y restaura siempre; olvidarlo produce bucles infinitos o vueltas de más que son muy difíciles de rastrear.
:::

## 5. Bucles con acceso a memoria

En la práctica, los bucles recorren datos: arreglos, cadenas, listas. El patrón básico usa un **puntero** que avanza:

```text
section .data
    numeros dq 2, 4, 6, 8, 10
section .bss
    resultado resq 1

section .text
    global _start

_start:
    mov rcx, 5          ; 5 elementos
    mov rsi, numeros    ; puntero al inicio
    mov rax, 0          ; acumulador
recorrer:
    add rax, [rsi]      ; sumamos el elemento actual
    add rsi, 8          ; avanzamos al siguiente (cada qword son 8 bytes)
    loop recorrer
    mov [resultado], rax

    mov rax, 60
    mov rdi, 0
    syscall
```

- `mov rsi, numeros`: `RSI` apunta al primer elemento.
- `add rax, [rsi]`: suma el valor apuntado.
- `add rsi, 8`: avanza el puntero 8 bytes (el tamaño de cada `qword`).
- Resultado: `2+4+6+8+10 = 30` en `resultado`.

Este patrón —puntero que avanza sumando el tamaño del elemento— es la base de todo el recorrido de datos, y lo retomaremos a fondo en la Parte IV con el direccionamiento.

## Resumen rápido

- `loop` decrementa `RCX`, compara con cero y salta: el "for" automático.
- Con `cmp`/`jmp` construyes bucles con contador manual y salidas a medida.
- Guarda y restaura `RCX` en bucles anidados; nunca dejes que un bucle interno lo pise.
- El acumulador (`RAX`) y el contador (`RCX`) suelen tener roles separados.
- Recorrer datos usa un puntero (`RSI`) que avanza el tamaño del elemento.

Ya puedes repetir y recorrer datos. Ahora viene una de las piezas más importantes del rompecabezas: en la **Parte III** estudiaremos **la pila y las funciones**, el mecanismo que permite dividir los programas en piezas que se llaman entre sí.