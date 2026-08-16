---
outline: [2, 3]
---

# Herramientas de perfilado

En el primer capítulo de este módulo viste la regla de oro: **mide antes de optimizar**. Y acá es
donde esa regla cobra vida. El perfilado es la herramienta definitiva para medir: te dice, con
datos reales, **qué función consume más tiempo**, cuánta memoria usa tu programa y dónde se fuga.

Imagina un médico que diagnostica con ecografías y análisis, no a ojo. El perfilador es la
ecografía de tu programa: sin él, estás adivinando cuál es la parte lenta; con él, la respuesta
aparece en pantalla con números.

## 1. Los dos tipos de perfilado

Existen dos grandes enfoques para perfilar, y conviene entender la diferencia porque cada uno
responde una pregunta distinta:

| Tipo | Mide | Herramientas |
|---|---|---|
| **Sampling** | Dónde se gasta el tiempo (muestreo) | perf, VTune |
| **Instrumentación** | Cada llamada, su tiempo exacto | gprof, Valgrind callgrind |

El **sampling** es el más usado: el perfilador interrumpe el programa mil veces por segundo y mira
qué función se ejecutaba en ese instante. Es barato y apenas cambia el rendimiento. Es como tomar
una fotografía del programa en momentos aleatorios: con suficientes fotos, sabés dónde está
pasando más tiempo.

## 2. Los perfiladores de CPU

Hay varias herramientas según tu plataforma y lo que necesites medir:

| Herramienta | Plataforma | Notas |
|---|---|---|
| `perf` | Linux | El estándar, sin instrumentar |
| `VTune` (Intel) | Linux/Windows | Muy completo, con caché y RAM |
| `gprof` | Linux/Windows | Instrumentación clásica |
| `Valgrind callgrind` | Linux/macOS | Muy detallado, lento |
| `Visual Studio Profiler` | Windows | Integrado en el IDE |

### `perf` en Linux

`perf` es el estándar en Linux y vale la pena verlo en acción porque es el que más vas a usar. Su
uso es simple: primero compilás con símbolos de depuración para que el perfilador pueda "leer" los
nombres de tus funciones, y después grabás la ejecución:

```bash
# Compila con símbolos de depuración
g++ -O2 -g -o programa main.cpp

# Perfila
perf record ./programa
perf report   # Interactivo: las funciones con más tiempo arriba
```

El resultado es una lista con las funciones **más calientes** (hotspots), ordenadas por tiempo:

```
99.30%  programa  programa  [.] procesar_datos   ← el cuello de botella
 0.40%  programa  programa  [.] leer_archivo
```

::: tip
💡 La regla: el perfilador **nunca miente**. Si dice que `procesar_datos` es el 99% del tiempo, esa es la función a optimizar, aunque tú pensaras que era otra.
:::

## 3. Sanitizadores: detectar bugs de memoria

Los **sanitizadores** del compilador son otra pieza clave del diagnóstico: detectan errores de
memoria *al ejecutar*. La idea es brillante: el compilador inyecta comprobaciones extra en tu
código que se activan cuando pasa algo malo:

```bash
# AddressSanitizer: detecta fugas, accesos fuera de límites
g++ -O1 -g -fsanitize=address -o prog main.cpp
./prog

# UndefinedBehaviorSanitizer: detecta comportamiento indefinido
g++ -O1 -g -fsanitize=undefined -o prog main.cpp
./prog
```

Mirá este caso: el código compila perfecto, el programa incluso corre... y sin embargo está usando
memoria que ya no le pertenece. ASan lo caza al vuelo:

```cpp
int *p = new int(5);
delete p;
*p = 10; // ⚠️ ASan detecta: "heap-use-after-free"
```

::: warning Advertencia
⚠️ Los sanitizadores ralentizan el programa (entre 2x y 10x): úsalos en **debug**, nunca en el build de release.
:::

## 4. Valgrind: fugas de memoria

**Valgrind** es otro clásico, y se distingue porque analiza memoria y fugas **sin recompilar**.
Simplemente lo ejecutás sobre tu programa:

```bash
valgrind --leak-check=full ./programa
```

Y te reporta, con lujo de detalle, dónde se perdió memoria:

```
==1234== 8 bytes in 1 blocks are definitely lost in loss record 1
==1234==    at 0x...: operator new(unsigned long)
```

Para leer esos reportes, hay tres categorías que conviene conocer:

- **definitely lost**: fuga real (tú perdiste la referencia).
- **indirectly lost**: fuga a través de otra fuga.
- **still reachable**: no es fuga (sigue referenciada al terminar).

::: info Nota
ℹ️ Valgrind es lento (10-50x), pero da **la verdad absoluta** sobre fugas. Perfecto para una pasada de auditoría antes de publicar.
:::

## 5. Medir la caché: cache misses

Los profilers avanzados (VTune, perf con eventos) van más allá del tiempo de CPU y muestran los
**cache misses**: accesos a memoria que no encontraron el dato en caché. Es una información
valiosísima porque, como viste en el capítulo de memoria, los accesos a RAM son mucho más lentos
que los de caché:

```bash
# perf con eventos de caché
perf stat -e cache-misses,cache-references ./programa
```

| Métrica | Qué indica |
|---|---|
| `cache-misses / cache-references` | Ratio de fallos de caché |
| Alto ratio | Acceso disperso o mala localidad |

El ratio de fallos de caché se reduce con las técnicas del capítulo de memoria (contigüidad, SoA,
compactación). En otras palabras: perfilar la caché te dice *cuándo* aplicar esas técnicas.

## 6. El flujo profesional de perfilado

Perfilar no es un evento único, es un proceso. El flujo profesional se parece a esto:

1. **Perfila** (sampling) → identifica la función caliente.
2. **Analiza** la función (¿código? ¿datos? ¿algoritmo?).
3. **Optimiza** con la técnica adecuada.
4. **Mide de nuevo** → ¿mejoró? ¿Se movió el cuello de botella?

```
perfila → identifica → optimiza → mide → (repetir)
```

::: warning Advertencia
⚠️ **Cuidado con las optimizaciones que cambian el "shape" del programa**: al optimizar un hotspot, otro se convierte en el nuevo cuello de botella. El perfilado es un proceso iterativo, no de una sola pasada.
:::

## 7. Buenas prácticas

- Compila con `-g` para que los símbolos se vean en el perfilador.
- Perfila **release** (`-O2`), no debug.
- Usa perfiles con datos **realistas**, no de juguete.
- Ataca un hotspot a la vez y **mide de nuevo** cada cambio.
- Usa sanitizadores en CI (AddressSanitizer, UBSan).
- Valgrind al final, antes de publicar.

## 8. Resumen rápido

- **Perfilado por sampling**: barato, te dice dónde va el tiempo.
- `perf` (Linux) y VTune son los estándares de CPU.
- **ASan/UBSan** detectan bugs de memoria en debug.
- **Valgrind** detecta fugas con total certeza (pero es lento).
- El ratio de **cache misses** revela problemas de localidad.
- Perfila → optimiza → mide de nuevo: es un ciclo.
- Los perfiles deben usar datos realistas y release.

Con las herramientas dominadas, en el siguiente capítulo cerramos el módulo con los **patrones de
optimización**: los trucos probados que aparecen una y otra vez en el código de alto rendimiento.