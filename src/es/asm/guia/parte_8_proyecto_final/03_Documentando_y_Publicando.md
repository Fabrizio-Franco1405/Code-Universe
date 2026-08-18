---
outline: [2, 3]
---

# Documentando y publicando tu trabajo

Has recorrido todo el curso: desde la arquitectura de la CPU hasta un proyecto completo con depuración. Para cerrar la travesía, este capítulo te enseña lo que separa a un buen programador de un gran profesional: **documentar tu código** y **compartir tu trabajo** con el mundo. El ensamblador, por su concisión, lo agradece más que ningún otro lenguaje.

## 1. Documentar ensamblador: El arte de los comentarios

El ensamblador es críptico por naturaleza: una línea puede hacer mucho en pocos caracteres. Por eso, la documentación no es opcional: es lo que hace tu código **legible** al día siguiente (y a tus compañeros).

Las reglas de los comentarios en NASM:

- `;` comenta hasta el final de la línea.
- Comenta el **porqué**, no el qué: la instrucción ya dice qué hace.
- Mantén una columna de comentarios alineada para legibilidad.

```text
; texto_a_numero: convierte una cadena de dígitos en un número.
; rdi = dirección del texto, rsi = longitud
; devuelve rax = número
texto_a_numero:
    mov rax, 0          ; acumulador
    mov rcx, 0          ; índice del carácter actual
siguiente:
    movzx rdx, byte [rdi + rcx]   ; leemos el carácter
    sub   rdx, '0'                ; '0'(48) → 0, '7'(55) → 7
    imul  rax, rax, 10            ; corremos el acumulador un dígito
    add   rax, rdx                ; sumamos el dígito
    inc   rcx
    cmp   rcx, rsi
    jl    siguiente
    ret
```

- **Cabecera de función:** qué hace, qué recibe y qué devuelve.
- **Comentarios de propósito:** por qué `sub rdx, '0'` convierte el carácter.
- La convención de cabeceras es la misma que usan las bibliotecas profesionales.

El contrato de una función (`rdi = ...`, `rsi = ...`, devuelve `rax = ...`) es oro puro: sin él, cualquiera que llame a tu función tendría que leer todo su código para saber qué esperar.

:::info Nota
ℹ️ Sigue la convención de cabeceras que usaste durante el curso: describe entrada, salida y registros que toca. Es el equivalente ensamblador de los comentarios de documentación de C (los `/** ... */`).
:::

## 2. Organizar el proyecto

Un proyecto de ensamblador bien organizado tiene una estructura predecible:

```text
calculadora/
├── src/
│   ├── main.asm        → entrada y flujo principal
│   ├── numeros.asm     → conversiones texto ↔ número
│   └── operaciones.asm → las operaciones aritméticas
├── build/
│   └── (objetos y ejecutables)
├── Makefile            → automatiza la compilación
└── README.md           → cómo compilar y usar
```

- **Módulos por responsabilidad:** cada archivo con su tema (entrada, números, operaciones).
- **Carpeta `build`:** los artefactos generados no ensucian el código fuente.
- **README:** la puerta de entrada de quien llegue a tu proyecto.

Separar en módulos es exactamente lo que viste en el capítulo de enlazar con C: `global` expone lo que el resto usa, y lo interno se queda privado.

## 3. El Makefile definitivo

Automatiza todo para que compilar sea un solo comando, incluso cuando hay varios módulos:

```makefile
SRC = src/main.asm src/numeros.asm src/operaciones.asm
OBJ = build/main.o build/numeros.o build/operaciones.o

calculadora: $(OBJ)
	ld $^ -o calculadora

build/%.o: src/%.asm
	nasm -f elf64 -g $< -o $@

clean:
	rm -rf build calculadora

.PHONY: clean
```

- `$(SRC)` y `$(OBJ)`: las listas de archivos, declaradas una sola vez.
- La regla genérica `build/%.o: src/%.asm` compila cualquier módulo con un patrón.
- `$^` y `$<`: variables automáticas de make ("todos los objetos" y "el primero").
- `make`, `make clean`, `make calculadora`: los comandos del proyecto.

