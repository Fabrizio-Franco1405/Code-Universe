---
outline: [2, 3]
---

# Despliegue

El proyecto funciona, tiene tests que pasan y está documentado. Nos falta el último
paso del camino, ese que separa a un proyecto de escritorio de un proyecto
entregado: el **despliegue**. Desplegar es entregar tu sistema de inventario al
mundo, de forma que otras personas puedan usarlo, instalarlo o descargarlo. Es la
ceremonia final de un proyecto profesional, el momento en que todo el esfuerzo
acumulado se convierte en algo **usable por otros**.

Piénsalo como publicar un libro: primero escribes la historia, luego la revisas y
la ilustras, y finalmente llega la portada, la imprenta y el reparto. Cada uno de
esos pasos convierte tu trabajo en algo que alguien más puede tener en sus manos.

## 1. Compilar para release

Todo lo visto en el capítulo de optimización se aplica acá con fuerza: el build de
**release** es lo que se entrega. No el de debug, ni uno "a medio camino", sino el
build pensado para el usuario final, optimizado y sin el lastre de la información de
depuración.

```bash
cmake -B build -S . -DCMAKE_BUILD_TYPE=Release
cmake --build build
```

| Build type | Flags | Uso |
|---|---|---|
| `Debug` | `-O0 -g` | Desarrollo y depuración |
| `Release` | `-O3 -DNDEBUG` | Entrega al usuario |
| `RelWithDebInfo` | `-O2 -g` | Release con símbolos |

::: tip
💡 En Windows con Visual Studio, elige la configuración **Release** en el IDE (o
`--config Release` en CMake). Nunca entregues un Debug: es lento y sin optimizar.
:::

## 2. Verificar antes de entregar

Antes de publicar nada, conviene un pequeño checklist. Es como revisar el auto
antes de un viaje largo: mejor descubrir el problema en el garaje que a mitad de
camino. Tres verificaciones cubren lo esencial:

```bash
# 1. Tests pasan
ctest --test-dir build --output-on-failure

# 2. Sin fugas de memoria (Linux)
valgrind --leak-check=full ./build/inventario

# 3. Build limpio desde cero (sin cache)
rm -rf build && cmake -B build -S . && cmake --build build
```

::: warning Advertencia
⚠️ **Nunca entregues un build "a medias"**: compila desde cero, con release, y
verifica los tests. El build limpio desde cero detecta dependencias olvidadas que
"solo funcionaban en tu máquina".
:::

## 3. Empaquetar el binario

Una vez que el ejecutable está listo, hay que **empaquetarlo**: juntar el binario
con la documentación, la licencia y todo lo que el usuario necesita, en un solo
lugar fácil de distribuir.

Para un programa de consola, el "paquete" puede ser tan simple como el ejecutable
compilado:

```bash
# Linux: el binario + documentación
cp build/inventario release/inventario
cp README.md release/
cp LICENSE release/

# Y un comprimido para distribuir
tar -czf inventario-v1.0.0-linux.tar.gz release/
```

En Windows:

```powershell
Copy-Item build\Release\inventario.exe release\
Compress-Archive -Path release\* -DestinationPath inventario-v1.0.0-windows.zip
```

Fíjate en el nombre de los archivos: `inventario-v1.0.0-linux.tar.gz` y
`inventario-v1.0.0-windows.zip`. Incluir el nombre, la **versión** y la
**plataforma** en el nombre del paquete es una buena costumbre que le ahorra
confusiones a quien descarga.

## 4. Empaquetado profesional con CPack

Copiar archivos a mano funciona, pero existe una forma más profesional: **CPack**,
que ya conocimos en el capítulo de sistemas de construcción. CPack genera los
paquetes automáticamente a partir de la configuración de CMake, y puede crear
instaladores, comprimidos y más, sin que tengas que hacer nada a mano.

Para una entrega más profesional, CPack (visto en el capítulo de sistemas de
construcción) genera instaladores:

