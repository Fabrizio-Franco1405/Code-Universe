---
outline: [2, 3]
---

# Concurrencia sin miedo

En el landing de este ecosistema prometimos que dominarías el paralelismo **sin miedo a las condiciones de carrera**. Hasta ahora todo lo que has aprendido —ownership, préstamos, punteros inteligentes— sucede dentro de un solo hilo de ejecución. En este capítulo vamos a abrir el juego: varios hilos trabajando en paralelo, con el compilador garantizando que ninguno pise los datos del otro. Es la prueba definitiva de que el auditor de seguridad no descansa ni siquiera en el código más complejo.

## 1. Creando hilos con `thread::spawn`

Para lanzar trabajo en paralelo, Rust te da **`thread::spawn`**, que recibe un cierre y lo ejecuta en un hilo nuevo. Al mismo tiempo, el hilo principal sigue adelante; si queremos esperar el resultado, usamos `join`:

```rust
use std::thread;

let manejador = thread::spawn(|| {
    for i in 1..=5 {
        println!("hilo: {i}");
    }
});

manejador.join().unwrap();
println!("el hilo principal terminó");
```

- `thread::spawn`: crea un hilo que ejecuta el cierre recibido y devuelve un `JoinHandle`.
- `join()`: bloquea el hilo principal hasta que el hilo creado termina, y nos devuelve su resultado.

Recuerda que la ejecución de los hilos no está garantizada en orden: el auditor garantiza la **seguridad de la memoria**, no el orden exacto de los `println!`. Si necesitas un orden estricto, la coordinación es tu trabajo.

## 2. Mover datos a los hilos

Un hilo puede vivir más tiempo que los datos de la función que lo crea, por lo que el cierre no puede prestar variables del entorno: debe ser **dueño** de ellas. Ahí es donde entra la keyword `move` que viste en el capítulo de cierres:

```rust
use std::thread;

let mensaje = String::from("desde el hilo");
let manejador = thread::spawn(move || {
    println!("{mensaje}");
});

manejador.join().unwrap();
```

- `move`: fuerza al cierre a capturar `mensaje` por valor; el hilo pasa a ser su dueño.
- Sin `move`, el compilador se quejaría: el hilo podría seguir vivo cuando `mensaje` ya no exista.

:::warning Advertencia
⚠️ Olvidar `move` es el error más común al empezar con hilos. Si el compilador te dice que el cierre puede sobrevivir a la variable que captura, añade `move` y el problema desaparece.
:::

## 3. Canales mpsc

Una forma elegante de comunicación entre hilos son los **canales** de tipo *múltiple productor, un consumidor* (mpsc). Un `transmisor` envía mensajes y un `receptor` los recibe en orden, moviendo los datos de un hilo a otro sin compartir memoria:

```rust
use std::sync::mpsc;
use std::thread;

let (transmisor, receptor) = mpsc::channel();

thread::spawn(move || {
    transmisor.send(String::from("primero")).unwrap();
    transmisor.send(String::from("segundo")).unwrap();
});

println!("{}", receptor.recv().unwrap());
println!("{}", receptor.recv().unwrap());
```

- `mpsc::channel()`: crea el par `(transmisor, receptor)`.
- `send`: envía un valor; `recv`: espera (bloquea) hasta que llegue uno y lo devuelve.

:::tip
💡 Piensa en el canal como un buzón: el hilo productor deja cartas, y el hilo consumidor las saca en orden. Es comunicación por mensajes, la alternativa natural al estado compartido.
:::

## 4. Estado compartido con `Mutex<T>`

Cuando varios hilos necesitan acceder al **mismo** dato, la protección clásica es el **`Mutex<T>`** (exclusión mutua). Solo un hilo puede tener el "candado" a la vez; los demás esperan. El truco de Rust: en lugar de exponer el dato directamente, `lock()` te entrega una **guardia** que lo desbloquea sola al salir del alcance.

```rust
use std::sync::Mutex;

let contador = Mutex::new(0);
{
    let mut guardia = contador.lock().unwrap();
    *guardia += 1;
}
println!("{}", *contador.lock().unwrap()); // 1
```

