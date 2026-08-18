---
outline: [2, 3]
---

# Gestores de paquetes

Hace unos años, añadir una librería a tu proyecto C++ era un ritual digno de una
película de Indiana Jones: **buscar un `.zip` en internet, descomprimirlo, compilarlo
a mano** con los flags correctos y luego enlazar los binarios resultantes. Y si
cambiabas de sistema operativo... empezaba de nuevo la aventura, con nuevas trampas
a cada paso.

Los **gestores de paquetes** modernos eliminaron ese caos: descargan la librería, la
compilan con tu propio compilador y la exponen a tu build system de forma automática
y reproducible. En este capítulo aprenderás los dos grandes del ecosistema C++:
**vcpkg** (Microsoft) y **Conan** (comunidad).

## 1. El problema que resuelven

Para entender por qué existen los gestores de paquetes, primero hay que sentir el
dolor que curan. Imagina que necesitas la librería `fmt` (formateo moderno de
texto). Sin gestor de paquetes, el proceso es una serie de pasos manuales, cada uno
con sus propias posibilidades de fallar:

1. Descargas el `.zip` del repositorio.
2. Ejecutas `cmake`, `make` o `msbuild` sobre la librería.
3. Copias headers y binarios a una ubicación.
4. Configuras tu proyecto para encontrar esas rutas.

Cada paso puede fallar de forma distinta según tu SO, compilador o versión. Y
cualquier otra persona que quiera compilar tu proyecto debe repetir el ritual
completo. Si algo falla en tu máquina, imagínate en la de tu compañera de equipo.

Con un gestor de paquetes, la experiencia es:

```
declarar la dependencia  →  una línea de comando  →  lista para usar
```

::: info Nota
ℹ️ **Concepto clave:** el gestor de paquetes trabaja de la mano con tu build
system. Tú declaras la dependencia y su versión; él se encarga de todo lo demás.
:::

## 2. ¿Cómo lo consiguen?

Acá está la magia, y no es poca. El gestor **compila la librería con tu mismo
compilador y plataforma**, y le entrega a CMake las rutas de headers y binarios
mediante un *toolchain file* o un generador de CMake.

```
vcpkg/Conan
    │
    ├── descarga el código fuente de la librería
    ├── la compila con TU compilador (g++, clang, MSVC)
    └── entrega headers + binarios a CMake (find_package)
```

Eso evita el clásico error de *"binario compilado con otro compilador"* que daba
pesadillas a los programadores de antaño. Un binario compilado con MSVC puede no
funcionar con tu código compilado con MinGW, y viceversa. Al compilarlo todo con tu
mismo compilador, ese dolor desaparece por completo.

## 3. `vcpkg`: El gestor de Microsoft

**vcpkg** es el gestor de Microsoft, de código abierto. Su fortaleza es la
**simplicidad** y la integración directa con CMake y Visual Studio. Si quieres el
camino más corto entre "quiero una librería" y "la tengo funcionando", vcpkg es tu
mejor aliado.

### Instalación

Instalarlo es tan simple como clonar el repositorio y ejecutar un script de
bootstrap. No hay instaladores de sistema, ni permisos especiales, ni vueltas:

```bash
git clone https://github.com/Microsoft/vcpkg.git
cd vcpkg
# Windows:
.\bootstrap-vcpkg.bat
# Linux / macOS:
./bootstrap-vcpkg.sh
```

Agrégalo a tu `PATH` para tener disponible el comando `vcpkg`.

### Modo clásico

En su forma más sencilla, instalas una librería directamente:

```bash
vcpkg install fmt
```

Y la integras con CMake pasando el toolchain file:

```bash
cmake -B build -S . -DCMAKE_TOOLCHAIN_FILE=../../vcpkg/scripts/buildsystems/vcpkg.cmake
cmake --build build
```

En tu `CMakeLists.txt` la usas como cualquier dependencia:

```cmake
find_package(fmt CONFIG REQUIRED)
target_link_libraries(mi_app PRIVATE fmt::fmt)
```

Fíjate en cómo se escribe el *toolchain file*: es una ruta **relativa** desde tu
carpeta de trabajo. Por eso la ruta cambia según dónde estés parado, y por eso
también conviene conocer la alternativa moderna que veremos a continuación.

### Modo manifiesto (Recomendado)

El modo clásico instala paquetes de forma **global**, en tu máquina. El modo
manifiesto, en cambio, declara las dependencias del proyecto en `vcpkg.json`, que
vive junto a tu código:

```json
{
  "name": "mi-app",
  "version-string": "1.0.0",
  "dependencies": [
    "fmt",
    "nlohmann-json"
  ]
}
```

Cada persona que clone el proyecto solo ejecuta CMake con el toolchain: vcpkg lee
`vcpkg.json` e instala las versiones declaradas automáticamente. **Proyecto
reproducible.** No hace falta que nadie sepa qué librerías necesita tu proyecto:
está escrito en el manifiesto.

```bash
cmake -B build -S . -DCMAKE_TOOLCHAIN_FILE=vcpkg.cmake
```

::: tip
💡 vcpkg compila cada librería con tu compilador y configuración (Debug/Release),
evitando los clásicos errores de binarios incompatibles.
:::

