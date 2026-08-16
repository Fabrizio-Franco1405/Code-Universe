---
outline: [2, 3]
---

# Compilación con CMake

En esta sección aprenderás a dar el salto de compilar programas con comandos sueltos a utilizar CMake, una herramienta que genera automáticamente los scripts de compilación para tu proyecto. CMake no es un compilador: Es un orquestador que se encarga de preparar todo para que el compilador haga su trabajo, permitiéndote:

- Organizar tu código en proyectos claros y escalables.
- Evitar escribir comandos largos y repetitivos.
- Compilar en diferentes sistemas operativos sin cambiar tu código.

Al finalizar esta página, sabrás:

- Crear un archivo CMakeLists.txt mínimo.
- Generar y compilar tu programa paso a paso.
- Aplicar buenas prácticas para que tu flujo de trabajo sea limpio y sin frustraciones.

Prepárate para que tu primer proyecto en C++ tenga una base profesional desde el inicio.

## Introducción a CMake

CMake es posiblemente una de las herramientas más utilizadas e importantes para el desarrollo de software con C++ y de hecho es bastante probable que navegando por las profundidades de **GitHub** te hayas encontrado con archivos que tengan este nombre y te hayas preguntado "¿Qué es esto?", pues a continuación verás que es y cómo funciona.

### ¿Qué es CMake?

CMake es una herramienta multiplataforma de generación o automatización de código. El nombre es una abreviatura para "Cross Platform Make" (Make multiplataforma), más allá del uso de "Make" en el nombre, CMake es una suite separada y de más alto nivel que el sistema make común de Unix, siendo similar a las Autotools. 

Es una familia de herramientas diseñada para construir, probar y empaquetar software. CMake se utiliza para controlar el proceso de compilación del software usando ficheros de configuración sencillos e independientes de la plataforma.

Genera Makefiles nativos y espacios de trabajo que pueden usarse en el entorno de desarrollo deseado. Es comparable al GNU build system de Unix en que el proceso es controlado por ficheros de configuración, en el caso de CMake llamados CMakeLists.txt.

Al contrario que el GNU build system, que está restringido a plataformas Unix, CMake soporta la generación de ficheros para varios sistemas operativos, lo que facilita el mantenimiento y elimina la necesidad de tener varios conjuntos de ficheros para cada plataforma.

### Ventajas frente a compilar manualmente con `g++` o `clang++`

- Escalabilidad: cuando tu proyecto crece (múltiples archivos, librerías, pruebas), mantener comandos manuales se vuelve frágil.

- Repetibilidad: Defines una vez, compilas igual en cualquier máquina/OS.

- Integración: Fácil de conectar librerías externas, tests, instaladores.

### Relación con proyectos grandes y multiplataforma

En equipos y proyectos serios, CMake permite:

- Un único descriptor del proyecto para Linux, Windows y macOS.

- Targets bien definidos: Ejecutables y librerías con sus dependencias.

- Perfiles de build: Debug/Release y flags consistentes.

## Instalación y verificación
### Windows
### Linux

Próximamente...

### macOS

Próximamente...

## Conceptos clave antes de usarlo

Antes de escribir tu primer CMakeLists.txt, conviene entender algunos fundamentos que te ahorrarán frustraciones y te permitirán aprovechar CMake de forma ordenada y escalable. Estos conceptos son la base sobre la que se construyen proyectos pequeños y grandes, y conocerlos desde el inicio te ayudará a:

- Mantener tu código y tu configuración limpios y fáciles de mantener.

- Evitar errores comunes que surgen por desconocer cómo CMake organiza y procesa la información.

- Adaptar tu proyecto a distintos entornos sin rehacer todo desde cero.

A continuación, veremos los elementos esenciales que todo usuario de CMake debería dominar, desde la estructura de los ficheros de configuración hasta la separación entre directorios de código y de compilación, pasando por variables, comandos y buenas prácticas.

### Directorio fuente vs directorio de compilación

En CMake, el directorio fuente (source directory) y el directorio de compilación (build directory) cumplen funciones muy distintas, y separarlos es una de las mejores prácticas que puedes adoptar desde el primer día.

- **Directorio fuente:** Es donde vive tu código y tus archivos de configuración (CMakeLists.txt, .cpp, .h, recursos, etc.). Este directorio debe permanecer limpio, sin archivos generados automáticamente por el proceso de compilación.

- **Directorio de compilación:** Es la carpeta donde CMake genera todos los archivos intermedios y finales necesarios para construir tu proyecto: Makefiles, proyectos de Visual Studio, binarios, librerías, etc. Aquí es donde realmente “ocurre” la compilación.

