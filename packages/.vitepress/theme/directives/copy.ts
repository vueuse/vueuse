import type { App, Directive } from 'vue'
import { useClipboard } from '@vueuse/core'

export function copyDirective(): Directive {
  const { copy } = useClipboard()
  return {
    mounted: (el) => {
      el.onclick = () => {
        const parent = el.parentElement
        if (!parent)
          return
        const isShell
          = parent.classList.contains('language-sh')
          || parent.classList.contains('language-bash')
        let { innerText: text = '' } = el.nextElementSibling
        if (isShell)
          text = text.replace(/^ *\$ /gm, '')
        copy(text).then(() => {
          el.classList.add('copied')
          setTimeout(() => {
            el.classList.remove('copied')
          }, 3000)
        })
      }
    },
  }
}

export function setupCopyDirective(app: App) {
  app.directive('copy', copyDirective())
}
