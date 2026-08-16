---
outline: [2, 3]
---

# Enumeraciones (enum, enum class)

Imagina que estás programando un semáforo. Podrías representar sus colores con números: `0` para
rojo, `1` para amarillo y `2` para verde. Funciona, pero tiene un problema: en tres semanas ya
nadie recordará qué significaba el `2`. Peor aún, nada te impide asignar `3`, `7` o `-1`, valores
que no tienen sentido para un semáforo. Ese tipo de números sin significado se conocen como
**números mágicos**, y son uno de los enemigos silenciosos de la legibilidad.

Las **enumeraciones** resuelven exactamente ese problema: nos permiten definir un conjunto de
**nombres legibles** para representar valores relacionados, haciendo que el código sea más claro y
a prueba de errores. Es el equivalente a decir "verde" en lugar de recordar que el `2` era verde.

## 1. ¿Qué es una enumeración?

Una enumeración (también llamada **enum**) es un tipo de dato compuesto que define un conjunto de
**constantes con nombre**. En lugar de recordar números mágicos, usamos nombres que significan
algo. La palabra `enum` viene del inglés *enumeration*, que se traduce como **enumeración** o
**lista**, y la idea es justamente esa: listar las opciones válidas de una categoría.

**Sintaxis básica (enum tradicional):**

```cpp
enum Color {
    ROJO,
    AMARILLO,
    VERDE
};
```

Con esto hemos creado tres constantes: `ROJO`, `AMARILLO` y `VERDE`. Por defecto, a cada una se
le asigna automáticamente un número entero empezando desde `0`:

- `ROJO` = 0
- `AMARILLO` = 1
- `VERDE` = 2

El compilador hace esa numeración por nosotros, así que no tenemos que preocuparnos por llevar la
cuenta a mano.

## 2. Usar una enumeración

Una vez definida, podemos crear variables de ese tipo y asignarles cualquiera de los valores
permitidos. Notarás que el código se lee solo, casi como una frase en español:

```cpp
#include <iostream>
using namespace std;

enum Color {
    ROJO,
    AMARILLO,
    VERDE
};

int main() {
    Color semaforo = VERDE;

    if (semaforo == ROJO) {
        cout << "ALTO" << endl;
    } else if (semaforo == AMARILLO) {
        cout << "PRECAUCIÓN" << endl;
    } else {
        cout << "ADELANTE" << endl;
    }
}
```

::: tip
💡 En C++, los nombres de las constantes de una enumeración suelen escribirse en **MAYÚSCULAS**
para distinguirlos de las variables normales. Es una convención que viene de C y que todavía se
mantiene viva por una buena razón: a simple vista sabes que estás ante una constante.
:::

## 3. Asignar valores manualmente

No tienes por qué conformarte con el orden automático. Puedes asignar valores específicos a cada
constante, lo cual es muy útil cuando trabajamos con códigos externos (por ejemplo, códigos de
error o protocolos). Si alguna vez has visto un error con número `404` o `500`, ya sabes cómo se
siente un valor que necesita un significado detrás:

```cpp
enum Estado {
    EXITO = 0,
    ERROR_BASE_DATOS = 100,
    ERROR_RED = 200,
    ERROR_DESCONOCIDO = 999
};
```

De esta manera, el código `100` deja de ser un número frío y se convierte en `ERROR_BASE_DATOS`,
algo que cualquier persona puede entender sin leer la documentación.

## 4. El problema del `enum` tradicional

Aunque el `enum` tradicional es útil, tiene una gran debilidad: sus constantes **se mezclan con
el resto de nombres del programa**. Esto quiere decir que no puedes tener dos enumeraciones con
una constante del mismo nombre, y además puedes asignar un valor que no pertenece a la
enumeración sin que el compilador se queje.

```cpp
enum Color { ROJO, VERDE };
enum Fruta { MANZANA, ROJO }; // Error: 'ROJO' ya está definido
```

Es como si todas las constantes del programa vivieran en una misma habitación compartida: basta
un nombre repetido para que se pisen entre sí.

::: warning Advertencia
⚠️ Por esta y otras razones, en C++ moderno se desaconseja el uso del `enum` tradicional a favor
del `enum class`.
:::

