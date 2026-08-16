---
outline: [2, 3]
---

# Estructuras de control

La ejecución de un programa se realiza en orden secuencial, desde la primera sentencia
en `main()` hacia abajo. Es decir, el programa lee tu código como tú lees un libro: de
arriba hacia abajo, una línea tras otra. Pero ¿qué pasa cuando necesitas que el
programa decida algo? Ahí entran las **estructuras de control**, que nos permiten
alterar este flujo normal de ejecución de dos maneras:

1. **Estructuras condicionales:** Permiten ejecutar un bloque de código cuando una condición es verdadera.
2. **Estructuras de bucle:** Permiten ejecutar un bloque de código repetidamente mientras se cumpla una condición.

## 1. Condicionales

Una condición es una expresión que se evalúa para determinar si es verdadera o falsa.
En una expresión pueden participar como operandos valores literales, variables o
funciones. Para construir expresiones condicionales podemos utilizar operadores
relacionales. Los operadores condicionales comparan lo que tienen a su izquierda con
lo que tienen a su derecha de la siguiente forma:

| Operador | Descripción | Ejemplo | Resultado |
| --- | --- | --- | --- |
| `>` | Mayor que | `8 > 5` | `true` |
| `>=` | Mayor o igual que | `7 >= 10` | `false` |
| `<` | Menor que | `5 < 7` | `true` |
| `<=` | Menor o igual que | `9 <= 9` | `true` |
| `==` | Igual que | `1 == 1` | `true` |
| `!=` | Distinto que | `1 != 1` | `false` |

Como puedes ver, las condiciones son realmente comparaciones donde el resultado es un
valor booleano, es decir, `true` o `false`. Es posible construir condiciones más
complejas concatenando varias condiciones simples con los operadores lógicos `Y`, `O`
y `No`. A continuación se presentan estos operadores:

| Operador | Descripción | Ejemplo | Resultado |
| --- | --- | --- | --- |
| `&&` | `Y` Lógico | `true && true` | `true` |
| `\|\|` | `O` Lógico | `true \|\| false` | `true` |
| `!` | `No` Lógico | `!true` | `false` |

**Operador Lógico `&&`:** Será `true` únicamente si **todas** las comparaciones que lo
componen son verdaderas. Si al menos una es falsa, el resultado será `false`. Piénsalo
como un portero muy estricto: solo deja pasar si TODOS los documentos están en orden.

**Ejemplo de uso combinado:**
```cpp
int a = 5;
int b = 10;

if (a < b && b > a) {
    cout << "a es menor que b y b es mayor que a" << endl; // El resultado es true
}
```

Como en ambos casos se cumple la condición, el resultado de ese `if` será `true`.

**Operador Lógico `||`:** Será `true` si **al menos una** de las comparaciones es
verdadera. Solo será `false` cuando **todas** las comparaciones sean falsas. Acá el
portero es más flexible: con que uno de los documentos esté en orden, ya pasa.

**Ejemplo:**
```cpp
int a = 5;
int b = 10;

if (a < b || b == 0) {
    cout << "a es menor que b o b es igual a 0" << endl; // El resultado es true
}
```

Aquí el resultado es verdadero porque la primera condición (`a < b`) se cumple, aunque
la segunda (`b == 0`) sea falsa.

**Operador Lógico `!`:** Invierte el valor de la condición: Si es `true` pasa a
`false`, y si es `false` pasa a `true`. Es como el interruptor de la luz: apaga lo que
está encendido y enciende lo que está apagado.

**Ejemplo:**
```cpp
bool encendido = false;

if (!encendido) {
    cout << "El sistema está apagado" << endl; // El resultado es true
}
```

En este caso, `!encendido` evalúa a `true` ya que `encendido` es `false`.

## 2. Estructuras condicionales

En este punto comenzaremos a explicar cada una de las estructuras condicionales que
existen en C++. Primeramente explicando su estructura y luego con ejemplos prácticos
para entender cómo funciona.

### 2.1 Estructura if else

La estructura `if` es la más básica de las estructuras condicionales. Su sintaxis es
la siguiente:

```cpp
if (condicion) { // [!code highlight]
    // código a ejecutar si la condición es verdadera
}
```

Dentro de los paréntesis va la condición a evaluar, porque si esta es verdadera se
ejecutará el código dentro del bloque `if` y si es falsa se ejecutará el código dentro
del bloque `else` si lo tiene, y si no, simplemente no ocurre nada.

Por otro lado, la estructura `else` es la que se encarga de ejecutar el código cuando
la condición es falsa.

```cpp
else { // [!code highlight]
    // Código a ejecutar si la condición es falsa
}
```

Si te fijas, la estructura `else` no incluye los paréntesis porque no evalúa una
condición; `else` por el contrario solo espera que el resultado del `if` sea `false`
para ejecutar el código que tiene dentro del bloque `{}`.

### 2.2 Operadores Ternarios

Los operadores ternarios son formas simplificadas de la estructura `if else` que
permiten evaluar una condición y asignar un valor a una variable dependiendo del
resultado de la condición. Se les llama **ternario** porque utiliza **tres operandos:**

