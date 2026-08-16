---
outline: [2, 3]
---

# Funciones Lambda

Las **funciones lambda** son funciones anónimas que se definen directamente en el lugar
donde se necesitan, sin necesidad de declararlas previamente con un nombre. Introducidas
en **C++11**, se han convertido en una herramienta esencial para escribir código más
expresivo y conciso. La palabra "lambda" proviene del cálculo lambda, un modelo
matemático de funciones anónimas creado en los años 30, y aunque suene a algo muy
académico, en la práctica es de las herramientas más amigables y útiles del C++ moderno.

Si en el capítulo anterior ya las presentamos, acá vamos a profundizar: veremos su
sintaxis completa, todas las formas de capturar variables y cómo se integran con la STL.
Es el capítulo donde la lambda pasa de ser "esa cosa entre corchetes" a una herramienta
que usarás todos los días.

## 1. Sintaxis básica

La sintaxis general es la siguiente, y conviene que la memorices desde ya porque la verás
cientos de veces:

```cpp
[capturas](parámetros) -> tipo_retorno {
    // Cuerpo
}
```

Desglosemos cada parte:

- **Capturas (`[]`)**: Indican qué variables del entorno estarán disponibles dentro de la
  lambda. Es lo que le da a la lambda su superpoder: poder "ver" el mundo que la rodea.

- **Parámetros (`()`)**: Funcionan como en cualquier otra función. Acá van los datos que
  la lambda recibe cuando la invocamos.

- **Tipo de retorno (`->`)**: Puede omitirse si el compilador puede deducirlo. En la
  práctica, la mayoría de las lambdas no lo declaran explícitamente.

- **Cuerpo (`{}`)**: Contiene las instrucciones a ejecutar. Es el corazón de la lambda.

Ejemplo básico:

```cpp
#include <iostream>

int main() {
    auto suma = [](int a, int b) { return a + b; };
    std::cout << suma(3, 4) << std::endl; // 7
}
```

Fíjate en los detalles: guardamos la lambda en una variable con `auto`, y luego la
llamamos como si fuera una función normal con `suma(3, 4)`. No tiene nombre, pero vive en
la variable `suma`. Esa es la esencia de una lambda: una función sin nombre que puedes
guardar, pasar o llamar donde la necesites.

## 2. Capturas de variables

Las lambdas pueden capturar variables del contexto donde se definen. Esto se especifica
dentro de `[]`. Es la característica que las distingue de las funciones normales: una
función normal solo puede usar sus parámetros y las variables globales, pero una lambda
puede "traerse" al contexto las variables que necesita.

### 2.1 Captura por valor (`[=]`)

Se copian las variables del entorno al momento de la creación de la lambda. Es como hacer
una fotocopia del valor: lo que pase después con el original no nos afecta.

```cpp
int x = 10;
auto f = [=]() { return x + 5; };
std::cout << f() << std::endl; // 15
```

Cambios posteriores en `x` **no afectan** a la lambda. La lambda se quedó con su propia
copia del valor que había en el momento en que fue creada.

### 2.2 Captura por referencia (`[&]`)

Permite modificar las variables externas directamente. Acá no hay copia: la lambda apunta
a la variable original, así que cualquier cambio que haga se refleja en el exterior.

```cpp
int x = 10;
auto f = [&]() { x += 5; };
f();
std::cout << x << std::endl; // 15
```

::: warning Advertencia
⚠️ Capturar por referencia es muy útil, pero también peligroso: la lambda debe usarse
mientras la variable referenciada siga viva. Si la variable se destruye y la lambda
todavía existe, tendremos un error difícil de detectar. Con las referencias, siempre
piensa en la "vida útil" de las variables.
:::

### 2.3 Captura explícita

Se puede indicar con precisión qué variables capturar y de qué forma, mezclando valores y
referencias según convenga:

```cpp
int a = 5, b = 10;

// Captura 'a' por valor y 'b' por referencia
auto f = [a, &b]() { return a + (++b); };
std::cout << f() << std::endl; // 16
std::cout << b << std::endl;   // 11
```

