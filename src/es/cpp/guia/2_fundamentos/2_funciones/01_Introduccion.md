# Introducción a las funciones

En C++, una **función** es un bloque de código reutilizable diseñado para realizar una tarea específica. Su propósito es **modularizar** el programa, dividiendo el código en unidades más pequeñas y fáciles de comprender.

## ¿Qué es una función?

Podemos ver a una función como una **caja negra** y se compone de tres partes:

- **Entrada:** Recibe datos a través de parámetros.  
- **Proceso:** Ejecuta instrucciones con esos datos.  
- **Salida:** Devuelve (o no) un resultado.

::: tip
El concepto de función en programación está inspirado en las matemáticas:  
**f(x) = y** → dado un valor de entrada `x`, se obtiene un valor de salida `y`.  
:::

## Beneficios de usar funciones

1. **Reutilización de código**  
   Una vez definida, la misma función puede usarse múltiples veces sin volver a escribirla.

2. **Legibilidad**  
   El código se organiza en bloques lógicos más fáciles de entender.

3. **Mantenimiento**  
   Si necesitas modificar la lógica de una operación, solo debes cambiar el cuerpo de la función y no en todos los lugares donde se usa.

4. **Trabajo en equipo**  
   Cada miembro de un equipo puede encargarse de implementar funciones específicas sin interferir con el resto.

::: info Ejemplo sencillo
```cpp
#include <iostream>
using namespace std;

// Definición de una función
int sumar(int a, int b) {
    return a + b;
}

int main() {
    cout << "La suma es: " << sumar(3, 4) << endl;
    return 0;
}
```
:::