---
outline: [2, 3]
---

# Instalación y configuración

Antes de empezar a programar en C, necesitamos preparar el entorno de trabajo. 

En este capítulo te guiaremos paso a paso en la instalación y configuración del compilador y del editor o IDE que elijas. La idea es que al finalizar este apartado tengas todo lo necesario para poder empezar a escribir código de C sin problemas. 

No te preocupes si nunca antes has instalado un compilador. Hemos diseñado esta guía para acompañarte en todo momento con explicaciones claras, comandos precisos y consejos prácticos.

## Requisitos previos

Antes de configurar tu entorno, es importante asegurar que cuentas con los elementos básicos. Piensa en esto como preparar tu mesa de trabajo antes de empezar a ensamblar un motor.

### Sistema operativo
C es el lenguaje de sistemas por excelencia y es totalmente multiplataforma. Puedes programar en Windows, Linux o macOS. Aunque el código fuente será el mismo, la forma de instalar las herramientas varía ligeramente entre sistemas, pero aquí cubriremos todas las opciones.

### Compilador
Como aprendimos en el capítulo anterior, el compilador traduce tus archivos `.c` en programas ejecutables. Para esta guía, nos enfocaremos en los estándares de la industria:

- **GCC (GNU Compiler Collection):** El más robusto y utilizado en el mundo.
- **Clang:** Moderno y con mensajes de error muy descriptivos.
- **MSVC (Microsoft Visual C++):** El estándar para desarrollo nativo en Windows.

### Variables de entorno
Para que puedas compilar desde cualquier lugar de tu computadora, el sistema operativo necesita conocer la ubicación del compilador. Esto se hace configurando la variable `PATH`. Así, solo tendrás que escribir `gcc` en tu terminal y el sistema sabrá exactamente qué herramienta ejecutar.

## Instalación del compilador

### Windows (MinGW-w64 vía MSYS2)
En Windows, la forma más profesional de obtener GCC es a través de **MSYS2**, que nos proporciona un entorno similar a Linux con herramientas actualizadas.

1. Descarga el instalador desde la [página oficial de MSYS2](https://www.msys2.org/).

2. Ejecuta el instalador y sigue los pasos. Se recomienda dejar la ruta por defecto (`C:\msys64`).

3. Al finalizar, asegúrate de marcar **Run MSYS2 now**. Se abrirá una terminal negra.
![Instalador de MSYS](/c/msys.png)

4. Para instalar el compilador de C y las herramientas de desarrollo, escribe el siguiente comando:
   ```bash
   pacman -S --needed base-devel mingw-w64-ucrt-x86_64-toolchain
   ```

5. Presiona Enter para confirmar la instalación de todos los paquetes.
![Instalador de MinGW](/cpp/introduccion/cpp-install-MSYS2-toolchain.png)

6. Cuando pregunte si deseas proceder con la instalación, escribe `Y` y presiona Enter.

7. Agregue la ruta de acceso de la carpeta MinGW-w64 a la variable de entorno de Windows mediante los pasos siguientes:

   1. Abre el menú de inicio y busca "Variables de entorno".

   2. Haz clic derecho en "Variables de entorno" y selecciona "Editar variables del sistema".

   3. En la ventana que se abre, busca la variable `PATH` y haz clic en "Editar".

   4. Haz clic en "Nuevo" y agrega la ruta de acceso de la carpeta MinGW-w64. Por ejemplo: `C:\msys64\ucrt64\bin`.

   5. Haz clic en "Aceptar" en todas las ventanas que se abrieron.

8. Verificación: Abre una nueva terminal (PowerShell o CMD) y escribe:
    ```bash
    gcc --version
    ```