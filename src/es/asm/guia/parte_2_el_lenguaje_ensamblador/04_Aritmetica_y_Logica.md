---
outline: [2, 3]
---

# Aritmética y operaciones lógicas

Ya mueves datos con soltura. Ahora toca hacer algo con ellos: sumar, restar, multiplicar, dividir y operar a nivel de bits. Este capítulo te presenta la ALU, la "calculadora" de la CPU, y las instrucciones que la manejan.

## 1. Suma y resta

Las instrucciones básicas son `add`, `sub`, `inc` y `dec`. Todas ellas modifican las banderas de `RFLAGS`:

```nasm
mov rax, 10
add rax, 5        ; rax = 15
sub rax, 3        ; rax = 12
inc rax           ; rax = 13
dec rax           ; rax = 12
```

- `add rax, 5`: suma 5 a `RAX` y guarda el resultado en `RAX`.
- `sub rax, 3`: resta 3 a `RAX`.
- `inc`/`dec`: suman o restan 1, y son ligeramente más compactas que `add reg, 1`.

La forma `add destino, origen` sigue la misma lógica que `mov`: el resultado va al primer operando.

```nasm
add rax, rbx       ; rax = rax + rbx
add [total], rax   ; la memoria "total" recibe su valor + rax
```

- `add rax, rbx`: suma dos registros.
- `add [total], rax`: suma a un valor en memoria (pero no permite memoria + memoria).

:::warning Advertencia
⚠️ `add` y `sub` modifican las banderas. Si justo después haces un salto condicional asumiendo que "no cambió nada", te llevarás una sorpresa. Las banderas se consultan y se pierden; no son eternas.
:::

## 2. Multiplicación

La multiplicación es menos intuitiva porque depende del tamaño de los operandos. La instrucción es `imul`:

```nasm
mov rax, 7
mov rbx, 6
imul rbx            ; rax = 7 * 6 = 42
```

- `imul rbx` (forma de un operando): multiplica `RAX * RBX` y el resultado se parte entre `RDX:RAX`.
- Si el resultado cabe en 64 bits, solo te interesa `RAX`; si desborda, la parte alta va a `RDX`.

También existe la forma de dos operandos, más cómoda:

```nasm
mov rax, 7
imul rax, rax, 6    ; rax = 7 * 6 = 42
```

- `imul destino, origen1, origen2`: multiplica los dos últimos y guarda en el primero.
- Esta forma solo guarda los 64 bits bajos; el desbordamiento se pierde (salvo las banderas).

## 3. División

La división es la más delicada: usa **tres registros** de forma implícita. El dividendo vive en `RDX:RAX` (la parte alta en `RDX`), y el divisor se pasa como operando:

```nasm
mov rax, 42         ; dividendo (bajo)
mov rdx, 0          ; dividendo (alto) = 0
mov rbx, 6          ; divisor
idiv rbx            ; rax = cociente (7), rdx = resto (0)
```

- Antes de dividir, **debes poner `RDX` en cero** (para división sin signo) o extender el signo.
- Después de `idiv`: `RAX` guarda el **cociente** y `RDX` el **resto**.
- Olvidarte de limpiar `RDX` produce resultados absurdos: la CPU divide el número de 128 bits `RDX:RAX`.

```nasm
mov rax, 17
mov rdx, 0
mov rbx, 5
idiv rbx            ; rax = 3, rdx = 2
```

- `17 / 5 = 3` (cociente en `RAX`).
- El resto `2` queda en `RDX`.

:::danger
La división **no perdona** el divisor cero: produce una excepción de hardware que el sistema operativo convierte en "Floating point exception" (o simplemente mata el proceso). Valida tus divisores antes de dividir.
:::

## 4. Operaciones lógicas y de bits

La ALU también trabaja bit a bit. Estas instrucciones son la base de las **máscaras** y de infinidad de trucos:

```nasm
and rax, rbx        ; rax = rax & rbx   (Y lógica)
or  rax, rbx        ; rax = rax | rbx   (O lógica)
xor rax, rax        ; rax = 0           (¡la forma rápida de poner a cero!)
not rax             ; rax = ~rax        (invierte todos los bits)
```

- `and`: bit a bit, `1` solo si ambos son `1`. Sirve para limpiar bits.
- `or`: bit a bit, `1` si al menos uno es `1`. Sirve para encender bits.
- `xor rax, rax`: pone a cero `RAX` (todo bit consigo mismo da `0`). Es la forma estándar de "cero".
- `not`: invierte todos los bits.

Los **desplazamientos** mueven los bits a izquierda o derecha:

```nasm
shl rax, 1          ; rax = rax * 2  (desplazamiento a la izquierda)
shr rax, 2          ; rax = rax / 4  (desplazamiento a la derecha)
```

- `shl` a la izquierda multiplica por potencias de 2.
- `shr` a la derecha divide entre potencias de 2 (sin signo).
- Los bits que "salen" por el extremo van a la bandera `CF`.

:::tip
💡 `shl` y `shr` son mucho más rápidas que `imul`/`idiv` para potencias de dos. `n * 8` = `shl rax, 3`; `n / 16` = `shr rax, 4`. Los compiladores generan estas instrucciones automáticamente, y tú puedes usarlas igual que ellos.
:::

## 5. Un ejemplo concreto

Combinemos todo para calcular el área de un rectángulo, por ejemplo `ancho × alto`:

```nasm
section .data
    ancho  dq 15
    alto   dq 8
section .bss
    area   resq 1

section .text
    global _start

_start:
    mov rax, [ancho]
    mov rbx, [alto]
    imul rax, rbx       ; rax = 15 * 8 = 120
    mov [area], rax

    mov rax, 60
    mov rdi, 0
    syscall
```

- Cargamos `ancho` y `alto` desde la memoria.
- `imul rax, rbx`: multiplica y deja el resultado en `RAX`.
- Guardamos el resultado en la memoria `area`.
- Terminamos con `exit` como siempre.

Este patrón —cargar de memoria, operar, guardar en memoria— es la esencia de casi todo programa ensamblador.

## Resumen rápido

- `add`, `sub`, `inc`, `dec`: suma y resta básicas, modifican banderas.
- `imul`: multiplica; con un operando usa `RDX:RAX`, con dos operandos es directa.
- `idiv`: divide `RDX:RAX`; cociente en `RAX`, resto en `RDX`. ¡Limpia `RDX` antes!
- `and`, `or`, `xor`, `not`: operaciones lógicas bit a bit.
- `shl`/`shr`: multiplican y dividen por potencias de 2, muy rápido.

Con la aritmética dominada, tu programa necesita tomar decisiones: en el próximo capítulo veremos **las comparaciones y los saltos**, el mecanismo que da vida a los `if` y las estructuras de control.