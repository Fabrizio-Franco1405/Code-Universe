import { defineConfig } from 'vitepress'
import { sidebarEsCpp } from './sidebars/es/es-cpp'
import { sidebarEsRs } from './sidebars/es/es-rs'

export default defineConfig({
  title: "Code Universe",
  description: "Documentación Multi-lenguaje",
  srcDir: 'src',

  head: [['link', { rel: 'icon', type: 'image/png', href: '../assets/favicons/code-universe-favicon.webp' }]],

  transformPageData(pageData) {
    const path = pageData.relativePath;
    let iconName = 'code-universe-favicon.webp';
    if (path.includes('rs/')) iconName = 'rust-favicon.svg';
    else if (path.includes('cpp/')) iconName = 'cpp-favicon.svg';
    else if (path.includes('c/')) iconName = 'c-favicon.svg';
    else if (path.includes('cs/')) iconName = 'cs-favicon.svg';

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
            { text: 'C#', link: '/es/cs/' },
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
            { text: 'C++', link: '/en/cpp/' },
            { text: 'C', link: '/en/c/' },
            { text: 'C#', link: '/en/cs/' },
            { text: 'Rust', link: '/en/rs/' },
          ]}
        ]
      }
    }
  },

  themeConfig: {
    sidebar: {
      '/es/cpp/': sidebarEsCpp,
      '/es/rs/': sidebarEsRs,
      '/es/c/': [],
      '/en/cpp/': [],
      '/en/rs/': [],
    },

    // SOCIAL LINKS
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Fabrizio-Franco1405/Code-Universe' }
    ]
  }
})