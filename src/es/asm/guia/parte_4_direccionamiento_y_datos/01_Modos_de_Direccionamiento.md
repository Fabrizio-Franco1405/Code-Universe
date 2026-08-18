---
outline: [2, 3]
---

# Modos de direccionamiento

Hasta ahora accedes a la memoria de forma simple: `[etiqueta]` para leer una variable y `[registro]` como puntero. Pero x86 tiene un catálogo completo de **modos de direccionamiento**: distintas fórmulas para calcular qué dirección de memoria tocar. Este capítulo los recorre, y con ellos podrás acceder a cualquier dato con una sola instrucción.

## 1. Los operandos básicos

Recuerda que un operando puede ser de tres clases, y que los corchetes cambian el significado:

```nasm
mov rax, 10         ; inmediato: el número 10
mov rax, rbx        ; registro: el valor de rbx
mov rax, [dirección] ; memoria: lo que hay guardado en esa dirección
```

- **Inmediato:** el valor literal viene en la instrucción.
- **Registro:** se lee el valor dentro de la CPU.
- **Memoria (`[ ]`):** se lee el contenido de una dirección.

Todo lo que sigue son variaciones de ese tercer caso: distintas maneras de calcular la dirección entre corchetes.

## 2. Direccionamiento directo y por registro

Los dos modos más simples:

```nasm
mov rax, [total]      ; directo: la dirección la da la etiqueta
mov rbx, [rcx]        ; indirecto: la dirección la da el registro rcx
```

- **Directo:** la dirección es un valor fijo (`total`), que el enlazador resolvió.
- **Indirecto por registro:** la dirección está guardada en un registro (`rcx`). Es la base de los punteros.

En el modo indirecto, el registro actúa como un puntero: contiene una dirección, y los corchetes dicen "ve ahí y tráeme lo que hay".

:::info Nota
ℹ️ En x86-64, los accesos directos a etiquetas se suelen emitir como **relativos a `RIP`** (la dirección se calcula en base a la instrucción actual). Es automático: tú escribes `[total]` y el ensamblador genera lo que convenga.
:::

## 3. Base + desplazamiento

Con este modo puedes apuntar a una base y "desplazarte" un número fijo de bytes:

```nasm
mov rax, [rbx]        ; base = rbx, sin desplazamiento
mov rax, [rbx + 8]    ; base = rbx, desplazamiento 8
mov rax, [rbp - 16]   ; base = rbp, desplazamiento -16
```

- `[rbx + 8]`: lee el byte (o qword) que está 8 bytes después de `rbx`.
- `[rbp - 16]`: lee 16 bytes antes de `rbp`. Es el modo que usan las variables locales de las funciones (Parte III).
- El desplazamiento es un valor **constante** que no modifica el registro.

Este modo es la forma estándar de acceder a campos de una estructura: si `rbx` apunta al inicio de la estructura, cada campo vive a un desplazamiento fijo.

## 4. Base + índice + escala

El modo más poderoso combina **dos registros** y una **escala** (1, 2, 4 u 8), ideal para recorrer arreglos:

```nasm
mov rax, [rsi + rcx*8]    ; base + índice*8
mov rax, [rsi + rcx*4 + 16] ; base + índice*4 + desplazamiento
```

- `[rsi + rcx*8]`: la base es `rsi`; el índice es `rcx` multiplicado por 8.
- La escala multiplica el índice por 1, 2, 4 u 8.
- Puedes sumar además un desplazamiento constante al final.

Para un arreglo de qwords, `rcx` sería el índice del elemento y `*8` el tamaño de cada elemento:

```nasm
; suma los elementos 2 y 3 de un arreglo de qwords
mov rsi, numeros
mov rcx, 2
mov rax, [rsi + rcx*8]      ; elementos[2]
mov rbx, [rsi + rcx*8 + 8]  ; elementos[3]
```

- `[rsi + rcx*8]`: el elemento en la posición `rcx`.
- `[rsi + rcx*8 + 8]`: el siguiente elemento.

La escala solo puede ser potencia de dos (1, 2, 4, 8), justo los tamaños de `byte`, `word`, `dword` y `qword`. No es coincidencia: el hardware está diseñado para indexar esos tipos con una sola instrucción.

:::tip
💡 Esta es la fórmula mental del modo índice: `[base + índice * escala + desplazamiento]`. Cuando recorras un arreglo, la base es el puntero al inicio, el índice el elemento actual, y la escala el tamaño del tipo.
:::

## 5. Tabla de modos y cuándo usarlos

Un resumen práctico para elegir el modo correcto:

| Modo | Sintaxis | Cuándo usarlo |
|------|----------|---------------|
| Directo | `[etiqueta]` | Variable global conocida |
| Indirecto | `[registro]` | Puntero a un dato |
| Base + desplaz. | `[reg + const]` | Campo de estructura, variable local |
| Base + índice | `[reg1 + reg2*escala]` | Recorrer arreglos |
| Base + índice + despl. | `[reg1 + reg2*escala + const]` | Arreglo de estructuras |

Un ejemplo que combina casi todo: recorrer un arreglo de estructuras de 16 bytes, accediendo a su segundo campo:

```nasm
; cada estructura: [campo_a: 8 bytes][campo_b: 8 bytes]
mov rsi, lista           ; base
mov rcx, 0               ; índice
siguiente:
    mov rax, [rsi + rcx*16 + 8]   ; campo_b del elemento rcx
    ; ... procesar rax ...
    inc rcx
    cmp rcx, cantidad
    jl siguiente
```

- `*16`: cada elemento de la lista ocupa 16 bytes.
- `+8`: el campo `campo_b` está a 8 bytes del inicio de cada elemento.
- El bucle recorre toda la lista con un solo patrón de direccionamiento.

:::warning Advertencia
⚠️ Las restricciones del modo índice son estrictas: un registro de índice no puede ser `RSP`, y la escala debe ser 1, 2, 4 u 8. Si NASM te rechaza una expresión, casi siempre es por violar alguna de estas reglas.
:::

## Resumen rápido

- Tres operandos básicos: **inmediato**, **registro** y **memoria (`[ ]`)**.
- Modo **directo** (`[etiqueta]`) y **indirecto** (`[registro]`).
- **Base + desplazamiento** (`[rbp-16]`) para campos y variables locales.
- **Base + índice + escala** (`[rsi + rcx*8]`) para arreglos.
- La escala es 1, 2, 4 u 8, y el desplazamiento final es constante.

Con estos modos puedes tocar cualquier dato de la memoria. En el próximo capítulo los pondremos al servicio de los **punteros y el direccionamiento indirecto**, y verás cómo recorrer estructuras encadenadas como si fueran un mapa.