---
outline: [2, 3]
---

# Visión General

Bienvenido a **Code Universe: C**

Aquí comienza tu viaje por el lenguaje que definió la informática moderna. Si el software fuera una ciudad, C serían los cimientos, las vigas de acero y las tuberías que permiten que todo lo demás funcione.

C no es simplemente un lenguaje de programación; es el estándar con el que se mide la eficiencia. Ha dado vida a los núcleos de casi todos los sistemas operativos, ha permitido el nacimiento de internet y es el responsable de que el hardware que tienes frente a ti cobre vida. :piston:

En este capítulo, exploraremos por qué, tras más de 50 años, C sigue siendo el rey absoluto del bajo nivel, entenderemos su filosofía de "confianza total en el programador" y veremos por qué dominarlo te convertirá en un desarrollador de élite.

## ¿Qué es C?

C es un lenguaje de propósito general de bajo nivel (o nivel medio) creado por **Dennis Ritchie** entre 1969 y 1972 en los Laboratorios Bell. Fue diseñado originalmente para construir el sistema operativo Unix, lo que marcó su destino como el lenguaje preferido para la programación de sistemas.

A diferencia de los lenguajes modernos que intentan proteger al programador de la máquina, C te entrega las llaves de la memoria y el procesador. Es un lenguaje minimalista, elegante y extremadamente rápido que no añade capas innecesarias entre tu lógica y el silicio.

## Breve Reseña Histórica

Para entender el C necesitamos retrocer bastante en el tiempo hasta los años 60 cuando las computadoras eran máquinas enormes y complejas que ocupaban habitaciones enteras que solo podían ser usadas por especialistas, no existían las computadoras personales y programarlas era un trabajo pesado que se hacía en **Ensamblador** u otros lenguajes muy primitivos, en esa época los lenguajes de progrmación de alto nivel eran prácticamente inexistente, todo era nuevo y los pioneros de entonces estaban trabajando en poder hacer que las computadoras fueran más accesibles y fáciles de programar.

Si bien es cierto que en los 60 ya existían lenguajes como **Fortran** o **Cobol** la verdad es que estaban diseñados para tareas muy específicas, Fortran para Cálculos científicos y Cobol para los negocios es allí donde entra **C** a finales de a decadas. El nacimiento de **C** estaba estrechamente ligado a la histotia de **Unix**, en 1969 en los laboratorios Bell **Dennis Ritchie** y **Ken Thompson** estaban trabajando en un sistema operativo llamado **Multix** proyecto que terminó siendo cancelado por ser demasiado complejo, no obstante el conocimiento adquirido les sirvió para el proyecto que venía después fue entonces cuando decidieron crear **Unix**.

A diferencia de **Multix**, Unix se centraba en ejecutar una sola tarea a la vez pero buscaba hacerlo bien para gestionar de forma eficiente los recursos, proyectos como el kernel de **Linux** nació como una versión abierta del Sistema **Minix** que a su vez estaba basado en Unix, los nombres de todos estos sitemas terminan en **"x"** como homanaje a su antecesor Unix. Para poder hacer de este proyecto algo grande ecesitaban de un lenguaje de programación que pudiera aprovechar al máximo su potencial, aquí es donde Dennis Ritchie decidió tomar un lenguaje existete llamado **"B"** desarrollado por Ken Thompson pero este buscaba mejorarlo.

Si bien B fue el punto de partida este no llegó a ser lo que esperaba ya que tenía problemas con los tipos de datos o estructuras más complejas y es allí cuando Ritchie deció crear **C** para superar estas limitantes y pensó en varios principios claves: C debía ser extremadamente eficiente tanto en ejecución como en uso de memoria, esto era crucial en una época donde los recursos de computación eran limitados, en segundo lugar tenía que ser lo suficientemente flexible para poder ser utilizado en diferentes tipos de sistemas y en tercer lugar tenía que ser bastante sencillo para que los programadores pudieran entenderlo y aprenderlo rápidamente pero sin sacrificar con ello el poder expresivo necesario para escribir programas complejos.

