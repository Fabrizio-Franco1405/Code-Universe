---
outline: [2, 3]
---

# Punteros y direccionamiento indirecto

En el capítulo anterior viste todos los modos de direccionamiento. Ahora profundizaremos en el más importante de todos: el **puntero**. La idea de guardar una dirección en un registro y "navegar" a través de ella es la clave de las listas, las cadenas, los arreglos y casi todo el software moderno.

## 1. ¿Qué es un puntero?

Un **puntero** es un valor que contiene una **dirección de memoria**. No guarda datos directamente: guarda *dónde* están los datos.

```nasm
section .data
    numero dq 42

section .text
    mov rax, numero         ; rax = la dirección donde vive "numero"
    mov rbx, [rax]          ; rbx = el valor guardado ahí → 42
```

- `mov rax, numero`: `RAX` guarda la **dirección** de `numero` (no su valor).
- `mov rbx, [rax]`: los corchetes dicen "ve a esa dirección y lee su contenido".

La diferencia entre `numero` y `[numero]` que viste en los primeros capítulos es exactamente la de puntero y dato: una dirección y lo que hay en ella.

:::info Nota
ℹ️ En C escribirías lo mismo como `int *p = &numero; int x = *p;`. El ensamblador no necesita los símbolos `&` y `*` porque la sintaxis `[ ]` ya los expresa: `numero` es la dirección, `[numero]` es el contenido.
:::

## 2. Leer y escribir a través de un puntero

Con un puntero en un registro, puedes leer **y modificar** el dato original:

```nasm
mov rax, numero         ; puntero
mov qword [rax], 100    ; escribimos 100 donde apunta
mov rbx, [rax]          ; leemos el nuevo valor → 100
```

- `mov qword [rax], 100`: guarda 100 en la dirección apuntada.
- El dato original `numero` ahora vale 100.
- El prefijo `qword` le dice al ensamblador el tamaño de la escritura.

Poder modificar datos a través de un puntero es lo que permite a una función cambiar el estado del llamador, como viste al pasar argumentos por dirección en la Parte III.

## 3. Avanzar punteros: Recorrer datos

La operación más común con punteros es **avanzarlos** para recorrer una secuencia de datos. Cada avance debe sumar el tamaño del elemento:

```nasm
section .data
    numeros dq 10, 20, 30, 40

section .text
    mov rsi, numeros        ; rsi apunta al primer elemento
    mov rax, [rsi]          ; → 10
    add rsi, 8              ; avanzamos un qword
    mov rax, [rsi]          ; → 20
    add rsi, 8
    mov rax, [rsi]          ; → 30
```

- `mov rsi, numeros`: el puntero arranca en el primer elemento.
- `add rsi, 8`: avanza exactamente 8 bytes (el tamaño de un qword).
- En cada paso, `[rsi]` lee el elemento siguiente.

La regla de oro: **avanza siempre el tamaño del tipo**. Si el tipo es `qword`, suma 8; si es `dword`, suma 4; si es un `byte`, suma 1. Avanzar de más o de menos te desalinea y lees datos mezclados.

:::warning Advertencia
⚠️ Sumar el tamaño incorrecto es un bug silencioso y destructivo: no falla, simplemente lee basura. Cuando recorras datos, comprueba siempre que `escala = tamaño del elemento`.
:::

## 4. El puntero nulo y la memoria inválida

Todo programador de ensamblador se topa tarde o temprano con la dirección `0` o con una dirección inválida. Las reglas de seguridad de memoria del sistema operativo establecen que:

- **No puedes leer ni escribir en la dirección 0** (o cerca de ella).
- **No puedes tocar memoria que no te pertenece** (memoria de otros procesos o del núcleo).
- Intentarlo produce un **fallo de segmentación** (segfault), que termina tu proceso.

```nasm
mov rax, 0
mov rbx, [rax]      ; ERROR: leer la dirección 0 → fallo de segmentación
```

- `rax = 0` es un "puntero nulo".
- `[rax]` intenta leer la dirección 0, prohibida.
- El sistema operativo mata el proceso con `Segmentation fault`.

Un puntero nulo suele significar "no hay nada aquí" o "aún no se calculó la dirección". La práctica profesional es **comprobar antes de usarlo**:

```nasm
test rax, rax
jz  hay_error        ; si rax == 0, no tocar
mov rbx, [rax]       ; seguro: rax no es nulo
```

- `test rax, rax`: compara `rax` consigo mismo, activando `ZF` si es cero.
- `jz hay_error`: si es nulo, nos vamos a manejar el problema.

:::danger
Antes de dereferenciar un puntero, verifica que no sea nulo ni apunte fuera de tus datos. Un solo `mov [rax], valor` con un puntero malo puede corromper la pila, los datos de otra función, o tumbar el programa.
:::

## 5. Estructuras encadenadas: Un ejemplo real

Los punteros brillan con las estructuras encadenadas. Veamos una **lista enlazada**: cada nodo guarda un dato y un puntero al siguiente nodo.

```nasm
section .data
    nodo1 dq 10, 0        ; dato = 10, siguiente = 0 (final)
    nodo2 dq 20, nodo1    ; dato = 20, siguiente = nodo1
    nodo3 dq 30, nodo2    ; dato = 30, siguiente = nodo2

section .text
    mov rsi, nodo3        ; empezamos por el primer nodo
recorrer:
    mov rax, [rsi]        ; rax = dato del nodo actual
    mov rsi, [rsi+8]      ; rsi = puntero al siguiente nodo
    test rsi, rsi
    jnz recorrer          ; si hay siguiente, seguimos
```

- Cada nodo ocupa 16 bytes: el dato en `[rsi]` y el puntero en `[rsi+8]`.
- `mov rsi, [rsi+8]`: avanzamos de nodo en nodo siguiendo los punteros.
- Cuando el puntero es `0`, llegamos al final.

Este recorrido es la versión ensamblador de una lista enlazada de C, y el patrón `test` + `jnz` para detectar el final es estándar en todo el mundo del software.

:::tip
💡 Cuando veas `[reg+8]`, `[reg+16]`, `[reg+24]`, piensa en "campos de una estructura": el primer campo en `+0`, el segundo en `+8`, etc. El registro base es el puntero al inicio de la estructura.
:::

## Resumen rápido

- Un **puntero** guarda una dirección; `[registro]` lee o escribe lo que hay ahí.
- Con un puntero puedes **modificar el dato original**, no solo leerlo.
- Al recorrer, **avanza el tamaño exacto del elemento** (8 para qword, 4 para dword).
- La dirección 0 (puntero nulo) y la memoria ajena están **prohibidas** → fallo de segmentación.
- `test` + `jz`/`jnz` es el patrón estándar para comprobar punteros antes de usarlos.

Los punteros te abren las puertas de las estructuras de datos. En el próximo capítulo veremos su aplicación más directa: **los arreglos**, y cómo acceder a sus elementos con las fórmulas de índice que aprendiste en los modos de direccionamiento.