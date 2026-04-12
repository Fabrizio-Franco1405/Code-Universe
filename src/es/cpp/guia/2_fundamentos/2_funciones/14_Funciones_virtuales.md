---
outline: [2, 3]
---

# Funciones Virtuales

En C++, las **funciones virtuales** permiten que un método de una clase base sea **redefinido en clases derivadas**, y que la llamada al método se resuelva en **tiempo de ejecución** en lugar de tiempo de compilación. Esto es esencial para el **polimorfismo dinámico**.

## 1. Concepto básico

Cuando declaramos una función como `virtual` en una clase base, cualquier llamada a esa función a través de un puntero o referencia a la clase base **invocará la versión correspondiente de la clase derivada** si existe.

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    virtual void mostrar() {
        cout << "Función Base" << endl;
    }
};

class Derivada : public Base {
public:
    void mostrar() override { // 'override' es opcional pero recomendado
        cout << "Función Derivada" << endl;
    }
};

int main() {
    Base* obj = new Derivada();
    obj->mostrar(); // Llama a Derivada::mostrar gracias a virtual
    delete obj;
}
```

**Explicación:** Aunque `obj` es un puntero a `Base`, se llama la versión de `Derivada` porque `mostrar` es virtual.

## 2. Reglas importantes

- Una función virtual se declara con la palabra clave `virtual`.

- Se puede redefinir en las clases derivadas usando `override` para mayor claridad.

- La destrucción de objetos derivados a través de punteros a la base **requiere un destructor virtual** para evitar fugas de memoria.

```cpp
class Base {
public:
    virtual ~Base() {} // Destructor virtual
};
```

## 3. Ejemplo práctico

Veamos un ejemplo con varias clases de animales que muestran cómo funcionan las funciones virtuales y el polimorfismo dinámico.

```cpp
#include <iostream>
#include <vector>
using namespace std;

class Animal {
public:
    virtual void hacerSonido() {
        cout << "Sonido genérico" << endl;
    }
    virtual ~Animal() = default; // Destructor virtual
};

class Perro : public Animal {
public:
    void hacerSonido() override {
        cout << "Guau!" << endl;
    }
};

class Gato : public Animal {
public:
    void hacerSonido() override {
        cout << "Miau!" << endl;
    }
};

int main() {
    vector<Animal*> animales = {new Perro(), new Gato(), new Animal()};
    for (auto a : animales) {
        a->hacerSonido(); // Polimorfismo en acción
    }

    for (auto a : animales) delete a; // Destructor virtual asegura limpieza correcta
}
```

**Explicación paso a paso:**

1. **Declaración virtual**: `hacerSonido` en la clase `Animal` se declara como virtual, lo que permite que las llamadas se resuelvan en tiempo de ejecución según el tipo real del objeto.

2. **Override en derivadas**: `Perro` y `Gato` redefinen `hacerSonido` usando `override` para asegurar coincidencia de firma.

3. **Polimorfismo dinámico:**

- `animales` es un vector de punteros a `Animal`.

- Aunque el puntero sea de tipo `Animal*`, la función llamada depende del tipo real del objeto (Perro, Gato, o Animal).

- Por eso imprime "Guau!", "Miau!" y "Sonido genérico" respectivamente.

4. **Destructor virtual:**

- Si el destructor de `Animal` no fuera virtual, al hacer `delete` sobre un objeto derivado, solo se llamaría al destructor de `Animal` y no al de la clase derivada, causando fugas de memoria.

5. **Variantes y buenas prácticas:**

- Se puede usar `Animal&` en lugar de `Animal*` para polimorfismo sin punteros.

- Se recomienda usar `override` y `= default` en destructores para claridad y seguridad.

Con este ejemplo se observa claramente **cómo funcionan las funciones virtuales**, cómo habilitan **polimorfismo**, y por qué los destructores virtuales son cruciales en jerarquías de clases.

## 4. Buenas prácticas

- Usa `override` para redefinir funciones virtuales y evitar errores de firma.

- Declara destructores virtuales si la clase está pensada para ser base.

- Evita abusar de las funciones virtuales en clases pequeñas y triviales, ya que tienen un pequeño costo de rendimiento.

## 5. Resumen rápido

- `virtual` permite polimorfismo dinámico.

- Las llamadas se resuelven en tiempo de ejecución según el tipo real del objeto.

- Los destructores de clases base deben ser virtuales para prevenir fugas de memoria.

- `override` mejora claridad y seguridad del código.