- `Mutex::new`: crea el dato protegido.
- `lock()`: devuelve la guardia, que se desbloquea automáticamente cuando deja de usarse.
- `unwrap`: recupera el valor si el candado se obtuvo sin errores.

## 5. Compartir entre hilos con `Arc<T>`

Aquí aparece el problema: un `Mutex` debe ser compartido entre hilos, pero el Ownership no permite dos dueños. La solución es envolverlo en **`Arc<T>`** (*atomic reference counting*), el hermano atómico de `Rc`, que suma referencias de forma segura entre hilos:

```rust
use std::sync::{Arc, Mutex};
use std::thread;

let contador = Arc::new(Mutex::new(0));
let mut manejadores = vec![];

for _ in 0..10 {
    let contador = Arc::clone(&contador);
    manejadores.push(thread::spawn(move || {
        let mut guardia = contador.lock().unwrap();
        *guardia += 1;
    }));
}

for manejador in manejadores {
    manejador.join().unwrap();
}
println!("Resultado: {}", *contador.lock().unwrap()); // 10
```

- `Arc::clone`: aumenta el contador atómico y entrega una nueva "mano" al hilo.
- Cada hilo bloquea el `Mutex`, incrementa y desbloquea al salir del cierre.
- Al final, los diez hilos han sumado uno cada uno, y el resultado es exactamente 10.

:::danger
¡Cuidado con las condiciones de carrera! Si varios hilos modificaran el contador **sin** el `Mutex`, el resultado sería impredecible: las operaciones se pisan entre sí. El compilador no puede detectar la lógica equivocada, pero sí te obliga a usar la sincronización correcta, convirtiendo el riesgo en un error de compilación en lugar de un fallo en producción.
:::

## 6. `Send` y `Sync`: El pase de seguridad

¿Cómo sabe el auditor qué datos pueden cruzar hilos sin peligro? Gracias a dos **auto traits**: **`Send`** y **`Sync`**. Un tipo es `Send` si su propiedad puede transferirse a otro hilo, y es `Sync` si puede compartirse por referencia desde varios hilos a la vez.

- `Send`: permite mover el valor a otro hilo. Casi todos los tipos son `Send`.
- `Sync`: permite compartirlo por referencia; un tipo es `Sync` si sus referencias también son `Send`.
- `Rc<T>` no es ni `Send` ni `Sync` porque su contador no es atómico; el compilador te lo impide si intentas enviarlo a un hilo.
- `Arc<T>` y `Mutex<T>` sí lo son, por eso son los protagonistas de este capítulo.

Estos traits se implementan automáticamente para casi todos los tipos, y el compilador los usa para **rechazar código inseguro antes de ejecutarlo**. Si tu tipo combina piezas que no son `Send` o `Sync`, simplemente no podrás usarlo entre hilos. Es la razón de fondo por la que esta sección se llama *concurrencia sin miedo*: el lenguaje se encarga de los errores que en otros ecosistemas solo aparecen en producción.

## Buenas prácticas

- Usa `move` siempre que el cierre de un hilo necesite capturar datos del entorno.
- Prefiere **canales** para comunicación simple entre hilos y `Mutex` para estado compartido.
- Envuelve el `Mutex` en `Arc` cuando deba compartirse entre varios hilos.
- No confíes en el orden de ejecución: coordina con `join` y canales cuando el orden importe.

## Resumen rápido

- `thread::spawn` lanza un hilo y `join` espera su final.
- `move` transfiere la propiedad de los datos al hilo.
- Los canales mpsc comunican hilos con mensajes (`send`/`recv`).
- `Mutex<T>` protege el estado compartido; `Arc<T>` lo hace compartible entre hilos.
- `Send` y `Sync` son los auto traits con los que el auditor garantiza la seguridad en paralelo.

Ya sabes escribir programas que corren sobre varios núcleos con total seguridad. Antes de cerrar la travesía, nos queda un último capítulo: empaquetar y publicar tu trabajo como un profesional con las herramientas avanzadas de Cargo.