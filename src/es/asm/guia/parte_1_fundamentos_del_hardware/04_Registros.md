---
outline: [2, 3]
---

# Los registros del procesador

Ya sabes cómo funciona la CPU y cómo se organiza la memoria. Ahora llega el momento de conocer a los protagonistas de cada instrucción que escribirás: los **registros**. Son las cajitas de alta velocidad dentro del procesador, y en x86-64 tienen nombres con una historia curiosa que es clave para entenderlos.

## 1. ¿Qué es un registro?

Un **registro** es una posición de almacenamiento dentro de la propia CPU, de acceso casi instantáneo. En la jerarquía de memoria, viven en la cima: son lo más rápido que existe. Pero son pocos y pequeños, así que hay que administrarlos con cuidado.

En x86-64, cada registro tiene **64 bits** de ancho, y además podemos usar **porciones** de él:

```text
          +--------------------------------------------------+
  RAX     |                 64 bits                          |
          +--------------------------+-----------------------+
  EAX     |          32 bits         |                       |
          +--------------+-----------+
  AX      |   16 bits    |
          +-------+------+
  AH      |   AL  |      |        ← AH y AL dividen a AX
          +-------+------+
```

- `RAX`: el registro completo, 64 bits.
- `EAX`: los 32 bits bajos (los 32 altos se ignoran al escribir).
- `AX`: los 16 bits bajos.
- `AH` y `AL`: la parte alta y baja del `AX`.

:::info Nota
ℹ️ El prefijo `R` significa "registro extendido" (64 bits) y `E` significa "extendido" (32 bits), de la era de los procesadores de 16 bits. Escribir a `EAX` pone a cero los 32 bits altos de `RAX`; escribir a `AX` no toca el resto.
:::

## 2. Los registros de propósito general

Los llamados **registros de propósito general** son la "mesa de trabajo" de tu programa. Su nombre original (A, B, C, D) refleja sus primeros usos, que hoy son solo convenciones:

| Registro | Nombre original | Uso común |
|----------|-----------------|-----------|
| `RAX` | Acumulador | Resultados de operaciones y de funciones |
| `RBX` | Base | Dato general (callee-saved) |
| `RCX` | Contador | Bucles y conteos |
| `RDX` | Datos | Parte alta de multiplicaciones/divisiones |
| `RSI` | Índice fuente | Origen en operaciones de cadenas y argumento 2 |
| `RDI` | Índice destino | Destino en cadenas y argumento 1 |
| `RSP` | Puntero de pila | Tope de la pila |
| `RBP` | Puntero base | Base del marco de la pila actual |
| `R8`–`R15` | — | Registros añadidos en x86-64 |

- **`RSP` y `RBP`** no son "propósito general": tienen funciones especiales en la pila, que verás en la Parte III.
- En las llamadas a funciones (Parte III), algunos registros tienen **roles fijos**: `RDI`, `RSI`, `RDX`, `RCX`, `R8`, `R9` reciben argumentos; `RAX` devuelve el resultado.

:::tip
💡 No memorices la tabla entera todavía. Con el tiempo, el uso de cada registro se te hará natural. Por ahora, recuerda que `RAX` es "el que devuelve" y que `RSP`/`RBP` cuidan la pila.
:::

## 3. El puntero de instrucción: RIP

Además de los registros de datos existe el **`RIP`** (*Instruction Pointer*), que apunta a la instrucción que la CPU va a ejecutar a continuación. Es el corazón del ciclo fetch-decode-execute que viste en el capítulo de la arquitectura.

```text
RIP → 0x401000  mov rax, 1
      0x401005  mov rdi, 1
      0x40100a  syscall
```

- No puedes escribir a `RIP` directamente con `mov`.
- Los **saltos** (`jmp`, `call`) y las **llamadas al sistema** modifican su valor.
- En x86-64, los accesos a datos suelen ser **relativos a RIP** (calculados en base a dónde está ejecutando), algo que verás en los modos de direccionamiento de la Parte IV.

## 4. El registro de banderas: RFLAGS

El registro **`RFLAGS`** (o `EFLAGS` en 32 bits) no guarda datos: guarda **banderas**, valores de un bit que informan el resultado de la última operación:

| Bandera | Significado |
|---------|-------------|
| `ZF` | Zero: el resultado fue cero |
| `SF` | Sign: el resultado fue negativo |
| `CF` | Carry: hubo acarreo (sin signo) |
| `OF` | Overflow: el resultado no cabe (con signo) |
| `PF` | Parity: el resultado tiene cantidad par de unos |

Estas banderas son las que permiten tomar decisiones: instrucciones como `cmp` o `sub` las modifican, y los **saltos condicionales** (que verás en la Parte II) las consultan para decidir si saltar o no.

```nasm
mov rax, 5
sub rax, 5      ; rax = 0 → se activa ZF
; más adelante, jz (salta si Zero) puede usar esa bandera
```

- `sub rax, 5`: resta y deja el resultado en `RAX`, activando las banderas.
- `ZF = 1`: porque `5 - 5 = 0`.
- Las banderas son "efímeras": cada operación aritmética las sobrescribe, así que hay que usarlas pronto después de la operación.

:::warning Advertencia
⚠️ Las banderas no "solo se activan" con `cmp`: también las modifican `add`, `sub`, `inc`, `dec` y muchas más. Si intercalas otra operación aritmética entre la comparación y el salto, el salto usará banderas incorrectas. Es uno de los errores clásicos del principiante.
:::

## 5. La disciplina de los registros

Como hay tan pocos registros, usarlos bien es un arte. Dos reglas te ahorrarán dolores de cabeza desde ahora:

1. **Un registro, un propósito a la vez.** Decide qué guardará y no lo cambies a la ligera; si necesitas su valor después, no lo pises.
2. **Guarda lo que necesites.** Si una operación te obliga a sobrescribir un registro cuyo valor aún necesitas, copia el valor a otro registro o a la pila antes.

```nasm
mov rax, 10
mov rbx, rax    ; respaldamos 10 en RBX antes de perder RAX
mov rax, 20     ; RAX ahora vale 20
mov rax, rbx    ; RAX vuelve a valer 10
```

- `mov rbx, rax`: respalda el valor antes de sobrescribir.
- Este patrón de "respaldar y restaurar" es cotidiano en ensamblador y aparece en casi todas las funciones.

## Resumen rápido

- Los registros son las **cajitas internas** de 64 bits; puedes usar subpartes como `EAX`, `AX`, `AL`.
- `RAX`, `RBX`, `RCX`, `RDX`, `RSI`, `RDI`, `R8`–`R15` son de propósito general.
- `RSP` y `RBP` administran la **pila**; `RIP` apunta a la siguiente instrucción.
- `RFLAGS` guarda **banderas** (`ZF`, `SF`, `CF`, `OF`) que permiten tomar decisiones.
- Gestiona bien los pocos registros que tienes: respalda valores antes de sobrescribirlos.

Ya conoces a los protagonistas de todas las instrucciones. En la **Parte II** empezaremos a escribir: primero la sintaxis y las directivas del ensamblador, y luego el movimiento de datos con `mov`.