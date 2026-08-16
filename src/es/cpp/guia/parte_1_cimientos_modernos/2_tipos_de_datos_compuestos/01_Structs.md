---
outline: [2, 3]
---

# Structs

Hasta ahora hemos trabajado con tipos de datos simples como `int`, `float` o `char`, que
almacenan un único valor. Pero en la vida real las cosas rara vez son tan sencillas: los datos
de una persona, de un producto o de un punto en el espacio no caben en una sola variable. ¿Qué
hacemos entonces? La solución es agrupar varios valores relacionados en una sola entidad, y para
eso sirven los **tipos de datos compuestos**.

Y acá entra en escena el `struct` (del inglés *structure*, que se traduce como **estructura**).
Es la forma más antigua y sencilla que tiene C++ para agrupar datos bajo un mismo techo. No te
preocupes si parece poco al principio: dominarlo bien te va a servir muchísimo, porque casi toda
la información que manejan los programas del mundo real termina organizada de esta manera.

## 1. ¿Qué es un `struct`?

Un `struct` es un tipo de dato definido por el programador que agrupa **una o más variables**
(llamadas **miembros** o **campos**) bajo un mismo nombre. Piénsalo como una ficha de datos: la
ficha de un alumno puede contener su nombre, su edad y su promedio, todo dentro de una misma
"carpeta". En lugar de andar con tres variables sueltas y desconectadas, ahora tenemos un solo
tipo que las reúne y les da sentido.

**Sintaxis básica:**

```cpp
struct Alumno {
    string nombre;
    int edad;
    float promedio;
};
```

Acá hemos creado un nuevo tipo llamado `Alumno` que contiene tres campos:

- `nombre`: una cadena de texto.
- `edad`: un número entero.
- `promedio`: un número decimal.

::: info Nota
ℹ️ Nota que después de la llave de cierre `}` va un punto y coma `;`. Es un error muy común
olvidarlo, y el compilador lo tomará como un error. Si alguna vez el compilador te reclama algo
raro justo después de un `struct`, revisa primero que esté el punto y coma.
:::

## 2. Declarar y usar variables de tipo `struct`

Una vez definido el tipo, podemos crear variables de ese tipo exactamente igual que con cualquier
otro, y acceder a sus campos con el operador punto `.`. Ese punto es el puente entre la variable
y cada uno de sus datos internos:

```cpp
#include <iostream>
using namespace std;

struct Alumno {
    string nombre;
    int edad;
    float promedio;
};

int main() {
    Alumno alumno1;                  // Creamos una variable de tipo Alumno
    alumno1.nombre = "María";        // Accedemos a cada campo con '.'
    alumno1.edad = 20;
    alumno1.promedio = 9.5;

    cout << "Nombre: " << alumno1.nombre << endl;
    cout << "Edad: " << alumno1.edad << endl;
    cout << "Promedio: " << alumno1.promedio << endl;
}
```

Salida:

```
Nombre: María
Edad: 20
Promedio: 9.5
```

En la práctica, lo importante es que `alumno1` es una variable completa: cuando la creamos,
reservamos espacio para los tres campos a la vez, y con el punto accedemos a cualquiera de ellos.

## 3. Inicializar un `struct` de forma compacta

Asignar campo por campo funciona, pero puede resultar tedioso, sobre todo cuando son muchos.
C++ nos permite inicializar todos los campos de una sola vez usando llaves `{ }`, en el mismo
orden en que fueron declarados. Es como llenar el formulario de una sola pasada en lugar de
rellenar casilla por casilla:

```cpp
#include <iostream>
using namespace std;

struct Punto {
    int x;
    int y;
};

int main() {
    Punto origen = {0, 0};     // x = 0, y = 0
    Punto destino = {10, 25};  // x = 10, y = 25

    cout << "Origen: (" << origen.x << ", " << origen.y << ")" << endl;
    cout << "Destino: (" << destino.x << ", " << destino.y << ")" << endl;
}
```

::: tip
💡 Esta forma de inicialización se llama **inicialización agregada** y funciona siempre que los
campos sean públicos, como ocurre en un `struct` por defecto. Es la manera más corta y legible
de darle valor inicial a una estructura.
:::

## 4. Copiar y asignar `structs`

Los `structs` se copian y asignan como cualquier otro tipo de dato. Al asignar uno a otro, se
copian **todos** sus campos, uno por uno. Es como hacer una fotocopia de la ficha completa:

