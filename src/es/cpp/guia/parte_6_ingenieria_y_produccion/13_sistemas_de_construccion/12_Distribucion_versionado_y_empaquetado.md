---
outline: [2, 3]
---

# Distribución, versionado y empaquetado

Tu librería funciona, se instala y otros la encuentran con `find_package`. El último paso del módulo de construcción es convertirlo en un **producto profesional**: versionarlo correctamente, empaquetarlo y distribuirlo de forma reproducible.

Es como publicar un libro: escribir el contenido es solo el principio. Necesitas edición, ISBN, portada y una editorial que lo distribuya.

## 1. El versionado semántico

El **SemVer** (Semantic Versioning) es el estándar para nombrar versiones. Formato: `MAJOR.MINOR.PATCH`.

```
2.3.1
│ │ │
│ │ └─ PATCH: correcciones de bugs (compatibles)
│ └─── MINOR: nuevas funciones (compatibles)
└───── MAJOR: cambios que ROMPEN compatibilidad
```

| Cambio | Versión |
|---|---|
| Corrijo un bug | `1.2.0` → `1.2.1` |
| Añado una función (sin romper) | `1.2.1` → `1.3.0` |
| Elimino o cambio la API | `1.3.0` → `2.0.0` |
::: tip
💡 La promesa del SemVer: mientras `MAJOR` no cambie, tu código que usa la librería seguirá compilando. Respetarlo genera **confianza** en tus usuarios.
:::

## 2. Versionar en CMake

Define la versión de forma centralizada y propágala:

```cmake
project(mi_libreria VERSION 2.3.1 LANGUAGES CXX)

# La versión queda disponible como variable
message(STATUS "Versión: ${PROJECT_VERSION}")  # 2.3.1

# Y se puede incrustar en el código
target_compile_definitions(util PRIVATE
    VERSION_MAJOR=${PROJECT_VERSION_MAJOR}
)
```

```cpp
// En el código
#ifndef VERSION_MAJOR
#define VERSION_MAJOR 0
#endif
const char *version = "2.3.1";
```

## 3. Distribuir el código fuente

Hay dos formas de entregar tu librería:
| Forma | Cómo | Cuándo |
|---|---|---|
| **Código fuente** | Repositorio Git + releases | La más común y flexible |
| **Binarios precompilados** | `.deb`, `.rpm`, `vcpkg`, Conan | Para usuarios sin toolchain |

```bash
# Distribución clásica con Git
git tag v2.3.1        # Etiqueta la versión
git push origin v2.3.1
```

::: info Nota
ℹ️ La distribución **por código fuente** es la más usada en C++: cada usuario lo compila con su compilador, sin problemas de compatibilidad de binarios.
:::

## 4. Empaquetar con CPack

CMake incluye **CPack**, su empaquetador integrado. Genera instaladores y paquetes de sistema:

```cmake
# CMakeLists.txt (al final)
include(CPack)

set(CPACK_PACKAGE_NAME "mi-libreria")
set(CPACK_PACKAGE_VERSION "2.3.1")
set(CPACK_PACKAGE_DESCRIPTION_SUMMARY "Librería de utilidades")
set(CPACK_GENERATOR "ZIP;TGZ")  # formatos de paquete
```

```bash
cpack
# Genera mi-libreria-2.3.1.zip y .tar.gz
```

| Generador | Formato |
|---|---|
| `ZIP`, `TGZ` | Comprimidos (multiplataforma) |
| `DEB` | Paquete de Debian/Ubuntu |
| `RPM` | Paquete de Fedora/RHEL |
| `NSIS` | Instalador de Windows |
| `DragNDrop` | `.dmg` de macOS |
## 5. Publicar en un gestor de paquetes

La distribución **moderna**: subir tu librería a vcpkg o Conan.

**vcpkg:** aporta un *port* (receta) que descarga tu código y lo compila:

```bash
# El usuario final solo hace:
vcpkg install mi-libreria
```

**Conan:** escribe una *receta* (`conanfile.py`) que define cómo construir y empaquetar:

```python
from conan import ConanFile

class MiLibreria(ConanFile):
    name = "mi-libreria"
    version = "2.3.1"
    settings = "os", "compiler", "build_type", "arch"
    exports_sources = "src/*", "include/*"

    def package(self):
        self.copy("*.hpp", dst="include")
        self.copy("*.lib", dst="lib", keep_path=False)

    def package_info(self):
        self.cpp_info.libs = ["util"]
```

## 6. El checklist de distribución
| Paso | Acción |
|---|---|
| 1. Versionado | SemVer con `MAJOR.MINOR.PATCH` |
| 2. Tags | `git tag v2.3.1` en cada release |
| 3. Documentación | README con instalación y uso |
| 4. Licencia | Archivo `LICENSE` (MIT, Apache, GPL...) |
| 5. Testing | Pruebas que validen el release |
| 6. Empaquetado | CPack o publicación en vcpkg/Conan |
| 7. Release notes | Qué cambió en cada versión |
::: warning Advertencia
⚠️ **Nunca** distribuyas binarios sin indicar su versión y compilador. Un `.lib` compilado con MSVC 2022 no sirve con MSVC 2019. El código fuente evita todos estos dolores.
:::

## 7. Reproducibilidad

Un proyecto profesional debe compilar **igual en cualquier máquina**:

```bash
# Todo se controla desde el manifiesto/receta
git clone mi-proyecto
cmake --preset default      # lee CMakePresets.json + vcpkg.json
cmake --build build
```

El versionado en el manifiesto (`vcpkg.json`, `conanfile.txt`) garantiza que todos instalen **las mismas** versiones de dependencias.

## 8. Buenas prácticas

- Usa **SemVer** y respétalo de verdad (MAJOR rompe, MINOR añade, PATCH corrige).
- Etiqueta cada release con `git tag`.
- Distribuye **código fuente** siempre que puedas.
- Publica en vcpkg/Conan para un uso moderno y reproducible.
- Añade README, LICENSE y release notes.
- Fija las versiones de las dependencias en el manifiesto.

## 9. Resumen rápido

- **SemVer**: `MAJOR.MINOR.PATCH` con reglas claras.
- La versión vive en `project(... VERSION ...)` y se propaga.
- Distribución: código fuente (Git) o binarios empaquetados.
- **CPack** genera ZIP, DEB, RPM, NSIS...
- Publicar en **vcpkg/Conan** es la vía moderna.
- Reproducibilidad: manifiestos + presets + versiones fijadas.

Con esto cierra el módulo de sistemas de construcción. Pasamos a la parte final de la ingeniería: cómo hacer que tu código **vuelo rápido y eficiente** con la optimización.
