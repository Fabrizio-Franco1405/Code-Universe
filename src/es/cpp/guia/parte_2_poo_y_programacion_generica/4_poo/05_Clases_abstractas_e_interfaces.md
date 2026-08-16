---
outline: [2, 3]
---

# Clases abstractas e interfaces

En el capítulo de polimorfismo apareció un método con un detalle extraño:
`virtual void sonido() = 0;`. ¿Qué significa ese `= 0`? ¿Y qué pasa con
`Animal`, que no tiene implementación real de `sonido()`?

La respuesta nos lleva a dos conceptos fundamentales de la POO: las **clases
abstractas** y las **interfaces**. Son las herramientas que nos permiten
definir *contratos* que las clases deben cumplir.

## 1. ¿Qué es una clase abstracta?

Una **clase abstracta** es una clase que **no puede instanciarse** (no puedes
crear objetos de ella directamente). Su propósito es servir como **base** para
otras clases, definiendo una estructura común pero dejando algunos detalles
para que los implementen las clases derivadas.

Para crear una clase abstracta basta con tener **al menos un método virtual
puro**:

```cpp
virtual void sonido() = 0; // Método virtual puro
```

El `= 0` indica que este método **no tiene implementación** en esta clase. Las
clases derivadas están obligadas a proporcionar su propia versión.

**Ejemplo:**

```cpp
#include <iostream>
using namespace std;

class Animal {
public:
    // Método virtual puro: no tiene cuerpo
    virtual void sonido() = 0;

    // Método normal: sí tiene implementación
    void respirar() {
        cout << "Respirando..." << endl;
    }

    virtual ~Animal() {}
};

class Perro : public Animal {
public:
    void sonido() override {
        cout << "¡Guau!" << endl;
    }
};

int main() {
    // Animal a;
    // ⚠️ Error: no se puede instanciar una clase abstracta

    Perro perro;
    perro.sonido();  // ¡Guau! (implementado por Perro)
    perro.respirar(); // Respirando... (heredado de Animal)

    return 0;
}
```

Fíjate en algo muy interesante: `Animal` tiene un método sin implementar
(`sonido()`), pero también métodos normales con su cuerpo completo
(`respirar()`). Esa combinación es precisamente lo que la hace una clase
abstracta y no una simple interfaz: define lo que todos los animales deben
saber hacer, pero también les comparte un comportamiento ya hecho.

::: info Nota
ℹ️ Una clase derivada que no implemente todos los métodos virtuales puros
también es abstracta. Solo cuando implementa todos se vuelve concreta
(instanciable).
:::

## 2. ¿Qué es una interfaz?

