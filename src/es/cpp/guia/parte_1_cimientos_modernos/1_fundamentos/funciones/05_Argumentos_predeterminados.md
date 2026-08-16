---
outline: [2, 3]
---

# Argumentos predeterminados en C++

A veces quieres que una función funcione bien incluso si el que la llama no le pasa
todos los datos. Los **argumentos predeterminados** permiten asignar un valor por
defecto a los parámetros de una función. Si el argumento no se pasa al llamar a la
función, se usará el valor definido por defecto. Piénsalo como el café de una máquina
expendedora: si no eliges nada, te da el sabor estándar, pero siempre puedes
personalizarlo.

## 1. Sintaxis básica

```cpp
#include <iostream>
using namespace std;

void saludar(string nombre = "Usuario") {
    cout << "Hola, " << nombre << "!" << endl;
}

int main() {
    saludar();           // Usa el valor por defecto -> "Hola, Usuario!"
    saludar("Fabrizio"); // Usa el valor pasado -> "Hola, Fabrizio!"
}
```

## 2. Reglas importantes

1. Los **argumentos predeterminados siempre van al final** de la lista de parámetros.
```cpp
void mostrar(int x, int y = 10); // ✅ correcto
void mostrar(int x = 10, int y); // ❌ incorrecto [!code error]
```

2. Se pueden combinar parámetros obligatorios con opcionales:
```cpp
void mostrarMensaje(string texto, int repeticiones = 1);
```

3. Los valores por defecto se **especifican en la declaración de la función**, no en la definición:
```cpp
// Declaración (en el .h)
void imprimir(int x = 42);

// Definición (en el .cpp)
void imprimir(int x) {
    cout << x << endl;
}
```

## 3. Ejemplo práctico: Cálculo de intereses

Veamos cómo los argumentos predeterminados facilitan el uso de una función financiera
sin necesidad de múltiples sobrecargas. Una sola función se adapta a distintos
niveles de detalle según lo que el usuario quiera especificar.

```cpp
#include <iostream>
using namespace std;

// Función con argumentos predeterminados
double calcularInteres(double capital, double tasa = 0.05, int años = 1) {
    return capital * (1 + tasa * años);
}

int main() {
    cout << calcularInteres(1000) << endl;          // Solo capital (tasa 5%, 1 año)
    cout << calcularInteres(1000, 0.07) << endl;    // Capital y tasa (7%, 1 año)
    cout << calcularInteres(1000, 0.07, 3) << endl; // Capital, tasa y años
}
```

**Explicación paso a paso**

1. La función `calcularInteres` recibe tres parámetros:

- `capital` (obligatorio).
- `tasa` (opcional, por defecto 5%).
- `años` (opcional, por defecto 1).

2. Al llamar a la función:

- `calcularInteres(1000)` usa los valores por defecto → tasa 5%, 1 año.
- `calcularInteres(1000, 0.07)` sustituye la tasa pero mantiene años por defecto.
- `calcularInteres(1000, 0.07, 3)` reemplaza todos los valores.

**Salida esperada**

```
1050
1070
1155
```

## 4. Combinando con sobrecarga de funciones

En algunos casos, los **argumentos predeterminados** pueden parecer similares a la
sobrecarga de funciones. Ambos sirven para manejar llamadas con distintos parámetros,
pero hay diferencias. La pregunta clave es: ¿la lógica cambia mucho entre versiones?

**Con sobrecarga:**
```cpp
void mostrar(int x) { cout << x << endl; }
void mostrar() { cout << 0 << endl; }
```

**Con argumentos predeterminados:**
```cpp
void mostrar(int x = 0) { cout << x << endl; }
```

::: tip
💡 Si la lógica es la misma, los argumentos predeterminados son más simples. Si el
comportamiento cambia mucho, conviene usar sobrecarga.
:::

## 5. Resumen rápido

- Se usan para **reducir código repetido** y dar **flexibilidad**.
- Siempre deben colocarse **al final de la lista de parámetros**.
- Es preferible declararlos en el archivo de cabecera (`.h`) y definir la función en el `.cpp`.
- Evitan la necesidad de múltiples sobrecargas simples.

Con los argumentos predeterminados tus funciones ya pueden ser flexibles sin complicar
su uso. En el siguiente capítulo hablaremos de las **funciones `inline`**, una
herramienta pensada para mejorar el rendimiento en funciones pequeñas.