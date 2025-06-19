import { defaultNavigator } from '../_configurable'

export const COMBINATION_SEPARATOR = '_'
export const SEQUENCE_SEPARATOR = '-'
export const SEQUENCE_DELAY_MS_DEFAULT = 300

export interface KeybindHandlerParams {
  lastEvent: KeyboardEvent
}

export type KeybindHandler = (params: KeybindHandlerParams) => void
export type KeybindsDef = { [key in string]?: KeybindHandler }

export function isMacOS(nav: Navigator | undefined = defaultNavigator) {
  return !!nav && !!nav.userAgent && /Macintosh;/.test(nav.userAgent)
}

function isHTMLElement(target: unknown): target is HTMLElement {
  return (typeof target === 'object' && !!target && 'tagName' in target && !!target.tagName)
}

export type IncludeElement = (e: KeyboardEvent) => boolean

export const defaultIncludeEvent: IncludeElement = (e) => {
  const target = e.target

  if (!isHTMLElement(target)) {
    return true
  }

  if (
    ['BUTTON', 'INPUT', 'TEXTAREA'].includes(target.tagName)
    || ['plaintext-only', 'true'].includes(target.contentEditable)
  ) {
    return false
  }

  return true
}

export type GetKeyCode = (e: KeyboardEvent) => string

export const defaultGetKeyCode: GetKeyCode = (e) => {
  return e.code
}

export type GetKeyCodeWithModifiers = (e: KeyboardEvent) => string

export interface CreateGetKeyCodeWithModifiersOptions {
  getKeyCode: GetKeyCode
}

export function createDefaultGetKeyCodeWithModifiers(deps: CreateGetKeyCodeWithModifiersOptions): GetKeyCodeWithModifiers {
  return (e: KeyboardEvent): string => {
    const keyParts: string[] = []

    if (e.altKey && e.key !== 'Alt')
      keyParts.push('alt')
    if (e.ctrlKey && e.key !== 'Control')
      keyParts.push('ctrl')
    if (e.metaKey && e.key !== 'Meta')
      keyParts.push('meta')
    if (e.shiftKey && e.key !== 'Shift')
      keyParts.push('shift')

    keyParts.push(deps.getKeyCode(e))

    return keyParts.join(COMBINATION_SEPARATOR)
  }
}

interface CreateNormalizeCombinedKeyCodeOptions {
  macOS: boolean
}

export type NormalizeCombinedKeyCode = (combinedKeyCode: string) => string

export function createDefaultNormalizeCombinedKeyCode(deps: CreateNormalizeCombinedKeyCodeOptions): NormalizeCombinedKeyCode {
  if (deps.macOS) {
    return (combinedKeyCode: string) => combinedKeyCode
  }

  return (combinedKeyCode: string) => {
    return combinedKeyCode
      .split(COMBINATION_SEPARATOR)
      .map(keyPart => keyPart === 'meta' ? 'ctrl' : keyPart)
      .join(COMBINATION_SEPARATOR)
  }
}

interface NormalizeKeybindsDefOptions {
  normalizeCombinedKeyCode: NormalizeCombinedKeyCode
}

export function normalizeKeybindsDef(keybinds: KeybindsDef, { normalizeCombinedKeyCode }: NormalizeKeybindsDefOptions) {
  return Object.fromEntries(
    Object.entries(keybinds)
      .map(([key, value]) => {
        return [normalizeCombinedKeyCode(key), value]
      }),
  )
}

interface KeybindNode {
  handler?: KeybindHandler
  // combined key code to next keybind
  next?: { [key in string]?: KeybindNode }
}

export type KeybindNext = Exclude<KeybindNode['next'], undefined>

/**
 * Build prefix tree (trie) from key code notation.
 * Note that this only handles sequence separator and is independent of key codes.
 */
export function buildKeybindTree(keybinds: KeybindsDef): KeybindNext {
  const tree: KeybindNext = {}

  for (const [keyCodeCombined, handler] of Object.entries(keybinds)) {
    const keybindSequence = keyCodeCombined.split(SEQUENCE_SEPARATOR)

    let currentNode = tree

    for (const [index, keybind] of keybindSequence.entries()) {
      if (!currentNode[keybind]) {
        currentNode[keybind] = {}
      }

      if (index + 1 === keybindSequence.length) {
        currentNode[keybind].handler = handler
      }
      else {
        if (!currentNode[keybind].next) {
          currentNode[keybind].next = {}
        }

        currentNode = currentNode[keybind].next
      }
    }
  }

  return tree
}
