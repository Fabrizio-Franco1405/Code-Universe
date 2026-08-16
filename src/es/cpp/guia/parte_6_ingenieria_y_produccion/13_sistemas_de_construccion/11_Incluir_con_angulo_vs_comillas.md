---
outline: [2, 3]
---

# Incluir con ángulo vs comillas

Toda la guía has usado `#include <iostream>` y `#include "mi_archivo.hpp"` sin pensarlo
demasiado, y no está mal: es lo que hace todo el mundo. Pero ¿sabes realmente **qué diferencia**
hay entre las comillas y los ángulos? No es un detalle trivial: entenderlo te ahorrará errores de
compilación muy confusos, de esos que te hacen mirar el techo y preguntarte qué pasó.

Piensa en ello como buscar a alguien en tu casa o en el vecindario: las comillas preguntan primero
en casa (tu proyecto); los ángulos van directamente al vecindario (el sistema y los include
paths). La persona puede estar en cualquiera de los dos lugares, pero el orden en que buscás
cambia según cómo hagas la pregunta.

## 1. La diferencia esencial

La clave de todo está en *dónde busca primero* cada forma. Fijate esta tabla:

| Forma | Busca primero | Se usa para |
|---|---|---|
| `#include "archivo.hpp"` | El directorio del **archivo actual** | Headers propios, del proyecto |
| `#include <archivo>` | Los **directorios de include** del compilador | Bibliotecas del sistema y externas |

```
#include "util/core.hpp"     →  busca junto al archivo actual
                                 luego en los -I include paths

#include <iostream>          →  busca en los include paths del
                                 compilador (sistema y -I)
```

## 2. Qué significa "busca primero"

Un detalle que mucha gente no sabe: ambas formas **acaban buscando en los include paths** (los
`-I` de g++/clang, la lista de Visual Studio). La diferencia es el **orden**, no el destino final.
La palabra clave es "primero":

1. Con comillas: primero el directorio del archivo que está haciendo el include; si no lo
   encuentra, sigue con los include paths.
2. Con ángulos: directamente los include paths, sin mirar el directorio actual.

```bash
# Incluye paths del compilador (ángulos buscan aquí)
g++ -I ./include -I /usr/include main.cpp

# Con comillas, también se mira la carpeta de main.cpp
```

## 3. La regla de oro

Para que no te quedes con dudas, acá va la regla sencilla que nunca falla:

::: tip
💡 **Regla sencilla que nunca falla:**

- **`"..."`** → archivos de TU proyecto (headers propios).
- **`<...>`** → bibliotecas del sistema y de terceros.
:::

```cpp
#include <iostream>     // estándar: ángulos
#include <vector>       // estándar: ángulos
#include <fmt/format.h> // librería externa: ángulos
#include "util/core.hpp" // tu proyecto: comillas
```

## 4. ¿Qué pasa si me equivoco?

La buena noticia: no es un error "crítico" que haga explotar el compilador de inmediato. La mala:
trae problemas sutiles que aparecen en el peor momento. Veamos los dos casos:

```cpp
// Con ángulos para un header propio
#include <core.hpp>  // ✔ funciona SI la carpeta está en los include paths
                     // ✘ pero es frágil: depende de cómo configuren la compilación
```

```cpp
// Con comillas para el sistema
#include "iostream"   // ✔ suele funcionar (acaba buscando en el sistema)
                      // ✘ pero si tu proyecto tuviera un "iostream.hpp"...
```

::: warning Advertencia
⚠️ El peligro real de las comillas: si tu proyecto tiene un archivo con el mismo nombre que una librería del sistema, las comillas lo **encontrarán primero** y te "robarán" el include sin que te des cuenta. Usa siempre ángulos para el sistema.
:::

## 5. El include path de CMake

Cuando usás CMake, no tenés que andar escribiendo `-I` a mano: el sistema añade automáticamente
los include paths que propaga cada target:

```cmake
target_include_directories(util PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)
```

Y acá viene un punto que confunde a muchos: cuando el include path de CMake ya apunta a la carpeta
`include/` de tu librería, los headers de esa librería se ven desde el include path. Por eso, lo
normal es usar ángulos:

```cpp
#include "util/matematicas.hpp"  // ¡Ojo!
// Con include path añadido, lo normal es ángulos:
#include <util/matematicas.hpp>  // busca en el include path de CMake
```

::: info Nota
ℹ️ En CMake moderno con `target_include_directories`, los headers de tu librería se ven **desde el include path**, así que el estilo con ángulos `<util/matematicas.hpp>` es el recomendado dentro de la librería.
:::

## 6. Una excepción: includes relativos

A veces verás includes relativos con comillas, sobre todo en código viejo o en proyectos chicos:

```cpp
#include "../detalles/helper.hpp" // Relativo al archivo actual
```

Funciona, pero **no es recomendable**: las rutas relativas se rompen al reorganizar carpetas. Un
día movés una carpeta y, sin tocar una sola línea de lógica, el proyecto deja de compilar.
Prefiere include paths y nombres estables.

## 7. Buenas prácticas

- **Sistema/externos** → `<>`. **Proyecto** → `""` (o `<>` con include paths).
- No uses rutas relativas `../` cuando puedas usar include paths.
- Añade la carpeta `include/` como include path (CMake lo hace por ti).
- Sé consistente en todo el proyecto.

## 8. Resumen rápido

- **Comillas** (`"..."`): buscan primero junto al archivo actual → headers propios.
- **Ángulos** (`<...>`): van directos a los include paths → sistema y externos.
- Ambas acaban buscando en los include paths; solo cambia el orden.
- Las comillas pueden **robar** includes con nombres coincidentes.
- En CMake moderno, usa `<>` para los headers de tu librería vía include path.
- Evita includes relativos `../`.

Con el include claro, en el siguiente capítulo cerramos el módulo con la parte más profesional:
**distribución, versionado y empaquetado** de tu proyecto.