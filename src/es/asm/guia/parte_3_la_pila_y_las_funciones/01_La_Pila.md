---
outline: [2, 3]
---

# La pila: `push` y `pop`

En la Parte I conociste la pila como una región de memoria que crece hacia abajo. Ahora es momento de usarla: la **pila** es el mecanismo que permite llamar funciones, guardar datos temporales y recordar dónde continuar. Este capítulo te enseña a manejarla con `push`, `pop` y el registro `RSP`.

## 1. ¿Qué es la pila?

La pila (*stack*) es una zona de memoria con una regla estricta: **el último que entra, es el primero que sale** (LIFO, *Last In, First Out*). Piensa en una pila de platos: siempre pones y sacas por arriba.

```text
        +------+  ←  tope de la pila (RSP apunta aquí)
        | dato |  ←  el último que entró
        +------+
        | dato |
        +------+
        | ...  |
        +------+  ←  memoria (más direcciones bajas)
```

- **`RSP`** (*Stack Pointer*) es el puntero al **tope** de la pila.
- La pila **crece hacia direcciones más bajas**: cada dato que apilas decrementa `RSP`.
- Las direcciones altas están "arriba" (el inicio de la pila), y va bajando.

Esta orientación "hacia abajo" es la razón de que la pila viva en la parte alta de la memoria y crezca hacia el centro.

## 2. `push` y `pop`: Las dos operaciones básicas

Las instrucciones que mueven datos a la pila son `push` y `pop`:

```text
push rax        ; copia rax a la pila, y decrementa rsp
pop  rax        ; recupera el valor y lo pone en rax
```

- `push rax`: guarda el valor de `RAX` en el nuevo tope y baja `RSP`.
- `pop rax`: lee el tope, lo copia a `RAX`, y sube `RSP`.
- La pila es una máquina de "memoria infinita y temporal": cada `push` debe tener su `pop`.

```text
mov rax, 100
push rax        ; la pila guarda 100
mov rax, 200    ; rax cambia de valor...
pop  rax        ; ...pero recuperamos el 100 original
```

- `push rax` salva el valor antes de que `RAX` sea reutilizado.
- `pop rax` restaura el valor original.
- Este par `push`/`pop` es el patrón más común para **no perder un registro** que se va a reutilizar.

:::info Nota
ℹ️ En x86-64, `push` siempre guarda **8 bytes** (un qword), aunque empujes un valor más pequeño. `RSP` se decrementa en 8 por cada `push` y se incrementa en 8 por cada `pop`.
:::

## 3. La pila en acción

Veamos el flujo de una secuencia completa con sus efectos en la memoria:

```text
mov rax, 1
push rax        ; rsp baja 8, guarda 1
mov rbx, 2
push rbx        ; rsp baja 8, guarda 2
pop  rcx        ; rcx = 2 (el último que entró)
pop  rdx        ; rdx = 1
```

```text
Estado de la pila:
push rax (1):   [ 1 ][ ... ]
push rbx (2):   [ 2 ][ 1 ][ ... ]
pop rcx:        rcx=2 → [ 1 ][ ... ]
pop rdx:        rdx=1 → [ ... ]
```

- Los valores salen **en orden inverso** al que entraron.
- `rcx` recibe el `2` (el último apilado), y `rdx` el `1`.
- Si no respetas el orden, intercambias valores sin darte cuenta. El LIFO no negocia.

:::warning Advertencia
⚠️ Todo `push` debe tener su `pop` correspondiente (o el equivalente con `RSP`). Si empujas más de lo que sacas, la pila "crece" sin control y puedes pisar memoria ajena; si sacas más de lo que empujaste, lees basura.
:::

## 4. Ajustar la pila directamente

A veces quieres reservar espacio en la pila sin llenarlo de inmediato (por ejemplo, para variables locales de una función). Se hace ajustando `RSP`:

```text
sub rsp, 32     ; reservamos 32 bytes en la pila
mov [rsp], rax  ; guardamos un valor en ese espacio
add rsp, 32     ; liberamos el espacio
```

- `sub rsp, 32`: "bajamos" el tope 32 bytes, reservando espacio.
- Ese espacio se puede usar como variables locales con `[rsp]`, `[rsp+8]`, etc.
- `add rsp, 32`: restauramos el tope, liberando el espacio.

Reservar con `sub rsp` en lugar de varios `push` es más eficiente cuando necesitas un bloque grande de una vez. Es exactamente lo que hacen las funciones al empezar, como verás en el próximo capítulo.

## 5. Guardar y restaurar con la pila

El uso más importante de la pila en la práctica es **preservar registros** alrededor de llamadas y funciones. La regla es simple:

```text
push rbx        ; respaldamos lo que no podemos perder
mov  rbx, [dato]
; ... usamos rbx ...
pop  rbx        ; restauramos su valor original
```

- `push rbx` antes de reutilizarlo.
- `pop rbx` al terminar, para que el valor original sobreviva.

Este patrón es tan importante que las convenciones de llamada lo institucionalizan: hay registros que una función **debe** restaurar antes de regresar, y otros que puede pisar libremente. Lo verás en detalle dos capítulos más adelante.

:::tip
💡 Si un valor te va a hacer falta más adelante y un registro lo va a sobrescribir, la pila es tu amiga: `push` antes, `pop` después. Es la forma estándar de no perder información sin gastar registros extra.
:::

## Resumen rápido

- La pila es **LIFO**: el último que entra, sale primero.
- `RSP` apunta al tope y la pila **crece hacia abajo** (direcciones más bajas).
- `push` guarda 8 bytes y baja `RSP`; `pop` recupera y sube `RSP`.
- `sub rsp, N` reserva espacio para variables locales; `add rsp, N` lo libera.
- El par `push`/`pop` es el método estándar para preservar registros.

La pila ya no tiene secretos. Ahora viene su uso más importante: en el próximo capítulo veremos **las llamadas a funciones** con `call` y `ret`, y cómo la pila hace posible que un programa se divida en piezas que se invocan y regresan.