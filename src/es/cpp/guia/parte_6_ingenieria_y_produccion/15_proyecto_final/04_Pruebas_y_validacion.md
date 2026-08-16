---
outline: [2, 3]
---

# Pruebas y validación

El código compila y el menú funciona. Pero un proyecto profesional **no se entrega
sin pruebas**: hay que verificar que cada función hace lo que promete, incluso en
los casos raros, en los bordes, cuando las cosas salen mal. Las pruebas son la red
de seguridad que te permite refactorizar sin miedo: cambiar código sabiendo que, si
algo se rompe, la red te va a avisar.

Imagina un puente: nadie lo inaugura sin antes probarlo con carga. Tu código es el
puente, y las pruebas son las cargas que le pasamos por encima una y otra vez para
confirmar que aguanta. Construir un puente sin probarlo sería una irresponsabilidad;
entregar código sin probarlo, también.

## 1. Por qué probar el inventario

Puede parecer tentador saltarse las pruebas: "el menú ya funciona, lo probé a mano".
El problema es que las pruebas manuales solo cubren el camino feliz, y además las
haces una sola vez. Las pruebas automáticas, en cambio, viven con el proyecto:

- **Detectan errores al instante** (no días después).
- **Documentan** el comportamiento esperado.
- **Permiten refactorizar** con confianza.
- **Validan casos límite** que el menú manual nunca tocaría.

Piénsalo así: cada test que escribes es un pequeño contrato que le firmas a tu
código. Cuando cambies algo meses después, el test te dirá si seguís cumpliendo el
contrato o si lo rompiste sin darte cuenta.

## 2. El framework de test

Para escribir las pruebas usaremos **doctest**, una librería *header-only* (de las
que vimos cuando hablamos de header-only vs compiladas): un solo archivo de cabecera
y listo. No hay que instalar ni compilar librerías complejas; simplemente incluyes
el header y empiezas a escribir tus tests.

```cmake
# tests/CMakeLists.txt
add_executable(test_inventario test_inventario.cpp)

# Include path de doctest
target_include_directories(test_inventario PRIVATE ${CMAKE_CURRENT_SOURCE_DIR})

# Enlaza con los mismos .cpp que el ejecutable
target_sources(test_inventario PRIVATE
    ${CMAKE_SOURCE_DIR}/src/producto.cpp
    ${CMAKE_SOURCE_DIR}/src/inventario.cpp
)
```

Fíjate en la última parte: el test no reimplementa nada. **Enlaza los mismos
`.cpp`** que usa el ejecutable, así probamos el código real del proyecto y no una
copia de él.

::: tip
💡 doctest y Catch2 son los frameworks de test más populares en C++. Ambos son
header-only: un `#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN` y tienes tu propio
`main` de tests.
:::

## 3. El primer test: añadir productos

Empecemos por lo más básico: que agregar productos funcione. Un test típico tiene
tres fases: **preparar** el escenario, **ejecutar** la acción y **verificar** el
resultado con las macros `CHECK` y `REQUIRE`.

```cpp
// tests/test_inventario.cpp
#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include <doctest/doctest.h>
#include "inventario/inventario.hpp"
using namespace inventario;

TEST_CASE("Añadir productos al inventario") {
    Inventario inv;

    inv.agregar("Laptop", Categoria::Electronica, 5, 899.99);
    inv.agregar("Silla", Categoria::Hogar, 10, 79.50);

    CHECK(inv.tamano() == 2);

    // Los IDs se asignan automáticamente
    auto buscado = inv.buscarPorId(1);
    REQUIRE(buscado.has_value());
    CHECK((*buscado)->nombre == "Laptop");
}
```

La diferencia entre `CHECK` y `REQUIRE` es importante: `CHECK` registra el fallo y
continúa con el resto del test; `REQUIRE` detiene el test en el momento en que
falla. Acá usamos `REQUIRE` para asegurarnos de que el producto existe antes de
intentar mirar sus campos; si no existiera, el resto no tendría sentido.

```
[doctest] test cases:  1 |  1 passed | 0 failed
[doctest] assertions:  2 |  2 passed | 0 failed
```

## 4. Tests de eliminación y modificación

Continuamos cubriendo el CRUD completo. Ahora le toca a **eliminar** y a
**modificar**. Fíjate que acá ya aparecen los casos límite: intentamos eliminar un
ID que no existe y esperamos que devuelva `false`.

```cpp
TEST_CASE("Eliminar productos") {
    Inventario inv;
    inv.agregar("A", Categoria::Otro, 1, 10.0);
    inv.agregar("B", Categoria::Otro, 1, 20.0);

    CHECK(inv.eliminar(1) == true);
    CHECK(inv.tamano() == 1);
    CHECK(inv.eliminar(99) == false); // No existe
}

TEST_CASE("Modificar cantidad y precio") {
    Inventario inv;
    inv.agregar("Teclado", Categoria::Electronica, 3, 45.0);

    CHECK(inv.modificarCantidad(1, 7) == true);
    CHECK(inv.modificarPrecio(1, 55.0) == true);

    auto p = inv.buscarPorId(1);
    REQUIRE(p.has_value());
    CHECK((*p)->cantidad == 7);
    CHECK((*p)->precio == doctest::Approx(55.0));

    CHECK(inv.modificarCantidad(999, 1) == false); // No existe
}
```

::: info Nota
ℹ️ `doctest::Approx` compara dobles con tolerancia (por qué es peligroso `==` con
`double`). Úsalo siempre con precios y valores decimales.
:::

## 5. Tests de búsquedas y filtros

Ahora las búsquedas. Acá hay un detalle fino que los tests capturan a la perfección:
`buscarPorNombre("La")` no busca la palabra exacta, sino que encuentra cualquier
producto cuyo nombre **contenga** "La". Eso explica por qué el resultado incluye
tanto "Laptop" como "Lápiz".

