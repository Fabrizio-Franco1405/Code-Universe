---
outline: [2, 3]
---

# Convenciones de llamada (ABI)

Ya sabes crear funciones con `call` y `ret`. Pero en un programa con muchas funciones surge una pregunta inmediata: **¿cómo se pasan los datos entre ellas?** ¿Quién entrega los argumentos, quién devuelve el resultado y quién es responsable de no romper los registros del otro? La respuesta es la **convención de llamada**, un acuerdo universal que en Linux recibe el nombre de *SysV AMD64 ABI*.

## 1. ¿Qué es una convención de llamada?

Una **convención de llamada** (o **ABI**, *Application Binary Interface*) es un conjunto de reglas que dicen, al nivel de los bytes:

- En qué registros van los **argumentos**.
- Dónde se devuelve el **resultado**.
- Qué registros puede pisar la función llamada y cuáles **debe preservar**.
- Cómo se alinea la pila en las llamadas.

Sin este acuerdo, una función escrita por ti no podría llamar a una escrita por el compilador de C, ni viceversa. Es el "lenguaje común" de las funciones.

:::info Nota
ℹ️ En Linux y macOS, el estándar es el **SysV AMD64**. En Windows las reglas son diferentes (los argumentos van en `RCX`, `RDX`, `R8`, `R9`). Ese detalle es clave cuando veas Windows en la Parte V.
:::

## 2. Los registros de argumentos

La convención SysV define los primeros seis argumentos de enteros en estos registros, en orden:

| Argumento | Registro |
|-----------|----------|
| 1º | `RDI` |
| 2º | `RSI` |
| 3º | `RDX` |
| 4º | `RCX` |
| 5º | `R8` |
| 6º | `R9` |

```text
; llamamos: calcular(a, b, c, d, e, f)
mov rdi, 10      ; a
mov rsi, 20      ; b
mov rdx, 30      ; c
mov rcx, 40      ; d
mov r8,  50      ; e
mov r9,  60      ; f
call calcular
```

- Los argumentos del 1 al 6 van en `RDI`, `RSI`, `RDX`, `RCX`, `R8`, `R9`.
- Si hay más de seis, el resto se pasan **por la pila** (empujados en orden inverso).
- El **resultado** de la función se devuelve en `RAX`.

Recuerda el orden con una frase sencilla: *"Di Si Dije, Cero Ocho Nueve"* — `RDI`, `RSI`, `RDX`, `RCX`, `R8`, `R9`.

:::tip
💡 Cuando escribas una función propia, decide su orden de argumentos y respétalo siempre. No hay un "modo automático": el orden lo define la convención y tú debes obedecerla o las funciones no se entenderán.
:::

## 3. Callee-saved vs caller-saved

Esta es la regla más importante de la convivencia entre funciones. Los registros se dividen en dos familias:

| Familia | Registros | Regla |
|---------|-----------|-------|
| **Callee-saved** | `RBX`, `RBP`, `R12`–`R15` | La función llamada **debe preservarlos** (guardar y restaurar antes de `ret`) |
| **Caller-saved** | `RAX`, `RCX`, `RDX`, `RSI`, `RDI`, `R8`–`R11` | La función llamada **puede pisarlos**; el que llama debe respaldar lo que le importe |

```text
mi_funcion:
    push rbx          ; rbx es callee-saved: hay que preservarlo
    ; ... usar rbx libremente ...
    pop rbx
    ret
```

- **Callee-saved:** si tu función usa `RBX`, `RBP` o `R12`-`R15`, está obligada a dejar su valor original al salir. Por eso el `push`/`pop` al principio y al final.
- **Caller-saved:** la función puede destruirlos sin avisar. Si al llamador le importaba su valor, él es quien debe respaldarlo antes del `call`.

La lógica es de cortesía mutua: cada parte sabe exactamente de quién es la responsabilidad de no romper nada. Sin esta regla, un programa con varias funciones sería un caos de registros corrompidos.

:::warning Advertencia
⚠️ Si tu función usa un registro **callee-saved** y no lo restaura, el que te llamó encontrará su valor cambiado. Los bugs que provoca son de los peores: no fallan de inmediato, sino que corrompen la lógica del llamador en un lugar lejano.
:::

## 4. Alineación de la pila

La convención SysV exige que, **en el momento del `call`**, la pila esté alineada a 16 bytes. Suena a burocracia, pero la razón es práctica: las instrucciones SSE (que verás en la Parte VII) exigen datos alineados, y la ABI garantiza ese orden.

```text
Antes del call:   RSP alineado a 16 bytes
call empuja 8:    RSP ya no está alineado a 16 (queda en múltiplo de 8)
dentro de la fn:  prólogo: push rbp (otro 8) → vuelve a estar alineado
```

- El `call` empuja 8 bytes, desalineando momentáneamente.
- El prólogo (`push rbp`) empuja otros 8, alineando de nuevo dentro de la función.
- Por eso el patrón `push rbp` + `mov rbp, rsp` además de organizar, **arregla la alineación**.

Cuando llames a funciones de la biblioteca de C (Parte VI), respetar esta alineación deja de ser opcional: funciones como `printf` la exigen y fallan (o crashean) si no la respetas.

## 5. Un ejemplo completo de función conforme

Reunamos todo en una función que suma tres números y devuelve el resultado:

```text
suma_tres:
    push rbp            ; prólogo
    mov  rbp, rsp

    mov  rax, rdi       ; resultado = a
    add  rax, rsi       ; + b
    add  rax, rdx       ; + c

    pop  rbp            ; epílogo
    ret                 ; resultado en rax
```

```text
inicio:
    mov rdi, 5
    mov rsi, 10
    mov rdx, 20
    call suma_tres      ; rax = 35
    ; aquí rax tiene el resultado
```

- `suma_tres` no usa registros callee-saved, así que no necesita preservarlos.
- Los argumentos llegan en `RDI`, `RSI`, `RDX` según la convención.
- Devuelve el resultado en `RAX`.

Escribe esta función como `global suma_tres` y podrás llamarla desde C en el capítulo de la Parte VI, porque respeta el ABI de Linux.

## Resumen rápido

- La **ABI SysV AMD64** define cómo se comunican las funciones en Linux/macOS.
- Argumentos 1–6: `RDI`, `RSI`, `RDX`, `RCX`, `R8`, `R9`; el resto por la pila.
- Resultado en **`RAX`**.
- **Callee-saved** (`RBX`, `RBP`, `R12`-`R15`): la función debe preservarlos.
- **Caller-saved** (el resto): la función puede pisarlos; el llamador se protege solo.
- La pila debe quedar **alineada a 16 bytes** en el momento del `call`.

Ya conoces las reglas de comunicación. En el próximo capítulo las pondremos en práctica a fondo: veremos **parámetros y valores de retorno**, con funciones que reciben datos por valor, por dirección y devuelven resultados complejos.