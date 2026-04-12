# Sobrecarga de funciones

En C++, la **sobrecarga de funciones** permite definir varias funciones con el **mismo nombre**, siempre que sus **parámetros** (tipo, número o ambos) sean diferentes.

Esto mejora la legibilidad y la reutilización, ya que el mismo nombre expresa operaciones similares con distintas variantes.

## 1. Concepto básico

Cuando el compilador encuentra una llamada a una función, selecciona la versión correcta (resolución de sobrecarga) analizando los **argumentos pasados**.

```cpp
#include <iostream>
using namespace std;

void imprimir(int x) {
    cout << "Entero: " << x << endl;
}

void imprimir(double x) {
    cout << "Double: " << x << endl;
}

void imprimir(string s) {
    cout << "Cadena: " << s << endl;
}

int main() {
    imprimir(10);         // Llama a imprimir(int)
    imprimir(3.14);       // Llama a imprimir(double)
    imprimir("Hola");     // Llama a imprimir(string)
}
```

## 2. Reglas de sobrecarga

1. La diferencia debe estar en la **lista de parámetros**:

- Número de parámetros.

- Tipos de parámetros.

- Orden de parámetros.

2. No se puede diferenciar solo por el **tipo de retorno**:
```cpp
int f();
double f();  // ❌ Error: Ambigüedad, mismo nombre y parámetros [!code error]
```

3. Los **argumentos predeterminados** pueden complicar la sobrecarga si generan ambigüedad:
```cpp
void mostrar(int x, int y = 0);
void mostrar(int x);  // ❌ Ambigüedad al llamar mostrar(5) [!code error]
```

Evita definiciones que generen ambigüedad para el compilador.

## 3. Sobrecarga y referencias

El compilador distingue entre referencias normales, referencias constantes y punteros.

```cpp
void procesar(int& x);       // Recibe una referencia modificable
void procesar(const int& x); // Recibe una referencia constante

int main() {
    int a = 5;
    const int b = 10;

    procesar(a); // Llama a procesar(int&)
    procesar(b); // Llama a procesar(const int&)
}
```

## 4. Sobrecarga y `const` en funciones miembro

En métodos de clase, la palabra clave `const` forma parte de la firma.
Por lo tanto, se puede sobrecargar un mismo método en versiones constante y no constante.

```cpp
class Texto {
    string contenido;
public:
    string& get() { return contenido; }             // Versión no const
    const string& get() const { return contenido; } // Versión const
};
```

## 5. Sobrecarga y conversiones automáticas

El compilador puede aplicar conversiones implícitas para resolver llamadas, pero esto puede generar ambigüedad:
```cpp
void f(int x);
void f(double x);

int main() {
    f('A'); // ¿int o double? -> Normalmente int, pero puede ser confuso
}
```

Cuando la sobrecarga pueda llevar a conversiones automáticas poco claras, conviene usar **cast explícitos** o cambiar el diseño para evitar ambigüedad.

## 6. Ejemplo práctico

Veamos un ejemplo completo con una clase `Calculadora` que utiliza **sobrecarga de funciones** para realizar sumas con distintos tipos de datos:

```cpp
#include <iostream>
using namespace std;

class Calculadora {
public:
    // Sobrecarga para enteros
    int sumar(int a, int b) {
        return a + b;
    }

    // Sobrecarga para números con punto flotante
    double sumar(double a, double b) {
        return a + b;
    }

    // Sobrecarga para cadenas de texto
    string sumar(string a, string b) {
        return a + b;
    }
};

int main() {
    Calculadora calc;

    cout << calc.sumar(3, 4) << endl;             // Enteros
    cout << calc.sumar(2.5, 4.1) << endl;         // Dobles
    cout << calc.sumar("Hola, ", "Mundo!") << endl; // Cadenas
}
```

**Explicación paso a paso**

1. La clase `Calculadora` define tres funciones `sumar` con el mismo nombre pero con **tipos de parámetros diferentes**.

2. El compilador selecciona automáticamente la función correcta según los argumentos proporcionados.

3. Esto evita tener que usar nombres distintos para operaciones semánticamente similares.

4. La sobrecarga mejora la **legibilidad** y permite reutilización de código sin ambigüedad si se siguen buenas prácticas.

**Salida esperada**

```
7
6.6
Hola, Mundo!
```

**Análisis**

- La sobrecarga se basa en **tipo y número de parámetros**, no en el tipo de retorno.

- Permite a la misma operación (`sumar`) aplicarse a **enteros, decimales y cadenas** sin duplicar lógica en distintos nombres de función.

- Es recomendable documentar claramente cada versión sobrecargada, especialmente en APIs complejas.

## 7. Buenas prácticas

- Usa la sobrecarga solo cuando el nombre de la función tenga **sentido semántico común**. Ejemplo: `imprimir(int)`, `imprimir(double)`.

- Evita combinaciones que introduzcan **ambigüedad** con conversiones implícitas o argumentos predeterminados.

- Documenta claramente las variantes sobrecargadas, especialmente en APIs grandes.

## 8. Resumen rápido

- Permite varias funciones con el mismo nombre, diferenciadas por parámetros.

- No se puede sobrecargar solo con el tipo de retorno.

- `const` En métodos de clase forma parte de la firma → Permite sobrecarga adicional.

- Ten cuidado con conversiones implícitas y argumentos predeterminados que puedan generar ambigüedad.