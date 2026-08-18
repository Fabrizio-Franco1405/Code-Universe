---
outline: [2, 3]
---

# Entrando al sistema operativo

Desde tu primer "Hola, mundo", tus programas usan la instrucción `syscall`. Llegó la hora de entender qué pasa realmente en ese instante: el puente entre tu código y el **sistema operativo**. Este capítulo explica por qué tus programas no pueden hacer todo solos y cómo piden servicios con autoridad.

## 1. Los dos mundos: Usuario y núcleo

Tu programa corre en el **modo usuario**, con privilegios limitados. El **núcleo** (kernel) del sistema operativo corre en el **modo núcleo**, con control total del hardware. ¿Por qué esta separación?

- El modo usuario **no puede** tocar el hardware directamente (disco, red, memoria de otros).
- El modo núcleo **sí puede**, y es quien administra esos recursos.
- Si cualquier programa pudiera hacer lo que quisiera, uno solo podría tumbar la máquina o robar datos ajenos.

```text
+----------------------------------------------------------+
|  Modo núcleo (kernel)      ← control total del hardware   |
|  maneja archivos, red, memoria, procesos                   |
+----------------+-------------------------+----------------+
                 |        syscall          |
                 v                         ^
+----------------------------------------------------------+
|  Modo usuario (tu programa)   ← privilegios limitados     |
|  no toca hardware, pide servicios al núcleo               |
+----------------------------------------------------------+
```

Tu programa vive abajo; cuando necesita algo del mundo real, **pide permiso hacia arriba** mediante una syscall.

:::info Nota
ℹ️ Esta protección se llama *espacio de usuario* y *espacio del núcleo*. Es la razón por la que un programa que falla (segfault) no tira el sistema entero: el núcleo simplemente mata el proceso culpable.
:::

## 2. La frontera: La instrucción syscall

El punto exacto donde tu programa cruza al modo núcleo es la instrucción **`syscall`** (en sistemas x86-64 de Linux). Es la "puerta" controlada:

```nasm
mov rax, 1      ; qué servicio quiero: write
mov rdi, 1      ; argumento 1
mov rsi, mensaje
mov rdx, 13
syscall         ; cruzo la frontera y el núcleo hace el trabajo
```

- Antes de `syscall`, preparas `rax` (el **número de la operación**) y los registros de argumentos.
- Al ejecutar `syscall`, la CPU cambia a modo núcleo y salta al punto de entrada del sistema operativo.
- El núcleo valida tu petición, la ejecuta y **te devuelve el control** con el resultado en `rax`.

Tu programa no sabe *cómo* escribir en pantalla: solo le dice al núcleo "escribe estos 13 bytes en el archivo 1". El núcleo se encarga de la parte difícil y peligrosa.

:::warning Advertencia
⚠️ En x86-64 de Linux, la syscall moderna es `syscall`. La forma antigua usaba `int 0x80` (una interrupción) con **otros números de operación**. No mezcles ambas convenciones: `syscall` + números de 64 bits es lo correcto en este curso.
:::

## 3. ¿Qué es un número de syscall?

Cada servicio del núcleo tiene un **número único**, definido en una tabla interna. Los que usaremos con más frecuencia:

| Número | Nombre | Función |
|--------|--------|---------|
| `0` | `read` | Leer de un archivo o entrada |
| `1` | `write` | Escribir a un archivo o salida |
| `3` | `close` | Cerrar un archivo |
| `60` | `exit` | Terminar el proceso |
| `2` | `open` | Abrir un archivo |

En Linux, el número viaja en `rax` y los argumentos en `rdi`, `rsi`, `rdx`, `r10`, `r8`, `r9` (en ese orden). Observa que para syscalls, el cuarto argumento va en **`r10`**, no en `rcx` como en las llamadas a funciones de C.

```nasm
; write(rdi=archivo, rsi=dirección, rdx=longitud)
mov rax, 1
mov rdi, 1
mov rsi, mensaje
mov rdx, 13
syscall
```

- El número `1` en `rax` le dice al núcleo "quiero `write`".
- Los argumentos de esa syscall van en `rdi`, `rsi`, `rdx`.
- Cada syscall documenta qué significan sus argumentos.

## 4. El resultado y los errores

Cuando la syscall termina, el núcleo **devuelve el control y deja el resultado en `rax`**:

- **Éxito:** `rax` contiene un valor positivo (bytes escritos, descriptor abierto, etc.).
- **Error:** `rax` contiene un valor **negativo** cuyo valor absoluto es el código de error (`errno`).

```nasm
mov rax, 1
mov rdi, 1
mov rsi, mensaje
mov rdx, 13
syscall
test rax, rax      ; ¿el resultado es negativo?
js  hubo_error     ; si sí, hubo un error
```

- `test rax, rax`: activa la bandera de signo si `rax` es negativo.
- `js hubo_error`: salta si el resultado fue un error.
- El código de error se puede consultar (por ejemplo, `-2` es "no existe el archivo").

Saber detectar errores de syscall es lo que separa un programa frágil de uno robusto. Los capítulos de archivos te mostrarán cómo manejarlos en la práctica.

:::tip
💡 Códigos de error comunes que verás: `-2` (ENOENT, archivo no existe), `-13` (EACCES, permiso denegado), `-9` (EBADF, descriptor inválido). En C aparecen en la variable `errno`; en ensamblador, como negativos en `rax`.
:::

## 5. El flujo completo de una syscall

Unamos todo para ver la anatomía de una petición al sistema:

```text
Tu programa                  Núcleo
+------------------+        +-----------------------+
| mov rax, 1       |  →→→   | identifica: "write"    |
| mov rdi, 1       |        | valida la petición     |
| mov rsi, mensaje |        | escribe en el archivo  |
| mov rdx, 13      |        | devuelve: bytes o error|
| syscall          |  ←←←   +-----------------------+
| test rax, rax    |
| js  hubo_error   |
```

1. Preparas el número y los argumentos.
2. `syscall` cruza al modo núcleo.
3. El núcleo valida y ejecuta el servicio.
4. Vuelves a modo usuario con el resultado en `rax`.
5. Compruebas el resultado y sigues.

Este ciclo es el corazón de toda la interacción con el mundo: leer teclado, escribir pantalla, abrir archivos, crear procesos. Todo pasa por aquí.

## Resumen rápido

- El **modo usuario** tiene privilegios limitados; el **modo núcleo** controla el hardware.
- **`syscall`** es la puerta que cruza de un modo al otro.
- El número de servicio va en **`rax`** y los argumentos en `rdi`, `rsi`, `rdx`, `r10`...
- El resultado (o el error, negativo) regresa en **`rax`**.
- Un resultado negativo es un **error**: compruébalo con `test` + `js`.

Ya sabes pedir servicios al sistema. En el próximo capítulo pondremos esto a trabajar con las **syscalls de Linux**: escribir en pantalla y leer del teclado, los primeros pasos de programas interactivos.