---
outline: [2, 3]
---

# Patrones de optimización

A lo largo del módulo has visto cómo medir, cómo optimizar memoria y CPU, cómo vectorizar y cómo
perfilar. Este capítulo cierra con los **patrones de optimización**: los trucos probados que
aparecen una y otra vez en el código de alto rendimiento. No son ideas sueltas, sino recetas que
se repiten en cualquier proyecto serio.

Como un chef experimentado que tiene sus atajos: no reinventa la técnica cada vez, aplica los
trucos que sabe que funcionan. Vos, igual que él, vas a empezar a reconocer estos patrones apenas
los veas aparecer en código ajeno.

## 1. Memoización: No recalcular lo ya calculado

Si una función se llama muchas veces con los mismos argumentos, **guarda** los resultados y
devuélvelos sin recalcular. A eso se le llama **memoización**, y es uno de los trucos más
rentables que existen. El ejemplo clásico es Fibonacci, una función que sin caché es
brutalmente ineficiente porque recalcula lo mismo una y otra vez:

```cpp
#include <iostream>
#include <map>
using namespace std;

// Memoización con unordered_map: calcula una vez, reutiliza siempre
long long fibonacci(int n) {
    static unordered_map<int, long long> cache;

    if (n <= 1) return n;
    if (cache.count(n)) return cache[n];

    long long resultado = fibonacci(n - 1) + fibonacci(n - 2);
    cache[n] = resultado;
    return resultado;
}

int main() {
    cout << fibonacci(50) << endl; // Instántaneo gracias a la caché
    return 0;
}
```

::: info Nota
ℹ️ Sin memoización, `fibonacci(50)` tarda minutos. Con ella, milisegundos. Cambiar espacio (caché) por tiempo es uno de los patrones más rentables.
:::

## 2. Early exit: Devuelve pronto

El **early exit** consiste en salir del bucle y de la función **lo antes posible**. Cada
comprobación temprana ahorra trabajo, porque no tiene sentido seguir recorriendo datos cuando ya
encontraste lo que buscabas:

```cpp
// Sin early exit: siempre comprueba todos
bool tieneNegativo(const vector<int> &v) {
    bool encontrado = false;
    for (int x : v) {
        if (x < 0) encontrado = true;
    }
    return encontrado; // Sigue recorriendo aunque ya encontró
}

// Con early exit: se detiene en el primer negativo
bool tieneNegativo(const vector<int> &v) {
    for (int x : v) {
        if (x < 0) return true; // Listo, salimos
    }
    return false;
}
```

El mismo principio se aplica en funciones: validá los casos triviales primero y salí apenas
puedas:

```cpp
// También en funciones
void procesar(const Datos &d) {
    if (d.vacio()) return;        // Caso trivial: salimos ya
    if (d.tamano() > MAX) return; // Caso inválido: salimos ya
    // Trabajo real...
}
```

::: tip
💡 El *early exit* no solo es rápido: además hace el código **más legible**, porque elimina anidamiento de `else` innecesarios.
:::

## 3. Guard clauses (cláusulas de guarda)

Muy relacionado con el anterior: las **guard clauses** validan los **casos especiales primero**
con `if` cortos que salen, y dejan el flujo principal limpio. La diferencia es radical, y se ve
mejor que con mil palabras:

```cpp
// Sin guard clauses: anidado y confuso
void guardar(Usuario &u) {
    if (u.nombreValido()) {
        if (u.emailValido()) {
            if (u.edadValida()) {
                u.guardar();
            } else {
                cout << "Edad inválida" << endl;
            }
        } else {
            cout << "Email inválido" << endl;
        }
    } else {
        cout << "Nombre inválido" << endl;
    }
}

// Con guard clauses: claro y temprano
void guardar(Usuario &u) {
    if (!u.nombreValido()) { cout << "Nombre inválido" << endl; return; }
    if (!u.emailValido())  { cout << "Email inválido" << endl; return; }
    if (!u.edadValida())   { cout << "Edad inválida" << endl; return; }
    u.guardar();
}
```

Fijate cómo el anidamiento desaparece: cada validación es una línea, y cuando llegás a `u.guardar()`
sabés que todo está bien porque ya pasaste todas las puertas.

## 4. Reutilización de buffers

Crear y destruir buffers repetidamente es caro, porque cada creación implica pedir memoria al
sistema y cada destrucción, devolverla. **Reutiliza** los buffers cuando la estructura de datos lo
permite:

