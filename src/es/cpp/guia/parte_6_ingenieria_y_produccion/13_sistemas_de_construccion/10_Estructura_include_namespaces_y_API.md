---
outline: [2, 3]
---

# Estructura, include, namespaces y API

Un proyecto C++ profesional no es solo código que funciona: es código que **otros pueden entender, ampliar y usar** sin romper. Eso requiere tres decisiones de arquitectura: la **estructura de carpetas**, los **namespaces** y el **diseño de la API pública**.

Como una casa bien diseñada: los cimientos (estructura), las habitaciones etiquetadas (namespaces) y las puertas correctas (API). Nadie quiere entrar por la ventana.

## 1. La estructura de carpetas profesional

El patrón más extendido separa **interfaz**, **implementación** y **pruebas**:

```
mi_libreria/
├── CMakeLists.txt
├── include/
│   └── mi_libreria/
│       ├── core.hpp
│       ├── geometria.hpp
│       └── ...
├── src/
│   ├── core.cpp
│   ├── geometria.cpp
│   └── detalles/          ← implementación privada
│       └── helpers.cpp
├── tests/
│   └── test_core.cpp
├── examples/
│   └── ejemplo.cpp
├── CMakePresets.json
└── README.md
```

| Carpeta | Contenido |
|---|---|
| `include/` | Headers **públicos** (se instalan) |
| `src/` | Implementación **privada** |
| `tests/` | Pruebas de la librería |
| `examples/` | Ejemplos de uso |
| `docs/` (opcional) | Documentación |
::: tip
💡 La carpeta `include/mi_libreria/` repite el nombre de la librería: `#include <mi_libreria/core.hpp>` evita colisiones con otras librerías que también tengan un `core.hpp`.
:::

## 2. El patrón include

La **regla de oro** del include: cada header debe poder incluirse **solo** sin depender del orden.

```cpp
// BAD: depende de que main.cpp incluya primero <string>
#ifndef CORE_HPP
#define CORE_HPP
std::string nombre;  // ¿string? No está incluido aquí
#endif
```

```cpp
// BIEN: el header incluye todo lo que necesita
#pragma once
#include <string>

std::string nombre;
```

::: warning Advertencia
⚠️ Un header que no compila solo es un header con bugs invisibles: el problema solo aparece cuando alguien lo usa en otro orden. Incluye siempre lo que necesites, aunque parezca redundante.
:::

## 3. Los namespaces: el apellido de tus símbolos

Los **namespaces** evitan que tus funciones choquen con las de otros (o las de la biblioteca estándar). Son el apellido de tus símbolos:

```cpp
namespace mi_libreria {
namespace geometria {

class Circulo {
    double radio;
public:
    explicit Circulo(double r) : radio(r) {}
    double area() const { return 3.14159 * radio * radio; }
};

}
}
```

```cpp
// Uso con namespace completo
mi_libreria::geometria::Circulo c(2.0);

// O con alias para escribir menos
namespace geo = mi_libreria::geometria;
geo::Circulo c(2.0);
```

::: info Nota
ℹ️ **Nunca** pongas `using namespace` en un header público: contaminas los namespaces de todos los que lo incluyan. En archivos `.cpp` es discutible; en headers, prohibido.
:::

## 4. Las buenas prácticas de los namespaces

- Usa namespaces **anidados** para organizar: `mi_libreria::core`, `mi_libreria::io`.
- Nunca `using namespace std;` en headers.
- En archivos `.cpp` puedes hacer `using` limitado o prefijos.
- Prefiere `using mi_libreria::geometria::Circulo;` (concreto) sobre `using namespace`.

## 5. Diseñar la API pública

La API pública es la **promesa** a tus usuarios. Diseñarla bien es decisivo:
| Principio | Ejemplo |
|---|---|
| Nombres claros | `calcularArea()` no `fn1()` |
| Tipos seguros | `std::optional` en vez de `-1` para "no encontrado" |
| Sin fugas internas | No exponer detalles de implementación |
| Argumentos por valor o const& | No copiar sin necesidad |
| `const` correcto | Métodos que no modifican = `const` |

```cpp
// API bien diseñada
namespace mi_libreria {

class Temperatura {
    double celsius;
public:
    explicit Temperatura(double c) : celsius(c) {}

    double valor() const { return celsius; }          // const: no modifica
    std::string aString() const;                      // nombre claro
};

std::optional<int> buscarEnLista(int objetivo, const std::vector<int> &datos);

}
```

## 6. Evita exponer internals

La regla del **pimpón**: lo que no debe ver el usuario, no lo pongas en headers públicos.

```cpp
// MAL: el header expone detalles internos
class Motor {
public:
    void inicializarSubsistemaPesado();
    std::vector<std::string> nombresInternos; // ¿por qué público?
};

// BIEN: header mínimo, detalles en .cpp
class Motor {
    struct Impl;              // Declaración de la implementación
    std::unique_ptr<Impl> pImpl;
public:
    Motor();
    ~Motor();
    void arrancar();
};
```

::: tip
💡 El patrón **pImpl** (pointer to implementation) oculta la implementación detrás de un puntero: headers pequeños, cambios sin recompilar a los usuarios y mejor encapsulamiento.
:::

## 7. Convenciones de nombres
| Elemento | Convención común |
|---|---|
| Clases | `PascalCase` (`Temperatura`) |
| Funciones | `camelCase` (`calcularArea`) |
| Variables | `camelCase` (`temperatura`) |
| Constantes | `UPPER_CASE` (`MAX_TEMP`) o `kMaxTemp` |
| Archivos | `minúsculas_con_guiones` (`core_utils.hpp`) |
::: info Nota
ℹ️ La clave es la **consistencia**: elige una convención y respétala en todo el proyecto. La propia biblioteca estándar usa su estilo (lower_case para funciones).
:::

## 8. Buenas prácticas

- Estructura: `include/` (público), `src/` (privado), `tests/`, `examples/`.
- Cada header **compila solo** (incluye sus dependencias).
- Namespaces anidados; nunca `using namespace` en headers.
- Diseña la API pensando en **quién la usa**, no en ti.
- Oculta la implementación (pImpl, detalles en `.cpp`).
- Sé consistente con las convenciones de nombres.

## 9. Resumen rápido

- Estructura profesional: `include/`, `src/`, `tests/`, `examples/`.
- `#include <libreria/archivo.hpp>` evita colisiones.
- Un header debe compilar **solo** (`#pragma once` + includes propios).
- Los **namespaces** son el apellido de tus símbolos; nunca `using namespace` en headers.
- La **API** es tu promesa: nombres claros, tipos seguros, `const` correcto.
- Oculta lo interno con el patrón pImpl.

Con tu proyecto organizado, en el siguiente capítulo veremos un detalle que genera mucha confusión: la diferencia entre `#include <...>` y `#include "..."`.
