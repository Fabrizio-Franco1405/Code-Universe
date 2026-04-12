---
outline: [2, 3]
---

# Semántica de valor y referencia

En C++, **la forma en que se transmiten y manipulan los datos** es un pilar fundamental para comprender el rendimiento, la seguridad y el comportamiento de un programa.  
La *semántica de valor* y la *semántica de referencia* determinan si una variable se copia o si se accede directamente a la misma ubicación de memoria, lo que impacta en:

- El consumo de recursos.
- La posibilidad de modificar datos originales.
- La claridad y mantenibilidad del código.

Este capítulo profundiza en:
- Cómo funciona la copia de datos y cuándo es conveniente.
- Qué son las referencias y cómo permiten optimizar el acceso a memoria.
- Las diferencias clave entre ambos enfoques.
- Buenas prácticas para elegir el método adecuado según el contexto.

:::info Nota
ℹ️ Comprender estas diferencias es esencial para escribir código eficiente y evitar errores sutiles.
:::

## 1. Concepto general

En términos simples:

| Semántica | Descripción | Ejemplo básico |
|-----------|-------------|----------------|
| **Valor** | Se crea una **copia** del dato. Modificar la copia no afecta al original. | `int b = a;` |
| **Referencia** | Se accede al **mismo dato** a través de otro nombre o alias. Cambios afectan al original. | `int& ref = a;` |

## 2. Semántica de valor

Cuando una variable se pasa **por valor**, el compilador crea una copia independiente:

```cpp
#include <iostream>
using namespace std;

void incrementar(int x) {
    x++;
}

int main() {
    int numero = 5;
    incrementar(numero);
    cout << numero << endl; // [!code highlight]
}
```

En este ejemplo, numero no cambia porque la función trabaja con una copia.

:::tip 
💡 El paso por valor es seguro y evita efectos colaterales, pero puede ser costoso para objetos grandes.
:::

## 3. Semántica de referencia

En este caso, no se copia el dato, sino que se accede directamente al original. Esto permite modificarlo desde la función que lo recibe.

```cpp
#include <iostream>
using namespace std;

void incrementar(int& x) {
    x++; // Modifica el valor original
}

int main() {
    int numero = 5;
    incrementar(numero);
    cout << numero << endl; // [!code highlight]
}
```

Aquí, `numero` sí cambia porque la función recibe una referencia al valor original.

:::warning Advertencia
⚠️ Modificar datos a través de referencias puede generar efectos colaterales si no se controla adecuadamente.
:::

## 4. Diferencias clave

| Característica | Valor | Referencia |
|----------------|-------|------------|
| Copia de datos | Sí | No |
| Rendimiento | Menor para objetos grandes | Mayor (evita copias) |
| Riesgo de efectos colaterales | Bajo | Alto |
| Uso típico | Tipos primitivos, datos pequeños | Objetos grandes, necesidad de modificar el original |

## 5. Consideraciones de C++ moderno

A partir de **C++11**, se introdujeron las **referencias rvalue** y la **semántica de movimiento**, que amplían este concepto para optimizar el manejo de recursos temporales. Estos temas se abordan en profundidad en capítulos posteriores, pero es importante saber que forman parte de la misma familia de conceptos.

:::info Nota 
ℹ️ En C++ moderno, elegir entre `valor`, `referencia` o `referencia rvalue` es una decisión estratégica para optimizar rendimiento. 
:::

## 6. Buenas prácticas

- Usa **por valor** para tipos primitivos o estructuras pequeñas que no impliquen un coste significativo de copia.

- Usa **por referencia const** para evitar copias innecesarias y garantizar que el dato no se modifique.

- Usa **por referencia no const** solo cuando sea necesario modificar el dato original.

- Documenta claramente en la interfaz de la función si el parámetro se modificará.

:::danger Peligro
🛑 No abuses de las referencias no const: Pueden introducir errores difíciles de rastrear si el estado de un objeto cambia inesperadamente. 
:::

## 7. Ejemplo práctico integrador

En este ejemplo, combinamos paso por valor y por referencia para mostrar cómo afectan al flujo de datos:

```cpp
#include <iostream>
using namespace std;

void duplicarPorValor(int x) {
    x *= 2; // Solo modifica la copia
}

void duplicarPorReferencia(int& x) {
    x *= 2; // Modifica el original
}

int main() {
    int a = 5;
    int b = 5;

    duplicarPorValor(a);
    duplicarPorReferencia(b);

    cout << "a: " << a << endl; // [!code highlight]
    cout << "b: " << b << endl; // [!code highlight]
}
```

En este caso:

- `a` Mantiene su valor original porque se pasó por valor.  
- `b` Se modifica porque se pasó por referencia.

## 8. Resumen rápido

- **Valor** → copia independiente, seguro pero potencialmente más lento.
- **Referencia** → alias al original, rápido pero con riesgo de modificar datos sin intención.
- Elegir el método depende de **rendimiento**, **seguridad** y **claridad del código**.