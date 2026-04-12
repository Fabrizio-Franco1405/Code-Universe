import { defineConfig } from 'vitepress'
import { sidebarEsCpp } from './sidebars/es/es-cpp'
import { sidebarEsRs } from './sidebars/es/es-rs'

export default defineConfig({
  title: "Code Universe",
  description: "Documentación Multi-lenguaje",
  srcDir: 'src',

  head: [['link', { rel: 'icon', type: 'image/png', href: '../assets/favicons/rust-favicon-32.png' }]],

  transformPageData(pageData) {
    const path = pageData.relativePath;
    let iconName = 'c-favicon-32.png'; 
    if (path.includes('rs/')) iconName = 'rust-favicon-32.png';
    else if (path.includes('cpp/')) iconName = 'cpp-favicon-32.png';
    else if (path.includes('c/')) iconName = 'c-favicon-32.png';

    const fullIconPath = `/assets/favicons/${iconName}`;
    pageData.frontmatter.head = [['link', { rel: 'icon', type: 'image/png', href: fullIconPath }]];
  },

  locales: {
    root: {
      label: 'Español',
      lang: 'es',
      link: '/es/',
      themeConfig: {
        nav: [
          { text: 'Inicio', link: '/es/' },
          { text: 'Lenguajes', items: [
            { text: 'C++', link: '/es/cpp/' },
            { text: 'C', link: '/es/c/' },
            { text: 'Rust', link: '/es/rs/' },
          ]}
        ]
      }
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Languages', items: [
            { text: 'Rust', link: '/en/rs/' },
            { text: 'C++', link: '/en/cpp/' },
            { text: 'C', link: '/en/c/' }
          ]}
        ]
      }
    }
  },

  themeConfig: {
    // VitePress permite definir Sidebars Y Navs específicos por ruta aquí
    // Esto evita duplicar los idiomas en el selector
    
    // CONFIGURACIÓN DE SIDEBARS
    sidebar: {
      '/es/cpp/': sidebarEsCpp,
      '/es/rs/': sidebarEsRs,
      '/es/c/': [], // Aquí iría tu sidebar de C
      '/en/cpp/': [], // Aquí iría el de C++ en inglés
      '/en/rs/': [],
    },

    // SOCIAL LINKS
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Fabrizio-Franco1405/Code-Universe' }
    ]
  }
})