---
outline: [2, 3]
---

# Ensamblador inline en C/C++

En el capítulo anterior cruzaste el puente entre ensamblador y C. Ahora veremos la versión "sin salir de casa": el **ensamblador inline**, que te permite escribir instrucciones de máquina directamente dentro de tu código C. Es la herramienta favorita para optimizar puntos críticos sin abandonar las comodidades de C.

## 1. ¿Qué es el inline?

El **ensamblador inline** consiste en insertar bloques de ensamblador dentro de funciones de C. Con GCC, la sintaxis usa la palabra clave `asm` (o `__asm__`):

```c
#include <stdio.h>

int main(void) {
    int x = 0;

    asm("mov $42, %0" : "=r"(x));

    printf("El valor es %d\n", x);
    return 0;
}
```

- `asm(...)`: el bloque de ensamblador.
- `"mov $42, %0"`: la instrucción; `%0` es un "hueco" que el compilador rellena.
- `: "=r"(x)`: la **lista de salida**, dice que el resultado irá a `x`.
- Al ejecutar, `x` vale 42.

Observa la sintaxis: dentro de `asm` se usa la **sintaxis AT&T** (la de GAS), donde el orden de los operandos se invierte: `mov $42, %0` significa "copiar el inmediato 42 a `%0`".

:::info Nota
ℹ️ Con GCC se usa la sintaxis AT&T. Con clang/MASM y otros compiladores puede variar. Aquí seguimos GCC, que es el estándar en el mundo Linux que venimos usando.
:::

## 2. Entradas y salidas

La potencia del inline está en las **listas de operandos**: el compilador decide qué registros usar y conecta tus variables con el ensamblador automáticamente.

```c
int a = 10, b = 5, resultado;

asm(
    "addl %2, %0"
    : "=r"(resultado)          // salida
    : "0"(a), "r"(b)           // entradas
);
```

- `"=r"(resultado)`: una **salida** (el valor final) en cualquier registro.
- `"0"(a)`: una entrada que comparte el mismo registro que la salida 0.
- `"r"(b)`: una entrada en cualquier registro libre.
- `"addl %2, %0"`: suma el operando 2 al 0.

Los operandos se numeran `%0`, `%1`, `%2`... en el orden en que aparecen en las listas. Es la forma de decirle al compilador "esta variable va en este hueco".

Las **restricciones** (los "tipo de letra" entre comillas) controlan dónde puede vivir cada valor:

| Restricción | Significado |
|-------------|-------------|
| `"r"` | Un registro general cualquiera |
| `"a"` | El registro `RAX` (acumulador) |
| `"=r"` | Salida en un registro (sobrescrito) |
| `"+r"` | Entrada **y** salida en el mismo registro |
| `"m"` | Un lugar en memoria |

```c
int x = 5;
asm("incq %0" : "+r"(x));   // x se lee y se escribe en el mismo registro
```

- `"+r"`: dice "este valor entra y sale por el mismo registro".
- `incq %0`: incrementa `x` en el lugar.
- Resultado: `x = 6`.

## 3. Los clobbers: avisar lo que pisas

Si tu bloque ensamblador **modifica registros o memoria** que no aparecen como salidas, debes declararlos en la lista de **clobbers**, o el compilador usará esos registros sin saber que los destruiste:

```c
int x = 10, y;

asm(
    "movl %1, %%eax\n"   // eax = x
    "addl $1, %%eax\n"   // eax++
    "movl %%eax, %0"     // y = eax
    : "=r"(y)
    : "r"(x)
    : "eax"              // clobber: avisamos que eax se pisó
);
```

- Los registros con `%%` (doble `%`) son **registros reales** en sintaxis AT&T.
- `: "eax"` al final: "declaro que pisé `eax`".
- Sin ese aviso, el compilador podría haber guardado datos valiosos en `eax`.

La lista de clobbers es el contrato de confianza con el compilador: si mientes (o te olvidas), el compilador generará código que usa registros que tú destruiste, con bugs catastróficos y aleatorios.

:::warning Advertencia
⚠️ Nunca omitas un clobber. Si tu asm modifica un registro o la memoria y no lo declaras, el compilador asume que quedó intacto y el programa puede corromperse en lugares completamente ajenos a tu bloque.
:::

## 4. Volatile: No lo dejes de lado

Por defecto, el compilador puede **reordenar o eliminar** tu bloque `asm` si cree que no tiene efectos observables. Para bloques con efectos colaterales (E/S, escrituras a memoria concreta), se usa `volatile`:

```c
asm volatile("nop");            // una instrucción que no se puede eliminar
```

```c
asm volatile(
    "cli"                       // deshabilita interrupciones (nivel núcleo)
);
```

- `asm volatile(...)`: le dice al compilador "ejecuta esto sí o sí, en este lugar".
- Se usa para instrucciones con efectos que el compilador no puede ver.
- `nop` no hace nada, pero es un "punto de anclaje" útil para mediciones y sincronización.

Sin `volatile`, el compilador podría mover tu bloque, fusionarlo o eliminarlo si "demuestra" que no cambia el resultado visible. Para operaciones con efectos reales, el `volatile` es obligatorio.

## 5. ¿Cuándo usar inline?

El inline es poderoso, pero también un arma de doble filo. Las reglas de oro de los profesionales:

- **Mide antes de optimizar:** no reescribas en asm lo que ya es rápido en C. Perfilalo primero (verás herramientas en la Parte VII).
- **Úsalo solo en puntos críticos:** bucles internos, operaciones sobre gigabytes de datos, primitivas que el compilador no genera bien.
- **Si puedes evitarlo, evítalo:** el compilador de C ya genera buen ensamblador; el inline es para cuando sabes (con datos) que hace falta.

```c
/* Ejemplo legítimo: rotación de bits (muy útil en criptografía) */
unsigned int rotar_izquierda(unsigned int valor, unsigned int n) {
    unsigned int resultado;
    asm(
        "roll %1, %0"
        : "+r"(resultado)
        : "c"(n), "0"(valor)
    );
    return resultado;
}
```

- `roll`: rota los bits a la izquierda, algo que C no expresa de forma directa.
- La restricción `"c"(n)` coloca `n` en `RCX`, que es el registro que `roll` usa como contador.
- La salida comparte el registro de entrada con `"0"(valor)`.

Aquí el inline tiene sentido: es una operación de bajo nivel que C no modela bien. Para eso existe.

:::tip
💡 Si tu bloque inline crece más de 3-4 líneas, considera escribir una **función aparte en NASM** (como en el capítulo anterior) en lugar de inline. El código queda más claro, testeable y sin la complejidad de las restricciones.
:::

## Resumen rápido

- `asm(...)` inserta ensamblador (sintaxis **AT&T**) dentro de C.
- Las listas de **entradas/salidas** conectan variables con operandos `%0`, `%1`...
- Las **restricciones** (`"r"`, `"a"`, `"+r"`) controlan qué registros se usan.
- Los **clobbers** declaran los registros que pisas: no los omitas jamás.
- `volatile` evita que el compilador reordene o elimine tu bloque.
- Úsalo solo en puntos críticos y después de medir.

Ya puedes mezclar ambos mundos. Pero el puente tiene un tercer carril: en el próximo capítulo veremos **cómo enlazar ensamblador y C como piezas separadas**, con módulos completos, `extern`, `global` y proyectos multiarchivo.