```cpp
// Malo: asigna y libera en cada iteración
for (int i = 0; i < 10000; i++) {
    vector<int> datos(1000);
    procesar(datos);
}

// Bien: un solo buffer reutilizado
vector<int> datos;
datos.reserve(1000);
for (int i = 0; i < 10000; i++) {
    datos.clear();      // Resetea sin liberar
    procesar(datos);    // Sin asignaciones nuevas
}
```

La clave está en `clear()`: vacía el vector pero **conserva la memoria ya asignada**. Así, en
lugar de 10000 asignaciones, hacés una sola.

## 5. Mover antes de copiar

Las copias de objetos pesados cuestan. Si el objeto va a morir o no se va a usar más, **mueve**
en lugar de copiar. La buena noticia es que el C++ moderno hace esto casi gratis por vos:

```cpp
vector<string> cargarNombres();

// Copia innecesaria
vector<string> nombres = cargarNombres();
procesar(nombres);

// Movimiento: sin copias (NRVO/move)
vector<string> nombres = cargarNombres(); // el compilador mueve
```

```cpp
// En parámetros y retornos, el movimiento es automático
string construirMensaje() {
    string msg = "Hola ";
    msg += "mundo";
    return msg; // Se mueve, no copia
}
```

En estos casos ni siquiera tenés que escribir `std::move`: el compilador detecta que el valor va a
dejar de usarse y mueve solo. La regla es simple: si no vas a necesitar el original, no copies.

## 6. Loop fusion y tiling

Dos técnicas de bucles que mejoran el uso de la caché. **Loop fusion** fusiona dos bucles que
recorren los mismos datos en uno solo, para recorrer la caché una sola vez:

```cpp
// Dos pasadas sobre los datos
for (int i = 0; i < n; i++) a[i] *= 2;
for (int i = 0; i < n; i++) a[i] += b[i];

// Fusionado: una sola pasada (mejor para la caché)
for (int i = 0; i < n; i++) {
    a[i] *= 2;
    a[i] += b[i];
}
```

En lugar de leer los datos dos veces (una por cada pasada), los leés una sola vez. Y **loop
tiling** recorre una matriz **por bloques** que caben en la caché en lugar de fila por fila. Al
procesar bloques chicos que entran completos en la caché, evitás que cada acceso tenga que ir a la
memoria principal:

```cpp
// Matriz grande: recorre por bloques de 64 que caben en caché
for (int bi = 0; bi < N; bi += 64)
    for (int bj = 0; bj < N; bj += 64)
        for (int i = bi; i < min(bi + 64, N); i++)
            for (int j = bj; j < min(bj + 64, N); j++)
                c[i][j] = a[i][j] * b[i][j];
```

## 7. El patrón de optimización completo

Todas las técnicas del módulo se pueden resumir en un patrón de revisión. Cuando tengas un punto
caliente delante, recorré esta lista como un checklist:

```
1. ¿Complejidad bien elegida?        → estructuras de datos (big-O)
2. ¿Copias evitadas?                 → const&, move, emplace
3. ¿Asignaciones minimizadas?        → reserve, buffers reutilizados
4. ¿Localidad buena?                 → contigüidad, SoA, fusion
5. ¿Vectorización posible?           → bucles simples, -O3
6. ¿Ramas predecibles?               → ordenar, guard clauses
7. ¿Medido y verificado?             → perf, comparar antes/después
```

::: warning Advertencia
⚠️ Este patrón es una **guía de revisión**, no una lista de obligaciones. Aplica solo lo que el perfilador indique: cada optimización sin medir es una apuesta, no una mejora.
:::

## 8. Buenas prácticas

- Aplica **un patrón a la vez** y mide el efecto de cada uno.
- La memoización y el early exit son los más rentables para empezar.
- Mantén el código legible: la optimización no es excusa para oscurecerlo.
- Comenta **qué** optimizaste y **por qué** (con la medición).
- Revisa el patrón completo cuando un hotspot persista.

## 9. Resumen rápido

- **Memoización**: caché de resultados para no recalcular.
- **Early exit / guard clauses**: sal pronto, valida primero.
- **Reutilizar buffers**: evita asignaciones repetidas.
- **Mover en vez de copiar**: el C++ moderno lo hace casi gratis.
- **Loop fusion/tiling**: menos pasadas, mejor caché.
- Sigue el patrón de optimización completo y **mide cada cambio**.

Con esto cerramos el módulo de optimización y rendimiento. Ha llegado el momento final de la guía:
el **proyecto final**, donde aplicaremos absolutamente todo lo aprendido.