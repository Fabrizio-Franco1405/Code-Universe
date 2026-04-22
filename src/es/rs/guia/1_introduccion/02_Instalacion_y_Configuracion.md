---
outline: [2, 3]
---

# Instalación y configuración

En este apartado aprenderás a instalar **Rust** en tu computadora de forma rápida y sencilla, A continuación, exploraremos diferentes métodos de instalación; si ya tienes experiencia, puedes elegir el que mejor se adapte a tu flujo de trabajo, pero si es tu primera vez, te recomendamos seguir los pasos detalladamente para asegurar una configuración exitosa.

## Instalación del compilador

Para poder instalar Rust utilizaremos una Herramienta de Línea de Comandos llamada `rustup`. Esta no es más que la herramienta oficial para poder instalar y gestionar sus diferentes versiones o herramientas asociadas.

:::info ℹ️ Nota
Si por alguna razón no quieres instalar de esta manera más adelante te mostraremos otras formas para hacerlo.
:::

### Windows (Rustup / WSL)

Para los usuarios de Windows la instalación puede realizarse de dos maneras: 

#### Usando Rustup

1. Acá debes seleccionar la opción que coincida con la arquitectura de tu procesador, en este caso asumiremos que tienes uno de 64 bits.
![Instalador-Rustup](/rs/introduccion/rs-instalando-rustup.png)

2. Luego de ejecutar el instalador saldrá este menú con varias opciones de instalación, si no quieres complicarte mcuho solo presiona `Enter` y el instalará automáticamente las cosas necesarias de forma automática.
![Instalando-Rustup](/rs/introduccion/rs-instalando-rustup-2.png)

:::info ℹ️ Nota
Es probable que al momento de instalar notes que hay un error por falta de Componentes de C++, en ese caso debes instalar el IDE Visual Studio con las herramientas de Desarrollo de C++ o en su defecto instalar únicamente el [Kit de Desarrollo de C++](https://visualstudio.microsoft.com/es/visual-cpp-build-tools/)
:::

3. Una vez instalado todo correctamente solo debes presionar `Enter` y se cerrará el cmd automáticamente.
![Instalando-Rustup](/rs/introduccion/rs-instalando-rustup-3.png)

4. Para verificar que versiones tenemos instaladas debemos ejecutar en la terminal:
```bash
rustc --version
cargo --version
```

- Usamos `rustc` para conocer la versión de Rust instalada.
- También usamos `cargo` para conocer la versión del compilador.

#### Usando WSL

Sí por otra parte estás trabajando con VM o algún tipo de virtualización que requiera instalarlo por `WSL` entonces puedes ejecutar lo siguiente en la terminal:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Linux / MacOS

Si estás usando Linux o macOS el proceso es incluso mucho más rápido.

1. Muchas librerias de rust dependen de un enlazador que rust utiliza para para unir sus compilados en un mismo archivo, por lo que deberás instalar un compilador de C para evitar estos errores.

    - En el caso de Linux:
    ```bash
    sudo apt update && sudo apt install build-essential
    ```

    - En el caso de macOS: 
    ```bash
    xcode-select --install
    ```

2. Una vez tengas el compilador de `C` instalado abre tu terminal y ejecuta el siguiente comando:
```bash
$ curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

3. Cuando haya terminado la instalación deberías poder ver el siguiente texto en la terminal:
```
Rust is installed now. Great!
```

## Configuración con diferentes entornos

Rust es un lenguaje ampliamente utilizado en diversos entornos por lo que a día de hoy podrás usar casi cualquier herramienta de desarrollo que más desees, en esta guía te enseñaremos algunos de los más comunes.

### Usando VS Code

Visual Studio Code es un editor moderno, muy usado por principiantes y profesionales gracias a su sencillez y la enorme cantidad de recursos que puedes encontrar en guías, documentaciones, turoriales y mucho más, además gran parte de los ejemplos que veas en ésta página es muy probable que estén en VS Code. 

#### Instalación de extensiones

Primero debemos instalar la extensión oficial llamada `rust-analyzer` que se encarga d brindarnos soporte para el lenguaje, como resaltado de sintaxis, snippets entre otras cosas.
![Rust-Analyzer](/rs/introduccion/rs-extensiones.png)