Con este Makefile, agregar un módulo nuevo es solo añadir una línea a las listas. El patrón de reglas genéricas escala sin esfuerzo.

:::tip
💡 El patrón `%.o: %.asm` es la "plantilla infinita": una sola regla sirve para cualquier módulo. Usa variables al principio y el Makefile se mantiene chico aunque el proyecto crezca.
:::

## 4. El README: La puerta de entrada

Un buen README le dice a quien llega: qué es esto, cómo compilarlo y cómo usarlo. Estructura mínima y efectiva:

```markdown
# Calculadora ASM

Calculadora de línea de comandos escrita en ensamblador x86-64 (NASM),
para Linux.

## Requisitos
- NASM
- GNU ld (binutils)

## Compilar
    make
    ./calculadora

## Uso
    $ ./calculadora
    Operación: 12 + 7
    Resultado: 19

## Estructura
- `src/main.asm`: flujo principal
- `src/numeros.asm`: conversiones texto ↔ número
- `src/operaciones.asm`: operaciones aritméticas

## Ejemplos
    5 * 3   → 15
    20 - 7  → 13
```

- **Qué es** en la primera línea.
- **Requisitos** y **cómo compilar** sin suposiciones.
- **Uso y ejemplos** con la salida real.
- **Estructura** del proyecto para orientar a quien quiera contribuir.

El README es la primera impresión de tu trabajo. Un proyecto sin README parece abandonado; uno con README claro invita a usarlo y mejorarlo.

## 5. Publicar y compartir

Con tu proyecto documentado, es hora de mostrarlo al mundo:

1. **Git:** versiona tu trabajo (cada cambio con un mensaje claro).
2. **GitHub/GitLab:** sube el repositorio; el README se muestra automáticamente en la portada.
3. **Licencia:** si quieres que otros lo usen, agrega una licencia libre (MIT es la común).
4. **Ejemplos:** agrega capturas de terminal y ejemplos de ejecución para mostrar el resultado.

```bash
git init
git add .
git commit -m "Calculadora CLI en ensamblador x86-64"
git remote add origin https://github.com/tu_usuario/calculadora-asm.git
git push -u origin main
```

- Los comandos básicos de git para publicar.
- El mensaje de commit describe el cambio en una frase.
- El repositorio queda listo para compartir la URL.

Publicar tu primer proyecto en ensamblador es un hito: pocos programadores llegan a este punto. Y aunque el ensamblador no sea tu día a día, lo que aprendiste —cómo piensa la máquina— te acompañará en C, C++, Rust y cualquier lenguaje de bajo nivel.

:::warning Advertencia
⚠️ Antes de publicar, revisa tu código con `make clean` y una compilación desde cero (`make`). Un proyecto que no compila en una máquina limpia desanima a cualquiera que lo clone. La reproducibilidad es parte de la calidad.
:::

## Resumen rápido

- Comenta el **porqué** y documenta el **contrato** de cada función (entradas, salidas, registros).
- Organiza el proyecto en **módulos** y separa los artefactos (`build/`).
- Un **Makefile** con reglas genéricas automatiza todo el ciclo.
- El **README** es la puerta de entrada: qué, requisitos, uso y estructura.
- Publica con **git**, agrega licencia y ejemplos reales.

## El camino continúa

Has completado tu trayectoria del ensamblador x86-64: Arquitectura, sintaxis, pila y funciones, datos, sistema operativo, el puente con C, SIMD, optimización, seguridad, y un proyecto final con depuración y publicación.

El ensamblador no es un destino, sino una lente: ahora ves cada programa que escribes en cualquier lenguaje con una profundidad nueva. Cuando escribas en C, sabrás qué hace el compilador; cuando depures, sabrás qué ve la CPU; cuando optimices, sabrás qué cuesta cada instrucción.

Sigue explorando el universo de Code Universe: la guía de C te dará el contraste de alto nivel, y la de C++ los objetos sobre esta misma base. El metal al desnudo ya no tiene secretos para ti.