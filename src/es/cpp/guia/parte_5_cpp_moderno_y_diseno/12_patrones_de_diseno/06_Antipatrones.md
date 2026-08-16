---
outline: [2, 3]
---

# Antipatrones

En los capítulos anteriores viste los patrones de diseño: soluciones probadas y elegantes para
problemas recurrentes. Pero en el mundo real no todo es tan bonito. Así como existen patrones que
funcionan, existen también prácticas que *parecen* razonables pero que a la larga generan
problemas. A eso le decimos **antipatrones**.

Un **antipatrón** es una práctica de diseño que *parece* razonable, pero que a la larga genera
problemas. Son las trampas en las que caemos cuando no queremos "complicarnos": un `if` que crece
sin control, un objeto todopoderoso que hace de todo, código duplicado copiado y pegado.
Reconocerlos es el primer paso para evitarlos.

Cabe destacar un detalle importante: los antipatrones no son errores de sintaxis. **Compilan
perfectamente.** El compilador no se queja ni enciende una luz roja. Su coste se paga en
mantenimiento, bugs sutiles y miedo a tocar el código. Son como una deuda que se acumula en
secreto y un día te cobra intereses.

## 1. God Object (objeto todopoderoso)

El **God Object** es esa clase que hace de todo: procesa datos, pinta la interfaz, accede a la
base de datos y gestiona usuarios. Al principio es cómodo tener todo junto: no hay que saltar de
archivo en archivo. Pero pronto **nadie puede modificarla sin romper algo**. Cualquier cambio
toca demasiadas responsabilidades a la vez.

```cpp
// Antipatrón: una sola clase con 15 responsabilidades
class Todo {
public:
    void procesar_venta();
    void guardar_en_db();
    void dibujar_interfaz();
    void enviar_email();
    void calcular_impuestos();
    // ... y 10 métodos más
};
```

**Solución**: aplicar el **principio de responsabilidad única** — dividir en clases pequeñas con
un propósito claro (ventas, persistencia, interfaz, notificaciones). Cada una con su motivo de
cambio, cada una fácil de entender y de modificar por separado.

## 2. Código duplicado (copiar y pegar)

Copiar un bloque "porque ya funciona" es tentador. Es lo más rápido del mundo: seleccionás, copiás
y pegás. Pero el problema aparece cuando hay que corregir un bug o cambiar un comportamiento:
habrá que encontrarlo en **cada copia**, y es muy fácil olvidarse de una. Peor todavía: a veces
las copias se van modificando por separado y dejan de coincidir, como en este ejemplo:

```cpp
// En la clase A
double total_con_iva(double precio) { return precio * 1.21; }

// En la clase B (copiado, con un pequeño cambio)
double total_con_iva(double precio) { return precio * 1.19; }  // ¿error? ¿a propósito?
```

Fijate el peligro: una de las dos usa `1.21` y la otra `1.19`. ¿Es un error? ¿Fue a propósito?
Nadie lo sabe mirando el código, y eso es exactamente el problema del código duplicado.

**Solución**: extraer el bloque a una **función o clase compartida** (`IVA::aplicar(precio)`),
con un único punto de verdad. De esa manera, si el impuesto cambia, solo se toca un lugar.

## 3. Shotgun Surgery (cirugía de escopeta)

El problema inverso a la duplicación: un cambio **lógico** obliga a tocar **muchos archivos**. Su
nombre viene de una imagen muy gráfica: es como disparar con una escopeta, donde cada perdigón
cae en un archivo distinto. Cambiar el formato de una fecha significa editar 12 lugares distintos,
y si te olvidás de uno, ese lugar queda con el formato viejo.

**Solución**: encapsular el concepto que cambia en **un solo módulo** (una clase `Fecha` con su
propio formateo) y usarla en todas partes. Así, cambiar el formato se reduce a modificar un único
lugar: el disparo de escopeta se convierte en un tiro certero.

## 4. Magic numbers y strings dispersos

Los **magic numbers** son números y cadenas con significado mágico repartidos por el código:
aparecen de la nada, sin nombre y sin contexto. El código compila perfecto, pero el pobre
programador que lo lea (que muchas veces serás vos en tres meses) tiene que adivinar qué significa
cada valor:

