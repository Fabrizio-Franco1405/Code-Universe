---
outline: [2, 3]
---

# Números flotantes y la FPU

Todos los números que manejaste hasta ahora fueron enteros. Pero la vida real está llena de decimales: promedios, distancias, coordenadas. Este capítulo te introduce a los **números de punto flotante** y a la unidad que los procesa: primero la **FPU** clásica y luego los registros **SSE** que hoy son el estándar.

## 1. ¿Cómo se guarda un decimal?

Un número con decimales no cabe en los registros de enteros de la forma natural. La solución estándar es el formato de **punto flotante IEEE 754**, que guarda el número como signo, exponente y mantisa — una "notación científica" binaria:

```text
double de 64 bits:  | signo | exponente (11) | mantisa (52) |
float de 32 bits:   | signo | exponente (8)  | mantisa (23) |
```

- **`float` (32 bits):** precisión simple, 4 bytes (`dd` en NASM).
- **`double` (64 bits):** precisión doble, 8 bytes (`dq` en NASM).
- La representación es binaria, por eso `0.1` no es exacto: se aproxima.

```text
section .data
    pi_float   dd 3.14159     ; float (32 bits)
    pi_double  dq 3.14159265358979  ; double (64 bits)
```

- `dd` y `dq` aceptan literales con decimales directamente.
- El estándar IEEE 754 define exactamente cómo se guardan, redondean y comparan estos números.

:::info Nota
ℹ️ Los decimales en binario no siempre se pueden representar exactamente (igual que `1/3` no se puede en decimal). Por eso `0.1 + 0.2` rara vez da `0.3` exacto. No es un bug de tu código: es la naturaleza del punto flotante.
:::

## 2. La FPU clásica: La pila x87

Históricamente, los decimales se manejaban con la **FPU x87**, que usa una **pila de registros** (`st0` a `st7`) en lugar de registros con nombre. Sus instrucciones básicas:

```text
fld  qword [numero]    ; carga el valor en el tope (st0)
fadd qword [otro]      ; st0 = st0 + otro
fstp qword [resultado] ; guarda st0 en memoria y lo saca de la pila
```

- `fld`: *load* — empuja el valor a la pila flotante.
- `fadd`: suma con el tope.
- `fstp`: *store and pop* — guarda y saca de la pila.

```text
section .data
    a        dq 2.5
    b        dq 1.5
section .bss
    suma     resq 1

section .text
    fld qword [a]
    fadd qword [b]
    fstp qword [suma]     ; suma = 4.0
```

- `fld` carga `a` en `st0`.
- `fadd` suma `b`: `st0 = 4.0`.
- `fstp` guarda y limpia la pila.

La pila x87 es válida pero incómoda. Hoy en día, la mayoría del trabajo con decimales se hace con **SSE**, que veremos a continuación.

:::warning Advertencia
⚠️ Si usas la FPU, **desapila todo lo que apilaste**. Dejar valores en `st0`-`st7` al final (o mezclar operaciones) produce resultados raros. La disciplina es: por cada `fld`, un `fstp` (o un `fstp st0` de limpieza).
:::

## 3. Los registros SSE: `xmm0`-`xmm15`

La generación moderna procesa decimales con **SSE**, que usa 16 registros de 128 bits llamados `xmm0` a `xmm15`. Dentro de cada uno caben dos `double` o cuatro `float`. Las instrucciones escalares (una operación por registro) son:

```text
movsd xmm0, [a]       ; copia un double a xmm0
addsd xmm0, [b]       ; xmm0 = xmm0 + b (double)
mulsd xmm0, [c]       ; xmm0 = xmm0 * c
```

- `movsd`: *move scalar double* — copia 8 bytes (un double).
- `addsd`/`subsd`/`mulsd`/`divsd`: las operaciones escalares sobre doubles.
- Para `float` (4 bytes) la variante es `movss`/`addss`/`mulss`.

