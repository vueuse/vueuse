import type { EventHookOn } from '@vueuse/shared'
import type { ComputedRef, ShallowRef } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import type { Supportable } from '../types'
import { createEventHook, tryOnScopeDispose } from '@vueuse/shared'
import { computed, shallowReadonly, shallowRef } from 'vue'
import { defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'
import { useSupported } from '../useSupported'

// Web NFC types are not yet part of lib.dom

export interface NDEFRecordInit {
  recordType: string
  mediaType?: string
  id?: string
  encoding?: string
  lang?: string
  data?: string | BufferSource | NDEFMessageInit
}

export interface NDEFMessageInit {
  records: NDEFRecordInit[]
}

export type NDEFMessageSource = string | BufferSource | NDEFMessageInit

export interface NDEFRecord {
  readonly recordType: string
  readonly mediaType?: string
  readonly id?: string
  readonly data?: DataView
  readonly encoding?: string
  readonly lang?: string
  toRecords?: () => NDEFRecord[]
}

export interface NDEFMessage {
  readonly records: ReadonlyArray<NDEFRecord>
}

export interface NDEFReadingEvent extends Event {
  readonly serialNumber: string
  readonly message: NDEFMessage
}

export interface NDEFReader extends EventTarget {
  scan: (options?: { signal?: AbortSignal }) => Promise<void>
  write: (message: NDEFMessageSource, options?: { overwrite?: boolean, signal?: AbortSignal }) => Promise<void>
  makeReadOnly: (options?: { signal?: AbortSignal }) => Promise<void>
}

export interface UseWebNFCOptions extends ConfigurableWindow {
  /**
   * Start scanning immediately.
   *
   * @default false
   */
  immediate?: boolean
}

export interface UseWebNFCWriteOptions {
  /**
   * @default true
   */
  overwrite?: boolean
  signal?: AbortSignal
}

export interface UseWebNFCMakeReadOnlyOptions {
  signal?: AbortSignal
}

export interface UseWebNFCReturn extends Supportable {
  isScanning: Readonly<ShallowRef<boolean>>
  serialNumber: Readonly<ShallowRef<string | undefined>>
  message: Readonly<ShallowRef<NDEFMessage | undefined>>
  records: ComputedRef<ReadonlyArray<NDEFRecord>>
  /**
   * Decoded contents of all `text` records of the last read message
   */
  texts: ComputedRef<string[]>
  error: Readonly<ShallowRef<unknown>>

  scan: () => Promise<void>
  stop: () => void
  write: (message: NDEFMessageSource, options?: UseWebNFCWriteOptions) => Promise<void>
  /**
   * Permanently makes the tag read-only. This cannot be undone.
   */
  makeReadOnly: (options?: UseWebNFCMakeReadOnlyOptions) => Promise<void>

  onReading: EventHookOn<NDEFReadingEvent>
  onReadingError: EventHookOn<Event>
}

/**
 * Reactive [Web NFC API](https://developer.mozilla.org/en-US/docs/Web/API/Web_NFC_API)
 *
 * @see https://vueuse.org/useWebNFC
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useWebNFC(options: UseWebNFCOptions = {}): UseWebNFCReturn {
  const {
    immediate = false,
    window = defaultWindow,
  } = options

  const isSupported = useSupported(() => window && 'NDEFReader' in window)

  const isScanning = shallowRef(false)
  const serialNumber = shallowRef<string>()
  const message = shallowRef<NDEFMessage>()
  const records = computed<ReadonlyArray<NDEFRecord>>(() => message.value?.records ?? [])
  const texts = computed(() => records.value
    .filter(record => record.recordType === 'text' && record.data)
    .map(record => new TextDecoder(record.encoding ?? 'utf-8').decode(record.data)))
  const error = shallowRef<unknown>()

  const readingHook = createEventHook<NDEFReadingEvent>()
  const readingErrorHook = createEventHook<Event>()

  // Created lazily and shared between scan and write, so a write tap is seen by the same reader
  const reader = shallowRef<NDEFReader>()
  function getReader(): NDEFReader {
    return reader.value ??= new (window as any).NDEFReader()
  }

  // A reader only fires these while a scan is active, so the listeners can stay attached across scans
  useEventListener(reader, 'reading', (event: NDEFReadingEvent) => {
    serialNumber.value = event.serialNumber
    message.value = event.message
    readingHook.trigger(event)
  }, { passive: true })
  useEventListener(reader, 'readingerror', (event: Event) => {
    readingErrorHook.trigger(event)
  }, { passive: true })

  let scanController: AbortController | undefined

  async function scan() {
    if (!isSupported.value || scanController)
      return

    error.value = undefined
    const controller = new AbortController()
    scanController = controller
    const { signal } = controller
    const ndef = getReader()

    signal.addEventListener('abort', () => {
      isScanning.value = false
      if (scanController === controller)
        scanController = undefined
    }, { once: true })

    try {
      await ndef.scan({ signal })
      if (!signal.aborted)
        isScanning.value = true
    }
    catch (e) {
      // if an aborted scan was canceled on purpose (stop / dispose) or superseded by a newer scan
      if (signal.aborted)
        return
      error.value = e
      controller.abort()
    }
  }

  function stop() {
    scanController?.abort()
  }

  // Aborted on scope dispose so a pending write / makeReadOnly does not write to (or permanently lock)
  // a later tag tap after the component no longer exists
  const disposeController = new AbortController()

  function withDisposeSignal(signal?: AbortSignal): AbortSignal {
    return signal ? AbortSignal.any([signal, disposeController.signal]) : disposeController.signal
  }

  async function write(source: NDEFMessageSource, writeOptions: UseWebNFCWriteOptions = {}) {
    if (!isSupported.value)
      return

    error.value = undefined
    try {
      await getReader().write(source, { overwrite: true, ...writeOptions, signal: withDisposeSignal(writeOptions.signal) })
    }
    catch (e) {
      error.value = e
      throw e
    }
  }

  async function makeReadOnly(makeReadOnlyOptions?: UseWebNFCMakeReadOnlyOptions) {
    if (!isSupported.value)
      return

    error.value = undefined
    try {
      await getReader().makeReadOnly({ ...makeReadOnlyOptions, signal: withDisposeSignal(makeReadOnlyOptions?.signal) })
    }
    catch (e) {
      error.value = e
      throw e
    }
  }

  if (immediate)
    void scan()

  tryOnScopeDispose(() => {
    stop()
    disposeController.abort()
  })

  return {
    isSupported,
    isScanning: shallowReadonly(isScanning),
    serialNumber: shallowReadonly(serialNumber),
    message: shallowReadonly(message),
    records,
    texts,
    error: shallowReadonly(error),
    scan,
    stop,
    write,
    makeReadOnly,
    onReading: readingHook.on,
    onReadingError: readingErrorHook.on,
  }
}
