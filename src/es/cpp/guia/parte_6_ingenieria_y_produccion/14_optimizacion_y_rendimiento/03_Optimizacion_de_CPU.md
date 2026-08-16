---
outline: [2, 3]
---

# Optimización de CPU

En el capítulo anterior dominaste la memoria: contigüidad, localidad, cómo acomodar los datos para
que el programa respire. Ahora toca el **CPU**: conseguir que tu programa ejecute menos
instrucciones y que las que ejecute sean lo más baratas posible. El compilador hace mucho por ti,
pero saber *qué* puede hacer (y qué no) te permite escribir código que se optimiza solo.

Es como entrenar a un chef: la organización (memoria) ya la tienes, la cocina está ordenada y los
ingredientes a mano. Ahora optimizamos sus **movimientos** (CPU): menos pasos, pasos más cortos y
aprovechar que tiene varias manos.

## 1. Compila con optimización

Lo primero (y más simple): activar la optimización del compilador. Parece obvio, pero la cantidad
de gente que se olvida de esto en producción es asombrosa. Recordá la tabla de niveles que vimos
en el capítulo de flags, ahora con la mirada puesta en el rendimiento:

| Flag | Nivel | Uso |
|---|---|---|
| `-O0` | Sin optimizar | Debug |
| `-O1` | Básica | Balance tamaño/velocidad |
| `-O2` | Agresiva | **Recomendada para release** |
| `-O3` | Máxima | Código numérico intensivo |
| `-Os` | Tamaño | Cuando importa el tamaño |

```bash
# Release típico en C++ moderno
g++ -std=c++23 -O2 -DNDEBUG main.cpp -o programa
```

::: warning Advertencia
⚠️ El flag más importante además de `-O2` es **`-DNDEBUG`**: elimina todas las comprobaciones de `assert`, que en debug ralentizan muchísimo el código.
:::

## 2. Las optimizaciones automáticas del compilador

Con `-O2`, el compilador hace auténticos milagros. No es magia: son técnicas de análisis que se
aplican sobre tu código casi sin que te des cuenta:

| Optimización | Qué hace |
|---|---|
| **Inlining** | Sustituye llamadas por el código (evita saltos) |
| **Constant folding** | Calcula expresiones constantes en compilación |
| **Loop unrolling** | Desenrolla bucles para menos saltos |
| **Vectorización** | Usa instrucciones SIMD (múltiples datos a la vez) |
| **Eliminación de código muerto** | Borra lo que no se usa |

Mirá este ejemplo: el compilador es capaz de darse cuenta de que el bucle siempre suma los mismos
números y lo calcula todo en tiempo de compilación:

```cpp
const int MAX = 10;
int total = 0;
for (int i = 0; i < MAX; i++) {
    total += i; // El compilador calcula esto: total = 45
}
```

## 3. `constexpr` y `consteval`: calcula en compilación

Si una función solo depende de constantes, `constexpr` la calcula **sin coste en ejecución**. La
idea es elegante: ¿para qué hacer un cálculo en tiempo de ejecución si el resultado nunca cambia?
Mejor que se calcule una sola vez, al compilar, y que el programa ya arranque con el resultado
listo:

```cpp
// Cálculo en tiempo de compilación
constexpr int factorial(int n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}

int main() {
    constexpr int resultado = factorial(10); // 3628800 (calculado al compilar)
    return resultado;
}
```

Y si querés estar *seguro* de que algo se calcule en compilación, existe `consteval` (desde
C++20), que **obliga** a hacerlo y da error si no es posible:

```cpp
// consteval: OBLIGA a calcular en compilación
consteval int duplicar(int x) {
    return x * 2;
}

int main() {
    constexpr int a = duplicar(21);  // ✔ OK: 42
    int b;
    // int c = duplicar(b);
    // ⚠️ Error: b no es constante, no se puede calcular en compilación
    return 0;
}
```

::: tip
💡 `consteval` (C++20) garantiza evaluación en compilación y da error si no es posible. Perfecto para tablas de consulta precalculadas.
:::

## 4. Evitar bucles redundantes

El cuello de botella más común en código real: **trabajo repetido dentro del bucle**. Cuando un
bucle se ejecuta millones de veces, cualquier operación que hagas adentro se paga millones de
veces. Por eso conviene sacar afuera todo lo que no cambia entre iteraciones:

