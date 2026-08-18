---
outline: [2, 3]
---

# Proyecto: Calculadora CLI

Llegó el momento de juntar todo lo aprendido. Este proyecto final construye una **calculadora de línea de comandos**: lee una operación escrita por el usuario (por ejemplo, `12 + 7`), la resuelve y muestra el resultado. Usaremos entrada/salida con syscalls, conversión de texto a número, aritmética y el flujo completo de ensamblar y enlazar.

## 1. El diseño del programa

Antes de escribir, planifiquemos las partes del programa. Una calculadora CLI tiene estos pasos:

1. **Leer** la entrada del usuario (`read`).
2. **Parsear** la línea: extraer el primer número, el operador y el segundo número.
3. **Convertir** cada texto de dígitos a un número entero.
4. **Calcular** según el operador (`+`, `-`, `*`).
5. **Convertir** el resultado de número a texto.
6. **Mostrar** el resultado (`write`).
7. **Terminar** (`exit`).

La estructura modular es clave. Separamos la lógica en **funciones** que ya conoces: `texto_a_numero`, `numero_a_texto`, y `calcular`. Cada una con su responsabilidad, siguiendo el ABI.

```text
main
 ├─ leer_entrada       (read + buffer)
 ├─ texto_a_numero     (convierte "12" → 12)
 ├─ calcular           (12 + 7 → 19)
 ├─ numero_a_texto     (19 → "19")
 └─ mostrar_resultado  (write)
```

- La entrada se guarda en un buffer en `.bss`.
- Las funciones reciben argumentos por registros y devuelven en `rax`.
- El código se organiza por etiquetas claras, sin magia.

## 2. El esqueleto del programa

Empecemos con la estructura general. La entrada tendrá el formato `número operador número`, separados por espacios:

```text
section .data
    mensaje_pregunta db "Operación: ", 0
    mensaje_resultado db "Resultado: ", 0
    salto_linea db 0ah

section .bss
    buffer resb 64

section .text
    global _start

_start:
    ; mostrar el prompt
    mov rax, 1
    mov rdi, 1
    mov rsi, mensaje_pregunta
    mov rdx, 11
    syscall

    ; leer la entrada
    mov rax, 0
    mov rdi, 0
    mov rsi, buffer
    mov rdx, 64
    syscall
    ; rax = cantidad de bytes leídos (incluye el 0ah final)
    dec rax                    ; quitamos el salto de línea

    ; ... parsear y calcular ...

    ; terminar
    mov rax, 60
    mov rdi, 0
    syscall
```

- El prompt pregunta al usuario.
- `read` llena el buffer; `rax` tiene la longitud real.
- `dec rax`: descartamos el `0ah` del final para trabajar con la línea limpia.

A partir de aquí, conectaremos las funciones de parseo y cálculo.

## 3. Convertir texto a número

La primera función convierte una cadena de dígitos (como `"12"`) en el número `12`. Recibe en `rdi` la dirección y en `rsi` la longitud:

```text
; rdi = dirección del texto, rsi = longitud
; devuelve rax = número
texto_a_numero:
    mov rax, 0          ; acumulador
    mov rcx, 0          ; posición
siguiente_digito:
    cmp rcx, rsi
    jge terminar
    movzx rdx, byte [rdi + rcx]   ; carácter actual
    sub  rdx, '0'                 ; '0'(48) → 0
    imul rax, rax, 10             ; acumulador * 10
    add  rax, rdx                 ; + el dígito
    inc  rcx
    jmp siguiente_digito
terminar:
    ret
```

- `movzx rdx, byte [rdi + rcx]`: lee el carácter actual.
- `sub rdx, '0'`: convierte el carácter `'7'` (55) al dígito `7`.
- `imul rax, rax, 10` + `add rax, rdx`: la fórmula clásica `acumulador = acumulador*10 + dígito`.
- Con `"12"` el resultado es `((0*10+1)*10+2) = 12`.

Este es el patrón estándar de conversión a número: recorrer, convertir cada carácter restando `'0'`, y acumular multiplicando por 10.

:::info Nota
ℹ️ Si el carácter no es un dígito, `sub rdx, '0'` daría un número fuera de rango. Un programa robusto debería validar que cada carácter esté entre `'0'` y `'9'` antes de procesarlo. Lo verás como ejercicio al final.
:::

## 4. Parsear y calcular

Ahora la función que separa la línea en dos números y un operador. La entrada tiene la forma `12 + 7`:

```text
; rsi = dirección del buffer
; rdi = longitud
; salidas: r9 = número 1, r10 = número 2, r11 = operador
parsear:
    mov r8, 0               ; posición actual
    mov rcx, r8             ; inicio del primer número
buscar_espacio1:
    cmp r8, rdi
    jge fin_parse
    movzx rdx, byte [rsi + r8]
    cmp rdx, ' '
    je  numero1_listo
    inc r8
    jmp buscar_espacio1
numero1_listo:
    ; convertir el primer número
    mov rdi2, rsi
    ...
```

Este parseo puede volverse largo. Para mantener el proyecto manejable, simplifiquemos el enfoque con una estrategia clara:

- **Primer número:** desde el inicio hasta el primer espacio.
- **Operador:** el carácter después del primer espacio.
- **Segundo número:** desde después del operador hasta el final.

