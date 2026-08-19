import { DefaultTheme } from 'vitepress'

export const sidebarEsAsm: DefaultTheme.SidebarItem[] = [
    // ── Introducción ─────────────────────────────
    {
        text: '0. Introducción',
        collapsed: false,
        items: [
        { text: 'Visión general y filosofía', link: '/es/asm/guia/0_introduccion/01_Vision_General' },
        { text: 'Preparando el entorno', link: '/es/asm/guia/0_introduccion/02_Preparando_el_Entorno' },
        { text: 'Tu primer programa en ensamblador', link: '/es/asm/guia/0_introduccion/03_Tu_Primer_Programa' },
        { text: 'Ensamblar y enlazar: el flujo de trabajo', link: '/es/asm/guia/0_introduccion/04_Ensamblar_y_Enlazar' },
        ]
    },

    // ── Parte I: Fundamentos del hardware ────────
    {
        text: 'Parte I · El hardware que dominas',
        collapsed: true,
        items: [
        { text: 'Cómo funciona una CPU: la máquina de Von Neumann', link: '/es/asm/guia/parte_1_fundamentos_del_hardware/01_Arquitectura_de_la_CPU' },
        { text: 'Bits, bytes y hexadecimal', link: '/es/asm/guia/parte_1_fundamentos_del_hardware/02_Bits_Bytes_y_Hexadecimal' },
        { text: 'La memoria: RAM, direcciones y endianness', link: '/es/asm/guia/parte_1_fundamentos_del_hardware/03_La_Memoria' },
        { text: 'Los registros del procesador', link: '/es/asm/guia/parte_1_fundamentos_del_hardware/04_Registros' },
        ]
    },

    // ── Parte II: El lenguaje ensamblador ────────
    {
        text: 'Parte II · El lenguaje Ensamblador',
        collapsed: true,
        items: [
        { text: 'Sintaxis, directivas y etiquetas', link: '/es/asm/guia/parte_2_el_lenguaje_ensamblador/01_Sintaxis_y_Directivas' },
        { text: 'Las secciones del programa: data, bss, text', link: '/es/asm/guia/parte_2_el_lenguaje_ensamblador/02_Secciones_del_Programa' },
        { text: 'Movimiento de datos: mov', link: '/es/asm/guia/parte_2_el_lenguaje_ensamblador/03_Movimiento_de_Datos' },
        { text: 'Aritmética y operaciones lógicas', link: '/es/asm/guia/parte_2_el_lenguaje_ensamblador/04_Aritmetica_y_Logica' },
        { text: 'Comparaciones y saltos condicionales', link: '/es/asm/guia/parte_2_el_lenguaje_ensamblador/05_Comparaciones_y_Saltos' },
        { text: 'Bucles en ensamblador', link: '/es/asm/guia/parte_2_el_lenguaje_ensamblador/06_Bucles' },
        ]
    },

    // ── Parte III: La pila y las funciones ────────
    {
        text: 'Parte III · La pila y las funciones',
        collapsed: true,
        items: [
        { text: 'La pila: push y pop', link: '/es/asm/guia/parte_3_la_pila_y_las_funciones/01_La_Pila' },
        { text: 'Llamadas a funciones: call y ret', link: '/es/asm/guia/parte_3_la_pila_y_las_funciones/02_Llamadas_a_Funciones' },
        { text: 'Convenciones de llamada (ABI)', link: '/es/asm/guia/parte_3_la_pila_y_las_funciones/03_Convenciones_de_Llamada' },
        { text: 'Parámetros y valores de retorno', link: '/es/asm/guia/parte_3_la_pila_y_las_funciones/04_Parametros_y_Valores_de_Retorno' },
        ]
    },

    // ── Parte IV: Direccionamiento y datos ────────
    {
        text: 'Parte IV · Direccionamiento y datos',
        collapsed: true,
        items: [
        { text: 'Modos de direccionamiento', link: '/es/asm/guia/parte_4_direccionamiento_y_datos/01_Modos_de_Direccionamiento' },
        { text: 'Punteros y direccionamiento indirecto', link: '/es/asm/guia/parte_4_direccionamiento_y_datos/02_Punteros_y_Direccionamiento_Indirecto' },
        { text: 'Arreglos', link: '/es/asm/guia/parte_4_direccionamiento_y_datos/03_Arreglos' },
        { text: 'Cadenas de caracteres', link: '/es/asm/guia/parte_4_direccionamiento_y_datos/04_Cadenas_de_Caracteres' },
        ]
    },

    // ── Parte V: Syscalls y sistema operativo ──────
    {
        text: 'Parte V · El sistema operativo y syscalls',
        collapsed: true,
        items: [
        { text: 'Entrando al sistema operativo', link: '/es/asm/guia/parte_5_syscalls_y_sistema_operativo/01_Entrando_al_Sistema_Operativo' },
        { text: 'Syscalls en Linux', link: '/es/asm/guia/parte_5_syscalls_y_sistema_operativo/02_Syscalls_en_Linux' },
        { text: 'Syscalls en Windows', link: '/es/asm/guia/parte_5_syscalls_y_sistema_operativo/03_Syscalls_en_Windows' },
        { text: 'Archivos y entrada/salida', link: '/es/asm/guia/parte_5_syscalls_y_sistema_operativo/04_Archivos_y_Entrada_Salida' },
        ]
    },

    // ── Parte VI: Ensamblador y C ─────────────────
    {
        text: 'Parte VI · Ensamblador y C',
        collapsed: true,
        items: [
        { text: 'El ABI de C', link: '/es/asm/guia/parte_6_ensamblador_y_c/01_El_ABI_de_C' },
        { text: 'Ensamblador inline en C/C++', link: '/es/asm/guia/parte_6_ensamblador_y_c/02_Ensamblador_Inline' },
        { text: 'Enlazando ensamblador con C', link: '/es/asm/guia/parte_6_ensamblador_y_c/03_Enlazando_Ensamblador_con_C' },
        ]
    },

    // ── Parte VII: Nivel avanzado ─────────────────
    {
        text: 'Parte VII · Nivel avanzado',
        collapsed: true,
        items: [
        { text: 'Números flotantes y la FPU', link: '/es/asm/guia/parte_7_nivel_avanzado/01_Numeros_Flotantes_y_FPU' },
        { text: 'SIMD: SSE y AVX', link: '/es/asm/guia/parte_7_nivel_avanzado/02_SIMD_SSE_y_AVX' },
        { text: 'Optimización de rendimiento', link: '/es/asm/guia/parte_7_nivel_avanzado/03_Optimizacion_de_Rendimiento' },
        { text: 'Seguridad y defensas', link: '/es/asm/guia/parte_7_nivel_avanzado/04_Seguridad_y_Defensas' },
        ]
    },

    // ── Parte VIII: Proyecto final ────────────────
    {
        text: 'Parte VIII · Proyecto final',
        collapsed: true,
        items: [
        { text: 'Proyecto: Calculadora CLI', link: '/es/asm/guia/parte_8_proyecto_final/01_Proyecto_Calculadora_CLI' },
        { text: 'Depuración con GDB y objdump', link: '/es/asm/guia/parte_8_proyecto_final/02_Depuracion_con_GDB_y_Objdump' },
        { text: 'Documentando y publicando tu trabajo', link: '/es/asm/guia/parte_8_proyecto_final/03_Documentando_y_Publicando' },
        ]
    }
]