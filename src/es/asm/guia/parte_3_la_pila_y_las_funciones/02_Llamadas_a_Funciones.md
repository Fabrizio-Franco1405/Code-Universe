---
outline: [2, 3]
---

# Llamadas a funciones: `call` y `ret`

En el capítulo anterior dominaste la pila con `push` y `pop`. Ahora verás la pieza que la convierte en el corazón de todo programa estructurado: **`call` y `ret`**, las instrucciones que permiten "llamar" a otra parte del código y volver exactamente donde estabas. Así nacen las funciones.

## 1. La idea de la función

Una **función** es un bloque de código al que puedes saltar, que hace su trabajo, y que al terminar te devuelve **al lugar exacto donde lo llamaste**. En ensamblador, una función es simplemente una etiqueta con dos propiedades:

- Se **llama** con `call`.
- **Regresa** con `ret`.

```text
inicio:
    call saludar     ; salta a "saludar" y recuerda volver
    mov rax, 60
    mov rdi, 0
    syscall

saludar:
    ; ...cuerpo de la función...
    ret              ; vuelve al punto posterior al "call"
```

- `call saludar`: salta a la etiqueta `saludar`, pero antes **guarda la dirección de retorno**.
- Al llegar a `ret`, la CPU recupera esa dirección y sigue justo después del `call`.
- El resultado es una "ida y vuelta": la función se ejecuta y el programa continúa como si nada.

Esa dirección guardada es lo que hace todo posible: es la diferencia entre un salto (`jmp`, que no recuerda nada) y una llamada (`call`, que sí recuerda).

## 2. ¿Dónde se guarda la dirección de retorno?

La respuesta corta: **en la pila**. `call` hace dos cosas en una:

1. Empuja la dirección de la siguiente instrucción (el punto de retorno).
2. Salta a la función.

```text
Antes de call saludar:
RSP → [ ... ]

Durante call saludar:
RSP → [ dirección de retorno ]  ← empujada por call
      [ ... ]

ret:
RSP → [ ... ]                   ← dirección recuperada y saltada
```

- `call` guarda el "marcador" que dirá "vuelve aquí".
- `ret` lee ese marcador, lo descarta, y salta a él.
- Por eso cada `call` debe tener su `ret`: el par apila y desapila simétricamente.

:::info Nota
ℹ️ Si una función se llama a sí misma (recursión, verás un ejemplo al final), cada llamada empuja su propia dirección de retorno. La pila va acumulando "marcadores" hasta que la más interna regresa, y luego se van desapilando en orden inverso.
:::

## 3. El prólogo y el epílogo

Una función bien escrita no se limita a `call`/`ret`: **preserva el estado** de la pila para poder usar variables locales y registros sin romper nada. La estructura clásica es:

```text
mi_funcion:
    push rbp          ; prólogo: guardamos el marco anterior
    mov  rbp, rsp     ; fijamos el marco base de esta función
    sub  rsp, 16      ; reservamos espacio para variables locales

    ; ... cuerpo de la función ...

    mov  rsp, rbp     ; epílogo: liberamos las variables locales
    pop  rbp          ; restauramos el marco anterior
    ret
```

- **Prólogo:** `push rbp` + `mov rbp, rsp` + `sub rsp, N`. Guarda el marco anterior y reserva espacio local.
- **Epílogo:** `mov rsp, rbp` + `pop rbp` + `ret`. Libera, restaura y regresa.
- `RBP` se convierte en la "base" fija desde la que se accede a las variables locales (`[rbp-8]`, `[rbp-16]`).

Gracias a `RBP`, aunque `RSP` se mueva dentro de la función, las variables locales tienen direcciones estables.

## 4. Variables locales con la pila

Las variables locales viven en el espacio que reservó el prólogo. Con `RBP` como referencia:

```text
suma_dos:
    push rbp
    mov  rbp, rsp
    sub  rsp, 16        ; dos locales de 8 bytes

    mov  qword [rbp-8], 10    ; local "primero"
    mov  qword [rbp-16], 5    ; local "segundo"
    mov  rax, [rbp-8]
    add  rax, [rbp-16]        ; rax = 15

    mov  rsp, rbp
    pop  rbp
    ret
```

- `[rbp-8]` y `[rbp-16]`: los "cajones" locales de esta función.
- A diferencia de los registros, la pila te da **tantas variables como espacio reserves**.
- Al terminar, el epílogo libera todo automáticamente: las locales "mueren" al regresar.

Esta es la versión ensamblador de las variables locales de C: viven en el marco de la función y desaparecen con su `ret`.

:::warning Advertencia
⚠️ Todo lo que reservaste en el prólogo debe liberarse en el epílogo, y en el orden correcto. Si el `ret` encuentra la pila en un estado distinto al que dejó el `call`, lee una dirección basura y salta a donde no debe (casi siempre, un fallo de segmentación).
:::

## 5. Un ejemplo completo de recursión

Para demostrar la potencia de `call`/`ret`, veamos una función recursiva que calcula el factorial:

```text
factorial:
    cmp rdi, 1
    jle caso_base        ; si n <= 1, devuelve 1
    push rdi             ; guardamos n en la pila
    dec rdi              ; factorial(n-1)
    call factorial
    pop rdi              ; recuperamos n
    imul rax, rdi        ; rax = factorial(n-1) * n
    ret

caso_base:
    mov rax, 1
    ret
```

- `cmp rdi, 1` y `jle`: si `n <= 1`, terminamos (caso base).
- `push rdi`: cada llamada guarda su propio `n` en la pila.
- `call factorial`: la recursión; cada vuelta empuja su dirección de retorno.
- Al regresar, `pop rdi` recupera el `n` de esa llamada y multiplica.
- `rax` va acumulando el resultado hacia atrás.

Llama a la función con `mov rdi, 5` y `call factorial`: el resultado `120` quedará en `RAX`. La pila es la que hace posible que cada nivel de recursión tenga su propio `n` y su propio retorno.

:::tip
💡 Antes de escribir una función recursiva, pregúntate si el `push`/`pop` de cada nivel es realmente necesario. En muchos casos un bucle con la pila es más eficiente; la recursión en ensamblador es potente pero gasta pila en cada llamada.
:::

## Resumen rápido

- `call` empuja la **dirección de retorno** y salta; `ret` la recupera y regresa.
- El **prólogo** (`push rbp`/`mov rbp, rsp`/`sub rsp, N`) fija el marco y las locales.
- El **epílogo** (`mov rsp, rbp`/`pop rbp`/`ret`) libera todo y regresa.
- Las variables locales viven en la pila (`[rbp-8]`, `[rbp-16]`) y mueren al regresar.
- La **recursión** funciona gracias a que cada `call` guarda su propio retorno en la pila.

Ya sabes crear funciones. Pero en un programa real las funciones deben **hablar entre sí**: en el próximo capítulo veremos **las convenciones de llamada**, el acuerdo universal que define qué registros llevan parámetros, quién devuelve el resultado y quién debe preservar qué.