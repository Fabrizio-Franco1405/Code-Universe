# Funciones inline en C++

Las **funciones inline** son una forma de sugerirle al compilador que inserte el código de la función directamente en el lugar donde se llama, en lugar de hacer una llamada tradicional a la función. Esto puede mejorar el rendimiento en funciones pequeñas, aunque no siempre es beneficioso.

## 1. Concepto y motivación

En una llamada de función tradicional, el programa:
1. Guarda el estado actual (registros, stack).
2. Salta a la dirección de la función.
3. Ejecuta la función.
4. Regresa al punto de la llamada.

Este proceso introduce un **costo adicional**.  
Las funciones `inline` buscan **eliminar ese overhead**, expandiendo la función en el mismo sitio donde se invoca.

```cpp
#include <iostream>
using namespace std;

inline int cuadrado(int x) {
    return x * x;
}

int main() {
    cout << cuadrado(5) << endl; // El compilador puede reemplazarlo por: cout << (5*5) << endl;
}
```

## 2. `inline` como sugerencia al compilador

- La palabra clave `inline` es **solo una sugerencia**.

- El compilador puede decidir ignorarla si cree que no es conveniente (por ejemplo, en funciones muy grandes o recursivas).

```cpp
inline int sumar(int a, int b) {
    return a + b;
}
```

::: warning Advertencia
⚠️ El uso de `inline` no garantiza que el compilador inserte el código; la decisión final siempre la toma el compilador.
:::

## 3. Ventajas y desventajas

**Ventajas**

- Elimina el costo de llamada de función.

- Puede optimizar funciones muy pequeñas y usadas con frecuencia (ej: getters, setters).

- Facilita la definición de funciones en **headers (`.h`)** sin problemas de duplicación.

**Desventajas**

- Puede **aumentar el tamaño del binario** si se usa en funciones grandes y llamadas muchas veces.

- Menor efectividad en funciones **complejas o recursivas**.

- El compilador moderno ya optimiza muchas funciones sin necesidad de `inline`.

## 4. Inline en headers

Una de las razones más prácticas para usar `inline` es poder **definir funciones en archivos de cabecera (`.h`)** sin que el linker genere errores por múltiples definiciones.

```cpp
// Archivo: operaciones.h
#pragma once
inline int multiplicar(int a, int b) {
    return a * b;
}
```

De esta forma, aunque el header se incluya en varios `.cpp`, el compilador trata a la función como si fuera **una sola definición compartida**.

::: tip
💡 Se recomienda usar `inline` en funciones muy pequeñas que necesariamente deben estar en el header, como **operadores sobrecargados** o **funciones de librerías template**.
:::

## 5. Resumen rápido

- `inline` **sugiere** expansión en el lugar de la llamada.

- Útil en **funciones pequeñas y frecuentes**.

- Ideal para **headers**.

- Puede aumentar el **tamaño del binario** si se abusa de él.

- Hoy en día, los compiladores modernos ya realizan **inlining automático** cuando lo consideran apropiado.