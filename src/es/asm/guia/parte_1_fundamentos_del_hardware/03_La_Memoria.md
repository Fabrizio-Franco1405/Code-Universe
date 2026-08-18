---
outline: [2, 3]
---

# La memoria: RAM, direcciones y endianness

Ya sabes hablar en bits, bytes y hexadecimal. Ahora vamos al lugar donde viven todos esos bytes: la **memoria RAM**. En este capítulo entenderás cómo se organiza, cómo la CPU encuentra un dato cualquiera y por qué el orden de los bytes dentro de un número no siempre es el que imaginas.

## 1. La memoria como casilleros numerados

Imagina la RAM como una fila interminable de **casilleros**, cada uno capaz de guardar exactamente un byte. Cada casillero tiene un número único: su **dirección**. Cuando la CPU quiere leer o escribir un dato, dice "dame el byte de la dirección 0x401000" y el bus la trae.

```text
Dirección      Contenido
0x401000        b8
0x401001        01
0x401002        00
0x401003        00
0x401004        00
```

- **Dirección:** el número que identifica un byte de memoria.
- **Byte direccionable:** la RAM se maneja de a un byte por vez; incluso un número de 8 bytes ocupa 8 direcciones consecutivas.
- En x86-64, las direcciones tienen **64 bits**, así que la CPU puede direccionar una cantidad enorme de memoria (aunque el sistema operativo y el hardware limiten lo real).

En ensamblador, cada vez que usas el nombre de una etiqueta (`mensaje`, `suma`) en realidad estás refiriéndote a una **dirección** que el enlazador calculó por ti. La memoria es el mapa sobre el que trabajas todo el tiempo.

## 2. Endianness: El orden de los bytes

Aquí viene una de las sorpresas del mundo real. Cuando guardas un número que ocupa varios bytes, ¿en qué orden van sus bytes en memoria? Hay dos respuestas posibles, y x86 usa una de ellas:

- **Little-endian (x86):** el byte **menos significativo** va primero, en la dirección más baja.
- **Big-endian:** el byte más significativo va primero (como escribimos los números en papel).

Veamos cómo se guarda el número `0x12345678` (4 bytes) en la RAM:

```text
Dirección      0x00    0x01    0x02    0x03
Little-endian  78      56      34      12
Big-endian     12      34      56      78
```

- En **little-endian**, el "78" (el byte de menor valor) queda en la primera dirección.
- Esto puede parecer raro, pero tiene una ventaja: puedes leer un número de 4 bytes como si fuera de 2 o 1 bytes usando la misma dirección de inicio, sin mover nada.

:::info Nota
ℹ️ El término "little-endian" viene de la novela *Los viajes de Gulliver*, donde se discutía si había que abrir los huevos por la parte pequeña (*little end*) o por la grande (*big end*). Los x86 eligen el extremo pequeño.
:::

## 3. ¿Por qué te importa el endianness?

Como programador de ensamblador, el endianness deja de ser teoría y se vuelve práctica:

- Cuando defines datos con `dd` o `dq`, el ensamblador coloca los bytes en orden little-endian automáticamente.
- Cuando lees un archivo binario byte a byte (Parte V), verás números "al revés" si intentas interpretarlos como enteros.
- Cuando mezclas ensamblador con C (Parte VI), ambos usan la misma convención en la misma máquina, así que no hay fricción.
- En redes y protocolos (que suelen ser big-endian), tendrás que reordenar bytes explícitamente.

Un ejemplo para fijar la idea: si defines `valor dd 0x12345678` y luego miras los 4 bytes en memoria con `x/4bx` en GDB (lo veremos en la Parte VIII), verás `78 56 34 12`. No es un error: es little-endian.

## 4. Registros, caché y RAM: La jerarquía

En el capítulo anterior mencionamos la jerarquía de memoria. Ahora que sabes qué es la RAM, la frase "acceder a memoria es lento" cobra sentido: cada acceso a la RAM tarda cientos de ciclos de reloj, mientras que un registro es instantáneo.

```text
Velocidad:  Registros > Caché L1 > L2 > L3 > RAM > Disco
Tamaño:     Registros < Caché L1 < L2 < L3 < RAM < Disco
```

- **Registros:** unas decenas de bytes, acceso inmediato.
- **Caché:** megabytes, acceso en pocos ciclos.
- **RAM:** gigabytes, acceso en cientos de ciclos.
- **Disco:** terabytes, acceso en milisegundos (millones de ciclos).

Por eso un programador de ensamblador eficiente intenta mantener los datos que más se usan en registros, y cuando tiene que ir a memoria, lo hace de forma predecible y agrupada para aprovechar la caché. Esa disciplina se llama *cache friendliness* y la retomaremos en la Parte VII.

:::tip
💡 En ensamblador, la regla mental es: primero registros, luego caché, y solo si no hay remedio, RAM. Cada vez que "bajas" un nivel en la jerarquía, pagas tiempo de más.
:::

## 5. La pila y el heap

Antes de cerrar, conozcamos las dos regiones de memoria donde vivirán tus datos mientras corre el programa:

- **Pila (stack):** región que crece "hacia abajo", organizada como una pila de platos. Guarda los datos de las funciones activas y es **rápida**, porque el acceso es muy predecible. La estudiaremos a fondo en la Parte III.
- **Montículo (heap):** memoria dinámica que el programa pide y libera en cualquier orden. Es flexible pero más lenta y requiere gestión (en ensamblador, sueles pedirla al sistema operativo o a la biblioteca de C).

```text
Direcciones altas
+----------------+  ←  parte alta de la memoria
|      Pila      |  crece hacia abajo
|       |        |
|       v        |
+----------------+
|   (espacio)    |
+----------------+
|       ^        |
|      Montículo |  crece hacia arriba
|      Heap      |
+----------------+
|   Datos y código |
+----------------+  ←  parte baja de la memoria
```

Esta disposición explica por qué en los programas de ejemplo tu código vive en direcciones bajas (como `0x401000`) y la pila en direcciones altas. Es la arquitectura del ejecutable que el enlazador produce.

:::warning Advertencia
⚠️ La pila y el montículo crecen uno hacia el otro. Si un programa abusa de alguno de los dos, pueden colisionar y causar fallos de segmentación. Verás ejemplos concretos y cómo evitarlos en los capítulos de seguridad (Parte VII).
:::

## Resumen rápido

- La RAM es una fila de **casilleros de 1 byte**, cada uno con su **dirección**.
- x86 usa **little-endian**: el byte menos significativo va primero en memoria.
- La jerarquía **registros → caché → RAM → disco** explica por qué el acceso a memoria es caro.
- La **pila** crece hacia abajo y es rápida; el **montículo** crece hacia arriba y es flexible pero lento.
- El ejecutable que enlazas coloca el código en direcciones bajas y la pila en las altas.

Ya tienes el mapa completo de la memoria. Ahora conozcamos las cajitas de alta velocidad donde la CPU hace su trabajo: en el próximo capítulo estudiaremos **los registros del procesador**, los protagonistas de cada instrucción que escribirás.