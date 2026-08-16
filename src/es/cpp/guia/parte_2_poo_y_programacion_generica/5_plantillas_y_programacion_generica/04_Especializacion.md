---
outline: [2, 3]
---

# Especialización de plantillas

Las plantillas genéricas son fantásticas... hasta que un tipo concreto
necesita un comportamiento distinto. Por ejemplo, tu plantilla genérica
funciona perfecto con `int`, `double` y `char`, pero con `bool` quieres hacer
algo completamente diferente. ¿Qué hacemos en ese caso?

Para esos momentos, C++ ofrece la **especialización de plantillas**: la
capacidad de escribir una versión específica de una plantilla para un tipo (o
conjunto de tipos) concreto. Es como decirle al compilador: "para este caso
especial, usa esta otra implementación". Piénsalo como tener un plan B listo
para cuando el plan genérico no alcanza.

## 1. ¿Por qué especializar?

Considera este ejemplo simple. Tenemos una plantilla que imprime un valor,
pero para `bool` queremos mostrar "sí/no" en lugar de "1/0":

```cpp
#include <iostream>
using namespace std;

// Plantilla genérica
template <typename T>
void describir(T valor) {
    cout << "Valor: " << valor << endl;
}

int main() {
    describir(42);    // Valor: 42
    describir(true);  // Valor: 1  <- no muy amigable

    return 0;
}
```

El problema es claro: `true` se imprime como `1`, y eso no es muy amigable
para quien lee el resultado. Con una **especialización** para `bool`, podemos
mejorarlo:

```cpp
#include <iostream>
using namespace std;

// Plantilla genérica
template <typename T>
void describir(T valor) {
    cout << "Valor: " << valor << endl;
}

// Especialización para bool
template <>
void describir<bool>(bool valor) {
    cout << "Valor booleano: " << (valor ? "sí" : "no") << endl;
}

int main() {
    describir(42);     // Valor: 42
    describir(true);   // Valor booleano: sí

    return 0;
}
```

::: info Nota
ℹ️ Nota la sintaxis: `template <>` (plantilla vacía) seguido de
`describir<bool>`. Así le indicamos al compilador que esto es una versión
especial para `bool` y que debe usarla en lugar de la genérica.
:::

## 2. Especialización de plantillas de clase

La especialización es aún más común en las **plantillas de clase**. Veamos un
ejemplo clásico con una clase que almacena un valor:

```cpp
#include <iostream>
using namespace std;

// Plantilla genérica
template <typename T>
class Almacen {
private:
    T valor;

public:
    Almacen(T v) : valor(v) {}
    void mostrar() {
        cout << "Almacén genérico: " << valor << endl;
    }
};

// Especialización para bool
template <>
class Almacen<bool> {
private:
    bool valor;

public:
    Almacen(bool v) : valor(v) {}
    void mostrar() {
        cout << "Almacén booleano: " << (valor ? "sí" : "no") << endl;
    }
};

int main() {
    Almacen<int> a(42);
    Almacen<bool> b(true);

    a.mostrar(); // Almacén genérico: 42
    b.mostrar(); // Almacén booleano: sí

    return 0;
}
```

::: tip
💡 Cuando se especializa una clase, la versión especializada puede tener una
implementación completamente distinta: otros atributos, otros métodos, incluso
otro comportamiento público. Son clases totalmente separadas que comparten el
nombre.
:::

## 3. Especialización parcial

La **especialización parcial** ocurre cuando una plantilla con varios
parámetros fija **solo algunos** de ellos. Sigue siendo una plantilla (no una
implementación concreta), pero más específica. Por ejemplo, una plantilla de
dos tipos puede tener una versión especial para cuando ambos son iguales:

```cpp
#include <iostream>
using namespace std;

// Plantilla genérica con dos tipos
template <typename T, typename U>
class Par {
public:
    void mostrar() { cout << "Par genérico" << endl; }
};

// Especialización parcial: cuando ambos tipos son iguales
template <typename T>
class Par<T, T> {
public:
    void mostrar() { cout << "Par con tipos iguales" << endl; }
};

int main() {
    Par<int, double> p1; // Par genérico
    Par<int, int> p2;    // Par con tipos iguales

    p1.mostrar(); // Par genérico
    p2.mostrar(); // Par con tipos iguales

    return 0;
}
```

::: warning Advertencia
⚠️ La especialización **parcial solo está disponible para clases** (y
plantillas de variables), no para funciones. Las funciones solo admiten
especialización total. Para funciones con lógica condicional por tipo, se
usan técnicas como `if constexpr` (C++17) que veremos más adelante.
:::

## 4. Un caso real: `std::vector<bool>`

Un ejemplo histórico de especialización en la propia STL es
`std::vector<bool>`. Por motivos de eficiencia (cada `bool` ocupa 1 byte y
podría caber en 1 bit), la biblioteca estándar especializa `vector<bool>` con
una implementación comprimida en bits.

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<bool> flags(10, false);

    flags[3] = true;
    flags[7] = true;

    for (int i = 0; i < 10; i++) {
        cout << (flags[i] ? "1" : "0");
    }
    cout << endl;

    return 0;
}
```

::: info Nota
ℹ️ `vector<bool>` es un caso polémico en la comunidad, precisamente porque su
comportamiento especial (devuelve objetos proxy en lugar de referencias
reales) puede sorprender. Pero es un gran ejemplo de cómo la especialización
permite adaptar la implementación a un tipo concreto.
:::

## 5. `if constexpr` como alternativa moderna

Desde **C++17**, `if constexpr` permite tomar decisiones en tiempo de
compilación **dentro** de una plantilla, sin necesidad de escribir
especializaciones separadas. Es la forma más cómoda para casos simples:

```cpp
#include <iostream>
#include <type_traits>
using namespace std;

template <typename T>
void imprimir(T valor) {
    if constexpr (is_same_v<T, bool>) {
        cout << "Booleano: " << (valor ? "sí" : "no") << endl;
    } else {
        cout << "Valor: " << valor << endl;
    }
}

int main() {
    imprimir(42);   // Valor: 42
    imprimir(true); // Booleano: sí

    return 0;
}
```

::: tip
💡 `if constexpr` evalúa la condición en tiempo de compilación y elimina el
código que no aplica. En muchos casos, es más legible que las
especializaciones.
:::

## 6. Buenas prácticas

- Especializa solo cuando el comportamiento genérico no sirva para un tipo
  concreto.
- Documenta claramente **por qué** existe cada especialización.
- Prefiere `if constexpr` (C++17) para lógica condicional simple dentro de
  funciones.
- Mantén las especializaciones de clase pequeñas y enfocadas.

## 7. Resumen rápido

- La **especialización** define una implementación concreta para un tipo
  específico.
- `template <>` marca una especialización total.
- La **especialización parcial** fija solo algunos parámetros de la
  plantilla.
- Solo las clases admiten especialización parcial.
- La STL usa especializaciones (como `vector<bool>`).
- `if constexpr` (C++17) es una alternativa moderna para funciones.

La especialización es el mecanismo que hace a las plantillas realmente
flexibles. En el siguiente capítulo veremos uno de los temas más avanzados de
la programación genérica: **SFINAE y los conceptos**.