---
outline: [2, 3]
---

# SIMD: SSE y AVX

En el capítulo anterior usaste los registros `xmm` para un dato a la vez. Pero esos registros guardan **varios** datos: un `xmm` de 128 bits contiene 2 doubles o 4 floats. La magia de **SIMD** (*Single Instruction, Multiple Data*) es operar sobre todos a la vez. Este capítulo te enseña a duplicar, cuadruplicar y hasta octuplicar la velocidad de tus cálculos.

## 1. La idea de SIMD

SIMD significa: **una instrucción, muchos datos**. En lugar de sumar elemento por elemento en un bucle, cargas varios valores en un registro y los sumas con una sola instrucción:

```text
Suma escalar:            Suma SIMD (4 floats a la vez):
xmm0: | 1 | 2 | 3 | 4 |    xmm0: | 1 | 2 | 3 | 4 |
+     | 1 | 1 | 1 | 1 |    +     | 5 | 6 | 7 | 8 |   (addps)
=     | 2 | 3 | 4 | 5 |    =     | 6 | 8 | 10| 12 |
```

- Un `xmm` de 128 bits guarda **2 doubles**, **4 floats** o **16 bytes**.
- Un `ymm` de 256 bits (AVX) guarda **4 doubles**, **8 floats** o **32 bytes**.
- La instrucción `addps` suma los 4 floats en paralelo en un solo paso.

El rendimiento no escala exactamente 4x (hay costos de carga y de "empaquetar"), pero es la forma más potente de acelerar código numérico y de procesar imagen/video/audio.

:::info Nota
ℹ️ Las instrucciones SIMD llevan sufijos que indican el modo: `ps` (packed single = varios floats), `pd` (packed double = varios doubles), `ss` (scalar single = un float) y `sd` (scalar double = un double). El prefijo `p` = *packed* = en paralelo.
:::

## 2. Empaquetar y desempaquetar datos

Para usar SIMD, primero cargas varios datos en el registro con `movups`/`movaps` (memoria → registro):

```text
section .data
    vector_a dd 1.0, 2.0, 3.0, 4.0
    vector_b dd 5.0, 6.0, 7.0, 8.0

section .text
    movups xmm0, [vector_a]   ; carga los 4 floats de A
    movups xmm1, [vector_b]   ; carga los 4 floats de B
    addps  xmm0, xmm1         ; suma los 4 en paralelo
```

- `movups`: *move unaligned packed single* — carga 16 bytes sin requerir alineación.
- `movaps`: la versión **alineada** (exige direcciones múltiplo de 16, es más rápida).
- `addps xmm0, xmm1`: `xmm0 = xmm0 + xmm1` en los 4 carriles.

Después de la operación, guardas el resultado de vuelta a memoria con otro `movups`:

```text
section .bss
    resultado resq 4     ; espacio para 4 floats (16 bytes)

section .text
    movups [resultado], xmm0   ; guarda los 4 resultados
```

El patrón completo SIMD es: **cargar → operar → guardar**. El ahorro está en la fase intermedia, donde una instrucción reemplaza a cuatro (o más) del bucle escalar.

:::warning Advertencia
⚠️ `movaps` (alineado) **crashea si la dirección no es múltiplo de 16**. Cuando no tengas control sobre la alineación de tus datos (buffers, estructuras), usa `movups` (sin alinear). La ventaja de velocidad de `movaps` solo aparece con datos que sabes alineados.
:::

## 3. Operaciones SIMD con flotantes

Las operaciones básicas tienen sus versiones packed (`ps`/`pd`):

```text
addps xmm0, xmm1     ; suma los 4 floats
subps xmm0, xmm1     ; resta
mulps xmm0, xmm1     ; multiplica
divps xmm0, xmm1     ; divide
sqrtps xmm0, xmm1    ; raíz cuadrada de cada carril
```

```text
section .data
    valores dd 4.0, 9.0, 16.0, 25.0
section .bss
    raices  resq 4

section .text
    movups xmm0, [valores]
    sqrtps xmm0, xmm0      ; |2.0| 3.0| 4.0| 5.0|
    movups [raices], xmm0
```

