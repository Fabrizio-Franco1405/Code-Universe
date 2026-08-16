---
outline: [2, 3]
---

# Plantillas de clase

Si las plantillas de función permiten crear funciones genéricas, las
**plantillas de clase** hacen lo mismo pero para clases completas: nos
permiten definir una clase que funciona con **cualquier tipo de dato**, y el
compilador genera la versión concreta cuando la instanciamos.

Y acá viene la parte que te va a sorprender: ya usas plantillas de clase todo
el tiempo sin darte cuenta. `std::vector<int>`, `std::vector<string>`,
`std::map<string, int>`... ¡Todos son plantillas de clase! Desde el primer
día has estado programando genérico sin saberlo.

## 1. Sintaxis básica

La forma general es muy parecida a la de una función, pero con `class` o
`struct`:

```cpp
template <typename T>
class NombreClase {
    // ... miembros que usan T ...
};
```

Veamos el ejemplo clásico: una **caja** que puede guardar cualquier tipo de
objeto. Piensa en una caja real de tu casa: puede guardar herramientas,
fotos, libros... lo que sea. Nuestra `Caja` será igual de versátil.

```cpp
#include <iostream>
using namespace std;

template <typename T>
class Caja {
private:
    T contenido;

public:
    Caja(T valor) : contenido(valor) {}

    T obtener() {
        return contenido;
    }

    void modificar(T nuevoValor) {
        contenido = nuevoValor;
    }
};

int main() {
    Caja<int> cajaEnteros(42);
    Caja<string> cajaTexto("hola");

    cout << cajaEnteros.obtener() << endl; // 42
    cout << cajaTexto.obtener() << endl;   // hola

    cajaEnteros.modificar(100);
    cout << cajaEnteros.obtener() << endl; // 100

    return 0;
}
```

::: info Nota
ℹ️ A diferencia de las funciones (donde el tipo se deduce), en las clases
**debes especificar el tipo** al instanciar: `Caja<int>`. La deducción de
tipos para clases llegó en C++17 y veremos más adelante cómo simplifica las
cosas.
:::

## 2. Instanciación: cómo se genera la clase

Cada tipo distinto genera una clase distinta. Esto es fundamental para
entender cómo trabajan las plantillas de clase:

```cpp
Caja<int> a(1);      // Genera una clase Caja especializada en int
Caja<string> b("x"); // Genera una clase Caja especializada en string
```

En otras palabras, son dos tipos completamente distintos: `Caja<int>` y
`Caja<string>` no comparten nada más que el código fuente. El compilador crea
dos clases independientes, cada una optimizada para su tipo.

## 3. Métodos definidos fuera de la clase

Cuando definimos métodos de una plantilla de clase **fuera** de ella, la
sintaxis se complica un poco porque debemos repetir `template <typename T>` y
usar el operador de ámbito `::`:

```cpp
#include <iostream>
using namespace std;

template <typename T>
class Caja {
private:
    T contenido;

public:
    Caja(T valor);
    T obtener();
};

// Definiciones fuera de la clase
template <typename T>
Caja<T>::Caja(T valor) : contenido(valor) {}

template <typename T>
T Caja<T>::obtener() {
    return contenido;
}

int main() {
    Caja<int> caja(42);
    cout << caja.obtener() << endl; // 42
    return 0;
}
```

::: tip
💡 Es mucho más común definir las plantillas de clase **completas en el mismo
lugar** (a menudo en un archivo de cabecera `.h`), precisamente para evitar
la sintaxis engorrosa de las definiciones externas.
:::

## 4. Plantillas con varios parámetros de tipo

Como `std::map` (que usa clave y valor), las plantillas de clase pueden tener
varios parámetros. Acá tenemos una clase `Par` que combina dos tipos:

```cpp
#include <iostream>
using namespace std;

template <typename Clave, typename Valor>
class Par {
private:
    Clave clave;
    Valor valor;

public:
    Par(Clave c, Valor v) : clave(c), valor(v) {}

    void mostrar() {
        cout << "Clave: " << clave << ", Valor: " << valor << endl;
    }
};

int main() {
    Par<int, string> par1(1, "uno");
    Par<string, double> par2("pi", 3.1416);

    par1.mostrar(); // Clave: 1, Valor: uno
    par2.mostrar(); // Clave: pi, Valor: 3.1416

    return 0;
}
```

## 5. Parámetros de plantilla no de tipo

Cabe destacar que los parámetros de una plantilla no tienen que ser tipos:
pueden ser **valores** (números, `bool`, punteros). Esto permite crear clases
con un tamaño fijo conocido en tiempo de compilación:

```cpp
#include <iostream>
using namespace std;

template <typename T, int N>
class Arreglo {
private:
    T datos[N];

public:
    T &operator[](int indice) {
        return datos[indice];
    }

    int tamano() {
        return N;
    }
};

int main() {
    Arreglo<int, 5> enteros;
    Arreglo<double, 10> decimales;

    enteros[0] = 100;
    cout << enteros[0] << endl;     // 100
    cout << enteros.tamano() << endl; // 5

    return 0;
}
```

::: info Nota
ℹ️ Esto es exactamente lo que hace `std::array<T, N>` de la biblioteca
estándar: el tamaño `N` es parte del tipo y se conoce en tiempo de
compilación.
:::

## 6. Deducción de tipos (C++17)

Desde **C++17**, podemos dejar que el compilador deduzca el tipo de la
plantilla de clase a partir de los argumentos del constructor. Ya no hace
falta escribir `Caja<int>`, basta con `Caja`:

```cpp
#include <iostream>
using namespace std;

template <typename T>
class Caja {
private:
    T contenido;

public:
    Caja(T valor) : contenido(valor) {}
    T obtener() { return contenido; }
};

int main() {
    // C++17: el compilador deduce T = int
    Caja cajaEnteros(42);

    // C++17: el compilador deduce T = string
    Caja cajaTexto("hola");

    cout << cajaEnteros.obtener() << endl; // 42
    cout << cajaTexto.obtener() << endl;   // hola

    return 0;
}
```

::: tip
💡 Esta característica se llama **CTAD** (*Class Template Argument
Deduction*, deducción de argumentos de plantilla de clase) y hace el código
mucho más limpio. Solo hay que tener cuidado de que el constructor permita
deducir el tipo.
:::

## 7. Buenas prácticas

- Usa nombres descriptivos para los parámetros de tipo (`T`, `Clave`,
  `Valor`).
- Define la plantilla completa en el archivo de cabecera.
- Aprovecha CTAD (C++17) para simplificar la instanciación.
- Prefiere los contenedores de la STL sobre crear tus propias plantillas
  cuando sea posible.

## 8. Resumen rápido

- Las **plantillas de clase** permiten clases genéricas.
- Se instancian con un tipo explícito: `Caja<int>`.
- Cada tipo genera una clase distinta en compilación.
- Pueden tener varios parámetros de tipo y parámetros de valor
  (`template <typename T, int N>`).
- En C++17 el compilador puede deducir el tipo (CTAD).
- La STL (vector, map, string) está hecha con plantillas de clase.

Las plantillas de clase son la herramienta con la que se construye toda la
biblioteca estándar. En el siguiente capítulo veremos cómo adaptar una
plantilla para tipos específicos: la **especialización**.