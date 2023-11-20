import type { MaybeRefOrGetter, Ref } from 'vue-demi'
import { ref } from 'vue-demi'
import { toValue } from '@vueuse/shared'
import type { ConfigurableDocument, ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

export interface UsePrintOptions extends ConfigurableWindow, ConfigurableDocument {
  /**
   * @default 'allow-modals allow-same-origin'
   */
  sandbox?: false | string

  /**
   * @default 0
   */
  delay?: number
}

export interface UsePrintReturn {
  pending: Ref<boolean>
  printUrl: (
    url?: MaybeRefOrGetter<string>,
    options?: UsePrintOptions,
  ) => Promise<void>
  printSource: (
    source?: MaybeRefOrGetter<string>,
    options?: UsePrintOptions,
  ) => Promise<void>
}

export function usePrint(): UsePrintReturn
export function usePrint(initialValue: MaybeRefOrGetter<string>): UsePrintReturn
export function usePrint(defaultOptions: UsePrintOptions): UsePrintReturn
export function usePrint(
  initialValue: MaybeRefOrGetter<string>,
  defaultOptions: UsePrintOptions,
): UsePrintReturn
export function usePrint(...args: any[]): UsePrintReturn {
  const defaultOptions: UsePrintOptions
    = args.length === 1 ? args[0] : args[1] ?? {}
  const initialValue: MaybeRefOrGetter<string>
    = args.length === 1 ? undefined : args[0]

  const pending = ref(false)

  function printUrl(url?: MaybeRefOrGetter<string>, options?: UsePrintOptions) {
    const value = url ? toValue(url) : initialValue ? toValue(initialValue) : undefined

    if (!value)
      return Promise.resolve()

    return print({ src: value }, options ?? defaultOptions)
  }

  function printSource(source?: MaybeRefOrGetter<string>, options?: UsePrintOptions) {
    const value = source ? toValue(source) : initialValue ? toValue(initialValue) : undefined

    if (!value)
      return Promise.resolve()

    return print({ srcdoc: value }, options ?? defaultOptions)
  }

  function print(attrs: { src: string } | { srcdoc: string }, options: UsePrintOptions) {
    const {
      window = defaultWindow,
      sandbox = 'allow-modals allow-same-origin',
      delay = 0,
    } = options ?? defaultOptions
    const document = defaultOptions.document ?? window?.document

    if (!document || pending.value)
      return Promise.resolve()

    pending.value = true

    return new Promise<void>((resolve) => {
      let timer: ReturnType<typeof setTimeout> | undefined

      function startPrint(this: HTMLIFrameElement) {
        this.contentWindow?.addEventListener('beforeunload', closePrint)
        this.contentWindow?.addEventListener('afterprint', closePrint)

        if (timer)
          clearTimeout(timer)

        timer = setTimeout(() => {
          timer = undefined
          this.contentWindow?.print()
        }, delay)
      }

      function closePrint(this: HTMLIFrameElement) {
        if (timer) {
          clearTimeout(timer)
          timer = undefined
        }

        try {
          this.remove()
        }
        catch {}

        pending.value = false
        resolve()
      }

      const iframe = document.createElement('iframe')
      try {
        iframe.addEventListener('load', startPrint)
        iframe.style.display = 'none'

        if (sandbox !== false) {
          // @ts-expect-error we can set sandbox before append to document
          iframe.sandbox = sandbox
        }

        if ('src' in attrs)
          iframe.src = attrs.src

        else
          iframe.srcdoc = attrs.srcdoc

        document.body.append(iframe)
      }
      catch {}
    })
  }

  return {
    pending,
    printUrl,
    printSource,
  }
}
