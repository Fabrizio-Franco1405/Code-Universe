---
outline: [2, 3]
---

# Patrón Observer


Es el patrón de las notificaciones, los eventos y las interfaces reactivas.

## 1. El problema: comprobar cambios a cada rato

Sin Observer, si varios componentes necesitan saber cuándo cambia un dato, tendrías dos malas opciones:

```cpp
// Opción mala 1: comprobar constantemente (polling)
while (true) {
    if (sensores.getTemperatura() != ultima) {
        alerta.actualizar(); // Desperdicia CPU
    }
}

// Opción mala 2: acoplar a mano
void cambiarTemperatura(double t) {
    temperatura = t;
    pantalla.actualizar();   // ¿Y si hay 10 componentes más?
    log.registrar();         // Cada cambio hay que avisar a mano
    motor.ajustar();         // Esto se vuelve inmanejable
}
```

El Observer invierte esto: **los interesados se registran**, y el objeto avisa a todos en un solo sitio.

## 2. La estructura del patrón

```
            ┌──────────────┐  suscribe   ┌──────────────┐
   Observado │  (Subject)   │ ◄────────── │  Observador  │
            │  cambiar()    │             │  actualizar()│
            │  notificar()  │ ──────────► └──────────────┘
            └──────────────┘   notifica
```

- **Subject**: el objeto observado. Mantiene la lista de observadores y los notifica.
- **Observer**: los interesados. Implementan `actualizar()`.

## 3. Implementación básica en C++

```cpp
#include <iostream>
#include <vector>
#include <memory>
using namespace std;

// Observador: la interfaz que todos los interesados implementan
class Observador {
public:
    virtual ~Observador() = default;
    virtual void actualizar(int valor) = 0;
};

// Subject: el objeto observado
class Termómetro {
private:
    int temperatura = 0;
    vector<shared_ptr<Observador>> observadores;

public:
    void suscribir(shared_ptr<Observador> obs) {
        observadores.push_back(obs);
    }

    void notificar() {
        for (auto &obs : observadores) {
            obs->actualizar(temperatura);
        }
    }

    void setTemperatura(int t) {
        temperatura = t;
        notificar(); // Avisa a todos los suscritos
    }
};

// Observadores concretos
class Pantalla : public Observador {
public:
    void actualizar(int valor) override {
        cout << "Pantalla: temperatura = " << valor << endl;
    }
};

class Alerta : public Observador {
public:
    void actualizar(int valor) override {
        if (valor > 30) {
            cout << "ALERTA: ¡Hace demasiado calor! (" << valor << ")" << endl;
        }
    }
};

int main() {
    Termómetro term;

    auto pantalla = make_shared<Pantalla>();
    auto alerta = make_shared<Alerta>();

    term.suscribir(pantalla);
    term.suscribir(alerta);

    term.setTemperatura(25);
    term.setTemperatura(35); // Dispara la alerta

    return 0;
}
```

::: tip
💡 Añadir un nuevo "interesado" = crear una clase `Observador` y suscribirla. **Nada más cambia**: ni el Termómetro ni los demás observadores.
:::

## 4. Observer moderno: con `std::function`

En C++ moderno no necesitas interfaces para observadores: puedes suscribir **lambdas** directamente con `std::function`. Es el estilo más habitual en código real.

```cpp
#include <iostream>
#include <vector>
#include <functional>
using namespace std;

class Termómetro {
private:
    int temperatura = 0;
    vector<function<void(int)>> suscriptores; // Lambdas, no clases

public:
    void suscribir(function<void(int)> callback) {
        suscriptores.push_back(move(callback));
    }

    void notificar() {
        for (auto &cb : suscriptores) {
            cb(temperatura);
        }
    }

    void setTemperatura(int t) {
        temperatura = t;
        notificar();
    }
};

int main() {
    Termómetro term;

    term.suscribir([](int v) {
        cout << "Pantalla: " << v << endl;
    });

    term.suscribir([](int v) {
        if (v > 30) cout << "ALERTA: calor extremo (" << v << ")" << endl;
    });

    term.setTemperatura(35);

    return 0;
}
```

::: info Nota
ℹ️ Con lambdas y `std::function`, el Observer es mucho más ligero: no hay que crear una clase por observador. Este estilo es el estándar de facto en C++ moderno.
:::

## 5. El Observer en la práctica