```cpp
TEST_CASE("Búsqueda por nombre (parcial)") {
    Inventario inv;
    inv.agregar("Laptop", Categoria::Electronica, 5, 900);
    inv.agregar("Lápiz", Categoria::Hogar, 20, 1);
    inv.agregar("Silla", Categoria::Hogar, 10, 80);

    auto resultado = inv.buscarPorNombre("La");
    CHECK(resultado.size() == 2); // Laptop y Lápiz
}
```

```cpp
TEST_CASE("Filtro por categoría") {
    Inventario inv;
    inv.agregar("A", Categoria::Electronica, 1, 10);
    inv.agregar("B", Categoria::Hogar, 1, 20);
    inv.agregar("C", Categoria::Electronica, 1, 30);

    auto electronica = inv.filtrarPorCategoria(Categoria::Electronica);
    CHECK(electronica.size() == 2);

    auto hogar = inv.filtrarPorCategoria(Categoria::Hogar);
    CHECK(hogar.size() == 1);
}
```

## 6. Tests de reportes

Los reportes tienen una particularidad: mezclan cálculos (el valor total) con
ordenamientos (los más caros). Los tests nos permiten verificar que cada número
salga exactamente como esperamos, y el comentario de cada línea nos recuerda el
valor esperado mientras leemos.

```cpp
TEST_CASE("Reportes del inventario") {
    Inventario inv;
    inv.agregar("A", Categoria::Otro, 2, 10.0);   // valor 20
    inv.agregar("B", Categoria::Otro, 0, 100.0);  // agotado
    inv.agregar("C", Categoria::Otro, 3, 50.0);   // valor 150

    CHECK(inv.valorTotal() == doctest::Approx(170.0));

    auto agotados = inv.agotados();
    REQUIRE(agotados.size() == 1);
    CHECK(agotados[0].nombre == "B");

    auto caros = inv.masCaros(2);
    REQUIRE(caros.size() == 2);
    CHECK(caros[0].nombre == "B");   // 100
    CHECK(caros[1].nombre == "C");   // 50
}
```

Observa el test de `masCaros`: no solo verificamos el tamaño, también el **orden**.
Un test que solo revisara cuántos productos devuelve podría pasar aunque el
ordenamiento estuviera roto. Los buenos tests verifican el comportamiento completo.

## 7. Pruebas de la persistencia

La persistencia merece su propio tipo de test, un **test de ida y vuelta**: guardamos
el inventario, lo cargamos en una instancia nueva y comprobamos que todo quedó igual.
Si guardar y cargar no son coherentes entre sí, este test lo descubre al instante.

```cpp
#include <fstream>
#include <filesystem>

TEST_CASE("Guardar y cargar inventario") {
    Inventario inv;
    inv.agregar("A", Categoria::Electronica, 5, 99.99);
    inv.agregar("B", Categoria::Hogar, 0, 12.5);

    const std::string archivo = "inventario_test.json";
    inv.guardar(archivo);

    Inventario cargado;
    cargado.cargar(archivo);

    CHECK(cargado.tamano() == 2);

    auto a = cargado.buscarPorNombre("A");
    REQUIRE(a.size() == 1);
    CHECK(a[0].precio == doctest::Approx(99.99));

    std::filesystem::remove(archivo); // Limpieza del test
}
```

::: tip
💡 Los tests de persistencia usan un archivo temporal y lo borran al final: así
son reproducibles y no ensucian el repositorio.
:::

## 8. Ejecutar los tests

Con todos los tests escritos, ¿cómo los corremos? Gracias a CMake y CTest, todo se
reduce a un par de comandos. Primero configuramos el build con las pruebas activadas
y luego las ejecutamos con `ctest`:

```bash
cmake -B build -S . -DBUILD_TESTING=ON
cmake --build build
ctest --test-dir build --output-on-failure
```

O directamente:

```bash
./build/tests/test_inventario
```

```
[doctest] run with "--help" for options
===============================================================================
test cases:  6 |  6 passed | 0 failed | 0 skipped
assertions: 25 | 25 passed | 0 failed | 0 skipped
```

Ese reporte es oro puro: te dice exactamente cuántos tests hay, cuántos pasaron y
cuántos fallaron. Con `ctest` además tienes un formato estándar que después podrás
integrar en cualquier herramienta de CI.

## 9. El checklist de validación final

| Aspecto | Verificación |
|---|---|
| CRUD | Tests de añadir/eliminar/modificar |
| Búsquedas | Tests de nombre y filtros |
| Reportes | Tests de valor total, agotados, caros |
| Persistencia | Guardar → cargar → igualdad |
| Casos límite | IDs inexistentes, inventario vacío |
| Build | `cmake --build build` desde cero |

## 10. Buenas prácticas

- Prueba **cada función pública** de `Inventario`.
- Cubre los **casos límite**: no existe el ID, lista vacía, `double`.
- Usa `Approx` para decimales.
- Mantén los tests **independientes** entre sí.
- Los tests deben pasar con `ctest` en CI.

## 11. Resumen rápido

- **doctest** (header-only) es un framework de test sencillo.
- Prueba el CRUD, búsquedas, filtros y reportes.
- Usa `Approx` para comparar `double`.
- Persistencia: guardar → cargar → comprobar igualdad.
- Ejecuta con `ctest` y en CI.
- Cubre los casos límite, no solo el camino feliz.

Las pruebas pasan, y eso nos da una tranquilidad enorme: el código hace lo que
promete. En el siguiente capítulo cerraremos el proyecto con su **documentación**
y, en el último, con el **despliegue**.