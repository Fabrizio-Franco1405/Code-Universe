---
outline: [2, 3]
---

# JSON y XML

En el capítulo anterior serializábamos datos con formatos propios, con nuestros propios
separadores y estructuras. Pero en el mundo real existe una estandarización: **JSON** y
**XML** son los formatos de intercambio de datos más usados. Cuando una API de internet te
devuelve información, o cuando una aplicación guarda su configuración, casi seguro es JSON
o XML.

En este capítulo aprenderás a leerlos y escribirlos en C++.

## 1. ¿Qué es JSON?

**JSON** (*JavaScript Object Notation*) es un formato de texto ligero para intercambiar
datos. Se lee fácilmente tanto por humanos como por máquinas, y es el estándar de facto en
las APIs modernas. A pesar de que nació en el mundo de JavaScript, hoy es un lenguaje
neutro que cualquier lenguaje puede usar.

**Ejemplo de JSON:**

```json
{
  "nombre": "Ana",
  "edad": 25,
  "activo": true,
  "hobbies": ["leer", "nadar", "programar"],
  "direccion": {
    "ciudad": "Madrid",
    "codigo": "28001"
  }
}
```

Los tipos de datos de JSON:

| Tipo | Ejemplo |
|---|---|
| Objeto | `{ "clave": valor }` |
| Arreglo | `[1, 2, 3]` |
| Cadena | `"texto"` |
| Número | `42`, `3.14` |
| Booleano | `true` / `false` |
| Nulo | `null` |

## 2. ¿Qué es XML?

**XML** (*eXtensible Markup Language*) es otro formato de texto estructurado, más antiguo y
verboso. Usa **etiquetas** para marcar los datos, de la misma manera que HTML marca una
página web. "Extensible" significa que vos mismo definís las etiquetas que necesitás:

**Ejemplo de XML:**

```xml
<persona>
    <nombre>Ana</nombre>
    <edad>25</edad>
    <activo>true</activo>
    <hobbies>
        <hobby>leer</hobby>
        <hobby>nadar</hobby>
        <hobby>programar</hobby>
    </hobbies>
    <direccion ciudad="Madrid" codigo="28001" />
</persona>
```

## 3. Comparación: JSON vs XML

| Característica | JSON | XML |
|---|---|---|
| Legibilidad | Muy legible | Más verboso |
| Tamaño | Compacto | Pesado (etiquetas repetidas) |
| Tipos de datos | Tiene (número, bool...) | Todo es texto |
| Uso moderno | APIs, configuraciones | Documentos, configuraciones antiguas |
| Popularidad hoy | Estándar dominante | En declive, pero presente |

::: info Nota
ℹ️ Para APIs y datos estructurados, JSON es la elección moderna. XML sigue vivo en documentos, algunos sistemas empresariales y formatos como SVG o RSS.
:::

## 4. Trabajar con JSON en C++

La biblioteca **nlohmann/json** es la más popular. Con ella, leer y escribir JSON es casi
como usar objetos normales, sin tener que parsear nada a mano.

### 4.1 Construir y escribir JSON

```cpp
#include <iostream>
#include <fstream>
#include "json.hpp" // Biblioteca nlohmann/json
using namespace std;
using json = nlohmann::json;

int main() {
    json persona;
    persona["nombre"] = "Ana";
    persona["edad"] = 25;
    persona["activo"] = true;
    persona["hobbies"] = {"leer", "nadar", "programar"};
    persona["direccion"] = {{"ciudad", "Madrid"}, {"codigo", "28001"}};

    // Escribir a archivo (con indentado de 4 espacios)
    ofstream archivo("persona.json");
    archivo << persona.dump(4);

    cout << persona.dump(2) << endl; // Mostrar en consola

    return 0;
}
```

### 4.2 Leer y acceder a JSON