```cpp
// Malo: la longitud se calcula... y str.length() se repite
// (aunque los compiladores modernos lo optimizan)
void procesar(const string &s) {
    for (size_t i = 0; i < s.length(); i++) {
        // trabajo
    }
}

// Mejor: muévete fuera las operaciones invariantes
void procesar(const string &s) {
    size_t len = s.length(); // Una sola vez
    for (size_t i = 0; i < len; i++) {
        // trabajo
    }
}
```

::: info Nota
ℹ️ La regla general: **mueve fuera del bucle todo lo que no cambia**. El compilador a menudo lo hace solo, pero código claro ayuda.
:::

## 5. Funciones `inline`

Las funciones pequeñas y llamadas a menudo son candidatas a `inline`: el compilador sustituye la
llamada por el cuerpo, evitando el coste del salto. Es como memorizar una receta corta en vez de
tener que abrir el libro de cocina cada vez:

```cpp
// Las funciones pequeñas y frecuentes se inlinan solas con -O2
inline double cuadrado(double x) {
    return x * x;
}

int main() {
    double suma = 0;
    for (int i = 0; i < 1'000'000; i++) {
        suma += cuadrado(i); // Sin coste de llamada
    }
    return 0;
}
```

::: warning Advertencia
⚠️ `inline` es una **sugerencia**, no una orden: el compilador decide. En C++ moderno, confía en `-O2` y usa `inline` solo donde aporta claridad (o para definir funciones en cabeceras sin duplicar símbolos).
:::

## 6. El coste de las abstracciones

Las abstracciones existen para que tu código sea más cómodo y seguro, y eso está muy bien. Pero
ciertas comodidades tienen un coste. Conocerlo te dice dónde mirar cuando algo anda lento:

| Abstracción | Coste | Alternativa si duele |
|---|---|---|
| Llamadas virtuales | Saltos indirectos (no inlineables) | Plantillas/CRTP |
| Excepciones | Solo se pagan si se lanzan (típicamente) | Verificar |
| `std::function` | Heap alloc + indirección | Plantillas/lambdas directas |
| Strings temporales | Asignaciones | `string_view`, buffers |

```cpp
// Un bucle con llamada virtual por iteración
for (auto &figura : figuras) {
    figura->area(); // No inlineable: salto indirecto
}

// Mejor (si es fijo el conjunto): template visitante o std::visit
```

::: tip
💡 La regla: **no optimices las abstracciones antes de medir**. Pero conocer sus costes te dice dónde mirar cuando un perfilador señale un punto caliente.
:::

## 7. Branch prediction: ramas predecibles

Acá tocamos un tema fascinante del hardware moderno. El CPU **predice** los `if` y ejecuta por
adelantado: se anticipa al resultado y prepara el camino. Cuando acierta, todo vuela. Pero
**ramas impredecibles** (aleatorias) rompen la predicción: el CPU se equivoca, descarta todo el
trabajo adelantado y arranca de nuevo. Ese "arrepentimiento" es carísimo:

```cpp
// Datos ordenados: la rama es predecible → rápida
vector<int> datos = ...; // ordenado
long long suma = 0;
for (int v : datos) if (v > 100) suma += v;

// Datos aleatorios: la rama es impredecible → lenta
shuffle(datos.begin(), datos.end(), ...); // ¡Rendimiento cambia!
```

El mismo código, solo que con los datos desordenados, puede ser varias veces más lento. Vale la
pena tenerlo presente: a veces ordenar los datos (o reestructurar la condición) mejora más el
rendimiento que cualquier otra optimización.

## 8. Buenas prácticas

- Compila con `-O2` y `-DNDEBUG` en release.
- Usa `constexpr`/`consteval` para cálculo en compilación.
- Mueve las operaciones invariantes fuera del bucle.
- Confía en `inline` automático; no lo fuerces a mano.
- Conoce el coste de las abstracciones (virtual, `std::function`).
- Mantén las ramas **predecibles** (datos ordenados, condiciones simples).

## 9. Resumen rápido

- `-O2` + `-DNDEBUG` es el comienzo de toda optimización.
- El compilador inlinea, desenrolla, vectoriza y elimina código muerto.
- `constexpr`/`consteval` calculan en compilación (coste cero).
- Saca del bucle lo que no cambia.
- Las llamadas virtuales y `std::function` tienen coste real.
- Las ramas impredecibles rompen la predicción del CPU.

El CPU ya está optimizado. En el siguiente capítulo aprovecharemos su superpoder oculto: la
**vectorización**, procesar varios datos a la vez.