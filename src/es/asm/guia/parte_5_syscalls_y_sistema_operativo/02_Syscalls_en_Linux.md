---
outline: [2, 3]
---

# Syscalls en Linux

En el capítulo anterior entendiste la frontera entre usuario y núcleo. Ahora es momento de usarla con soltura: las **syscalls de Linux** en acción. Veremos los servicios más importantes —escribir, leer y terminar— y cómo armar programas que interactúan con el usuario.

## 1. Escribir en pantalla: `write`

La syscall `write` (número `1`) envía datos a un archivo. La **pantalla** es el archivo especial con descriptor `1` (stdout). Sus argumentos:

- `rdi`: el descriptor del archivo (1 = salida estándar).
- `rsi`: la dirección de los datos.
- `rdx`: cuántos bytes escribir.

```nasm
section .data
    mensaje db "Hola, mundo!", 0ah

section .text
    global _start

_start:
    mov rax, 1          ; write
    mov rdi, 1          ; stdout
    mov rsi, mensaje
    mov rdx, 13
    syscall

    mov rax, 60
    mov rdi, 0
    syscall
```

- `mov rax, 1`: el número de `write`.
- Los tres argumentos en `rdi`, `rsi`, `rdx`.
- Al terminar, `rax` contendrá los bytes escritos (13) o un error negativo.

La pantalla (stdout) es un "archivo" más para el sistema: escribirle es exactamente igual que escribir a un archivo en disco, solo cambia el descriptor.

## 2. Leer del teclado: `read`

La syscall `read` (número `0`) recibe datos. La **entrada estándar** es el descriptor `0` (stdin). Argumentos:

- `rdi`: el descriptor (0 = teclado).
- `rsi`: la dirección del buffer donde guardar.
- `rdx`: cuántos bytes máximo leer.

```nasm
section .bss
    buffer resb 64          ; espacio para lo que se escriba

section .text
    global _start

_start:
    mov rax, 0          ; read
    mov rdi, 0          ; stdin (teclado)
    mov rsi, buffer
    mov rdx, 64
    syscall

    ; rax = cantidad de bytes leídos
    mov rdx, rax        ; usamos esa cantidad como longitud
    mov rax, 1          ; write
    mov rdi, 1
    mov rsi, buffer
    syscall
```

- `read` llena el buffer con lo que el usuario teclea (hasta 64 bytes).
- Devuelve en `rax` la **cantidad de bytes real** leídos (0 = fin de entrada).
- Ese valor se reutiliza como longitud para el `write` de eco.

El programa lee del teclado y devuelve lo mismo en pantalla. Es un "eco" básico: la base de cualquier programa interactivo.

:::info Nota
ℹ️ `read` no agrega el terminador `0` ni maneja cadenas: te da bytes en bruto y la cantidad leída. La longitud real en `rax` es tu dato más valioso: casi siempre la usarás después.
:::

## 3. Terminar con elegancia: `exit`

La syscall `exit` (número `60`) termina el proceso y le comunica al sistema (y al padre que lo lanzó) el código de salida:

```nasm
mov rax, 60         ; exit
mov rdi, 0          ; código de salida (0 = éxito)
syscall
```

- `rdi` es el **código de salida**: `0` para éxito, distinto de cero para error.
- La terminal muestra ese código (por ejemplo, `echo $?`).
- Sin `exit`, el procesador seguiría ejecutando bytes basura más allá del final de tu código.

```bash
./mi_programa
echo $?   # imprime 0
```

- `$?` es el código de salida del último comando.
- Acostúmbrate a devolver códigos significativos: `0` éxito, `1` o más para errores.

Terminar siempre con `exit` explícito es una regla de oro: el sistema no adivina dónde acaba tu programa.

## 4. Un programa interactivo completo

Unamos todo en un mini-programa que saluda usando el nombre que escribe el usuario:

```nasm
section .data
    prompt db "Tu nombre: ", 0
    saludo db "Hola, ", 0
section .bss
    nombre resb 32

section .text
    global _start

_start:
    ; mostramos el prompt
    mov rax, 1
    mov rdi, 1
    mov rsi, prompt
    mov rdx, 11
    syscall

    ; leemos el nombre
    mov rax, 0
    mov rdi, 0
    mov rsi, nombre
    mov rdx, 32
    syscall
    mov r9, rax          ; guardamos la longitud leída

    ; escribimos "Hola, "
    mov rax, 1
    mov rdi, 1
    mov rsi, saludo
    mov rdx, 6
    syscall

    ; escribimos el nombre
    mov rax, 1
    mov rdi, 1
    mov rsi, nombre
    mov rdx, r9
    syscall

    mov rax, 60
    mov rdi, 0
    syscall
```

- `mov r9, rax`: guardamos la longitud del nombre antes de que otras syscalls la pisen.
- Cada `write` envía su parte: prompt, saludo y nombre.
- `r9` es una buena elección para "memoria temporal" porque no se pisa entre syscalls.

Este es el patrón de cualquier diálogo con el usuario: escribir, leer, guardar la longitud, escribir de nuevo.

:::tip
💡 Guarda siempre la longitud leída por `read` en un registro que no vayas a sobrescribir. Sin esa longitud, no sabes cuántos bytes del buffer son reales y cuántos son basura residual.
:::

## 5. Manejando errores de syscall

Un programa robusto comprueba los resultados. Veamos el patrón completo para detectar y manejar un error de `write`:

```nasm
    mov rax, 1
    mov rdi, 1
    mov rsi, mensaje
    mov rdx, 13
    syscall

    test rax, rax       ; ¿resultado negativo?
    js  error_escritura
    jmp continuar

error_escritura:
    mov rax, 60         ; terminar con código de error
    mov rdi, 1
    syscall

continuar:
    ; ... seguir con el programa ...
```

- `test rax, rax`: prepara las banderas según el resultado.
- `js error_escritura`: salta si el resultado fue negativo (hubo error).
- En el caso de error, terminamos con un código de salida distinto de cero.

Comprobar errores no es opcional en código de calidad: un archivo que no se puede escribir, una lectura interrumpida... todo eso debe manejarse. Los próximos capítulos lo aplicarán a los archivos.

:::warning Advertencia
⚠️ Si ignoras el resultado de una syscall que falló, seguirás usando datos que no se escribieron o buffers vacíos, y los bugs aparecerán más tarde, lejos de la causa. La comprobación inmediata es la disciplina correcta.
:::

## Resumen rápido

- `write` (1): envía datos; `rdi`=archivo, `rsi`=dirección, `rdx`=longitud.
- `read` (0): recibe datos; devuelve en `rax` los bytes reales leídos.
- `exit` (60): termina el proceso con un código en `rdi`.
- La pantalla es el descriptor `1`; el teclado, el `0`.
- Los resultados negativos en `rax` son errores: compruébalos con `test` + `js`.

Con escribir, leer y terminar ya puedes hacer programas interactivos. El siguiente paso natural son **los archivos**: en el capítulo sobre archivos y entrada/salida verás cómo abrir, leer, escribir y cerrar datos en el disco.