```cpp
#include <iostream>
#include <fstream>
#include "json.hpp"
using namespace std;
using json = nlohmann::json;

int main() {
    ifstream archivo("persona.json");
    json persona;
    archivo >> persona; // Deserializamos

    // Acceder a los valores
    string nombre = persona["nombre"];
    int edad = persona["edad"];
    bool activo = persona["activo"];

    cout << nombre << ", " << edad << " años, activo: " << activo << endl;

    // Recorrer un arreglo
    for (const auto &hobby : persona["hobbies"]) {
        cout << "  Hobby: " << hobby << endl;
    }

    // Acceder a objetos anidados
    cout << "Ciudad: " << persona["direccion"]["ciudad"] << endl;

    return 0;
}
```

::: tip
💡 Con `persona["clave"]` puedes leer y escribir valores, recorrer arreglos y anidar objetos. Es como tener un diccionario muy poderoso.
:::

## 5. JSON con objetos propios

Puedes enseñarle a tu estructura a convertirse a JSON con funciones `to_json` y
`from_json`. Así, tus propios tipos de datos hablan JSON con fluidez:

```cpp
#include <iostream>
#include "json.hpp"
using namespace std;
using json = nlohmann::json;

struct Producto {
    string nombre;
    double precio;
    int stock;

    // De Producto a JSON
    void to_json(json &j) const {
        j = json{{"nombre", nombre}, {"precio", precio}, {"stock", stock}};
    }

    // De JSON a Producto
    static Producto from_json(const json &j) {
        Producto p;
        j.at("nombre").get_to(p.nombre);
        j.at("precio").get_to(p.precio);
        j.at("stock").get_to(p.stock);
        return p;
    }
};

int main() {
    Producto p = {"Teclado", 49.99, 120};

    json j;
    p.to_json(j);
    cout << j.dump(2) << endl;

    Producto recuperado = Producto::from_json(j);
    cout << "Recuperado: " << recuperado.nombre << endl;

    return 0;
}
```

## 6. Trabajar con XML en C++

Para XML existen varias bibliotecas. **tinyxml2** es una de las más usadas por su sencillez.
Acá lo vemos recorriendo el documento con sus funciones `FirstChildElement`:

```cpp
#include <iostream>
#include "tinyxml2.h"
using namespace tinyxml2;

int main() {
    XMLDocument doc;
    doc.LoadFile("persona.xml");

    // Buscar el elemento <nombre>
    XMLElement *nombre = doc.FirstChildElement("persona")
                            ->FirstChildElement("nombre");

    if (nombre != nullptr) {
        cout << "Nombre: " << nombre->GetText() << endl;
    }

    // Leer atributos
    XMLElement *direccion = doc.FirstChildElement("persona")
                                ->FirstChildElement("direccion");
    cout << "Ciudad: " << direccion->Attribute("ciudad") << endl;

    return 0;
}
```

::: warning Advertencia
⚠️ XML es mucho más verboso y su manipulación es más manual que la de JSON. Salvo que necesites un formato XML concreto, JSON te dará más productividad.
:::

## 7. Elegir la biblioteca

| Necesidad | Biblioteca recomendada |
|---|---|
| JSON general (C++) | nlohmann/json |
| XML general | tinyxml2, pugixml |
| Configuraciones simples | JSON con nlohmann |
| Documentos XML complejos | pugixml (rápida) |

## 8. Buenas prácticas

- Usa **JSON** para APIs y datos estructurados modernos.
- Valida el JSON/XML al leerlo (un archivo puede estar corrupto o incompleto).
- Usa `at("clave")` en lugar de `["clave"]` cuando quieras lanzar error si falta la clave.
- Mantén los archivos de datos pequeños y bien indentados.

## 9. Resumen rápido

- **JSON** es ligero, legible y el estándar de las APIs modernas.
- **XML** es verboso y usado en documentos y sistemas antiguos.
- JSON maneja objetos, arreglos, números, booleanos y nulos.
- La biblioteca **nlohmann/json** facilita leer/escribir JSON.
- Con `to_json`/`from_json` integras tus propios objetos.
- tinyxml2 y pugixml son opciones para XML.

JSON y XML te permiten intercambiar datos con el mundo exterior usando formatos estándar
que cualquier otro programa entiende. En el siguiente capítulo veremos la **entrada/salida
asíncrona**, para que las operaciones de E/S no bloqueen a tu programa mientras trabaja.