import type { NDEFMessage, NDEFReadingEvent } from './index'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useSetup } from '../../.test'
import { useWebNFC } from './index'

function createMockWindow() {
  const readers: MockNDEFReader[] = []
  let scanSignal: AbortSignal | undefined

  // shared across readers so tests can configure them before the (lazy) reader exists
  const scan = vi.fn(async (options?: { signal?: AbortSignal }) => {
    scanSignal = options?.signal
  })
  const write = vi.fn(async (_message: unknown, _options?: unknown) => {})
  const makeReadOnly = vi.fn(async (_options?: unknown) => {})

  class MockNDEFReader extends EventTarget {
    scan = scan
    write = write
    makeReadOnly = makeReadOnly

    constructor() {
      super()
      readers.push(this)
    }
  }

  const window = { NDEFReader: MockNDEFReader } as unknown as Window

  return {
    window,
    scan,
    write,
    makeReadOnly,
    get scanSignal() {
      return scanSignal
    },
    get readerCount() {
      return readers.length
    },
    // like the real NDEFReader, events are only fired while a scan is active
    dispatchReading(serialNumber: string, message: NDEFMessage) {
      if (!scanSignal || scanSignal.aborted)
        return
      const event = new Event('reading') as NDEFReadingEvent
      Object.assign(event, { serialNumber, message })
      readers.forEach(reader => reader.dispatchEvent(event))
    },
    dispatchReadingError() {
      if (!scanSignal || scanSignal.aborted)
        return
      readers.forEach(reader => reader.dispatchEvent(new Event('readingerror')))
    },
  }
}

function rejectOnAbort(options?: { signal?: AbortSignal }) {
  return new Promise<void>((_, reject) => {
    options?.signal?.addEventListener('abort', () => {
      reject(new DOMException('aborted', 'AbortError'))
    }, { once: true })
  })
}

function createMessage(text: string): NDEFMessage {
  return {
    records: [{
      recordType: 'text',
      encoding: 'utf-8',
      data: new DataView(new TextEncoder().encode(text).buffer),
    }],
  }
}

