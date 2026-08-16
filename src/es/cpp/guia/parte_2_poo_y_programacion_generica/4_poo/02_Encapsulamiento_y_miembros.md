---
outline: [2, 3]
---

# Encapsulamiento y miembros

En el capítulo anterior creamos una clase `Perro` con todos sus miembros
públicos. Esto significa que cualquiera puede acceder a `nombre`, `edad` y
`ladrar()` desde cualquier parte del programa, incluso modificarlos a placer. A
primera vista parece cómodo, pero en el mundo real eso es un problema: ¿qué
pasa si alguien le asigna `edad = -5` a un perro? Nada nos lo impide, porque la
clase no tiene control sobre sus propios datos. Es como si dejáramos la caja
registradora de un negocio abierta para que cualquier persona metiera la mano.

La solución es la **encapsulación**, uno de los cuatro pilares de la
Programación Orientada a Objetos.

## 1. ¿Qué es la encapsulación?

La **encapsulación** es el principio que consiste en **ocultar los detalles
internos** de un objeto y exponer solo lo que sea necesario, mediante una
interfaz controlada.

Imagina que usas un cajero automático: solo interactúas con la pantalla, el
teclado y el dispensador de dinero. No puedes entrar a la máquina a mover
cables ni modificar su código interno. Esa separación entre el **exterior** (la
interfaz) y el **interior** (los detalles ocultos) es exactamente la
encapsulación. Tú no necesitas saber cómo funciona el cajero por dentro para
retirar dinero; solo necesitas la interfaz.

En la práctica, la encapsulación en C++ se logra con los **especificadores de
acceso**:

| Especificador | Acceso |
|---|---|
| `public:` | Accesible desde cualquier parte |
| `private:` | Solo accesible desde la propia clase |
| `protected:` | Accesible desde la clase y sus derivadas (lo veremos con herencia) |

## 2. Miembros privados y públicos

Los **atributos** normalmente van en `private` y los **métodos** que el mundo
exterior necesita van en `public`. De esta manera, los datos quedan protegidos
dentro de la clase y solo salen o se modifican a través de los métodos que tú
decidas exponer.

```cpp
#include <iostream>
using namespace std;

class CuentaBancaria {
private:
    double saldo; // Solo la clase puede tocar este dato

public:
    // Constructor
    CuentaBancaria(double saldoInicial) {
        if (saldoInicial < 0) {
            saldoInicial = 0; // Validamos incluso el constructor
        }
        saldo = saldoInicial;
    }

    // Métodos públicos: la interfaz hacia el exterior
    void depositar(double monto) {
        if (monto > 0) {
            saldo += monto;
        }
    }

    double obtenerSaldo() {
        return saldo;
    }
};

int main() {
    CuentaBancaria cuenta(1000);
    cuenta.depositar(500);

    cout << "Saldo: " << cuenta.obtenerSaldo() << endl; // 1500

    // cuenta.saldo = 999999;
    // ⚠️ Error: 'saldo' es privado, no se puede acceder desde aquí

    return 0;
}
```

Fíjate en la línea comentada: `cuenta.saldo = 999999;`. Si la descomentaras, el
compilador la rechazaría de inmediato. Ese es el poder de `private`: la clase
es la única dueña de su dato, y el mundo exterior solo puede interactuar con él
a través de `depositar()` y `obtenerSaldo()`. Es exactamente como una cuenta
bancaria real: no puedes entrar a tu cuenta y cambiar el saldo a mano, solo
puedes usar los cajeros (los métodos) que el banco te ofrece.

::: warning Advertencia
⚠️ Intentar acceder a un miembro privado desde fuera de la clase genera un
**error de compilación**. Esa es la protección que buscamos.
:::

## 3. Getters y setters

Cuando un atributo es privado, ¿cómo lo leemos o lo modificamos desde fuera? La
respuesta son los **getters** (para leer) y **setters** (para modificar),
métodos públicos que controlan el acceso. El nombre viene del inglés: *get*
significa **obtener** y *set* significa **establecer**.

