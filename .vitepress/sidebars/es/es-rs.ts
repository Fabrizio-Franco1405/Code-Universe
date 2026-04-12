import { DefaultTheme } from 'vitepress'

export const sidebarEsRs: DefaultTheme.SidebarItem[] = [
    {
            text: '1. Introducción',
            collapsed: false,
            items: [
                { text: 'Visión general del lenguaje', link: '/es/rs/guia/1_introduccion/01_Vision_General.md' },
                { text: 'Instalación y configuración', link: '/es/rs/guia/1_introduccion/02_Instalacion_y_Configuracion.md' },
                { text: 'Tu primer programa', link: '/es/rs/guia/1_introduccion/03_Tu_Primer_Programa.md' },
            ]
        },

        {
            text: '2. Fundamentos del lenguaje',
            collapsed: false,
            items: [
                { text: '2.1 Variables y Mutabilidad', link: '/es/rs/guia/2_fundamentos/01_Variables_y_Mutabilidad.md' },
                { text: '2.2 Tipos de Datos', link: '/es/rs/guia/2_fundamentos/02_Tipos_de_Datos.md' },
                { text: '2.3 Funciones', link: '/es/rs/guia/2_fundamentos/03_Funciones.md' },
                { text: '2.4 Comentarios', link: '/es/rs/guia/2_fundamentos/04_Comentarios.md' },
                { text: '2.5 Estructuras de control', link: '/es/rs/guia/2_fundamentos/05_Estructuras_de_Control.md' },
            ]
        },

        {
            text: '3. Entendiendo el Ownership',
            collapsed: false,
            items: [
                { text: '3.1 ¿Qué es el Ownership?', link: '/es/rs/guia/3_ownership/01_Que_es_el_Ownership.md' },
                { text: '3.2 Referencias y Prestamos', link: '/es/rs/guia/3_ownership/02_Referencias_y_Prestamos.md' },
                { text: '3.3 El Tipo Slice', link: '/es/rs/guia/3_ownership/03_El_Tipo_Slice.md' },
            ]
        },

        {
            text: '4. Usando Struct para Estructurar Datos Relacionados',
            collapsed: false,
            items: [
                { text: '4.1 Definiendo e Instanciando Structs', link: '/es/rs/guia/4_usando_struct/01_Definiendo_Structs.md' },
                { text: '4.2 Un Programa de ejemplo usando Structs', link: '/es/rs/guia/4_usando_struct/02_Ejemplo_Usando_Structs.md' },
                { text: '4.3 Sintaxis de Métodos', link: '/es/rs/guia/4_usando_struct/03_Sintaxis_de_Metodos.md' },
            ]
        },

        {
            text: '5. Enumeraciones y Coincidencia de Patrones',
            collapsed: false,
            items: [
                { text: '5.1 Definiendo un Enum', link: '/es/rs/guia/5_enum_y_patrones/01_Definiendo_un_Enum.md' },
                { text: '5.2 La estructura de control Match', link: '/es/rs/guia/5_enum_y_patrones/02_Estructura_de_Control_Match.md' },
                { text: '5.3 El operador de Control de Flujo match', link: '/es/rs/guia/5_enum_y_patrones/03_Operador_de_Control_Match.md' },
            ]
        },

        {
            text: '6. Administrando Proyectos en Crecimiento con Paquetes, Crates y Módulos',
            collapsed: false,
            items: [
                { text: '6.1 Paquetes y Crates', link: '/es/rs/guia/6_crates_y_modulos/01_Paquetes_y_Crates.md' },
                { text: '6.2 Definiendo módulos para controlar el Scope y la pirvacidad', link: '/es/rs/guia/6_crates_y_modulos/02_Scope_y_Privacidad.md' },
                { text: '6.3 links para referirse a un item en el árbol de módulos', link: '/es/rs/guia/6_crates_y_modulos/03_links.md' },
                { text: '6.4 Incluyendo rutas al Scope con la palabra clave use', link: '/es/rs/guia/6_crates_y_modulos/04_Rutas_al_Scope_con_use.md' },
                { text: '6.5 Separando Módulos en Diferentes Archivos', link: '/es/rs/guia/6_crates_y_modulos/05_Separar_Modulos_en_Archivos.md' },
            ]
        },

        {
            text: '7. Colecciones comunes',
            collapsed: false,
            items: [
                { text: '7.1 Almacenando listas de valores con vectores', link: '/es/rs/guia/7_colecciones_comunes/01_Almacenar_Listas_con_Vectores.md' },
                { text: '7.2 Almacenando texto codificado en UTF-8 con String', link: '/es/rs/guia/7_colecciones_comunes/02_Almacenar_Texto_Codificado_UTF-8.md' },
                { text: '7.3 Almacenar Claves con Valores Asociados en HashMaps', link: '/es/rs/guia/7_colecciones_comunes/03_Almacenar_Claves_con_Valores.md' },
            ]
        },

        {
            text: '8. Manejo de Errores',
            collapsed: false,
            items: [
                { text: '8.1 Errores irrecuperables con panic!', link: '/es/rs/guia/8_manejo_de_errores/01_Errores_Irrecuperables_con_panic.md' },
                { text: '8.2 Errores recuperables con Result', link: '/es/rs/guia/8_manejo_de_errores/02_Errores_Recuperables_con_Result.md' },
                { text: '8.3 panic! o no panic!', link: '/es/rs/guia/8_manejo_de_errores/03_Panic_o_no_panic.md' },
            ]
        },

        {
            text: '9. Tipos Genéricos, Traits y Lifetimes',
            collapsed: false,
            items: [
                { text: '9.1 Tipos de Datos Genéricos', link: '/es/rs/guia/9_genericos_traits_y_lifetimes/01_Tipos_de_Datos_Genericos.md' },
                { text: '9.2 Traits: Definiendo Comportamiento Compartido', link: '/es/rs/guia/9_genericos_traits_y_lifetimes/02_Traits_Comportamiento_Compartido.md' },
                { text: '9.3 Validando Referencias con Lifetimes', link: '/es/rs/guia/9_genericos_traits_y_lifetimes/03_Validando_Referencias_con_Lifetimes.md' },
            ]
        },

        {
            text: '10. Escribiendo Tests Automatizados',
            collapsed: false,
            items: [
                { text: '10.1 Cómo escribir Tests', link: '/es/rs/guia/10_tests_automatizados/01_Como_Escribir_Tests.md' },
                { text: '10.2 Controlando cómo los Tests son ejecutados', link: '/es/rs/guia/10_tests_automatizados/02_Controlando_Tests_Ejecutados.md' },
                { text: '10.3 Organización de los Tests', link: '/es/rs/guia/10_tests_automatizados/03_Organizacion_de_los_Tests.md' },
            ]
        },

        {
            text: '11. Un proyecto de I/O: Construyendo un programa de línea de comandos',
            collapsed: false,
            items: [
                { text: '11.1 Aceptando argumentos de línea de comandos', link: '/es/rs/guia/11_escribiendo_mensajes_estandar/01_Aceptar_Argumentos_CLI.md' },
                { text: '11.2 Leyendo un archivo', link: '/es/rs/guia/11_escribiendo_mensajes_estandar/02_Leyendo_un_Archivos.md' },
                { text: '11.3 Refactorizando para mejorar la modularidad y el manejo de errores', link: '/es/rs/guia/11_escribiendo_mensajes_estandar/03_Refactorizar_Modularidad_y_Errores.md' },
                { text: '11.4 Desarrollando la funcionalidad de la biblioteca T.D.D', link: '/es/rs/guia/11_escribiendo_mensajes_estandar/04_Desarrollando_Funcionalidad.TDD.md' },
                { text: '11.5 Trabajando con variables de entorno', link: '/es/rs/guia/11_escribiendo_mensajes_estandar/05_Trabajando_con_Variables_de_Entorno.md' },
                { text: '11.6 Escribiendo mensajes de error estándar en lugar del output estándar', link: '/es/rs/guia/11_escribiendo_mensajes_estandar/06_Mensajes_de_Error_Estandar.md' },
            ]
        },
]