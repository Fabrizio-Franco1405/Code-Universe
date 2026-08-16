---
outline: [2, 3]
---

# Patrones creacionales: Factory

En el capítulo anterior te contamos qué son los patrones de diseño y por qué conviene tenerlos
en tu caja de herramientas. Ahora vamos a entrar en materia con la primera gran familia: los
**patrones creacionales**, esos que se encargan de *cómo se crean los objetos*. Y dentro de esa
familia hay uno que brilla por su presencia en la industria: el **Factory**.

El nombre ya te va dando una pista: *factory* en inglés significa **fábrica**. Piénsalo como la
fábrica de cualquier producto: vos no sabés (ni te importa) cómo se ensambla cada pieza interna,
solamente pedís lo que necesitás y la fábrica se encarga del resto. Acá es exactamente lo mismo,
pero con objetos.

Es uno de los patrones más usados en la industria, y encaja perfectamente con el C++ moderno.

## 1. El problema: crear objetos con `new` a mano

Para entender por qué existe el Factory, primero tenemos que ver el dolor que resuelve. Sin él,
cada vez que quieres crear un objeto debes conocer la clase concreta. Es decir, tu código sabe
*demasiado*: no solo qué quiere crear, sino también todos los tipos posibles que existen y cómo
se llaman.

```cpp
// El llamador necesita conocer todas las clases concretas
Producto *p;

if (tipo == "carne") {
    p = new Bistec();
} else if (tipo == "pescado") {
    p = new Salmón();
} else {
    p = new Verduras();
}
```

A primera vista parece inofensivo, pero este código tiene varios problemas:

- El llamador debe conocer **todas** las clases concretas. Si mañana aparece un plato nuevo,
  habrá que ir a actualizar este bloque en cada rincón del programa.
- Añadir un plato nuevo significa **tocar este código** en todos los sitios donde se crea. Es
  código que se duplica y que se desactualiza con el tiempo.
- La lógica de creación está **dispersa** por el programa, repartida acá y allá, sin un único
  punto de control.

En otras palabras: cada vez que quieras agregar una clase, tenés que cazar todos los `if` del
proyecto. Eso es exactamente lo que queremos evitar.

## 2. La solución: Factory Method

El **Factory Method** resuelve todo eso definiendo un método que crea objetos sin especificar la
clase concreta. ¿Cómo? Con dos piezas: una interfaz común (el "contrato" que todos los productos
cumplen) y una función que decide qué clase usar según lo que le pidamos.

```cpp
#include <iostream>
#include <memory>
#include <string>
using namespace std;

// 1. Interfaz común (producto)
class Plato {
public:
    virtual ~Plato() = default;
    virtual void preparar() = 0;
};

// 2. Productos concretos
class Bistec : public Plato {
public:
    void preparar() override { cout << "Bistec a la parrilla" << endl; }
};

class Salmón : public Plato {
public:
    void preparar() override { cout << "Salmón al horno" << endl; }
};

// 3. Factory Method: decide qué producto crear
unique_ptr<Plato> crearPlato(const string &tipo) {
    if (tipo == "carne")    return make_unique<Bistec>();
    if (tipo == "pescado")  return make_unique<Salmón>();
    return nullptr;
}

int main() {
    auto plato = crearPlato("pescado");
    plato->preparar(); // Salmón al horno
    return 0;
}
```

Fijate en el detalle clave: el llamador (en este caso `main`) no sabe nada de `Bistec` ni de
`Salmón`. Solo conoce la interfaz `Plato` y la función `crearPlato`. Es como ir a un restaurante:
vos pedís "pescado" y el chef decide qué plato te sirve; no entrás a la cocina a elegir cada
ingrediente.

Fíjate también que estamos usando `unique_ptr` y `make_unique` en lugar de un `new` suelto. Como
ya hemos hablado en capítulos anteriores, los punteros inteligentes son la forma moderna y segura
de manejar la memoria: nadie se tiene que acordar de liberar nada a mano.

