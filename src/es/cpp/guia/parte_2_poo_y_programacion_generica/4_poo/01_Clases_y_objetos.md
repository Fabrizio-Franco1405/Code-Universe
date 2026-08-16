---
outline: [2, 3]
---

# Clases y objetos

Bienvenido a una de las partes más importantes de C++: la **Programación
Orientada a Objetos (POO)**. Recuerda que al inicio de la guía hablamos de que
C++ nació como una extensión de C precisamente para añadir estas capacidades.
Ahora es el momento de descubrirlas en toda su dimensión.

La POO no es solo una técnica de programación, sino una forma de **pensar** y
organizar el código. En lugar de tener funciones sueltas que manipulan datos
separados, agrupamos **datos y comportamiento** en entidades llamadas
**objetos**, de la misma manera que en la vida real una persona no es solo su
nombre ni solo sus acciones, sino la combinación de ambas cosas. Para
entenderlo, primero necesitamos conocer los dos conceptos centrales: la
**clase** y el **objeto**.

## 1. ¿Qué es una clase?

Una **clase** es una "plantilla" o "molde" que define las características
(atributos) y comportamientos (métodos) que tendrán los objetos creados a
partir de ella.

Piensa en una clase como el molde de una galleta: el molde define la forma de
todas las galletas, pero no es una galleta en sí. Cada galleta que hacemos con
ese molde es un **objeto**. El molde por sí solo no se puede comer, pero
determina con exactitud cómo será cada galleta que salga de él. De la misma
manera, la clase `Perro` no es un perro, pero define qué datos y qué
comportamientos tendrá todo perro que creemos a partir de ella.

**Sintaxis básica:**

```cpp
class Perro {
public:
    string nombre;
    int edad;

    void ladrar() {
        cout << "¡Guau guau!" << endl;
    }
};
```

Acá:

- `class Perro` define la clase.
- `nombre` y `edad` son **atributos** (datos).
- `ladrar()` es un **método** (comportamiento).
- `public:` indica que estos miembros son accesibles desde fuera de la clase
  (veremos esto a fondo en el próximo capítulo).

Fíjate en el detalle más importante de todos: la clase reúne en un solo lugar
lo que un perro **es** (sus datos) y lo que un perro **hace** (su
comportamiento). Esa unión entre datos y comportamiento es la esencia misma de
la POO.

## 2. ¿Qué es un objeto?

Un **objeto** es una **instancia concreta** de una clase. Es la "galleta"
creada con el molde. Cada objeto tiene sus propios valores para los atributos,
pero comparte los métodos definidos en la clase. En otras palabras: `firulais`
y `max` serán dos perros completamente distintos, cada uno con su nombre y su
edad, pero ambos sabrán ladrar porque provienen del mismo molde.

**Creando objetos:**

```cpp
#include <iostream>
using namespace std;

class Perro {
public:
    string nombre;
    int edad;

    void ladrar() {
        cout << "¡Guau guau!" << endl;
    }
};

int main() {
    // Creamos dos objetos de la clase Perro
    Perro firulais;
    Perro max;

    // Cada objeto tiene sus propios valores
    firulais.nombre = "Firulais";
    firulais.edad = 3;

    max.nombre = "Max";
    max.edad = 5;

    cout << firulais.nombre << " tiene " << firulais.edad << " años" << endl;
    cout << max.nombre << " tiene " << max.edad << " años" << endl;

    // Ambos usan el mismo método
    firulais.ladrar();
    max.ladrar();

    return 0;
}
```

Observa cómo accedemos a los miembros usando el punto (`.`): `firulais.nombre`.
Ese punto se lee como "de", es decir, "el nombre **de** firulais". Cada objeto
tiene su propio espacio de datos, por eso `firulais.edad` vale `3` mientras que
`max.edad` vale `5`, sin que jamás se mezclen entre sí.

## 3. Analogía: molde y galleta

Para fijar el concepto, usemos la analogía del molde, una de las formas más
claras que existen de visualizar la relación entre clase y objeto:

| Concepto POO | Analogía |
|---|---|
| Clase | El molde de galletas |
| Objeto | Cada galleta hecha con el molde |
| Atributos | El color, tamaño o sabor de cada galleta |
| Métodos | La receta que se aplica a cada galleta |

La clase es la "fábrica" y el objeto es el "producto final". Sin clase no hay
molde, y sin molde no habría galletas consistentes entre sí.

## 4. El constructor: inicializar objetos

Cuando creamos un objeto, normalmente queremos que sus atributos empiecen con
valores. Imagina tener que asignar nombre y edad manualmente cada vez que creas
un perro: sería tedioso y muy fácil de olvidar en medio del código. Para eso
existen los **constructores**: funciones especiales que se ejecutan
automáticamente al crear el objeto y que tienen el mismo nombre que la clase.

```cpp
#include <iostream>
using namespace std;

class Perro {
public:
    string nombre;
    int edad;

    // Constructor
    Perro(string nombreInicial, int edadInicial) {
        nombre = nombreInicial;
        edad = edadInicial;
    }

    void ladrar() {
        cout << "¡Guau guau!" << endl;
    }
};

int main() {
    // Al crear el objeto, el constructor se ejecuta automáticamente
    Perro firulais("Firulais", 3);
    Perro max("Max", 5);

    cout << firulais.nombre << " tiene " << firulais.edad << " años" << endl;

    return 0;
}
```

El constructor tiene una característica especial: **se ejecuta solo**. Tú no
tienes que llamarlo, ocurre en el mismo instante en que el objeto nace. Por eso
vemos `Perro firulais("Firulais", 3)`: entre los paréntesis pasamos los datos
que el constructor usará para dejar al objeto listo desde el primer segundo de
su existencia.

::: tip
💡 El constructor nos evita el paso extra de asignar atributos uno por uno
después de crear el objeto. Es la forma correcta y segura de inicializarlo.
:::

## 5. Diferencia entre `class` y `struct`

En un capítulo anterior vimos los `structs`. La gran diferencia con `class` es
el **acceso por defecto**:

| Tipo | Acceso por defecto | Uso típico |
|---|---|---|
| `struct` | Público | Agrupar datos simples |
| `class` | Privado | Encapsular datos + comportamiento |

En C++ moderno, la regla práctica es: usa `struct` para datos simples y `class`
cuando quieras encapsulación y comportamiento. Es una convención de diseño que
los demás programadores agradecerán, porque al leer `struct` ya saben que
tienen delante un simple contenedor de datos.

## 6. Buenas prácticas

- Nombra las clases con **mayúscula inicial** (`Perro`, `CuentaBancaria`).
- Agrupa en una clase datos y métodos que estén **relacionados**.
- Usa constructores para inicializar los objetos.
- Define una sola clase principal por archivo.

## 7. Resumen rápido

- Una **clase** es un molde o plantilla.
- Un **objeto** es una instancia concreta de la clase.
- Los **atributos** son los datos del objeto.
- Los **métodos** son los comportamientos del objeto.
- El **constructor** inicializa los objetos automáticamente.
- `class` usa acceso privado por defecto; `struct`, público.

Ahora que sabes crear clases y objetos, el siguiente paso es aprender a
**proteger** los datos de esos objetos mediante la encapsulación, uno de los
pilares de la POO. En el siguiente capítulo veremos cómo convertir tus clases
en "cajas seguras" que nadie pueda romper desde afuera.