```cmake
# CMakeLists.txt
include(CPack)

set(CPACK_PACKAGE_NAME "inventario")
set(CPACK_PACKAGE_VERSION "1.0.0")
set(CPACK_PACKAGE_DESCRIPTION_SUMMARY "Gestión de inventario")
set(CPACK_GENERATOR "ZIP;TGZ")

set(CPACK_NSIS_DISPLAY_NAME "Inventario")
set(CPACK_PACKAGE_INSTALL_DIRECTORY "inventario")
```

```bash
cmake -B build -S . -DCMAKE_BUILD_TYPE=Release
cmake --build build
cpack --config build/CPackConfig.cmake
# Genera inventario-1.0.0.zip y .tar.gz
```

## 5. Publicar el código en GitHub

La forma más común de "desplegar" un proyecto C++ no es enviar un archivo por
correo: es **publicar el código fuente en un repositorio** con una *release*. Acá
tu proyecto deja de ser algo local y se vuelve parte de la comunidad, disponible
para que cualquiera lo clone, lo estudie o colabore.

```bash
git init
git add .
git commit -m "Sistema de inventario v1.0.0"
git remote add origin https://github.com/tu-usuario/inventario.git
git push -u origin main

# Etiqueta la versión (SemVer)
git tag v1.0.0
git push origin v1.0.0
```

El comando `git tag v1.0.0` es más importante de lo que parece: una **etiqueta**
(tag) marca un punto exacto de la historia del proyecto. Gracias a ella, cualquier
persona puede volver a esa versión específica, y tú puedes adjuntarle los binarios
compilados.

::: tip
💡 GitHub **Releases** te deja adjuntar los binarios empaquetados al tag `v1.0.0`:
quien quiera puede descargar el código o el binario precompilado de tu plataforma.
:::

## 6. Checklist final del proyecto

| Tarea | Estado |
|---|---|
| Tests pasan | ✔ |
| Sin fugas (Valgrind) | ✔ |
| Build release desde cero | ✔ |
| README completo | ✔ |
| Licencia añadida | ✔ |
| Binarios empaquetados | ✔ |
| Release con tag en GitHub | ✔ |

## 7. El siguiente nivel del proyecto

Tu sistema de inventario está desplegado. ¿Y ahora qué? Un proyecto no se termina
cuando se publica: justamente ahí es donde suele empezar lo interesante. Acá te
dejamos algunas ampliaciones naturales, cada una apoyada en lo que ya viste en esta
guía:

| Mejora | Módulo de la guía que usas |
|---|---|
| Guardar en base de datos | E/S y archivos |
| Servidor multiusuario | Concurrencia |
| Interfaz gráfica | (fuera de esta guía, pero ya tienes la base) |
| Plugin de categorías | Patrones (Factory) |
| Optimizar para miles de productos | Optimización |

::: info Nota
ℹ️ El proyecto no es un fin: es tu **punto de partida**. Cada mejora que le hagas
aplicará los capítulos de esta guía y ampliará tu portafolio.
:::

## 8. Buenas prácticas

- Entrega **release** (`-O3 -DNDEBUG`), nunca debug.
- Verifica tests, fugas y build limpio antes de publicar.
- Empaqueta con CPack para entregas profesionales.
- Publica en GitHub con tag de versión (SemVer).
- Documenta las mejoras siguientes en el README.

## 9. Resumen rápido

- Build **Release** (`-DCMAKE_BUILD_TYPE=Release`).
- Checklist: tests ✔, valgrind ✔, build limpio ✔.
- Empaqueta binario + README + LICENSE (o CPack).
- Publica en GitHub con release y tag.
- El proyecto es tu punto de partida para seguir creciendo.
- Entrega limpia: compila desde cero, verifica y documenta.

Y con esto... **has terminado la guía completa de C++ moderno**. Desde las variables
hasta el despliegue de un proyecto real. Has construido un sistema de inventario que
usa POO, STL, lambdas, C++ moderno, JSON, CMake, tests y optimización. Todo lo que
has aprendido está ahora en un proyecto que funciona, publicado y listo para que
cualquiera lo use.

Prepárate para tu próximo gran paso: tomar todo este conocimiento y aplicarlo a tus
propios proyectos. El mundo del C++ te espera. 🚀