::: tip
💡 El llamador solo conoce la **interfaz** `Plato`. Añadir un plato nuevo = añadir una clase + una línea en el factory. Nada más se toca.
:::

## 3. Factory con enumeraciones (más seguro)

Usar strings como "carne" funciona, pero tiene un problema: un error de escritura (por ejemplo,
"carne" con tilde o "CARNE" en mayúsculas) pasa desapercibido hasta que el programa se comporta
raro en ejecución. Una **enum** es más segura porque el compilador detecta los errores de
escritura en tiempo de compilación. Es la diferencia entre acordarte de escribir el valor exacto
a mano o dejar que el compilador te avise si te equivocás.

```cpp
#include <iostream>
#include <memory>
using namespace std;

enum class TipoPlato { Carne, Pescado, Vegetal };

class Plato {
public:
    virtual ~Plato() = default;
    virtual void preparar() = 0;
};

class Bistec : public Plato {
public:
    void preparar() override { cout << "Bistec a la parrilla" << endl; }
};

class Ensalada : public Plato {
public:
    void preparar() override { cout << "Ensalada fresca" << endl; }
};

unique_ptr<Plato> crearPlato(TipoPlato tipo) {
    switch (tipo) {
        case TipoPlato::Carne:   return make_unique<Bistec>();
        case TipoPlato::Vegetal: return make_unique<Ensalada>();
        default:                 return nullptr;
    }
}

int main() {
    auto plato = crearPlato(TipoPlato::Vegetal);
    plato->preparar(); // Ensalada fresca
    return 0;
}
```

El `switch` acá es casi un espejo del `if` anterior, pero con una diferencia enorme: los valores
son *tipos*, no texto libre. Y si en el futuro querés que el compilador te avise cuando te falte
cubrir un caso nuevo de la enum, podés combinar esto con el warning `-Wswitch` que vimos en el
capítulo de los flags.

## 4. Fábrica abstracta: familias de productos

Hasta acá el Factory Method crea un producto por vez. Pero a veces el problema es más grande:
quieres crear **familias** de objetos relacionados entre sí. Eso es la **Abstract Factory**: una
interfaz que produce varios productos relacionados, garantizando que todos pertenezcan a la misma
"familia" y sean coherentes entre ellos.

Pensalo así: si diseñás una interfaz de usuario, no querés que un botón oscuro se mezcle con un
checkbox claro. Querés que todo el tema sea coherente. La Abstract Factory se encarga exactamente
de eso.

```cpp
#include <iostream>
#include <memory>
using namespace std;

// Productos
class Botón {
public:
    virtual ~Botón() = default;
    virtual void click() = 0;
};
class Checkbox {
public:
    virtual ~Checkbox() = default;
    virtual void marcar() = 0;
};

// Variantes de un tema
class BotónOscuro : public Botón {
public:
    void click() override { cout << "Botón oscuro clicado" << endl; }
};
class CheckboxOscuro : public Checkbox {
public:
    void marcar() override { cout << "Checkbox oscuro marcado" << endl; }
};

// Fábrica abstracta: crea una familia coherente
class Tema {
public:
    virtual ~Tema() = default;
    virtual unique_ptr<Botón> crearBotón() = 0;
    virtual unique_ptr<Checkbox> crearCheckbox() = 0;
};

class TemaOscuro : public Tema {
public:
    unique_ptr<Botón> crearBotón() override { return make_unique<BotónOscuro>(); }
    unique_ptr<Checkbox> crearCheckbox() override { return make_unique<CheckboxOscuro>(); }
};

int main() {
    unique_ptr<Tema> tema = make_unique<TemaOscuro>();

    auto boton = tema->crearBotón();
    auto check = tema->crearCheckbox();

    boton->click();
    check->marcar();
    return 0;
}
```