Acá vemos la mezcla en acción: `a` se captura por valor (la lambda trabaja con una copia),
mientras que `b` se captura por referencia (el `++b` modifica el `b` original, que pasa de
10 a 11). Es la forma más recomendable de capturar: solo lo que necesitas, de la forma que
necesitas.

### 2.4 Captura mutable

Por defecto, las variables capturadas por valor son de solo lectura dentro de la lambda.
Si intentamos modificarlas, el compilador se quejará. Con `mutable`, se permite
modificarlas dentro de la lambda, aunque los cambios no afectan a la variable original:

```cpp
int x = 10;
auto f = [x]() mutable {
    x += 5;
    return x;
};
std::cout << f() << std::endl; // 15
std::cout << x << std::endl;   // 10 (No cambió)
```

::: tip
💡 Fíjate que el `x` original sigue en 10: el `mutable` solo permitió modificar la copia
interna de la lambda. Y un detalle curioso: como la copia es interna, cada llamada a la
lambda conserva los cambios de la llamada anterior, como si la lambda tuviera su propio
"estado" que se va acumulando.
:::

### 2.5 Captura por movimiento (C++14/17)

Con `std::move`, se pueden mover recursos a la lambda. Esto es especialmente útil con
objetos costosos de copiar, como `vector` grandes. En vez de copiar, movemos el recurso
hacia la lambda:

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> datos = {1, 2, 3};

    auto f = [v = std::move(datos)]() {
        for (int n : v) std::cout << n << " ";
    };

    f(); // 1 2 3
    // 'datos' ya no es usable aquí
}
```

La sintaxis `[v = std::move(datos)]` le dice a la lambda: "crea una variable interna `v`
y muévelo los datos de `datos` a ella". El vector `datos` queda vacío y despojado, y la
lambda es la nueva dueña de los elementos.

## 3. Uso de lambdas en la STL

Las lambdas se integran perfectamente con algoritmos de la STL como `std::for_each`,
`std::sort`, `std::find_if`, etc. De hecho, es acá donde brillan de verdad: casi todos
los algoritmos aceptan un predicado o una función de transformación, y la lambda es la
forma más cómoda de proporcionarla.

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> v = {1, 2, 3, 4, 5};

    std::for_each(v.begin(), v.end(), [](int n) {
        std::cout << n * n << " ";
    });
    // Salida: 1 4 9 16 25
}
```

Ejemplo con `std::sort`:

```cpp
std::vector<int> nums = {5, 2, 9, 1};
std::sort(nums.begin(), nums.end(), [](int a, int b) {
    return a < b;
});
```

Fíjate en el patrón: el algoritmo sabe **qué** hacer (recorrer, ordenar), y la lambda le
dice **cómo** (elevar al cuadrado, comparar de menor a mayor). Esa separación de
responsabilidades es lo que hace al código tan limpio y expresivo.

## 4. Ventajas y desventajas

Como toda herramienta, las lambdas tienen fortalezas y debilidades. Es importante
conocerlas para usarlas con criterio:

**Ventajas**

- Código más conciso y expresivo.
- Permiten trabajar con funciones de orden superior (callbacks, predicados, etc.).
- Se integran muy bien con la STL.

**Desventajas**

- Sintaxis puede ser confusa al inicio.
- Excesivo uso de lambdas puede dificultar la lectura del código.
- Capturas mal gestionadas (especialmente referencias) pueden provocar bugs sutiles.

::: info Nota
ℹ️ La clave está en el equilibrio: las lambdas son ideales para lógica corta y local,
como una comparación o un predicado. Pero si una lambda se vuelve demasiado larga y
compleja, probablemente sea mejor extraerla a una función con nombre para que el código
sea más legible.
:::

## 5. Resumen rápido

- Las **lambdas** son funciones anónimas definidas en línea.
- Pueden capturar variables por valor, referencia o movimiento.
- Con `mutable` se permite modificar capturas por valor.
- Son ampliamente utilizadas en la STL y en programación moderna con C++.

Ya dominas las lambdas. Pero hay ocasiones donde necesitas guardarlas, pasarlas o
combinarlas de formas más flexibles, y ahí entran dos utilidades poderosas: en el
siguiente capítulo veremos `std::function` y `std::bind`.