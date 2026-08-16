---
outline: [2, 3]
---

# Módulos

Imagina que tu código fuera una casa: con los **headers** tradicionales, cada habitación (archivo `.cpp`) entraba en todas las demás a través de una puerta que mostraba *todo* (incluida la sala de máquinas). Los **módulos** (C++20) cambian las reglas: ahora la casa tiene puertas diseñadas a medida, donde **tú decides exactamente qué se ve y qué no** desde fuera.

Los módulos son el reemplazo moderno del sistema `#include` + guards. Resuelven problemas que llevaban 40 años sin solución: tiempos de compilación enormes, filtraciones de macros y dependencias de orden de inclusión.

## 1. El problema que resuelven

Con el modelo clásico, cada `#include` copia el contenido del header dentro de tu archivo, y el preprocesador vuelve a procesar *todo* en cada unidad de traducción:

```cpp
// modelo.h (tradicional)
#ifndef MODELO_H
#define MODELO_H
class Modelo { /* ... */ };
#endif
```

```cpp
// main.cpp
#include "modelo.h"   // copia TODO el contenido aquí
```

Esto tiene tres problemas graves:

- **Compilación lenta**: cada `.cpp` reprocesa los mismos headers una y otra vez.
- **Macros que se filtran**: un `#define` en un header contamina todos los archivos que lo incluyen.
- **Orden frágil**: `#include "a.h"` debe venir antes que `#include "b.h"` si `b` depende de `a`.

## 2. La sintaxis básica de un módulo

Un módulo se declara con la palabra clave `module`. Lo típico es separarlo en **dos archivos**: la declaración de la interfaz y la implementación.

**Interfaz (`matematicas.cppm`):**

```cpp
export module matematicas;

export int suma(int a, int b);
export int resta(int a, int b);
```

**Implementación (`matematicas.cpp`):**

```cpp
module matematicas;

int suma(int a, int b) {
    return a + b;
}

int resta(int a, int b) {
    return a - b;
}
```

**Uso (`main.cpp`):**

```cpp
import matematicas;

int main() {
    return suma(3, 4);   // 7
}
```

Fíjate en la diferencia clave: `export` indica **lo que es visible hacia fuera**; lo que no lleve `export` queda **privado** del módulo, aunque sea accesible internamente.

::: tip
💡 El sufijo `.cppm` (C++ module) es la convención para los archivos de interfaz, aunque algunos proyectos usan `.ixx` o `.cpp`. Lo importante es la declaración `export module`.
:::

## 3. Palabras clave: `module`, `export` e `import`

Son tres y definen todo el sistema:

- **`module`**: declara que el archivo pertenece a un módulo.
- **`export`**: marca lo que el módulo **publica** para los consumidores.
- **`import`**: trae las interfaces de otro módulo (o de un `header unit`).

```cpp
export module geometria;

export struct Punto {
    int x, y;
};

export double distancia(const Punto& a, const Punto& b);

// No exportado: solo uso interno del módulo
double cuadrar(double v) {
    return v * v;
}
```

Los módulos son **cercanos**: importar algo no re-exporta automáticamente. Si tu módulo usa `std::vector` en su interfaz pública, puedes hacer:

```cpp
export module coleccion;

import <vector>;   // importa el header unit de la STL

export using Lista = std::vector<int>;
```

::: warning
⚠️ Para usar `import <vector>` (header units) necesitas un compilador reciente (GCC 14+, Clang 17+, MSVC). Con compiladores más antiguos tendrás que incluir el header con `#include <vector>` dentro del módulo.
:::

## 4. Particiones de módulo

Cuando un módulo crece, se divide en **particiones** para organizar el código sin cambiar la interfaz pública:

```cpp
// matematicas.cppm
export module matematicas;

export import :operaciones;   // expone la partición :operaciones

double constante_pi();        // declara otra partición
```

```cpp
// operaciones.cppm (partición)
export module matematicas:operaciones;

export int suma(int a, int b) { return a + b; }
```

```cpp
// pi.cpp (implementación de la partición implícita)
module matematicas;

double constante_pi() {
    return 3.14159;
}
```

Las particiones con `export import` (como `:operaciones`) **re-exportan** su contenido; las demás quedan internas.

## 5. Beneficios frente a los headers

| Aspecto | Headers tradicionales | Módulos |
|---|---|---|
| Tiempo de compilación | Alto (reprocesa todo) | Bajo (compila una vez) |
| Filtración de macros | Sí, frecuente | No |
| Orden de inclusión | Importante y frágil | Irrelevante |
| Visibilidad | Todo o nada | Export selectivo |
| Código en el header | Solo declaraciones | Todo permitido |

## 6. Buenas prácticas

- Usa `export` **solo** para la interfaz pública real; mantén el resto interno.
- Nombra los módulos con puntos: `es.geometria`, `app.audio`, etc. (el punto es solo cosmético, no jerarquía).
- Evita `using namespace std` en la interfaz exportada: contamina el consumidor.
- Para migrar proyectos grandes, hazlo **por capas**: los módulos pueden incluir headers, pero los headers no pueden importar módulos.

## 7. Resumen rápido

- Los módulos (C++20) reemplazan a `#include` con `import` y `export`.
- `export module nombre;` declara la interfaz; `export` publica símbolos.
- Compilación más rápida, sin filtraciones de macros y sin problemas de orden.
- Las **particiones** (`modulo:parte`) organizan módulos grandes.
- Requieren compiladores recientes; conviene migrar por capas.

Los módulos son la frontera del C++ moderno. En el próximo capítulo veremos **ranges y vistas**, el nuevo estilo para trabajar con colecciones de forma componible y elegante.