Acá `Tema` es la fábrica abstracta: no fabrica un solo producto, sino toda una familia. Y como
quien la usa solo conoce la interfaz `Tema`, no hay forma de pedirle a un tema oscuro que fabrique
un checkbox claro. La coherencia está garantizada por diseño, no por buena suerte.

::: info Nota
ℹ️ Garantiza que los objetos de una **misma familia** sean coherentes (nunca mezclarás un botón oscuro con un checkbox claro). Perfecto para temas de UI, bases de datos, etc.
:::

## 5. `std::function` + map: el factory moderno

Con C++ moderno, hay una forma todavía más elegante de construir un factory: guardar **lambdas**
dentro de un `map`. En lugar de una cascada de `if` o un `switch`, cada tipo se registra con su
propia función de creación, y crear un objeto es simplemente buscar en el mapa.

```cpp
#include <iostream>
#include <memory>
#include <functional>
#include <map>
using namespace std;

class Tarea {
public:
    virtual ~Tarea() = default;
    virtual void ejecutar() = 0;
};

class TareaImprimir : public Tarea {
public:
    void ejecutar() override { cout << "Imprimiendo..." << endl; }
};
class TareaGuardar : public Tarea {
public:
    void ejecutar() override { cout << "Guardando..." << endl; }
};

// Registro de factories por nombre
map<string, function<unique_ptr<Tarea>()>> fabricas = {
    {"imprimir", []() { return make_unique<TareaImprimir>(); }},
    {"guardar",  []() { return make_unique<TareaGuardar>(); }},
};

int main() {
    auto tarea = fabricas["guardar"](); // Busca y ejecuta la lambda
    tarea->ejecutar(); // Guardando...
    return 0;
}
```

Mirá qué limpio queda: el `map` guarda, por cada nombre, una `std::function` que devuelve el
objeto correspondiente. Añadir un tipo nuevo no implica tocar ninguna lógica central; simplemente
se agrega una entrada más al mapa. En capítulos anteriores vimos `std::function` y las lambdas por
separado; acá ves cómo se combinan para resolver un problema real de diseño.

::: tip
💡 Este patrón (registro de lambdas) permite **añadir tipos sin tocar el factory**: solo añades una entrada al `map`.
:::

## 6. Buenas prácticas

Para cerrar con el Factory, un repaso de las prácticas que más te van a ayudar:

- Usa Factory cuando la creación es compleja o decide según condiciones. Para objetos simples,
  un constructor directo alcanza.
- Devuelve `unique_ptr` (o `shared_ptr`) para que la memoria sea segura.
- Prefiere **enum** en lugar de strings para los tipos.
- Mantén el factory en **un solo sitio**, no disperso.
- Usa el registro con lambdas para extensibilidad.

## 7. Resumen rápido

- **Factory Method**: un método decide qué clase concreta crear.
- El llamador solo conoce la **interfaz**, no las clases concretas.
- **Abstract Factory**: crea **familias** de productos coherentes.
- Devuelve punteros inteligentes, nunca `new` suelto.
- Puedes registrar fábricas con `map<string, function<...>>` (moderno).
- Añadir un producto = añadir una clase + un registro.

El Factory resuelve la creación flexible de objetos. Pero los patrones creacionales no se agotan
acá: hay otro muy usado (y, seamos honestos, muy discutido) que asegura que una clase tenga **una
única instancia** en todo el programa. Es el **Singleton**, y es el próximo patrón que vamos a
desmenuzar.

## Patrón Singleton

A veces, un recurso debe tener **una única instancia** en todo el programa: la configuración, el
registro de logs, la conexión a la base de datos. Si creas dos configuraciones, cada una tendría
valores distintos y el caos reinaría. Pensalo como el termostato de tu casa: no tiene sentido
tener dos, cada uno con una temperatura distinta, discutiendo entre sí.

El **Singleton** garantiza que una clase tenga **una única instancia** y ofrece un punto global de
acceso a ella. Es uno de los patrones más conocidos (y más abusados) de la historia. Su nombre
viene del inglés *single*, que significa **único**: una sola instancia, nada más.