Separar ambos directorios tiene ventajas claras:

- Mantienes tu código fuente libre de archivos temporales.

- Puedes tener varias configuraciones de compilación al mismo tiempo (por ejemplo, build-debug y build-release).

- Es más fácil limpiar y regenerar la compilación: Basta con borrar la carpeta build/ sin tocar el código.

**Ejemplo de estructura recomendada:**

```
mi_proyecto/
├── CMakeLists.txt
├── src/
│   └── main.cpp
├── include/
└── build/
```

### Variables y comandos básicos

En CMake, las variables y los comandos son el lenguaje con el que describes cómo debe construirse tu proyecto. Entender su sintaxis y comportamiento es clave para evitar errores y escribir configuraciones limpias y reutilizables.

**Variables**

**Definición:** Estas se crean con el comando `set` y se referencian con `${NOMBRE}`.

**Tipos:**

- **Normales:** Guardan valores simples (texto, rutas, números).
```CMake
set(MI_VARIABLE "Hola mundo")
message(${MI_VARIABLE})  # Imprime: Hola mundo
```

- **Cache:** Persisten entre ejecuciones de CMake y se usan para opciones de configuración.
```CMake
set(MODO_DEBUG ON CACHE BOOL "Compilar en modo debug")
```

- **De entorno:** Variables del sistema operativo, accesibles con `$ENV{NOMBRE}`.
```CMake
message($ENV{PATH})
```

**Buenas prácticas:**

- Usa nombres descriptivos y en mayúsculas para variables globales.

- Prefiere variables de caché para opciones que el usuario pueda cambiar sin editar CMakeLists.txt.

- No abuses de variables globales; considera el alcance (scope) de cada una.

**Comandos básicos**

Los comandos son instrucciones que CMake ejecuta al configurar el proyecto. Algunos esenciales:

|         Comando          |                       Uso                       | Ejemplo  |
| :--------------------    | :-----------                                    | :----    |
| `cmake_minimum_required` | Define la versión mínima de CMake necesaria.    | `cmake_minimum_required(VERSION 3.16)`  |
| `project`                | Declara el nombre y lenguaje(s) del proyecto.   | `project(MiApp LANGUAGES CXX)`            |
| `add_executable`         | Crea un ejecutable a partir de archivos fuente. | `add_executable(mi_app main.cpp)`            |
| `add_library`            | Crea una librería estática o compartida.        | `add_library(milib STATIC lib.cpp)`        |
| `target_link_libraries`  | Enlaza librerías a un ejecutable o librería.    | `target_link_libraries(mi_app milib)`  |
| `message`                | Muestra mensajes en la salida de CMake.         | `message(STATUS "Compilando en modo debug")` |

## Estructura mínima de un proyecto

El CMakeLists.txt es el corazón de cualquier proyecto gestionado con CMake. En él defines qué es tu proyecto, qué necesita para compilarse y cómo debe construirse. Piensa en este archivo como el “guion maestro” que CMake leerá para generar todos los pasos y configuraciones necesarias, adaptándolos al sistema operativo y compilador que uses.

Un buen CMakeLists.txt no solo compila tu código, sino que también:

- Organiza el proyecto en módulos y subdirectorios.

- Declara ejecutables y librerías con sus dependencias.

- Configura opciones de compilación y perfiles (Debug, Release, etc.).

- Integra pruebas, instalación y empaquetado.

En proyectos grandes, este archivo suele dividirse en varios CMakeLists.txt (uno por subdirectorio) para mantener la claridad y modularidad, enlazados mediante `add_subdirectory()`. 

**Ejemplo mínimo:**

```cmake
cmake_minimum_required(VERSION 3.16)
project(mi_app LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(mi_app src/main.cpp)
```

**Explicación:**

- `cmake_minimum_required(VERSION 3.16)`: Define la versión mínima de CMake requerida para el proyecto.

- `project(mi_app LANGUAGES CXX)`: Define el nombre del proyecto y especifica que se utilizará C++ como lenguaje.

- `set(CMAKE_CXX_STANDARD 17)`: Define el estándar de C++ a utilizar (C++17 en este caso).

- `set(CMAKE_CXX_STANDARD_REQUIRED ON)`: Indica que el estándar de C++ es requerido.

- `add_executable(mi_app src/main.cpp)`: Define un ejecutable llamado "mi_app" que se compilará con el archivo "src/main.cpp".


## Proceso de compilación

Una vez que tienes tu proyecto organizado y tu CMakeLists.txt listo, el siguiente paso es **configurar** y **compilar** el código. En CMake, este proceso se divide en dos fases:

