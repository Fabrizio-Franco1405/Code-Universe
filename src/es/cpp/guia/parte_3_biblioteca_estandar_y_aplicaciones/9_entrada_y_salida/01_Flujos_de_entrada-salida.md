---
outline: [2, 3]
---

# Flujos de entrada/salida

Desde tu primer programa con `std::cout << "Hola mundo"`, has estado usando la
entrada/salida de C++ sin detenerte a pensar en ella. Y es normal, porque es tan cómoda que
parece magia. Ahora es el momento de entender qué hay detrás de ese `<<`, qué significa
realmente un "flujo", y cómo funciona la comunicación entre tu programa y el mundo
exterior.

## 1. ¿Qué es un flujo (stream)?

Un **flujo** (*stream* en inglés) es una **secuencia de bytes** que fluye desde un origen
hacia un destino. En C++, casi toda la entrada/salida se hace a través de flujos.

Piénsalo como una tubería de agua:

- Los datos fluyen en una dirección.
- Puedes leer (consumir) o escribir (producir).
- La tubería conecta tu programa con algo externo: el teclado, la pantalla, un archivo...

```
              ┌──────────────┐
  teclado ───►│  flujo de    │───► variables del programa
              │  entrada     │
              └──────────────┘

              ┌──────────────┐
  pantalla ◄──│  flujo de    │◄─── variables del programa
              │  salida      │
              └──────────────┘
```

Recuerda la etimología que vimos en el primer capítulo: `io` significa **input/output**
(entrada/salida) y `stream` significa **flujo**. Acá la idea se vuelve muy literal: tu
programa se comunica haciendo fluir datos por tuberías.

## 2. Los flujos estándar

C++ define cuatro flujos estándar (en `<iostream>`), cada uno con su propósito:

| Flujo | Nombre | Uso |
|---|---|---|
| `std::cin` | Entrada estándar | Lee del teclado |
| `std::cout` | Salida estándar | Escribe en la pantalla |
| `std::cerr` | Error estándar | Mensajes de error (sin búfer) |
| `std::clog` | Registro estándar | Mensajes de registro (con búfer) |

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Esto es salida normal" << endl;
    cerr << "Esto es un error" << endl;
    clog << "Esto es un registro" << endl;

    return 0;
}
```

::: info Nota
ℹ️ `cerr` y `cout` parecen iguales, pero van por canales distintos del sistema operativo. Esto permite, por ejemplo, separar los errores de los resultados al redirigir la salida.
:::

## 3. El operador `<<`: inserción

El operador `<<` se llama **operador de inserción**. Su trabajo es "insertar" datos en un
flujo de salida. Lo importante: **puede encadenarse**, porque cada operación devuelve el
mismo flujo. Es por eso que podés escribir cadenas larguísimas sin problema:

```cpp
int edad = 25;
double altura = 1.75;

cout << "Edad: " << edad << ", altura: " << altura << endl;
```

Cada `<<` inserta su valor y devuelve `cout`, permitiendo encadenar sin límite.

## 4. El operador `>>`: extracción

El operador `>>` se llama **operador de extracción**, y hace el camino inverso: extrae
datos de un flujo de entrada hacia variables. Es la forma más directa de leer lo que el
usuario escribe en el teclado:

```cpp
#include <iostream>
using namespace std;

int main() {
    string nombre;
    int edad;

    cout << "Escribe tu nombre: ";
    cin >> nombre;

    cout << "Escribe tu edad: ";
    cin >> edad;

    cout << "Hola " << nombre << ", tienes " << edad << " años" << endl;

    return 0;
}
```

::: warning Advertencia
⚠️ `cin >>` separa por **espacios en blanco**. Si escribes "María López", solo leerá "María". Para leer líneas completas, usa `getline()` (lo veremos enseguida).
:::

## 5. Leer líneas completas: `getline`

Cuando necesitas leer toda una línea, incluso con espacios, usás `getline`. Es la función
ideal para nombres completos, frases o cualquier texto que pueda tener espacios:

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string nombreCompleto;

    cout << "Escribe tu nombre completo: ";
    getline(cin, nombreCompleto);

    cout << "Hola, " << nombreCompleto << "!" << endl;

    return 0;
}
```

::: warning Advertencia
⚠️ Cuidado con mezclar `cin >>` y `getline`: el `>>` deja un salto de línea en el búfer que `getline` leerá como una línea vacía. Usa `cin.ignore()` entre ambos si los combinas.
:::

## 6. Validar la entrada

Un detalle que te va a ahorrar muchos dolores de cabeza: `cin >>` no valida nada. Si el
usuario escribe letras donde esperabas un número, la extracción falla y deja la variable
sin tocar. Por eso es importante **comprobar el estado del flujo** después de leer:

```cpp
#include <iostream>
using namespace std;

int main() {
    int numero;

    cout << "Escribe un número: ";
    cin >> numero;

    // 'cin' se convierte a false si falló la extracción
    if (cin) {
        cout << "Leíste: " << numero << endl;
    } else {
        cout << "Entrada no válida. Limpiando el flujo..." << endl;
        cin.clear();             // Limpia el estado de error
        cin.ignore(10000, '\n'); // Descarta la entrada mala
    }

    return 0;
}
```

::: tip
💡 `cin.clear()` restaura el flujo a buen estado y `cin.ignore()` descarta los caracteres que no se pudieron leer. Sin ellos, el flujo seguiría "bloqueado" para siempre.
:::

## 7. Flujos y tipos de datos

La magia de los flujos es que saben **convertir** cada tipo a texto (o viceversa). No
importa si es un `int`, un `double`, un `char`, un `string` o un `bool`: el flujo se encarga
de la conversión automáticamente:

```cpp
int edad = 25;
double precio = 9.99;
char letra = 'A';
string nombre = "Ana";
bool activo = true;

cout << edad << " " << precio << " " << letra << " "
     << nombre << " " << activo << endl;
// 25 9.99 A Ana 1   (bool se muestra como 0/1)
```

## 8. Buenas prácticas

- Usa `getline` para leer líneas con espacios.
- Verifica el estado de `cin` después de cada entrada importante.
- Usa `cerr` para errores reales y `cout` para resultados.
- Evita mezclar `cin >>` con `getline` sin limpiar el búfer.

## 9. Resumen rápido

- Un **flujo** es una secuencia de bytes que conecta el programa con el exterior.
- `cin`, `cout`, `cerr` y `clog` son los flujos estándar.
- `<<` inserta datos; `>>` extrae datos.
- `cin >>` separa por espacios; `getline` lee líneas completas.
- Verifica el estado de `cin` para validar entradas.
- Los flujos convierten automáticamente entre tipos y texto.

Los flujos en consola son el primer paso para comunicarte con el exterior. En el siguiente
capítulo veremos cómo aplicar exactamente el mismo concepto a los **archivos**, permitiendo
guardar datos de forma permanente entre una ejecución y otra.