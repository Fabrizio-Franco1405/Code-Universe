---
outline: [2, 3]
---

# Patrones Adapter y Decorator

Para cerrar el módulo de patrones de diseño, veremos dos patrones **estructurales**: sirven para **organizar y transformar clases** sin cambiar el código original.

- **Adapter**: como un adaptador de enchufe, hace compatible lo incompatible.
- **Decorator**: como añadir toppings a una pizza, amplía funcionalidades sin tocar la base.

## 1. Adapter: el adaptador de enchufes

Viajas a otro país y tu enchufe no encaja. La solución no es rehacer el enchufe: usas un **adaptador**. El Adapter hace exactamente eso con clases: **convierte una interfaz en otra** que el cliente espera.

```
Cliente espera:  ConnectorEU      Interfaz real:  ConnectorUS
   conectarEU()                       conectarUS()
        │                                │
        └──────────► ADAPTER ◄───────────┘
                   (adapta las dos)
```

### El problema concreto

Imagina que tu código usa una clase `LecturaArchivo` con `leerTexto()`, pero te llega una librería con `loadData()`. Sin tocar ninguna de las dos, un Adapter las conecta:

```cpp
#include <iostream>
#include <memory>
using namespace std;

// 1. La interfaz que NUESTRO código espera
class Lector {
public:
    virtual ~Lector() = default;
    virtual string leer() = 0;
};

// 2. La librería externa: interfaz DIFERENTE
class LectorLegado {
public:
    string loadData() { return "datos del lector legado"; }
};

// 3. El ADAPTER: adapta la interfaz externa a la esperada
class LectorAdapter : public Lector {
private:
    unique_ptr<LectorLegado> lectorLegado;

public:
    LectorAdapter(unique_ptr<LectorLegado> l) : lectorLegado(move(l)) {}

    string leer() override {
        return lectorLegado->loadData(); // Traduce la llamada
    }
};

int main() {
    // Nuestro código usa Lector (lo que espera)
    unique_ptr<Lector> lector = make_unique<LectorAdapter>(
        make_unique<LectorLegado>()
    );

    cout << lector->leer() << endl;
    return 0;
}
```

::: tip
💡 El Adapter se usa muchísimo en el mundo real: conectar librerías de terceros, APIs antiguas (legacy), o interfaces de sistemas operativos sin reescribir el código que las consume.
:::

## 2. Decorator: los toppings de la pizza

Quieres añadir funcionalidades a un objeto sin modificar su clase: queso extra, pepperoni, cebolla... Cada topping **envuelve** al anterior. El **Decorator** añade comportamiento **envolviendo** objetos con otras clases.

```
          ┌─────────────────────────┐
          │  Con Queso Extra (topping)│
          │  ┌─────────────────────┐ │
          │  │ Con Pepperoni       │ │
          │  │  ┌───────────────┐  │ │
          │  │  │ Pizza Normal  │  │ │
          │  │  └───────────────┘  │ │
          │  └─────────────────────┘ │
          └─────────────────────────┘
```

### Implementación

```cpp
#include <iostream>
#include <memory>
using namespace std;

// 1. Componente: la interfaz común
class Pizza {
public:
    virtual ~Pizza() = default;
    virtual double precio() = 0;
    virtual string descripcion() = 0;
};

// 2. Componente concreto: la pizza base
class PizzaNormal : public Pizza {
public:
    double precio() override { return 8.0; }
    string descripcion() override { return "Pizza normal"; }
};

// 3. Decorador base: envuelve a otro Pizza
class Topping : public Pizza {
protected:
    unique_ptr<Pizza> base;
public:
    Topping(unique_ptr<Pizza> p) : base(move(p)) {}
};

// 4. Decoradores concretos: añaden comportamiento
class QuesoExtra : public Topping {
public:
    using Topping::Topping;
    double precio() override { return base->precio() + 2.0; }
    string descripcion() override { return base->descripcion() + " + queso extra"; }
};

class Pepperoni : public Topping {
public:
    using Pepperoni = Pepperoni; // (implícito)
    Pepperoni(unique_ptr<Pizza> p) : Topping(move(p)) {}
    double precio() override { return base->precio() + 3.0; }
    string descripcion() override { return base->descripcion() + " + pepperoni"; }
};

int main() {
    // Apilamos decoradores: pizza + pepperoni + queso
    auto pizza = make_unique<Pepperoni>(
        make_unique<QuesoExtra>(
            make_unique<PizzaNormal>()
        )
    );

    cout << pizza->descripcion() << " = " << pizza->precio() << " €" << endl;
    // Pizza normal + queso extra + pepperoni = 13 €

    return 0;
}
```

::: warning Advertencia
⚠️ El ejemplo de `Pepperoni` con `using Pepperoni = Pepperoni;` es incorrecto. La forma correcta es simplemente exponer el constructor, como en `QuesoExtra`:
:::

```cpp
class Pepperoni : public Topping {
public:
    using Topping::Topping; // Hereda el constructor del Topping
    double precio() override { return base->precio() + 3.0; }
    string descripcion() override { return base->descripcion() + " + pepperoni"; }
};
```

::: tip
💡 La gran ventaja: puedes **combinar decoradores libremente** (queso y pepperoni, o solo queso) sin crear una clase por cada combinación posible. Las combinaciones infinitas salen de pocos componentes.
:::

## 3. Decorator en C++ moderno: con lambdas

Al igual que en Strategy, los decoradores simples pueden ser lambdas que **envuelven** funciones:

```cpp
#include <iostream>
#include <functional>
using namespace std;

// Decorator con std::function: mide el tiempo de una función
auto conTiempo = [](function<int(int)> funcion) {
    return [funcion](int x) {
        cout << "Ejecutando..." << endl;
        int resultado = funcion(x);
        cout << "Terminado. Resultado: " << resultado << endl;
        return resultado;
    };
};

int cuadrado(int x) { return x * x; }

int main() {
    auto cuadradoConTiempo = conTiempo(cuadrado);
    cuadradoConTiempo(5); // Ejecutando... Terminado. Resultado: 25
    return 0;
}
```

## 4. Adapter vs Decorator
| Criterio | Adapter | Decorator |
|---|---|---|
| Objetivo | Hacer compatible | Añadir funcionalidad |
| Cambia la interfaz | Sí | No (la mantiene) |
| Cambia el comportamiento | Traduce | Amplía |
| Analogía | Enchufe universal | Toppings de pizza |
## 5. Buenas prácticas

- Usa **Adapter** cuando necesites conectar dos interfaces incompatibles.
- Usa **Decorator** cuando quieras añadir comportamiento sin multiplicar las subclases.
- Prefiere composición (envolver) sobre herencia cuando sea posible.
- Combínalos con `unique_ptr` y `std::function` para código moderno limpio.
- No los uses si una función simple resuelve el problema.

## 6. Resumen rápido

- **Adapter** convierte una interfaz en otra (compatibilidad).
- **Decorator** envuelve objetos para añadir comportamiento.
- El Adapter no cambia el comportamiento: **traduce** la interfaz.
- El Decorator **amplía** manteniendo la misma interfaz.
- La composición (envolver) es preferible a la herencia.
- En C++ moderno, lambdas y `std::function` simplifican ambos.

Con esto cerramos el módulo de patrones de diseño. Tienes ya las herramientas del C++ moderno y las soluciones probadas para estructurar tu código. En la siguiente parte, entraremos en el mundo profesional: **cómo se construyen y despliegan los proyectos reales**.
