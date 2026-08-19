---
outline: [2, 3]
---

# Rangos y vistas

Piensa en una línea de montaje en una fábrica: cada pieza pasa por varias estaciones (filtrar, transformar, clasificar) sin que nadie tenga que apilar el inventario en cada paso. Eso es lo que aportan **los rangos y las vistas** (C++20): componer algoritmos de la STL como **tuberías elegantes** que se procesan bajo demanda, sin vectores intermedios.

Son la revolución de estilo más importante de C++20: el código que antes era un mar de bucles e iteradores ahora se lee como una frase.

## 1. El problema: Los bucles que se apilan

Con el estilo clásico, transformar datos significaba encadenar bucles y vectores temporales:

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> datos = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

    vector<int> pares;
    for (int v : datos) {
        if (v % 2 == 0) pares.push_back(v);
    }

    vector<int> cuadrados;
    for (int v : pares) {
        cuadrados.push_back(v * v);
    }

    for (int v : cuadrados) {
        cout << v << " ";
    }
    // 4 16 36 64 100
}
```

Funciona, pero es verboso, crea vectores intermedios y mezcla el *qué* con el *cómo*.

## 2. Ranges: Los algoritmos se encadenan

Con **ranges**, los mismos pasos se escriben como una composición única. El algoritmo recibe **el rango completo** y los adaptadores se encadenan con `|`:

```cpp
#include <iostream>
#include <ranges>
#include <vector>
using namespace std;

int main() {
    vector<int> datos = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

    auto resultado = datos
        | views::filter([](int v) { return v % 2 == 0; })   // pares
        | views::transform([](int v) { return v * v; });    // cuadrados

    for (int v : resultado) {
        cout << v << " ";
    }
    // 4 16 36 64 100
}
```

Cada `|` es un **adaptador de rango**: recibe un rango y devuelve otro rango **visto** de otra forma, sin copiar los datos.

::: tip
💡 El `namespace views` se escribe a veces como `std::views`. Con C++23 puedes omitir el prefijo `views::` gracias al argument-dependent lookup.
:::

## 3. Vistas: Procesamiento bajo demanda

La clave de las vistas es el **perezado** (*lazy*): no calculan nada hasta que se itera. La tubería anterior no procesa ningún elemento hasta el `for`.

```cpp
auto es_par = [](int v) { return v % 2 == 0; };
auto cuadrado = [](int v) { return v * v; };

// Ningún cálculo ocurre aquí; solo se describe la tubería
auto vista = datos | views::filter(es_par) | views::transform(cuadrado);

// Aquí sí se procesa, elemento a elemento
for (int v : vista) {
    cout << v << endl;
}
```

Las vistas **no son dueñas de los datos**: observan el rango subyacente sin copiarlo. Si el rango original se destruye mientras la vista sigue viva, tienes una referencia colgante.

::: warning
⚠️ Nunca devuelvas una vista que observe un rango local que muere al salir de la función:
```cpp
auto mala() {
    vector<int> datos = {1, 2, 3};
    return datos | views::filter(...);   // ⚠️ vista colgante
}
```
:::

## 4. Otros adaptadores útiles

`filter` y `transform` son los más conocidos, pero hay más:

```cpp
#include <iostream>
#include <ranges>
#include <vector>
using namespace std;

int main() {
    vector<int> datos = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

    auto primer_tres = datos | views::take(3);        // 1 2 3
    auto sin_los_dos = datos | views::drop(2);        // 3 4 5 ...
    auto pares = datos | views::filter([](int v) { return v % 2 == 0; });
    auto inverso = datos | views::reverse;            // 10 9 8 ...

    auto pares_con_indice = pares | views::enumerate; // (0,2) (1,4) ...

    for (auto [i, v] : pares_con_indice) {
        cout << i << ":" << v << " ";
    }
}
```

`take` y `drop` limitan por cantidad, `reverse` invierte el orden, y `enumerate` añade el índice.

## 5. Rangos propios: Contenedores y rangos generados

Los ranges no solo trabajan con vectores. Cualquier secuencia iterable funciona, y puedes **generar** rangos infinitos:

```cpp
#include <iostream>
#include <ranges>
using namespace std;

int main() {
    auto naturales = views::iota(1);                 // 1, 2, 3, 4, ...
    auto primeros = naturales | views::take(5);      // 1 2 3 4 5

    auto cuadrados = naturales
        | views::transform([](int v) { return v * v; })
        | views::take(5);                            // 1 4 9 16 25

    for (int v : cuadrados) {
        cout << v << " ";
    }
}
```

`views::iota` genera una secuencia **infinita**; combinado con `take` se convierte en un rango finito bajo demanda.

## 6. Beneficios y cuándo usarlos

| Aspecto | Bucles clásicos | Ranges/vistas |
|---|---|---|
| Legibilidad | Alta pero verbosa | Muy alta (expresa *qué*) |
| Copias intermedias | Frecuentes | Ninguna (vistas) |
| Composición | Manual | Con `\|` natural |
| Curva de aprendizaje | Baja | Media |

::: tip
💡 Usa ranges cuando la cadena de operaciones sea de **dos o más pasos**. Para un único filtro o transformación simple, un bucle también es perfectamente claro.
:::

## 7. Resumen rápido

- Los **ranges** permiten pasar el contenedor completo a los algoritmos.
- Las **vistas** (`views::filter`, `views::transform`, ...) componen operaciones con `|`.
- Son **perezosas**: no calculan hasta que se itera, y no copian datos.
- No guardes vistas que observen rangos locales.
- `iota` + `take` generan secuencias infinitas bajo demanda.

Con ranges y vistas, el C++ moderno se lee como una declaración de intenciones. En la siguiente parte entraremos en los **patrones de diseño**: recetas probadas para estructurar programas de forma limpia y mantenible.
