---
outline: [2, 3]
---

# Cómo funciona una CPU: La máquina de Von Neumann

En la introducción viste tu primer programa correr, y el enlazador dejó claro que cada instrucción termina en una dirección de memoria. Ahora subamos un nivel: ¿qué es exactamente esa "CPU" que ejecuta tus instrucciones? Vamos a abrir la caja y entender la arquitectura que ha dominado la computación por más de setenta años: la **máquina de Von Neumann**.

## 1. El modelo de Von Neumann

En 1945, el matemático John von Neumann propuso un diseño que sigue siendo la base de casi toda computadora moderna: **el programa y los datos viven en la misma memoria**. Esa idea, simple pero genial, es lo que te permite escribir un programa, guardarlo, y luego ejecutarlo.

Una CPU clásica se compone de estas piezas:

- **Unidad de Control (CU):** el "director de orquesta". Lee cada instrucción y decide qué debe hacer el resto.
- **Unidad Aritmético-Lógica (ALU):** la "calculadora". Hace las sumas, restas, comparaciones y operaciones lógicas.
- **Registros:** las cajitas de alta velocidad internas donde la CPU guarda valores temporales.
- **Bus:** el cableado que conecta la CPU con la memoria y los dispositivos.
- **Memoria (RAM):** el espacio donde viven tanto el programa como sus datos.

La genialidad del modelo es la separación de roles: la CPU *procesa*, la memoria *guarda*, y un bus las comunica.

:::info Nota
ℹ️ Existe un modelo alternativo llamado **Harvard**, donde el programa y los datos usan memorias separadas. Lo verás en microcontroladores y en los niveles de caché de tu propia CPU, que funcionan de forma parecida por dentro.
:::

## 2. El ciclo de ejecución

La CPU no "sabe" qué programa hacer: simplemente repite un ciclo mecánico sin cesar, llamado **ciclo de fetch-decode-execute**:

1. **Fetch (traer):** la CPU lee de la memoria la instrucción que apunta el registro `RIP` (*Instruction Pointer*).
2. **Decode (decodificar):** la Unidad de Control interpreta qué operación es y qué operandos necesita.
3. **Execute (ejecutar):** la ALU o la Unidad de Control llevan a cabo la operación.
4. **Avanzar:** el `RIP` se mueve a la siguiente instrucción y el ciclo se repite.

Esto ocurre miles de millones de veces por segundo. Cada repetición se mide en **ciclos de reloj**; un procesador de 3 GHz completa unos tres mil millones de estos ciclos por segundo.

```text
memoria                CPU
+----------+          +--------------+
| mov rax,1|--fetch-->|   Unidad de  |
| mov rdi,1|          |   Control    |
| syscall  |          |     +        |
+----------+          |    ALU       |
                      +--------------+
```

## 3. Reloj y velocidad

El **reloj** es un pulso eléctrico constante que marca el ritmo de la CPU, como el metrónomo de un músico. Cada pulso permite que la CPU realice al menos una micro-operación.

- **Frecuencia:** medida en GHz (miles de millones de pulsos por segundo).
- **IPC (*Instructions Per Cycle*):** cuántas instrucciones completa por pulso. Es tan importante como la frecuencia.
- Un procesador moderno no solo es rápido: es **superescalar**, capaz de ejecutar varias instrucciones en paralelo dentro de un mismo núcleo.

La moraleja es que "3 GHz" no lo dice todo. Una CPU puede tener menor frecuencia pero completar más trabajo por ciclo. El ensamblador te permite entender y aprovechar esas diferencias, porque ves la instrucción exacta que el hardware ejecuta.

## 4. Núcleos y memoria caché

Las CPUs modernas tienen varias capas que el modelo clásico no muestra, pero que debes conocer:

- **Núcleos (cores):** varias CPUs completas dentro de un mismo chip. Tu sistema operativo reparte los programas entre ellos.
- **Caché:** memorias pequeñas y ultrarrápidas dentro del chip (L1, L2, L3) que guardan copias de los datos más usados. Acceder a la caché es decenas de veces más rápido que acceder a la RAM.
- La jerarquía es: **registros → L1 → L2 → L3 → RAM → disco**, de lo más rápido y pequeño a lo más lento y grande.

En los capítulos de rendimiento entenderás por qué escribir ensamblador eficiente implica pensar en esta jerarquía: no basta con menos instrucciones, también importa *cómo* usas la memoria.

:::warning Advertencia
⚠️ No confundas **frecuencia** con **velocidad real**. Un programa bien escrito puede correr más rápido en una CPU de menor GHz si aprovecha mejor la caché y evita esperas. Verás esto con ejemplos concretos en la Parte VII.
:::

## 5. ¿Por qué te importa todo esto?

Quizá te preguntes por qué un programador de ensamblador debe conocer el ciclo de ejecución. La razón es simple: **el ensamblador no es un lenguaje, es el hardware con otro nombre**. Cada mnemónico que escribas corresponde a un paso exacto de la máquina:

- Sabes cuándo una instrucción es costosa (acceso a memoria) o barata (operación entre registros).
- Entiendes por qué las funciones de la Parte III necesitan una pila.
- Comprendes por qué la alineación de memoria importa (Parte VII).

En otras palabras: estás aprendiendo a pensar como la máquina, no a traducirle.

## Resumen rápido

- La **máquina de Von Neumann** unifica programa y datos en una sola memoria.
- La CPU se divide en **Unidad de Control**, **ALU**, **registros**, **bus** y **memoria**.
- El **ciclo fetch-decode-execute** se repite miles de millones de veces por segundo, marcado por el reloj.
- Los **núcleos** y la **caché** añaden complejidad a la CPU moderna, y explican por qué la velocidad no se mide solo en GHz.
- El ensamblador te hace pensar como la máquina: cada instrucción es un paso real del hardware.

Ya conoces la arquitectura general. Ahora es momento de aprender el idioma de los datos: en el próximo capítulo veremos **bits, bytes y hexadecimal**, los números con los que la máquina habla realmente.