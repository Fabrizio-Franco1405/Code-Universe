import { DefaultTheme } from 'vitepress'

export const sidebarEsCpp: DefaultTheme.SidebarItem[] = [
  // Capítulo 1: Introducción a C++
    {
        text: '1. Introducción',
        collapsed: false,
        items: [
        { text: 'Visión general del lenguaje', link: '/es/cpp/guia/1_introduccion/01_Vision_General' },
        { text: 'Sobre el Compilador', link: '/es/cpp/guia/1_introduccion/02_Compilador' },
        { text: 'Instalación y configuración', link: '/es/cpp/guia/1_introduccion/03_Instalacion_y_Configuracion' },
        { text: 'Tu primer programa', link: '/es/cpp/guia/1_introduccion/04_Tu_Primer_Programa' },
        { text: 'Compilación con CMake', link: '/es/cpp/guia/1_introduccion/05_Compilacion_con_CMake' },
        { text: 'Herramientas y flags del compilador', link: '/es/cpp/guia/1_introduccion/06_Herramientas_y_flags_del_compilador' }
        ]
    },

  // Capítulo 2: Fundamentos del lenguaje
    {
        text: '2. Fundamentos del lenguaje',
        collapsed: false,
        items: [
        { text: 'Sintaxis básica', link: '/es/cpp/guia/2_fundamentos/01_Sintaxis_basica' },
        { text: 'Tipos de datos y literales', link: '/es/cpp/guia/2_fundamentos/02_Tipos_y_literales' },
        { text: 'Variables, constantes y alcance', link: '/es/cpp/guia/2_fundamentos/03_Variables_y_alcance' },
        { text: 'Estructuras de control', link: '/es/cpp/guia/2_fundamentos/04_Estructuras_de_control' },
        {
            text: 'Funciones',
            collapsed: true,
            items: [
            { text: 'Introducción', link: '/es/cpp/guia/2_fundamentos/2_funciones/01_Introduccion' },
            { text: 'Sintaxis', link: '/es/cpp/guia/2_fundamentos/2_funciones/02_Sintaxis' },
            { text: 'Tipos de retorno', link: '/es/cpp/guia/2_fundamentos/2_funciones/03_Tipos_de_retorno' },
            { text: 'Parámetros', link: '/es/cpp/guia/2_fundamentos/2_funciones/04_Parametros' },
            { text: 'Argumentos predeterminados', link: '/es/cpp/guia/2_fundamentos/2_funciones/05_Argumentos_predeterminados' },
            { text: 'Funciones inline', link: '/es/cpp/guia/2_fundamentos/2_funciones/06_Funciones_inline' },
            { text: 'Funciones constexpr', link: '/es/cpp/guia/2_fundamentos/2_funciones/07_Funciones_constexpr' },
            { text: 'Funciones static', link: '/es/cpp/guia/2_fundamentos/2_funciones/08_Funciones_static' },
            { text: 'Sobrecarga', link: '/es/cpp/guia/2_fundamentos/2_funciones/09_Sobrecarga' },
            { text: 'Funciones template', link: '/es/cpp/guia/2_fundamentos/2_funciones/10_Funciones_template' },
            { text: 'Funciones lambda', link: '/es/cpp/guia/2_fundamentos/2_funciones/11_Funciones_lambda' },
            { text: 'Funciones recursivas', link: '/es/cpp/guia/2_fundamentos/2_funciones/12_Funciones_recursivas' },
            { text: 'Funciones miembro', link: '/es/cpp/guia/2_fundamentos/2_funciones/13_Funciones_miembro' },
            { text: 'Funciones virtuales', link: '/es/cpp/guia/2_fundamentos/2_funciones/14_Funciones_virtuales' },
            { text: 'std::function y std::bind', link: '/es/cpp/guia/2_fundamentos/2_funciones/15_std_function_y_bind' },
            { text: 'Ámbito de una función', link: '/es/cpp/guia/2_fundamentos/2_funciones/16_Ambito_de_una_funcion' },
            ]
        },
        { text: 'Espacios de nombres', link: '/es/cpp/guia/2_fundamentos/06_Espacios_de_nombres' },
        ]
    },

  // Capítulo 3: Memoria y punteros
    {
        text: '3. Memoria y punteros',
        collapsed: false,
        items: [
        { text: 'Semántica de valor y referencia', link: '/es/cpp/guia/3_memoria_y_punteros/01_Semantica_de_valor_y_referencia' },
        { text: 'Punteros y referencias', link: '/es/cpp/guia/3_memoria_y_punteros/02_Punteros_y_referencias' },
        { text: 'Aritmética de punteros', link: '/es/cpp/guia/3_memoria_y_punteros/03_Aritmetica_de_punteros' },
        { text: 'Gestión manual de memoria (new/delete)', link: '/es/cpp/guia/3_memoria_y_punteros/04_Gestion_manual_de_memoria' },
        { text: 'Punteros inteligentes (RAII)', link: '/es/cpp/guia/3_memoria_y_punteros/05_Punteros_inteligentes' },
        { text: 'Semántica de movimiento', link: '/es/cpp/guia/3_memoria_y_punteros/06_Semantica_de_movimiento' },
        { text: 'Punteros a funciones', link: '/es/cpp/guia/3_memoria_y_punteros/07_Punteros_a_funciones' }
        ]
    },

  // Capítulo 4: Programación Orientada a Objetos
    {
        text: '4. Programación Orientada a Objetos',
        collapsed: false,
        items: [
        { text: 'Clases y objetos', link: '/es/cpp/guia/4_poo/01_Clases_y_objetos' },
        { text: 'Encapsulamiento y miembros', link: '/es/cpp/guia/4_poo/02_Encapsulamiento_y_miembros' },
        { text: 'Herencia', link: '/es/cpp/guia/4_poo/03_Herencia' },
        { text: 'Polimorfismo', link: '/es/cpp/guia/4_poo/04_Polimorfismo' },
        { text: 'Clases abstractas e interfaces', link: '/es/cpp/guia/4_poo/05_Clases_abstractas_e_interfaces' }
        ]
    },

  // Capítulo 5: Tipos de datos compuestos
    {
        text: '5. Tipos de datos compuestos',
        collapsed: false,
        items: [
        { text: 'Structs', link: '/es/cpp/guia/5_tipos_de_datos_compuestos/01_Structs' },
        { text: 'Enumeraciones (enum, enum class)', link: '/es/cpp/guia/5_tipos_de_datos_compuestos/02_Enumeraciones' },
        { text: 'Uniones (union)', link: '/es/cpp/guia/5_tipos_de_datos_compuestos/03_Uniones' },
        { text: 'typedef y using', link: '/es/cpp/guia/5_tipos_de_datos_compuestos/04_Typedef_y_using' }
        ]
    },

  // Capítulo 6: Plantillas y programación genérica
    {
        text: '6. Plantillas y programación genérica',
        collapsed: false,
        items: [
        { text: 'Introducción a plantillas', link: '/es/cpp/guia/6_plantillas_y_programacion_generica/01_Introduccion_a_plantillas' },
        { text: 'Plantillas de función', link: '/es/cpp/guia/6_plantillas_y_programacion_generica/02_Plantillas_de_funcion' },
        { text: 'Plantillas de clase', link: '/es/cpp/guia/6_plantillas_y_programacion_generica/03_Plantillas_de_clase' },
        { text: 'Especialización de plantillas', link: '/es/cpp/guia/6_plantillas_y_programacion_generica/04_Especializacion' },
        { text: 'SFINAE y conceptos', link: '/es/cpp/guia/6_plantillas_y_programacion_generica/05_SFINAE_y_conceptos' },
        ]
    },

  // Capítulo 7: Manejo de excepciones
    {
        text: '7. Manejo de excepciones',
        collapsed: false,
        items: [
        { text: 'Introducción a excepciones', link: '/es/cpp/guia/7_manejo_de_excepciones/01_Introduccion_a_excepciones' },
        { text: 'Lanzamiento y captura', link: '/es/cpp/guia/7_manejo_de_excepciones/02_Lanzamiento_y_captura' },
        { text: 'Jerarquía de excepciones', link: '/es/cpp/guia/7_manejo_de_excepciones/03_Jerarquia_de_excepciones' },
        { text: 'Excepciones personalizadas', link: '/es/cpp/guia/7_manejo_de_excepciones/04_Excepciones_personalizadas' },
        { text: 'RAII y excepciones', link: '/es/cpp/guia/7_manejo_de_excepciones/05_RAII_y_excepciones' },
        { text: 'Buenas prácticas', link: '/es/cpp/guia/7_manejo_de_excepciones/06_Buenas_practicas' }
        ]
    },

  // Capítulo 8: Biblioteca Estándar (STL)
    {
        text: '8. Biblioteca Estándar (STL)',
        collapsed: false,
        items: [
        { text: 'Contenedores secuenciales', link: '/es/cpp/guia/8_biblioteca_estandar_stl/01_Contenedores_secuenciales' },
        { text: 'Contenedores asociativos', link: '/es/cpp/guia/8_biblioteca_estandar_stl/02_Contenedores_asociativos' },
        { text: 'Algoritmos de la STL', link: '/es/cpp/guia/8_biblioteca_estandar_stl/03_Algoritmos_de_la_STL' },
        { text: 'Iteradores', link: '/es/cpp/guia/8_biblioteca_estandar_stl/04_Iteradores' },
        { text: 'Lambdas y funciones', link: '/es/cpp/guia/8_biblioteca_estandar_stl/05_Lambdas_y_funciones' },
        { text: 'Uso avanzado de la STL', link: '/es/cpp/guia/8_biblioteca_estandar_stl/06_Uso_avanzado_de_la_STL' }
        ]
    },

  // Capítulo 9: Estructura de Datos
    {
        text: "9. Estructuras de datos",
        collapsed: false,
        items: [
        { text: "Pilas", link: "/es/cpp/guia/9_estructura_de_datos/01_Pilas" },
        { text: "Colas", link: "/es/cpp/guia/9_estructura_de_datos/02_Colas" },
        { text: "Listas enlazadas", link: "/es/cpp/guia/9_estructura_de_datos/03_Listas_enlazadas" },
        { text: "Árboles", link: "/es/cpp/guia/9_estructura_de_datos/04_Arboles" },
        { text: "Grafos", link: "/es/cpp/guia/9_estructura_de_datos/05_Grafos" },
        ],
    },

  // Capítulo 10: Concurrencia y paralelismo
    {
        text: '10. Concurrencia y paralelismo',
        collapsed: false,
        items: [
        { text: 'Introducción a hilos', link: '/es/cpp/guia/10_concurrencia_y_paralelismo/01_Introduccion_a_hilos' },
        { text: 'Creación y manejo de hilos', link: '/es/cpp/guia/10_concurrencia_y_paralelismo/02_Creacion_y_manejo_de_hilos' },
        { text: 'Sincronización', link: '/es/cpp/guia/10_concurrencia_y_paralelismo/03_Sincronizacion' },
        { text: 'Variables atómicas', link: '/es/cpp/guia/10_concurrencia_y_paralelismo/04_Variables_atomicas' },
        { text: 'Futuros y promesas', link: '/es/cpp/guia/10_concurrencia_y_paralelismo/05_Futuros_y_promesas' },
        { text: 'Patrones de concurrencia', link: '/es/cpp/guia/10_concurrencia_y_paralelismo/06_Patrones_de_concurrencia' }
        ]
    },

  // Capítulo 11: Entrada/Salida y archivos
    {
        text: '11. Entrada/Salida y archivos',
        collapsed: false,
        items: [
        { text: 'Flujos de entrada/salida', link: '/es/cpp/guia/11_entrada_y_salida/01_Flujos_de_entrada-salida' },
        { text: 'Manejo de archivos', link: '/es/cpp/guia/11_entrada_y_salida/02_Manejo_de_archivos' },
        { text: 'Formateo de salida', link: '/es/cpp/guia/11_entrada_y_salida/03_Formateo_de_salida' },
        { text: 'Serialización', link: '/es/cpp/guia/11_entrada_y_salida/04_Serializacion' },
        { text: 'JSON y XML', link: '/es/cpp/guia/11_entrada_y_salida/05_JSON_y_XML' },
        { text: 'E/S asíncrona', link: '/es/cpp/guia/11_entrada_y_salida/06_E-S_asincrona' }
        ]
    },

  // Capítulo 12: Patrones de diseño
    {
        text: '12. Patrones de diseño',
        collapsed: false,
        items: [
        { text: 'Introducción a patrones', link: '/es/cpp/guia/12_patrones_de_diseño/01_Introduccion_a_patrones' },
        { text: 'Patrones creacionales', link: '/es/cpp/guia/12_patrones_de_diseño/02_Patrones_creacionales' },
        { text: 'Patrones estructurales', link: '/es/cpp/guia/12_patrones_de_diseño/03_Patrones_estructurales' },
        { text: 'Patrones de comportamiento', link: '/es/cpp/guia/12_patrones_de_diseño/04_Patrones_de_comportamiento' },
        { text: 'Patrones en C++ moderno', link: '/es/cpp/guia/12_patrones_de_diseño/05_Patrones_en_C++_moderno' },
        { text: 'Antipatrones', link: '/es/cpp/guia/12_patrones_de_diseño/06_Antipatrones' }
        ]
    },

  // Capítulo 13: C++ Moderno (11, 14, 17, 20)
    {
        text: '13. C++ Moderno (11/14/17/20)',
        collapsed: false,
        items: [
        { text: 'Novedades en C++11', link: '/es/cpp/guia/13_cpp_moderno/01_Novedades_en_C++11' },
        { text: 'Mejoras en C++14', link: '/es/cpp/guia/13_cpp_moderno/02_Mejoras_en_C++14' },
        { text: 'Novedades en C++17', link: '/es/cpp/guia/13_cpp_moderno/03_Novedades_en_C++17' },
        { text: 'Características de C++20', link: '/es/cpp/guia/13_cpp_moderno/04_Características_de_C++20' },
        { text: 'Módulos', link: '/es/cpp/guia/13_cpp_moderno/05_Modulos' },
        { text: 'Rangos y vistas', link: '/es/cpp/guia/13_cpp_moderno/06_Rangos_y_vistas' }
        ]
    },

  // Capítulo 14: Optimización y rendimiento
    {
        text: '14. Optimización y rendimiento',
        collapsed: false,
        items: [
        { text: 'Análisis de rendimiento', link: '/es/cpp/guia/14_optimizacion_y_rendimiento/01_Analisis_de_rendimiento' },
        { text: 'Optimización de memoria', link: '/es/cpp/guia/14_optimizacion_y_rendimiento/02_Optimizacion_de_memoria' },
        { text: 'Optimización de CPU', link: '/es/cpp/guia/14_optimizacion_y_rendimiento/03_Optimizacion_de_CPU' },
        { text: 'Vectorización', link: '/es/cpp/guia/14_optimizacion_y_rendimiento/04_Vectorizacion' },
        { text: 'Herramientas de perfilado', link: '/es/cpp/guia/14_optimizacion_y_rendimiento/05_Herramientas_de_perfilado' },
        { text: 'Patrones de optimización', link: '/es/cpp/guia/14_optimizacion_y_rendimiento/06_Patrones_de_optimizacion' }
        ]
    },

  // Capítulo 15: Módulos y creación de bibliotecas
    {
        text: '15. Módulos y creación de bibliotecas',
        collapsed: false,
        items: [
        { text: 'Introducción a módulos (C++20)', link: '/es/cpp/guia/15_modulos_y_bibliotecas/01_Introduccion_a_modulos' },
        { text: 'Export/Import y particiones de módulo', link: '/es/cpp/guia/15_modulos_y_bibliotecas/02_Export-Import_y_particiones_de_modulo' },
        { text: 'Librerías header-only vs compiladas', link: '/es/cpp/guia/15_modulos_y_bibliotecas/03_Librerias_header-only_vs_compiladas' },
        { text: 'Librerías estáticas con CMake', link: '/es/cpp/guia/15_modulos_y_bibliotecas/04_Librerias_estaticas_con_CMake' },
        { text: 'Librerías dinámicas con CMake', link: '/es/cpp/guia/15_modulos_y_bibliotecas/05_Librerias_dinamicas_con_CMake' },
        { text: 'Instalación y uso: find_package()', link: '/es/cpp/guia/15_modulos_y_bibliotecas/06_Find_package_targets_e_instalacion' },
        { text: 'Estructura include/ y API', link: '/es/cpp/guia/15_modulos_y_bibliotecas/07_Estructura_include_namespaces_y_API' },
        { text: 'Incluir con <> vs ""', link: '/es/cpp/guia/15_modulos_y_bibliotecas/08_Incluir_con_angulo_vs_comillas' },
        { text: 'Distribución y versionado', link: '/es/cpp/guia/15_modulos_y_bibliotecas/09_Distribucion_versionado_y_empaquetado' }
        ]
    },

  // Capítulo 16: Proyecto final
    {
        text: '16. Proyecto final',
        collapsed: false,
        items: [
        { text: 'Especificaciones', link: '/es/cpp/guia/16_proyecto_final/01_Especificaciones_del_proyecto' },
        { text: 'Diseño del sistema', link: '/es/cpp/guia/16_proyecto_final/02_Diseno_del_sistema' },
        { text: 'Implementación', link: '/es/cpp/guia/16_proyecto_final/03_Implementacion_paso_a_paso' },
        { text: 'Pruebas y validación', link: '/es/cpp/guia/16_proyecto_final/04_Pruebas_y_validacion' },
        { text: 'Documentación', link: '/es/cpp/guia/16_proyecto_final/05_Documentacion_del_proyecto' },
        { text: 'Despliegue', link: '/es/cpp/guia/16_proyecto_final/06_Despliegue' }
        ]
    }
]