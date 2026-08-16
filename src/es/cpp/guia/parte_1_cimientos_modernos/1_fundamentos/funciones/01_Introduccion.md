---
outline: [2, 3]
---

# Introducción a las funciones

Hasta acá hemos escrito programas pequeños donde todo el código vive dentro de
`main()`. Pero ¿qué pasa cuando tu programa empieza a crecer? Copiar y pegar la misma
lógica una y otra vez se vuelve un desastre. Es ahí donde entran las **funciones**.

En C++, una **función** es un bloque de código reutilizable diseñado para realizar una
tarea específica. Su propósito es **modularizar** el programa, dividiendo el código en
unidades más pequeñas y fáciles de comprender. Piénsalo como una fábrica: en lugar de
construir cada producto desde cero en un solo lugar, cada estación de trabajo hace su
parte y el resultado se arma pieza por pieza.

## ¿Qué es una función?

Podemos ver a una función como una **caja negra** y se compone de tres partes:

- **Entrada:** Recibe datos a través de parámetros.
- **Proceso:** Ejecuta instrucciones con esos datos.
- **Salida:** Devuelve (o no) un resultado.

::: tip
💡 El concepto de función en programación está inspirado en las matemáticas:
**f(x) = y** → dado un valor de entrada `x`, se obtiene un valor de salida `y`.
:::

## Beneficios de usar funciones

1. **Reutilización de código**
   Una vez definida, la misma función puede usarse múltiples veces sin volver a
   escribirla. Escribes la lógica una sola vez y la usas en todos lados.

2. **Legibilidad**
   El código se organiza en bloques lógicos más fáciles de entender. Un programa
   lleno de funciones bien nombradas se lee casi como una historia.

3. **Mantenimiento**
   Si necesitas modificar la lógica de una operación, solo debes cambiar el cuerpo de
   la función y no en todos los lugares donde se usa. Un solo cambio, un solo lugar.

4. **Trabajo en equipo**
   Cada miembro de un equipo puede encargarse de implementar funciones específicas sin
   interferir con el resto. Es como armar un rompecabezas donde cada quien trabaja su
   pieza.

::: info Nota
ℹ️ **Ejemplo sencillo:**
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

En este ejemplo, `sumar(3, 4)` recibe dos datos de entrada (`3` y `4`), realiza la
suma y devuelve `7`, que luego se imprime en consola. La caja negra hizo su trabajo.

## Resumen rápido

- Una **función** es un bloque de código reutilizable que realiza una tarea específica.
- Se compone de **entrada**, **proceso** y **salida**.
- Mejora la **reutilización**, la **legibilidad** y el **mantenimiento** del código.
- Facilita el **trabajo en equipo** dividiendo el problema en piezas.

Ya tienes el concepto claro. En el siguiente capítulo veremos la **sintaxis completa
de una función**: cómo se escribe, cómo se declara y cómo se llama.