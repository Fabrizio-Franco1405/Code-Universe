---
outline: [2, 3]
---

# Bits, bytes y hexadecimal

En el capítulo anterior viste cómo la CPU ejecuta instrucciones una tras otra. Pero, ¿en qué lenguaje habla la máquina cuando mueve datos? La respuesta son los **números binarios**: ceros y unos. En este capítulo vas a dominar el sistema de numeración de la computadora y, sobre todo, la forma cómoda de escribirlo: el **hexadecimal**.

## 1. Bits y bytes

Un **bit** (contracción de *binary digit*) es la unidad mínima de información: puede ser `0` o `1`. Agrupando bits podemos representar números, letras, colores, todo.

Un **byte** es un grupo de **8 bits**, y es la unidad que usa la memoria para direccionar. Un byte puede representar 256 valores distintos (de 0 a 255):

```text
00000000  =  0
00000001  =  1
00000010  =  2
01111111  =  127
11111111  =  255
```

- **Bit:** unidad mínima, `0` o `1`.
- **Byte:** 8 bits, 256 valores posibles.
- **Nibble:** 4 bits (media byte). Su importancia aparece en el hexadecimal.

Las potencias de dos que vemos todo el tiempo tienen su origen aquí: `2^8 = 256`, `2^10 = 1024` (un KiB), `2^20` (un MiB), `2^30` (un GiB).

:::info Nota
ℹ️ Un número de **64 bits** (el tamaño natural de tu procesador) puede representar desde 0 hasta 18,446,744,073,709,551,615 (~18 mil millones de millones). Por eso los registros x86-64 caben direcciones de memoria gigantes.
:::

## 2. Contando en binario

Igual que el decimal usa potencias de 10, el binario usa potencias de 2. Cada posición vale el doble que la anterior:

```text
Posición:  64   32   16    8    4    2    1
Binario:    1    0    1    1    0    1    0

1011010 (binario) = 64 + 16 + 8 + 2 = 90 (decimal)
```

Para convertir de decimal a binario, resta las potencias de dos más grandes que quepan:

```text
90 = 64 + 16 + 8 + 2
   = 1011010
```

Es un poco laborioso a mano, pero el ensamblador te hace razonar en estas bases constantemente, especialmente cuando trabajas con bits y máscaras en la Parte VII.

## 3. Hexadecimal: La abreviatura perfecta

El binario es ideal para la máquina, pero para los humanos es ilegible. Por eso nació el **hexadecimal**: base 16. Usa los dígitos `0-9` y las letras `A-F`:

```text
Decimal    Binario    Hexadecimal
  0         0000        0
  9         1001        9
 10         1010        A
 15         1111        F
 16        10000        10
 90       1011010       5A
```

La magia: **un dígito hexadecimal equivale a un nibble (4 bits)**. Entonces, un byte se escribe con exactamente dos dígitos hexadecimales:

```text
  1111  1011
    F     B     = 0xFB = 251
```

- `0xFB`: el prefijo `0x` indica hexadecimal.
- Cada dos dígitos hex = un byte. Por eso en ensamblador y en herramientas como `objdump` ves direcciones como `0x401000`.

:::tip
💡 En ensamblador NASM, los números hexadecimales se escriben con el sufijo `h` (por ejemplo, `0ah` para el salto de línea) y en C con el prefijo `0x`. Acostúmbrate a leerlos: son el lenguaje común de las direcciones y los opcodes.
:::

## 4. Números negativos: Complemento a dos

Los bytes no solo guardan números positivos. La máquina representa negativos con **complemento a dos**, un truco elegante:

- El bit más significativo indica el signo: `0` para positivo, `1` para negativo.
- Para negar un número: invierte todos los bits y suma 1.

```text
 5   = 00000101
~5   = 11111010
+1   = 11111011   →  esto es -5

-5 + 5 = 11111011 + 00000101 = 00000000 = 0
```

La belleza del complemento a dos es que **la suma funciona igual** sin importar el signo: `-5 + 5` da `0` sin ninguna lógica especial. Por eso el hardware de suma es el mismo para positivos y negativos.

- Con `n` bits, el rango con signo va de `-2^(n-1)` a `2^(n-1) - 1`.
- Un byte con signo va de `-128` a `127`.
- El **desbordamiento (overflow)** ocurre cuando el resultado no cabe en el tamaño disponible; en la Parte II verás cómo la CPU lo detecta y cómo reaccionar.

:::warning Advertencia
⚠️ Un mismo patrón de bits puede significar dos cosas distintas según el contexto. `11111111` es `255` si lo tratas como sin signo, pero `-1` si es con signo. El ensamblador no decide por ti: tú eres quien define cómo interpretar los bytes.
:::

## 5. Tamaños de datos comunes

Para terminar, memoriza los tamaños que usarás en todo el curso. Son la talla de los "paquetes" que la máquina mueve:

| Nombre   | Bits | Bytes | Ejemplo NASM |
|----------|------|-------|--------------|
| `byte`   | 8    | 1     | `db`         |
| `word`   | 16   | 2     | `dw`         |
| `dword`  | 32   | 4     | `dd`         |
| `qword`  | 64   | 8     | `dq`         |

- `db` (define byte): 1 byte, como `mensaje db "Hola", 0`.
- `dw` (define word): 2 bytes.
- `dd` (define dword): 4 bytes.
- `dq` (define qword): 8 bytes, el tamaño natural de x86-64.

Estos nombres aparecerán en cada programa que escribas de aquí en adelante. Elegir el tamaño correcto es una de las decisiones que el ensamblador te obliga a tomar, y uno de los errores más comunes cuando recién se empieza.

## Resumen rápido

- Un **bit** es `0` o `1`; un **byte** son 8 bits (256 valores).
- El **hexadecimal** resume un byte en dos dígitos; el prefijo es `0x` (en NASM, sufijo `h`).
- Los negativos usan **complemento a dos**: invertir bits y sumar 1.
- `db`, `dw`, `dd`, `dq` definen datos de 1, 2, 4 y 8 bytes respectivamente.
- El mismo patrón de bits puede ser positivo o negativo según lo interpretes; la CPU te sigue la palabra.

Con el lenguaje de los números claro, pasemos al espacio donde viven tus datos: en el próximo capítulo estudiaremos **la memoria** — direcciones, bytes y endianness — y entenderás cómo el procesador encuentra cada dato que pides.