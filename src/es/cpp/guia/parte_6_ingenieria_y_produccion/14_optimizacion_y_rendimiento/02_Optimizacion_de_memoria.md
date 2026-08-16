---
outline: [2, 3]
---

# Optimización de memoria

La memoria es el recurso más valioso de tu programa: **cuánta** usa y **cómo la usa** influye directamente en la velocidad. El acceso a memoria es millones de veces más lento que el CPU, así que un código que toca mucha memoria desperdiciada será lento aunque el CPU vaya rápido.

Imagina una cocina: si cada ingrediente está en un almacén lejano, el chef pasa todo el día yendo y viniendo. La optimización de memoria es acercar los ingredientes y usarlos bien.

## 1. La jerarquía de memoria

Tu CPU no accede a toda la memoria a la misma velocidad. Existe una jerarquía:

```
Registros (nanosegundos)
   │
Caché L1/L2/L3 (nanosegundos)
   │
RAM (decenas de nanosegundos)
   │
Disco (milisegundos: ¡millones de veces más lento!)
```

La clave: **los datos que se usan juntos deben estar juntos** (localidad), para que la caché los encuentre.

## 2. Localidad de referencia

El CPU carga bloques de memoria a la caché en trozos (líneas de caché). Recorrer datos **contiguos** aprovecha la caché; saltar por datos dispersos no.

```cpp
// BUENA localidad: acceso secuencial y contiguo
vector<int> datos(1'000'000);
long long suma = 0;
for (int i = 0; i < datos.size(); i++) {
    suma += datos[i]; // Recorre de forma contigua
}
```

```cpp
// MALA localidad: saltos impredecibles
unordered_map<int, int> datos; // Nodos dispersos en memoria
long long suma = 0;
for (auto &[k, v] : datos) {
    suma += v; // Cada salto puede fallar la caché
}
```

::: tip
💡 Por eso `vector` (contiguo) suele ganar a `list` (nodos dispersos) incluso en operaciones que teóricamente favorecen a `list`: la localidad hace milagros.
:::

## 3. Minimizar asignaciones dinámicas

Cada `new`/`malloc` cuesta tiempo y fragmenta la memoria. Cuantas menos asignaciones, mejor.

```cpp
// Malo: una asignación por elemento
vector<string> nombres;
for (int i = 0; i < 1000; i++) {
    nombres.push_back("nombre_" + to_string(i)); // Asigna cada vez
}

// Mejor: reservar de antemano
vector<string> nombres;
nombres.reserve(1000); // Una sola asignación grande
for (int i = 0; i < 1000; i++) {
    nombres.push_back("nombre_" + to_string(i)); // Sin reasignar
}
```

::: info Nota
ℹ️ `reserve()` prepara capacidad sin reasignar en cada push. Un `vector` que crece de 0 a N hace **log N reasignaciones**; con `reserve`, cero.
:::

## 4. Evitar copias innecesarias

Las copias de objetos grandes son carísimas. El C++ moderno da herramientas para evitarlas:

```cpp
// Malo: copia del string al pasar y al devolver
string procesar(string texto) {
    string resultado = texto;
    resultado += "!";
    return resultado;
}

// Bien: pasar por const&, devolver por movimiento
string procesar(const string &texto) {
    string resultado = texto;
    resultado += "!";
    return resultado; // NRVO/move: sin copia
}

string s = procesar("hola"); // Sin copias innecesarias
```

| Técnica | Efecto |
|---|---|
| `const T&` en parámetros | Evita copia al entrar |
| Retorno por valor | El compilador usa NRVO o movimiento |
| `std::move` | Mueve en lugar de copiar |
| `std::string_view` | Lee sin copiar |
| Emplacement (`emplace_back`) | Construye in-situ sin temporal |

```cpp
// emplace_back construye dentro del vector, sin copias temporales
struct Punto { int x, y; Punto(int a, int b) : x(a), y(b) {} };

vector<Punto> pts;
pts.emplace_back(3, 4); // Sin Punto temporal
// pts.push_back(Punto(3, 4)); // Antes: crea y copia
```

## 5. Estructuras de datos y caché

El tamaño de tus objetos también importa. Objetos **compactos** caben más en la caché:

```cpp
// 16 bytes por elemento (doble por alineación/relleno)
struct UsuarioClasico {
    int id;
    char activo; // 1 byte... pero el struct ocupa más por relleno
    int nivel;
};

// Comprimamos: agrupa los campos por tamaño
struct UsuarioCompacto {
    int id;
    int nivel;
    char activo;
};
```

::: tip
💡 Ordenar los campos de mayor a menor tamaño reduce el **relleno** (padding). Menos bytes por objeto = más objetos en caché = acceso más rápido.
:::

## 6. SoA vs AoS: el truco del rendimiento

Cuando trabajas con muchos objetos con varios campos, la disposición **SoA** (Structure of Arrays) suele vencer a la **AoS** (Array of Structures):

```cpp
// AoS: los campos se intercalan
struct Particula { float x, y, z, vx, vy, vz; };
vector<Particula> particulas; // x y z vx vy vz x y z vx...

// SoA: cada campo en su propio array
struct Particulas {
    vector<float> x, y, z, vx, vy, vz;
};
// Recorrer solo x accede a memoria contigua
```

```cpp
// Con SoA, actualizar solo las posiciones toca solo 3 arrays
void mover(Particulas &p) {
    for (size_t i = 0; i < p.x.size(); i++) {
        p.x[i] += p.vx[i];
        p.y[i] += p.vy[i];
        p.z[i] += p.vz[i];
    }
}
```

::: info Nota
ℹ️ SoA es el secreto del rendimiento en simulaciones, juegos y computación científica: aprovecha al máximo la caché cuando se procesa un campo a la vez.
:::

## 7. Buenas prácticas

- Mantén los datos **contiguos** (vector > list en la práctica).
- `reserve()` antes de llenar contenedores.
- Evita copias: `const&`, `move`, `emplace_back`, `string_view`.
- Compacta tus structs (ordena por tamaño, evita padding).
- Considera **SoA** para grandes volúmenes de datos.
- Mide con perfiladores de caché antes de optimizar a ciegas.

## 8. Resumen rápido

- La caché es mucho más rápida que la RAM: busca **localidad**.
- `vector` contiguo aprovecha la caché; estructuras dispersas no.
- Cada asignación dinámica cuesta: `reserve()` de antemano.
- Las copias son caras: `const&`, `move`, emplacement.
- Compactar structs (menos padding) mejora la caché.
- **SoA** gana en grandes volúmenes de datos procesados por campo.

La memoria es la mitad de la batalla. En el siguiente capítulo atacaremos el **CPU**: cómo conseguir que cada instrucción cuente.
