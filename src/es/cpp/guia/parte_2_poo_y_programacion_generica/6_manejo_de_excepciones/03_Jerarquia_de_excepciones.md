---
outline: [2, 3]
---

# Jerarquía de excepciones

En los capítulos anteriores hemos lanzado y capturado excepciones de tipos como
`runtime_error` o `out_of_range`. Pero, ¿dónde se definen esos tipos y por qué
pueden capturarse como `exception`? La respuesta es que la biblioteca estándar
organiza sus excepciones en una **jerarquía de clases**, muy parecida a las
jerarquías de herencia que estudiamos en POO.

Entender esta jerarquía te permitirá capturar errores en el nivel adecuado de
detalle.

## 1. La base: `std::exception`

Todas las excepciones estándar derivan de `std::exception`, definida en el
encabezado `<exception>`. Es una clase que proporciona:

- El método virtual `what()`, que devuelve un mensaje descriptivo (`const
  char*`).
- El destructor virtual, para permitir herencia polimórfica.

```cpp
#include <iostream>
#include <exception>
using namespace std;

int main() {
    try {
        throw logic_error("Algo salió mal");
    }
    catch (const exception &e) {
        cout << "Tipo base capturado: " << e.what() << endl;
    }
    return 0;
}
```

::: info Nota
ℹ️ Como todas las excepciones derivan de `exception`, capturar `const exception
&e` es una forma de capturar **cualquier excepción estándar** con una sola
línea.
:::

## 2. Las dos ramas principales

La jerarquía se divide en dos grandes grupos, según el tipo de error que
representan:

```
std::exception
├── std::logic_error      → Errores que se PODÍAN evitar en el código
│   ├── std::invalid_argument
│   ├── std::domain_error
│   ├── std::length_error
│   └── std::out_of_range
└── std::runtime_error    → Errores que ocurren DURANTE la ejecución
    ├── std::range_error
    ├── std::overflow_error
    └── std::underflow_error
```

| Rama | Significado | Ejemplo |
|---|---|---|
| `logic_error` | Error evitable en el código | Pasar un argumento inválido |
| `runtime_error` | Error que escapa al control del código | No poder abrir un archivo |

Esta división es muy intuitiva: el `logic_error` es el error que **pudiste
evitar** con un mejor código, mientras que el `runtime_error` es el que **se
escapa de tus manos** y solo aparece cuando el programa está en marcha.

## 3. `logic_error` y sus derivadas

Los errores lógicos son problemas que **podían prevenirse** escribiendo mejor el
código.

```cpp
#include <iostream>
#include <stdexcept>
using namespace std;

int main() {
    try {
        // Lanzar con argumento fuera de rango
        throw invalid_argument("Edad negativa no permitida");
    }
    catch (const invalid_argument &e) {
        cout << "Argumento inválido: " << e.what() << endl;
    }
    return 0;
}
```

| Excepción | Cuándo ocurre |
|---|---|
| `invalid_argument` | Un argumento no es válido para la operación. |
| `domain_error` | El valor está fuera del dominio de una función matemática. |
| `length_error` | Se intenta superar un tamaño máximo permitido. |
| `out_of_range` | Se accede a un índice fuera de los límites. |

Todas estas comparten una característica: podrían haberse evitado revisando los
datos de entrada antes de usarlos. Por eso son "lógicas": el error está en la
lógica del programa, no en el entorno.

## 4. `runtime_error` y sus derivadas

Los errores de ejecución son problemas que **no se pueden prever** simplemente
revisando el código: dependen del entorno, los datos de entrada o el estado del
sistema.

```cpp
#include <iostream>
#include <stdexcept>
using namespace std;

int main() {
    try {
        // Simulamos un fallo que solo se descubre al ejecutar
        throw overflow_error("Número demasiado grande para el tipo");
    }
    catch (const overflow_error &e) {
        cout << "Desbordamiento: " << e.what() << endl;
    }
    return 0;
}
```

| Excepción | Cuándo ocurre |
|---|---|
| `range_error` | El resultado de una operación está fuera del rango válido. |
| `overflow_error` | Se produce un desbordamiento aritmético. |
| `underflow_error` | Se produce un subdesbordamiento numérico. |

