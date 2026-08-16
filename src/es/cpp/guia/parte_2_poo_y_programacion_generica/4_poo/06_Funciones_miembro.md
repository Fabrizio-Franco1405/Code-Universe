---
outline: [2, 3]
---

# Funciones miembro en C++

Las **funciones miembro** son aquellas funciones definidas dentro de una clase
o estructura. Constituyen la base de la **programación orientada a objetos en
C++**, ya que permiten que los objetos tengan comportamientos asociados
directamente a sus datos.

## 1. ¿Qué son las funciones miembro?

Una función miembro es cualquier función declarada dentro de la definición de
una clase. Estas funciones tienen acceso a los atributos y otros métodos de la
clase, lo que las convierte en el mecanismo principal para encapsular lógica
junto con los datos.

**Ejemplo básico:**

```cpp
#include <iostream>
using namespace std;

class Persona {
    string nombre;
    int edad;

public:
    // Constructor
    Persona(string n, int e) : nombre(n), edad(e) {}

    // Función miembro
    void mostrarDatos() {
        cout << "Nombre: " << nombre << ", Edad: " << edad << endl;
    }
};

int main() {
    Persona p("Juan", 25);
    p.mostrarDatos(); // Llama a la función miembro
    return 0;
}
```

Fíjate en el detalle clave: `mostrarDatos()` puede usar directamente `nombre` y
`edad` sin que se los pasemos como parámetros. ¿Por qué? Porque al ser una
función miembro, tiene acceso privilegiado a los datos del objeto sobre el que
se llama. Es como un empleado que conoce los archivos de su oficina: no necesita
que se los entreguen en cada reunión.

## 2. Tipos de funciones miembro

Las funciones miembro pueden clasificarse según su nivel de acceso:

- **Públicas:** accesibles desde cualquier parte del programa a través de un
  objeto.

- **Privadas:** solo accesibles dentro de la clase o por funciones/amigas
  declaradas.

- **Protegidas:** accesibles dentro de la clase y también en las clases
  derivadas.

Este nivel de acceso es el que vimos en el capítulo de encapsulación y aplica
igual a las funciones: las públicas son la fachada que se muestra al mundo, las
privadas son las herramientas internas de trabajo y las protegidas se reservan
para la familia (las clases derivadas).

## 3. Funciones miembro dentro y fuera de la clase

Las funciones miembro pueden definirse:

- **Dentro de la clase** (se consideran automáticamente inline).

- **Fuera de la clase** usando el operador de resolución de ámbito `::`.

**Ejemplo:**

```cpp
class Calculadora {
public:
    int sumar(int a, int b); // Declaración
};

// Definición fuera de la clase
int Calculadora::sumar(int a, int b) {
    return a + b;
}
```

¿Y para qué sirve definirlas fuera? En proyectos grandes, las definiciones
dentro de la clase hacen que el archivo se vuelva enorme y difícil de leer. La
práctica más común en el mundo real es dejar dentro de la clase solo la
**declaración** (la "firma") y colocar la **definición** en un archivo `.cpp`
aparte. El `::` es como un apellido: le dice al compilador que esa función
pertenece a la familia `Calculadora`.

## 4. Acceso a miembros con `this`

Dentro de una función miembro, la palabra clave `this` se refiere al puntero al
objeto actual. Esto es útil para **diferenciar atributos de parámetros con el
mismo nombre** o para **retornar el propio objeto**.

```cpp
class Contador {
    int valor;
public:
    Contador(int v = 0) : valor(v) {}

    void incrementar() { this->valor++; }

    Contador& reset() {
        this->valor = 0;
        return *this; // Permite encadenar llamadas
    }
};
```

`this` es un puntero que apunta al propio objeto sobre el que se ejecuta el
método. En `this->valor`, el `->` se lee como "el valor **del** objeto actual".
Y en `return *this;`, al devolver el objeto (con el `*` que desreferencia el
puntero), podemos encadenar llamadas como `objeto.reset().incrementar()`, algo
muy común en las interfaces fluidas.

## 5. Ejemplo práctico

Veamos un caso más completo donde una clase `Rectangulo` define varias
funciones miembro que calculan propiedades geométricas:

```cpp
#include <iostream>
using namespace std;

class Rectangulo {
    double ancho, alto;

public:
    Rectangulo(double a, double h) : ancho(a), alto(h) {}

    // Funciones miembro que operan sobre los atributos
    double area() {
        return ancho * alto;
    }

    double perimetro() {
        return 2 * (ancho + alto);
    }
};

int main() {
    Rectangulo r(5, 3);

    cout << "Área: " << r.area() << endl;
    cout << "Perímetro: " << r.perimetro() << endl;
}
```

**Explicación**

1. La clase `Rectangulo` encapsula dos atributos: `ancho` y `alto`.

2. Se definen **funciones miembro** (`area()` y `perimetro()`) que utilizan esos
   atributos directamente.

3. En el `main`, creamos un objeto `Rectangulo r(5, 3)` y llamamos a sus
   funciones miembro.

4. El resultado muestra cómo los métodos permiten **manipular y consultar datos
   internos del objeto** sin necesidad de exponerlos directamente.

**Salida esperada:**

```
Área: 15
Perímetro: 16
```

Este ejemplo refleja cómo las funciones miembro aportan **cohesión** al
encapsular datos y comportamientos en una misma entidad. Toda la información
del rectángulo vive en un solo lugar, y las operaciones sobre ella están al
alcance de la mano.

## 6. Buenas prácticas

Define funciones miembro **fuera de la clase** si son largas, para mejorar
legibilidad.

Usa `const` en funciones miembro que **no modifican atributos**.

Usa referencias (`&`) al retornar objetos para evitar copias innecesarias.

Mantén la encapsulación: Solo expón funciones que tengan sentido público.

## 7. Resumen rápido

- Las funciones miembro definen el **comportamiento de los objetos**.

- Pueden ser **públicas, privadas o protegidas**.

- Se pueden definir dentro o fuera de la clase (con `::`).

- El puntero `this` permite acceder al objeto actual.

- Son esenciales para la **programación orientada a objetos** en C++.

Con las funciones miembro dominadas, ya conoces el corazón del comportamiento
de las clases. En el siguiente capítulo daremos el salto a un tema que habilita
el polimorfismo en todo su esplendor: las **funciones virtuales**.