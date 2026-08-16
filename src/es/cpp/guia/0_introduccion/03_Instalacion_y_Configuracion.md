---
outline: [2, 3]
---

# Instalación y configuración

Antes de empezar a programar en C++, necesitamos preparar el entorno de trabajo.  

En este capítulo te guiaremos paso a paso en la instalación y configuración del compilador y del editor o IDE de que elijas. La idea es que al finalizar este apartado tengas todo lo necesario para poder empezar a escribir código de C++ sin problemas.  

No te preocupes si nunca antes has instalado un compilador o configurado un entorno. Hemos preparado esta guía para acompañarte en todo momento, con explicaciones claras, capturas de pantalla y consejos prácticos.  

## Requisitos previos

Antes de instalar y configurar tu entorno de C++, es importante asegurarnos de que cuentas con algunos elementos básicos. Debes pensar en esto como preparar tu caja de herramientas antes de empezar a construir.

###  Sistema operativo

C++ es un lenguaje multiplataforma, por lo que puedes programar en Windows, Linux o MacOS. La única variente entre sistemas es el **compilador** y la forma en que configuramos el entorno de desarrollo, pero acá igualmente te enseñaremos a configurarlos todos.

###  Compilador

Como ya hemos hablado el capítulo anterior, el compilador es el encargado de covertir nuestras instrucciones a una lengua que la computadora pueda entender, pero existen muchos compiladores para C++, algunos desarrallado por la comunidad y otros por empresas grandes como Microsoft, Apple, AMD, Intel o Nvidia por nombrar algunas. 

En esta guía estaremos utilizando los compiladores que ya fueron explicados con anterioridad, siendo estos:

- **GCC (GNU Compiler Collection).**
- **Clang.**
- **MSVC (Microsoft Visual C++).**

###  Variables de entorno

Cuando instalas un compilador, tu sistema necesita “saber” dónde encontrarlo.  
Esto se logra configurando las **variables de entorno** (por ejemplo, la variable `PATH`).  
De esta manera, podrás compilar programas desde cualquier terminal sin importar en qué carpeta estés trabajando.

## Instalación del compilador

Depenediendo del sistema operativo estaremos utilizando diferentes compiladores, cabe destacar que no estás atado a ninguno por lo que puedes instalar el que más te parezca interesante, pero si no entiendes mucho del tema te recomendamos que utilices los compiladores que estaremos usando en esta guía.

### Windows (MinGW / MSVC)

En Windows estaremos utilizando la cadena de herramientas **MinGW** que es un paquete de herramientas que incluye el compilador GCC.

