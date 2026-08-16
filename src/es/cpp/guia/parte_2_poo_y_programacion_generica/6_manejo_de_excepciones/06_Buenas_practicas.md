---
outline: [2, 3]
---

# Buenas prácticas

Hemos recorrido las excepciones desde sus conceptos básicos hasta RAII. Pero
saber cómo funcionan no es suficiente: en el código real, la diferencia entre un
manejo de errores **elegante** y uno **frustrante** está en los detalles. Este
capítulo reúne las buenas prácticas y las trampas más comunes que debes
conocer.

## 1. Lanza por valor, captura por referencia

Esta es quizás la regla más importante de todas. Al lanzar, se **copia** el
objeto de excepción; al capturar, usa **referencia const** para no copiarlo de
nuevo y para preservar el polimorfismo.

```cpp
// ✅ Correcto
throw runtime_error("error");
catch (const runtime_error &e) { ... }

// ❌ Incorrecto (copia innecesaria y slicing)
catch (runtime_error e) { ... }
```

::: warning Advertencia
⚠️ Capturar por valor provoca **slicing**: si la excepción real es
`out_of_range` (derivada de `runtime_error`), al capturarla como `runtime_error`
por valor se pierde la información de la clase derivada.
:::

Piénsalo así: lanzar es pasar un paquete, y capturar por referencia es mirar el
paquete sin abrirlo. Capturar por valor, en cambio, obliga a hacer una copia del
paquete y, de paso, rompe la etiqueta que decía de qué tipo era realmente.

## 2. Usa excepciones para errores, no para control de flujo

Las excepciones están diseñadas para situaciones **excepcionales**. No las uses
como un `if` elegante:

```cpp
// ❌ Mal: excepción para control de flujo normal
try {
    if (encontrado) throw 1;
    // ... código normal ...
}
catch (int) { /* buscar otro */ }

// ✅ Bien: verificación normal con condiciones
if (encontrado) {
    // ... código normal ...
} else {
    // buscar otro
}
```

::: info Nota
ℹ️ Lanzar una excepción tiene coste (desenrollado de la pila, construcción del
objeto). En bucles calientes o flujos esperados, las condiciones simples son más
rápidas y legibles.
:::

## 3. Diseña una estrategia clara de errores

Define desde el principio cómo se manejan los errores en cada capa de tu
aplicación:

| Capa | Responsabilidad |
|---|---|
| Capa de datos | Detectar y lanzar excepciones con contexto |
| Capa de lógica | Dejar pasar (o relanzar) los errores |
| Capa de presentación | Capturar, registrar y mostrar al usuario |

```cpp
// La capa de datos detecta y lanza
void consultarUsuario(int id) {
    if (id < 0) {
        throw invalid_argument("ID de usuario no puede ser negativo");
    }
}

// La capa de presentación captura y muestra
int main() {
    try {
        consultarUsuario(-1);
    }
    catch (const invalid_argument &e) {
        cout << "Entrada no válida: " << e.what() << endl;
    }
}
```

Cada capa tiene un rol bien definido, como en una empresa: quien detecta el
problema lo reporta, quien lo procesa lo deja pasar, y quien habla con el
cliente lo comunica. Cuando los errores atraviesan las capas con reglas claras,
el programa se comporta de forma predecible.

## 4. No lances desde destructores

Los destructores no deben lanzar excepciones. Si un destructor lanza mientras
se desenrolla la pila por otra excepción, el programa termina llamando a
`std::terminate()`.

```cpp
class Recurso {
public:
    ~Recurso() {
        // ❌ Nunca lances desde un destructor
        // throw runtime_error("error");
    }
};
```

::: danger Peligro
🛑 Un `throw` en un destructor durante un desenrollado de pila provoca
`std::terminate()` y el programa aborta. Los destructores deberían ser
`noexcept` por defecto.
:::

## 5. Usa `noexcept` con conocimiento

Marca como `noexcept` las funciones que realmente no lanzan. Esto permite al
compilador optimizar mejor y documenta la intención.

```cpp
int sumar(int a, int b) noexcept {
    return a + b;
}
```

::: warning Advertencia
⚠️ Recuerda: si una función `noexcept` lanza, el programa termina. Solo marca
funciones que sabes que no lanzarán (tipos primitivos, operaciones de movimiento
bien implementadas).
:::

## 6. Ordena los `catch` de lo específico a lo general

El compilador elige el **primer** `catch` compatible. Captura primero lo más
específico y deja lo general al final.

```cpp
try {
    // ... operación ...
}
catch (const out_of_range &e) {       // 1º específico
    // ...
}
catch (const logic_error &e) {        // 2º intermedio
    // ...
}
catch (const exception &e) {          // 3º general
    // ...
}
catch (...) {                         // 4º red de seguridad
    // ...
}
```

## 7. Proporciona contexto al lanzar

Un mensaje vago como `"error"` es inútil cuando el error aparece en producción.
Incluye **qué** falló y **dónde**:

```cpp
// ❌ Sin contexto
throw runtime_error("Error");

// ✅ Con contexto
throw runtime_error("No se pudo abrir el archivo 'config.txt' en la ruta /etc/app");
```

::: tip
💡 Puedes combinar varias piezas de información con `std::to_string()` para
construir mensajes descriptivos, como vimos con las excepciones personalizadas.
:::

## 8. Evita capturar y tragar errores

Capturar un error y no hacer nada es una de las peores prácticas:

```cpp
// ❌ "Tragar" el error: nadie sabrá qué pasó
try {
    // ...
}
catch (...) {
    // no hacer nada
}

// ✅ Al menos registra y decide qué hacer
try {
    // ...
}
catch (const exception &e) {
    registrarError(e.what());
    // o relanza: throw;
}
```

## 9. Resumen rápido

- **Lanza por valor, captura por referencia const**.
- Usa excepciones para errores, no para control de flujo.
- Diseña una estrategia de errores por capas.
- **Nunca** lances desde destructores.
- Usa `noexcept` cuando una función no lance.
- Ordena los `catch` de lo específico a lo general.
- Aporta contexto en los mensajes de error.
- No tragues los errores en silencio.

Con estas buenas prácticas, el manejo de excepciones pasará de ser un tema
teórico a una herramienta sólida en tu código. Con esto cerramos la sección de
manejo de excepciones. El siguiente bloque nos adentra en la joya de la corona
de C++: la **biblioteca estándar (STL)**.