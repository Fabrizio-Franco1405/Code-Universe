---
outline: [2, 3]
---

# Tipos y literales

En C++, cada valor que usas en tu programa tiene un **tipo** que define qué clase de dato es, cómo se almacena en memoria y qué operaciones puedes realizar con él. Un **literal** es un valor escrito directamente en el código, sin estar guardado en una variable.

Entender los tipos y literales son fundamentales porque el compilador necesita saber exactamente qué tipo de dato estás manejando para reservar memoria, aplicar reglas de conversión y detectar errores.

## 1. Tipos de datos fundamentales

Los tipos de datos fundamentales permiten representar **valores de diferentes naturalezas**: Lógicos, numéricos, caracteres, etc. A continuación se detallan los más comunes junto con su tamaño y rango aproximado en sistemas de 64 bits con Windows:

| Tipo | Memoria | Rango |
| ---- | ---- | ---- |
| `bool` | 1 byte | `true` o `false` |
| `char` | 1 byte | -128 a 127 o 0 a 255 |
| `unsigned char` | 1 byte | 0 a 255 |
| `signed char` | 1 byte | -127 a 127 |
| `wchar_t` | 2 bytes | Depende de la implementación del compilador |
| `float` | 4 bytes | +/- 3.4e +/- 38 (~7 dígitos) |
| `double` | 8 bytes | +/- 1.7e +/- 308 (~15 dígitos) |
| `int` | 4 bytes | -2147483648 a 2147483647 |
| `unsigned int` | 4 bytes | 0 a 4294967295 |
| `signed int` | 4 bytes | -2147483648 a 2147483647 |
| `short int` | 2 bytes | -32768 a 32767 |
| `unsigned short int` | 2 bytes | 0 a 65,535
| `signed short int` | 2 bytes | -32768 a 32767 |
| `long int` | 4 bytes | -2,147,483,648 a 2,147,483,647 |
| `signed long int` | 4 bytes | -2,147,483,648 a 2,147,483,647 |
| `unsigned long int` | 4 bytes | 0 a 4,294,967,295 |
| `long double` | 8 bytes | +/- 1.7e +/- 308 (~15 dígitos) |

:::info Nota
ℹ️ Los tamaños y rangos indicados son típicos en sistemas de 64 bits con Windows. En otros compiladores o sistemas operativos pueden variar. Usa `sizeof(tipo)` para verificarlo en tu entorno.
:::

## 2. Literales

Un literal es un valor constante escrito directamente en el código. Representa datos sin necesidad de ser almacenados en variables. Se clasifican según su tipo y su forma de declaración.

### 2.1. Literales enteros

Representan números enteros, positivos o negativos, y pueden declararse en distintas bases: decimal, hexadecimal, octal o binaria. 

**Ejemplo práctico:**
```cpp
#include <iostream>
using namespace std;

int main() {
    int decimal = 42;         // Decimal
    int negativo = -7;        // Decimal negativo
    unsigned int u = 42u;     // Unsigned
    int hex = 0x2A;           // Hexadecimal
    int oct = 052;            // Octal
    int bin = 0b101010;       // Binario (C++14+)

    cout << "Decimal: " << decimal << endl;
    cout << "Negativo: " << negativo << endl;
    cout << "Hexadecimal: " << hex << endl;
    cout << "Octal: " << oct << endl;
    cout << "Binario: " << bin << endl;
}
```

### 2.2 Literales de coma flotante 

Representan números reales, con parte decimal o en notación científica. Permiten manejar precisión simple (`float`) o doble (`double`).

**Ejemplo práctico:**
```cpp
#include <iostream>
using namespace std;

int main() {
    float f = 3.14f;        // Precisión simple
    double d = 2.718281828; // Precisión doble
    double e = 1.0e3;       // Notación científica (1000)

    cout << "Float: " << f << endl;
    cout << "Double: " << d << endl;
    cout << "Notación científica: " << e << endl;
}
```
### 2.3 Literales de carácter 

Representan un único carácter y se escriben entre comillas simples. Pueden incluir caracteres de control como `\n` o `\t`.

**Ejemplo práctico:**
```cpp
#include <iostream>
using namespace std;

int main() {
    char letra = 'A';
    char salto = '\n';
    char tab = '\t';

    cout << "Letra: " << letra << salto;
    cout << "Tabulador:" << tab << "Fin" << endl;
}
```

### 2.4 Literales de cadena 

Representan secuencias de caracteres entre comillas dobles. Pueden ser **UTF-8** o de ancho fijo (`wchar_t`) para internacionalización.

**Ejemplo práctico:**
```cpp
#include <iostream>
using namespace std;

int main() {
    const char* texto = "Hola mundo";
    const char* utf8 = u8"Texto UTF-8";
    const wchar_t* ancho = L"Texto ancho";

    cout << texto << endl;
    cout << utf8 << endl;
}
```

### 2.5 Literales booleanos 

Representan valores lógicos: `true` o `false`.

**Ejemplos práctico:**
```cpp
#include <iostream>
using namespace std;

int main() {
    bool encendido = true;
    bool apagado = false;

    cout << "Encendido: " << encendido << endl;
    cout << "Apagado: " << apagado << endl;
}
```

:::tip
💡 **Sufijos y Prefijos:**
- **Sufijos**: `u`, `L`, `f`, `ll` modifican el tipo del literal.
- **Prefijos**: `0x` para hexadecimal, `0b` para binario, `0` para octal.
- Permiten controlar cómo el compilador interpreta el literal y prevenir errores de tipo.
:::

### 2.6 Constantes con `const` y `constexpr`

Se pueden usar para declarar valores que **no cambiarán durante la ejecución**:

```cpp
const int MAX_USUARIOS = 100;      // Constante en tiempo de ejecución
constexpr double PI = 3.14159265;  // Constante evaluable en tiempo de compilación
```

:::tip
💡 Uso de `const` vs `constexpr`:

- `const` garantiza que la variable no cambie tras la inicialización.
- `constexpr` asegura que el valor pueda evaluarse en tiempo de compilación, útil para arrays estáticos, templates y optimizaciones.
:::

### 2.7 Promoción y conversión de tipos

C++ puede convertir automáticamente los literales a otros tipos según contexto, por ejemplo:

```cpp
int i = 42;       // Literal int
double d = 42;    // Convertido a double
float f = 42;     // Convertido a float
```

:::warning Advertencia
⚠️ Ten cuidado con conversiones implícitas: pueden provocar **overflow**, pérdida de precisión o comportamiento inesperado.
:::

### 2.8 Sufijos y prefijos útiles

- **Sufijos**: `u` (unsigned), `l` (long), `ll` (long long), `f` (float), `L` (long double).
- **Prefijos**: `0x` (hexadecimal), `0b` (binario, desde C++14), `0` (octal).

```cpp
unsigned long long big = 0xFFFF'FFFF'FFFF'FFFFULL; 
float pi = 3.1415f;
```

:::tip
💡 Los sufijos y prefijos permiten controlar cómo el compilador interpreta un literal y evitar errores de tipo.
:::