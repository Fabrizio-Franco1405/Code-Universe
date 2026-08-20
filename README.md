# 💠 Code Universe

> **"En el vasto universo del código, cada línea es una estrella que ilumina el camino del conocimiento."**

**Code Universe** es un ecosistema de documentación técnica estandarizado y visualmente inmersivo. Reúne guías profundas de lenguajes de alto rendimiento bajo una arquitectura modular, donde cada lenguaje es una *galaxia* independiente con su propia identidad visual, unificadas por una sola infraestructura de navegación.

<p align="center">
  <img src="https://img.shields.io/badge/Engine-VitePress-646cff?style=for-the-badge&logo=vite&logoColor=white" alt="VitePress">
  <img src="https://img.shields.io/badge/Package_Mgr-pnpm-f69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm">
  <img src="https://img.shields.io/badge/i18n-ES_/_EN-8b5cf6?style=for-the-badge" alt="i18n ES/EN">
  <img src="https://img.shields.io/badge/Licencia-CC_BY--NC--ND_4.0-999999?style=for-the-badge&logo=creativecommons&logoColor=white" alt="CC BY-NC-ND 4.0">
</p>

---

## 🌌 Galaxias del Ecosistema

Cada galaxia posee su propio tema visual (colores, gradientes y sombras) inyectado por CSS y una guía técnica completa.

| Galaxia | Ruta ES | Guía | Estado |
| :--- | :---: | :---: | :--- |
| **C++** | `/es/cpp/` | 115 páginas · 6 partes | 🟢 **Completa** |
| **C** | `/es/c/` | 53 páginas · 10 partes | 🟢 **Completa** |
| **Rust** | `/es/rs/` | 47 páginas · 10 partes | 🟢 **Completa** |
| **ASM** | `/es/asm/` | 37 páginas · 8 partes | 🟢 **Completa** |
| **C#** | `/es/csharp/` | — | 🟠 **Próximamente** |

> 🇬🇧 **Mirror en Inglés:** Las rutas espejo `/en/*` y las landings de cada galaxia ya están activas. La traducción de las guías se publica progresivamente.

## 🧭 Navegación

- **Root (ES):** `/es/` — contenido principal de las guías.
- **Mirror (EN):** `/en/` — réplica estructural sincronizada con el idioma inglés.
- Cada ruta hereda la identidad visual de su galaxia mediante `pageClass`.

## 🏗️ Arquitectura Técnica

* **Identidad por lenguaje:** Sistema de CSS modulado (`base.css` + `lenguajes/*.css`) que cambia colores, sombras y gradientes por galaxia sin tocar la estructura base.
* **Dual-Path i18n:** Internacionalización nativa con rutas espejo **Español (Root)** e **Inglés (Mirror)**.
* **Assets optimizados:** Iconos SVG con soporte `currentColor` y adaptabilidad claro/oscuro; imágenes y favicons por lenguaje.
* **Layouts estandarizados:** Componentes y estilos reutilizables (`cu-*`) para landings, tarjetas y guías legibles y libres de distracciones.

## 📂 Estructura del Repositorio

```text
Code-Universe/
├── src/                      # Contenido (Markdown)
│   ├── es/                   #   Español (Root)
│   │   ├── c/                #     Galaxia C
│   │   ├── cpp/              #     Galaxia C++
│   │   ├── rs/               #     Galaxia Rust
│   │   ├── asm/              #     Galaxia ASM
│   │   └── csharp/           #     Galaxia C# (landing)
│   ├── en/                   #   Inglés (Mirror)
│   └── index.md              # Redirect raíz → /es/
├── public/                   # Assets estáticos
│   ├── icons/                #   Iconos de lenguajes
│   ├── favicons/             #   Favicons por galaxia
│   ├── img/                  #   Imágenes globales
│   └── {c,cpp,rs,asm}/       #   Recursos por lenguaje
└── .vitepress/
    ├── config.mts            # Configuración global
    ├── sidebars/             # Sidebars por idioma y lenguaje
    └── theme/
        └── styles/
            ├── base.css      # Componentes compartidos (cu-*)
            ├── general/      # Estilos globales y home
            └── lenguajes/    # Temas por galaxia (*.css)
```

## 🚀 Desarrollo Local

El proyecto usa **pnpm** como gestor de dependencias y **VitePress** como motor de renderizado estático.

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm run docs:dev

# Compilar para producción
pnpm run docs:build
```

## 🗺️ Roadmap

- [x] **Core:** Arquitectura i18n y sistema de rutas espejo ES/EN.
- [x] **Design:** Temas dinámicos por galaxia (Acero ASM, Azul C++, Verde C, Naranja Rust, Púrpura C#).
- [x] **Content ES:** Guías completas de C++, Rust y ASM.
- [ ] **Content EN:** Traducción completa de las guías al inglés.
- [ ] **Content ES:** Guía de C# y C (primera parte).

## 🤝 Contribuciones

Las contribuciones son bienvenidas y valoradas: correcciones, mejoras de contenido, traducciones y reportes de errores se proponen mediante *pull requests* o issues en GitHub. **Contribuir no convierte a nadie en autor ni dueño del contenido.**

⚠️ **Protección del contenido:** Todo el contenido de este repositorio es **obra original** de su autor y está protegido bajo la licencia **CC BY-NC-ND 4.0**. Queda **prohibido** reproducir, redistribuir o republicar este proyecto (o partes de él) en otras fuentes, sitios o plataformas **sin autorización previa**, incluyendo su uso con fines comerciales.

- 📖 Puedes **leer**, **estudiar** y **contribuir** al proyecto desde GitHub.
- 🔀 Contribuir (fork + *pull request*) mejora el proyecto *en este repositorio*.
- 🚫 **No** puedes copiar el contenido y publicarlo en otros sitios como si fuera tuyo.

Consulta el archivo [`LICENSE`](./LICENSE) para los términos completos.

> [!TIP]
> 💡 Si quieres usar o traducir el contenido para otro proyecto, **escríbele al autor** y pide permiso: lo más probable es que se conceda con la atribución adecuada.

---

> [!IMPORTANT]
> ### ✒️ Autoría y Desarrollo
> **Diseñado y forjado por:** [**Fabrizio Franco**](https://github.com/Fabrizio-Franco1405)
>
> **Especialidad:** Ingeniería en Informática | *Computer Science Student*
>
> **Ubicación:** 📍 Venezuela 🇻🇪

---

<p align="center">
  <img src="https://img.shields.io/badge/Code_Universe_Hub-2026-8b5cf6?style=flat-square" alt="Code Universe Hub">
</p>