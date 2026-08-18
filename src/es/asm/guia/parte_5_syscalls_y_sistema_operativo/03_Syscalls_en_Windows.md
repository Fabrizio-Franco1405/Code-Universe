---
outline: [2, 3]
---

# Syscalls en Windows

Hasta ahora todo ocurrió en el mundo Linux. Pero el ensamblador también vive en Windows, y allí las reglas cambian por completo: otra convención de llamada, otro formato de ejecutable y un acceso a syscalls mucho más restringido. Este capítulo te muestra el contraste para que sepas navegar ambos mundos.

## 1. Las diferencias de raíz

Windows y Linux divergen en casi todo lo que toca el ensamblador:

| Aspecto | Linux | Windows |
|---------|-------|---------|
| Formato ejecutable | ELF | PE (Portable Executable) |
| Convención de llamada | SysV (Linux) | Microsoft x64 |
| Punto de entrada | `_start` | `main` (o la que indique el enlazador) |
| Syscalls directas | Públicas y estables | No públicas ni estables |
| Primeros argumentos | `rdi`, `rsi`, `rdx`... | `rcx`, `rdx`, `r8`, `r9` |

La diferencia más importante: en Linux, el número de cada syscall es **público y estable**; en Windows, los números internos cambian entre versiones y no son un contrato soportado. Por eso en Windows se programan las **funciones de las DLLs** (como `kernel32.dll`), no syscalls directas.

:::info Nota
ℹ️ La convención **Microsoft x64** pasa los argumentos en `rcx`, `rdx`, `r8`, `r9` (y el resto por la pila), exige 32 bytes de "espacio de sombra" en la pila y devuelve en `rax`. Aprenderla es útil incluso si programas solo en Linux, porque muchos compiladores y herramientas la usan.
:::

## 2. Las piezas del mundo Windows

Para escribir ensamblador en Windows nativo necesitas:

- **NASM en modo `win64`**: `nasm -f win64 programa.asm`.
- **Un enlazador de Windows**: el de MinGW (`ld`) o el de Visual Studio (`link.exe`).
- **Las bibliotecas del sistema**: para casi todo, llamas a funciones de `kernel32.dll`, `user32.dll`, `msvcrt.dll`, etc.

```bash
nasm -f win64 programa.asm -o programa.obj
ld programa.obj -o programa.exe -lkernel32 -luser32
```

- `-f win64`: genera el formato objeto de Windows.
- `-lkernel32` y `-luser32`: enlazan las bibliotecas del sistema donde viven las funciones.

El flujo conceptual es el mismo (ensamblar y enlazar), pero los archivos resultantes son `.obj` y `.exe`.

## 3. El primer programa: Una ventana de mensaje

El "Hola, mundo" de Windows clásico usa `MessageBoxA` de `user32.dll`, que muestra un cuadro de diálogo. Siguiendo la convención Microsoft:

```text
extern MessageBoxA
extern ExitProcess

section .data
    titulo   db "Ensamblador", 0
    mensaje  db "Hola desde Windows!", 0

section .text
    global main

main:
    sub rsp, 40          ; espacio de sombra + alineación

    mov rcx, 0           ; hWnd (sin ventana padre)
    mov rdx, mensaje     ; lpText (el texto)
    mov r8,  titulo      ; lpCaption (el título)
    mov r9d, 0           ; uType (botón Aceptar)
    call MessageBoxA

    mov rcx, 0           ; código de salida
    call ExitProcess
```

- `extern MessageBoxA` / `extern ExitProcess`: importamos funciones de las DLLs.
- `sub rsp, 40`: la convención Microsoft exige **32 bytes de sombra** y alineación a 16.
- Los argumentos van en `rcx`, `rdx`, `r8`, `r9`.
- `call MessageBoxA`: muestra la ventana; `call ExitProcess` termina.

Observa que aquí **no usas syscalls**: usas funciones públicas y documentadas de las bibliotecas del sistema. Esa es la forma correcta y soportada de hacer las cosas en Windows.

:::warning Advertencia
⚠️ No escribas syscalls "a pelo" en Windows: los números no son estables entre versiones y tu programa dejará de funcionar con la próxima actualización del sistema. Llama siempre a las funciones de las bibliotecas (`kernel32`, `user32`, `ntdll`).
:::

## 4. Escribir por consola con Windows API

Si quieres texto en la consola, el equivalente de `write` es `WriteFile` de `kernel32.dll`. Necesitas primero un manejador de la salida estándar:

```text
extern GetStdHandle
extern WriteFile
extern ExitProcess

section .data
    mensaje db "Hola, mundo!", 0ah
    escrito resq 1

section .text
    global main

main:
    sub rsp, 56

    mov rcx, -11          ; STD_OUTPUT_HANDLE
    call GetStdHandle     ; rax = manejador de la consola

    mov rcx, rax          ; hFile = manejador
    mov rdx, mensaje      ; lpBuffer
    mov r8,  14           ; nNumberOfBytesToWrite
    mov r9,  escrito      ; lpNumberOfBytesWritten
    mov qword [rsp+32], 0 ; lpOverlapped (nulo)
    call WriteFile

    mov rcx, 0
    call ExitProcess
```

- `GetStdHandle(-11)`: pide el manejador de la salida estándar.
- `WriteFile` recibe 5 argumentos: el cuarto en `r9` y el quinto en la pila (`[rsp+32]`).
- El quinto argumento va en la pila porque hay más de cuatro.

Este patrón —obtener un manejador y luego operar con él— es la manera oficial de hacer E/S en Windows. Si lo comparas con el `write` de Linux, verás el mismo concepto (un descriptor de archivo) pero con funciones y argumentos distintos.

## 5. ¿Conviene programar Windows en Ensamblador?

Después de ver la complejidad, una pregunta honesta: ¿vale la pena? La respuesta depende del objetivo:

- **Para aprender:** el curso se enfoca en Linux porque los syscalls públicos hacen visible el mecanismo. En Windows, las DLLs ocultan esa capa.
- **Para producción:** casi nadie escribe Windows en ensamblador puro. Se usa C/C++ con asm inline para puntos críticos.
- **Para seguridad:** leer ensamblador de Windows (debinar malware, analizar exploits) es muy valioso, pero es lectura, no escritura.

Lo que aprendiste en Linux —registros, pila, convenciones, direccionamiento— se aplica intacto a Windows. Solo cambian las reglas de la frontera con el sistema.

:::tip
💡 Si tu objetivo es dominar el ensamblador, no te disperses: domina primero Linux a fondo y, cuando quieras leer o auditar código de Windows, la convención Microsoft x64 será lo único nuevo que necesites aprender.
:::

## Resumen rápido

- Windows usa **PE**, convención **Microsoft x64** (`rcx`, `rdx`, `r8`, `r9`) y entrada en `main`.
- Las **syscalls de Windows no son públicas ni estables**: se usan las funciones de las DLLs.
- `MessageBoxA` y `WriteFile` son ejemplos de la API oficial.
- `nasm -f win64` + enlazador de Windows + bibliotecas del sistema.
- Los conceptos de Linux se transfieren; solo cambia la frontera con el sistema.

Con el contraste entre Linux y Windows claro, volvamos a la parte práctica del mundo Linux: en el próximo capítulo veremos **archivos y entrada/salida**, abriendo, leyendo y escribiendo datos en el disco.