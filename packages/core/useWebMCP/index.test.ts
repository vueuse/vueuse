import type { WebMCPToolDescriptor } from './index'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, shallowRef } from 'vue'
import { useWebMCP } from './index'

interface RegisteredTool {
  descriptor: WebMCPToolDescriptor
  controller: AbortController
  aborted: () => boolean
}

function installModelContext() {
  const tools: RegisteredTool[] = []
  const registerTool = vi.fn((descriptor: WebMCPToolDescriptor, options?: { signal?: AbortSignal }) => {
    const signal = options?.signal
    tools.push({
      descriptor,
      controller: { abort: () => {} } as AbortController,
      aborted: () => Boolean(signal?.aborted),
    })
  })
  ;(document as any).modelContext = { registerTool }
  return { tools, registerTool }
}

function removeModelContext() {
  delete (document as any).modelContext
}

describe('useWebMCP', () => {
  beforeEach(() => {
    removeModelContext()
  })

  afterEach(() => {
    removeModelContext()
  })

  it('should be defined', () => {
    expect(useWebMCP).toBeDefined()
  })

  it('reports unsupported and stays a no-op when the API is absent', async () => {
    const scope = effectScope()
    const result = scope.run(() => useWebMCP({
      name: 'noop',
      description: 'no-op',
      execute: () => 'ok',
    }))!
    await nextTick()

    expect(result.isSupported.value).toBe(false)
    expect(result.isRegistered.value).toBe(false)
    expect(result.error.value).toBeNull()
    scope.stop()
  })

  it('reports unsupported when modelContext lacks a callable registerTool', async () => {
    ;(document as any).modelContext = {} // present but incomplete
    const scope = effectScope()
    const result = scope.run(() => useWebMCP({
      name: 'noop',
      description: 'no-op',
      execute: () => 'ok',
    }))!
    await nextTick()

    expect(result.isSupported.value).toBe(false)
    expect(result.isRegistered.value).toBe(false)
    expect(result.error.value).toBeNull()
    scope.stop()
  })

  it('registers on run and unregisters when the scope is disposed', async () => {
    const { tools, registerTool } = installModelContext()
    const scope = effectScope()
    const result = scope.run(() => useWebMCP({
      name: 'add-todo',
      description: 'Add a todo',
      execute: () => 'ok',
    }))!
    await nextTick()

    expect(registerTool).toHaveBeenCalledTimes(1)
    expect(result.isSupported.value).toBe(true)
    expect(result.isRegistered.value).toBe(true)
    expect(tools[0].descriptor.name).toBe('add-todo')
    expect(tools[0].aborted()).toBe(false)

    scope.stop()
    expect(tools[0].aborted()).toBe(true)
    expect(result.isRegistered.value).toBe(false)
  })

  it('does not register while `enabled` is false, and (un)registers as it toggles', async () => {
    const { registerTool } = installModelContext()
    const enabled = shallowRef(false)
    const scope = effectScope()
    const result = scope.run(() => useWebMCP({
      name: 'toggle',
      description: 'toggle tool',
      enabled,
      execute: () => 'ok',
    }))!
    await nextTick()

    expect(registerTool).not.toHaveBeenCalled()
    expect(result.isRegistered.value).toBe(false)

    enabled.value = true
    await nextTick()
    expect(registerTool).toHaveBeenCalledTimes(1)
    expect(result.isRegistered.value).toBe(true)

    enabled.value = false
    await nextTick()
    expect(result.isRegistered.value).toBe(false)
    scope.stop()
  })

  it('re-registers when a discoverable field changes', async () => {
    const { registerTool } = installModelContext()
    const description = shallowRef('v1')
    const scope = effectScope()
    scope.run(() => useWebMCP({
      name: 'search',
      description,
      execute: () => 'ok',
    }))
    await nextTick()
    expect(registerTool).toHaveBeenCalledTimes(1)

    description.value = 'v2'
    await nextTick()
    expect(registerTool).toHaveBeenCalledTimes(2)
    scope.stop()
  })

  it('does not re-register when a content-equal schema is passed', async () => {
    const { registerTool } = installModelContext()
    const schema = shallowRef<object>({ type: 'object', properties: { a: { type: 'string' } } })
    const scope = effectScope()
    scope.run(() => useWebMCP({
      name: 'schema',
      description: 'schema tool',
      inputSchema: schema,
      execute: () => 'ok',
    }))
    await nextTick()
    expect(registerTool).toHaveBeenCalledTimes(1)

    // New object, same content → no churn.
    schema.value = { type: 'object', properties: { a: { type: 'string' } } }
    await nextTick()
    expect(registerTool).toHaveBeenCalledTimes(1)
    scope.stop()
  })

  it('captures a registration error (e.g. NotAllowedError)', async () => {
    installModelContext()
    ;(document as any).modelContext.registerTool = vi.fn(() => {
      const err = new Error('blocked')
      err.name = 'NotAllowedError'
      throw err
    })
    const scope = effectScope()
    const result = scope.run(() => useWebMCP({
      name: 'blocked',
      description: 'blocked tool',
      execute: () => 'ok',
    }))!
    await nextTick()

    expect(result.isRegistered.value).toBe(false)
    expect(result.error.value).toBeInstanceOf(Error)
    expect(result.error.value?.name).toBe('NotAllowedError')
    scope.stop()
  })

  describe('result normalization', () => {
    async function runExecute(execute: (args: any) => any, args: any = {}, options: any = {}) {
      const { tools } = installModelContext()
      const scope = effectScope()
      scope.run(() => useWebMCP({ name: 't', description: 'd', execute, ...options }))
      await nextTick()
      const res = await tools[0].descriptor.execute(args)
      scope.stop()
      return res
    }

    it('wraps a string in a text block', async () => {
      expect(await runExecute(() => 'hi')).toEqual({ content: [{ type: 'text', text: 'hi' }] })
    })

    it('maps undefined/null to an empty successful result', async () => {
      expect(await runExecute(() => undefined)).toEqual({ content: [] })
      expect(await runExecute(() => null)).toEqual({ content: [] })
    })

    it('passes an already-formed tool result through untouched', async () => {
      const already = { content: [{ type: 'text', text: 'x' }] }
      expect(await runExecute(() => already)).toBe(already)
    })

    it('serializes other values to JSON text', async () => {
      expect(await runExecute(() => ({ a: 1 }))).toEqual({ content: [{ type: 'text', text: '{"a":1}' }] })
    })

    it('does not throw on non-serializable (circular) results', async () => {
      const circular: any = {}
      circular.self = circular
      const res = await runExecute(() => circular)
      expect(res.isError).toBeUndefined()
      expect(res.content[0].type).toBe('text')
    })

    it('turns a thrown Error into an isError result and calls onError', async () => {
      const onError = vi.fn()
      const res = await runExecute(() => {
        throw new Error('boom')
      }, {}, { onError })
      expect(res).toEqual({ content: [{ type: 'text', text: 'boom' }], isError: true })
      expect(onError).toHaveBeenCalledTimes(1)
    })

    it('turns a thrown non-Error into an isError result', async () => {
      const thrownString = await runExecute(() => {
        // eslint-disable-next-line no-throw-literal
        throw 'nope'
      })
      expect(thrownString).toEqual({ content: [{ type: 'text', text: 'nope' }], isError: true })

      const thrownObject = await runExecute(() => {
        // eslint-disable-next-line no-throw-literal
        throw { code: 403 }
      })
      expect(thrownObject).toEqual({ content: [{ type: 'text', text: '{"code":403}' }], isError: true })
    })

    it('treats a returned Error like a throw', async () => {
      const onError = vi.fn()
      const res = await runExecute(() => new Error('returned'), {}, { onError })
      expect(res).toEqual({ content: [{ type: 'text', text: 'returned' }], isError: true })
      expect(onError).toHaveBeenCalledTimes(1)
    })

    it('does not let a throwing onError break the tool execution path', async () => {
      const onError = vi.fn(() => {
        throw new Error('onError blew up')
      })
      const res = await runExecute(() => {
        throw new Error('boom')
      }, {}, { onError })
      expect(res).toEqual({ content: [{ type: 'text', text: 'boom' }], isError: true })
      expect(onError).toHaveBeenCalledTimes(1)
    })

    it('applies formatOutput before normalization', async () => {
      const res = await runExecute(
        () => ({ raw: 1 }),
        {},
        { formatOutput: (r: any) => `count=${r.raw}` },
      )
      expect(res).toEqual({ content: [{ type: 'text', text: 'count=1' }] })
    })
  })
})
