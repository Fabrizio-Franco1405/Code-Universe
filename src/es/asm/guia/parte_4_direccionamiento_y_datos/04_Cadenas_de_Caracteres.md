---
outline: [2, 3]
---

# Cadenas de caracteres

Los arreglos de bytes nos llevan al tema más cotidiano de la programación: las **cadenas** (strings). En ensamblador no existe el tipo `string`: una cadena es simplemente un arreglo de bytes con una convención — un **marcador de final**. Este capítulo te enseña a crearlas, medirlas, recorrerlas y escribirlas en pantalla.

## 1. ¿Qué es una cadena en ensamblador?

Una cadena es una secuencia de bytes en memoria, uno por carácter. La pregunta clave es: **¿cómo saber dónde termina?** La convención clásica es el **cero final** (NUL): el byte `0` marca el fin.

```nasm
section .data
    saludo db "Hola", 0        ; los 4 caracteres + el 0 final
    nombre db "Ada", 0ah, 0    ; con salto de línea
```

- `db "Hola", 0`: los bytes `H`, `o`, `l`, `a` y el terminador `0`.
- El terminador no se imprime: es solo la señal de "la cadena termina aquí".
- Esta es exactamente la convención de las cadenas de C (`char *`).

Sin el terminador, cualquier función que recorra la cadena no sabría cuándo parar y seguiría leyendo basura. El `0` es la frontera invisible.

:::info Nota
ℹ️ El terminador `0` es distinto del carácter `'0'` (que es el byte `48`). No los confundas: `0` es el byte cero que marca el final, y `'0'` es el dígito cero que se imprime.
:::

## 2. Imprimir una cadena con write

Ya imprimiste texto en el primer programa: la syscall `write` necesita la dirección y **la longitud exacta** de la cadena.

```nasm
section .data
    mensaje db "Hola, mundo!", 0ah, 0
section .text
    global _start

_start:
    mov rax, 1          ; write
    mov rdi, 1          ; pantalla
    mov rsi, mensaje    ; dirección
    mov rdx, 13         ; longitud en bytes
    syscall

    mov rax, 60
    mov rdi, 0
    syscall
```

- `write` no conoce el terminador: le das la **cantidad exacta de bytes** en `rdx`.
- Si `rdx` es menor, se corta el texto; si es mayor, se imprime basura de más.
- Contar a mano (`13`) funciona para cadenas fijas, pero no escala: para eso está la función de la siguiente sección.

## 3. Medir una cadena: La función `strlen`

Para imprimir cualquier cadena sin contar a mano, necesitas una función que recorra hasta el `0` y devuelva su longitud. Es la clásica `strlen`:

```nasm
longitud_cadena:
    ; rdi = dirección de la cadena
    ; devuelve: rax = longitud (sin contar el 0)
    mov rax, 0          ; contador de caracteres
recorrer:
    cmp byte [rdi], 0   ; ¿llegamos al terminador?
    je  terminar
    inc rdi             ; avanzamos un byte
    inc rax             ; y sumamos uno al contador
    jmp recorrer
terminar:
    ret
```

- `cmp byte [rdi], 0`: lee el byte actual y lo compara con cero.
- `je terminar`: si es el terminador, terminamos.
- `inc rdi` + `inc rax`: avanzamos y contamos.
- Resultado: `rax = longitud` (sin el `0`).

Probemos con nuestro mensaje:

```nasm
    mov rdi, mensaje
    call longitud_cadena    ; rax = 13
    mov rdx, rax            ; la longitud es el tamaño a escribir
```

- `mov rdx, rax`: usamos el resultado como longitud.
- Ahora `write` imprime exactamente lo que mide la cadena, sin contar a mano.

:::tip
💡 `cmp byte [rdi], 0` es la instrucción que lee un byte de memoria y lo compara con cero. Es la "pregunta" que recorre toda cadena terminada en cero. Memorízala: la verás en cada programa real.
:::

## 4. La versión "sin etiqueta local": Estructurar bien

La función anterior usaba un salto hacia atrás con `jmp`. Una versión equivalente pero más ordenada, típica en código profesional, separa la comprobación del avance:

```nasm
longitud_cadena:
    mov rax, 0
siguiente:
    cmp byte [rdi], 0
    je  terminar
    inc rdi
    inc rax
    jmp siguiente
terminar:
    ret
```

- El bucle se lee de forma natural: "compara, si es el final terminamos, si no avanzamos y repetimos".
- El patrón `cmp` + `je` + `jmp` de retorno es el "while" estándar en ensamblador.
- La etiqueta `siguiente` y `terminar` dejan claro el flujo.

Esta versión no usa `loop` a propósito: la cantidad de vueltas no se conoce de antemano, así que el bucle se controla por condición, no por contador.

## 5. Construir y recorrer cadenas

Además de medirlas, las cadenas se recorren para transformarlas. Veamos una función que convierte a mayúsculas cada letra minúscula:

```nasm
a_mayusculas:
    ; rdi = dirección de la cadena (se modifica en el lugar)
siguiente:
    mov al, [rdi]       ; leemos el carácter actual
    cmp al, 0           ; ¿fin de la cadena?
    je  terminar
    cmp al, 'a'         ; ¿es una minúscula?
    jl  avanzar
    cmp al, 'z'
    jg  avanzar
    sub al, 32          ; 'a'(97) - 32 = 'A'(65)
    mov [rdi], al       ; escribimos la mayúscula
avanzar:
    inc rdi
    jmp siguiente
terminar:
    ret
```

- `mov al, [rdi]`: lee el byte actual en la parte baja de `RAX`.
- `cmp al, 'a'` y `cmp al, 'z'`: verificamos si es una letra minúscula.
- `sub al, 32`: la diferencia entre `'a'` y `'A'` es 32.
- `mov [rdi], al`: escribimos el carácter transformado de vuelta a memoria.

Esta función **modifica la cadena original** (paso por dirección), algo que ya sabes hacer gracias al capítulo de punteros. Las letras minúsculas se convierten en mayúsculas en el mismo lugar.

:::warning Advertencia
⚠️ Si transformas una cadena, asegúrate de que el terminador `0` siga ahí: no lo sobrescribas con un carácter. Si borras el terminador, la próxima `longitud_cadena` leerá memoria sin fin (hasta chocar con un byte cero lejano o fallar).
:::

## Resumen rápido

- Una cadena es un **arreglo de bytes** con terminador `0`.
- `write` necesita la **longitud exacta**, no el terminador.
- `longitud_cadena` recorre con `cmp byte [rdi], 0` hasta el fin.
- El patrón `cmp` + `je` + `jmp` de retorno es el "while" de ensamblador.
- Puedes transformar cadenas en el lugar recorriendo bytes y escribiéndolos de vuelta.

Con arreglos y cadenas ya tienes las herramientas de datos más importantes. Ahora tu programa necesita hablar con el mundo exterior: en la **Parte V** veremos **las syscalls**, el puente entre tu código y el sistema operativo.