## 1. El problema: ¿cuántas configuraciones?

Pongamos el caso más común para entender de qué hablamos. Imaginá que tu programa guarda una
configuración global (el tema de la interfaz, por ejemplo). Sin Singleton, cualquier parte del
programa podría crear su propia copia, y cada copia tendría sus propios valores:

```cpp
Configuracion c1; // ¿Y si otra parte del código crea c2?
c1.setTema("oscuro");

// En otra parte del programa...
Configuracion c2; // ¡Una configuración distinta!
cout << c2.getTema() << endl; // Valor por defecto, no "oscuro"
```

Cuando varias partes del programa necesitan **la misma** instancia, crear objetos separados rompe
el estado compartido. El Singleton lo resuelve.

## 2. El Singleton clásico (Meyers Singleton)

La forma más simple y segura en C++ moderno usa una **variable estática local**, que se inicializa
de forma segura para hilos. Fijate que acá no hay punteros manuales ni `new`; la magia ocurre
dentro de la función `getInstancia`:

```cpp
#include <iostream>
#include <string>
using namespace std;

class Configuracion {
private:
    string tema = "claro";
    int volumen = 50;

    // Constructor privado: nadie puede crear otra instancia
    Configuracion() = default;

public:
    // Elimina copia y asignación
    Configuracion(const Configuracion &) = delete;
    Configuracion &operator=(const Configuracion &) = delete;

    // Único punto de acceso
    static Configuracion &getInstancia() {
        static Configuracion instancia; // Se crea una sola vez
        return instancia;
    }

    void setTema(const string &t) { tema = t; }
    string getTema() const { return tema; }
};

int main() {
    // Todos acceden a la MISMA instancia
    Configuracion::getInstancia().setTema("oscuro");

    cout << Configuracion::getInstancia().getTema() << endl; // "oscuro"

    return 0;
}
```

::: tip
💡 Este es el **Meyers Singleton** (por Scott Meyers). Es la forma correcta en C++ moderno: simple, eficiente y **segura para hilos** (la inicialización de estáticas locales es atómica desde C++11).
:::

## 3. ¿Por qué el constructor es privado?

Capaz te estás preguntando por qué tanto lío con el constructor. La respuesta es simple: si el
constructor fuera público, cualquier código podría crear instancias nuevas y el patrón se vendría
abajo. Al hacerlo **privado**, el compilador impide crear objetos desde fuera:

```cpp
// ⚠️ Error: el constructor es privado

Configuracion::getInstancia(); // ✔ La única vía de acceso
```

Y el borrado de copia/asignación garantiza que nadie pueda **clonar** la instancia. Sin esas
líneas, alguien podría "copiar" la configuración y volver a tener dos objetos distintos, que es
justo lo que queríamos evitar:

```cpp
// ⚠️ Error: la copia está borrada
```

## 4. ¿Cuándo usarlo (y cuándo NO)?

Acá tenemos que ser muy honestos contigo, porque el Singleton es un caso particular: está tan
presente en la industria que parece inofensivo, pero en la práctica se abusa muchísimo de él.

::: warning Advertencia
⚠️ El Singleton es el patrón más **discutido** de la historia. Se abusa muchísimo, y muchos programadores lo consideran un anti-patrón. Úsalo con cabeza.
:::
| Cuándo usarlo | Cuándo evitarlo |
|---|---|
| Configuración global única | Casi todo lo demás |
| Registro de logs (aunque a menudo basta una función) | "Por si acaso necesito una instancia global" |
| Conexión única a recursos | Para ocultar dependencias globales |
| Recursos de hardware (impresora, GPU) | Cuando dificulta los tests (no puedes inyectar otra instancia) |
El mayor problema: el Singleton introduce **estado global oculto**, lo que dificulta las pruebas.
Si dos funciones dependen de "la" configuración, no puedes probarlas con valores distintos sin
cambiarla globalmente. Es como si el programa entero compartiera un mismo cuaderno de notas: lo
que escribe una parte lo leen todas, y no hay manera de darle un cuaderno distinto a cada una.