1. **Condición** → Expresión que se evalúa como `true` o `false`.
2. **Valor si es verdadero** → Lo que se devuelve o asigna si la condición es `true`.
3. **Valor si es falso** → Lo que se devuelve o asigna si la condición es `false`.

**Estructura básica:**
```cpp
condicion ? valor_si_true : valor_si_false;
```

- `?` Es el equivalente a `{}` que se lee como **"Entonces"**.
- `:` Es el equivalente a `else` que se lee como **"Si no"** o también **"De lo contrario"**.

**Ejemplo básico:**
```cpp
int edad = 20;
string mensaje = (edad >= 18) ? "Eres mayor de edad" : "Eres menor de edad";

cout << mensaje << endl; // Imprime: Eres mayor de edad
```

::: tip
💡 Los operadores ternarios son útiles cuando necesitas asignar un valor a una variable
dependiendo de una condición, pero no es recomendable para trabajar con lógica compleja.
:::

### 2.3 Estructura switch case

La estructura `switch` permite ejecutar diferentes bloques de código en función del
valor de una **expresión**. Es especialmente útil cuando una variable puede tomar
varios valores posibles y quieres actuar de forma distinta en cada caso, evitando
múltiples anidaciones `if else if`.

**Estructura básica:**
```cpp
switch (expresion) { // [!code highlight]
    case valor1:
        // Código a ejecutar si expresion == valor1
        break;
    case valor2:
        // Código a ejecutar si expresion == valor2
        break;
    ...
    default:
        // Código a ejecutar si ninguno de los casos anteriores coincide
}
```

- `switch` Es la **expresión** que evalúa la condición.
- `case` Es el **valor** que se compara con la expresión.
- `break` Sirve para salir del switch.
- `default` Es el **código** que se ejecuta si ninguno de los casos coincide, básicamente es el **else** de la estructura `switch`.

::: tip
💡 La estructura `switch` es especialmente útil cuando una variable puede tomar varios
valores posibles y quieres actuar de forma distinta en cada caso, evitando múltiples
anidaciones `if else if`.
:::

**Ejemplo práctico:**

```cpp
char color = 'R'; // R = Rojo, A = Amarillo, V = Verde

switch (color) {
    case 'R':
        cout << "ALTO: El semáforo está en ROJO" << endl;
        break;
    case 'A':
        cout << "PRECAUCIÓN: El semáforo está en AMARILLO" << endl;
        break;
    case 'V':
        cout << "ADELANTE: El semáforo está en VERDE" << endl;
        break;
    default:
        cout << "Color no válido" << endl;
}
```

El ejemplo del **semáforo** es el ejemplo perfecto para poder explicar la estructura
`switch`, ya que el semáforo puede tener tres estados: **Rojo**, **Amarillo** y
**Verde**. Cada estado dispara un comportamiento distinto, tal como cada `case` ejecuta
su propio bloque.

## 3. Estructuras de repetición

Las estructuras de repetición permiten ejecutar un bloque de código varias veces, ya
sea mientras se cumpla una condición o durante un número determinado de iteraciones.
Son esenciales para tareas como recorrer listas, validar entradas, realizar cálculos
acumulativos o repetir acciones hasta que se cumpla un criterio. En otras palabras, son
el "lavaplatos" de la programación: hacen la misma tarea una y otra vez hasta que dices
basta.

En C++ existen tres estructuras principales de repetición:

- `while`
- `do while`
- `for`

Cada una tiene su propósito y se usa en contextos distintos según el tipo de control
que necesites.

### 3.1 Estructura while

La estructura `while` ejecuta un bloque de código **mientras** la condición sea
verdadera. Esta condición se evalúa **antes** de cada iteración, por lo que si es falsa
desde el inicio, el bloque no se ejecuta ni una sola vez.

**Estructura básica:**
```cpp
while (condicion) { // [!code highlight]
    // código a ejecutar si la condición es verdadera
}
```

**Ejemplo práctico:**

```cpp
int contador = 1;

while (contador <= 5) {
    cout << "Iteración " << contador << endl;
    contador++;
}
```

Este bucle imprimirá los números del 1 al 5. Cuando `contador` llega a 6, la condición
`contador <= 5` ya no se cumple y el bucle termina.

**Cuándo usarlo:**

- Cuando no sabes cuántas veces se repetirá el bloque.
- Cuando la condición depende de una entrada o evento externo.

### 3.2 Estructura do while

La estructura `do-while` es similar a `while`, pero con una diferencia clave: El bloque
se ejecuta al menos una vez, y luego es que se evalúa la condición. Es como preguntar
primero y confirmar después: garantiza que la acción ocurra aunque la condición sea
falsa desde el inicio.

**Estructura básica:**
```cpp
do {
    // Código a ejecutar al menos una vez
} while (condicion); // [!code highlight]
```

**Ejemplo práctico:**

```cpp
int numero;

do {
    cout << "Ingresa un número positivo: ";
    cin >> numero;
} while (numero <= 0);
```