1. **Configuración (configure):** CMake lee tu CMakeLists.txt y genera los archivos necesarios para que el compilador y la herramienta de construcción (Make, Ninja, MSBuild, etc.) sepan qué hacer.

2. **Construcción (build):** Se ejecuta la herramienta de construcción para compilar el código y producir el ejecutable o librería.

### 1. Crear el directorio de compilación

Al momento de trabajar es necesario hacerlo desde fuera del directorio fuente ya que esto es una buena práctica. Desde la raíz de tu proyecto: 

```bash
mkdir build
cd build
```

- `mkdir`: Crea un nuevo directorio.
- `cd`: Cambia el directorio actual.

:::info
ℹ️ Los comandos `mkdir` y `cd` son comandos de **Unix** por lo que es recomendable que investigues un poco acerca de esto para que puedas moverte por la terminal como todo un profesional.
:::

### 2. Configurar el proyecto con CMake

Una vez creada hayas creado la carpeta `build` deberás moverte dentro de ella y ejecutar:

```bash
cmake ..
```

- `cmake`: Es el comando que llama al driver cmake para su posterior uso.
- `..`: Indica a CMake que busque el CMakeLists.txt en el directorio padre (la raíz del proyecto).

Aquí CMake detecta tu compilador, sistema operativo y genera los archivos de construcción apropiados (Makefiles, proyectos de Visual Studio, etc.).

:::tip
💡 Si quieres especificar el tipo de compilación (en generadores de una sola configuración como Make o Ninja), puedes hacerlo así:

```bash
cmake .. -DCMAKE_BUILD_TYPE=Debug
```
o

```bash
cmake .. -DCMAKE_BUILD_TYPE=Release
```
:::

### 3. Compilar el proyecto

Una vez configurado el proyecto, puedes compilarlo ejecutando:

```bash
cmake --build .
```

- `--build`: Le dice a CMake que debe construir el proyecto.
- `.`: Indica a CMake que busque los archivos de construcción en el directorio actual y los compile.

En generadores multi-configuración (Visual Studio, Xcode), especifica la configuración:
```bash
cmake --build . --config Release
```

### 4. Ejecutar el programa

Cuando la compilación esté terminada el ejecutable estará en:

- **Make/Ninja:** Directamente en `build/`
```bash
./mi_app
```

- **Visual Studio/Xcode:** Dentro de una subcarpeta como `Debug/` o `Release/`
```PowerShell
.\Debug\mi_app.exe
```

**Resumen visual del flujo explicado:**

```
mi_proyecto/
├── CMakeLists.txt
├── src/
│   └── main.cpp
└── build/           ← aquí trabajamos
    ├── Makefile / proyecto generado
    └── mi_app (ejecutable)
```

1. `mkdir build && cd build`

2. `cmake ..`

3. `cmake --build .`

4. Ejecutar el binario

## Buenas prácticas

Adoptar buenas prácticas desde el inicio te ahorrará tiempo, frustraciones y problemas de mantenimiento a medida que tu proyecto crezca. Estas recomendaciones son válidas tanto para proyectos pequeños como para desarrollos profesionales de gran escala.

### 1. Usa siempre compilación fuera del directorio fuente (out-of-source build)

- Mantén tu carpeta de código (src/, include/, etc.) libre de archivos generados.
- Crea una carpeta build/ (o varias, como build-debug/, build-release/) para cada configuración.
- Esto facilita limpiar la compilación: basta con borrar la carpeta build/.

### 2. Fija el estándar de C++ en tu CMakeLists.txt

Define explícitamente el estándar que usarás:
```CMake
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
```

Así evitarás diferencias entre compiladores y entornos.

### 3. Nombra tus targets de forma clara y consistente

- Usa nombres descriptivos para ejecutables y librerías.
- Evita abreviaturas confusas o genéricas como `app` o `test`.

### 4. Prefiere propiedades por target en lugar de variables globales

En vez de modificar CMAKE_CXX_FLAGS globalmente, usa:
```CMake
target_compile_features(mi_app PUBLIC cxx_std_20)
target_include_directories(mi_app PRIVATE include)
```

Esto mantiene cada target aislado y fácil de mantener.

### 5. Documenta opciones y variables de configuración

Si defines opciones personalizadas, añade una descripción clara:
```CMake
option(MI_APP_USA_LOG "Habilita el sistema de logs" ON)
```

Esto ayuda a otros desarrolladores (o a ti mismo en el futuro) a entender qué hace cada opción.

### 6. Usa `find_package` y targets importados para dependencias externas