En C++ **no existe la palabra clave `interface`** (a diferencia de otros
lenguajes como Java o C#). En su lugar, una **interfaz** se simula con una
clase abstracta que tiene **solo métodos virtuales puros** y nada más.

Una interfaz define *qué* debe hacer una clase, pero no *cómo* lo hace. Es como
un contrato: "si quieres ser de este tipo, debes implementar estos métodos".

```cpp
#include <iostream>
using namespace std;

// Interfaz: solo métodos virtuales puros
class Conducible {
public:
    virtual void arrancar() = 0;
    virtual void frenar() = 0;
    virtual ~Conducible() {}
};

class Coche : public Conducible {
public:
    void arrancar() override {
        cout << "El coche arranca" << endl;
    }
    void frenar() override {
        cout << "El coche frena" << endl;
    }
};

class Moto : public Conducible {
public:
    void arrancar() override {
        cout << "La moto arranca" << endl;
    }
    void frenar() override {
        cout << "La moto frena" << endl;
    }
};

int main() {
    Coche coche;
    Moto moto;

    coche.arrancar();
    moto.arrancar();

    return 0;
}
```

::: tip
💡 `Conducible` no sabe cómo arranca un coche o una moto, solo exige que ambas
clases tengan esos métodos. Ese es el poder de las interfaces: desacoplar *qué*
se hace de *cómo* se hace.
:::

## 3. Convención de nombres

Como C++ no tiene la palabra `interface`, se suele usar una convención para
distinguirlas:

| Convención | Ejemplo | Uso |
|---|---|---|
| Prefijo `I` | `IDisponible`, `IComparable` | Indica interfaz |
| Nombres terminados en `-able` | `Conducible`, `Serializable` | Indican capacidad |
| Sustantivos | `Figura`, `Forma` | Clases abstractas con algo de comportamiento |

La convención depende del estilo del equipo, pero lo importante es que sea
**consistente**.

## 4. ¿Clase abstracta o interfaz?

| Característica | Clase abstracta | Interfaz (abstracta pura) |
|---|---|---|
| Métodos implementados | Puede tenerlos | No (solo virtuales puros) |
| Atributos | Puede tenerlos | Generalmente no |
| Relación con las hijas | "es un" (comparten estado) | "puede hacer" (comparten capacidades) |
| Cuántas se pueden heredar | Una (herencia simple) | Varias |

**Ejemplo real:** una clase `Figura` abstracta tiene el atributo `color` y el
método `calcularArea()`. Una interfaz `Serializable` solo exige `guardar()`. Un
`Circulo` puede heredar de `Figura` **y** ser `Serializable`:

```cpp
#include <iostream>
using namespace std;

// Clase abstracta
class Figura {
protected:
    string color;

public:
    Figura(string c) : color(c) {}
    virtual double calcularArea() = 0;
    virtual ~Figura() {}
};

// Interfaz
class Serializable {
public:
    virtual void guardar() = 0;
    virtual ~Serializable() {}
};

// Hereda de la clase abstracta e implementa la interfaz
class Circulo : public Figura, public Serializable {
private:
    double radio;

public:
    Circulo(string c, double r) : Figura(c), radio(r) {}

    double calcularArea() override {
        return 3.1416 * radio * radio;
    }

    void guardar() override {
        cout << "Guardando círculo de color " << color << endl;
    }
};

int main() {
    Circulo c("rojo", 5.0);

    cout << "Área: " << c.calcularArea() << endl;
    c.guardar();

    return 0;
}
```

Observa la potencia de combinar ambos mundos: `Circulo` hereda el `color` y la
estructura de `Figura` (porque *es un* figura), y además cumple el contrato de
`Serializable` (porque *puede guardarse*). Un solo objeto puede ser ambas
cosas a la vez.

## 5. Beneficios de usar interfaces

- **Abstracción**: los usuarios ven el "qué", no el "cómo".
- **Polimorfismo**: una función que recibe un `Serializable` acepta cualquier
  objeto que lo implemente.
- **Desacoplamiento**: el código cliente no depende de clases concretas.
- **Extensibilidad**: añadir nuevas implementaciones no requiere tocar el
  código existente.

## 6. Buenas prácticas

- Usa clases abstractas cuando las clases hijas **compartan estado o
  implementación**.
- Usa interfaces cuando solo quieras exigir **capacidades** comunes.
- Nombra las interfaces de forma clara (prefijo `I` o sufijo `-able`).
- Siempre haz `virtual` los destructores de clases abstractas.
- Mantén las interfaces pequeñas y con un solo propósito.

## 7. Resumen rápido

- Una **clase abstracta** no se puede instanciar y tiene al menos un método
  virtual puro (`= 0`).
- Una **interfaz** en C++ es una clase abstracta con solo métodos virtuales
  puros.
- Las clases derivadas deben implementar los métodos virtuales puros para ser
  concretas.
- C++ no tiene la palabra `interface`, pero la convención simula el concepto.
- Se puede heredar de una clase abstracta e implementar varias interfaces a la
  vez.
- Las interfaces desacoplan *qué* se hace de *cómo* se hace.

Con las clases abstractas e interfaces ya tienes las bases completas de la POO.
En los siguientes capítulos veremos temas más profundos: las funciones
virtuales en detalle y la semántica de movimiento en C++ moderno.