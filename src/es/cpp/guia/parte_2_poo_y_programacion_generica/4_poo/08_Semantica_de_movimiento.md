---
outline: [2, 3]
---

# Semántica de movimiento

En los capítulos de memoria y funciones hablamos de dos formas de pasar datos:
por **valor** (se copian) y por **referencia** (se comparte). Pero copiar
objetos grandes (vectores, cadenas, imágenes...) es lento y desperdicia
memoria. ¿Y si pudiéramos **"mover"** el contenido de un objeto a otro sin
copiarlo?

Esa es la idea detrás de la **semántica de movimiento**, una de las
características más importantes del C++ moderno. Introducida en **C++11**,
cambió por completo la forma en que optimizamos el manejo de objetos grandes.

## 1. Copiar vs mover

Imagina que tienes una caja llena de libros y quieres dársela a tu amigo.
Copiar sería comprar libros nuevos idénticos (lento y costoso). Mover sería
darle **la misma caja** y quedarte con ella vacía (rápido).

En C++:

- **Copiar** (`copy`): crea un objeto nuevo con los mismos datos. El original
  queda intacto.
- **Mover** (`move`): transfiere los recursos del objeto original al nuevo. El
  original queda **vacío** (en un estado válido pero sin datos).

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> origen = {1, 2, 3, 4, 5};

    // Copiar: 'copia' tiene los mismos datos, 'origen' sigue intacto
    vector<int> copia = origen;

    // Mover: 'destino' toma los datos, 'origen' queda vacío
    vector<int> destino = move(origen);

    cout << "Copia tamaño: " << copia.size() << endl;    // 5
    cout << "Destino tamaño: " << destino.size() << endl; // 5
    cout << "Origen tamaño: " << origen.size() << endl;   // 0 (vacío)

    return 0;
}
```

Observa la salida: `copia` conserva los 5 elementos y `origen` también (copiar
duplica). Pero `destino` tiene los 5 elementos y `origen` quedó con `0`: los
datos fueron **transferidos**, no duplicados. El objeto `origen` sigue siendo
válido, pero ya no posee nada. En la vida real, después de darle la caja a tu
amigo, tú te quedas con la caja vacía, lista para ser reutilizada.

::: info Nota
ℹ️ `std::move` (de `<utility>`) no mueve nada por sí mismo: simplemente
**convierte** el objeto en un "valor que se puede mover", permitiendo que el
compilador elija la operación de movimiento en lugar de la copia.
:::

## 2. ¿Cuándo mueve el compilador automáticamente?

El compilador mueve automáticamente en situaciones donde el objeto es
**temporal** (un valor que se crea, se usa y se descarta). Por ejemplo, al
devolver un objeto grande de una función:

```cpp
#include <iostream>
#include <vector>
using namespace std;

// El vector se construye dentro y se 'mueve' al salir (no se copia)
vector<int> crearDatos() {
    vector<int> datos = {1, 2, 3, 4, 5};
    return datos; // En C++11+, este 'return' mueve, no copia
}

int main() {
    vector<int> misDatos = crearDatos();
    cout << "Tamaño: " << misDatos.size() << endl; // 5
    return 0;
}
```

Este es uno de los casos donde C++ brilla. Podrías pensar que el vector se copia
dos veces (una al salir de la función y otra al asignarse), pero el compilador
es lo bastante inteligente como para **moverlo**, e incluso a veces eliminar la
copia por completo.

::: tip
💡 Esto se conoce como **elisión de copia** o **optimización del valor de
retorno** (RVO). El compilador elimina la copia extra que parecía necesaria. Es
una de las razones por las que devolver objetos grandes "por valor" no es tan
costoso como parece.
:::

## 3. Referencias rvalue: el secreto

Para entender cómo funciona el movimiento por debajo, debemos conocer las
**referencias rvalue**, escritas con `&&`:

- **Lvalue**: un objeto con nombre y dirección persistente (puede estar a la
  izquierda de una asignación). Ej: `int a = 5;` → `a`.
- **Rvalue**: un valor temporal sin nombre. Ej: `5`, `a + b`,
  `funcionQueDevuelve()`.

```cpp
int a = 5;      // 'a' es un lvalue
int b = a + 3;  // 'a + 3' es un rvalue (temporal)

// Las referencias rvalue capturan temporales
int &&ref = a + 3;
```

¿Por qué importa distinguirlos? Porque un temporal (`rvalue`) está destinado a
desaparecer: nadie lo va a usar después. Entonces, ¿para qué copiarlo si
podemos robarlo sin consecuencias? Esa es la idea clave que explota la
semántica de movimiento.

## 4. El constructor de movimiento

Cuando definimos una clase que gestiona recursos (como memoria dinámica),
podemos implementar un **constructor de movimiento** para transferir los
recursos en lugar de copiarlos.

```cpp
#include <iostream>
using namespace std;

