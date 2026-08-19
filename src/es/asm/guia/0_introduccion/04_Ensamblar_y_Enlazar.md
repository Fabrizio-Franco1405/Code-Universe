---
outline: [2, 3]
---

# Ensamblar y enlazar: El flujo de trabajo

Tu primer programa ya funcionó. Pero entre tu texto `hola.asm` y el ejecutable `hola` ocurrieron dos pasos con roles muy distintos: **ensamblar** y **enlazar**. En este capítulo vas a entender qué hace cada herramienta, por qué existen ambas, y cómo automatizar el proceso con `make`.

## 1. El papel del ensamblador

El **ensamblador** traduce cada instrucción de tu texto a su **opcode** numérico y genera un archivo objeto. Cuando ejecutas:

```bash
nasm -f elf64 hola.asm -o hola.o
```

NASM hace lo siguiente:

- Valida la sintaxis de cada línea (si hay un error, te lo dice con número de línea).
- Traduce cada mnemónico y sus operandos a bytes de código de máquina.
- Resuelve las etiquetas dentro del archivo, calculando las direcciones.
- Genera `hola.o`, el **archivo objeto**: tu código en binario, pero todavía sin dirección final de memoria.

Un archivo objeto es como una pieza de un rompecabezas: contiene el código y la lista de "piezas" que necesita de otros lados para completarse.

```bash
file hola.o
```

```text
hola.o: ELF 64-bit LSB relocatable, x86-64, version 1 (SYSV)
```

:::info Nota
ℹ️ La palabra **relocatable** es la clave: el objeto aún puede moverse de lugar en memoria. Ese ajuste final es trabajo del enlazador.
:::

## 2. El papel del enlazador

El **enlazador** une los archivos objeto (uno o varios) con las bibliotecas que necesiten y produce el ejecutable final:

```bash
ld hola.o -o hola
```

En este paso, el enlazador:

- Reúne todos los objetos y sus secciones en un solo archivo.
- **Resuelve símbolos**: conecta cada referencia a una etiqueta con su dirección real.
- Asigna direcciones finales de memoria a cada sección y a cada etiqueta.
- Genera el encabezado ELF que el sistema operativo necesita para cargar el programa.

Sin enlazador, tu archivo objeto sería una pieza sin encajar. Con él, tienes un programa listo para ejecutar.

```bash
file hola
```

```text
hola: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), statically linked
```

## 3. Símbolos: El puente entre objetos

Cuando escribes `global _start`, le dices al ensamblador: "esta etiqueta es pública, otros archivos pueden referirse a ella". Esas etiquetas públicas se llaman **símbolos**, y el enlazador las usa para conectar piezas.

Puedes ver los símbolos de un objeto con `nm`:

```bash
nm hola.o
```

```text
0000000000000000 T _start
```

- `T`: indica que `_start` es un símbolo en la sección de texto.
- La dirección `0000000000000000` es provisional: el enlazador la reubicará.

Con `global` exponemos símbolos; con `extern` (que veremos más adelante) importamos símbolos definidos en otros archivos. Es así como los programas de varias piezas se comunican entre sí.

## 4. Automatizando con Makefile

Escribir los dos comandos a mano se vuelve tedioso cuando el proyecto crece. La herramienta clásica para automatizar es `make`, que lee un archivo llamado `Makefile`:

```makefile
hola: hola.o
	ld hola.o -o hola

hola.o: hola.asm
	nasm -f elf64 hola.asm -o hola.o

clean:
	rm -f hola hola.o
```

- Cada bloque define una **regla**: qué archivo se produce (`hola`) y de qué depende (`hola.o`).
- `make` compara las fechas: si `hola.asm` cambió, reensambla y reenlaza; si nada cambió, no hace nada.
- `make clean` borra los archivos generados para empezar de cero.

Ahora todo el flujo es:

```bash
make
./hola
make clean
```

:::tip
💡 Esta es la estructura que usarás en el proyecto final. Automatizar desde el principio te ahorra errores y tiempo; `make` solo recompila lo que cambió.
:::

## 5. Más allá: Inspeccionar el resultado

Para confirmar que todo está en su lugar, puedes preguntarle al ejecutable quién es:

```bash
objdump -d hola
```

```text
0000000000401000 <_start>:
  401000:	b8 01 00 00 00       	mov    eax,0x1
  401004:	bf 01 00 00 00       	mov    edi,0x1
  ...
```

- A la izquierda, la **dirección** donde vive cada instrucción.
- En medio, los **bytes de máquina** que la CPU ejecutará.
- A la derecha, el mnemónico que ya conoces.

Observa cómo la CPU recorre las direcciones de 16 en 16 en decimal... no, perdón: nota que cada instrucción tiene un tamaño distinto. `mov eax,0x1` ocupa 5 bytes; `syscall` (dos líneas más abajo) ocupa 2. Esa es la belleza y la rareza de las instrucciones x86: no son todas del mismo tamaño.

:::warning Advertencia
⚠️ El ensamblador y el enlazador son herramientas separadas y cada una tiene sus errores propios. Si un problema dice "error" al correr `nasm`, es un problema de sintaxis en tu código. Si aparece al correr `ld`, es un problema de símbolos o enlaces. Saber cuál herramienta habla te ahorra horas de búsqueda.
:::

## Resumen rápido

- El **ensamblador** traduce tu texto a opcodes y genera un archivo objeto **relocatable**.
- El **enlazador** une los objetos, resuelve símbolos y produce el ejecutable final.
- `global` expone etiquetas; `extern` importa símbolos de otros objetos.
- **`make`** automatiza el flujo recompilando solo lo que cambió.
- **`objdump`** te deja inspeccionar el código de máquina generado.

Ahora que dominas el flujo completo de compilación, vamos a la base de todo: en la **Parte I** entenderás cómo funciona realmente la máquina que ejecuta tus programas, empezando por la arquitectura de la CPU.