- `sqrtps` calcula la raíz cuadrada de los 4 floats a la vez.
- En una sola instrucción obtienes `√4, √9, √16, √25`.

Esto es lo que acelera los videojuegos, los códecs y las simulaciones: operaciones numéricas masivas resueltas en paralelo por el hardware.

## 4. AVX: Los registros ymm de 256 bits

**AVX** (Advanced Vector Extensions) duplica el ancho: los registros **`ymm0`-`ymm15`** de 256 bits. La forma de operar es la misma, pero con la cantidad duplicada:

```text
vmovups ymm0, [vector_a]   ; carga 8 floats (32 bytes)
vmovups ymm1, [vector_b]
vaddps  ymm0, ymm0, ymm1   ; suma los 8 floats en paralelo
```

- `vmovups`/`vaddps`: las versiones AVX llevan el prefijo `v`.
- `vaddps ymm0, ymm0, ymm1`: nota el **tercer operando**: `destino = origen1 + origen2`.
- AVX introduce la forma de 3 operandos, que no destruye los operandos de origen.

La ventaja de 3 operandos es doble: más claridad y menos copias de datos (los compiladores la aprovechan para evitar movimientos innecesarios).

```text
section .data
    datos_a dd 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0
    datos_b dd 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0
section .bss
    salida  resb 32

section .text
    vmovups ymm0, [datos_a]
    vmovups ymm1, [datos_b]
    vaddps  ymm2, ymm0, ymm1    ; ymm2 = ymm0 + ymm1 (8 floats)
    vmovups [salida], ymm2
```

- Se cargan 8 floats de cada vector.
- `vaddps` los suma todos en una sola instrucción.
- El resultado se guarda en 32 bytes.

## 5. SIMD con enteros

SIMD no es solo para flotantes: también acelera enteros. Las versiones `p` de las instrucciones operan sobre bytes/words/dwords:

```text
paddd xmm0, xmm1     ; suma 4 dwords (enteros de 32 bits)
paddq xmm0, xmm1     ; suma 2 qwords (enteros de 64 bits)
pcmpeqd xmm0, xmm1   ; compara por igualdad, carril por carril
```

```text
section .data
    nums_a dd 1, 2, 3, 4
    nums_b dd 10, 20, 30, 40
section .bss
    suma_int resq 4

section .text
    movdqu xmm0, [nums_a]
    movdqu xmm1, [nums_b]
    paddd  xmm0, xmm1     ; |11|22|33|44|
    movdqu [suma_int], xmm0
```

- `movdqu`: la versión sin alinear para enteros.
- `paddd`: suma 4 enteros de 32 bits en paralelo.
- El resultado `|11|22|33|44|` queda empaquetado en el registro.

Para trabajar con un carril individual (extraer el segundo elemento, por ejemplo), existen `pextrd`, `pinsrd`, `pshufd`... que verás cuando necesites manipular los "carriles" de un registro SIMD.

:::tip
💡 Para sacar el máximo provecho: mantén los datos **contiguos y alineados** (tu caché los entrega más rápido), carga varias veces a la vez y evita extraer carriles individuales dentro del bucle crítico.
:::

## Resumen rápido

- **SIMD**: una instrucción opera sobre varios datos (`xmm` = 2 doubles / 4 floats).
- **AVX** (`ymm` de 256 bits) duplica: 4 doubles / 8 floats, con operación de 3 operandos.
- `movups` (sin alinear) y `movaps` (alineada, más rápida) cargan y guardan.
- `ps`/`pd` para packed de floats/doubles; `p` para enteros (`paddd`, `paddq`).
- El patrón SIMD es **cargar → operar → guardar**.

Con SIMD ya procesas datos a velocidad de hardware. Pero la velocidad tiene matices más sutiles: en el próximo capítulo veremos **la optimización de rendimiento**, desde el bucle hasta la caché, y cómo medir antes de optimizar.