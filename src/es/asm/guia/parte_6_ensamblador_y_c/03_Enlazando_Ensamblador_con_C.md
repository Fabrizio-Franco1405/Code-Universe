---
outline: [2, 3]
---

# Enlazando ensamblador con C

En los dos capítulos anteriores cruzaste el puente con C: llamando sus funciones y con el inline. Ahora veremos la forma **modular**: tu ensamblador como un archivo separado que se compila y se enlaza junto con archivos C, como piezas de un mismo rompecabezas. Esta es la arquitectura que usan los proyectos reales.

## 1. El diseño del proyecto

La idea es separar responsabilidades: C para la lógica de alto nivel, ensamblador para lo crítico. Cada pieza vive en su propio archivo:

```text
proyecto/
├── main.c        → lógica general, llama a las funciones asm
├── rapido.asm    → funciones críticas en ensamblador
├── utilidades.h  → declara las funciones asm para C
└── Makefile      → automatiza la compilación
```

- `main.c` usa las funciones de ensamblador como si fueran de C.
- `rapido.asm` implementa esas funciones siguiendo el ABI.
- El **enlazador** une los objetos de ambos lenguajes al final.

La clave está en el **contrato**: el archivo `.h` declara las funciones, y el `.asm` las implementa respetando exactamente las firmas. Ese contrato es el ABI que ya conoces.

## 2. La función en ensamblador

Escribamos una función en NASM conforme al ABI SysV. Los nombres de las funciones deben coincidir con los que declare C (sin prefijo `_` en Linux):

```text
; rapido.asm
global suma_parcial

section .text

; long suma_parcial(long *arreglo, long cantidad)
suma_parcial:
    push rbp
    mov  rbp, rsp
    ; rdi = arreglo, rsi = cantidad
    mov  rcx, rsi           ; contador = cantidad
    mov  rax, 0             ; acumulador
sumar:
    add  rax, [rdi]
    add  rdi, 8             ; siguiente qword
    loop sumar
    pop  rbp
    ret
```

- `global suma_parcial`: expone la función al enlazador.
- `rdi` = puntero al arreglo, `rsi` = cantidad (la firma de C).
- Devuelve la suma en `rax`.

Observa que la función respeta la convención: no pisa registros callee-saved (solo usa `rax`, `rcx`, `rdi`), así que no necesita preservarlos. Su prólogo y epílogo son mínimos.

## 3. La declaración en C

Del lado de C, declaramos la función con el prototipo exacto. Puedes ponerla en un archivo `.h` o directamente en `main.c`:

```c
/* utilidades.h */
#ifndef UTILIDADES_H
#define UTILIDADES_H

long suma_parcial(long *arreglo, long cantidad);

#endif
```

```c
/* main.c */
#include <stdio.h>
#include "utilidades.h"

int main(void) {
    long valores[] = {10, 20, 30, 40, 50};
    long total = suma_parcial(valores, 5);

    printf("La suma es %ld\n", total);   /* 150 */
    return 0;
}
```

- `utilidades.h` declara la función para que C sepa cómo llamarla.
- `main.c` la usa como cualquier otra función.
- Los tipos `long` en x86-64 son de 64 bits, exactamente el `qword` del ensamblador.

C confía en que la función `.asm` cumpla el ABI: pasará el arreglo en `rdi`, la cantidad en `rsi`, y esperará el resultado en `rax`. Si tu función no respeta eso, el compilador no te avisará: obtendrás resultados basura.

:::warning Advertencia
⚠️ La firma es un contrato implícito. Si en C declaras `suma_parcial(long *a, long b)` pero en asm interpretas el segundo argumento como un puntero, leerás una dirección inválida y fallarás. Coordina los tipos exactos en ambos lados.
:::

## 4. Compilar y enlazar todo

El flujo ensambla el `.asm`, compila el `.c` y enlaza los objetos. Con `gcc` directamente:

```bash
nasm -f elf64 rapido.asm -o rapido.o
gcc main.c rapido.o -o programa
./programa
```

```text
La suma es 150
```

- `nasm` genera `rapido.o` (el objeto con la función asm).
- `gcc` compila `main.c` y **enlaza** ambos objetos en el ejecutable.
- El enlazador resuelve la referencia a `suma_parcial` entre los dos archivos.

También puedes verificar que los símbolos se conectaron correctamente:

```bash
nm programa | grep suma
```

```text
0000000000401120 T suma_parcial
```

- La `T` indica que `suma_parcial` es una función (símbolo en la sección de texto).
- El enlazador ya la ubico en su dirección final.

## 5. Automatizando con Makefile

Para proyectos que crecen, `make` automatiza el ciclo. Aprovecha las reglas que vimos en la introducción:

```makefile
programa: main.o rapido.o
	gcc main.o rapido.o -o programa

main.o: main.c utilidades.h
	gcc -c main.c -o main.o

rapido.o: rapido.asm
	nasm -f elf64 rapido.asm -o rapido.o

clean:
	rm -f programa *.o
```

- `main.o` se regenera si cambia `main.c` o el `.h`.
- `rapido.o` se reensambla si cambia el `.asm`.
- `programa` se reenlaza si cambia cualquiera de los objetos.

Este Makefile es la plantilla de tus proyectos mixtos: un comando (`make`) compila todo, otro (`make clean`) lo limpia. Es exactamente la estructura que usarás en el proyecto final de la Parte VIII.

:::tip
💡 Mantén las funciones de ensamblador **cortas y enfocadas**: una sola responsabilidad por función. Es más fácil probarlas, leerlas y combinarlas desde C. Un bloque asm gigante dentro del flujo de C es más difícil de mantener que varias funciones pequeñas.
:::

## 6. El orden de los argumentos y los nombres

Dos reglas de compatibilidad para evitar sorpresas:

- **Nombres:** en Linux con ELF, los símbolos no llevan prefijo. `global suma_parcial` en NASM corresponde a `suma_parcial` en C, sin `_` extra.
- **Argumentos mixtos:** si una función recibe varios tipos (enteros y flotantes), los enteros van en `rdi`/`rsi`... y los flotantes en `xmm0`/`xmm1`, respetando el orden de la firma.

```text
; double promedio(double *datos, long cantidad)
global promedio
promedio:
    ; rdi = datos (puntero), rsi = cantidad
    xorps xmm0, xmm0        ; acumulador flotante en cero
    ...
```

- El puntero y el entero van en registros de enteros.
- El resultado `double` vuelve en `xmm0`.
- Mezclar mal las familias produce resultados absurdos que el compilador no detecta.

## Resumen rápido

- Un proyecto mixto separa lógica (C) y crítica (asm) en archivos distintos.
- `global` en NASM + prototipo en el `.h` forman el contrato de la función.
- La función asm debe respetar **exactamente** el ABI SysV.
- `nasm` + `gcc` enlazan ambos objetos; `make` automatiza el ciclo.
- Enteros en `rdi`/`rsi`..., flotantes en `xmm0`/`xmm1`, resultado en `rax`/`xmm0`.

Con el puente entre ensamblador y C dominado, llegó la hora de volar: en la **Parte VII** veremos el **nivel avanzado** — números flotantes con SSE, SIMD, optimización de rendimiento y seguridad.