## 5. Alternativa moderna: inyección de dependencias

Para pruebas y flexibilidad, muchos prefieren **pasar la configuración por parámetro** en lugar de
usar un Singleton. Esto se conoce como **inyección de dependencias**, y es una de las alternativas
más sanas al estado global:

```cpp
#include <iostream>
using namespace std;

class Configuracion {
private:
    string tema;
public:
    Configuracion(string t) : tema(move(t)) {}
    string getTema() const { return tema; }
};

// La configuración se inyecta: fácil de probar
void aplicarTema(Configuracion &config) {
    cout << "Tema aplicado: " << config.getTema() << endl;
}

int main() {
    Configuracion dev("oscuro");
    Configuracion prod("claro");

    aplicarTema(dev);  // Tema aplicado: oscuro
    aplicarTema(prod); // Tema aplicado: claro
    return 0;
}
```

Fijate que acá cada entorno tiene su propia instancia: la de desarrollo usa el tema oscuro y la de
producción el claro. No hay nada global que sincronizar, y cada función recibe exactamente lo que
necesita.

::: info Nota
ℹ️ Inyectar dependencias permite **múltiples instancias** (una por entorno, por test...) sin estado global. Muchas veces es mejor solución que el Singleton.
:::

## 6. Singleton + hilos: cuidado con el estado

Tenemos que advertirte sobre un punto que suele pasar desapercibido. Aunque la creación del
Meyers Singleton es segura para hilos, **el uso** de la instancia no lo es automáticamente. Que
nadie pueda crear dos instancias no significa que dos hilos puedan leer y escribir a la vez sin
pisotearse. Si varios hilos leen y escriben la configuración, necesitas sincronización:

```cpp
#include <iostream>
#include <thread>
#include <mutex>
using namespace std;

class Contador {
private:
    int valor = 0;
    mutex mtx;
    Contador() = default;
public:
    Contador(const Contador &) = delete;
    Contador &operator=(const Contador &) = delete;

    static Contador &getInstancia() {
        static Contador instancia;
        return instancia;
    }

    void incrementar() {
        lock_guard<mutex> lock(mtx);
        valor++;
    }
    int getValor() { return valor; }
};

int main() {
    thread t1([]() {
        for (int i = 0; i < 1000; i++) Contador::getInstancia().incrementar();
    });
    thread t2([]() {
        for (int i = 0; i < 1000; i++) Contador::getInstancia().incrementar();
    });

    t1.join();
    t2.join();
    cout << "Valor: " << Contador::getInstancia().getValor() << endl; // 2000
    return 0;
}
```

Sin el `mutex`, el resultado de este programa sería impredecible: los dos hilos podrían incrementar
el mismo valor al mismo tiempo y "perderse" incrementos. Con `lock_guard` protegemos el estado
interno y el resultado siempre es 2000.

## 7. Buenas prácticas

- Usa el **Meyers Singleton** (estática local), nunca la versión con puntero manual.
- Borra copia y asignación (`= delete`).
- Protege el **estado interno** con mutex si hay hilos.
- Pregúntate si realmente necesitas un Singleton o basta inyectar la dependencia.
- No uses Singleton para "ocultar" dependencias globales.

## 8. Resumen rápido

- El **Singleton** garantiza una única instancia y acceso global.
- La forma correcta: variable **estática local** (Meyers, C++11).
- Constructor privado + copia/asignación borradas.
- Es **seguro para hilos** al crearse, pero no al usarse.
- Úsalo con moderación: el estado global oculto dificulta los tests.
- La **inyección de dependencias** es a menudo mejor alternativa.

El Singleton resuelve la instancia única. Pasemos ahora a los patrones de comportamiento, que
rigen cómo se comunican los objetos. El primero: el **Observer**, el patrón de las notificaciones.