Este patrón está por todas partes:
| Tecnología | Uso del Observer |
|---|---|
| Interfaz de usuario | Widgets notifican clics y cambios |
| Señales y slots (Qt) | El mecanismo central de Qt |
| Publicador/suscriptor | Mensajería entre componentes |
| Videojuegos | Sistemas de eventos y logros |
| Sistemas de sensores | Reacción a cambios en tiempo real |
## 6. Consideraciones importantes

- **Orden no garantizado**: los observadores se notifican en el orden de suscripción; no lo asumas para lógica crítica.
- **Ciclos de vida**: un observador destruido no debe seguir suscrito (el `shared_ptr` ayuda, pero vigila los ciclos).
- **Bombardeo de notificaciones**: notificar a 100 observadores en cada cambio puede ser costoso.

```cpp
// Cuidado: si un observador se destruye pero sigue en la lista,
// se produce un acceso inválido. Usa shared_ptr/weak_ptr
// o retíralo de la lista al morir (método darseDeBaja()).
```

## 7. Buenas prácticas

- Suscribe **lambdas** con `std::function` para observar simple.
- Mantén la notificación **simple y rápida**: no hagas trabajo pesado dentro de `actualizar()`.
- Gestiona bien los ciclos de vida de los observadores.
- Considera notificar solo cuando el cambio es **realmente** relevante.
- Para sistemas complejos, estudia los buses de eventos.

## 8. Resumen rápido

- El **Observer** notifica automáticamente a los interesados cuando algo cambia.
- **Subject** mantiene la lista; los **observadores** reaccionan.
- Versión clásica: interfaz `Observador` con `actualizar()`.
- Versión moderna: lambdas guardadas en `std::function`.
- Es el patrón de las **notificaciones, eventos y UI**.
- Vigila ciclos de vida y no abuses de las notificaciones.

El Observer resuelve las notificaciones. El siguiente patrón de comportamiento cambia la estrategia: **Strategy**, para intercambiar algoritmos sobre la marcha.

## Patrón Strategy

Imagina una aplicación de mapas. Según el contexto, el camino óptimo cambia: a pie, en coche, en bici o en transporte público. Si metes toda esa lógica en un `if` gigante dentro de la clase Ruta, el código se vuelve ilegible.

El **Strategy** encapsula algoritmos intercambiables en clases (o lambdas) separadas y permite **cambiarlos en tiempo de ejecución** sin tocar el código que los usa.

## 1. El problema: los `if` que crecen sin parar

```cpp
// Sin Strategy: la clase conoce todos los algoritmos
class CalculadoraDeRuta {
public:
    void calcular(string metodo, double a, double b) {
        if (metodo == "coche") {
            // 40 líneas de algoritmo de coche
        } else if (metodo == "bici") {
            // 40 líneas de algoritmo de bici
        } else if (metodo == "a_pie") {
            // 40 líneas de algoritmo a pie
        }
        // Añadir el metro = añadir otro if gigante
    }
};
```

Cada algoritmo nuevo **engorda** la clase. Y si dos calculadoras necesitan algoritmos distintos, se duplica todo. El Strategy separa **cada algoritmo en su propia clase**.

## 2. La estructura del patrón

```
                ┌───────────────┐
                │  Estrategia   │ (interfaz común)
                │  calcular()   │
                └──────┬────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────┴─────┐  ┌─────┴─────┐  ┌─────┴─────┐
   │ Estrategia│  │ Estrategia│  │ Estrategia│
   │Coche     │  │Bici       │  │APie       │
   └──────────┘  └───────────┘  └───────────┘
```

- **Estrategia**: interfaz común para todos los algoritmos.
- **Estrategias concretas**: cada algoritmo en su clase.
- **Contexto**: usa una estrategia y puede cambiarla.

## 3. Implementación con herencia

