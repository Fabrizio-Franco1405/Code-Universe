---
outline: [2, 3]
---

# Sistemas de construcción

Hasta ahora has compilado programas con comandos sueltos o con CMake. Pero detrás de ambos existe una capa que vale la pena entender: los **sistemas de construcción** (build systems). Son los encargados de decidir *qué* archivos compilar, *en qué orden* y *cuándo* recompilar cuando algo cambia.

Piénsalo como un jefe de obra: tú no cargas ladrillos ni mezclas cemento a mano. Le das el plano al jefe de obra y él coordina a los albañiles. En C++, el **compilador** son los albañiles y el **sistema de construcción** es el jefe de obra que les dice qué hacer y cuándo.

## 1. ¿Qué es un sistema de construcción?

Un sistema de construcción es una herramienta que **automatiza la compilación y el enlazado** de tu proyecto. Le dices qué archivos forman parte del programa y qué dependencias tiene cada uno, y él se encarga de:

- Compilar **solo** los archivos que cambiaron (no todo desde cero).
- Ejecutar los pasos en el orden correcto.
- Detectar dependencias: si un `.h` cambia, recompilar los `.cpp` que lo incluyen.

Sin un build system, un proyecto de 20 archivos exigiría memorizar decenas de comandos, y cualquier cambio obligaría a recompilarlo todo. Con uno, un solo comando lo resuelve.

::: info Nota
ℹ️ **La cadena completa:** CMake **no compila**: *genera* los archivos del build system (Makefile, build.ninja, proyecto de Visual Studio...). Y es el build system quien finalmente invoca al compilador (`g++`, `clang++`, MSVC).
:::

## 2. El flujo de compilación

Todo programa C++ pasa por tres fases, que el build system coordina:

1. **Preprocesado:** se resuelven `#include`, `#define`, etc.
2. **Compilación:** cada `.cpp` se traduce a código objeto (`.o` o `.obj`).
3. **Enlazado:** todos los objetos se unen para producir el ejecutable o la librería.

```
main.cpp ──► preprocesador ──► compilador ──► main.o ──┐
util.cpp ──► preprocesador ──► compilador ──► util.o ──┼──► enlazador ──► mi_programa
                                                      ┘
```

## 3. Make: el clásico

**Make** es el sistema de construcción más antiguo y extendido (1976). Su configuración vive en un archivo llamado `Makefile`, con reglas de este formato:

```make
target: dependencias
	comando
```

Un `Makefile` mínimo:

```make
mi_programa: main.o util.o
	g++ main.o util.o -o mi_programa

main.o: main.cpp util.h
	g++ -c main.cpp

util.o: util.cpp util.h
	g++ -c util.cpp

clean:
	rm -f *.o mi_programa
```

Para compilar solo ejecutas:

```bash
make
```

| Ventajas | Desventajas |
|---|---|
| Está en todos los sistemas Unix | La sintaxis es delicada (los tabs importan) |
| No requiere instalación extra | Los Makefiles grandes son difíciles de mantener |
| Base de miles de proyectos | En Windows no funciona de forma nativa (MinGW/Cygwin) |
::: warning Advertencia
⚠️ En un `Makefile`, las líneas de comando **deben** indentarse con tabulador (TAB), no con espacios. Un error clásico que rompe la compilación de forma confusa.
:::

## 4. Ninja: el moderno y veloz

**Ninja** es un sistema de construcción pequeño y enfocado en la **velocidad**. Fue creado para proyectos enormes (como Chromium) donde cada segundo de recompilación cuenta. A diferencia de Make, **no está pensado para escribirse a mano**: su configuración la genera otra herramienta, normalmente CMake.

- **Ventaja:** compilación incremental rapidísima; funciona en Windows, Linux y macOS.
- **Desventaja:** no está pensado para escribir su configuración manualmente (leer `build.ninja` no es agradable).

Para usarlo solo necesitas el binario `ninja` y delegar la generación a CMake:

```bash
cmake -G Ninja ..
cmake --build .
```

## 5. Make vs Ninja
| Característica | Make | Ninja |
|---|---|---|
| Año de creación | 1976 | 2012 |
| Configuración | `Makefile` (manual) | `build.ninja` (generada por CMake/Meson) |
| Velocidad de build incremental | Buena | Muy alta |
| Compatibilidad nativa con Windows | No (MinGW/Cygwin/MSYS2) | Sí |
| Uso recomendado | Proyectos pequeños, scripts manuales | Proyectos medianos y grandes |
| Escritura manual | Media (sintaxis delicada) | No recomendado |
## 6. Cómo se conectan con CMake

CMake actúa como **frontend** y genera el proyecto para el build system que elijas con el flag `-G`:

```bash
# Genera un Makefile (generador por defecto en Linux)
cmake -G "Unix Makefiles" ..

# Genera build.ninja para Ninja
cmake -G Ninja ..

# Genera un proyecto de Visual Studio (Windows)
cmake -G "Visual Studio 17 2022" ..
```

En todos los casos compilas igual:

```bash
cmake --build .
```

::: tip
💡 **Regla práctica:** si trabajas solo y el proyecto es pequeño, la configuración por defecto (Makefiles) basta. Si crece, migra a Ninja con `-G Ninja` y notarás la diferencia en cada recompilación.
:::

## 7. Buenas prácticas

- Empieza con la configuración **por defecto** de CMake y sube de nivel cuando haga falta.
- Usa **Ninja** para proyectos medianos o grandes.
- No toques los `Makefile` o `build.ninja` generados: **CMake los regenera**.
- Mantén el build separado del código (`cmake -B build`).

## 8. Resumen rápido

- El **sistema de construcción** coordina preprocesar, compilar y enlazar.
- **Make** (1976): clásico, manual, universal en Unix.
- **Ninja** (2012): rapidísimo, configurado por CMake, multiplataforma.
- CMake **genera** el proyecto para el build system elegido (`-G`).
- Compilas siempre con `cmake --build .`.
- CMake y el build system trabajan en cadena: tú solo escribes CMake.

Ya entiendes la cadena completa: compilador → build system → enlazador. En el siguiente capítulo verás la herramienta que coordina todo esto a nivel profesional: **CMake en profundidad**.
