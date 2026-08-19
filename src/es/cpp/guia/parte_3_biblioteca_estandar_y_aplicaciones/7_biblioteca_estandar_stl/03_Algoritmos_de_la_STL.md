---
outline: [2, 3]
---

# Algoritmos de la STL

Ya tenemos los contenedores, esos lugares donde viven nuestros datos. Pero, ¿y si te
dijéramos que guardar los datos es solo la mitad de la historia? En la práctica, lo que
realmente hacemos la mayor parte del tiempo es **procesarlos**: ordenarlos, buscarlos,
contarlos, transformarlos. Y justo para eso existen los **algoritmos de la STL**.

Si los contenedores guardan los datos, los algoritmos los procesan. ¿Necesitas ordenar,
buscar, contar o transformar elementos? La biblioteca estándar ya tiene una función
probada y optimizada para casi todo. No necesitas reinventar la rueda: solo llamar a la
función correcta. En el fondo, es como tener un chef profesional a tu disposición: tú
solo le dices qué platillo quieres y él lo prepara con las mejores técnicas.

Estos algoritmos viven en el encabezado `<algorithm>` (y algunos en `<numeric>`).

## 1. La idea: Algoritmos genéricos

La gran virtud de los algoritmos de la STL es que **no están atados a un contenedor
concreto**. Funcionan con **iteradores** (que veremos en el próximo capítulo), así que
sirven igual para `vector`, `list`, `deque` o arreglos. Eso es el poder de la
programación genérica que estudiamos en plantillas: escribimos la lógica una sola vez y
funciona para todo.

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> numeros = {5, 2, 8, 1, 9, 3};

    // Ordenar de menor a mayor
    sort(numeros.begin(), numeros.end());

    for (int n : numeros) {
        cout << n << " "; // 1 2 3 5 8 9
    }
    cout << endl;

    return 0;
}
```

Piensa en lo que significa este pequeño programa: con una sola línea (`sort`) ordenamos
todo el vector. No tuvimos que escribir el algoritmo de ordenación a mano, ni preocuparnos
por los detalles de cuántos intercambios se hacen. La STL se encarga de todo, y lo hace
con una implementación probada durante años.

## 2. Los algoritmos más esenciales

Vamos a ver los que usarás con más frecuencia en tu día a día como programador. Son
pocos, pero cubren la mayoría de las necesidades cotidianas.

### 2.1 Ordenar: `sort`

Ordena un rango. Por defecto lo hace de menor a mayor, pero puedes pasarle una función de
comparación para personalizar el criterio:

```cpp
vector<int> v = {5, 2, 8, 1};

sort(v.begin(), v.end());                        // 1 2 5 8
sort(v.begin(), v.end(), greater<int>());        // 8 5 2 1 (descendente)
sort(v.begin(), v.end(), [](int a, int b) {      // Orden personalizado
    return a > b;
});
```

En la tercera línea ya estás viendo una **lambda** en acción, ese recurso moderno que
estudiaremos a fondo más adelante. Por ahora, basta con entender que nos permite decirle
al algoritmo "ordena con este criterio" sin tener que definir una función aparte.

::: tip
💡 Si no te importa mantener el orden original, usa `sort`. La versión `stable_sort`
conserva el orden de elementos iguales pero es algo más lenta. Solo la necesitas cuando
ese detalle sea importante, como al ordenar una lista de jugadores por puntaje sin
romper el orden alfabético que ya tenían.
:::

### 2.2 Buscar: `find` y `find_if`

`find` busca un valor concreto; `find_if` busca el primero que cumple una condición.
Son el equivalente moderno de recorrer a mano buscando algo, pero con la garantía de
estar bien implementados.

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> v = {4, 7, 2, 9, 6};

    // Buscar un valor concreto
    auto it = find(v.begin(), v.end(), 9);
    if (it != v.end()) {
        cout << "Encontrado: " << *it << endl;
    } else {
        cout << "No encontrado" << endl;
    }

    // Buscar el primer número par
    auto par = find_if(v.begin(), v.end(), [](int n) {
        return n % 2 == 0;
    });
    if (par != v.end()) {
        cout << "Primer par: " << *par << endl; // 4
    }

    return 0;
}
```

::: warning Advertencia
⚠️ Si `find` no encuentra nada, devuelve `end()`. **Siempre** comprueba el resultado antes
de usarlo, o desreferenciar un `end()` es un error. Es una de las advertencias más
importantes de la STL: nunca asumas que el elemento existe.
:::

### 2.3 Contar: `count` y `count_if`

Cuenta cuántas veces aparece un valor o cuántos cumplen una condición. Muy útil para
estadísticas simples sin escribir un bucle manual:

```cpp
vector<int> v = {1, 2, 3, 2, 4, 2};

int total = count(v.begin(), v.end(), 2);          // 3
int pares = count_if(v.begin(), v.end(),
    [](int n) { return n % 2 == 0; });             // 4 (2, 2, 2, 4)
```

### 2.4 Aplicar una operación: `for_each`

Aplica una función a cada elemento. Es como decirle a la STL: "haz esto con cada uno de
los elementos de la lista":

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3, 4};

    for_each(v.begin(), v.end(), [](int &n) {
        n *= 2; // Duplicamos cada elemento
    });

    for (int n : v) {
        cout << n << " "; // 2 4 6 8
    }
    cout << endl;

    return 0;
}
```

Fíjate en el detalle de `int &n`: al pasar el elemento por referencia, los cambios que
hacemos dentro de la lambda sí afectan al vector original. Si usáramos `int n` (por
valor), estaríamos modificando una copia y no veríamos ningún resultado.

### 2.5 Transformar: `transform`

Crea un nuevo rango aplicando una función a cada elemento del original. Mientras que
`for_each` modifica en el lugar, `transform` te deja construir un resultado nuevo a
partir del original:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> original = {1, 2, 3, 4};
    vector<int> cuadrado(original.size());

    transform(original.begin(), original.end(), cuadrado.begin(),
        [](int n) { return n * n; });

    for (int n : cuadrado) {
        cout << n << " "; // 1 4 9 16
    }
    cout << endl;

    return 0;
}
```