1. Descarga el instalador desde la página de MSYS2 o usa este [enlace directo al instalador](https://www.msys2.org/).

2. Ejecuta el instalador y sigue los pasos del asistente. Ten en cuenta que MSYS2 requiere Windows 8.1 de 64 bits o posterior.

3. Elige la carpeta de instalación deseada. En la mayoría de los casos, el directorio recomendado es aceptable.

   Asegúrate de que la casilla **Ejecutar MSYS2 ahora** esté marcada y selecciona **Finalizar**.

4. En la terminal que se abre, instala la cadena de herramientas MinGW-w64 con el comando:

   ```Shell
   pacman -S --needed base-devel mingw-w64-ucrt-x86_64-toolchain

5. Una vez aparezca la lista de paquetes para instalar puedes presionar `Enter` para instalarlos todos (Recomendable si estás aprendiendo) o seleccionar los paquetes que desees instalar individualmente si eres experimentado.
![Instalador de MinGW](/cpp/introduccion/cpp-install-MSYS2-toolchain.png)

6. Introduzca `Y` cuando se le pregunte para continuar con la instalación.

7. Agregue la ruta de acceso de la carpeta MinGW-w64 a la variable de entorno de Windows mediante los pasos siguientes:

   1. Abre el menú de inicio y busca "Variables de entorno".

   2. Haz clic derecho en "Variables de entorno" y selecciona "Editar variables del sistema".

   3. En la ventana que se abre, busca la variable `PATH` y haz clic en "Editar".

   4. Haz clic en "Nuevo" y agrega la ruta de acceso de la carpeta MinGW-w64. Por ejemplo: `C:\msys64\ucrt64\bin`.

   5. Haz clic en "Aceptar" en todas las ventanas que se abrieron.

9. Por último debe verificar que las herramientas MinGW-w64 se han instalado correctamente, abra un símbolo del sistema y escriba:

   ```Bash
   gcc --version
   g++ --version
   gdb --version
   ```

### Linux (GCC / Clang)

Próximamente...

### MacOS (Clang / Homebrew)

Próximamente...

## Configuración con diferentes entornos

En este punto ya tienes instalado tu compilador y todo lo necesario para trabajar con C++. Pero surge una pregunta clave: **¿dónde vas a escribir tu código?**

Para eso necesitas un **editor de texto** o, si prefieres algo más completo, un **IDE (Entorno de Desarrollo Integrado)**. 

Ambos cumplen la misma función: Ayudarte a escribir, compilar y ejecutar tus programas. La diferencia es que un editor como **VS Code** es más ligero y flexible, mientras que un IDE como **Visual Studio** o **CLion** trae más herramientas listas para proyectos grandes.

El utilizar uno u otro dependerá mucho de tus necesidades y preferencias. Si estás aprendiendo, te recomendamos que uses **VS Code** ya que es gratuito, ligero y tiene una gran comunidad que puede ayudarte en caso de que tengas alguna duda.

### Usando VS Code

Visual Studio Code es un editor moderno, muy usado por principiantes y profesionales gracias a su sencillez y la enorme cantidad de extensiones disponibles. Con unos pocos pasos, lo convertirás en un entorno perfecto para programar en C++.

#### Instalación de extensiones

Lo primero es instalar las extensiones necesarias para trabajar con C++. Desde la pestaña de **Extensiones** (icono de cuatro cuadritos en la barra lateral o con `Ctrl+Shift+X`), busca e instala:

![Instalador de MinGW](/cpp/introduccion/cpp-extension.png)

- **C/C++ (Microsoft):** Soporte para IntelliSense, depuración y resaltado de sintaxis.  
- *(Opcional)* **C/C++ Extension Pack:** Incluye depuración avanzada y herramientas adicionales.  


#### Configuración del compilador

1. Para configurar el compilador dentro del Editor es necesario ejecutar la combinación de teclas `Ctrl+Shift+P` y escribir `C/C++: Edit Configurations (UI)`

![Configuración de VS Code](/cpp/introduccion/cpp-edit-configuration-ui.png)

2. Acá se desplegarán la lista de compiladores que tienes instalados, en este caso debes buscar el `g++` que viene por defecto con MinGW.

![Configuración de VS Code](/cpp/introduccion/cpp-ruta-compilador.png)

### Usando Visual Studio
Visual Studio es un **IDE (Entorno de Desarrollo Integrado)** creado por Microsoft.  
A diferencia de un editor ligero como VS Code, aquí tienes todo listo desde el inicio: editor, compilador, depurador y muchas herramientas extra para proyectos grandes.

#### Descarga e instalación

1. Ve a la página oficial de [Visual Studio](https://visualstudio.microsoft.com/es/).  

2. Descarga la edición **Community** (es gratuita y más que suficiente para aprender).  

3. Durante la instalación, selecciona la carga de trabajo **"Desarrollo de escritorio con C++"**. Esto instalará el compilador MSVC, el depurador y las librerías necesarias.
![Instalador de Visual Studio](/cpp/introduccion/cpp-install-visual-studio.png)

::: tip
💡 Si marcas solo lo necesario (C++), evitas instalar herramientas extra que ocupan mucho espacio.
:::

::: info
ℹ️ Visual Studio es muy completo y potente, ideal para proyectos grandes.  
Sin embargo, si apenas estás comenzando, puede sentirse abrumador y pesado.  
En ese caso, quizás prefieras empezar con **VS Code** y luego dar el salto a Visual Studio cuando tengas más experiencia.
:::

#### Crear un proyecto de C++

1. Abre Visual Studio. 

2. Selecciona **Crear un nuevo proyecto**.
![Nuevo_Proyecto](/cpp/introduccion/cpp-new-project.png)

3. Elige **Aplicación de consola en C++** y haz clic en **Siguiente**.
![Nuevo_Proyecto](/cpp/introduccion/cpp-console-app.png)

4. Ponle un nombre y una ubicación a tu proyecto.
![Crear-Proyecto](/cpp/introduccion/cpp-save-project.png)
5. Haz clic en **Crear**.  

Automáticamente tendrás un proyecto con un archivo `main.cpp` listo para modificar.

#### Opciones de compilación y depuración

- Para compilar tu programa, haz clic en **Iniciar sin depuración** (`Ctrl+F5`).  
- Para ejecutarlo paso a paso y analizar su comportamiento, usa **Iniciar con depuración** (`F5`).  
- Puedes establecer **puntos de interrupción** (breakpoints) haciendo clic en el margen izquierdo del editor.  
- En la parte inferior verás la **ventana de salida**, donde aparecen los resultados de la compilación y la ejecución.  

🎉 Con esto ya tienes un entorno completo y profesional para trabajar con C++.  

### Usando CLion

CLion es un **IDE especializado en C/C++** desarrollado por JetBrains.  
Está diseñado para ofrecer un entorno listo para programar con compilador, depuración y atajos inteligentes sin necesidad de configuraciones complicadas.  

#### Instalación y activación

1. Descarga CLion desde la página oficial de [JetBrains](https://www.jetbrains.com/clion/).  
2. Instálalo en tu sistema siguiendo los pasos del asistente.  
3. Al iniciar, activa tu licencia con una cuenta de JetBrains:
   - Versión de prueba gratuita de 30 días.
   - Licencia educativa gratuita para estudiantes con correo académico.
   - Licencencia de uso no comercial (suficiente si de momento quieres aprender)
   ![Licencia](/cpp/introduccion/cpp-jetbrains-license.png)

#### Crear un proyecto de C++

1. Abre CLion y selecciona **New Project**, esto te abrirá una ventana donde puedes seleccionar el tipo de proyecto que deseas crear, en este caso un ejecutable de consola y también podrás seleccionar la versión con la que quieres trabajar.  
![Nuevo_Proyecto](/cpp/introduccion/cpp-new-project-clion.png)

::: tip
💡 En el ejemplo estamos usando C++ 20 aunque tu puedes elegir la que quieras, más adelante explicaremos más acerca de las versiones de C++
:::

2. CLion generará automáticamente un archivo `main.cpp` con un programa base.  

#### Compilar y ejecutar

- Para compilar y ejecutar, haz clic en el botón verde ▶ en la parte superior derecha o presione la combinación de teclas `Shift + F10`. 
- CLion compilará tu código y abrirá una ventana de consola donde verás el resultado.  
- Si quieres depurarlo, simplemente selecciona el ícono de 🐞 en lugar del ▶ o puedes simplemente puedes presionar la combinación de teclas `Shift + F9`.