---
outline: [2, 3]
---

# Vectorización

Tu CPU, aunque parezca que procesa una operación a la vez, en realidad puede hacer varias **a la vez** gracias a las instrucciones **SIMD** (Single Instruction, Multiple Data). Un solo `add` puede sumar 4, 8 o incluso 16 números de una sola pasada.

La **vectorización** es aprovechar esa capacidad: procesar varios datos con una sola instrucción. Es el motivo por el que el procesamiento de imágenes, audio y simulaciones va tan rápido.

## 1. SIMD en una imagen

```
Sin SIMD (escalar):            Con SIMD (vectorizada):
a = x[0] + y[0]                ┌─────────────────────┐
a = x[1] + y[1]                │ [x0 x1 x2 x3]       │
a = x[2] + y[2]                │ + [y0 y1 y2 y3]     │
a = x[3] + y[3]                │ = [r0 r1 r2 r3]     │
         4 operaciones         └─────────────────────┘
                                       1 operación
```

## 2. La vectorización automática

El compilador **vectoriza solo** ciertos bucles con `-O2`/`-O3`, si se cumplen condiciones:

- El bucle es **simple** (sin condiciones complicadas).
- Los datos son **contiguos** (arrays/vectores).
- Las iteraciones son **independientes** entre sí.
- No hay llamadas a funciones que se interpongan.

```cpp
// El compilador puede vectorizar esto:
vector<double> a(1000), b(1000), c(1000);
for (int i = 0; i < 1000; i++) {
    c[i] = a[i] + b[i]; // 4 sumas a la vez con SIMD
}
```

Compilando con `-O3 -march=native`, el compilador usa las instrucciones SIMD de tu CPU.

::: tip
💡 Para ver qué vectorizó el compilador, usa `-fopt-info-vec` (GCC) o `-Rpass=loop-vectorize` (Clang). Verás qué bucles se vectorizan y por qué otros no.
:::

## 3. Obstáculos a la vectorización

El compilador es conservador: si **no puede demostrar** seguridad, no vectoriza.

```cpp
// Bloquea la vectorización: los punteros pueden solaparse
void sumar(float *a, float *b, float *c, int n) {
    for (int i = 0; i < n; i++) {
        c[i] = a[i] + b[i];
    }
}
```

Solución con `restrict` (C99, soportado por GCC/Clang) o `std::span`:

```cpp
// Le decimos al compilador: los arreglos NO se solapan
void sumar(float *restrict a, float *restrict b, float *restrict c, int n) {
    for (int i = 0; i < n; i++) {
        c[i] = a[i] + b[i]; // Ahora vectoriza
    }
}
```

Otros bloqueadores:
| Obstáculo | Ejemplo |
|---|---|
| Ramas en el bucle | `if (x[i] > 0) c[i] = 1;` (difícil) |
| Llamadas a funciones | `c[i] = func(a[i]);` |
| Dependencias entre iteraciones | `c[i] = c[i-1] * 2;` |
| Condición de salida variable | Bucles `while` complejos |
## 4. Vectorización manual con `<xsimd>` / intrinsics

Cuando el compilador no puede vectorizar, puedes hacerlo **tú**. La librería `xsimd` (o las intrinsics del hardware) lo permite de forma portátil:

```cpp
#include <xsimd/xsimd.hpp>
#include <vector>
using namespace std;

int main() {
    vector<double> a(8, 1.0), b(8, 2.0), c(8);

    using batch_t = xsimd::batch<double>; // Procesa varios double a la vez

    for (size_t i = 0; i < a.size(); i += batch_t::size) {
        batch_t va = batch_t::load(&a[i]);       // Carga un bloque
        batch_t vb = batch_t::load(&b[i]);
        batch_t vc = va + vb;                     // Suma SIMD
        vc.store(&c[i]);                          // Guarda
    }

    cout << "c[0] = " << c[0] << endl; // 3.0
    return 0;
}
```

::: warning Advertencia
⚠️ La vectorización manual es **avanzada** y solo merece la pena en bucles que son el cuello de botella real, después de medir. Primero intenta la automática.
:::

## 5. `std::ranges` y la vectorización

En C++20/23, los algoritmos de ranges suelen estar **bien optimizados**: `std::transform` sobre datos contiguos se vectoriza fácilmente:

```cpp
#include <iostream>
#include <vector>
#include <ranges>
using namespace std;

int main() {
    vector<double> a(1000, 1.0), b(1000, 2.0), c(1000);

    // transform + ranges: claro Y vectorizable
    ranges::transform(a, b, c.begin(),
        [](double x, double y) { return x + y; });

    cout << "c[0] = " << c[0] << endl; // 3.0
    return 0;
}
```

## 6. Alineación de memoria

Para SIMD máximo, los datos deben estar **alineados** (por ejemplo, 32 o 64 bytes). `std::vector` lo hace automáticamente en la mayoría de compiladores. Con memoria manual, usa alineación explícita:

```cpp
// C++17: operador new alineado
alignas(64) double datos[1024]; // Alineado a 64 bytes
```

## 7. Buenas prácticas

- Escribe bucles **simples y contiguos**; el compilador vectoriza solo.
- Compila con `-O3 -march=native` (o `-mavx2`) en builds de rendimiento.
- Inspecciona la vectorización con `-fopt-info-vec`/`-Rpass`.
- Elimina los bloqueadores (funciones en el bucle, dependencias).
- Usa **`restrict`** si los arreglos no se solapan.
- Vectorización manual (`xsimd`) solo tras medir el cuello de botella.

## 8. Resumen rápido

- **SIMD**: una instrucción procesa varios datos a la vez.
- El compilador **vectoriza solo** bucles simples y contiguos con `-O3`.
- Ramas, llamadas y dependencias bloquean la vectorización.
- `restrict` o `std::span` desbloquean arreglos que no se solapan.
- `xsimd` permite vectorización manual portátil.
- Alineación (`alignas`) ayuda al SIMD máximo.
- Mide siempre: la vectorización solo vale en cuellos de botella reales.

La vectorización es el superpoder del CPU. En el siguiente capítulo veremos las **herramientas de perfilado**: cómo descubrir exactamente dónde se va el tiempo con datos reales, no con suposiciones.
