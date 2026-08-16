---
outline: [2, 3]
---

# Introducción a los patrones de diseño

Imagina que eres arquitecto. Cada vez que alguien te pide una casa, no reinventas la rueda: sabes que hay **soluciones probadas** para el salón, el baño o las escaleras. En programación pasa igual. Los **patrones de diseño** son esas soluciones probadas y reutilizables para los problemas que aparecen una y otra vez.

En este módulo aprenderás los patrones más útiles, con ejemplos reales en C++ moderno.

## 1. ¿Qué es un patrón de diseño?

Un **patrón de diseño** es una **solución general y reutilizable** a un problema que ocurre con frecuencia en el diseño de software. No es código copiable: es una **receta**, una guía de cómo estructurar tus clases y objetos.

El concepto se popularizó en 1994 con el libro *"Design Patterns"* (el "Gang of Four": Gamma, Helm, Johnson y Vlissides), que catalogó **23 patrones clásicos**.

```
Problema recurrente  ──►  Patrón  ──►  Solución probada
(¿cómo crear un      (Factory)   (interfaz común para
 objeto sin          ─────────►   crear familias de
 complicar al        (Singleton)  objetos, única instancia...)
 llamador?)
```

## 2. Las tres familias de patrones

El Gang of Four dividió los patrones en tres grandes grupos:
| Familia | Pregunta que responde | Ejemplos |
|---|---|---|
| **Creacionales** | ¿Cómo **creo** objetos? | Factory, Singleton, Builder |
| **Estructurales** | ¿Cómo **organizo** las clases? | Adapter, Decorator, Facade |
| **De comportamiento** | ¿Cómo **interactúan** los objetos? | Observer, Strategy, Command |
## 3. La analogía de la cocina

Piensa en una cocina profesional:

- **Patrones creacionales** = la despensa: cómo conseguir los ingredientes (¿comprados, preparados, pedidos al proveedor?).
- **Patrones estructurales** = la organización: cómo están colocados fogones, mesas y utensilios para trabajar en equipo.
- **Patrones de comportamiento** = la comunicación: cómo se avisan los cocineros entre sí ("¡pasando!", "¡plato listo!").

## 4. ¿Por qué son importantes?
| Beneficio | Descripción |
|---|---|
| **Vocabulario común** | "Usa un Factory aquí" dice más que una explicación larga |
| **Soluciones probadas** | No pagas los errores que otros ya cometieron |
| **Código mantenible** | Los patrones organizan el código de forma predecible |
| **Flexibilidad** | Los patrones facilitan cambiar partes sin romper el todo |
## 5. Advertencia importante

::: warning Advertencia
⚠️ Los patrones **no son obligatorios** ni mágicos. Usarlos sin necesidad complica el código. La regla de oro: **usa un patrón solo si resuelve un problema real** que tienes, no para "ponerte moderno".
:::

## 6. Los patrones que veremos en este módulo
| Capítulo | Patrón | Familia |
|---|---|---|
| 2 | **Factory Method** | Creacional |
| 3 | **Singleton** | Creacional |
| 4 | **Observer** | Comportamiento |
| 5 | **Strategy** | Comportamiento |
| 6 | **Adapter y Decorator** | Estructural |
Estos son los patrones con más uso real en C++ moderno. Cuando los domines, entenderás y escribirás código profesional con mucha más facilidad.

## 7. Buenas prácticas

- Aprende primero los patrones **creacionales** (los más usados).
- Piensa en el **problema**, no en el patrón: el patrón llega después.
- Combina C++ moderno (smart pointers, `std::function`, lambdas) con los patrones.
- No implementes un patrón si una solución más simple funciona.

## 8. Resumen rápido

- Un patrón de diseño es una **solución probada** a un problema recurrente.
- Hay tres familias: **creacionales**, **estructurales** y **de comportamiento**.
- El "Gang of Four" catalogó 23 patrones clásicos en 1994.
- Los patrones dan **vocabulario común** y hacen el código **mantenible**.
- Úsalos con **moderación**: solo cuando resuelven un problema real.
- En este módulo veremos: Factory, Singleton, Observer, Strategy, Adapter y Decorator.

Empecemos con los patrones creacionales. El primero, y uno de los más usados en la industria: el **Factory Method**.