Para la decada de los 70 C ya se había progagado en instituciones, empresas e investigadores ya que permitía escribir aplicaciones y ser usada en múltiples arquitecturas sin necesidad de ser reescritas, con el tiempo se volvió fue consolidando como el lenguaje preferido para el desarrollo de Sistemas operativos, compiladores, interpretes y muchas otras aplicaciones de bajo nivel. A día de hoy C es sin duda una de las opciones más sólidas para construir aplicaciones que tengan que ver con el hardware os software desde su profundidad.

## Filosofía y principios clave

C se rige por una interpretación bastante famosa: **"El programador sabe lo que hace"**. Este lenguaje no tiene recolector de basura ni verificaciones automáticas que ralenticen la ejecución.

Sus principios fundamentales son:

- **Minimalismo y Velocidad:** C tiene un conjunto de palabras reservadas muy pequeño. No gasta ciclos de reloj en funciones que tú no hayas solicitado explícitamente.

- **Acceso Directo a la Memoria:** A través de los punteros, C permite manipular la RAM de forma precisa. Esto es vital para escribir controladores de dispositivos y sistemas embebidos.

- **Portabilidad de Bajo Nivel:** Aunque te permite tocar el hardware, el código en C puede compilarse en casi cualquier procesador existente, desde un microcontrolador de una cafetera hasta una supercomputadora.

- **Transparencia:** En C, no hay "magia negra". Si algo sucede en tu programa, es porque tú lo escribiste. Esto te otorga un control total sobre los **haberes** de tu sistema.

## ¿Por qué aprenderlo?

Podrías pensar que un lenguaje de hace 50 años es obsoleto, pero la realidad es que aprender C es la mejor inversión que puedes hacer en tu carrera:

- **Entenderás la computadora de verdad:** Aprenderás cosas bastente importantes como por ejemplo: Qué es un puntero, cómo se gestiona la memoria dinámica y cómo interactúa el software con el hardware. Esto te dará una ventaja injusta sobre quienes solo conocen lenguajes de alto nivel.

- **Es el lenguaje de la infraestructura:** Si quieres trabajar en ciberseguridad, sistemas operativos, robótica o desarrollo de controladores, C es prácticamente el único camino.

- **Madre de otros lenguajes:** C++, Java, C#, Python y PHP tienen sus raíces (y muchas veces sus intérpretes) escritos en C. Si sabes C, aprender cualquier otro lenguaje te tomará días, no meses.

- **Eficiencia implacable:** En entornos donde los recursos son limitados (como dispositivos médicos o satélites), C es la opción por excelencia porque aprovecha cada byte disponible.

## ¿Dónde se utiliza?

C está en todas partes, a menudo escondido bajo capas de otros lenguajes.

- **Sistemas Operativos:** Los kernels de Windows, Linux, Android y macOS están escritos principalmente en C.
- **Bases de Datos:** Los motores de MySQL, PostgreSQL y Oracle dependen de C para gestionar grandes volúmenes de datos a alta velocidad.
- **Sistemas Embebidos:** El microondas, el sistema de frenos de un auto (ABS) y los relojes digitales corren código C.
- **Intérpretes:** El intérprete oficial de Python (CPython) está escrito en C. Sin C, Python no existiría.

## Recomendaciones

C es honesto pero exigente. Al principio, es normal que tus programas fallen o que "toquen" memoria que no debían. No te desesperes; es por eso que existe **Code Universe**, te guiaremos paso a paso para que puedas convertirte en ese desarrollador de software que tanto anhelas.

Es importante que en todo momento tengas una mentailidad positiva y si por alguna extraña razón tú código falla, ¡Felicidades! Estás aprendiendo y te pasará muchas veces y eso solo significa que estás mejorando porque cada error es distinto y todos los que empezamos estuvimos allí, lo importante es tu constancia y tus ganas de seguir.