### 2.6 Eliminar y compactar: `remove` + `erase`

Este es un truco muy usado, y esconde una de esas cosas que sorprenden al principio.
`remove` **no borra físicamente** los elementos: lo que hace es mover los elementos que
queremos conservar hacia el inicio del contenedor y devuelve el iterador donde termina la
zona "válida". Después, `erase` se encarga de borrar el resto.

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3, 2, 4, 2};

    // "Eliminar" los 2 y compactar
    v.erase(remove(v.begin(), v.end(), 2), v.end());

    for (int n : v) {
        cout << n << " "; // 1 3 4
    }
    cout << endl;

    return 0;
}
```

¿Por qué es así? Porque el algoritmo genérico no sabe (ni debe saber) cómo borrar
elementos de cada contenedor concreto: eso es responsabilidad del contenedor. El algoritmo
hace su parte (reorganizar) y el contenedor hace la suya (borrar de verdad).

::: tip
💡 Este patrón `erase(remove(...), end())` es tan común que tiene un nombre: **erase-remove
idiom**. Es la forma estándar de eliminar elementos de un `vector`. Verás esta línea miles
de veces en código profesional, así que conviene que te acostumbres a leerla de una
mirada.
:::

## 3. Algoritmos de `<numeric>`

Además de `<algorithm>`, el encabezado `<numeric>` trae algoritmos matemáticos. La estrella
de este grupo es `accumulate`, que nos permite acumular resultados sobre una secuencia:

```cpp
#include <iostream>
#include <vector>
#include <numeric>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3, 4, 5};

    int suma = accumulate(v.begin(), v.end(), 0);
    cout << "Suma: " << suma << endl; // 15

    int producto = accumulate(v.begin(), v.end(), 1,
        [](int a, int b) { return a * b; });
    cout << "Producto: " << producto << endl; // 120

    return 0;
}
```

El tercer argumento de `accumulate` es el **valor inicial**: con `0` obtenemos una suma,
y con `1` un producto. En la segunda versión, la lambda personaliza la operación que se
aplica en cada paso, lo que convierte a `accumulate` en una herramienta muy flexible.

## 4. Ordenar objetos personalizados

Los algoritmos funcionan con cualquier tipo, siempre que definamos cómo compararlos. Con
`sort` y una lambda podemos ordenar objetos de una clase propia sin ningún problema. Es
ahí donde se nota de verdad el poder de la programación genérica:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Alumno {
    string nombre;
    double nota;
};

int main() {
    vector<Alumno> alumnos = {
        {"Ana", 8.5},
        {"Carlos", 6.0},
        {"María", 9.0}
    };

    // Ordenar por nota de mayor a menor
    sort(alumnos.begin(), alumnos.end(),
        [](const Alumno &a, const Alumno &b) {
            return a.nota > b.nota;
        });

    for (const auto &alumno : alumnos) {
        cout << alumno.nombre << ": " << alumno.nota << endl;
    }

    return 0;
}
```

La lambda le dice a `sort` exactamente cómo comparar dos registros: miramos su nota y
devolvemos `true` si el primero debe ir antes. Sin tocar la estructura `Alumno`, sin
sobrecargar operadores, sin complicaciones. Esa sencillez es la magia de las lambdas.

## 5. El poder de combinar

Los algoritmos se pueden encadenar y combinar para resolver problemas complejos en muy
pocas líneas. Por ejemplo, contar los números pares mayores que 3 en un solo paso:

```cpp
vector<int> v = {1, 4, 2, 6, 7, 8, 9};

int resultado = count_if(v.begin(), v.end(), [](int n) {
    return n > 3 && n % 2 == 0;
});
cout << resultado << endl; // 3 (4, 6, 8)
```

En lugar de escribir un bucle con un `if` anidado y una variable contadora, expresamos
la intención directamente: "cuenta los elementos que cumplen esta condición". El código
se lee casi como lenguaje natural, y eso es justo lo que buscamos.

## 6. Buenas prácticas

- Usa los algoritmos de la STL **antes de escribir un bucle manual**: son probados y
  optimizados. Si existe una función para lo que necesitas, úsala.
- Comprueba siempre los iteradores devueltos por `find` contra `end()`.
- Usa el patrón **erase-remove** para eliminar elementos de vectores.
- Pasa funciones de comparación cuando necesites órdenes personalizados.
- Prefiere `for_each` y `transform` para expresar la intención claramente.

## 7. Resumen rápido

- Los algoritmos de la STL trabajan con **iteradores**, funcionando con cualquier
  contenedor.
- `sort` ordena; `find`/`find_if` buscan; `count`/`count_if` cuentan.
- `for_each` aplica una operación; `transform` crea un nuevo rango.
- El patrón **erase-remove** elimina elementos de un vector.
- `<numeric>` aporta `accumulate` y otros algoritmos matemáticos.
- Los algoritmos aceptan **lambdas** para personalizar su comportamiento.

Los algoritmos son la mitad del poder de la STL, pero sin **iteradores** no podrían
funcionar. Son ellos el puente que conecta contenedores y algoritmos, y en el siguiente
capítulo entenderemos este concepto clave.