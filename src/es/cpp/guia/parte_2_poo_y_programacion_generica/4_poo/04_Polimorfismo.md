---
outline: [2, 3]
---

# Polimorfismo

En el capítulo de herencia creamos una jerarquía de clases donde `Perro` y
`Gato` heredaban de `Animal`. Pero si recordamos el ejemplo, había una trampa:
al sobrescribir el método `sonido()`, el comportamiento dependía del tipo de la
variable, no del objeto real. Ese es exactamente el problema que resuelve el
**polimorfismo**.

El polimorfismo (del griego, "muchas formas") es uno de los pilares de la POO y
quizás el más elegante de todos. Nos permite que **un mismo código funcione con
objetos de diferentes clases**, mientras cada objeto se comporte según su
propia naturaleza.

## 1. El problema sin polimorfismo

Imagina que queremos crear un programa que haga sonar a varios animales. Sin
polimorfismo, estaríamos limitados:

```cpp
#include <iostream>
using namespace std;

class Animal {
public:
    void sonido() {
        cout << "Hace un sonido" << endl;
    }
};

class Perro : public Animal {
public:
    void sonido() {
        cout << "¡Guau!" << endl;
    }
};

int main() {
    Animal *animal = new Perro();

    // ¿Qué se imprimirá?
    animal->sonido(); // "Hace un sonido" (usa el método de Animal)

    delete animal;
    return 0;
}
```

Aquí el problema: el puntero es de tipo `Animal`, así que aunque apunte a un
`Perro`, el compilador usa el método de `Animal`. Queremos que se comporte como
el objeto real (un perro), no como el tipo de la variable. Es como tener un
animal en una jaula etiquetada "Animal": aunque dentro haya un perro, si la
etiqueta no se actualiza, todos creerán que solo sabe hacer un sonido genérico.

## 2. La solución: métodos `virtual`

La palabra clave `virtual` le dice al compilador: "este método puede ser
sobrescrito y debe decidirse en tiempo de ejecución según el objeto real".

```cpp
#include <iostream>
using namespace std;

class Animal {
public:
    // 'virtual' habilita el polimorfismo
    virtual void sonido() {
        cout << "Hace un sonido" << endl;
    }
};

class Perro : public Animal {
public:
    // 'override' indica que estamos sobrescribiendo
    void sonido() override {
        cout << "¡Guau!" << endl;
    }
};

class Gato : public Animal {
public:
    void sonido() override {
        cout << "¡Miau!" << endl;
    }
};

int main() {
    Animal *a1 = new Perro();
    Animal *a2 = new Gato();

    a1->sonido(); // ¡Guau!
    a2->sonido(); // ¡Miau!

    delete a1;
    delete a2;
    return 0;
}
```

¿Ves la diferencia? Ambos punteros son de tipo `Animal*`, pero el primero
imprime "¡Guau!" y el segundo "¡Miau!". Gracias a `virtual`, el compilador
mira **qué objeto hay realmente detrás del puntero** y ejecuta la versión
correcta.

::: tip
💡 Con `virtual`, el mismo puntero `Animal*` "descubre" en tiempo de ejecución
qué tipo de objeto real tiene delante y llama a su versión correcta. Eso es
polimorfismo.
:::

## 3. La sintaxis moderna: `override` y `final`

Desde **C++11** tenemos dos palabras clave que hacen el polimorfismo más
seguro:

- `override`: declara explícitamente que un método sobrescribe uno `virtual` de
  la base. Si te equivocas (por ejemplo, en los parámetros), el compilador te
  avisa.

```cpp
class Perro : public Animal {
public:
    void sonido() override { // El compilador verifica que exista el virtual
        cout << "¡Guau!" << endl;
    }
};
```

- `final`: impide que una clase o método se pueda sobrescribir más allá.

```cpp
class Perro : public Animal {
public:
    void sonido() override final { // Ninguna clase puede sobrescribir esto
        cout << "¡Guau!" << endl;
    }
};
```

`final` es como poner un candado a una puerta: nadie más podrá volver a
sobrescribir ese método. Sirve para marcar el límite de la cadena de herencia.