- Evita rutas absolutas o hardcodeadas.
- Prefiere:
```CMake
find_package(fmt REQUIRED)
target_link_libraries(mi_app PRIVATE fmt::fmt)
```

### 7. Mantén el CMakeLists.txt limpio y modular

- Divide en varios CMakeLists.txt si el proyecto crece.
- Usa `add_subdirectory()` para organizar módulos o componentes.

### 8. Integra pruebas y empaquetado desde el inicio

- Activa el sistema de pruebas:
```CMake
enable_testing()
add_test(NAME mi_test COMMAND mi_app)
```

- Activa el empaquetado:
```CMake
enable_testing()
```

- Considera usar `CPack` para generar instaladores o paquetes.

:::tip
💡 **Recuerda:** Un CMakeLists.txt bien estructurado y limpio no solo compila tu código, también comunica a otros desarrolladores cómo está organizado tu proyecto y qué esperar de él.
:::

## Errores comunes

Incluso con una buena estructura y siguiendo las prácticas recomendadas, es fácil cometer errores al empezar con CMake. Aquí tienes los más habituales y cómo evitarlos:

### 1. Generar dentro del directorio fuente

- **Problema:** Archivos temporales y binarios mezclados con el código.

- **Consecuencia:** Dificulta limpiar el proyecto y puede provocar conflictos.

- **Solución:** Usa siempre un directorio `build/` separado (out-of-source build).

### 2. Reutilizar la misma carpeta `build/` con generadores distintos
- **Problema:** Cambiar de Makefiles a Ninja o Visual Studio en la misma carpeta genera conflictos.

- **Solución:** Borra la carpeta `build/` y vuelve a configurar desde cero.

### 3. No especificar el estándar de C++
- **Problema:** El compilador puede usar un estándar por defecto distinto al esperado.

- **Solución:** Define siempre en tu `CMakeLists.txt`:

```CMake
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
```

### 4. Olvidar `CMAKE_BUILD_TYPE` en generadores de una sola configuración

- **Problema:** Compilas sin optimización o sin símbolos de depuración.

- **Solución:** Indica explícitamente:
```bash
cmake .. -DCMAKE_BUILD_TYPE=Release
```
o
```bash
cmake .. -DCMAKE_BUILD_TYPE=Debug
```

### 5. Usar rutas absolutas hardcodeadas

- **Problema:** El proyecto deja de ser portable.

- **Solución:** Usa variables de CMake como `${CMAKE_SOURCE_DIR}` o `${CMAKE_CURRENT_SOURCE_DIR}`.

### 6. No limpiar la caché de CMake al cambiar configuraciones importantes

- **Problema:** Cambios en opciones o rutas no se aplican.

- **Solución:** Borra la carpeta `build/` o ejecuta:
```bash
cmake --fresh ..
```

### 7. No marcar dependencias como REQUIRED en find_package

- **Problema:** CMake continúa sin avisar si no encuentra la librería.

- **Solución:** Marca las dependencias como OPTIONAL si no son esenciales:
```CMake
find_package(fmt REQUIRED)
```

### 8. Confundir CMake con Make

- **Problema:** Pensar que CMake compila el código directamente.

- **Solución:** Recordar que CMake **genera** los scripts/proyectos y luego la herramienta de construcción (Make, Ninja, MSBuild…) es la que compila.

## Próximos pasos

Ahora que dominas la configuración básica de CMake y conoces los errores más comunes, estás listo para dar el siguiente salto. Aquí tienes un camino sugerido para seguir creciendo:

**1. Añadir múltiples archivos fuente y carpetas**

- Aprende a organizar tu código en subdirectorios y usar `add_subdirectory()` para mantener el proyecto limpio y escalable.

**2. Integrar librerías externas**

- Experimenta con `find_package()` y `FetchContent` para traer dependencias sin complicar la instalación.

**3. Configurar opciones y flags personalizados**

- Usa `option()` para activar/desactivar características y `target_compile_options()` para ajustar el compilador a tus necesidades.

**4. Crear configuraciones multiplataforma**

- Asegúrate de que tu proyecto compile en Windows, Linux y macOS, aprovechando variables y condiciones de CMake.

**5. Automatizar pruebas**

- Integra CTest y `add_test()` para validar tu código de forma continua.

**6. Optimizar la experiencia del usuario final**

- Prepara scripts de instalación (install()) y empaquetado (cpack) para distribuir tu aplicación fácilmente.

:::tip
💡 **Siguiente meta:** Toma un proyecto pequeño que ya tengas y migra su configuración a CMake siguiendo estas prácticas. No busques la perfección en el primer intento, la clave es iterar, probar y aprender.
:::