Este bucle garantiza que el usuario vea el mensaje al menos una vez, incluso si la
condición es falsa desde el inicio.

**Cuándo usarlo:**

- Cuando necesitas ejecutar el bloque al menos una vez antes de verificar la condición.
- Ideal para validaciones de entrada o menús interactivos.

### 3.3 Estructura for

La estructura `for` se usa cuando conoces de antemano cuántas veces debe ejecutarse el
bloque. Incluye en su sintaxis la inicialización, la condición y la actualización del
contador. Todo lo relacionado con el "ritmo" del bucle va en una sola línea, lo que la
hace muy ordenada.

**Estructura básica:**
```cpp
for (inicialización; condición; actualización) { // [!code highlight]
    // Código a repetir
}
```

**Ejemplo de uso:**

```cpp
for (int i = 0; i < 5; i++) {
    cout << "Valor de i: " << i << endl;
}
```

Este bucle imprimirá los valores de `i` desde 0 hasta 4.

**Variación útil:**

```cpp
for (int i = 10; i >= 0; i--) {
    cout << i << " segundos restantes" << endl;
}
```

**Cuándo usarlo:**

- Cuando tienes un contador definido.
- Cuando recorres rangos numéricos o estructuras con índices.

## 4. Estructuras de saltos

Las **estructuras de salto** permiten alterar el flujo normal de ejecución dentro de
bucles, `switch` o funciones. En C++ existen cuatro sentencias de salto principales:

- `break` → Sale inmediatamente del bucle o `switch` más cercano.
- `continue` → Salta a la siguiente iteración del bucle.
- `return` → Termina la ejecución de una función y opcionalmente devuelve un valor.
- `goto` → Salta a una etiqueta dentro de la misma función (uso desaconsejado).

A continuación, veremos cada una en detalle.

### 4.1 Estructura break

La instrucción `break` se utiliza para **interrumpir** la ejecución de un bucle (`for`,
`while`, `do while`) o salir de un `switch` antes de que termine de forma natural. Es
el botón de "parar" que detiene todo de inmediato.

**Ejemplo en bucle:**
```cpp
for (int i = 0; i < 10; i++) {
    if (i == 5) {
        break; // Sale del bucle cuando i es 5
    }
    cout << i << endl;
}
```

**Ejemplo en switch:**
```cpp
int opcion = 2;

switch (opcion) {
    case 1:
        cout << "Opción 1" << endl;
        break;
    case 2:
        cout << "Opción 2" << endl;
        break;
    default:
        cout << "Opción no válida" << endl;
}
```

### 4.2 Estructura continue

La instrucción `continue` salta directamente a la siguiente iteración del bucle,
omitiendo el resto del código en la iteración actual. A diferencia de `break`, no
detiene el bucle: solo se salta una vuelta y sigue.

**Ejemplo:**
```cpp
for (int i = 1; i <= 5; i++) {
    if (i == 3) {
        continue; // Salta la iteración cuando i es 3
    }
    cout << "Valor: " << i << endl;
}
```

Este bucle imprimirá:

```
Valor: 1
Valor: 2
Valor: 4
Valor: 5
```

### 4.3 Estructura return

La instrucción `return` finaliza la ejecución de una función y, si la función no es
`void`, devuelve un valor.

**Ejemplo:**
```cpp
int sumar(int a, int b) {
    return a + b; // Devuelve la suma [!code highlight]
}
```

**Ejemplo en función `void`:**

```cpp
void mostrarMensaje(bool error) {
    if (error) {
        cout << "Error detectado" << endl;
        return; // Termina la función aquí
    }
    cout << "Todo correcto" << endl;
}
```

### 4.4 Estructura goto

La instrucción `goto` permite saltar directamente a una etiqueta definida en otra parte
del mismo bloque de código. Su uso está generalmente desaconsejado porque puede hacer
que el flujo del programa sea difícil de seguir. En la práctica, casi siempre hay una
forma más clara de lograr lo mismo con las estructuras anteriores.

**Estructura básica:**
```cpp
goto etiqueta;

...

etiqueta: // [!code highlight]
    // Código al que se salta
```

**Ejemplo de uso:**

```cpp
int x = 0;

inicio:
    cout << "x = " << x << endl;
    x++;
    if (x < 3) goto inicio;
```

## 5. Resumen rápido

**Condicionales:**

- `if else` → Para decisiones simples.
- Operador ternario → Atajos para asignaciones condicionales.
- `switch` → Alternativa para múltiples condiciones sobre un mismo valor.

**Bucles:**

- `while` → Se repite mientras la condición sea verdadera.
- `do while` → Se ejecuta al menos una vez.
- `for` → Ideal cuando conoces el número de iteraciones.

**Saltos:**

- `break` y `continue` controlan el flujo dentro de bucles.
- `return` termina funciones.
- `goto` existe, pero casi nunca debería usarse.

Con las estructuras de control tu programa ya sabe tomar decisiones y repetir tareas.
En el siguiente capítulo veremos cómo organizar todo ese código con los **espacios de
nombres** para evitar conflictos a medida que tus proyectos crecen.