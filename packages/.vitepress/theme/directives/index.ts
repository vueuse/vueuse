import type { App } from 'vue'
import { setupCopyDirective } from './copy'

export function setupGlobDirectives(app: App) {
  setupCopyDirective(app)
}
