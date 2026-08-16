---
outline: [2, 3]
---

# Instalación y configuración

En este apartado aprenderás a instalar **Rust** en tu computadora de forma rápida y sencilla. A continuación, exploraremos diferentes métodos de instalación; si ya tienes experiencia, puedes elegir el que mejor se adapte a tu flujo de trabajo, pero si es tu primera vez, te recomendamos seguir los pasos detalladamente para asegurar una configuración exitosa.

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

2. Luego de ejecutar el instalador saldrá este menú con varias opciones de instalación, si no quieres complicarte mucho solo presiona `Enter` y el instalará automáticamente las cosas necesarias de forma automática.
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

Si por otra parte estás trabajando con VM o algún tipo de virtualización que requiera instalarlo por `WSL` entonces puedes ejecutar lo siguiente en la terminal:
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

Visual Studio Code es un editor moderno, muy usado por principiantes y profesionales gracias a su sencillez y la enorme cantidad de recursos que puedes encontrar en guías, documentaciones, tutoriales y mucho más, además gran parte de los ejemplos que veas en esta página es muy probable que estén en VS Code. 

#### Instalación de extensiones

Primero debemos instalar la extensión oficial llamada `rust-analyzer` que se encarga de brindarnos soporte para el lenguaje, como resaltado de sintaxis, autocompletado, snippets, detección de errores en tiempo real y muchas otras cosas más.
![Rust-Analyzer](/rs/introduccion/rs-extensiones.png)

:::tip
💡 `rust-analyzer` es el motor de IntelliSense de Rust, es la extensión más importante que instalarás. Con ella el editor te irá marcando los errores mientras escribes, antes incluso de compilar.
:::

#### Configuración inicial en VS Code

Una vez instalada la extensión, lo único que necesitas es tener un proyecto de Rust abierto. VS Code detectará automáticamente el archivo `Cargo.toml` en la raíz del proyecto y `rust-analyzer` empezará a trabajar.

Si quieres que tu editor luzca impecable y sin marcarte supuestos errores en archivos ajenos, es buena práctica indicarle que solo analice tu proyecto. Para ello, crea una carpeta `.vscode` en la raíz del proyecto con un archivo `settings.json`:

```json
{
  "rust-analyzer.checkOnSave": true
}
```

Esto hará que cada vez que guardes tu código, el editor ejecute una revisión rápida y te muestre los problemas antes de que tú siquiera compiles.

### Configuración con otros entornos

Rust es tan flexible que puedes usarlo en casi cualquier editor. Los más populares además de VS Code son:

- **IntelliJ IDEA / CLion**: mediante el plugin oficial de Rust. Es una excelente opción si ya vienes del mundo de JetBrains.
- **Neovim**: con la integración de `rust-analyzer` a través de LSP. Muy usado por quienes prefieren la terminal.
- **Sublime Text**: con el paquete LSP y `rust-analyzer`.

:::info Nota
ℹ️ No importa el editor que elijas: el compilador y las herramientas son las mismas en todos los entornos. Lo que cambia es únicamente la comodidad visual.
:::

## Verificando que todo funciona

Para confirmar que tu instalación fue exitosa, abre una terminal nueva (esto es importante porque `rustup` agrega las rutas al `PATH`) y ejecuta:

```bash
rustc --version
cargo --version
rustup --version
```

Deberías ver algo similar a:

```
rustc 1.85.0 (4d91de4e4 2025-02-17)
cargo 1.85.0 (9fc314f60 2025-02-17)
rustup 1.27.1 (2e12d4e0a 2025-01-14)
```

:::tip
💡 Las versiones exactas cambiarán con el tiempo, lo importante es que los tres comandos respondan sin errores. Si alguno falla, cierra y vuelve a abrir la terminal, o reinicia tu editor.
:::

## Actualizar Rust

Al ser un lenguaje en constante evolución, Rust se actualiza con frecuencia. Actualizar es tan sencillo como ejecutar un solo comando:

```bash
rustup update
```

Y si quieres mantenerte al día con las últimas novedades del ecosistema, puedes consultar el [canal de novedades oficial](https://blog.rust-lang.org/).

Con esto tu entorno está listo. En el siguiente capítulo escribiremos nuestro primer programa y descubriremos por qué Rust se siente tan distinto desde la primera línea de código.