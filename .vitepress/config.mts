import { defineConfig } from 'vitepress'
import { sidebarEsCpp } from './sidebars/es/es-cpp'
import { sidebarEsC } from './sidebars/es/es-c'
import { sidebarEsRs } from './sidebars/es/es-rs'
import { sidebarEsAsm } from './sidebars/es/es-asm'

export default defineConfig({
  title: "Code Universe",
  description: "Documentación Multi-lenguaje",
  srcDir: 'src',
  
  vite: {
    publicDir: '../public'
  },

  head: [['link', { rel: 'icon', type: 'image/png', href: '/img/code-universe-favicon.webp' }]],

  transformPageData(pageData) {
    const path = pageData.relativePath;
    let iconName = 'code-universe-favicon.webp';
    if (path.includes('cpp/')) iconName = 'cpp-favicon.svg';
    else if (path.includes('c/')) iconName = 'c-favicon.svg';
    else if (path.includes('csharp/')) iconName = 'csharp-favicon.svg';
    else if (path.includes('rs/')) iconName = 'rust-favicon.svg';

    const fullIconPath = `/favicons/${iconName}`;
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
            { text: 'C#', link: '/es/csharp/' },
            { text: 'Rust', link: '/es/rs/' },
            { text: 'ASM', link: '/es/asm/' },
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
            { text: 'C++', link: '/en/cpp/' },
            { text: 'C', link: '/en/c/' },
            { text: 'C#', link: '/en/csharp/' },
            { text: 'Rust', link: '/en/rs/' },
            { text: 'ASM', link: '/en/asm/' },
          ]}
        ]
      }
    }
  },

  themeConfig: {
    sidebar: {
      '/es/cpp/': sidebarEsCpp,
      '/es/c/': sidebarEsC,
      '/es/csharp/': [],
      '/es/rs/': sidebarEsRs,
      '/es/asm/': sidebarEsAsm,
      '/en/cpp/': [],
      '/en/c/': [],
      '/en/csharp/': [],
      '/en/rs/': [],
      '/en/asm/': [],
    },

    // SOCIAL LINKS
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Fabrizio-Franco1405/Code-Universe' }
    ]
  }
})