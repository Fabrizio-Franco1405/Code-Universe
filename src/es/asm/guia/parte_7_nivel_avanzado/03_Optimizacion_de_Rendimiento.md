---
outline: [2, 3]
---

# Optimización de rendimiento

Escribes en ensamblador, entre otras cosas, para ir rápido. Pero la velocidad en el mundo real no se logra solo con instrucciones cortas: hay una ciencia detrás, que involucra la caché, la predicción de saltos y, sobre todo, **medir antes de tocar**. Este capítulo te da las técnicas que separan el ensamblador "que compila" del ensamblador "que vuela".

## 1. La primera regla: Mide

La tentación de "optimizar" sin datos es la más común y la más dañina. La disciplina profesional tiene un orden estricto:

1. **Mide** para encontrar el cuello de botella real.
2. **Optimiza** solo ese punto.
3. **Mide otra vez** para confirmar la mejora.

Las herramientas de medición del mundo Linux:

```bash
time ./programa            # tiempo total del programa
perf stat ./programa       # contadores de hardware (caché, saltos)
perf record ./programa     # captura el perfil de ejecución
perf report                # dónde se pasó el tiempo
```

- `time` da una primera idea bruta.
- `perf` muestra contadores internos: fallos de caché, predicciones erróneas, ciclos.
- El perfil te dice **la línea exacta** donde se gasta el tiempo.

Sin esta medición, optimizas a ciegas. El 80% del tiempo suele concentrarse en el 20% del código; encontrar ese 20% es la mitad del trabajo.

:::info Nota
ℹ️ La regla se conoce como el **principio de Pareto** aplicado al código: concentra tus esfuerzos donde el tiempo realmente se va, no donde sospechas que se va.
:::

## 2. La caché manda

En el capítulo de la memoria viste la jerarquía. Ahora veamos sus consecuencias prácticas: **acceder a la RAM es el costo dominante** de la mayoría de los programas. La estrategia es ser *cache friendly*:

- **Accede en orden:** los datos contiguos se cargan en bloque a la caché (localidad espacial).
- **Vuelve a lo mismo:** reutilizar datos recientes evita recargarlos (localidad temporal).
- **Evita saltos erráticos:** los accesos "a salto de mata" destrozan la caché.

```text
; BUENO: recorre el arreglo en orden
mov rcx, cantidad
mov rsi, arreglo
bucle:
    add rax, [rsi]
    add rsi, 8
    loop bucle

; MALO: accede a saltos (arreglo[i*100]) — cada acceso es una nueva carga
```

- El primer bucle lee elementos contiguos: la caché los precarga en ráfagas.
- El segundo accede disperso: casi cada lectura es un fallo de caché (hasta 100x más lento).

La diferencia entre ambos no se ve en el ensamblador "conceptual": se ve en los contadores de `perf`. Un fallo de caché L3 cuesta cientos de ciclos; una suma de registro, uno o dos.

:::warning Advertencia
⚠️ Antes de optimizar el número de instrucciones, piensa en el **acceso a memoria**. Un bucle con 5 instrucciones pero mal localizado puede ser más lento que uno de 20 bien alineado con la caché. Los datos importan más que las instrucciones.
:::

## 3. Saltos y predicción

Los procesadores modernos **adivinan** qué camino tomará un salto para mantener el pipeline lleno. Si adivinan mal, descartan trabajo y empiezan de nuevo: un **miss** de predicción cuesta decenas de ciclos.

```text
; Patrón predecible: el salto casi siempre sigue el mismo camino
    cmp rax, limite
    jb  procesar          ; normalmente se cumple

; Patrón aleatorio: la predicción falla la mitad de las veces
    test rbx, rbx
    jnz  camino_a         ; impredecible
```

- Los bucles largos son predecibles: el procesador aprende el patrón.
- Los saltos basados en datos aleatorios (búsqueda binaria con datos desordenados, por ejemplo) son trampas para el predictor.
- Reducir saltos condicionales en el bucle caliente suele mejorar el rendimiento.

Una técnica clásica para reducir saltos es la **ramificación sin saltos** (usando aritmética selectiva), pero en ensamblador básico lo importante es: mantén los bucles largos y los caminos predecibles, y evita `jmp`/`je` dentro del bucle más interno cuando puedas.

## 4. Pequeñas victorias en el bucle

Los bucles internos son el lugar donde cada ciclo cuenta. Algunas técnicas que los compiladores aplican y que tú puedes replicar:

**Usar `lea` para aritmética combinada:**

```text
; en lugar de: add rsi, 8  +  add rax, [rsi]
lea rax, [rax + rbx*2]     ; multiplica y suma en un solo paso
```

- `lea` hace suma y multiplicación por potencias de 2 sin tocar banderas.
- Combina dos operaciones en una, y evita dependencias entre instrucciones.

**Desenrollar el bucle (loop unrolling):**

```text
; en lugar de procesar 1 elemento por vuelta...
    add rax, [rsi]
    add rsi, 8
    loop bucle

; ...procesa 4 por vuelta
    add rax, [rsi]
    add rax, [rsi+8]
    add rax, [rsi+16]
    add rax, [rsi+24]
    add rsi, 32
    sub rcx, 4
    jnz bucle
```

- El desenrollado reduce las "vueltas de control" (decremento, salto, predicción) por dato procesado.
- Cada vuelta hace más trabajo útil entre las operaciones de control.
- Se usa moderadamente: demasiado desenrollado infla el código y daña la caché de instrucciones.

:::tip
💡 El desenrollado es la técnica de la que todos hablan y pocos necesitan. Úsala solo cuando `perf` te confirme que el control del bucle es un costo real, no por intuición.
:::

## 5. Optimizar por encima de todo: ¿cuándo parar?

El ensamblador te da el control máximo, pero eso no significa que debas maximizarlo todo. La sabiduría profesional:

- **Optimiza lo medido:** sin perfil, no toques nada.
- **Prioriza claridad:** el código se lee muchas veces y se escribe una; la optimización que lo vuelve ilegible es una deuda.
- **Compara con la versión simple:** guarda el baseline; si tu optimización no da una mejora medible, reviértela.

```bash
time ./version_simple
time ./version_optimizada
```

- Mide ambas versiones con los mismos datos.
- Si la mejora es marginal (menos del 5-10%), el costo en complejidad no vale la pena.
- La mejor optimización suele ser **la que se evita** en el código que no la necesita.

La meta no es "escribir el ensamblador más rápido del mundo", sino "escribir el ensamblador correcto para el problema medido".

## Resumen rápido

- **Mide antes de optimizar**: `time`, `perf stat`, `perf report`.
- La **caché manda**: acceso contiguo, reutiliza datos, evita saltos erráticos.
- Los **misses de predicción** de saltos cuestan decenas de ciclos: bucles predecibles.
- `lea` combina aritmética; el **desenrollado** reduce el control del bucle.
- Optimiza solo lo medido y revierte lo que no mejora nada.

Con la velocidad bajo control, falta la otra cara de la moneda del poder: la **seguridad**. En el próximo capítulo veremos las vulnerabilidades clásicas de la memoria y cómo el ensamblador te permite entenderlas (y evitarlas) de raíz.