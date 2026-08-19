---
outline: [2, 3]
---

# Preparando el entorno

En el capítulo anterior viste por qué el ensamblador es tan poderoso y qué esperar de esta travesía. Ahora es momento de poner manos a la obra: vamos a instalar el **ensamblador NASM** y el **enlazador** en tu máquina, y dejaremos listo tu editor para que escribir ensamblador sea cómodo.

Esta guía usa **NASM** y las herramientas de la familia GNU, así que la mayoría de los ejemplos corren en **Linux** (o en **WSL** si estás en Windows). Si trabajas en Windows nativo no te quedas fuera: en la sección 3 verás el camino con **MASM**, el ensamblador de Microsoft.

:::info Nota sobre macOS
ℹ️ ¿Y macOS? El ensamblador que aprendemos aquí es **x86-64**, y los Mac modernos usan procesadores **Apple Silicon (ARM64)**, un conjunto de instrucciones completamente distinto. Por eso esta guía se centra en Linux y Windows, donde x86-64 es el estándar.
:::

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

## 3. En Windows: MASM y Visual Studio

Si trabajas en Windows y prefieres **no usar WSL**, tienes un camino nativo con el ensamblador oficial de Microsoft: **MASM** (*Microsoft Macro Assembler*). MASM viene incluido en Visual Studio, así que instalar el IDE te da el ensamblador (`ml64.exe`), el enlazador (`link`) y un entorno completo, sin tocar la terminal de Linux.

### Instalar Visual Studio 2026

1. Descarga **Visual Studio Community** (es gratuito y más que suficiente para aprender) desde [Visual Studio 2026](https://visualstudio.microsoft.com/es/).

2. Ejecuta el instalador. En la pantalla inicial del **Instalador de Visual Studio** se eligen las cargas de trabajo:

![Componentes de C++ en el instalador](/asm/introduccion/asm-install-cpp-components-vc2026.png)

3. Selecciona la carga de trabajo **"Desarrollo de escritorio con C++"**. Su componente **"Herramientas de MSVC"** es el que instala el ensamblador MASM (`ml64.exe`):

![Instalador de Visual Studio](/asm/introduccion/asm-install-vc2026.png)

:::tip
💡 Si marcas solo lo necesario (C++), evitas instalar herramientas extra que ocupan mucho espacio.
:::

### Verificar que MASM quedó instalado

1. Abre el menú Inicio y busca **"Developer PowerShell for VS 2026"** (o **"x64 Native Tools Command Prompt"**). Esta consola prepara automáticamente las variables de entorno de las herramientas de C++.

2. Escribe:

```text
ml64 /?
```

Si aparece la ayuda del ensamblador, todo está listo. MASM quedó instalado como `ml64.exe` (el ensamblador de 64 bits) en una ruta como:

```text
C:\Program Files\Microsoft Visual Studio\2026\Community\VC\Tools\MSVC\<versión>\bin\Hostx64\x64\ml64.exe
```

### ¿NASM o MASM?

- **NASM** es el estándar del mundo GNU/Linux, multiplataforma, y el que usan la mayoría de los ejemplos de esta guía.
- **MASM** es el ensamblador de Microsoft, ideal para Windows nativo: se integra con Visual Studio, el depurador y las herramientas de Windows.
- La **sintaxis** de ambos difiere (directivas, secciones y detalles), pero la **arquitectura** que estás aprendiendo —registros, pila, direccionamiento— es idéntica. En el próximo capítulo verás el mismo "Hola, mundo" en MASM para que compares.

## 4. Configurando el editor

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

## 5. Una herramienta extra: `objdump`

Antes de terminar, presentamos a tu futuro mejor amigo: **`objdump`**, el desensamblador. Convierte un ejecutable o archivo objeto de vuelta a ensamblador. Es perfecto para comprobar qué generó el ensamblador o para leer el código de programas ya compilados:

```bash
objdump -d mi_programa
```

Aprenderás a usarlo a fondo en los capítulos de depuración, pero desde ya tenlo presente: verás que lo usamos más de una vez.

:::warning Advertencia
⚠️ Los ejemplos de esta guía están pensados para **NASM en Linux/WSL**. Si usas Windows nativo, la ruta recomendada es **MASM** (sección 3) o NASM en modo `win64` con las funciones de las DLL de Windows: la sección 5 del próximo capítulo y el capítulo de Windows muestran las diferencias.
:::

## Resumen rápido

- **NASM** es el ensamblador que usaremos; instálalo con el gestor de paquetes de tu sistema.
- En **Windows nativo**, **MASM** (incluido en Visual Studio) es la alternativa al flujo GNU/Linux.
- El **enlazador** (`ld`), **gcc** y **make** completan el flujo de trabajo.
- **VS Code** con la extensión de NASM te da resaltado de sintaxis cómodo.
- **`objdump`** desensambla ejecutables y será tu aliado en la depuración.

Con el entorno listo, es hora de escribir tu primer programa en ensamblador: un clásico "Hola, mundo" que se comunica directamente con el sistema operativo.