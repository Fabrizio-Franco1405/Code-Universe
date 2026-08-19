---
outline: [2, 3]
---

# Preparando el entorno

En el capítulo anterior viste por qué el ensamblador es tan poderoso y qué esperar de esta travesía. Ahora es momento de poner manos a la obra: vamos a instalar el **ensamblador NASM** y el **enlazador** en tu máquina, y dejaremos listo tu editor para que escribir ensamblador sea cómodo.

Trabajaremos con herramientas de la familia GNU, así que en los ejemplos usaré Linux. Si usas Windows, te mostraré también el camino —más de uno funcionará con WSL, que es lo que recomiendo.

## 1. Instalando NASM

**NASM** (*Netwide Assembler*) es el ensamblador que usaremos en toda la guía. Para instalarlo:

- **Linux (Debian/Ubuntu):**

```bash
sudo apt install nasm
```

- **Linux (Arch):**

```bash
sudo pacman -S nasm
```

- **Windows con WSL:** instala WSL desde la terminal de Windows y luego ejecuta el comando de Ubuntu de arriba.

Verifica que todo quedó instalado correctamente:

```bash
nasm -v
```

```text
NASM version 2.16.01 compiled on ...
```

:::info Nota
ℹ️ Si `nasm -v` muestra una versión, el ensamblador está listo. Si el comando no se encuentra, es posible que la ruta del instalador no esté en tu `PATH`; en ese caso, cierra y vuelve a abrir la terminal.
:::

## 2. Instalando el enlazador

El ensamblador genera un archivo objeto, pero para convertirlo en ejecutable necesitas un **enlazador**. En Linux usaremos `ld`, que ya viene con el sistema. También instalaremos el compilador de C, porque lo necesitaremos más adelante para enlazar con funciones de la biblioteca estándar:

```bash
sudo apt install binutils gcc make
```

- `binutils`: proporciona `ld` (enlazador) y `objdump` (desensamblador).
- `gcc`: compilador de C, útil para combinar con ensamblador en capítulos futuros.
- `make`: automatiza la compilación de proyectos con múltiples archivos.

Comprueba ambos:

```bash
ld --version
make --version
```

## 3. Configurando el editor

Escribir ensamblador no exige un IDE especial, pero un buen editor con resaltado de sintaxis hace la diferencia. Usaremos **VS Code** con la extensión de NASM:

- Instala VS Code desde su sitio oficial.
- Abre la vista de extensiones y busca e instala **"nasm"** (la extensión de `Nasm Syntax Highlighting` proporciona colores para archivos `.asm`).

Una vez instalada, crea una carpeta de trabajo y dentro un archivo `hola.asm`. Con solo crear el archivo con extensión `.asm`, el resaltado debería activarse:

```text
proyectos/asm/
└── hola.asm
```

:::tip
💡 Configura que VS Code use **tabulaciones con ancho 8** para el ensamblador, que es la convención clásica: los mnemónicos, operandos y comentarios se alinean en columnas y el código queda mucho más legible.
:::

## 4. Una herramienta extra: `objdump`

Antes de terminar, presentamos a tu futuro mejor amigo: **`objdump`**, el desensamblador. Convierte un ejecutable o archivo objeto de vuelta a ensamblador. Es perfecto para comprobar qué generó el ensamblador o para leer el código de programas ya compilados:

```bash
objdump -d mi_programa
```

Aprenderás a usarlo a fondo en los capítulos de depuración, pero desde ya tenlo presente: verás que lo usamos más de una vez.

:::warning Advertencia
⚠️ En Windows nativo (sin WSL) el proceso es más engorroso: necesitas NASM en modo `win64`, un enlazador como el de MinGW y las llamadas al sistema de Windows, que difieren mucho de las de Linux. Si puedes, usa WSL: todos los ejemplos de esta guía están pensados para el mundo Linux.
:::

## Resumen rápido

- **NASM** es el ensamblador que usaremos; instálalo con el gestor de paquetes de tu sistema.
- El **enlazador** (`ld`), **gcc** y **make** completan el flujo de trabajo.
- **VS Code** con la extensión de NASM te da resaltado de sintaxis cómodo.
- **`objdump`** desensambla ejecutables y será tu aliado en la depuración.

Con el entorno listo, es hora de escribir tu primer programa en ensamblador: un clásico "Hola, mundo" que se comunica directamente con el sistema operativo.