---
outline: [2, 3]
---

# Herencia

En la vida real, no reinventamos todo desde cero cada vez que creamos algo
nuevo. Un auto deportivo y un camión son ambos "vehículos": comparten
características como ruedas, motor o velocidad, aunque cada uno añade sus
propias particularidades. Si tuviéramos que definir desde cero cada nuevo tipo
de vehículo, el código se volvería infinito y repetitivo.

La **herencia** en Programación Orientada a Objetos funciona exactamente igual:
nos permite crear **nuevas clases a partir de clases existentes**, reutilizando
sus atributos y métodos y añadiendo o modificando lo que necesitemos.

## 1. ¿Qué es la herencia?

La herencia es el mecanismo que permite que una clase (**derivada** o hija)
herede los miembros de otra clase (**base** o padre).

- **Clase base**: la clase original, más general.
- **Clase derivada**: la clase que hereda y puede añadir o modificar.

**Sintaxis básica:**

```cpp
class ClaseDerivada : public ClaseBase {
    // ... miembros propios
};
```

Fíjate en la parte `: public ClaseBase`. Esos dos puntos indican "heredo de", y
`public` indica el tipo de herencia (lo veremos en detalle en la siguiente
sección).

Ejemplo con vehículos:

```cpp
#include <iostream>
using namespace std;

// Clase base
class Vehiculo {
protected:
    int ruedas;

public:
    Vehiculo(int r) : ruedas(r) {}

    void describir() {
        cout << "Tengo " << ruedas << " ruedas" << endl;
    }
};

// Clase derivada: hereda de Vehiculo
class Coche : public Vehiculo {
private:
    string marca;

public:
    Coche(string m, int r) : Vehiculo(r), marca(m) {}

    void mostrarMarca() {
        cout << "Marca: " << marca << endl;
    }
};

int main() {
    Coche miCoche("Toyota", 4);

    // Método heredado de la clase base
    miCoche.describir();      // Tengo 4 ruedas

    // Método propio de la clase derivada
    miCoche.mostrarMarca();   // Marca: Toyota

    return 0;
}
```

Acá `Coche` no define nada sobre ruedas ni sobre cómo describirse: eso ya lo
trae por herencia de `Vehiculo`. A cambio, `Coche` agrega su propio miembro
`marca` y su método `mostrarMarca()`. Es exactamente como en la vida real: un
auto hereda las ruedas y el motor de "ser un vehículo", pero añade su marca.

::: info Nota
ℹ️ Observa que `describir()` no está definido en `Coche`, pero lo podemos usar
porque fue heredado de `Vehiculo`.
:::

## 2. Tipos de herencia

Al declarar una clase derivada, podemos elegir el especificador de acceso de la
herencia, que afecta cómo se "heredan" los niveles de acceso:

| Herencia | Efecto sobre miembros `public`/`protected` |
|---|---|
| `public` | Se mantienen igual (la más usada) |
| `protected` | Ambos pasan a ser `protected` |
| `private` | Ambos pasan a ser `private` |

::: tip
💡 En la práctica, casi siempre usarás **herencia pública** (`: public`). Las
otras formas son poco comunes y suelen indicar problemas de diseño.
:::

## 3. Niveles de acceso en herencia

En el capítulo de encapsulación vimos `public`, `private` y `protected`. Ahora
es el momento de entender por completo el `protected`:

| Acceso | La propia clase | Clase derivada | Fuera de la clase |
|---|---|---|---|
| `public` | ✅ | ✅ | ✅ |
| `protected` | ✅ | ✅ | ❌ |
| `private` | ✅ | ❌ | ❌ |

El `protected` es perfecto para la herencia: la clase derivada puede acceder a
esos miembros, pero el mundo exterior no. Es un punto intermedio: ni tan abierto
como `public` (que cualquiera puede tocar) ni tan cerrado como `private` (que
ni la propia familia puede usar).

```cpp
class Vehiculo {
protected:
    int ruedas; // Accesible para Coche, pero no para el exterior

public:
    Vehiculo(int r) : ruedas(r) {}
};

int main() {
    Vehiculo v(4);
    // v.ruedas = 6;
    // ⚠️ Error: 'ruedas' es protected, no accesible desde main()
    return 0;
}
```

## 4. El constructor de la clase derivada

La clase derivada **no hereda los constructores** de la clase base (aunque sí
puede usarlos). Para inicializar la parte heredada, la clase derivada debe
llamar al constructor de la base en su lista de inicialización. Es como un
edificio que se construye desde los cimientos: primero se construye la parte de
la base y luego la parte propia.

