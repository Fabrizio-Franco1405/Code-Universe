# Funciones miembro en C++

Las **funciones miembro** son aquellas funciones definidas dentro de una clase o estructura. Constituyen la base de la **programación orientada a objetos en C++**, ya que permiten que los objetos tengan comportamientos asociados directamente a sus datos.

## 1. ¿Qué son las funciones miembro?

Una función miembro es cualquier función declarada dentro de la definición de una clase.  
Estas funciones tienen acceso a los atributos y otros métodos de la clase, lo que las convierte en el mecanismo principal para encapsular lógica junto con los datos.

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

## 2. Tipos de funciones miembro

Las funciones miembro pueden clasificarse según su nivel de acceso:

- **Públicas:** accesibles desde cualquier parte del programa a través de un objeto.

- **Privadas:** solo accesibles dentro de la clase o por funciones/amigas declaradas.

- **Protegidas:** accesibles dentro de la clase y también en las clases derivadas.

## 3. Funciones miembro dentro y fuera de la clase

Las funciones miembro pueden definirse:

- **Dentro de la clase** (se consideran automáticamente inline).

- **Fuera de la clase** usando el operador de resolución de ámbito ::.

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

## 4. Acceso a miembros con `this`

Dentro de una función miembro, la palabra clave `this` se refiere al puntero al objeto actual.
Esto es útil para **diferenciar atributos de parámetros con el mismo nombre** o para **retornar el propio objeto**.

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

## 5. Ejemplo práctico

Veamos un caso más completo donde una clase `Rectangulo` define varias funciones miembro que calculan propiedades geométricas:

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

2. Se definen **funciones miembro** (`area()` y `perimetro()`) que utilizan esos atributos directamente.

3. En el `main`, creamos un objeto `Rectangulo r(5, 3)` y llamamos a sus funciones miembro.

4. El resultado muestra cómo los métodos permiten **manipular y consultar datos internos del objeto** sin necesidad de exponerlos directamente.

**Salida esperada:**
```
Área: 15
Perímetro: 16
```

Este ejemplo refleja cómo las funciones miembro aportan **cohesión** al encapsular datos y comportamientos en una misma entidad.

## 6. Buenas prácticas

Define funciones miembro **fuera de la clase** si son largas, para mejorar legibilidad.

Usa `const` en funciones miembro que **no modifican atributos**.

Usa referencias (`&`) al retornar objetos para evitar copias innecesarias.

Mantén la encapsulación: Solo expón funciones que tengan sentido público.

## 7. Resumen rápido

- Las funciones miembro definen el **comportamiento de los objetos**.

- Pueden ser **públicas, privadas o protegidas**.

- Se pueden definir dentro o fuera de la clase (con `::`).

- El puntero `this` permite acceder al objeto actual.

- Son esenciales para la **programación orientada a objetos** en C++.