# Parámetros de una función en C++

Los **parámetros** permiten que una función reciba información desde el exterior.  
Esto hace que las funciones sean más **flexibles y reutilizables**.

## 1. Paso por valor

El valor del argumento se **copia** en el parámetro de la función. Los cambios dentro de la función **no afectan** a la variable original.

```cpp
#include <iostream>
using namespace std;

void incrementar(int x) {
    x = x + 1; // solo modifica la copia
    cout << "Dentro de la función: " << x << endl;
}

int main() {
    int num = 5;
    incrementar(num);
    cout << "Fuera de la función: " << num << endl; // sigue siendo 5
}
```

## 2. Paso por referencia (`&`)

Se pasa la dirección de memoria del argumento.
Los cambios dentro de la función sí afectan al valor original.

```cpp
void incrementar(int &x) {
    x = x + 1;
}

int main() {
    int num = 5;
    incrementar(num);
    cout << "Nuevo valor: " << num << endl; // Ahora es 6
}
```

::: tip
💡 El paso por referencia es útil cuando necesitamos modificar el valor original o evitar copias costosas de datos grandes.
:::

## 3. Referencias constantes (`const &`)

Permite acceder al valor sin modificarlo. Se usa principalmente para evitar copias innecesarias en parámetros grandes como `std::string` o `std::vector`.

```cpp
void imprimirMensaje(const string &mensaje) {
    cout << mensaje << endl;
}

int main() {
    string texto = "Hola C++";
    imprimirMensaje(texto); // N o copia la cadena, pero tampoco la modifica
}
```

## 4. Paso por puntero (`*`)

Otra forma de modificar valores originales es usar **punteros**.

```cpp
void incrementar(int *x) {
    (*x)++;
}

int main() {
    int num = 5;
    incrementar(&num); // Pasamos la dirección de memoria
    cout << "Nuevo valor: " << num << endl; // Ahora es 6
}
```

::: warning Advertencia
⚠️ El uso de punteros requiere validar que no sean `nullptr` para evitar errores en tiempo de ejecución.
:::

## 5. Paso de arreglos y vectores

En C++, cuando pasamos un arreglo como parámetro, realmente estamos pasando un **puntero al primer elemento**.

```cpp
void imprimirArray(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
}

int main() {
    int numeros[] = {1, 2, 3, 4, 5};
    imprimirArray(numeros, 5);
}
```

Con `std::vector`, es preferible pasar por **referencia constante**:

```cpp
#include <vector>

void imprimirVector(const vector<int> &v) {
    for (int n : v) cout << n << " ";
}
```

## 6. Parámetros por valor de retorno (Move Semantics en C++11)

Desde C++11, C++ introdujo la **semántica de movimiento**, que optimiza el paso de valores temporales evitando copias innecesarias.

```cpp
#include <vector>
using namespace std;

vector<int> crearVector() {
    vector<int> v = {1, 2, 3, 4, 5};
    return v; // se mueve en lugar de copiar (gracias a move semantics)
}
```

Esto mejora el rendimiento, sobre todo al devolver **contenedores grandes**.

## 7. Resumen rápido

- **Valor** → Copia el dato.

- **Referencia (&)** → Modifica el original.

- **Referencia constante (const &)** → Evita copias, sin modificar.

- **Puntero (*)** → Permite modificar, pero con cuidado.

- **Arreglos/Vectores** → Se recomienda const & para seguridad y eficiencia.

- **Move semantics** → Optimiza devoluciones de objetos grandes.