```cpp
#include <iostream>
#include <memory>
using namespace std;

// 1. Estrategia: la interfaz común
class EstrategiaDeRuta {
public:
    virtual ~EstrategiaDeRuta() = default;
    virtual double calcular(double distancia) = 0;
};

// 2. Estrategias concretas: cada algoritmo en su clase
class RutaCoche : public EstrategiaDeRuta {
public:
    double calcular(double distancia) override {
        return distancia / 60.0; // 60 km/h
    }
};

class RutaBici : public EstrategiaDeRuta {
public:
    double calcular(double distancia) override {
        return distancia / 15.0; // 15 km/h
    }
};

class RutaAPie : public EstrategiaDeRuta {
public:
    double calcular(double distancia) override {
        return distancia / 5.0; // 5 km/h
    }
};

// 3. Contexto: usa la estrategia y puede cambiarla
class CalculadoraDeRuta {
private:
    unique_ptr<EstrategiaDeRuta> estrategia;

public:
    void setEstrategia(unique_ptr<EstrategiaDeRuta> e) {
        estrategia = move(e);
    }

    double tiempoEstimado(double distancia) {
        return estrategia->calcular(distancia);
    }
};

int main() {
    CalculadoraDeRuta calculadora;

    calculadora.setEstrategia(make_unique<RutaCoche>());
    cout << "En coche: " << calculadora.tiempoEstimado(30) << " h" << endl;

    calculadora.setEstrategia(make_unique<RutaBici>());
    cout << "En bici: " << calculadora.tiempoEstimado(30) << " h" << endl;

    return 0;
}
```

::: tip
💡 La `CalculadoraDeRuta` no sabe nada de velocidades. Solo dice "calcula el tiempo con la estrategia actual". Añadir el metro = crear `RutaMetro` y pasar la instancia.
:::

## 4. Strategy moderno: con lambdas y `std::function`

Para algoritmos simples, las **lambdas** evitan crear clases. `std::function` guarda el algoritmo intercambiable:

```cpp
#include <iostream>
#include <functional>
using namespace std;

class CalculadoraDeRuta {
private:
    function<double(double)> estrategia; // Un algoritmo guardado

public:
    void setEstrategia(function<double(double)> e) {
        estrategia = move(e);
    }

    double tiempoEstimado(double distancia) {
        return estrategia(distancia);
    }
};

int main() {
    CalculadoraDeRuta calculadora;

    // Estrategias como lambdas
    calculadora.setEstrategia([](double d) { return d / 60.0; }); // Coche
    cout << "Coche: " << calculadora.tiempoEstimado(30) << " h" << endl;

    calculadora.setEstrategia([](double d) { return d / 5.0; }); // A pie
    cout << "A pie: " << calculadora.tiempoEstimado(30) << " h" << endl;

    return 0;
}
```

::: info Nota
ℹ️ Si la estrategia es **una función simple**, la lambda es la opción más limpia. Si cada estrategia necesita **estado o varias funciones**, usa clases.
:::

## 5. Strategy vs herencia normal

La diferencia clave con la herencia tradicional:
| Enfoque | Problema |
|---|---|
| Herencia para variantes | Una clase base con subclases rígidas; cambiar comportamiento en runtime es difícil |
| **Strategy** | El comportamiento es **composable** y se cambia **en tiempo de ejecución** |
Con Strategy separas **qué** se hace (el algoritmo) de **quién** lo usa (el contexto), y puedes combinar libremente.

## 6. ¿Dónde se usa Strategy en la práctica?
| Caso real | Estrategias posibles |
|---|---|
| Ordenar datos | Quicksort, mergesort, insertionsort |
| Comprimir archivos | ZIP, RAR, GZIP |
| Pagos | Tarjeta, PayPal, contra reembolso |
| Algoritmos de búsqueda | BFS, DFS, Dijkstra |
| Formateo de salida | JSON, XML, CSV |
## 7. Buenas prácticas

- Usa Strategy cuando tengas **varios algoritmos** que cambian según el contexto.
- Mantén la interfaz de estrategia **mínima** (una o dos funciones).
- Prefiere **lambdas** para estrategias simples, clases para las complejas.
- Permite **cambiar la estrategia en tiempo de ejecución** (esa es su ventaja).
- No uses Strategy si solo hay una variante: es sobreingeniería.

## 8. Resumen rápido

- El **Strategy** encapsula algoritmos intercambiables.
- **Estrategia** = interfaz común; **concretas** = cada algoritmo; **contexto** = las usa.
- Se cambia el algoritmo **en tiempo de ejecución** sin tocar el contexto.
- En C++ moderno, **lambdas + `std::function`** para estrategias simples.
- Separa el *qué* (algoritmo) del *quién* (contexto).
- Úsalo solo si realmente necesitas intercambiar algoritmos.

El Strategy intercambia algoritmos. Para cerrar los patrones de comportamiento y estructurales, veremos **Adapter y Decorator**: dos formas de transformar y ampliar objetos existentes.
