---
outline: [2, 3]
---

# Formateo de salida

¿Alguna vez has visto un programa que imprime `3.14159265358979` cuando solo querías
`3.14`? ¿O una tabla con números desalineados que parece un desastre? Controlar cómo se ven
los datos en pantalla se llama **formateo de salida**, y es lo que separa a un programa que
"funciona" de uno que se ve profesional. C++ tiene herramientas muy cómodas para lograrlo,
gracias a los **manipuladores** y a la biblioteca `<iomanip>`.

## 1. ¿Qué es un manipulador?

Un **manipulador** es una función que se inserta directamente en el flujo con `<<` y
modifica el formato de lo que viene después. La palabra lo dice todo: manipula cómo se
muestran los datos. Veamos un ejemplo muy claro:

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << 42 << endl;        // 42
    cout << hex << 42 << endl; // 2a (en hexadecimal)
    return 0;
}
```

`hex` es un manipulador: cambia la base numérica para lo siguiente.

## 2. Base numérica

Puedes mostrar números en decimal, hexadecimal u octal según lo que necesites. Esto es muy
útil cuando trabajás con cosas de bajo nivel, como direcciones de memoria o máscaras de
bits:

```cpp
#include <iostream>
using namespace std;

int main() {
    int numero = 255;

    cout << dec << "Decimal: " << numero << endl;     // 255
    cout << hex << "Hexadecimal: " << numero << endl; // ff
    cout << oct << "Octal: " << numero << endl;       // 377
    cout << dec; // Volvemos a decimal

    return 0;
}
```

::: tip
💡 El manipulador `showbase` añade el prefijo (`0x` para hex, `0` para octal) para que quede claro en qué base está el número.
:::

## 3. Precisión de números decimales

Los números de punto flotante pueden mostrar una cantidad ridícula de decimales. Para
controlar la cantidad de dígitos que se muestran, se usa `setprecision` (de `<iomanip>`):

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    double pi = 3.141592653589793;

    cout << setprecision(3) << pi << endl; // 3.14
    cout << setprecision(5) << pi << endl; // 3.1416
    cout << setprecision(15) << pi << endl; // Máxima precisión típica

    return 0;
}
```

::: warning Advertencia
⚠️ `setprecision(n)` cuenta el total de dígitos significativos, no los decimales. Para fijar el número de decimales exacto, combínalo con `fixed`:
:::

## 4. `fixed` y `scientific`

Ahora viene la combinación que vas a usar todos los días. Los manipuladores `fixed` y
`scientific` controlan la notación de los números decimales:

- `fixed`: fuerza notación con punto decimal fijo.
- `scientific`: fuerza notación científica.

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    double cantidad = 12345.6789;

    // 3 decimales exactos
    cout << fixed << setprecision(3) << cantidad << endl; // 12345.679

    // Notación científica
    cout << scientific << setprecision(4) << cantidad << endl; // 1.2346e+04

    return 0;
}
```

::: tip
💡 La combinación `fixed << setprecision(2)` es la forma estándar de mostrar **dinero** (siempre 2 decimales).
:::

## 5. Ancho y alineación

Para crear tablas alineadas y prolijas, usamos `setw` (ancho), `left` y `right`
(alineación). Es la herramienta ideal para cuando querés que tus resultados se lean como
una tabla de verdad:

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    cout << left << setw(15) << "Producto"
         << right << setw(10) << "Precio" << endl;
    cout << string(25, '-') << endl;

    cout << left << setw(15) << "Manzanas"
         << right << setw(10) << fixed << setprecision(2) << 1.5 << endl;

    cout << left << setw(15) << "Pan"
         << right << setw(10) << 2.0 << endl;

    return 0;
}
```

Salida:

```
Producto           Precio
-------------------------
Manzanas              1.50
Pan                   2.00
```

::: info Nota
ℹ️ `setw` (ancho) solo afecta al **siguiente** valor; `left`/`right` y `setprecision` sí persisten. `setfill('0')` permite rellenar el espacio sobrante con otro carácter.
:::

## 6. Relleno personalizado: `setfill`

Cuando querés rellenar los espacios vacíos (por ejemplo, con ceros), ahí entra `setfill`.
Un ejemplo clásico: mostrar una hora siempre con dos dígitos, como `09:05` en vez de `9:5`:

```cpp
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int horas = 9, minutos = 5;

    cout << setfill('0') << setw(2) << horas << ":"
         << setw(2) << minutos << endl; // 09:05

    cout << setfill(' '); // Restauramos
    return 0;
}
```

## 7. `showpos` y `boolalpha`

Dos manipuladores más que le dan pulido a tus salidas:

- `showpos`: muestra el `+` en números positivos.
- `boolalpha`: muestra `true`/`false` en lugar de `1`/`0`.

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << showpos << 42 << " " << -42 << endl; // +42 -42
    cout << noshowpos;

    bool activo = true;
    cout << boolalpha << activo << endl; // true
    cout << noboolalpha << activo << endl; // 1

    return 0;
}
```

## 8. Formato a variables: `ostringstream`

A veces querés formatear un texto **sin imprimirlo** (por ejemplo, para guardarlo en una
variable o enviarlo por la red). Para eso existe `ostringstream`, que es un flujo de salida
hacia un `string`. Es como un `cout`, pero en vez de ir a la pantalla, va a una cadena:

```cpp
#include <iostream>
#include <sstream>
#include <iomanip>
using namespace std;

int main() {
    double precio = 19.99;
    int cantidad = 3;

    ostringstream ticket;
    ticket << "Producto x" << cantidad
           << " = $" << fixed << setprecision(2)
           << precio * cantidad;

    string texto = ticket.str(); // Convertimos a string
    cout << texto << endl; // Producto x3 = $59.97

    return 0;
}
```

::: tip
💡 `ostringstream` te permite construir cadenas formateadas con todas las herramientas vistas. Es la forma moderna de "convertir números a texto con formato".
:::

## 9. Resumen de los manipuladores principales

| Manipulador | Efecto |
|---|---|
| `dec`, `hex`, `oct` | Base numérica |
| `fixed`, `scientific` | Notación decimal |
| `setprecision(n)` | Dígitos significativos |
| `setw(n)` | Ancho del siguiente valor |
| `left`, `right` | Alineación |
| `setfill(c)` | Carácter de relleno |
| `boolalpha` | `true`/`false` en vez de 1/0 |
| `showpos` | Mostrar `+` en positivos |

## 10. Buenas prácticas

- Usa `fixed << setprecision(2)` para dinero.
- Combina `setw` + `left`/`right` para tablas alineadas.
- Restaura el formato (`dec`, `setfill(' ')`, etc.) cuando cambies de sección.
- Guarda con `ostringstream` cuando necesites el texto formateado, no solo imprimirlo.

## 11. Resumen rápido

- Los **manipuladores** modifican el formato del flujo.
- `setprecision` controla la precisión; `fixed` fija decimales.
- `setw` + `left`/`right` alinean en tablas.
- `setfill` rellena el espacio sobrante.
- `boolalpha`, `showpos`, `dec`/`hex`/`oct` ajustan la presentación.
- `ostringstream` crea cadenas formateadas sin imprimir.

El formato de salida es lo que hace que tus programas se vean profesionales y se lean bien.
En el siguiente capítulo veremos cómo **guardar estructuras completas** en archivos de forma
organizada: la **serialización**.