class Buffer {
private:
    int *datos;
    int tamano;

public:
    // Constructor normal
    Buffer(int t) : tamano(t) {
        datos = new int[tamano];
        cout << "Reservados " << tamano << " elementos" << endl;
    }

    // Constructor de copia
    Buffer(const Buffer &otro) : tamano(otro.tamano) {
        datos = new int[tamano];
        for (int i = 0; i < tamano; i++) datos[i] = otro.datos[i];
        cout << "Copia realizada" << endl;
    }

    // Constructor de movimiento (C++11)
    Buffer(Buffer &&otro) noexcept : datos(otro.datos), tamano(otro.tamano) {
        otro.datos = nullptr; // Dejamos al otro sin recursos
        otro.tamano = 0;
        cout << "Movimiento realizado" << endl;
    }

    // Destructor
    ~Buffer() {
        delete[] datos;
    }
};

int main() {
    Buffer a(10);
    Buffer b = move(a); // Se llama al constructor de movimiento

    return 0;
}
```

Compara los dos constructores: el de copia reserva memoria nueva y copia
elemento por elemento; el de movimiento simplemente **roba el puntero** del
otro objeto y deja al original apuntando a `nullptr`. En lugar de hacer `10`
copias, hizo un solo intercambio de punteros. Cuando el original se destruya,
su `delete[] nullptr` no hará nada, así que no habrá doble liberación.

::: tip
💡 El constructor de movimiento toma `&&` (rvalue), transfiere los punteros y
deja al objeto original en un estado seguro (aquí, `nullptr`). Nota el
`noexcept`: mover no debería lanzar excepciones.
:::

## 5. La regla de los 3 / 5

Si una clase gestiona recursos manualmente, debe implementar un conjunto de
métodos especiales. Se conoce como la **regla de los 3** (o 5 en C++ moderno):

| Método | Función |
|---|---|
| Destructor | Liberar recursos |
| Constructor de copia | Copiar recursos |
| Operador de asignación por copia | Copiar en asignación |
| Constructor de movimiento | Mover recursos |
| Operador de asignación por movimiento | Mover en asignación |

::: warning Advertencia
⚠️ Si implementas uno de estos métodos, casi siempre debes implementar todos.
Olvidarlo conduce a dobles liberaciones o fugas de memoria.
:::

En la práctica, la mayoría de tus clases **no gestionarán recursos
manualmente**: usarán `std::vector`, `std::string` o punteros inteligentes, que
ya implementan el movimiento por ti. Así solo necesitas definir las reglas
especiales en casos muy concretos.

## 6. `std::move` en la práctica: Mover punteros inteligentes

Un caso muy frecuente es mover punteros inteligentes para transferir su
propiedad:

```cpp
#include <iostream>
#include <memory>
using namespace std;

int main() {
    unique_ptr<int> a = make_unique<int>(42);

    // No se puede copiar un unique_ptr, pero sí moverlo
    unique_ptr<int> b = move(a);

    cout << *b << endl; // 42
    if (!a) {
        cout << "'a' ya no posee el recurso" << endl;
    }

    return 0;
}
```

Un `unique_ptr` es como una llave única de un casillero: solo puede existir una
copia de la llave. No puedes copiarla, pero sí puedes **pasarla** a otra
persona (moverla). Por eso `unique_ptr<int> b = a;` daría error, pero
`unique_ptr<int> b = move(a);` funciona: transferimos la propiedad de `a` a
`b`.

## 7. Buenas prácticas

- Devuelve objetos grandes "por valor": el compilador mueve automáticamente.
- Usa `std::move` solo cuando realmente quieras transferir recursos.
- Después de mover un objeto, no uses el objeto original salvo para reasignarlo.
- Prefiere tipos de la STL (que ya mueven bien) sobre gestionar memoria
  manualmente.
- Marca los constructores de movimiento como `noexcept` cuando sea posible.

## 8. Resumen rápido

- **Mover** transfiere recursos; **copiar** duplica datos.
- `std::move` convierte un objeto para que se pueda mover.
- El compilador mueve automáticamente los valores temporales (RVO).
- Las referencias rvalue (`&&`) permiten distinguir temporales.
- El **constructor de movimiento** transfiere recursos y deja el original
  vacío.
- La regla de los 3/5 define los métodos especiales de clases con recursos.

La semántica de movimiento es la razón por la que el C++ moderno puede ser tan
eficiente sin sacrificar la comodidad de devolver y pasar objetos por valor. La
verás aparecer en toda la STL y en la mayoría del código moderno. ¡Con esto
completamos la base de la POO!