## 5. `enum class`: la versión moderna (C++11)

Desde C++11 contamos con **enumeraciones con ámbito**, que se declaran con `enum class`.
Solucionan los problemas del `enum` tradicional:

- Sus constantes viven **dentro** de la enumeración, así que no chocan con otros nombres.
- Son **tipadas con seguridad**: no se convierten implícitamente a números.

**Sintaxis básica:**

```cpp
enum class Color {
    ROJO,
    AMARILLO,
    VERDE
};
```

Para usar una constante, debes prefijarla con el nombre del tipo. Ese `::` que ves se llama
**operador de resolución de ámbito**, y acá actúa como un apellido que deja claro de qué
enumeración estamos hablando:

```cpp
Color semaforo = Color::VERDE; // Usamos el operador '::'
```

## 6. Ejemplo práctico con `enum class`

Veamos un ejemplo completo que muestra las ventajas del `enum class`. Acá la clave es que `Color`
y `Fruta` pueden coexistir sin problemas aunque tengan constantes repetidas:

```cpp
#include <iostream>
using namespace std;

enum class Color { ROJO, AMARILLO, VERDE };
enum class Fruta { MANZANA, PLATANO, UVAS };

int main() {
    Color semaforo = Color::VERDE;
    Fruta favorita = Fruta::MANZANA;

    // Ahora sí pueden coexistir constantes con el mismo nombre
    if (semaforo == Color::VERDE) {
        cout << "El semáforo está en verde, puedes cruzar" << endl;
    }

    // Esto ya NO compila: no se puede comparar tipos distintos
    // if (semaforo == Fruta::MANZANA) { }

    return 0;
}
```

Fíjate en ese comentario del final: comparar un `Color` con una `Fruta` es un error de
compilación. Esa "rigidez" es en realidad una protección: el compilador nos avisa cuando estamos
mezclando categorías que no tienen nada que ver.

## 7. Convertir un `enum class` a entero

A veces necesitas el valor numérico de una constante (por ejemplo, para guardarla en un archivo o
mostrarla). Como el `enum class` no se convierte solo, debes hacer una conversión explícita con
`static_cast`:

```cpp
#include <iostream>
using namespace std;

enum class Dia { LUNES = 1, MARTES, MIERCOLES, JUEVES, VIERNES };

int main() {
    Dia dia = Dia::MIERCOLES;
    int numero = static_cast<int>(dia);
    cout << "El día 3 es: " << numero << endl; // 3
}
```

::: info Nota
ℹ️ La conversión inversa (de número a enum) también es posible, pero debes tener cuidado: si el
número no corresponde a ninguna constante, el comportamiento es indefinido.
:::

## 8. Cuándo usar cada uno
| Característica | `enum` | `enum class` |
|---|---|---|
| Ámbito de las constantes | Global | Dentro del tipo |
| Choca con otros nombres | Sí | No |
| Conversión implícita a entero | Sí | No |
| Seguridad de tipos | Baja | Alta |
| Uso recomendado | Código antiguo | **C++ moderno** |
::: tip
💡 **Regla de oro:** en código nuevo, usa siempre `enum class`. El `enum` tradicional solo lo
verás en proyectos antiguos o al interactuar con librerías que lo requieran.
:::

## 9. Buenas prácticas

- Usa `enum class` en lugar de `enum` siempre que puedas.
- Escribe los nombres de las constantes en MAYÚSCULAS.
- Agrupa en una enumeración solo valores que pertenezcan a la misma categoría.
- Evita asignar valores manualmente si no lo necesitas: deja que el compilador lo haga
  automáticamente.

## 10. Resumen rápido

- Una enumeración define **constantes con nombre** para valores relacionados.
- El `enum` tradicional es global y propenso a colisiones.
- El `enum class` (C++11) es seguro, con ámbito y la opción recomendada.
- Las constantes del `enum class` se usan con `Tipo::CONSTANTE`.
- Para obtener el valor numérico usa `static_cast<int>(valor)`.

Con las enumeraciones tu código deja de depender de números mágicos y se vuelve mucho más
expresivo. En el siguiente capítulo veremos un tipo compuesto muy particular: las uniones.