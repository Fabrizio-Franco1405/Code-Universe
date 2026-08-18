---
outline: [2, 3]
---

# Arreglos

Los punteros ya te mostraron cómo recorrer datos. Ahora formalicemos el concepto más usado de todos: los **arreglos** (arrays). En ensamblador un arreglo es, literalmente, una fila de valores en memoria contigua, y acceder a sus elementos es una cuestión de aritmética de direcciones.

## 1. ¿Qué es un arreglo en memoria?

Un **arreglo** es una secuencia de elementos del mismo tamaño, guardados **uno tras otro** en la memoria. Para definir uno en NASM basta con listar sus valores:

```text
section .data
    numeros dq 10, 20, 30, 40, 50
    pesos   dw 70, 80, 90
    letras  db "hola", "mundo"
```

- `numeros dq 10, 20, 30, 40, 50`: 5 qwords consecutivos, 40 bytes en total.
- `pesos dw 70, 80, 90`: 3 words consecutivas.
- `letras db "hola", "mundo"`: bytes consecutivos (aquí cada "elemento" es un carácter).

En memoria, el arreglo se ve como una cinta de bytes:

```text
numeros:  | 10 | 20 | 30 | 40 | 50 |
          ^base        ^base + 8*2 = base + 16
```

- La etiqueta `numeros` es la dirección del **primer elemento** (la base).
- El elemento en la posición `i` vive en `base + i * tamaño`.
- No hay metadatos: el ensamblador no sabe cuántos elementos hay. Eso lo decides tú.

:::info Nota
ℹ️ En ensamblador no existe el "tamaño del arreglo" como en otros lenguajes. Tú eres quien debe saber (o pasar como parámetro) cuántos elementos hay. Esa responsabilidad extra es parte de lo que significa programar cerca del metal.
:::

## 2. Acceder a un elemento por índice

La fórmula para acceder al elemento `i` es `base + i * tamaño`. Usando el modo base + índice del capítulo de direccionamiento:

```text
section .data
    numeros dq 10, 20, 30, 40, 50

section .text
    mov rsi, numeros       ; base
    mov rcx, 2             ; índice
    mov rax, [rsi + rcx*8] ; numeros[2] → 30
```

- `[rsi + rcx*8]`: con `rcx = 2`, accede a `base + 16`, el tercer elemento.
- La escala `*8` corresponde al tamaño del `qword`.
- Cambiar `rcx` cambia el elemento: esa es la esencia del acceso por índice.

Si los elementos fueran `dd` (4 bytes), la escala sería `*4`; con `dw`, `*2`; con `db`, `*1` (que se puede omitir). La escala siempre es el tamaño del elemento.

## 3. Recorrer un arreglo con un bucle

La combinación clásica: un bucle que recorre todos los elementos. Tenemos dos estrategias igual de válidas:

**Con puntero que avanza:**

```text
section .data
    numeros dq 10, 20, 30, 40, 50
section .bss
    suma    resq 1

section .text
    global _start

_start:
    mov rsi, numeros     ; puntero al inicio
    mov rcx, 5           ; cantidad de elementos
    mov rax, 0           ; acumulador
recorrer:
    add rax, [rsi]       ; sumamos el elemento actual
    add rsi, 8           ; avanzamos al siguiente
    loop recorrer
    mov [suma], rax      ; suma = 150
```

**Con índice que avanza:**

```text
_start:
    mov rsi, numeros     ; base
    mov rcx, 0           ; índice
    mov rax, 0           ; acumulador
recorrer:
    add rax, [rsi + rcx*8]   ; sumamos numeros[rcx]
    inc rcx
    cmp rcx, 5
    jl recorrer
    mov [suma], rax
```

- La **versión con puntero** es la más usada y la más rápida: solo suma 8 en cada vuelta.
- La **versión con índice** es más legible para los que vienen de otros lenguajes (`numeros[i]`).
- Ambas suman los elementos: `10+20+30+40+50 = 150`.

:::tip
💡 Empieza con la versión con índice si te sientes más cómodo; cuando te familiarices, migra a la de puntero, que es la que generan los compiladores y la que exige menos operaciones por vuelta.
:::

## 4. Arreglos de tipos distintos

Los arreglos no son solo de qwords. La regla es siempre la misma: **`base + índice * tamaño`**. Veamos dos casos:

**Arreglo de bytes (caracteres):**

```text
section .data
    vocales db "aeiou"

section .text
    mov rsi, vocales
    mov rax, [rsi + 2]      ; el tercer byte → 'i'
```

- Cada elemento es un byte, así que la escala es `*1`.
- `[rsi + 2]` accede al tercer carácter.

**Arreglo de words:**

```text
section .data
    puntos dw 10, 20, 30

section .text
    mov rsi, puntos
    mov rax, [rsi + 1*2]    ; puntos[1] → 20
```

- Escala `*2` para words.
- `[rsi + 2]` accede al segundo elemento (que vive en los bytes 2 y 3).

El único riesgo es mezclar la escala con el tamaño real. Un `dq` con escala `*4` te da el doble de lo esperado o lees la mitad de cada elemento.

:::warning Advertencia
⚠️ Salirse del arreglo es un error de acceso a memoria: lees bytes que pertenecen a otra variable o a otra sección. El ensamblador no valida límites. Si tu bucle itera de más, el último `add` leerá basura o, peor, provocará un fallo de segmentación.
:::

## 5. Arreglos de estructuras

Cuando cada elemento es una estructura de varios campos, el cálculo se complica un poco pero sigue la misma fórmula. Recordando el capítulo de direccionamiento:

```text
; Cada persona: [nombre: 32 bytes][edad: 8 bytes]
section .bss
    personas resb 40*5      ; 5 personas de 40 bytes

section .text
    mov rsi, personas       ; base
    mov rcx, 2              ; índice
    ; edad de la persona 2 está en base + 2*40 + 32
    mov rax, [rsi + rcx*40 + 32]
```

- El tamaño del elemento es 40 bytes (32 + 8).
- La escala no puede ser 40 (solo 1, 2, 4, 8), así que usamos `rcx*40` de otra forma...

Espera: la escala máxima es 8. ¿Cómo indexar estructuras de 40 bytes? La solución es la **aritmética en dos pasos**:

```text
    mov rax, rcx
    imul rax, rax, 40       ; rax = índice * 40
    mov rax, [rsi + rax + 32] ; edad de la persona rcx
```

- `imul rax, rax, 40`: calculamos el desplazamiento con multiplicación.
- Sumamos el desplazamiento a la base y al campo.
- La fórmula general se mantiene: `base + índice*tamaño + desplazamiento_del_campo`.

Cuando el tamaño del elemento no es potencia de dos, la escala te obliga a multiplicar aparte. Es un caso común con estructuras reales.

## Resumen rápido

- Un **arreglo** es memoria contigua: el elemento `i` vive en `base + i * tamaño`.
- Con `dq`/`dd`/`dw`/`db` defines arreglos de 8/4/2/1 byte por elemento.
- El modo `[base + índice*escala]` accede por índice; avanzar el puntero es la alternativa rápida.
- No existen límites automáticos: controlar el tamaño del arreglo es tu responsabilidad.
- Para estructuras de tamaño no-potencia-de-2, multiplica el índice aparte.

Los arreglos de bytes nos llevan al tema más práctico de todos: en el próximo capítulo veremos **las cadenas de caracteres** — cómo se guardan, cómo se miden y cómo se imprimen.