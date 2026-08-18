---
outline: [2, 3]
---

# Parámetros y valores de retorno

En el capítulo anterior conociste las reglas del ABI: qué registros llevan argumentos y quién preserva qué. Ahora vamos a **ponerlas en práctica**: verás cómo pasar parámetros por valor y por dirección, cómo devolver resultados, y cómo manejar valores de retorno más grandes que un registro.

## 1. Parámetros por valor

Cuando pasas un **parámetro por valor**, copias el dato en el registro de argumento. La función recibe una copia y puede modificarla sin afectar al llamador:

```nasm
doble:
    lea rax, [rdi + rdi]    ; rax = rdi * 2
    ret

inicio:
    mov rdi, 21
    call doble              ; rax = 42
```

- `lea rax, [rdi + rdi]`: multiplica por 2 sin tocar banderas.
- `rdi` sigue valiendo 21 después de la llamada: la función trabajó con una copia.
- El resultado llega en `RAX`.

Por valor es lo más simple y seguro: nadie rompe los datos del otro.

## 2. Parámetros por dirección

Cuando el dato es grande (un arreglo, una estructura, una cadena), copiarlo sería costoso. En su lugar, pasamos **la dirección** donde vive:

```nasm
leer_primero:
    mov rax, [rdi]      ; rdi es la dirección; leemos el primer qword
    ret

inicio:
    mov rdi, numeros    ; pasamos la dirección del arreglo
    call leer_primero
```

- `mov rdi, numeros`: pasamos la **dirección**, no el contenido.
- Dentro de la función, `[rdi]` lee el dato apuntado.
- La función puede incluso **modificar** el dato original con `mov [rdi], valor`.

Pasar por dirección es la versión ensamblador de los punteros de C, y la base de los modos de direccionamiento que verás en la Parte IV.

:::info Nota
ℹ️ En C, pasar un puntero permite a la función modificar el dato original; pasar un valor, no. En ensamblador la diferencia es visual: `[rdi]` modifica el original, `rdi` solo trabaja con la copia.
:::

## 3. Devolver valores

El resultado de una función entera o de puntero se devuelve en **`RAX`**. Si necesitas devolver dos valores, la convención ofrece `RDX` como segundo resultado:

```nasm
dividir:
    ; recibe: rdi = dividendo, rsi = divisor
    mov rax, rdi
    mov rdx, 0          ; parte alta del dividendo
    idiv rsi            ; cociente -> rax, resto -> rdx
    ret
```

- `idiv rsi`: cociente en `RAX`, resto en `RDX`.
- La función "devuelve" dos valores: el cociente y el resto.
- El llamador lee `RAX` y `RDX` después de la llamada.

```nasm
inicio:
    mov rdi, 17
    mov rsi, 5
    call dividir        ; rax = 3 (cociente), rdx = 2 (resto)
```

Este patrón de "dos resultados" es común en aritmética y en operaciones que devuelven un dato más una bandera o un resto.

## 4. Retornos más grandes: Memoria del llamador

¿Y si la función debe devolver algo que no cabe en `RAX` y `RDX` (una estructura grande)? La convención SysV dicta una regla elegante: **el llamador reserva el espacio y le pasa la dirección**, y la función escribe el resultado ahí.

```nasm
section .bss
    resultado resq 2        ; espacio para 2 qwords (una "estructura")

section .text

rellenar:
    ; rdi apunta al espacio donde escribir el resultado
    mov qword [rdi], 100
    mov qword [rdi+8], 200
    ret

inicio:
    mov rdi, resultado      ; dirección del espacio reservado
    call rellenar
    ; resultado[0] = 100, resultado[1] = 200
```

- El llamador reserva el espacio (`resultado resq 2`).
- Pasa su dirección en `RDI`.
- La función escribe los datos en `[rdi]` y `[rdi+8]`.

Es un acuerdo implícito: la función no reserva memoria propia para el retorno; usa el "buzón" que le pasaron. Así se devuelven estructuras, registros con varios campos y hasta valores de coma flotante complejos.

:::tip
💡 Cuando veas funciones de C que devuelven estructuras por valor, recuerda este patrón: el compilador reserva espacio, pasa la dirección como argumento secreto y la función escribe ahí. Ahora puedes leer ese tipo de ensamblador sin confundirte.
:::

## 5. Un ejemplo completo de uso de parámetros

Combinemos todo: una función que suma los elementos de un arreglo, pasando por dirección y devolviendo el total:

```nasm
sumar_arreglo:
    ; rdi = dirección del arreglo, rsi = cantidad de elementos
    mov  rcx, rsi       ; contador = cantidad
    mov  rax, 0         ; acumulador = 0
recorrer:
    add  rax, [rdi]     ; sumamos el elemento actual
    add  rdi, 8         ; avanzamos al siguiente qword
    loop recorrer
    ret                 ; rax = suma total
```

```nasm
section .data
    valores dq 2, 4, 6, 8

section .text
    global _start

_start:
    mov rdi, valores
    mov rsi, 4
    call sumar_arreglo  ; rax = 20
    ; ... continuar ...
```

- `rdi` recibe la dirección; `rsi`, la cantidad.
- El bucle recorre los `rsi` elementos usando `loop`.
- Devuelve la suma en `RAX`.
- La función no pisa registros callee-saved, así que no necesita preservar nada.

Observa que todos los roles siguen la convención: argumentos en orden, resultado en `RAX`, y sin obligaciones extra de preservación.

## Resumen rápido

- **Por valor:** el argumento viaja como copia en el registro; la función no afecta al original.
- **Por dirección:** se pasa la dirección y la función lee/escribe el dato original con `[registro]`.
- El resultado va en **`RAX`**; si hay un segundo, en **`RDX`**.
- Retornos grandes: el llamador reserva el espacio y pasa su **dirección**; la función escribe ahí.
- Respeta la convención SysV para que tus funciones se entiendan con las de C.

Con funciones que intercambian datos, tu ensamblador ya es un lenguaje de verdad. Ahora toca acceder a los datos de formas más sofisticadas: en la **Parte IV** veremos **los modos de direccionamiento**, los punteros y el manejo de arreglos y cadenas.