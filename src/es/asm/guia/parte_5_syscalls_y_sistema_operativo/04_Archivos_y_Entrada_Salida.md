---
outline: [2, 3]
---

# Archivos y entrada/salida

Ya hablas con la pantalla y el teclado. Ahora vamos a los **archivos**: leer y escribir datos en el disco. Verás cómo las syscalls `open`, `read`, `write` y `close` trabajan juntas, y el patrón completo para copiar un archivo o procesar su contenido.

## 1. Los descriptores de archivo

En el capítulo de syscalls viste que la pantalla es el descriptor `1` y el teclado el `0`. Un **descriptor de archivo** es un número que el núcleo te asigna al abrir un archivo, y que usas para operar con él:

- `0`: entrada estándar (teclado).
- `1`: salida estándar (pantalla).
- `2`: salida de error (pantalla).
- `3` en adelante: archivos que tu programa abre.

```text
open("datos.txt") → 3        el núcleo devuelve el descriptor
write(3, ...)               escribimos usando el descriptor
close(3)                    liberamos el archivo
```

- El núcleo administra una **tabla de archivos abiertos** por proceso.
- Un descriptor no es un "puntero al archivo": es un número que el núcleo traduce internamente.
- Cuando el proceso termina, el sistema cierra solo los descriptores que quedaron abiertos, pero no te conviene depender de eso.

## 2. Abrir un archivo: `open`

La syscall `open` (número `2`) abre o crea un archivo y devuelve su descriptor:

- `rdi`: la dirección del nombre (cadena con terminador `0`).
- `rsi`: los **flags** de apertura (`0` = solo lectura, `1` = solo escritura, `2` = lectura y escritura).
- `rdx`: los permisos (usados al crear; normalmente `0644`).
- Resultado: descriptor en `rax`, o un error negativo.

```nasm
section .data
    nombre_archivo db "datos.txt", 0

section .text
    mov rax, 2          ; open
    mov rdi, nombre_archivo
    mov rsi, 0          ; solo lectura
    mov rdx, 0
    syscall
    ; rax = descriptor (3, 4, ...) o negativo si hubo error
```

- `mov rsi, 0`: abrimos en modo lectura.
- El resultado positivo en `rax` es el descriptor; lo guardamos para usarlo después.
- Si `rax` es negativo, el archivo no se pudo abrir (por ejemplo, `-2` si no existe).

:::warning Advertencia
⚠️ Comprueba siempre el resultado de `open`. Usar un descriptor negativo como si fuera válido produce fallos raros o lecturas de basura. El patrón `test rax, rax` + `js` que aprendiste es obligatorio aquí.
:::

## 3. Leer y escribir archivos

Con el descriptor en mano, `read` y `write` funcionan igual que con la consola, cambiando el descriptor:

```nasm
section .bss
    buffer resb 128

section .text
    ; asumimos que rax tiene el descriptor del archivo
    mov r8, rax          ; lo movemos a un lugar seguro

    ; leer hasta 128 bytes
    mov rax, 0           ; read
    mov rdi, r8          ; descriptor del archivo
    mov rsi, buffer
    mov rdx, 128
    syscall              ; rax = bytes leídos (0 = fin de archivo)
```

- `mov r8, rax`: el descriptor se mueve a `r8` porque `read` va a sobrescribir `rax`.
- `read` devuelve `0` cuando se llega al **fin del archivo** (EOF). Ese es tu señal para parar.
- Con `1` en `rdi` escribes a pantalla; con un descriptor real, al archivo.

Para escribir a un archivo, cambiamos el número de syscall y el descriptor:

```nasm
    mov rax, 1           ; write
    mov rdi, r8          ; el mismo archivo
    mov rsi, buffer
    mov rdx, 64
    syscall
```

El patrón es idéntico al de la consola; solo cambia el descriptor. Eso es lo elegante de la abstracción de archivos: la consola, el teclado y el disco comparten las mismas operaciones.

## 4. Cerrar el archivo: `close`

Cuando terminas con un archivo, lo cierras con `close` (número `3`):

```nasm
mov rax, 3          ; close
mov rdi, r8         ; el descriptor
syscall
```

- `close` libera el descriptor para que se pueda reutilizar.
- No cerrar archivos en un programa largo puede agotar la tabla de descriptores del proceso.
- Si el proceso termina, el sistema los cierra igualmente, pero cerrarlos explícitamente es buena higiene.

```text
abrir → leer/escribir → cerrar
```

Ese ciclo de tres pasos es la vida de todo archivo: abrir, operar, cerrar. Memorízalo, porque lo usarás en el proyecto final.

## 5. Un programa completo: Copiar un archivo

Unamos todo en un copiador mínimo: lee un archivo completo y escribe su contenido en pantalla.

```nasm
section .data
    nombre_archivo db "datos.txt", 0
    mensaje_error  db "No se pudo abrir", 0ah

section .bss
    buffer resb 128

section .text
    global _start

_start:
    ; abrir el archivo
    mov rax, 2
    mov rdi, nombre_archivo
    mov rsi, 0
    mov rdx, 0
    syscall
    test rax, rax
    js  error
    mov r9, rax          ; descriptor guardado

leer_y_mostrar:
    ; leer un bloque
    mov rax, 0
    mov rdi, r9
    mov rsi, buffer
    mov rdx, 128
    syscall
    test rax, rax        ; ¿fin de archivo?
    jz  cerrar
    ; escribir el bloque en pantalla
    mov rdx, rax         ; los bytes leídos
    mov rax, 1
    mov rdi, 1
    mov rsi, buffer
    syscall
    jmp leer_y_mostrar

cerrar:
    mov rax, 3
    mov rdi, r9
    syscall
    jmp salir

error:
    mov rax, 1
    mov rdi, 1
    mov rsi, mensaje_error
    mov rdx, 17
    syscall
    mov rax, 60
    mov rdi, 1
    syscall

salir:
    mov rax, 60
    mov rdi, 0
    syscall
```

- **Abrir:** `open` y guardamos el descriptor en `r9`.
- **Bucle:** leer un bloque, comprobar EOF (`jz`), mostrarlo y repetir.
- **Cerrar:** `close` del archivo.
- **Errores:** si `open` falla, mostramos un mensaje y salimos con código `1`.

Este es un ejemplo real de lectura por **bloques**: en lugar de leer todo el archivo de una vez (que podría no caber), se lee de 128 bytes y se procesa. Es el patrón que usan los programas de verdad para archivos grandes.

:::tip
💡 El bucle `leer → comprobar EOF → procesar → repetir` es la columna vertebral de casi cualquier herramienta que trabaje con archivos. Domínalo y podrás escribir cat, head, tail y más.
:::

## Resumen rápido

- Un **descriptor** es un número que identifica un archivo abierto; `0`, `1` y `2` son teclado, pantalla y error.
- `open` (2) devuelve el descriptor; `read` (0), `write` (1) y `close` (3) lo usan.
- `read` devuelve `0` en el **fin de archivo** (EOF): es tu señal para parar.
- Comprueba siempre el resultado de `open`: un negativo es un error.
- El ciclo de vida de un archivo es **abrir → operar → cerrar**.

Ya manipulas archivos como un profesional. En la **Parte VI** daremos el salto al mundo de C: veremos **el ABI de C**, cómo llamar a sus funciones desde ensamblador y cómo escribir ensamblador dentro de código C.