---
outline: [2, 3]
---

# Ámbito de una función

El **ámbito de una función** determina **dónde son accesibles sus variables y parámetros** dentro de un programa.  
Comprenderlo es esencial para evitar errores, fugas de memoria o conflictos de nombres.

En C++, el ámbito puede ser **local, global o estático**, y afecta tanto a variables como a funciones.

## 1. Ámbito local

- Las variables definidas dentro de una función **solo existen durante la ejecución de la función**.
- Se crean al entrar a la función y se destruyen al salir.

```cpp
#include <iostream>
using namespace std;

void ejemploLocal() {
    int x = 10; // Variable local
    cout << "Dentro: " << x << endl;
}

int main() {
    ejemploLocal();
    cout << x; // Error: x no existe aquí [!code error]
}
```

**Uso típico:** Evitar conflictos de nombres y limitar el ciclo de vida de datos temporales.

## 2. Ámbito global

- Las variables declaradas fuera de cualquier función son **globales**.

- Están disponibles en todo el programa, **pero su uso excesivo es desaconsejado** por riesgos de dependencia y errores.

```cpp
#include <iostream>
using namespace std;

int globalVar = 100; // Variable global

void mostrar() {
    cout << "Global: " << globalVar << endl;
}

int main() {
    mostrar();
    cout << "Global en main: " << globalVar << endl;
}
```

## 3. Ámbito estático dentro de funciones

- Una variable **estática dentro de una función** conserva su valor entre llamadas sucesivas.

- Se crea la primera vez que se ejecuta la función y persiste hasta el final del programa.

```cpp
#include <iostream>
using namespace std;

void contador() {
    static int count = 0;
    count++;
    cout << "Contador: " << count << endl;
}

int main() {
    contador(); // 1
    contador(); // 2
    contador(); // 3
}
```

**Uso típico:** Mantener estado entre llamadas sin exponer la variable globalmente.

## 4. Variables con el mismo nombre en distintos ámbitos

- Una variable local puede **ocultar** una variable global con el mismo nombre.

- Esto se llama **shadowing**.

```cpp
#include <iostream>
using namespace std;

int valor = 42;

void mostrar() {
    int valor = 10; // Oculta la variable global
    cout << "Local: " << valor << endl;
}

int main() {
    mostrar();            // 10
    cout << "Global: " << valor << endl; // 42
}
```

## 5. Ejemplo práctico

Veamos un ejemplo que combina todos los tipos de ámbito:

```cpp
#include <iostream>
using namespace std;

int global = 1; // Variable global

void funcion() {
    int local = 2;         // Variable local
    static int estatica = 3; // Variable estática

    cout << "Local: " << local << ", Estática: " << estatica << ", Global: " << global << endl;
    local++;
    estatica++;
    global++;
}

int main() {
    funcion(); // Local:2, Estática:3, Global:1
    funcion(); // Local:2, Estática:4, Global:2
    funcion(); // Local:2, Estática:5, Global:3
}
```

- La **variable local** se reinicia en cada llamada.

- La **variable estática** mantiene su valor entre llamadas.

- La **variable global** se modifica y está disponible en todo el programa.

## 6. Buenas prácticas

- Minimiza el uso de variables globales para **evitar efectos secundarios**.

- Prefiere variables locales y pasa datos mediante **parámetros**.

- Usa variables estáticas solo cuando necesites mantener estado entre llamadas de manera controlada.

- Mantén nombres claros y evita shadowing siempre que sea posible.

## 7. Resumen rápido

- **Local**: solo existe dentro de la función, destruida al salir.

- **Global**: accesible en todo el programa, pero riesgo de dependencia.

- **Estática**: persiste entre llamadas, creada solo una vez.

- **Shadowing**: variables locales pueden ocultar variables globales o externas.

- Comprender el ámbito ayuda a **controlar el ciclo de vida de los datos** y prevenir errores.