### Manifest mode con CMake presets

¿Y ese toolchain file que escribimos a mano en cada comando? Podemos guardarlo en
un **preset** de CMake y olvidarnos. Los presets centralizan la configuración del
proyecto en un solo archivo, de forma que compilar sea siempre el mismo comando
corto, en cualquier máquina.

La forma moderna y limpia de integrar todo son los presets. Crea `CMakePresets.json`
en la raíz:

```json
{
  "version": 3,
  "configurePresets": [
    {
      "name": "default",
      "binaryDir": "${sourceDir}/build",
      "cacheVariables": {
        "CMAKE_TOOLCHAIN_FILE": "$env{VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake"
      }
    }
  ]
}
```

Y compila con:

```bash
cmake --preset default
cmake --build build
```

## 4. Conan: El gestor de la Comunidad

**Conan** es el gestor de la comunidad C++, descentralizado y agnóstico de build
system (funciona con CMake, Meson, Premake, etc.). Su modelo es más flexible y su
repositorio central (conan-center) es enorme. Si vcpkg es el camino simple, Conan es
el camino flexible: más control, más opciones y un modelo basado en recetas.

### Instalación

Conan está escrito en Python, así que se instala con `pip`, el gestor de paquetes
de Python:

```bash
pip install conan
conan --version
```

### Uso básico

Con Conan, declaras las dependencias en `conanfile.txt`:

```
[requires]
fmt/10.1.1
nlohmann_json/3.11.3

[generators]
CMakeToolchain
CMakeDeps
```

Fíjate en las **versiones**: Conan usa versionado fino, por eso en el archivo
escribimos `fmt/10.1.1` y no solo `fmt`. Tú decides exactamente qué versión de cada
librería entra en tu proyecto.

Y generas la configuración de CMake:

```bash
conan install . --output-folder=build --build=missing
```

Ese comando descarga las librerías, las compila si hace falta y genera los archivos
que CMake consumirá:

```bash
cmake -B build -S . -DCMAKE_TOOLCHAIN_FILE=build/conan_toolchain.cmake
cmake --build build
```

En tu `CMakeLists.txt`, Conan te entrega targets modernos listos para usar:

```cmake
find_package(fmt CONFIG REQUIRED)
target_link_libraries(mi_app PRIVATE fmt::fmt)
```

### Compilar en Release vs Debug

Conan también te deja elegir la configuración de build con un simple flag. ¿Quieres
las librerías compiladas en modo Release para entregar tu programa, y en Debug para
desarrollar? Conan genera las dos variantes:

```bash
conan install . --output-folder=build -s build_type=Release
conan install . --output-folder=build -s build_type=Debug
```

::: info Nota
ℹ️ A diferencia de vcpkg, Conan usa **recetas** (`conanfile.py`) que definen cómo
descargar, construir y empaquetar cada librería. Esto permite crear recetas para
librerías internas de tu empresa.
:::

## 5. vcpkg vs Conan

| Característica | vcpkg | Conan |
|---|---|---|
| Mantenedor | Microsoft | Comunidad C++ (open source) |
| Instalación | Clonar repo + bootstrap | `pip install conan` |
| Integración con CMake | Toolchain file (`vcpkg.cmake`) | Generadores `CMakeToolchain`/`CMakeDeps` |
| Modelo de versionado | Manifiesto `vcpkg.json` | Recetas + `conanfile.py/txt` |
| Soporte de build systems | CMake, MSBuild, qmake... | CMake, Meson, Premake, Bazel... |
| Curva de aprendizaje | Baja | Media |
| Uso recomendado | Visual Studio/CMake, simplicidad | Flexibilidad y versionado fino |

::: tip
💡 **¿Cuál elegir?** Si empiezas o trabajas con Visual Studio/CMake, **vcpkg** te
dará el camino más corto. Si necesitas control fino de versiones o múltiples build
systems, **Conan** es más potente. Ambos son profesionales y válidos.
:::

## 6. Buenas prácticas

- **Nunca subas dependencias compiladas al repositorio.** Declara el manifiesto
  (`vcpkg.json` o `conanfile.txt`) y deja que el gestor las reconstruya.
- **Fija versiones** en tu manifiesto para que el build sea reproducible.
- **Mantén el build limpio** (out-of-source), separado de tu `src/`.
- **Elige una herramienta por proyecto** y documéntala en el README.
- **Aprovecha los presets** de CMake para que compilar sea `cmake --preset default`.

## 7. Resumen rápido

- Sin gestor, añadir una librería es un ritual manual y frágil.
- **vcpkg** (Microsoft): simple, ideal para CMake y Visual Studio.
- **Conan** (comunidad): flexible, multi-build-system, recetas propias.
- Ambos compilan con **tu compilador** y entregan targets a CMake.
- El **manifiesto** (`vcpkg.json` / `conanfile.txt`) hace el proyecto reproducible.
- Fija versiones y mantén el build separado del código.

Ya sabes gestionar dependencias modernas. En el siguiente capítulo daremos un salto
al futuro del C++: los **módulos de C++20**, la alternativa a los headers
clásicos.