---
outline: [2, 3]
---

# Funciones `static`

En C++ la palabra clave `static` puede aplicarse a funciones con dos significados
principales. Que tengas uno u otro depende del contexto, así que es importante
entender ambos para no confundirte:

1. **Dentro de un archivo (función global `static`)**
   La función queda con *enlace interno* (internal linkage).
   Es decir, su nombre **solo es visible dentro del archivo fuente (`.cpp`) donde se define**.

2. **Dentro de una clase (método `static`)**
   El método pertenece a la **clase en sí misma**, no a una instancia concreta.
   Se puede invocar sin crear un objeto de la clase.

::: info Nota
ℹ️ El contexto determina el significado:
- `static` en funciones libres = control de visibilidad en el *archivo*.
- `static` en métodos de clase = funciones compartidas por todos los objetos de la clase.
:::

## 1. Funciones `static` a nivel de archivo

Por defecto, una función definida en un archivo `.cpp` tiene **enlace externo**
(external linkage): su símbolo puede ser visto y enlazado desde otros archivos. Esto es
lo que normalmente quieres cuando defines funciones que deben ser públicas.

Si marcamos la función como `static`, esa función **queda restringida al archivo
actual**. Esto se utiliza para implementar detalles internos que no deben ser visibles
fuera del módulo. En otras palabras, es el "secreto de la cocina": está dentro del
restaurante, pero nadie de afuera puede verlo.

```cpp
// archivo: utilidades.cpp
#include <iostream>
using namespace std;

static void mensajeInterno() {
    cout << "Solo accesible dentro de utilidades.cpp\n";
}

void saludoPublico() {
    cout << "Hola desde saludoPublico()\n";
    mensajeInterno(); // ✅ Permitido
}

// archivo: main.cpp
void saludoPublico();

int main() {
    saludoPublico(); // ✅ Funciona
    mensajeInterno(); // ❌ Error: no visible fuera de utilidades.cpp [!code error]
}
```

Las funciones `static` a nivel de archivo son un mecanismo clásico para ocultar
símbolos, pero en C++ moderno se recomienda usar `anonymous namespaces`
(`namespace { ... }`) porque expresan mejor la intención de ocultar al ámbito del
archivo.

## 2. Funciones `static` dentro de clases

Cuando una función miembro de clase se declara `static`:

- No tiene un puntero implícito `this`.
- No depende de una instancia de la clase.
- Se accede usando el nombre de la clase o de un objeto, pero sin usar estado de instancia.

Es como un cartel de la empresa: pertenece a la organización en su conjunto, no a un
empleado en particular. Lo puedes leer sin necesidad de conocer a ninguno de sus
trabajadores.

```cpp
#include <iostream>
using namespace std;

class Contador {
private:
    static int totalObjetos; // miembro de clase
public:
    Contador() { totalObjetos++; }
    ~Contador() { totalObjetos--; }

    static int obtenerTotal() {
        return totalObjetos; // ✅ permitido, accede a variable estática
    }
};

// definición de la variable estática de clase
int Contador::totalObjetos = 0;

int main() {
    Contador c1, c2;
    cout << "Objetos vivos: " << Contador::obtenerTotal() << endl; // 2
}
```

## 3. Diferencias clave respecto a funciones normales

- Una función miembro `static` no puede acceder a miembros de instancia directamente
  (porque no tiene `this`).
```cpp
class Ejemplo {
    int valor = 42;
public:
    static void f() {
        cout << valor; // ❌ Error: no hay `this` [!code error]
    }
};
```

- Puede acceder a otros miembros `static` de la clase.

## 4. Casos de uso comunes

**A nivel de archivo**

- Ocultar funciones auxiliares que no deben ser parte de la interfaz pública.
- Evitar colisiones de nombres en proyectos grandes.

**En clases**

- Funciones utilitarias relacionadas con la clase, pero que **no dependen de un objeto específico**.
- Acceso a variables `static` compartidas por todas las instancias.
- Factories y contadores de instancias.

## 5. Buenas prácticas

- Prefiere `namespace { ... }` para ocultar símbolos a nivel de archivo en C++ moderno.
- Usa métodos `static` de clase para funcionalidades relacionadas con la clase pero independientes de objetos.
- No abuses de funciones `static` de clase como simples contenedores de utilidades → en ese caso, considera mejor usar un `namespace`.

## 6. Resumen rápido

- `static` en funciones libres → **enlace interno**, visible solo en el archivo `.cpp`.
- `static` en métodos de clase → **pertenecen a la clase**, no a un objeto.
- No tienen `this`, solo pueden usar miembros `static` de la clase.
- Casos de uso: Encapsulación, contadores, utilidades de clase, factories.

Ya entiendes los dos rostros de `static`. En el siguiente capítulo veremos la
**sobrecarga de funciones**, una herramienta que te permite usar el mismo nombre para
distintas variantes de una operación.