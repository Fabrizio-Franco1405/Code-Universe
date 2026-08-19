---
outline: [2, 3]
---

# Manejo de archivos

Un programa que pierde sus datos al cerrarse es de poca utilidad. Pensalo: ¿de qué te
sirve una agenda, un juego con puntajes o un editor de texto si todo se borra cuando apagás
la computadora? Para que la información **sobreviva** entre ejecuciones, debemos guardarla
en archivos. Y acá hay una muy buena noticia: todo lo que aprendiste sobre flujos en el
capítulo anterior se aplica directamente, porque los archivos también son flujos.

## 1. Los flujos de archivo

C++ ofrece tres clases para trabajar con archivos (en `<fstream>`), cada una pensada para
una tarea distinta:

| Clase | Función | Modo |
|---|---|---|
| `std::ifstream` | Leer archivos (input) | Sólo lectura |
| `std::ofstream` | Escribir archivos (output) | Sólo escritura |
| `std::fstream` | Leer y escribir | Ambos |

Son tan parecidas a `cin`/`cout` que puedes usar los mismos operadores `<<` y `>>`. De
hecho, podés pensar en `ifstream` como un `cin` que en vez de leer del teclado, lee de un
archivo:

```cpp
#include <iostream>
#include <fstream>
using namespace std;

int main() {
    // Escribir un archivo
    ofstream archivo("notas.txt");
    archivo << "Matemáticas: 9.5" << endl;
    archivo << "Física: 8.0" << endl;
    archivo.close(); // Cerramos (RAII también lo haría solo)

    cout << "Archivo creado" << endl;
    return 0;
}
```

::: tip
💡 Al igual que los punteros inteligentes, `ofstream` aplica RAII: si olvidas `close()`, el archivo se cierra igual cuando el objeto muera. Pero cerrar explícitamente es buena práctica para liberar antes el recurso.
:::

## 2. Leer un archivo

Para leer, creamos un `ifstream` y, muy importante, comprobamos que se abrió correctamente.
Un archivo puede no existir, estar bloqueado o no tener permisos, y no queremos que el
programa falle en silencio:

```cpp
#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main() {
    ifstream archivo("notas.txt");

    // Comprobamos que el archivo exista y se haya abierto
    if (!archivo.is_open()) {
        cerr << "No se pudo abrir el archivo" << endl;
        return 1;
    }

    string linea;
    while (getline(archivo, linea)) {
        cout << linea << endl;
    }

    archivo.close();
    return 0;
}
```

::: warning Advertencia
⚠️ Siempre comprueba con `is_open()` (o `if (!archivo)`) antes de leer o escribir. Intentar operar sobre un archivo que no se abrió es uno de los errores más comunes con archivos.
:::

## 3. Modos de apertura

Al abrir un `ofstream`, puedes elegir el comportamiento con **modos** (flags). La
diferencia más importante que tenés que conocer es la que existe entre añadir y
sobrescribir:

| Modo | Efecto |
|---|---|
| `ios::out` | Modo escritura (por defecto en `ofstream`) |
| `ios::app` | **Añadir** al final (no sobrescribir) |
| `ios::trunc` | Borrar el contenido previo (por defecto) |
| `ios::in` | Modo lectura (por defecto en `ifstream`) |
| `ios::binary` | Abrir en modo binario |

```cpp
#include <iostream>
#include <fstream>
using namespace std;

int main() {
    // Modo append: añade sin borrar lo anterior
    ofstream archivo("registro.txt", ios::app);

    archivo << "Nueva línea de registro" << endl;

    archivo.close();
    cout << "Línea añadida" << endl;

    return 0;
}
```

::: info Nota
ℹ️ Sin `ios::app`, cada vez que abres un `ofstream` se **borra** el contenido anterior. Esa es la diferencia entre crear un registro acumulativo y sobrescribir.
:::

## 4. Ejemplo completo: Una agenda simple

Veamos un ejemplo que integra escritura y lectura con estructuras, uniendo todo lo que
vimos hasta acá. Vamos a guardar contactos y luego leerlos de vuelta:

```cpp
#include <iostream>
#include <fstream>
#include <string>
using namespace std;

struct Contacto {
    string nombre;
    int telefono;
};

int main() {
    // Guardar contactos
    {
        ofstream archivo("agenda.txt");
        Contacto contactos[] = {
            {"Ana", 5551234},
            {"Carlos", 5555678},
            {"María", 5559012}
        };

        for (const auto &c : contactos) {
            archivo << c.nombre << " " << c.telefono << endl;
        }
    } // El archivo se cierra aquí (RAII)

    // Leer contactos
    ifstream archivo("agenda.txt");
    if (!archivo.is_open()) {
        cerr << "No se pudo abrir la agenda" << endl;
        return 1;
    }

    Contacto c;
    cout << "Contactos guardados:\n";
    while (archivo >> c.nombre >> c.telefono) {
        cout << "  " << c.nombre << " -> " << c.telefono << endl;
    }

    return 0;
}
```

::: warning Advertencia
⚠️ Este formato "separado por espacios" es simple, pero frágil: si un nombre tuviera espacios, se rompería. Para datos complejos, veremos la **serialización** en un capítulo próximo.
:::

## 5. ¿Existe el archivo? Comprobar y eliminar

A veces necesitás saber si un archivo existe antes de hacer algo con él, o eliminarlo cuando
ya no hace falta. La biblioteca estándar ofrece utilidades para gestionar archivos en
`<filesystem>` (disponible desde C++17):

```cpp
#include <iostream>
#include <filesystem>
using namespace std;
namespace fs = filesystem;

int main() {
    string nombre = "notas.txt";

    if (fs::exists(nombre)) {
        cout << "El archivo existe, tamaño: " << fs::file_size(nombre) << " bytes" << endl;
    } else {
        cout << "El archivo no existe" << endl;
    }

    // Eliminar un archivo
    fs::remove(nombre);

    return 0;
}
```

::: tip
💡 `<filesystem>` permite crear carpetas (`create_directory`), copiar (`copy`), renombrar (`rename`) y recorrer directorios. Es muy útil en programas reales.
:::

## 6. Errores comunes con archivos

1. **Olvidar comprobar si se abrió** → operaciones sobre archivo inexistente.
2. **No cerrar** → en Windows puede impedir que otros programas accedan al archivo.
3. **Usar `ios::out` en vez de `ios::app`** → borrar datos sin querer.
4. **Leer con `>>` nombres con espacios** → datos cortados.
5. **Ignorar los errores de escritura** → disco lleno o permisos.

## 7. Buenas prácticas

- Comprueba siempre `is_open()` antes de operar.
- Usa `ios::app` cuando quieras añadir sin borrar.
- Prefiere `getline` para texto libre y `>>` para datos estructurados.
- Cierra los archivos al terminar (aunque RAII lo haga solo).
- Gestiona los errores con excepciones si tu proyecto lo permite.

## 8. Resumen rápido

- `ifstream` lee, `ofstream` escribe, `fstream` hace ambas.
- Los archivos usan los mismos operadores `<<` y `>>` que `cin`/`cout`.
- `is_open()` verifica que el archivo se haya abierto.
- `ios::app` añade al final; sin él se sobrescribe.
- `<filesystem>` (C++17) gestiona archivos y carpetas.
- Los archivos son flujos: todo lo de consola aplica aquí.

Leer y escribir archivos de texto es fundamental, y ahora tus datos ya pueden sobrevivir a
un reinicio. En el siguiente capítulo veremos cómo **controlar el formato** de lo que
escribimos: números, alineación y precisión.