```text
parsear:
    ; rdi = longitud, rsi = buffer
    mov r8, 0           ; posición del operador
buscar_operador:
    movzx rdx, byte [rsi + r8]
    cmp rdx, '+'
    je  encontrado
    cmp rdx, '-'
    je  encontrado
    cmp rdx, '*'
    je  encontrado
    inc r8
    cmp r8, rdi
    jl  buscar_operador
    jmp error_operador
encontrado:
    ; primer número: [rsi, r8)
    mov  rdi, rsi           ; dirección del primer número
    mov  rsi, r8            ; longitud del primer número
    call texto_a_numero
    mov  r9, rax            ; número 1
    ...
```

- El bucle busca el carácter del operador (`+`, `-` o `*`) en la línea.
- El primer número es todo lo que hay antes; su longitud es la posición del operador.
- `texto_a_numero` lo convierte, y el resultado va a `r9`.

El segundo número empieza justo después del operador, y su longitud es `longitud_total - posición_del_operador - 1`. Con ambos números y el operador identificado, pasamos al cálculo.

## 5. La calculadora completa

Unamos las piezas con la función de cálculo y la conversión de vuelta a texto:

```text
calcular:
    ; r9 = número 1, r10 = número 2, r11 = operador
    mov rax, r9
    cmp r11, '+'
    je  sumar
    cmp r11, '-'
    je  restar
    cmp r11, '*'
    je  multiplicar
    jmp error_operador
sumar:
    add rax, r10
    jmp fin_calcular
restar:
    sub rax, r10
    jmp fin_calcular
multiplicar:
    imul rax, r10
fin_calcular:
    ret
```

- Según el operador, se elige la operación con saltos condicionales.
- El resultado queda en `rax`.
- Un operador inválido deriva a `error_operador` (que muestra un mensaje y sale).

Para mostrar el número, necesitamos la función inversa a `texto_a_numero`:

```text
; rax = número, rdi = buffer destino
; devuelve rdx = cantidad de dígitos
numero_a_texto:
    mov rcx, 0              ; contador de dígitos
    mov r8, 10              ; divisor
extraer_digito:
    mov rdx, 0
    idiv r8                 ; rax = cociente, rdx = dígito
    add rdx, '0'            ; dígito → carácter
    mov [rdi + rcx], dl     ; lo escribimos (al revés por ahora)
    inc rcx
    test rax, rax
    jnz extraer_digito
    ; invertimos la cadena (porque salió al revés)
    ret
```

- `idiv r8` extrae un dígito a la vez (el resto).
- `add rdx, '0'` lo convierte a carácter.
- Los dígitos salen **al revés** (unidades primero), así que hay que invertir la cadena al final.

La inversión usa el clásico intercambio de extremos, que ya sabes hacer con registros y la pila:

```text
invertir:
    ; rdi = inicio, rdx = longitud
    mov rsi, rdi
    lea rdx2, [rdi + rdx - 1]   ; puntero al último
intercambiar:
    mov al, [rsi]
    mov bl, [rdx2]
    mov [rsi], bl
    mov [rdx2], al
    inc rsi
    dec rdx2
    cmp rsi, rdx2
    jl intercambiar
    ret
```

- `mov al, [rsi]` y `mov bl, [rdx2]`: leemos ambos extremos.
- Intercambiamos y avanzamos hacia el centro.
- Cuando los punteros se cruzan, terminamos.

## 6. Juntando el proyecto

Con todas las funciones, el flujo final queda:

```text
_start:
    ; prompt y lectura (visto arriba)

    ; parsear: rdi = longitud, rsi = buffer
    call parsear          ; r9, r10, r11 listos

    ; calcular
    mov rdi, r9
    mov rsi, r10
    mov rdx, r11
    call calcular         ; rax = resultado

    ; convertir a texto y mostrar
    mov rdi, buffer
    call numero_a_texto   ; rdx = longitud
    call invertir

    mov rax, 1            ; write del resultado
    mov rdi, 1
    mov rsi, buffer
    syscall
```

Compila y ejecuta:

```bash
nasm -f elf64 calculadora.asm -o calculadora.o
ld calculadora.o -o calculadora
./calculadora
```

```text
Operación: 12 + 7
Resultado: 19
```

El proyecto completo integra: syscalls, conversión de texto, aritmética, saltos, funciones y el ciclo de ensamblar/enlazar. Si esto funciona, has dominado el núcleo del ensamblador x86-64.

:::tip
💡 Retos para ir más lejos: maneja números negativos, valida que todos los caracteres sean dígitos, soporta la división, o recibe la operación como argumento de línea de comandos en lugar de preguntarla.
:::

## Resumen rápido

- La calculadora integra **read, parse, calcular, imprimir y exit**.
- `texto_a_numero`: convierte caracteres restando `'0'` y acumulando ×10.
- `numero_a_texto`: extrae dígitos con `idiv` y **los invierte** al final.
- El cálculo se decide con `cmp` + saltos condicionales por operador.
- Todo el proyecto se ensambla con `nasm` y se enlaza con `ld`.

Tu calculadora funciona. Pero cuando algo no funcione —y pasará— necesitas las herramientas correctas: en el próximo capítulo veremos **la depuración con GDB y objdump**, el arte de encontrar el error con precisión.