Puedes leer el código perfectamente y aun así no saber si al ejecutarse habrá
un desbordamiento o un archivo que no existe. Ese es el territorio del
`runtime_error`: el mundo real y sus imprevistos.

## 5. Otras excepciones estándar importantes

Además de las dos ramas principales, hay excepciones específicas de la STL:

| Excepción | Origen | Ejemplo |
|---|---|---|
| `bad_alloc` | Fallo al reservar memoria | `new` no encuentra memoria disponible |
| `bad_cast` | `dynamic_cast` falla | Conversión de tipos no válida |
| `bad_typeid` | Uso incorrecto de `typeid` | Operar sobre un puntero nulo |
| `bad_function_call` | `std::function` vacía | Llamar a una función sin asignar |
| `bad_optional_access` | `std::optional` vacío | Acceder a un valor inexistente |

```cpp
#include <iostream>
#include <stdexcept>
using namespace std;

int main() {
    try {
        // Pedimos un arreglo de tamaño gigantesco (fallará)
        int *datos = new int[999999999999];
        (void)datos;
    }
    catch (const bad_alloc &e) {
        cout << "No hay suficiente memoria: " << e.what() << endl;
    }
    return 0;
}
```

Cada una de estas excepciones nace en un rincón concreto de la biblioteca
estándar: `bad_alloc` la lanza `new` cuando no hay memoria, `bad_optional_access`
la lanza `std::optional` cuando intentas leer un valor que no existe, y así
sucesivamente. Conocerlas te permite anticipar dónde puede fallar cada
herramienta que usas.

## 6. Capturar en distintos niveles de la jerarquía

La ventaja de la jerarquía es poder capturar con **precisión variable**:

```cpp
#include <iostream>
#include <stdexcept>
using namespace std;

void procesar(int opcion) {
    switch (opcion) {
        case 1: throw out_of_range("Fuera de rango");
        case 2: throw invalid_argument("Argumento inválido");
        case 3: throw runtime_error("Error de ejecución");
    }
}

int main() {
    try {
        procesar(1);
    }
    // Captura específica para out_of_range
    catch (const out_of_range &e) {
        cout << "Específico: " << e.what() << endl;
    }
    // Captura intermedia: cubre invalid_argument y otras logic_error
    catch (const logic_error &e) {
        cout << "Error lógico: " << e.what() << endl;
    }
    // Captura general de la jerarquía
    catch (const exception &e) {
        cout << "Genérico: " << e.what() << endl;
    }
    return 0;
}
```

::: tip
💡 Ordena los `catch` de lo **más específico a lo más general**. El compilador
elige el primer `catch` cuyo tipo sea compatible con la excepción lanzada.
:::

Acá podemos elegir el nivel de detalle que nos interesa: capturar exactamente
`out_of_range`, agrupar todos los errores lógicos, o atrapar todo lo que derive
de `exception`. Es como ajustar el zoom de una cámara según lo que necesitas
ver.

## 7. ¿Cuándo lanzar cada una?

| Situación | Excepción recomendada |
|---|---|
| Parámetro no válido | `invalid_argument` |
| Índice fuera de límites | `out_of_range` |
| No hay memoria | `bad_alloc` (la lanza `new`) |
| Fallo de E/S de bajo nivel | `runtime_error` (o una personalizada) |
| Error específico de tu dominio | Clase personalizada derivada de `exception` |

## 8. Buenas prácticas

- Lanza el tipo de excepción **más específico** que describa el error.
- Captura en el nivel de la jerarquía que te aporte la información que
  necesitas.
- No captures `exception` si puedes ser más preciso.
- Aprovecha la herencia para capturar grupos de errores con un solo `catch`.

## 9. Resumen rápido

- Todas las excepciones estándar derivan de `std::exception`.
- `logic_error`: errores que el código podía evitar.
- `runtime_error`: errores que ocurren durante la ejecución.
- Existen excepciones específicas: `bad_alloc`, `bad_cast`, etc.
- Captura de lo más específico a lo más general.
- Usa la jerarquía para capturar grupos con un solo `catch`.

La jerarquía estándar cubre los errores más comunes, pero a veces necesitas
errores propios de tu aplicación. En el siguiente capítulo aprenderás a crear
**excepciones personalizadas**.