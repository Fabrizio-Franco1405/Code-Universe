---
outline: [2, 3]
---

# Comparaciones y saltos condicionales

Hasta ahora nuestros programas corren en línea recta: instrucción tras instrucción, sin desvíos. Pero un programa útil decide, repite y bifurca. Ese poder viene de dos mecanismos que aprenderás ahora: **`cmp`** para comparar y los **saltos condicionales** para actuar según el resultado.

## 1. cmp: comparar sin alterar

La instrucción **`cmp`** compara dos valores restándolos, pero **sin guardar el resultado**: solo actualiza las banderas. Es como hacer una pregunta a la CPU.

```text
mov rax, 10
mov rbx, 10
cmp rax, rbx        ; compara: ¿rax == rbx?
```

- `cmp rax, rbx`: calcula `rax - rbx` y descarta el resultado.
- Solo importa el efecto en las **banderas**: `ZF`, `SF`, `CF`, `OF`.
- Ningún registro se modifica: `rax` y `rbx` quedan igual.

En el ejemplo anterior, como `10 - 10 = 0`, se activa la bandera `ZF` (cero). Eso es todo: `cmp` no toma ninguna decisión; deja la información lista para quien venga después.

:::info Nota
ℹ️ `cmp` es idéntico a `sub`, salvo que no guarda el resultado. Piensa en él como "resta que solo pregunta". Las banderas que deja son las que consultan los saltos condicionales.
:::

## 2. El salto incondicional: `jmp`

Antes de los condicionales, conozcamos el salto simple: **`jmp`** transfiere el control a otra etiqueta sin ninguna condición.

```text
inicio:
    inc rax
    jmp inicio          ; vuelve a "inicio" indefinidamente
```

- `jmp inicio`: salta a la etiqueta `inicio`, modificando el `RIP`.
- Sin cuidado, esto crea un **bucle infinito** (que, de hecho, es un uso legítimo: los sistemas operativos lo hacen todo el tiempo).

`jmp` es el "ir a" incondicional. Los condicionales que vienen a continuación son la versión que pregunta antes de saltar.

## 3. Los saltos condicionales

Los saltos condicionales consultan las banderas y deciden si saltar o seguir. Su forma general es:

```text
cmp rax, rbx
je iguales            ; salta si rax == rbx
jne distintos         ; salta si rax != rbx
```

| Instrucción | Condición | Significado |
|-------------|-----------|-------------|
| `je` / `jz` | `ZF = 1` | igual / cero |
| `jne` / `jnz` | `ZF = 0` | distinto / no cero |
| `jg` | ... | mayor (con signo) |
| `jge` | ... | mayor o igual (con signo) |
| `jl` | ... | menor (con signo) |
| `jle` | ... | menor o igual (con signo) |
| `ja` | ... | mayor (sin signo) |
| `jb` | ... | menor (sin signo) |

Un programa típico de decisión se ve así:

```text
section .data
    resultado db "mayor", 0
    otro      db "menor", 0

section .text
    global _start

_start:
    mov rax, 20
    mov rbx, 10
    cmp rax, rbx
    jg es_mayor        ; si 20 > 10, salta
    jmp es_menor

es_mayor:
    mov rsi, resultado
    jmp fin

es_menor:
    mov rsi, otro

fin:
    mov rax, 60
    mov rdi, 0
    syscall
```

- `cmp rax, rbx` deja las banderas listas.
- `jg es_mayor`: si `rax > rbx` (con signo), salta a `es_mayor`.
- Si no se cumple, cae a la siguiente instrucción (`jmp es_menor`).
- Las etiquetas `es_mayor`, `es_menor` y `fin` organizan las rutas del programa.

## 4. Con signo vs sin signo

Este es el detalle que separa a los profesionales de los que sufren bugs raros: **los saltos de "mayor/menor" se dividen en dos familias** según si el número es con o sin signo.

- **Con signo:** `jg` (greater), `jl` (less), `jge`, `jle`. Usan las banderas `SF` y `OF`.
- **Sin signo:** `ja` (above), `jb` (below), `jae`, `jbe`. Usan la bandera `CF`.

```text
mov al, 0FFh        ; 255 sin signo, o -1 con signo
cmp al, 1
ja  es_arriba       ; salta: 255 > 1    (sin signo)
jg  es_mayor        ; NO salta: -1 no es > 1  (con signo)
```

- `0FFh` es `255` sin signo, pero `-1` con signo.
- `ja` interpreta `255 > 1`, así que salta.
- `jg` interpreta `-1 > 1` como falso, así que no salta.

La misma comparación produce resultados opuestos según la familia que elijas. La regla mental: **"above/below" para sin signo, "greater/less" para con signo**. Mezclarlas produce bugs silenciosos difíciles de encontrar.

:::warning Advertencia
⚠️ No interpongas ninguna operación aritmética entre `cmp` y el salto condicional. `add`, `sub`, `inc`... todas sobrescriben las banderas. El salto debe ser la **siguiente** instrucción lógica que use esa comparación.
:::

## 5. Construyendo `if/else` y `switch`

Con estas piezas puedes montar cualquier estructura de alto nivel. Un `if/else` se traduce casi literalmente:

```text
; if (edad >= 18) ... else ...
mov rax, [edad]
cmp rax, 18
jl  rama_else        ; si edad < 18, al else

; bloque del "if"
jmp fin_condicion

rama_else:
; bloque del "else"

fin_condicion:
```

- Si la condición se cumple, se ejecuta el bloque del `if`.
- Si no, `jl` salta al `else`.
- El `jmp fin_condicion` evita que el `if` "caiga" al `else`.

Un `switch` (múltiples casos) se monta con varias comparaciones encadenadas o, cuando los valores son consecutivos, con una **tabla de saltos** (que verás en niveles avanzados). Por ahora, encadena comparaciones:

```text
cmp rax, 1
je  caso_uno
cmp rax, 2
je  caso_dos
cmp rax, 3
je  caso_tres
jmp caso_default
```

## Resumen rápido

- `cmp` resta sin guardar el resultado; solo actualiza las **banderas**.
- `jmp` salta siempre; los condicionales saltan solo si la bandera se cumple.
- `je`/`jne` para igualdad; `jg`/`jl` (con signo) y `ja`/`jb` (sin signo) para mayor/menor.
- "Above/below" = sin signo; "greater/less" = con signo. No los mezcles.
- Los `if/else` y `switch` se construyen con `cmp` + saltos + etiquetas.

Ya sabes tomar decisiones. Ahora falta repetir: en el próximo capítulo veremos **los bucles**, el mecanismo para ejecutar algo muchas veces sin escribir el código mil veces.