```cpp
Alumno alumno1 = {"Carlos", 22, 8.7};
Alumno alumno2 = alumno1; // Copia de alumno1

alumno2.nombre = "Pedro";

cout << alumno1.nombre << endl; // Carlos (no cambió)
cout << alumno2.nombre << endl; // Pedro
```

::: warning Advertencia
⚠️ Cuidado: la copia es independiente. Modificar `alumno2` no afecta a `alumno1`. Pero si un
`struct` contiene punteros, la copia solo duplica la dirección, no los datos a los que apunta.
Ese tema lo veremos más adelante con la memoria, y es una de las trampas más comunes que existen.
:::

## 5. `structs` en arreglos

Podemos crear arreglos de `structs`, lo cual es muy útil cuando manejamos colecciones de datos
relacionados. De hecho, es de los usos más frecuentes: una lista de productos, un registro de
empleados, una colección de puntos... todos son arreglos de estructuras.

```cpp
#include <iostream>
using namespace std;

struct Producto {
    string nombre;
    double precio;
};

int main() {
    Producto tienda[3] = {
        {"Manzana", 0.5},
        {"Pan", 1.2},
        {"Leche", 2.0}
    };

    for (int i = 0; i < 3; i++) {
        cout << tienda[i].nombre << " cuesta " << tienda[i].precio << endl;
    }
}
```

Como ves, cada elemento del arreglo es un `Producto` completo, y accedemos a sus campos con el
mismo operador punto de siempre: `tienda[i].nombre`.

## 6. `struct` como parámetro de funciones

Un `struct` se puede pasar a funciones de las mismas formas que vimos en los tipos simples: por
valor, por referencia o por referencia constante. La diferencia es que ahora el costo de copiar
puede ser alto si la estructura tiene muchos campos, así que la elección importa más que antes:

```cpp
#include <iostream>
using namespace std;

struct Rectangulo {
    double ancho;
    double alto;
};

// Por referencia constante: no se copia y no se modifica
double area(const Rectangulo &r) {
    return r.ancho * r.alto;
}

// Por referencia: se modifica el original
void escalar(Rectangulo &r, double factor) {
    r.ancho *= factor;
    r.alto *= factor;
}

int main() {
    Rectangulo rec = {5.0, 3.0};

    cout << "Área: " << area(rec) << endl; // 15

    escalar(rec, 2.0);
    cout << "Nuevo ancho: " << rec.ancho << endl; // 10
    cout << "Nueva alto: " << rec.alto << endl;   // 6
}
```

::: tip
💡 Para `structs` pequeños puedes usar paso por valor, pero para estructuras grandes es mucho
más eficiente pasarlos por referencia constante, ya que evitamos copiar todos los campos.
Piénsalo de esta manera: con `const Rectangulo &r` le prestamos los datos a la función sin
fotocopiarlos y, de paso, le prohibimos modificarlos.
:::

## 7. Diferencias entre `struct` y `class`

En C++ existe la palabra clave `class` que veremos a fondo en la parte de Programación Orientada
a Objetos. Por ahora solo necesitas saber una diferencia clave:

- En un `struct`, los miembros son **públicos por defecto** (accesibles desde cualquier parte).
- En una `class`, los miembros son **privados por defecto** (accesibles solo desde la propia
  clase).

En C++ moderno es común usar `struct` para agrupar datos simples y `class` cuando además
queremos añadir comportamiento y control de acceso. En otras palabras: el `struct` es el "cajón
de datos" y la `class` es el "cajón con reglas de quién puede tocarlo".

## 8. Buenas prácticas

- Usa nombres en plural para los tipos y singular para las variables:
  `struct Usuario { ... }; Usuario usuario;`
- Agrupa en un `struct` solo datos que estén **relacionados entre sí**. Si no comparten un
  sentido común, quizás estén mejor en estructuras separadas.
- Inicializa siempre los campos del `struct` para evitar valores basura.
- Pasa `structs` grandes por **referencia constante** (`const &`) por eficiencia.

## 9. Resumen rápido

- Un `struct` agrupa varias variables bajo un mismo tipo.
- Se accede a los campos con el operador `.`.
- Se puede inicializar con llaves `{ }` de forma compacta.
- Se copia y asigna campo por campo.
- Se puede usar en arreglos y como parámetro de funciones.
- En `struct`, los miembros son públicos por defecto (a diferencia de `class`).

Los `structs` son el primer ladrillo para organizar información compleja, y como te habrás dado
cuenta, detrás de esa idea sencilla hay un mundo de posibilidades. En el siguiente capítulo
veremos otro tipo compuesto muy usado: las enumeraciones.