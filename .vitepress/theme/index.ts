// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import { watchEffect } from 'vue'
import './styles/index.css'

export default {
  extends: DefaultTheme,
  setup() {
    const { page } = useData()

    watchEffect(() => {
      if (typeof window === 'undefined') return

      document.body.classList.forEach(cls => {
        if (cls.startsWith('lang-')) document.body.classList.remove(cls)
      })

      const path = page.value.relativePath
      if (path.includes('/rs/') || path.includes('/rust/')) {
        document.body.classList.add('lang-rust')
      } else if (path.includes('/cpp/')) {
        document.body.classList.add('lang-cpp')
      } else if (path.includes('/c/')) {
        document.body.classList.add('lang-c')
      } else if (path.includes('/cs/')) {
        document.body.classList.add('lang-csharp')
      }
    })
  }
}