```cpp
#include <iostream>
using namespace std;

class Animal {
protected:
    string nombre;

public:
    Animal(string n) : nombre(n) {}

    void comer() {
        cout << nombre << " está comiendo" << endl;
    }
};

class Perro : public Animal {
public:
    // Llamamos al constructor de Animal(nombre)
    Perro(string n) : Animal(n) {}

    void ladrar() {
        cout << nombre << " dice: ¡Guau!" << endl;
    }
};

int main() {
    Perro p("Firulais");
    p.comer();   // Firulais está comiendo
    p.ladrar();  // Firulais dice: ¡Guau!
    return 0;
}
```

Fíjate en `Perro(string n) : Animal(n) {}`. El constructor de `Perro` recibe el
nombre y se lo pasa al constructor de `Animal`, porque `nombre` es un miembro
que pertenece a la clase base y solo ella sabe inicializarlo. Ese es el orden
natural: primero se inicializa la parte heredada, luego la propia.

## 5. Sobrescribir métodos (override)

La clase derivada puede **sobrescribir** (redefinir) un método de la clase base
para adaptarlo a sus necesidades. Es como cuando un hijo hereda un apellido
pero forja su propia identidad.

```cpp
#include <iostream>
using namespace std;

class Animal {
public:
    void sonido() {
        cout << "Hace un sonido" << endl;
    }
};

class Gato : public Animal {
public:
    void sonido() {
        cout << "¡Miau!" << endl;
    }
};

int main() {
    Gato gato;
    gato.sonido(); // ¡Miau! (versión sobrescrita)

    return 0;
}
```

Acá la clase `Gato` redefine `sonido()` con su propia versión. El método de la
base sigue existiendo, pero la versión del gato tiene prioridad cuando
llamamos al método desde un objeto `Gato`.

::: warning Advertencia
⚠️ Al sobrescribir un método, ten cuidado: si no es `virtual`, el comportamiento
depende del **tipo de la variable** (no del objeto). El tema de los métodos
`virtual` lo veremos a fondo en el capítulo de polimorfismo.
:::

## 6. Herencia múltiple

A diferencia de otros lenguajes como Java, C++ permite que una clase herede de
**varias clases base** a la vez. Es un superpoder que pocos lenguajes ofrecen:

```cpp
#include <iostream>
using namespace std;

class Nadador {
public:
    void nadar() { cout << "Nadando..." << endl; }
};

class Volador {
public:
    void volar() { cout << "Volando..." << endl; }
};

// Pato hereda de ambas
class Pato : public Nadador, public Volador {
};

int main() {
    Pato pato;
    pato.nadar(); // Nadando...
    pato.volar(); // Volando...
    return 0;
}
```

El pato puede nadar porque hereda de `Nadador` y puede volar porque hereda de
`Volador`. Todo en una sola clase, con los comportamientos de ambas familias.

::: warning Advertencia
⚠️ La herencia múltiple es muy poderosa pero también puede causar ambigüedades
(por ejemplo, si dos clases base tienen un método con el mismo nombre). Úsala
con cuidado y solo cuando realmente aporte.
:::

## 7. ¿Cuándo usar herencia?

- Cuando existe una relación clara **"es un"**: un perro *es un* animal.
- Cuando varias clases comparten comportamiento que conviene centralizar.
- Cuando quieres crear una jerarquía con comportamiento polimórfico.

::: danger Peligro
🛑 No uses herencia solo por reutilizar código. Si la relación no es "es un",
la composición (tener un objeto dentro de otro) suele ser una mejor opción. Un
coche *tiene un* motor (composición), no *es un* motor.
:::

## 8. Buenas prácticas

- Usa herencia pública (`: public`) casi siempre.
- Marca los miembros compartidos como `protected` si los usarán las derivadas.
- Llama al constructor de la clase base desde la lista de inicialización.
- Usa `override` explícitamente cuando sobrescribas un método (lo veremos en
  polimorfismo).
- Prefiere composición sobre herencia cuando no haya una relación "es un".

## 9. Resumen rápido

- La **herencia** permite crear clases nuevas a partir de otras.
- Clase **base** (padre) y clase **derivada** (hija).
- `protected` permite acceso a las clases derivadas pero no al exterior.
- La clase derivada debe llamar al constructor de la base.
- Se puede **sobrescribir** métodos de la base.
- C++ permite **herencia múltiple**.
- Usa herencia cuando exista una relación "es un".

La herencia por sí sola crea jerarquías, pero para explotar todo su poder
necesitamos el siguiente concepto: el **polimorfismo**, que nos permitirá
tratar a los objetos de forma genérica.