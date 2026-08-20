---
outline: [2, 3]
---

# El ABI de C

En la Parte III estudiaste la convención SysV. Ahora descubrirás que es **la misma convención que usa C**: llamar a `printf` desde tu ensamblador es posible porque ambos respetan el mismo ABI. Este capítulo te muestra el puente, con la alineación y las precauciones que C exige.

## 1. ¿Por qué C y Ensamblador se entienden?

C compilado y tu ensamblador comparten el mismo "lenguaje" de funciones: el **ABI SysV AMD64**. Eso significa que:

- Los argumentos van en los mismos registros (`rdi`, `rsi`, `rdx`, `rcx`, `r8`, `r9`).
- El resultado vuelve en `rax`.
- La pila se alinea a 16 bytes en el momento del `call`.
- Los registros callee-saved son los mismos (`rbx`, `rbp`, `r12`-`r15`).

Por eso puedes escribir funciones en ensamblador y llamarlas desde C, o llamar a las funciones de la biblioteca de C desde tu ensamblador. No hay traducción: es el mismo ABI en ambos lados.

```text
Ensamblador                       C
+------------------------+      +------------------------+
| call printf             |----->| int printf(...)         |
|  (usa el ABI SysV)      |      |  (usa el ABI SysV)      |
+------------------------+      +------------------------+
```

- `extern printf` declara la función de la biblioteca.
- `call printf` la invoca con los argumentos ya en los registros correctos.
- La biblioteca de C devuelve en `rax` (por ejemplo, los caracteres impresos).

## 2. Llamar a printf desde Ensamblador

El ejemplo clásico del puente: usar `printf` para imprimir con formato. Necesitas:

1. La cadena de formato en `.data` (terminada en cero).
2. `extern printf` para declararla.
3. Los argumentos según la convención.
4. La pila **alineada** antes de llamar.

```text
extern printf

section .data
    formato db "El resultado es %d", 0ah, 0

section .text
    global main

main:
    sub rsp, 8           ; alineamos la pila (más abajo se explica)

    mov rdi, formato     ; 1er argumento: la cadena de formato
    mov rsi, 42          ; 2do argumento: el número a insertar
    mov eax, 0           ; sin argumentos de coma flotante
    call printf

    add rsp, 8
    ret
```

- `mov rdi, formato`: el formato es el primer argumento.
- `mov rsi, 42`: el valor que reemplaza a `%d`.
- `mov eax, 0`: le indica a `printf` que no hay argumentos de punto flotante.
- `call printf`: imprime `El resultado es 42`.

:::warning Advertencia
⚠️ **C no respeta el `%` de la terminal**: `%d`, `%s`, `%x` son marcadores de posición de `printf`, y cada uno espera un argumento de un tipo concreto. Pasar un argumento del tipo equivocado produce basura o fallos.
:::

## 3. La regla de la alineación

Este es el detalle que más fallos causa al mezclar con C. La convención exige que **al ejecutar `call`, `rsp` sea múltiplo de 16**. Recordemos por qué:

- `call` empuja 8 bytes (la dirección de retorno), desalineando.
- Dentro de la función C, el compilador hace `push rbp` (otros 8), volviendo a alinear.
- Las instrucciones SSE (usadas por `printf` para copiar datos) exigen esa alineación.

```text
main:
    sub rsp, 8       ; si rsp era múltiplo de 16, sigue siéndolo tras el call
    call printf
    add rsp, 8
    ret
```

- `sub rsp, 8` antes del `call` garantiza que, tras los 8 bytes que empuja el `call`, `rsp` quede alineado a 16.
- La cantidad a restar depende de cuánto se haya movido `rsp` antes.
- Regla práctica: antes de cada `call`, ajusta `rsp` para que el `call` + el resto estén alineados.

Si `printf` (o cualquier función C) crashea o se comporta raro sin motivo aparente, revisa primero la alineación: es el culpable número uno.

:::tip
💡 Un truco para no pensar: en `main`, haz `sub rsp, 8` justo antes de cada `call printf` (o un `and rsp, -16` una vez). El compilador de C lo hace automáticamente; tú debes hacerlo a mano.
:::

## 4. Usar el registro de coma flotante

`printf` con `%f` usa los registros **SSE** (`xmm0`, `xmm1`...) en lugar de los enteros. Cuando haya argumentos flotantes:

- Van en `xmm0`, `xmm1`, etc. (en orden).
- `eax` debe indicar **cuántos** hay.

```text
extern printf

section .data
    formato db "El promedio es %f", 0ah, 0

section .text
    global main

main:
    sub rsp, 8

    movsd xmm0, [promedio]   ; 1er argumento flotante
    mov  rdi, formato        ; la cadena de formato
    mov  eax, 1              ; 1 argumento flotante
    call printf

    add rsp, 8
    ret
```

- `movsd xmm0, [promedio]`: copia un double (8 bytes) a `xmm0`.
- `mov eax, 1`: informa a `printf` que hay 1 argumento en los registros flotantes.
- Los registros `xmm` los estudiaremos a fondo en la Parte VII.

Si `eax` no coincide con la cantidad real de flotantes, `printf` leerá registros equivocados y el resultado será basura.

## 5. Tu primera función de ensamblador llamada desde C

El puente funciona en ambos sentidos. Escribe una función en NASM, expórtala con `global`, y llámala desde C:

```text
; doble.asm
global doble

doble:
    lea rax, [rdi + rdi]    ; devuelve el argumento * 2
    ret
```

```c
/* main.c */
#include <stdio.h>

extern long doble(long x);

int main(void) {
    printf("El doble de 21 es %ld\n", doble(21));
    return 0;
}
```

Compilamos y enlazamos ambos:

```bash
nasm -f elf64 doble.asm -o doble.o
gcc main.c doble.o -o programa
./programa
```

```text
El doble de 21 es 42
```

- `nasm` genera el objeto con la función `doble`.
- `gcc` compila `main.c` y enlaza con `doble.o`.
- C llama a `doble` respetando el mismo ABI: `21` entra en `rdi` y espera el resultado en `rax`.

Ahí tienes la verdadera magia del ABI: dos lenguajes distintos se comunican sin fricción porque comparten el mismo contrato binario.

## Resumen rápido

- C y ensamblador comparten el **ABI SysV**: mismos registros de argumentos y retorno.
- `extern` declara funciones de C; `call` las invoca.
- **Alinea la pila a 16 bytes** antes de cada `call` a C (`sub rsp, 8`).
- Los argumentos flotantes van en `xmm0`... y `eax` cuenta cuántos hay.
- Funciones propias exportadas con `global` se llaman desde C sin problemas.

Ya cruzas el puente en ambos sentidos. En el próximo capítulo daremos el paso contrario: veremos **el ensamblador inline**, la forma de escribir ensamblador *dentro* de tu código C sin salir de él.