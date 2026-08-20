---
outline: [2, 3]
---

# Tu primer programa en Ensamblador

En el capítulo anterior preparaste tu entorno: NASM, el enlazador y tu editor quedaron listos. Ahora llega el momento que estabas esperando: escribir tu primer programa en ensamblador. Vamos a crear un clásico "Hola, mundo", pero entendiendo cada línea como nunca antes.

## 1. Creando el archivo

Crea un archivo llamado `hola.asm` en tu carpeta de trabajo y escribe lo siguiente:

```text
; hola.asm - Nuestro primer programa
; Muestra "Hola, mundo!" y termina.

section .data
    mensaje db "Hola, mundo!", 0ah

section .text
    global _start

_start:
    mov rax, 1          ; syscall para escribir (write)
    mov rdi, 1          ; archivo de salida: 1 = pantalla
    mov rsi, mensaje    ; dirección del texto a escribir
    mov rdx, 13         ; cantidad de bytes a escribir
    syscall             ; pedimos al sistema operativo

    mov rax, 60         ; syscall para terminar (exit)
    mov rdi, 0          ; código de salida 0 = éxito
    syscall
```

No te preocupes si no entiendes cada línea todavía: este capítulo existe exactamente para explicártelas.

## 2. Ensamblar y ejecutar

Con el archivo guardado, ejecuta en la terminal:

```bash
nasm -f elf64 hola.asm -o hola.o
ld hola.o -o hola
./hola
```

```text
Hola, mundo!
```

Tres comandos, tres etapas:

- `nasm -f elf64 hola.asm -o hola.o`: **ensambla** y genera el archivo objeto `hola.o`. El flag `-f elf64` indica el formato (ELF de 64 bits, el estándar de Linux).
- `ld hola.o -o hola`: **enlaza** el objeto y produce el ejecutable `hola`.
- `./hola`: ejecuta el programa. Deberías ver el saludo en pantalla.

:::tip
💡 Si ves `Hola, mundo!`, ¡felicitaciones! Acabas de escribir, ensamblar y ejecutar un programa que habla directamente con tu procesador.
:::

## 3. Anatomía del programa

Vamos a desglosar cada parte, porque aquí está el verdadero aprendizaje.

```text
section .data
    mensaje db "Hola, mundo!", 0ah
```

- `section .data`: declara la sección de datos inicializados. Aquí vivirá la información que el programa usará.
- `mensaje`: una **etiqueta**. Es un nombre que le damos a una dirección de memoria para referirnos a ella sin recordar números.
- `db`: *define bytes*. Reserva espacio y coloca los bytes del texto.
- `"Hola, mundo!"`: el texto literal.
- `0ah`: el salto de línea en hexadecimal (el `\n` de otros lenguajes). Sin él, el cursor quedaría pegado al texto.

Luego viene la sección de código:

```text
section .text
    global _start
```

- `section .text`: la sección donde escribimos instrucciones.
- `global _start`: declara la etiqueta `_start` como visible para el enlazador. El sistema operativo busca `_start` como punto de entrada del programa.

## 4. Las instrucciones

El cuerpo del programa usa cuatro instrucciones seguidas de la llamada al sistema:

```text
mov rax, 1          ; syscall para escribir (write)
mov rdi, 1          ; archivo de salida: 1 = pantalla
mov rsi, mensaje    ; dirección del texto a escribir
mov rdx, 13         ; cantidad de bytes a escribir
syscall
```

- `mov destino, origen`: copia un valor. Primero metemos en `rax` el número `1`, que significa "quiero escribir".
- `rax`, `rdi`, `rsi`, `rdx`: son **registros**, las cajitas de alta velocidad dentro del procesador donde se guardan los valores con los que se trabaja.
- `syscall`: le pide al **sistema operativo** que haga algo en nuestro nombre. El número de operación va en `rax`, y sus argumentos en los demás registros.
- La instrucción `write` escribe los `rdx` bytes que están en la dirección `rsi` al archivo `rdi` (donde `1` es la pantalla).

Finalmente, el cierre:

```text
mov rax, 60         ; syscall para terminar (exit)
mov rdi, 0          ; código de salida 0 = éxito
syscall
```

