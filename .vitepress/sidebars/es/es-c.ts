import { DefaultTheme } from 'vitepress'

export const sidebarEsC: DefaultTheme.SidebarItem[] = [
    {
        text: '1. Introducción a C',
        collapsed: false,
        items: [
        { text: 'Visión general y filosofía', link: '/es/c/guia/1_introduccion/01_Vision_General' },
        { text: 'Entendiendo el Compilador', link: '/es/c/guia/1_introduccion/02_Entendiendo_Compilador' },
        { text: 'Preparando el entorno', link: '/es/c/guia/1_introduccion/03_Preparando_Entorno' },
        { text: 'Tu primer programa', link: '/es/c/guia/1_introduccion/04_Tu_Primer_Programa' },
        ]
    },

    {
        text: '2. Fundamentos y Lógica',
        collapsed: false,
        items: [
        { text: 'Sintaxis y reglas de escritura', link: '/es/c/guia/2_fundamentos/01_Sintaxis' },
        { text: 'Almacenando datos: Variables', link: '/es/c/guia/2_fundamentos/02_Variables' },
        { text: 'Tipos de datos y límites', link: '/es/c/guia/2_fundamentos/03_Tipos_Datos' },
        { text: 'Comunicación: printf y scanf', link: '/es/c/guia/2_fundamentos/04_Entrada_Salida' },
        { text: 'Operadores y expresiones', link: '/es/c/guia/2_fundamentos/05_Operadores' },
        { text: 'Toma de decisiones (Control de flujo)', link: '/es/c/guia/2_fundamentos/06_Control_Flujo' }
        ]
    },

    {
        text: '3. Funciones y Organización',
        collapsed: false,
        items: [
        { text: 'Creando tus propias funciones', link: '/es/c/guia/3_funciones_y_organizacion/01_Creando_Funciones' },
        { text: 'Prototipos y Declaraciones', link: '/es/c/guia/3_funciones_y_organizacion/02_Prototipos' },
        { text: 'Paso de argumentos: Valor vs Dirección', link: '/es/c/guia/3_funciones_y_organizacion/03_Argumentos' },
        { text: 'Ámbito y persistencia (Static y Extern)', link: '/es/c/guia/3_funciones_y_organizacion/04_Storage_Classes' },
        { text: 'Recursividad: Funciones que se llaman', link: '/es/c/guia/3_funciones_y_organizacion/05_Recursividad' },
        { text: 'La biblioteca estándar de C', link: '/es/c/guia/3_funciones_y_organizacion/06_Standard_Lib' }
        ]
    },

    {
        text: '4. El Corazón de C: Memoria',
        collapsed: false,
        items: [
        { text: '¿Cómo funciona la RAM?', link: '/es/c/guia/4_gestion_de_memoria/01_Conceptos_RAM' },
        { text: 'Introducción a los Punteros', link: '/es/c/guia/4_gestion_de_memoria/02_Punteros_Basico' },
        { text: 'Aritmética de direcciones', link: '/es/c/guia/4_gestion_de_memoria/03_Aritmetica_Punteros' },
        { text: 'Punteros dobles y múltiples', link: '/es/c/guia/4_gestion_de_memoria/04_Punteros_Dobles' },
        { text: 'Punteros a funciones y Callbacks', link: '/es/c/guia/4_gestion_de_memoria/05_Punteros_Funciones' },
        { text: 'Gestión Dinámica (Malloc/Free)', link: '/es/c/guia/4_gestion_de_memoria/06_Gestion_Dinamica' },
        { text: 'Punteros genéricos (void*)', link: '/es/c/guia/4_gestion_de_memoria/07_Punteros_Void' }
        ]
    },

    {
        text: '5. Arreglos y Texto',
        collapsed: false,
        items: [
        { text: 'Listas de datos (Arrays)', link: '/es/c/guia/5_arreglos_y_texto/01_Arrays' },
        { text: 'Cadenas de caracteres (Strings)', link: '/es/c/guia/5_arreglos_y_texto/02_Strings' },
        { text: 'Matrices multidimensionales', link: '/es/c/guia/5_arreglos_y_texto/03_Matrices' },
        { text: 'Manipulación de texto (string.h)', link: '/es/c/guia/5_arreglos_y_texto/04_String_h' },
        { text: 'La relación entre Punteros y Arreglos', link: '/es/c/guia/5_arreglos_y_texto/05_Punteros_Arrays' }
        ]
    },

    {
        text: '6. Estructuras y Datos Compuestos',
        collapsed: false,
        items: [
        { text: 'Estructuras: Agrupando haberes', link: '/es/c/guia/6_estructuras_y_datos_compuestos/01_Structs' },
        { text: 'Typedef: Alias para tipos', link: '/es/c/guia/6_estructuras_y_datos_compuestos/02_Typedef' },
        { text: 'Uniones: Compartiendo memoria', link: '/es/c/guia/6_estructuras_y_datos_compuestos/03_Uniones' },
        { text: 'Enums y constantes lógicas', link: '/es/c/guia/6_estructuras_y_datos_compuestos/04_Enums' },
        { text: 'Campos de bits (Bitfields)', link: '/es/c/guia/6_estructuras_y_datos_compuestos/05_Bitfields' }
        ]
    },

    {
        text: '7. El Preprocesador y Headers',
        collapsed: false,
        items: [
        { text: 'Directivas (#define, #include)', link: '/es/c/guia/7_prepocesador_y_headers/01_Directivas' },
        { text: 'Creando tus propios Headers (.h)', link: '/es/c/guia/7_prepocesador_y_headers/02_Headers' },
        { text: 'Guardias de inclusión', link: '/es/c/guia/7_prepocesador_y_headers/03_Include_Guards' },
        { text: 'Compilación condicional (#ifdef, #if)', link: '/es/c/guia/7_prepocesador_y_headers/04_Compilacion_Condicional' },
        { text: 'Macros con argumentos', link: '/es/c/guia/7_prepocesador_y_headers/05_Macros_Argumentos' }
        ]
    },

    {
        text: '8. Manejo de Archivos',
        collapsed: false,
        items: [
        { text: 'Flujos (FILE*) y apertura', link: '/es/c/guia/8_manejos_de_archivos/01_Flujos' },
        { text: 'Lectura y escritura de texto', link: '/es/c/guia/8_manejos_de_archivos/02_Texto' },
        { text: 'Archivos Binarios', link: '/es/c/guia/8_manejos_de_archivos/03_Binarios' },
        { text: 'Navegación (fseek/ftell)', link: '/es/c/guia/8_manejos_de_archivos/04_Navegacion' },
        { text: 'Gestión de errores en archivos', link: '/es/c/guia/8_manejos_de_archivos/05_Errores' }
        ]
    },

    {
        text: '9. Buenas Prácticas y Calidad',
        collapsed: false,
        items: [
        { text: 'Depuración con GDB', link: '/es/c/guia/9_buenas_practicas/01_GDB' },
        { text: 'Manejo de errores profesional (errno)', link: '/es/c/guia/9_buenas_practicas/02_Errno' },
        { text: 'Seguridad en C: Evitando desbordamientos', link: '/es/c/guia/9_buenas_practicas/03_Seguridad' },
        { text: 'Análisis de fugas con Valgrind', link: '/es/c/guia/9_buenas_practicas/04_Valgrind' },
        { text: 'Introducción a Estructuras de Datos', link: '/es/c/guia/9_buenas_practicas/05_Estructuras_Datos' }
        ]
    },

    {
        text: '10. C y el Nivel del Sistema',
        collapsed: false,
        items: [
        { text: 'Hilos con POSIX (Pthreads)', link: '/es/c/guia/10_nivel_del_sistema/01_Pthreads' },
        { text: 'Señales del Sistema', link: '/es/c/guia/10_nivel_del_sistema/02_Senales' },
        { text: 'Interacción con el Hardware', link: '/es/c/guia/10_nivel_del_sistema/03_Hardware' },
        { text: 'Proyecto Final de Guía', link: '/es/c/guia/10_nivel_del_sistema/04_Proyecto' }
        ]
    }
]