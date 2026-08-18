---
outline: [2, 3]
---

# Movimiento de datos: `mov`

La instrucción que verás más veces en tu vida como programador de ensamblador es **`mov`**. Su nombre engaña: no mueve datos de un lado a otro, los **copia**, dejando intacto el origen. Este capítulo te enseña todas sus variantes y las decisiones que hay detrás de cada copia.

## 1. El formato básico

`mov` recibe dos operandos: un destino (donde se guarda) y un origen (de dónde se copia):

```nasm
mov destino, origen
```

```nasm
section .data
    numero dq 42

section .text
    global _start

_start:
    mov rax, 10         ; copia el inmediato 10 a RAX
    mov rbx, rax        ; copia el valor de RAX a RBX
    mov rcx, [numero]   ; copia el contenido de "numero" a RCX
    mov [numero], rbx   ; copia el valor de RBX a la memoria "numero"
```

- `mov rax, 10`: inmediato → registro. El número `10` queda en `RAX`.
- `mov rbx, rax`: registro → registro. `RAX` no pierde su valor.
- `mov rcx, [numero]`: memoria → registro. Lee los 8 bytes de `numero`.
- `mov [numero], rbx`: registro → memoria. Guarda el valor de `RBX` en `numero`.

Después de esta secuencia: `RAX = 10`, `RBX = 10`, `RCX = 42`, y la memoria `numero` ahora guarda `10`. Nada se "movió" en el sentido estricto: todo se copió.

:::info Nota
ℹ️ El orden **destino, origen** es el de la sintaxis Intel (la que usa NASM). En la sintaxis AT&T de GAS el orden se invierte, algo que verás si alguna vez lees ensamblador generado por herramientas GNU.
:::

## 2. Reglas de compatibilidad

No todas las combinaciones están permitidas. Estas son las reglas de oro de `mov`:

- **Imposible memoria → memoria:** la CPU no copia directamente de una dirección a otra. Necesitas un registro intermedio.
- **No a un inmediato:** el destino nunca puede ser un número literal.
- **Tamaños deben coincidir:** mover un `dword` a un registro de 64 bits no siempre es directo (verás `movzx`/`movsx` en la siguiente sección).

```nasm
mov rax, [a]       ; correcto: memoria → registro
mov rbx, [b]
mov [c], rbx       ; correcto: registro → memoria
mov [a], [b]       ; ERROR: memoria → memoria no existe
```

- La CPU solo permite un operando de memoria por instrucción.
- Para copiar de una dirección a otra, pasa siempre por un registro.

:::warning Advertencia
⚠️ Cuando mezclas tamaños, la CPU interpreta el valor según el tamaño del destino. `mov [numero], eax` escribe solo 4 bytes aunque `numero` tenga espacio para 8. Elegir bien el tamaño de cada copia es tu responsabilidad.
:::

## 3. Extender valores: `movzx` y `movsx`

A veces tienes un valor pequeño y quieres llevarlo a un registro más grande. Ahí aparecen dos instrucciones:

```nasm
movzx rax, byte  [dato]    ; extiende con ceros (sin signo)
movsx rax, byte  [dato]    ; extiende con el signo (con signo)
```

- **`movzx`** (*move with zero extension*): rellena los bits altos con ceros. Sirve para valores sin signo.
- **`movsx`** (*move with sign extension*): rellena los bits altos con el bit de signo. Preserva el valor si es negativo.

```nasm
dato: db 200       ; 200 = 11001000 en binario

movzx rax, byte [dato]   ; RAX = 200  (se rellena con ceros)
movsx rax, byte [dato]   ; RAX = -56 (200 como byte con signo es -56)
```

- Con `movzx`, `200` queda como `200`: el relleno es con ceros.
- Con `movsx`, el bit más alto de `200` es `1`, así que lo trata como negativo (`-56`).

La regla es simple: si tu dato es sin signo, `movzx`; si es con signo, `movsx`. Elegir la equivocada produce números raros sin error aparente, uno de los bugs más difíciles de cazar.

## 4. `lea`: La calculadora de direcciones

La instrucción **`lea`** (*load effective address*) no lee memoria: calcula una **dirección** y la guarda en un registro. Es tan útil que hasta se usa para aritmética.

```nasm
lea rax, [numero]        ; RAX = dirección de "numero"
lea rbx, [rax + 8]       ; RBX = dirección de "numero" + 8
lea rcx, [rax + rbx*4]   ; RCX = rax + rbx*4 (¡multiplicación gratis!)
```

- `lea rax, [numero]`: es como `mov rax, numero`, pero más expresivo.
- `lea rbx, [rax + 8]`: suma 8 a la dirección, sin tocar memoria.
- `lea rcx, [rax + rbx*4]`: calcula `rax + rbx*4` en un solo paso, sin instrucciones de multiplicación.

`lea` no accede a la memoria que calcula: solo hace la cuenta. Eso la convierte en la forma favorita de sumar o multiplicar "barato" (por potencias de 2) mientras calculas direcciones, como verás en la Parte IV.

:::tip
💡 Usa `lea` cuando necesites una dirección (para pasarla a una función o recorrer una estructura) y también cuando quieras una suma o multiplicación por potencias de dos sin tocar las banderas, porque `lea` no modifica `RFLAGS`.
:::

## 5. Intercambiar valores con `xchg`

Para terminar, una instrucción que ahorra un registro: **`xchg`** intercambia el contenido de dos operandos:

```nasm
mov rax, 5
mov rbx, 10
xchg rax, rbx       ; ahora RAX = 10 y RBX = 5
```

- `xchg rax, rbx`: intercambia ambos valores en una sola instrucción.
- Sin `xchg`, tendrías que usar un tercer registro (o la pila) como temporal.

Es una instrucción interesante porque también se usa en concurrencia (intercambiar atómicamente), aunque por ahora nos basta con verla como un "swap" de valores.

## Resumen rápido

- `mov` **copia**, no mueve: el origen queda intacto.
- El orden es `mov destino, origen`; el destino no puede ser inmediato.
- **Memoria → memoria no existe**: siempre hay que pasar por un registro.
- `movzx` extiende con ceros (sin signo); `movsx` extiende con el signo.
- `lea` calcula direcciones (y sumas "gratis") sin tocar memoria ni banderas.
- `xchg` intercambia dos valores en una sola instrucción.

Ya sabes copiar datos por todas partes. El siguiente paso es hacer algo con ellos: en el próximo capítulo veremos **la aritmética y las operaciones lógicas** — sumar, restar, multiplicar, dividir y trabajar a nivel de bits.