```cpp
#include <iostream>
using namespace std;

class Usuario {
private:
    string nombre;
    int edad;

public:
    Usuario(string n, int e) : nombre(n) {
        setEdad(e); // Reutilizamos la validación
    }

    // Getter
    string getNombre() {
        return nombre;
    }

    // Setter con validación
    void setEdad(int nuevaEdad) {
        if (nuevaEdad >= 0 && nuevaEdad <= 130) {
            edad = nuevaEdad;
        } else {
            cout << "Edad inválida" << endl;
        }
    }

    int getEdad() {
        return edad;
    }
};

int main() {
    Usuario u("María", 25);
    cout << "Nombre: " << u.getNombre() << endl;

    u.setEdad(26);
    cout << "Edad: " << u.getEdad() << endl; // 26

    u.setEdad(-10); // Edad inválida (se rechaza)
    cout << "Edad: " << u.getEdad() << endl; // Sigue 26

    return 0;
}
```

Observa la magia de este ejemplo: cuando intentamos asignar `-10` como edad,
el setter lo rechaza porque viola la regla de que la edad debe estar entre `0`
y `130`. Sin el setter, cualquier valor inválido habría entrado al objeto sin
control alguno.

::: tip
💡 Los setters nos permiten **validar** los datos antes de aceptarlos. Es la
diferencia entre "confiar a ciegas" y "revisar antes de entrar".
:::

## 4. Lista de inicialización del constructor

En el ejemplo anterior usamos una sintaxis con dos puntos: `Usuario(string n,
int e) : nombre(n)`. Eso es una **lista de inicialización de miembros**, la
forma moderna y recomendada de inicializar atributos.

```cpp
class Producto {
private:
    string nombre;
    double precio;

public:
    // Lista de inicialización: más eficiente y directa
    Producto(string n, double p) : nombre(n), precio(p) {}
};
```

¿Por qué es mejor que asignar dentro del cuerpo del constructor? Porque los
atributos se inicializan **en el momento en que nacen**, y no después. Es una
diferencia sutil pero importante: con la lista de inicialización el dato ya
tiene su valor desde el primer instante de su existencia.

::: info Nota
ℹ️ En la lista de inicialización, los atributos se inicializan en el **orden en
que se declaran** en la clase, no en el orden en que aparecen en la lista. Por
eso se recomienda mantenerlos en el mismo orden.
:::

## 5. Miembros estáticos

Los **miembros estáticos** pertenecen a la **clase** y no a cada objeto. Son
compartidos por todas las instancias. Piensa en ello como un cartel en la
entrada de un edificio: no le pertenece a ningún departamento en particular,
pero todos los habitantes lo comparten.

```cpp
#include <iostream>
using namespace std;

class Contador {
private:
    static int total; // Pertenece a la clase

public:
    Contador() {
        total++;
    }

    static int obtenerTotal() {
        return total;
    }
};

// Definimos el miembro estático (necesario)
int Contador::total = 0;

int main() {
    Contador a;
    Contador b;
    Contador c;

    cout << "Objetos creados: " << Contador::obtenerTotal() << endl; // 3

    return 0;
}
```

Fíjate en dos detalles. Primero, el miembro estático se define fuera de la
clase con `int Contador::total = 0;`: es un requisito del lenguaje para darle
existencia real. Segundo, accedemos a él con el operador `::` en lugar del
punto, porque no pertenece a un objeto en particular sino a la clase misma.

::: tip
💡 Un miembro estático es útil para contar instancias, configuraciones
compartidas o constantes de clase.
:::

## 6. Beneficios de la encapsulación

- **Control**: validamos los datos antes de modificarlos.
- **Seguridad**: protegemos la integridad de los objetos.
- **Flexibilidad**: podemos cambiar la implementación interna sin afectar a
  quien usa la clase.
- **Mantenimiento**: el código queda más organizado y fácil de entender.

## 7. Buenas prácticas

- Pon los **atributos en `private`** por defecto.
- Expón solo los métodos que el exterior necesite (`public`).
- Usa getters y setters cuando necesites validación o control.
- Prefiere la **lista de inicialización** en los constructores.
- Evita exponer punteros o referencias a datos internos sin necesidad.

## 8. Resumen rápido

- La **encapsulación** oculta los detalles internos y expone una interfaz.
- `private` protege los datos; `public` expone la interfaz.
- Los **getters/setters** permiten acceso controlado.
- La **lista de inicialización** inicializa miembros de forma eficiente.
- Los **miembros estáticos** pertenecen a la clase, no a los objetos.

Con la encapsulación, tus clases pasan de ser simples "cajas abiertas" a
objetos seguros y autocontrolados. En el siguiente capítulo veremos cómo las
clases pueden heredar características entre sí: la **herencia**.