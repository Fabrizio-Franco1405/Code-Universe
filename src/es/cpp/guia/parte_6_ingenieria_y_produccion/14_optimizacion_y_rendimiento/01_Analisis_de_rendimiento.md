---
outline: [2, 3]
---

# Análisis de rendimiento

C++ es famoso por su velocidad, pero esa velocidad **no es automática**: hay que entender dónde se gasta el tiempo y la memoria. El análisis de rendimiento es el arte de **medir antes de optimizar**, porque adivinar sin medir casi siempre lleva a optimizar lo que no importa.

Imagina que tu coche va lento. ¿Cambiarías el volante porque "seguro que es eso"? No: primero medirías qué pieza falla. En rendimiento pasa igual: **primero se mide, después se optimiza**.

## 1. La regla de oro: mide antes de optimizar

El 90% del tiempo de un programa suele estar en el 10% del código (la **regla 90/10**). Optimizar el otro 90% es trabajo perdido.

```
Ejemplo real: programa que tarda 100 segundos
  │
  ├── 70 s  función A  ← optimizar ESTA
  ├── 25 s  función B
  └──  5 s  resto
```

::: tip
💡 Optimizar A puede reducir el total a 30 s. Optimizar el "resto" a cero solo ahorra 5 s. **Primero mide**, luego ataca el cuello de botella real.
:::

## 2. Complejidad: el primer indicador

Antes de optimizar, pregunta por la **complejidad algorítmica** (big-O). A menudo el cuello de botella es elegir mal la estructura de datos:

```cpp
// Malo para búsquedas frecuentes: O(n)
vector<string> nombres;
bool existe = find(nombres.begin(), nombres.end(), "Ana") != nombres.end();

// Mejor si buscas mucho: O(log n)
set<string> nombres;
bool existe = nombres.count("Ana") > 0;
```

| Estructura | Búsqueda | Inserción | Uso ideal |
|---|---|---|---|
| `vector` | O(n) | O(1) final | Datos contiguos, recorrer |
| `set`/`map` | O(log n) | O(log n) | Búsquedas frecuentes |
| `unordered_map` | O(1) medio | O(1) medio | Búsquedas por clave |
| `list` | O(n) | O(1) | Inserciones en medio |
## 3. Medir el tiempo con `std::chrono`

La forma más simple de medir: cronometrar con `std::chrono`:

```cpp
#include <iostream>
#include <chrono>
#include <vector>
using namespace std;
using namespace chrono;

int main() {
    vector<int> datos(10'000'000);

    auto inicio = high_resolution_clock::now();

    // Código a medir
    long long suma = 0;
    for (int v : datos) suma += v;

    auto fin = high_resolution_clock::now();
    auto duracion = duration_cast<milliseconds>(fin - inicio);

    cout << "Suma = " << suma << ", tardó " << duracion.count() << " ms" << endl;
    return 0;
}
```

::: warning Advertencia
⚠️ Compila con optimización (`-O2` o Release) al medir. Sin optimizar, las mediciones son engañosas y a menudo el compilador hace cosas raras con tu código "por debajo".
:::

## 4. Medir varias veces, usar el mínimo

Las mediciones tienen ruido (sistema operativo, otros procesos). Mide **varias veces** y quédate con el **mínimo** (el menos afectado por el ruido):

```cpp
auto mejor = nanoseconds::max();

for (int repeticion = 0; repeticion < 10; repeticion++) {
    auto inicio = high_resolution_clock::now();
    // ... código a medir ...
    auto fin = high_resolution_clock::now();
    mejor = min(mejor, duration_cast<nanoseconds>(fin - inicio));
}

cout << "Mejor tiempo: " << mejor.count() << " ns" << endl;
```

## 5. Los niveles de análisis
| Nivel | Herramienta | Pregunta |
|---|---|---|
| 1. Complejidad | Big-O, revisión de código | ¿Elegí bien la estructura de datos? |
| 2. Tiempo | `std::chrono`, `clock()` | ¿Cuánto tarda cada parte? |
| 3. Perfilado | profilers (perf, VTune) | ¿Qué función consume más? |
| 4. Memoria | Valgrind, sanitizers | ¿Cuánta memoria uso? ¿Dónde? |
| 5. Hardware | cache misses, branch misses | ¿Está el CPU haciendo su trabajo? |
En los próximos capítulos veremos los niveles 2 a 5 en detalle.

## 6. El anti-patrón del "premature optimization"

Donald Knuth lo dijo hace décadas: *"La optimización prematura es la raíz de todos los males"*. Optimizar sin medir:

- Complejiza el código sin beneficio real.
- A veces incluso **empeora** el rendimiento (confunde al compilador).
- Tiene un coste de mantenimiento continuo.

::: warning Advertencia
⚠️ Escribe código **claro y correcto** primero. Después mide. Después optimiza solo lo que demuestre ser un problema. Esta es la disciplina profesional.
:::

## 7. Buenas prácticas

- **Mide siempre** antes de optimizar.
- Empieza por la **complejidad**: ¿elegiste bien las estructuras de datos?
- Compila con `-O2`/Release al medir.
- Mide varias veces y usa el **mínimo**.
- Optimiza el **cuello de botella**, no lo que te gustaría que fuera el problema.
- Documenta cada optimización con su medición antes/después.

## 8. Resumen rápido

- Regla 90/10: el 10% del código consume el 90% del tiempo.
- **Primero mide, después optimiza.**
- La complejidad (big-O) es el primer diagnóstico.
- `std::chrono` cronometra; mide varias veces y usa el mínimo.
- Compila con optimización al medir.
- La optimización prematura es la raíz de todos los males.

Ya sabes medir. En el siguiente capítulo atacaremos el primer gran recurso: **optimizar la memoria**.
