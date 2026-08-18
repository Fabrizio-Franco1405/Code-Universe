---
outline: [2, 3]
---

# Punteros inteligentes (RAII)

En el capítulo anterior vimos los peligros de gestionar memoria a mano con `new` y `delete`: fugas
de memoria, punteros colgantes, dobles liberaciones... Y quizás pensaste: "¿no habrá una forma más
segura?" La respuesta es sí, y se llama **punteros inteligentes** (smart pointers).

Desde **C++11**, la biblioteca estándar incluye punteros que se liberan a sí mismos. Si en el
capítulo anterior aprendiste los errores, hoy aprenderás la solución. Este es uno de esos temas
que cambian tu forma de programar para siempre: después de conocerlos, volver al `new`/`delete`
manual se siente como andar a caballo cuando ya existe el tren.

## 1. La idea central: RAII

Los punteros inteligentes se basan en un principio llamado **RAII** (*Resource Acquisition Is
Initialization*), que traducido sería algo así como "la adquisición de recursos es la
inicialización".

La idea es elegante en su sencillez:

1. Cuando creamos un puntero inteligente, este **reserva** la memoria.
2. Cuando el puntero inteligente **sale de su ámbito** (muere), automáticamente libera la memoria.

Así, el recurso siempre se libera, sin importar si el código terminó bien, mal o lanzó una
excepción. Es como tener un empleado que apaga las luces al salir: no depende de que te acuerdes,
simplemente pasa.

::: tip
💡 El compilador garantiza que los destructores se ejecuten, así que el puntero inteligente nunca
"olvidará" liberar la memoria. Es imposible olvidarse del `delete` porque no existe: todo es
automático.
:::

## 2. Los tres punteros inteligentes

La biblioteca estándar nos ofrece tres tipos, cada uno con una "personalidad" distinta:

| Puntero | Propietario | Cuándo usarlo |
|---|---|---|
| `std::unique_ptr` | Único | Un solo dueño, la opción por defecto |
| `std::shared_ptr` | Compartido | Varios dueños del mismo objeto |
| `std::weak_ptr` | Sin propiedad | Observador sin aumentar el conteo |

Para usarlos necesitamos la cabecera `<memory>`.

## 3. `std::unique_ptr`: El dueño único

Un `unique_ptr` es un puntero que tiene **propiedad exclusiva** del objeto. No puede haber dos
`unique_ptr` apuntando al mismo recurso. Se crea con `std::make_unique`:

```cpp
#include <iostream>
#include <memory>
using namespace std;

int main() {
    unique_ptr<int> numero = make_unique<int>(42);
    cout << *numero << endl; // 42

    // No es necesario delete: se libera al salir de main()
    return 0;
}
```

**Transfiriendo la propiedad:** como no puede haber dos dueños, si queremos "pasar" el puntero a
otra variable, usamos `std::move`:

```cpp
unique_ptr<int> a = make_unique<int>(10);
unique_ptr<int> b = move(a); // Ahora 'b' es el dueño

// 'a' ya no tiene el puntero (es nullptr)
if (a == nullptr) {
    cout << "a está vacío" << endl;
}
cout << *b << endl; // 10
```

::: info Nota
ℹ️ Un `unique_ptr` se puede copiar, pero al moverlo dejamos al original vacío. Esta es la garantía
de que el recurso siempre tenga un único dueño. Es como entregar las llaves del auto: el que las
recibe es el nuevo dueño, y el anterior se queda sin llaves.
:::

**Con arreglos y objetos:**

```cpp
unique_ptr<int[]> datos = make_unique<int[]>(100); // Arreglo de 100 enteros
unique_ptr<Persona> persona = make_unique<Persona>("Juan", 25);
```

## 4. `std::shared_ptr`: Propiedad compartida

Un `shared_ptr` permite que **varios punteros compartan** el mismo recurso. Lleva un contador
interno: el objeto se libera solo cuando el **último** `shared_ptr` que lo referenciaba muere.

```cpp
#include <iostream>
#include <memory>
using namespace std;

int main() {
    shared_ptr<int> a = make_shared<int>(100);
    {
        shared_ptr<int> b = a; // Ahora hay 2 referencias

        cout << "Usos dentro del bloque: " << a.use_count() << endl; // 2
    }
    // 'b' murió: queda 1 referencia

    cout << "Usos fuera del bloque: " << a.use_count() << endl; // 1
    cout << *a << endl; // 100
    // La memoria se libera cuando 'a' muera
    return 0;
}
```

::: warning Advertencia
⚠️ `shared_ptr` es muy cómodo, pero tiene un costo: mantener el contador de referencias consume
tiempo y memoria. Usa `unique_ptr` siempre que puedas y reserva `shared_ptr` para cuando realmente
haya varios dueños.
:::

**El problema de las referencias circulares:** si dos objetos se referencian entre sí con
`shared_ptr`, su contador nunca llega a cero y la memoria **nunca se libera**. Para resolverlo se
usa `std::weak_ptr`.

## 5. `std::weak_ptr`: El observador

Un `weak_ptr` es un puntero que **observa** el objeto de un `shared_ptr` sin contar como
referencia. No puede usarse directamente: primero debe convertirse a `shared_ptr` con `lock()`.

```cpp
#include <iostream>
#include <memory>
using namespace std;

int main() {
    shared_ptr<int> compartido = make_shared<int>(50);
    weak_ptr<int> debil = compartido; // No aumenta el contador

    cout << "Usos: " << compartido.use_count() << endl; // 1 (weak no cuenta)

    // Para usar el valor, pedimos un 'lock'
    if (shared_ptr<int> temporal = debil.lock()) {
        cout << *temporal << endl; // 50
    } else {
        cout << "El objeto ya no existe" << endl;
    }
}
```

::: tip
💡 `lock()` nos devuelve un `shared_ptr` temporal. Si el objeto ya fue liberado, `lock()` devuelve
un puntero vacío y podemos detectarlo con el `if`. Es como mirar por la ventana: ves lo que hay,
pero no afectás la propiedad de la casa.
:::

## 6. ¿Cuándo usar cada uno?
| Situación | Puntero recomendado |
|---|---|
| Un solo dueño, caso general | `std::unique_ptr` |
| Varios dueños independientes | `std::shared_ptr` |
| Evitar referencias circulares | `std::weak_ptr` |
| Observar sin poseer | `std::weak_ptr` |

## 7. Buenas prácticas

- Usa `std::make_unique` y `std::make_shared` en lugar de `new` directamente: son más seguros y
  eficientes.
- Prefiere `unique_ptr` por defecto; solo usa `shared_ptr` cuando sea necesario.
- Evita referencias circulares con `shared_ptr`; usa `weak_ptr` para romperlas.
- No mezcles punteros crudos (`new`) con punteros inteligentes en el mismo código salvo que sepas
  exactamente quién posee el recurso.

## 8. Resumen rápido

- Los punteros inteligentes liberan memoria **automáticamente** al salir del ámbito (RAII).
- `unique_ptr`: un solo dueño, es el puntero por defecto.
- `shared_ptr`: varios dueños, con contador de referencias.
- `weak_ptr`: observador que no aumenta el contador.
- Crea punteros inteligentes con `make_unique` / `make_shared`.
- Evitan fugas, punteros colgantes y dobles liberaciones.

Con los punteros inteligentes, la gestión de memoria deja de ser una fuente constante de errores y
se vuelve algo automático y seguro. Es uno de los cambios más importantes que trajo el C++ moderno,
y lo verás aparecer una y otra vez en el resto de la guía. En el siguiente capítulo cerramos esta
parte con un tema que conecta todo lo aprendido: los punteros a funciones.