describe('useWebNFC', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(useWebNFC).toBeDefined()
  })

  it('should not be supported without NDEFReader', () => {
    const vm = useSetup(() => {
      const api = useWebNFC({ window: {} as Window })
      return { api }
    })

    expect(vm.api.isSupported.value).toBe(false)

    vm.unmount()
  })

  it('should have empty initial state', () => {
    const { window } = createMockWindow()
    const vm = useSetup(() => {
      const api = useWebNFC({ window })
      return { api }
    })

    expect(vm.api.isSupported.value).toBe(true)
    expect(vm.api.isScanning.value).toBe(false)
    expect(vm.api.serialNumber.value).toBeUndefined()
    expect(vm.api.message.value).toBeUndefined()
    expect(vm.api.records.value).toEqual([])
    expect(vm.api.error.value).toBeUndefined()

    vm.unmount()
  })

  it('should not scan until scan() is called', () => {
    const mock = createMockWindow()
    const vm = useSetup(() => {
      const api = useWebNFC({ window: mock.window })
      return { api }
    })

    expect(mock.scan).not.toHaveBeenCalled()

    vm.unmount()
  })

  it('should scan immediately with immediate option', async () => {
    const mock = createMockWindow()
    const vm = useSetup(() => {
      const api = useWebNFC({ window: mock.window, immediate: true })
      return { api }
    })

    await vi.waitFor(() => expect(vm.api.isScanning.value).toBe(true))
    expect(mock.scan).toHaveBeenCalledTimes(1)

    vm.unmount()
  })

  it('should update state and trigger onReading when a tag is read', async () => {
    const mock = createMockWindow()
    const onReading = vi.fn()
    const vm = useSetup(() => {
      const api = useWebNFC({ window: mock.window })
      api.onReading(onReading)
      return { api }
    })

    await vm.api.scan()
    expect(vm.api.isScanning.value).toBe(true)

    const message = createMessage('hello')
    mock.dispatchReading('04:a2:3b', message)

    expect(vm.api.serialNumber.value).toBe('04:a2:3b')
    expect(vm.api.message.value).toStrictEqual(message)
    expect(vm.api.records.value).toStrictEqual(message.records)
    expect(onReading).toHaveBeenCalledTimes(1)
    expect(onReading.mock.calls[0][0].serialNumber).toBe('04:a2:3b')

    vm.unmount()
  })

  it('should trigger onReading for every tap of the same tag', async () => {
    const mock = createMockWindow()
    const onReading = vi.fn()
    const vm = useSetup(() => {
      const api = useWebNFC({ window: mock.window })
      api.onReading(onReading)
      return { api }
    })

    await vm.api.scan()
    const message = createMessage('same')
    mock.dispatchReading('04:a2:3b', message)
    mock.dispatchReading('04:a2:3b', message)

    expect(onReading).toHaveBeenCalledTimes(2)

    vm.unmount()
  })

  it('should trigger onReadingError', async () => {
    const mock = createMockWindow()
    const onReadingError = vi.fn()
    const vm = useSetup(() => {
      const api = useWebNFC({ window: mock.window })
      api.onReadingError(onReadingError)
      return { api }
    })

    await vm.api.scan()
    mock.dispatchReadingError()

    expect(onReadingError).toHaveBeenCalledTimes(1)

    vm.unmount()
  })

  it('should set error when scan() fails', async () => {
    const mock = createMockWindow()
    const vm = useSetup(() => {
      const api = useWebNFC({ window: mock.window })
      return { api }
    })

    const failure = new DOMException('denied', 'NotAllowedError')
    mock.scan.mockRejectedValueOnce(failure)

    await expect(vm.api.scan()).resolves.toBeUndefined()
    expect(vm.api.error.value).toBe(failure)
    expect(vm.api.isScanning.value).toBe(false)

    vm.unmount()
  })

  it('should not set error when stop() cancels a pending scan', async () => {
    const mock = createMockWindow()
    const vm = useSetup(() => {
      const api = useWebNFC({ window: mock.window })
      return { api }
    })

    // like the real NDEFReader, a pending scan rejects with AbortError once its signal aborts
    mock.scan.mockImplementationOnce(rejectOnAbort)

    const pending = vm.api.scan()
    vm.api.stop()
    await pending

    expect(vm.api.error.value).toBeUndefined()
    expect(vm.api.isScanning.value).toBe(false)

    vm.unmount()
  })

  it('should not let a superseded scan overwrite the state of a newer scan', async () => {
    const mock = createMockWindow()
    const vm = useSetup(() => {
      const api = useWebNFC({ window: mock.window })
      return { api }
    })

    // the first scan only rejects after the second scan has started
    let rejectFirst!: (e: unknown) => void
    mock.scan.mockImplementationOnce(() => new Promise((_, reject) => {
      rejectFirst = reject
    }))

    const first = vm.api.scan()
    vm.api.stop()
    await vm.api.scan()
    expect(vm.api.isScanning.value).toBe(true)

    rejectFirst(new DOMException('aborted', 'AbortError'))
    await first

    expect(vm.api.error.value).toBeUndefined()
    expect(vm.api.isScanning.value).toBe(true)
    expect(mock.scanSignal?.aborted).toBe(false)

    vm.unmount()
  })

  it('should stop scanning and ignore further readings after stop()', async () => {
    const mock = createMockWindow()
    const onReading = vi.fn()
    const vm = useSetup(() => {
      const api = useWebNFC({ window: mock.window })
      api.onReading(onReading)
      return { api }
    })

    await vm.api.scan()
    vm.api.stop()

    expect(vm.api.isScanning.value).toBe(false)
    expect(mock.scanSignal?.aborted).toBe(true)

    mock.dispatchReading('04:a2:3b', createMessage('ignored'))
    expect(onReading).not.toHaveBeenCalled()
    expect(vm.api.serialNumber.value).toBeUndefined()

    vm.unmount()
  })

  it('should stop scanning on unmount', async () => {
    const mock = createMockWindow()
    const vm = useSetup(() => {
      const api = useWebNFC({ window: mock.window })
      return { api }
    })

    await vm.api.scan()
    vm.unmount()

    expect(mock.scanSignal?.aborted).toBe(true)
  })

  it('should share one reader between scan and write', async () => {
    const mock = createMockWindow()
    const vm = useSetup(() => {
      const api = useWebNFC({ window: mock.window })
      return { api }
    })

    await vm.api.scan()
    await vm.api.write('hello')

    expect(mock.readerCount).toBe(1)

    vm.unmount()
  })

  it('should write with overwrite enabled by default', async () => {
    const mock = createMockWindow()
    const vm = useSetup(() => {
      const api = useWebNFC({ window: mock.window })
      return { api }
    })

    await vm.api.write('hello')

    expect(mock.write).toHaveBeenCalledWith('hello', expect.objectContaining({ overwrite: true }))

    vm.unmount()
  })

  it('should pass write options through', async () => {
    const mock = createMockWindow()
    const vm = useSetup(() => {
      const api = useWebNFC({ window: mock.window })
      return { api }
    })

    const controller = new AbortController()
    const message = { records: [{ recordType: 'url', data: 'https://vueuse.org' }] }
    await vm.api.write(message, { overwrite: false, signal: controller.signal })

    expect(mock.write).toHaveBeenCalledWith(message, { overwrite: false, signal: expect.any(AbortSignal) })

    vm.unmount()
  })

  it('should abort write() when the passed signal aborts', async () => {
    const mock = createMockWindow()
    const vm = useSetup(() => {
      const api = useWebNFC({ window: mock.window })
      return { api }
    })

    mock.write.mockImplementationOnce((_message, options) => rejectOnAbort(options as { signal?: AbortSignal }))

    const controller = new AbortController()
    const pending = vm.api.write('hello', { signal: controller.signal })
    controller.abort()

    await expect(pending).rejects.toMatchObject({ name: 'AbortError' })

    vm.unmount()
  })

  it('should abort a pending write() on unmount', async () => {
    const mock = createMockWindow()
    const vm = useSetup(() => {
      const api = useWebNFC({ window: mock.window })
      return { api }
    })

    mock.write.mockImplementationOnce((_message, options) => rejectOnAbort(options as { signal?: AbortSignal }))

    const pending = vm.api.write('hello')
    vm.unmount()

    await expect(pending).rejects.toMatchObject({ name: 'AbortError' })
  })

  it('should set error and reject when write() fails', async () => {
    const mock = createMockWindow()
    const vm = useSetup(() => {
      const api = useWebNFC({ window: mock.window })
      return { api }
    })

    const failure = new DOMException('tag lost', 'NetworkError')
    mock.write.mockRejectedValueOnce(failure)

    await expect(vm.api.write('hello')).rejects.toBe(failure)
    expect(vm.api.error.value).toBe(failure)

    vm.unmount()
  })

  it('should call makeReadOnly on the reader', async () => {
    const mock = createMockWindow()
    const vm = useSetup(() => {
      const api = useWebNFC({ window: mock.window })
      return { api }
    })

    const controller = new AbortController()
    await vm.api.makeReadOnly({ signal: controller.signal })

    expect(mock.makeReadOnly).toHaveBeenCalledWith({ signal: expect.any(AbortSignal) })

    vm.unmount()
  })

  it('should abort makeReadOnly() when the passed signal aborts', async () => {
    const mock = createMockWindow()
    const vm = useSetup(() => {
      const api = useWebNFC({ window: mock.window })
      return { api }
    })

    mock.makeReadOnly.mockImplementationOnce(options => rejectOnAbort(options as { signal?: AbortSignal }))

    const controller = new AbortController()
    const pending = vm.api.makeReadOnly({ signal: controller.signal })
    controller.abort()

    await expect(pending).rejects.toMatchObject({ name: 'AbortError' })

    vm.unmount()
  })

  it('should abort a pending makeReadOnly() on unmount', async () => {
    const mock = createMockWindow()
    const vm = useSetup(() => {
      const api = useWebNFC({ window: mock.window })
      return { api }
    })

    mock.makeReadOnly.mockImplementationOnce(options => rejectOnAbort(options as { signal?: AbortSignal }))

    const pending = vm.api.makeReadOnly()
    vm.unmount()

    await expect(pending).rejects.toMatchObject({ name: 'AbortError' })
  })

  it('should set error and reject when makeReadOnly() fails', async () => {
    const mock = createMockWindow()
    const vm = useSetup(() => {
      const api = useWebNFC({ window: mock.window })
      return { api }
    })

    const failure = new DOMException('cannot lock', 'NotSupportedError')
    mock.makeReadOnly.mockRejectedValueOnce(failure)

    await expect(vm.api.makeReadOnly()).rejects.toBe(failure)
    expect(vm.api.error.value).toBe(failure)

    vm.unmount()
  })

  it('should no-op when not supported', async () => {
    const vm = useSetup(() => {
      const api = useWebNFC({ window: {} as Window })
      return { api }
    })

    await expect(vm.api.scan()).resolves.toBeUndefined()
    await expect(vm.api.write('hello')).resolves.toBeUndefined()
    await expect(vm.api.makeReadOnly()).resolves.toBeUndefined()
    expect(vm.api.isScanning.value).toBe(false)

    vm.unmount()
  })
})
