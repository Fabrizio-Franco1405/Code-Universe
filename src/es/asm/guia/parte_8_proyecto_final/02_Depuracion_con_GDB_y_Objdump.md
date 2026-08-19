---
outline: [2, 3]
---

# Depuración con `GDB` y `objdump`

Tu calculadora compila, pero algo falla. Bienvenido al arte del **debugging**: en ensamblador, los errores no siempre avisan, y encontrarlos requiere las herramientas correctas. Este capítulo te enseña a usar **GDB** paso a paso y **objdump** como mapa del código, para que ningún bug sobreviva a tu inspección.

## 1. Preparar el binario para depurar

Para que GDB pueda mostrar tu código fuente y los nombres de las etiquetas, el binario debe llevar información de depuración. Con NASM se agrega con `-g` y con el formato adecuado:

```bash
nasm -f elf64 -g calculadora.asm -o calculadora.o
ld calculadora.o -o calculadora
```

- `-g` (debug): incluye símbolos y referencias al código fuente.
- `-F dwarf`: agrega la información de líneas al formato DWARF, que GDB entiende.
- Sin `-g`, GDB funciona pero solo muestra direcciones, sin nombres.

```bash
gdb ./calculadora
```

- `gdb` abre el depurador con tu programa cargado.
- Los comandos que verás a continuación se escriben en el prompt de GDB.

:::info Nota
ℹ️ Si el programa crashea con `Segmentation fault`, ejecútalo dentro de GDB: `gdb ./calculadora`, luego `run`. El depurador te dirá exactamente en qué instrucción falló, con la dirección y los registros.
:::

## 2. Los comandos esenciales de `GDB`

Los comandos que usarás el 90% del tiempo:

```text
break _start        ; pone un punto de quiebre en la etiqueta
run                 ; ejecuta hasta el primer punto de quiebre
stepi               ; ejecuta UNA instrucción (paso a paso)
nexti               ; igual, pero sin entrar en las funciones
continue            ; sigue hasta el siguiente punto de quiebre
info registers      ; muestra el estado de todos los registros
x/10gx $rsp         ; examina 10 qwords de la pila
```

```text
(gdb) break _start
(gdb) run
(gdb) stepi
(gdb) info registers
```

- `break _start`: el programa se detiene al llegar a `_start`.
- `stepi`: avanza instrucción por instrucción, como un cámara lenta.
- `info registers`: ve el valor de `rax`, `rsp`, `rip`... en cada instante.

La combinación de `stepi` + `info registers` te permite **ver el programa pensar**: cada instrucción cambia un registro, y tú lo observas en tiempo real.

## 3. Observar la memoria

Los registros son la mitad de la historia; la otra mitad está en la memoria. GDB te muestra su contenido con el comando `x` (examine):

```text
x/8bx buffer        ; 8 bytes de "buffer" en hexadecimal
x/s buffer          ; interpreta como cadena
x/4gx $rsp          ; 4 qwords desde el tope de la pila
```

- `x/8bx`: examina 8 bytes (`b`) en hexadecimal (`x`).
- `x/s`: interpreta la memoria como una cadena terminada en cero.
- `x/4gx`: muestra 4 qwords (g = giant) de la pila.

```text
(gdb) x/8bx buffer
0x402000 <buffer>: 0x31 0x32 0x20 0x2b 0x20 0x37 0x0a 0x00
```

- `0x31` = `'1'`, `0x32` = `'2'`, `0x20` = espacio, `0x2b` = `'+'`, `0x37` = `'7'`.
- Ahí está tu entrada `"12 + 7"` tal como la guardó `read`.
- Ver los bytes te confirma si el parseo encontró lo que esperaba.

Cuando sospechas que un valor no se convirtió bien, examinar la memoria te dice la verdad: ¿el carácter era `'0'` (48) o `0` (cero)? Con `x` ya no hay duda.

## 4. El mapa del código con `objdump`

`objdump` complementa a GDB como **desensamblador**: te muestra el código de máquina de tu binario con sus direcciones y bytes:

```bash
objdump -d calculadora
```

```text
0000000000401000 <_start>:
  401000: b8 01 00 00 00   mov eax,0x1
  401005: bf 01 00 00 00   mov edi,0x1
  40100a: 48 be ...        movabs rsi,0x402000
  401014: ba 0b 00 00 00   mov edx,0xb
  401019: 0f 05             syscall
```

- A la izquierda, la **dirección** de cada instrucción.
- En el medio, los **bytes de máquina** exactos.
- A la derecha, el mnemónico que la CPU ejecutará.

Con este mapa puedes verificar qué generó el ensamblador: `mov eax,0x1` ocupa 5 bytes, `syscall` 2. Si un byte no coincide con lo que esperabas, ahí está la pista del error.

```bash
objdump -d calculadora | grep -n "call\|jmp"    # busca saltos y llamadas
```

- Filtra por las instrucciones de control para revisar a dónde apunta cada `call`/`jmp`.
- Un `call` que apunta a una dirección extraña suele ser un bug de símbolos o de pila.

`objdump` es el "mapa" y GDB el "microscopio": el primero te da la vista general, el segundo el detalle paso a paso.

## 5. El flujo de depuración paso a paso

Un método profesional para cazar un bug de calculadora:

**1. Reproduce el fallo:**

```bash
./calculadora
Operación: 12 + 7
Segmentation fault
```

**2. Abre GDB y deja que te diga dónde:**

```text
(gdb) run
Program received signal SIGSEGV, Segmentation fault.
0x0000000000401036 in texto_a_numero ()
```

**3. Inspecciona el estado:**

```text
(gdb) info registers rsi rdi
rsi    0x402020            64768
rdi    0x64                100
```

**4. Examina la memoria sospechosa:**

```text
(gdb) x/4bx $rsi
0x402020: 0x0a 0x00 0x00 0x00
```

**5. Identifica la causa:** `rsi` apunta a un byte `0x0a` (salto de línea): pasamos la longitud equivocada y `texto_a_numero` recorrió de más. El `dec rax` que quitaba el `0ah` se ejecutó en el lugar equivocado.

- GDB te llevó al fallo **exacto**: la instrucción que leyó fuera de límite.
- Los registros te mostraron la dirección incorrecta.
- La memoria confirmó qué había ahí.

Este ciclo —**reproducir, localizar, inspeccionar, corregir**— es el mismo, sin importar el tamaño del programa. Con GDB y objdump, ningún misterio dura mucho.

:::tip
💡 Regla de depuración: cuando un programa "no hace lo que quiero", primero pregunta **¿qué está haciendo realmente?** GDB responde esa pregunta. No adivines el fix: observa la evidencia y corrige el dato que la contradice.
:::

## Resumen rápido

- Compila con `-g` para que GDB conozca tus etiquetas.
- `break`, `run`, `stepi`, `info registers` te dan el control paso a paso.
- `x/8bx`, `x/s`, `x/4gx` examinan la memoria byte a byte.
- `objdump -d` es el mapa del código con direcciones y bytes.
- El flujo profesional es **reproducir → localizar → inspeccionar → corregir**.

Tu calculadora funciona y sabes encontrar sus bugs. Para cerrar la travesía, en el último capítulo veremos **cómo documentar y publicar tu trabajo**, para que el mundo lo vea y lo use.