```cpp
if (estado == 3) {            // ¿qué es 3?
    enviar(0, "servidor");    // ¿qué es 0? ¿qué servidor?
}
```

**Solución**: usar `enum class` y constantes con nombre. Así el significado queda grabado en el
código mismo, y el compilador además te protege de escribir valores que no existen:

```cpp
enum class Estado { PENDIENTE, ACTIVO, CANCELADO };
enum class Destino { SERVIDOR, CLIENTE };

if (estado == Estado::CANCELADO) {
    enviar(Destino::SERVIDOR, "servidor");
}
```

## 5. Código muerto

El **código muerto** es aquel que ya nadie usa: funciones que ya nadie llama, variables sin uso,
ramas que nunca se ejecutan. Muchas veces se conserva "por las dudas" o por miedo a romper algo,
pero en realidad solo aporta confusión y hace que la lectura del código requiera **separar lo
vivo de lo muerto**:

```cpp
void funcion_vieja() {
    // Nadie la llama desde hace 3 años
}
```

**Solución**: eliminar el código muerto. El control de versiones guarda el historial; no hace
falta conservarlo en el código. Si algún día lo necesitás de nuevo, está en el repositorio. El
código fuente debe contar la historia actual, no el museo de todo lo que alguna vez existió.

## 6. YAGNI y sobreingeniería

**YAGNI** ("You Aren't Gonna Need It") es una sigla que resume el antipatrón de construir
abstracciones para problemas que **aún no existen**: una jerarquía de 6 clases para guardar dos
variables en un archivo. Es el reflejo de querer "dejar todo perfecto para el futuro", pero el
futuro rara vez llega con la forma que imaginamos:

```cpp
// Antipatrón: abstracción innecesaria para algo trivial
class Almacenamiento {
    virtual void guardar() = 0;   // ¿para qué? Solo se usa un tipo
};
```

**Solución**: implementar lo necesario **ahora**, con la solución más simple que funcione.
Refactorizar cuando el problema real aparezca. Construir abstracciones a demanda, no a suposición.

## 7. Golden Hammer (martillo de oro)

El **Golden Hammer** es usar una herramienta que conoces para **todo**, incluso cuando no encaja.
Como el refrán: si lo único que tenés es un martillo, todo te parece un clavo. En el código se ve
así: SQL para memoria, herencia para todo, `std::vector` para búsquedas frecuentes.

```cpp
// ¿Búsquedas constantes? Un vector lineal no es la mejor opción
vector<pair<string, int>> precios;  // buscar = O(n)
```

**Solución**: evaluar la herramienta según el problema. Para búsquedas por clave, `std::unordered_map` suele ser la elección natural. La herramienta correcta no es la que más dominás, sino la que mejor resuelve el problema.

## 8. Cómo evitarlos en la práctica

La buena noticia es que los antipatrones se pueden evitar con hábitos sencillos. Estas son las
prácticas que más te van a ayudar a mantener el código sano:

- **Aplica responsabilidad única**: si una clase tiene más de una razón para cambiar, divide.
- **DRY**: no dupliques; extrae lo común a un único punto.
- **Empieza simple** (YAGNI) y refactoriza cuando el código hable.
- **Nombra las cosas** (`enum class`, constantes) en lugar de valores mágicos.
- **Limpia mientras avanzas**: elimina código muerto y comentarios que mienten.

## 9. Resumen rápido

- Los antipatrones **compilan bien**: su coste es de mantenimiento, no de sintaxis.
- **God Object** y **duplicación** son los más comunes en proyectos reales.
- **YAGNI** te protege de la sobreingeniería.
- **DRY** y **responsabilidad única** previenen la mayoría de los problemas.
- Reconoce el antipatrón *antes* de que sea caro de corregir.

Dominar patrones y antipatrones te convierte en un diseñador de software con criterio. Esto
cierra la parte de diseño; el próximo bloque se adentra en **ingeniería y producción**: sistemas
de construcción, optimización y el proyecto final.