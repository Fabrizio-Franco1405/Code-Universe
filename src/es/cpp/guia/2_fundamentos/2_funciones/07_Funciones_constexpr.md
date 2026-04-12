# Funciones `constexpr`

`constexpr` es un especificador que indica que una función (o variable) **puede** (y en algunos contextos **debe**) evaluarse en tiempo de compilación.  
Su objetivo es permitir cálculos constantes en tiempo de compilación, evitando trabajo en tiempo de ejecución y habilitando usos que requieren valores constantes (ej. tamaños de arreglos estáticos, parámetros de plantillas, `std::array`, etc.).

:::info Nota
ℹ️ **Idea clave:** una función `constexpr` es una función que **puede** producir un valor constante en compilación si se le pasan argumentos constantes. Si se llama con argumentos no constantes, se comporta como una función normal en tiempo de ejecución.
:::

## 1. Sintaxis básica

```cpp
// simple: válida desde C++11
constexpr int cuadrado(int x) {
    return x * x;
}
```

Uso:
```cpp
constexpr int cincoCuadrado = cuadrado(5);        // Evaluado en compilación
int n = 7;
int r = cuadrado(n);                              // Evaluado en tiempo de ejecución
```

Puedes definir `constexpr` tanto en funciones libres como en métodos y constructores. Las funciones `constexpr` son especialmente útiles para inicializar `constexpr` variables y para contextos que requieren constantes en compilación.

## 2. Reglas y limitaciones (resumen práctico)

- Para que una invocación de una función `constexpr` **sea evaluada en tiempo de compilación**, todos sus argumentos deben ser constantes en compilación y el cuerpo de la función debe respetar las restricciones del estándar aplicable.

- En C++11 las funciones `constexpr` estaban muy restringidas (normalmente un solo `return`); C++14/C++17 relajaran las reglas permitiendo más estructuras (variables locales, bucles, `if`, etc.). C++20 y posteriores agregaron más mejoras (p. ej. `consteval`, mayores capacidades de `constexpr` en la librería estándar).

- Si se usa la función con argumentos **no constantes**, la función se ejecuta en tiempo de ejecución como cualquier otra función (siempre que el cuerpo permita ejecución en tiempo de ejecución).

- La invocación en tiempo de compilación requiere que tipos de parámetros, retornos y operaciones sean adecuados para evaluación en compilación (literal types en versiones antiguas del estándar).

- `constexpr` no permite efectos secundarios observables (I/O, modificación de objetos externos visibles, etc.) cuando la evaluación se realiza en tiempo de compilación.

No todas las funciones marcadas `constexpr` se evaluarán en compilación: la evaluación depende de los argumentos y del contexto. Además, llamar a operaciones de librería no `constexpr` dentro del cuerpo impedirá la evaluación en compilación.

## 3. Ejemplos útiles

1. **Función simple (C++11 compatible)**
```cpp
constexpr int factorial(int n) {
    return (n <= 1) ? 1 : (n * factorial(n - 1));
}

constexpr int fact5 = factorial(5); // Evaluado en compilación: 120
static_assert(fact5 == 120, "factorial incorrecto");
```

2. **`constexpr` con uso en `std::array`**
```cpp
#include <array>

constexpr int factorial(int n) {
    return (n <= 1) ? 1 : (n * factorial(n - 1));
}

constexpr int N = 5;
std::array<int, factorial(N)> datos{}; // tamaño conocido en compilación
```

3. **`constexpr` constructor y métodos (struct simple)**
```cpp
struct Punto {
    double x;
    double y;
    constexpr Punto(double x_, double y_) : x(x_), y(y_) {}
    constexpr double norma2() const { return x*x + y*y; }
};

constexpr Punto p{3.0, 4.0};
static_assert(p.norma2() == 25.0);
```

:::info Nota
ℹ️ Funciones matemáticas de la STL (p. ej. `std::sqrt`) no eran `constexpr` hasta versiones recientes del estándar; por eso en `norma2()` usamos la suma de cuadrados.
:::

4. **Evaluación en tiempo de ejecución si no hay constantes**
```cpp
int valor = 10;
int r = cuadrado(valor); // Cuadrado(10) se evalúa en tiempo de ejecución
```

## 4. Evolución práctica por estándar (breve)

- **C++11:** Introducción de constexpr con reglas estrictas (funciones simples, una expresión `return`).

- **C++14:** Relajación de restricciones: funciones `constexpr` pudieron tener variables locales, bucles y estructuras de control, permitiendo algoritmos más complejos en compilación.

- **C++17 / C++20:** Ampliación del uso de `constexpr` en la librería, `constexpr` en más contextos y nuevas herramientas (por ejemplo, `consteval` en C++20 para funciones que siempre deben evaluarse en compilación y `constinit` para inicialización estática).

Para detalles pormenorizados de cada versión revisa la documentación del estándar correspondiente; aquí se resumen las líneas generales para uso práctico.

## 5. Buenas prácticas y recomendaciones

- Marca `constexpr` a funciones que **pueden y tienen sentido** de evaluarse en compilación (pequeñas utilidades, cálculos de tamaños, constantes derivadas).

- Evita declarar `constexpr` en funciones que dependan de I/O, estados globales mutables o APIs no `constexpr`.

- Cuando quieras forzar evaluación en compilación usa `static_assert` con una invocación `constexpr` o en C++20 considera `consteval` si necesitas que la función siempre se evalúe en compilación.

- Usa constexpr en constructores para crear tipos inmutables que se puedan construir en tiempo de compilación (útil para metaprogramación y configuración en tiempo de compilación).

`constexpr` mejora la expresividad del código: permite mover comprobaciones y cálculos costosos a compilación, reduciendo errores en tiempo de ejecución y mejorando rendimiento. Es una herramienta potente cuando se aplica con criterio.

## 6. Errores y trampas comunes

- Intentar usar en tiempo de compilación una función que internamente llama a una función de la STL no `constexpr` — la evaluación en compilación fallará.

- Asumir que `constexpr` garantiza evaluación en compilación: no la garantiza, solo la habilita si el contexto y argumentos lo permiten.

- Esperar que `constexpr` permita efectos secundarios — no es el propósito y no es admitido en la evaluación constante.

- Si necesitas que una función siempre sea evaluada en tiempo de compilación (y el código no tiene sentido en ejecución), considera `consteval` (C++20). `consteval` obliga la evaluación en compilación; su uso debe ponderarse según compatibilidad del compilador y estándar.

## 7. Resumen rápido

`constexpr` permite escribir funciones y constructores que **pueden** evaluarse en compilación.

Útil para cálculos constantes, tamaños de arreglos, inicializaciones `constexpr` y comprobaciones en compilación.

Las restricciones se han ido relajando con C++14/17/20, por lo que hoy es una herramienta práctica y común en C++ moderno.