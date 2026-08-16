---
outline: [2, 3]
---

# Introducción a hilos

Hasta ahora, todos nuestros programas son **secuenciales**: ejecutan una instrucción tras otra, de principio a fin. Pero las computadoras modernas tienen varios núcleos que pueden trabajar **simultáneamente**. ¿Y si nuestro programa pudiera aprovecharlos?

Eso es la **concurrencia**: hacer que varias tareas avancen a la vez. En este capítulo entenderemos los conceptos fundamentales y veremos por qué es uno de los temas más importantes (y delicados) de la programación moderna.

## 1. Concurrencia vs paralelismo

Aunque a menudo se usan como sinónimos, no son lo mismo:
| Concepto | Significado | Analógico |
|---|---|---|
| **Concurrencia** | Varias tareas **intercaladas** en el tiempo | Un cocinero alterna entre varias recetas |
| **Paralelismo** | Varias tareas **a la vez** en distintos núcleos | Varios cocineros, cada uno con su receta |

```
Concurrencia (intercalado):      Paralelismo (a la vez):
┌─────┐┌─────┐┌─────┐            ┌─────────────┐
│ A A ││ B B ││ A A │            │  A A A A A  │
└─────┘└─────┘└─────┘            └─────────────┘
                                  ┌─────────────┐
                                  │  B B B B B  │
                                  └─────────────┘
```

::: info Nota
ℹ️ Con **un solo núcleo** solo hay concurrencia (las tareas se reparten el tiempo). Con **varios núcleos** podemos tener verdadero paralelismo.
:::

## 2. ¿Qué es un hilo (thread)?

Un **hilo** es la unidad más pequeña de ejecución que puede gestionar el sistema operativo. Un programa (proceso) puede tener varios hilos, todos compartiendo la misma memoria pero ejecutando código diferente.

```
┌───────────── PROCESO ─────────────┐
│                                   │
│  ┌────┐  ┌────┐  ┌────┐           │
│  │Hilo1│  │Hilo2│  │Hilo3│         │
│  └────┘  └────┘  └────┘           │
│   memoria compartida              │
└───────────────────────────────────┘
```

- **Todos comparten la misma memoria** (variables globales, datos).
- Cada uno tiene su propia pila y registros.
- El sistema operativo decide **cuándo** ejecuta cada uno.

## 3. ¿Por qué usar hilos?
| Beneficio | Ejemplo |
|---|---|
| **Aprovechar múltiples núcleos** | Procesar 4 imágenes en 4 núcleos a la vez |
| **No bloquear la interfaz** | La interfaz responde mientras se descarga un archivo |
| **Simular sistemas reales** | Servidores atendiendo a muchos clientes |
| **Reducir tiempos de espera** | Esperar a varias APIs en paralelo |
## 4. El primer problema: carreras de datos (data race)

Aquí aparece el gran villano de la concurrencia. Como los hilos comparten memoria, **dos hilos pueden modificar la misma variable al mismo tiempo**, con resultados impredecibles.

```cpp
#include <iostream>
#include <thread>
using namespace std;

int contador = 0; // Compartida por todos los hilos

void incrementar() {
    for (int i = 0; i < 100000; i++) {
        contador++; // ¡Operación no atómica!
    }
}

int main() {
    thread hilo1(incrementar);
    thread hilo2(incrementar);

    hilo1.join();
    hilo2.join();

    cout << "Contador final: " << contador << endl;
    // ¿200000? ¿199998? ¿¿150432?? Depende de la suerte
    return 0;
}
```

::: danger Peligro
🛑 Este es un **data race**: el resultado no es `200000` casi nunca. `contador++` es en realidad "leer, sumar, guardar" (3 pasos), y los hilos pueden intercalarse a mitad de camino, perdiendo incrementos. Este es el error más famoso de la concurrencia.
:::

## 5. Los problemas clásicos de la concurrencia
| Problema | Descripción |
|---|---|
| **Data race** | Dos hilos modifican el mismo dato a la vez |
| **Deadlock** | Hilos bloqueados esperándose entre sí para siempre |
| **Starvation** | Un hilo nunca consigue acceso a los recursos |
| **Interleaving** | El orden de ejecución es impredecible |
En los próximos capítulos aprenderás las herramientas para resolverlos: **mutex**, **variables atómicas**, **futuros** y patrones seguros.

## 6. La biblioteca estándar de hilos

Desde **C++11**, la concurrencia está en la biblioteca estándar. Lo esencial:
| Cabecera | Contenido |
|---|---|
| `<thread>` | `std::thread` (crear hilos) |
| `<mutex>` | `std::mutex`, `std::lock_guard` |
| `<atomic>` | `std::atomic<T>` |
| `<future>` | `std::future`, `std::promise`, `std::async` |
| `<condition_variable>` | Sincronización por condiciones |
En el próximo capítulo aprenderemos a crear y manejar hilos con `std::thread`.

## 7. Buenas prácticas

- Antes de usar hilos, pregúntate si realmente los necesitas.
- Minimiza la memoria compartida entre hilos.
- Nunca accedas a datos compartidos sin sincronización.
- Mantén los hilos simples y con una sola responsabilidad.

## 8. Resumen rápido

- La **concurrencia** intercala tareas; el **paralelismo** las ejecuta a la vez.
- Un **hilo** es una unidad de ejecución dentro del proceso.
- Los hilos **comparten memoria**, por eso son peligrosos y poderosos.
- El **data race** es el error más común (resultados impredecibles).
- C++11 trae hilos a la biblioteca estándar (`<thread>`, `<mutex>`, ...).
- La concurrencia necesita **sincronización** para ser segura.

Ahora que entiendes los riesgos, en el siguiente capítulo veremos cómo **crear y manejar hilos** correctamente con `std::thread`.