## 4. Polimorfismo en la práctica: un veterinario

El verdadero poder del polimorfismo se ve cuando escribimos **una función que
sirve para todos**:

```cpp
#include <iostream>
using namespace std;

class Animal {
public:
    virtual void sonido() = 0;
};

class Perro : public Animal {
public:
    void sonido() override { cout << "¡Guau!" << endl; }
};

class Gato : public Animal {
public:
    void sonido() override { cout << "¡Miau!" << endl; }
};

// Una sola función, funciona con cualquier animal
void escucharSonido(Animal &animal) {
    animal.sonido();
}

int main() {
    Perro perro;
    Gato gato;

    escucharSonido(perro); // ¡Guau!
    escucharSonido(gato);  // ¡Miau!

    return 0;
}
```

::: info Nota
ℹ️ Fíjate en el `= 0` del método `sonido()`. Eso lo convierte en un **método
virtual puro**, y hace de `Animal` una clase abstracta. Este tema lo
desarrollaremos en el siguiente capítulo.
:::

Sin polimorfismo, tendríamos que escribir una función por cada tipo de animal
(`escucharPerro()`, `escucharGato()`, ...). Con polimorfismo, una sola función
sirve para cualquier futuro animal que añadamos, sin tocar el código existente.
Esto se conoce como **abierto/cerrado**: abierto a extensión, cerrado a
modificación.

## 5. El destructor virtual

Si una clase se usará como base polimórfica, su **destructor debe ser
`virtual`**. Si no, al eliminar un objeto de la clase derivada a través de un
puntero a la base, solo se llamará al destructor de la base, provocando fugas
de memoria.

```cpp
#include <iostream>
using namespace std;

class Animal {
public:
    virtual ~Animal() { // Destructor virtual: necesario
        cout << "Destruyendo Animal" << endl;
    }
    virtual void sonido() = 0;
};

class Perro : public Animal {
public:
    ~Perro() override {
        cout << "Destruyendo Perro" << endl;
    }
    void sonido() override { cout << "¡Guau!" << endl; }
};

int main() {
    Animal *a = new Perro();
    delete a; // Llama a ~Perro() y luego a ~Animal()
    return 0;
}
```

El destructor funciona como una escalera que se baja en orden: primero se
destruye la parte más específica (el perro) y luego la más general (el animal).
Sin `virtual`, esa escalera se rompería y solo se bajaría el último escalón,
dejando la memoria del perro sin limpiar.

::: warning Advertencia
⚠️ Regla práctica: si una clase tiene algún método `virtual`, su destructor
**debe** ser virtual también.
:::

## 6. Polimorfismo y tablas virtuales (vtable)

"Por debajo del capó", el compilador implementa el polimorfismo con una
**tabla de funciones virtuales** (vtable). Cada clase con métodos virtuales
tiene una tabla que apunta a sus métodos reales, y cada objeto guarda un
puntero a esa tabla. Así, al llamar a un método virtual, el programa consulta
la tabla del objeto real.

::: info Nota
ℹ️ No necesitas recordar los detalles de la vtable para programar, pero saber
que existe te ayuda a entender por qué los métodos virtuales tienen un pequeño
costo de rendimiento y por qué cada objeto ocupa unos bytes extra.
:::

## 7. Buenas prácticas

- Marca los métodos que se sobrescribirán como `virtual` en la clase base.
- Usa `override` en todas las sobrescrituras.
- Haz **virtual el destructor** de las clases base polimórficas.
- Diseña funciones que acepten referencias o punteros a la clase base.

## 8. Resumen rápido

- El polimorfismo permite que un mismo código trabaje con objetos de diferentes
  clases.
- `virtual` habilita la resolución en tiempo de ejecución.
- `override` verifica que sobrescribimos correctamente.
- `final` impide seguir sobrescribiendo.
- El destructor de una clase base debe ser `virtual`.
- Un método virtual puro (`= 0`) crea una clase abstracta.

El polimorfismo es lo que hace que el código orientado a objetos sea elegante y
extensible. En el siguiente capítulo veremos las clases abstractas y las
interfaces, que son la herramienta para definir contratos que todas las clases
deben cumplir.