```text
section .data
    a       dq 2.5
    b       dq 1.5
section .bss
    suma    resq 1

section .text
    movsd xmm0, [a]
    addsd xmm0, [b]
    movsd [suma], xmm0     ; suma = 4.0
```

- `movsd` carga y guarda doubles.
- `addsd` suma en el registro.
- El resultado se devuelve a memoria con otro `movsd`.

Los `xmm` son los registros que viste en el capítulo del ABI: ahí es donde C pasa los argumentos `double`/`float`, y donde debe ir el resultado de tus funciones.

## 4. Convertir entre enteros y flotantes

Muy a menudo necesitas mezclar ambos mundos. Las instrucciones de conversión convierten enteros a flotantes y viceversa:

```text
cvtsi2sd xmm0, rax    ; rax (entero) → xmm0 (double)
cvttsd2si rax, xmm0   ; xmm0 (double) → rax (entero, truncado)
```

- `cvtsi2sd`: *convert signed integer to scalar double*.
- `cvttsd2si`: *convert double to signed integer* (la `t` extra indica truncado, no redondeado).

```text
mov rax, 7
cvtsi2sd xmm0, rax    ; xmm0 = 7.0
addsd xmm0, [mitad]   ; xmm0 = 7.0 + 0.5 = 7.5
cvttsd2si rax, xmm0   ; rax = 7 (trunca el .5)
```

- El entero 7 se convierte a 7.0 para poder sumar decimales.
- Tras la operación, el resultado se trunca de vuelta a entero.

Existe la versión sin truncar (`cvtsd2si`) que **redondea** según el modo de redondeo actual. Elige conscientemente: `cvttsd2si` trunca, `cvtsd2si` redondea.

:::tip
💡 Piensa en `cvtsi2sd` y `cvttsd2si` como las "fronteras" entre el mundo entero y el flotante. Cada vez que una función C recibe un `double` o lo devuelve, estas instrucciones están de por medio.
:::

## 5. Comparar flotantes y decisiones

Comparar decimales también tiene sus reglas. La instrucción `ucomisd` compara dos doubles y modifica las banderas:

```text
ucomisd xmm0, [limite]
ja  mayor            ; xmm0 > limite (sin signo)
jb  menor            ; xmm0 < limite
je  igual            ; xmm0 == limite
```

- `ucomisd xmm0, [limite]`: compara y deja el resultado en las banderas.
- Los saltos `ja`/`jb`/`je` consultan las banderas como con enteros.
- La versión ordenada (`comisd`) además genera excepciones con valores inválidos (NaN).

```text
section .data
    promedio dq 10.5
    aprobado dq 6.0

section .text
    movsd xmm0, [promedio]
    ucomisd xmm0, [aprobado]
    jae es_aprobado      ; si promedio >= 6.0
    jmp no_aprobado
```

- `ucomisd` prepara las banderas.
- `jae es_aprobado`: salta si `10.5 >= 6.0`.

Comparar flotantes con `==` directo es peligroso (por la imprecisión). El patrón profesional es comparar contra un **margen** (epsilon), pero en ensamblador básico la comparación con `ucomisd` y saltos de rango (`ja`/`jb`) ya te cubre la mayoría de los casos reales.

## Resumen rápido

- Los decimales usan **IEEE 754**: `float` (4 bytes) y `double` (8 bytes).
- La **FPU x87** usa una pila (`st0`-`st7`) con `fld`, `fadd`, `fstp`.
- Los registros **SSE** (`xmm0`-`xmm15`) son el estándar moderno: `movsd`, `addsd`, `mulsd`.
- `cvtsi2sd` convierte entero a double; `cvttsd2si`, double a entero truncado.
- `ucomisd` compara doubles y deja las banderas para saltos.

Los flotantes escalares son solo la puerta de entrada. En el próximo capítulo veremos la verdadera superpotencia de los `xmm`: **SIMD con SSE y AVX**, procesando varios datos a la vez con una sola instrucción.