- `mov rax, 60`: pide la syscall `exit` (terminar el programa).
- `mov rdi, 0`: el código de salida. Cero significa éxito; cualquier otro valor indica un error.

:::warning Advertencia
⚠️ En Windows nativo el programa anterior **no funciona**: los números de syscall de Windows son distintos y la estructura del ejecutable también. Por eso la guía usa NASM en Linux/WSL y dedica la sección 5 (y el capítulo de Windows) al camino con **MASM**.
:::

## 5. El mismo programa en Windows: MASM

Si instalaste MASM en el capítulo anterior, aquí tienes el mismo "Hola, mundo" en su sintaxis. En vez de una syscall como en Linux, el programa le pide a Windows que escriba en la consola usando las funciones de `kernel32.dll`:

```text
; hola.asm - Hola, mundo en MASM (x64)
; Ensamblar:   ml64 /c hola.asm
; Enlazar:     link hola.obj /SUBSYSTEM:CONSOLE /ENTRY:main kernel32.lib

extrn GetStdHandle: PROC
extrn WriteFile:    PROC
extrn ExitProcess:  PROC

.data
    mensaje db "Hola, mundo!", 0ah, 0
    escrito dq 0

.code
main PROC
    sub rsp, 40                      ; espacio de sombra + alineación

    mov ecx, -11                     ; STD_OUTPUT_HANDLE
    call GetStdHandle                ; rax = manejador de la consola

    mov rcx, rax                     ; hFile
    lea rdx, mensaje                 ; lpBuffer
    mov r8d, 13                      ; nNumberOfBytesToWrite
    lea r9, escrito                  ; lpNumberOfBytesWritten
    mov qword ptr [rsp+32], 0        ; lpOverlapped (nulo)
    call WriteFile

    xor ecx, ecx                     ; código de salida 0
    call ExitProcess
main ENDP
END
```

- `extrn ...: PROC`: declara funciones externas de Windows, el equivalente de `extern` en NASM.
- `.data` y `.code` son las secciones, equivalentes a `.data` y `.text`.
- `PROC` / `ENDP` delimitan el procedimiento `main`, el punto de entrada que busca el enlazador.
- `ml64 /c hola.asm` ensambla y genera `hola.obj`; `link` lo convierte en `hola.exe`.
- La mecánica es la misma que en Linux: obtener el manejador de la consola, pasarle un buffer con el texto y pedir que lo escriba.

:::tip
💡 Compara ambas versiones: los **registros y la mecánica son idénticos**; lo que cambia es cómo se pide el servicio al sistema. Una vez entiendes el hardware, cambiar de ensamblador es solo aprender una nueva sintaxis.
:::

## 6. ¿Qué hace la CPU mientras tanto?

Cuando ejecutas `./hola`, ocurre algo maravilloso detrás de escena:

1. El sistema operativo carga el ejecutable en memoria.
2. Encuentra `_start` y entrega el control al procesador.
3. La CPU lee cada instrucción en orden, la ejecuta, y avanza a la siguiente.
4. Al encontrar `syscall`, la CPU le cede el control al sistema operativo, que escribe el texto en pantalla.
5. Con `exit`, el programa termina y devuelve el control al sistema.

Ese "leer, ejecutar, avanzar" es el **ciclo de ejecución** de toda CPU. Lo estudiaremos a fondo en la Parte I.

## Resumen rápido

- Un programa ensamblador mínimo tiene **datos** (`.data`), **código** (`.text`) y una etiqueta de entrada (`_start`).
- `nasm` convierte tu código en un archivo objeto; `ld` lo convierte en ejecutable.
- `mov` copia valores entre registros y memoria; `syscall` pide servicios al sistema operativo.
- En **Windows nativo**, el flujo equivalente usa **MASM** (`ml64` + `link`) y las funciones de `kernel32.dll`.
- El programa termina siempre con la syscall `exit` para no devolver el control de forma abrupta.

Ya viste tu primer programa funcionar de principio a fin. En el próximo capítulo entenderás el flujo completo que conecta tu texto con el hardware: **ensamblar y enlazar**, y las herramientas que intervienen en cada paso.