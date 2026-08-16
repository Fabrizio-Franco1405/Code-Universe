import { DefaultTheme } from 'vitepress'

export const sidebarEsRs: DefaultTheme.SidebarItem[] = [
  // ── Introducción ─────────────────────────────
  {
    text: '0. Introducción',
    collapsed: false,
    items: [
      { text: 'Visión general del lenguaje', link: '/es/rs/guia/0_introduccion/01_Vision_General' },
      { text: 'Instalación y configuración', link: '/es/rs/guia/0_introduccion/02_Instalacion_y_Configuracion' },
      { text: 'Tu primer programa', link: '/es/rs/guia/0_introduccion/03_Tu_Primer_Programa' },
      { text: 'Cargo: el arquitecto de tu proyecto', link: '/es/rs/guia/0_introduccion/04_Cargo_el_arquitecto_de_tu_proyecto' }
    ]
  },

  // ── Parte I: Fundamentos (Principiante) ──────
  {
    text: 'Parte I · Fundamentos del lenguaje',
    collapsed: true,
    items: [
      { text: 'Variables y mutabilidad', link: '/es/rs/guia/parte_1_fundamentos/01_Variables_y_Mutabilidad' },
      { text: 'Tipos de datos', link: '/es/rs/guia/parte_1_fundamentos/02_Tipos_de_Datos' },
      { text: 'Funciones', link: '/es/rs/guia/parte_1_fundamentos/03_Funciones' },
      { text: 'Comentarios', link: '/es/rs/guia/parte_1_fundamentos/04_Comentarios' },
      { text: 'Estructuras de control', link: '/es/rs/guia/parte_1_fundamentos/05_Estructuras_de_Control' }
    ]
  },

  // ── Parte II: Ownership (Principiante) ────────
  {
    text: 'Parte II · El corazón de Rust: Ownership',
    collapsed: true,
    items: [
      { text: '¿Qué es el Ownership?', link: '/es/rs/guia/parte_2_ownership/01_Que_es_el_Ownership' },
      { text: 'Referencias y préstamos', link: '/es/rs/guia/parte_2_ownership/02_Referencias_y_Prestamos' },
      { text: 'El tipo Slice', link: '/es/rs/guia/parte_2_ownership/03_El_Tipo_Slice' }
    ]
  },

  // ── Parte III: Modelado de datos ──────────────
  {
    text: 'Parte III · Modelando datos',
    collapsed: true,
    items: [
      { text: 'Definiendo e instanciando Structs', link: '/es/rs/guia/parte_3_modelando_datos/01_Definiendo_Structs' },
      { text: 'Un programa de ejemplo con Structs', link: '/es/rs/guia/parte_3_modelando_datos/02_Ejemplo_Usando_Structs' },
      { text: 'Sintaxis de métodos (impl)', link: '/es/rs/guia/parte_3_modelando_datos/03_Sintaxis_de_Metodos' },
      { text: 'Definiendo Enums', link: '/es/rs/guia/parte_3_modelando_datos/04_Definiendo_un_Enum' },
      { text: 'Match: coincidencia de patrones', link: '/es/rs/guia/parte_3_modelando_datos/05_Match_Coincidencia_de_Patrones' },
      { text: 'Control conciso: if let y while let', link: '/es/rs/guia/parte_3_modelando_datos/06_Control_Conciso_if_let' }
    ]
  },

  // ── Parte IV: Organización de proyectos ───────
  {
    text: 'Parte IV · Organización de proyectos',
    collapsed: true,
    items: [
      { text: 'Paquetes y Crates', link: '/es/rs/guia/parte_4_organizacion_de_proyectos/01_Paquetes_y_Crates' },
      { text: 'Módulos y control de alcance', link: '/es/rs/guia/parte_4_organizacion_de_proyectos/02_Modulos_y_Alcance' },
      { text: 'Rutas (Paths)', link: '/es/rs/guia/parte_4_organizacion_de_proyectos/03_Rutas_Paths' },
      { text: 'Llevando rutas al scope con use', link: '/es/rs/guia/parte_4_organizacion_de_proyectos/04_use' },
      { text: 'Separando módulos en archivos', link: '/es/rs/guia/parte_4_organizacion_de_proyectos/05_Separar_Modulos_en_Archivos' }
    ]
  },

  // ── Parte V: Colecciones ──────────────────────
  {
    text: 'Parte V · Colecciones de datos',
    collapsed: true,
    items: [
      { text: 'Vectores', link: '/es/rs/guia/parte_5_colecciones/01_Vectores' },
      { text: 'String y el texto UTF-8', link: '/es/rs/guia/parte_5_colecciones/02_String_y_UTF-8' },
      { text: 'HashMap', link: '/es/rs/guia/parte_5_colecciones/03_HashMap' }
    ]
  },

  // ── Parte VI: Abstracción y genéricos ─────────
  {
    text: 'Parte VI · Abstracción y código genérico',
    collapsed: true,
    items: [
      { text: 'Tipos de datos genéricos', link: '/es/rs/guia/parte_6_abstraccion_y_genericos/01_Tipos_de_Datos_Genericos' },
      { text: 'Traits: comportamiento compartido', link: '/es/rs/guia/parte_6_abstraccion_y_genericos/02_Traits_Comportamiento_Compartido' },
      { text: 'Lifetimes: validando referencias', link: '/es/rs/guia/parte_6_abstraccion_y_genericos/03_Lifetimes_Validando_Referencias' }
    ]
  },

  // ── Parte VII: Manejo de errores ──────────────
  {
    text: 'Parte VII · Manejo de errores',
    collapsed: true,
    items: [
      { text: 'Errores irrecuperables con panic!', link: '/es/rs/guia/parte_7_manejo_de_errores/01_Errores_Irrecuperables_panic' },
      { text: 'Errores recuperables con Result', link: '/es/rs/guia/parte_7_manejo_de_errores/02_Errores_Recuperables_Result' },
      { text: '¿panic! o no panic!?', link: '/es/rs/guia/parte_7_manejo_de_errores/03_Panic_o_no_panic' }
    ]
  },

  // ── Parte VIII: Tests ─────────────────────────
  {
    text: 'Parte VIII · Escribiendo tests automatizados',
    collapsed: true,
    items: [
      { text: 'Cómo escribir tests', link: '/es/rs/guia/parte_8_tests/01_Como_Escribir_Tests' },
      { text: 'Controlando cómo se ejecutan', link: '/es/rs/guia/parte_8_tests/02_Controlando_Tests' },
      { text: 'Organización de los tests', link: '/es/rs/guia/parte_8_tests/03_Organizacion_de_los_Tests' }
    ]
  },

  // ── Parte IX: Proyecto final CLI ──────────────
  {
    text: 'Parte IX · Proyecto final: un CLI real',
    collapsed: true,
    items: [
      { text: 'Aceptando argumentos de línea de comandos', link: '/es/rs/guia/parte_9_proyecto_final_cli/01_Aceptar_Argumentos_CLI' },
      { text: 'Leyendo un archivo', link: '/es/rs/guia/parte_9_proyecto_final_cli/02_Leyendo_un_Archivo' },
      { text: 'Refactorizando: modularidad y errores', link: '/es/rs/guia/parte_9_proyecto_final_cli/03_Refactorizar_Modularidad_y_Errores' },
      { text: 'Desarrollando con TDD', link: '/es/rs/guia/parte_9_proyecto_final_cli/04_Desarrollando_con_TDD' },
      { text: 'Variables de entorno', link: '/es/rs/guia/parte_9_proyecto_final_cli/05_Variables_de_Entorno' },
      { text: 'Escribiendo al error estándar (stderr)', link: '/es/rs/guia/parte_9_proyecto_final_cli/06_Mensajes_de_Error_Estandar' }
    ]
  },

  // ── Parte X: Avanzado ─────────────────────────
  {
    text: 'Parte X · Rust de nivel avanzado',
    collapsed: true,
    items: [
      { text: 'Cierres y programación funcional', link: '/es/rs/guia/parte_10_avanzado/01_Cierres_y_Programacion_Funcional' },
      { text: 'Iteradores: el alma del ecosistema', link: '/es/rs/guia/parte_10_avanzado/02_Iteradores' },
      { text: 'Punteros inteligentes (Box, Rc, RefCell)', link: '/es/rs/guia/parte_10_avanzado/03_Punteros_Inteligentes' },
      { text: 'Concurrencia sin miedo', link: '/es/rs/guia/parte_10_avanzado/04_Concurrencia_sin_Miedo' },
      { text: 'Cargo avanzado y publicación de crates', link: '/es/rs/guia/parte_10_avanzado/05_Cargo_Avanzado_y_Publicacion' }
    ]
  }
]