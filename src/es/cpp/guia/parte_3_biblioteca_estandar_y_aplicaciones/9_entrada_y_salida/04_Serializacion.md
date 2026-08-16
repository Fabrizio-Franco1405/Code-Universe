---
outline: [2, 3]
---

# Serialización

En el capítulo de archivos guardamos contactos escribiendo `"nombre telefono"` línea por
línea. Funcionaba, pero vimos que era frágil: ¿qué pasa con los nombres con espacios, con
los objetos que tienen muchos campos o con los datos anidados? Para guardar estructuras
complejas de forma ordenada y segura existe la **serialización**, una de esas palabras que
suenan complicadas pero esconden una idea muy simple.

## 1. ¿Qué es la serialización?

La **serialización** es el proceso de convertir un objeto (o una estructura de datos en
memoria) en una secuencia de bytes que pueda **guardarse en un archivo**, enviarse por la
red o transmitirse entre procesos. El proceso inverso, reconstruir el objeto desde los
bytes, se llama **deserialización**.

El nombre viene de "serie": se trata de convertir el objeto en una **secuencia** ordenada
de datos, es decir, ponerlo "en serie" para poder transportarlo:

```
Objeto en memoria                 Archivo / red
┌────────────────┐   serializar   ┌────────────────────┐
│ Contacto{      │ ─────────────► │ "Ana|5551234\n"     │
│  nombre="Ana"  │                └────────────────────┘
│  telefono=...  │   deserializar
│ }              │ ◄─────────────
└────────────────┘
```

## 2. Serialización manual: el formato simple

La forma más básica es definir nosotros mismos cómo se guarda cada objeto. Se controla
todo, pero hay que escribir el código de guardar y cargar a mano. Acá la clave está en
elegir un **separador** que no vaya a aparecer dentro de los datos, como el carácter `|`:

```cpp
#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
using namespace std;

struct Contacto {
    string nombre;
    int telefono;

    // Convertir a texto (serializar)
    string serializar() const {
        ostringstream flujo;
        flujo << nombre << "|" << telefono;
        return flujo.str();
    }

    // Construir desde texto (deserializar)
    static Contacto deserializar(const string &texto) {
        Contacto c;
        stringstream flujo(texto);
        getline(flujo, c.nombre, '|'); // Separador '|'
        flujo >> c.telefono;
        return c;
    }
};

int main() {
    Contacto ana = {"Ana María", 5551234};
    Contacto carlos = {"Carlos", 5555678};

    // Guardar
    {
        ofstream archivo("contactos.txt");
        archivo << ana.serializar() << endl;
        archivo << carlos.serializar() << endl;
    }

    // Cargar
    vector<Contacto> cargados;
    ifstream archivo("contactos.txt");
    string linea;
    while (getline(archivo, linea)) {
        cargados.push_back(Contacto::deserializar(linea));
    }

    for (const auto &c : cargados) {
        cout << c.nombre << " -> " << c.telefono << endl;
    }

    return 0;
}
```

::: tip
💡 El separador `|` permite que el nombre contenga espacios, algo que el formato "separado por espacios" no soportaba.
:::

## 3. Serialización binaria

Cuando el rendimiento y el tamaño importan, se puede serializar en **binario**: se guardan
los bytes tal cual, sin convertirlos a texto. Es rápido y compacto, pero hay un precio a
pagar: los archivos no se pueden leer con un editor de texto, porque son puros bytes:

```cpp
#include <iostream>
#include <fstream>
using namespace std;

struct Producto {
    int id;
    double precio;
    char nombre[20];
};

int main() {
    Producto p = {1, 19.99, "Teclado"};

    // Guardar en binario
    {
        ofstream archivo("producto.bin", ios::binary);
        archivo.write(reinterpret_cast<char *>(&p), sizeof(Producto));
    }

    // Cargar en binario
    Producto cargado;
    {
        ifstream archivo("producto.bin", ios::binary);
        archivo.read(reinterpret_cast<char *>(&cargado), sizeof(Producto));
    }

    cout << "ID: " << cargado.id << endl;
    cout << "Precio: " << cargado.precio << endl;
    cout << "Nombre: " << cargado.nombre << endl;

    return 0;
}
```

::: warning Advertencia
⚠️ La serialización binaria directa (`reinterpret_cast`) es rápida pero **frágil**: depende del tamaño del tipo, el orden de los bytes (endianness) y el compilador. Un archivo creado en Windows puede no leerse igual en Linux. Para datos que deban viajar entre sistemas, prefiere texto o formatos estándar.
:::

## 4. El problema de los punteros y la memoria

Hay algo que la serialización simple no puede hacer: guardar **punteros**. Si un objeto
apunta a memoria dinámica (como un `vector` interno), guardar sus bytes no sirve, porque
los punteros contienen direcciones de memoria que no tienen ningún sentido al recargar. Sería
como guardar la dirección de tu casa en un papel y dársela a alguien de otro país: la
dirección no le dice nada sin el mapa.

```cpp
struct Persona {
    vector<string> amigos; // ¿Cómo serializamos esto?
};
```

La solución es **serializar el contenido**, no los punteros. En vez de guardar la dirección
de memoria, guardamos los datos que contiene:

```cpp
struct Persona {
    string nombre;
    vector<string> amigos;

    string serializar() const {
        ostringstream flujo;
        flujo << nombre << "|" << amigos.size();
        for (const auto &amigo : amigos) {
            flujo << "|" << amigo;
        }
        return flujo.str();
    }
};
```

## 5. Serialización en C++ moderno: bibliotecas

En proyectos reales, casi nadie serializa a mano. Existen bibliotecas que lo hacen por ti,
y son tan buenas que reinventar la rueda sería un desperdicio de tiempo:

| Biblioteca | Formato | Uso |
|---|---|---|
| **nlohmann/json** | JSON | La más popular para JSON en C++ |
| **Boost.Serialization** | Binario/texto/XML | Muy potente, pesada |
| **cereal** | Binario/XML/JSON | Ligera y moderna |

En el próximo capítulo veremos **JSON y XML** con detalle. Por ahora, ten en mente que
existen herramientas listas para no reinventar la rueda.

## 6. Buenas prácticas

- Elige un **formato claro y consistente** (separadores, estructura).
- Serializa el **contenido**, nunca los punteros crudos.
- Valida los datos al deserializar (un archivo puede estar corrupto).
- Usa binario solo cuando el tamaño/rendimiento lo exijan y no haya portabilidad.
- Para formatos estándar, usa bibliotecas probadas.

## 7. Resumen rápido

- **Serializar** convierte un objeto a bytes; **deserializar** lo reconstruye.
- La serialización manual usa separadores y `ostringstream`/`stringstream`.
- La **binaria** es rápida pero no portable ni legible.
- Los punteros no se serializan: se guarda el contenido.
- En producción se usan bibliotecas (JSON, Boost, cereal).

La serialización te permite guardar todo el estado de tu programa de forma ordenada y
segura. En el siguiente capítulo veremos los formatos de intercambio más usados del mundo
real, los que vas a encontrar en casi cualquier API moderna: **JSON y XML**.