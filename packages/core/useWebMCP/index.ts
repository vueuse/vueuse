import type { MaybeRefOrGetter, ShallowRef } from 'vue'
import type { ConfigurableDocument } from '../_configurable'
import type { Supportable } from '../types'
import { tryOnScopeDispose } from '@vueuse/shared'
import { shallowRef, toValue, watch } from 'vue'
import { defaultDocument } from '../_configurable'
import { useSupported } from '../useSupported'

/**
 * A single block of a WebMCP tool result.
 *
 * @see https://github.com/webmachinelearning/webmcp
 */
export interface WebMCPToolContent {
  type: string
  text?: string
  [key: string]: unknown
}

/**
 * The normalized result an agent receives after a tool runs.
 */
export interface WebMCPToolResponse {
  content: WebMCPToolContent[]
  isError?: boolean
}

/**
 * Hints an author can attach to a tool to shape how an agent uses it.
 */
export interface WebMCPToolAnnotations {
  /**
   * The tool does not mutate state and is safe to call speculatively.
   */
  readOnlyHint?: boolean
  /**
   * The tool may return content that should be treated as untrusted.
   */
  untrustedContentHint?: boolean
  [key: string]: unknown
}

/**
 * The imperative descriptor passed to `document.modelContext.registerTool`.
 */
export interface WebMCPToolDescriptor {
  name: string
  description: string
  inputSchema?: object
  annotations?: WebMCPToolAnnotations
  execute: (args: any) => Promise<WebMCPToolResponse> | WebMCPToolResponse
}

/**
 * The (experimental) imperative WebMCP API surface exposed on `document`.
 */
export interface ModelContext {
  registerTool: (tool: WebMCPToolDescriptor, options?: { signal?: AbortSignal }) => void
}

declare global {
  interface Document {
    modelContext?: ModelContext
  }
}

export interface UseWebMCPOptions<Args, Result> extends ConfigurableDocument {
  /**
   * Tool identifier the agent uses to invoke this tool.
   */
  name: MaybeRefOrGetter<string>
  /**
   * Natural-language description the agent reads to decide when to call it.
   */
  description: MaybeRefOrGetter<string>
  /**
   * JSON Schema describing the tool arguments.
   */
  inputSchema?: MaybeRefOrGetter<object | undefined>
  /**
   * Hints (`readOnlyHint`, `untrustedContentHint`, …) shaping agent behavior.
   */
  annotations?: MaybeRefOrGetter<WebMCPToolAnnotations | undefined>
  /**
   * The function the agent calls. May be async. Its return value is normalized
   * into a WebMCP tool result, and any thrown/returned `Error` becomes an
   * `isError` result.
   */
  execute: (args: Args) => Result | Promise<Result>
  /**
   * Register the tool only while this is `true`.
   *
   * @default true
   */
  enabled?: MaybeRefOrGetter<boolean>
  /**
   * Shape the `execute` result before it is normalized into a tool response.
   */
  formatOutput?: (result: Result, args: Args) => unknown
  /**
   * Side effect invoked when `execute` (or `formatOutput`) throws/returns an error.
   */
  onError?: (error: unknown) => void
}

export interface UseWebMCPReturn extends Supportable {
  /**
   * Whether the tool is currently registered with the browser.
   */
  isRegistered: ShallowRef<boolean>
  /**
   * Registration error, e.g. a `NotAllowedError` from a `tools` permissions policy.
   */
  error: ShallowRef<Error | null>
}

// Stringify for error reporting without ever throwing itself
// (JSON.stringify throws on circular references and BigInt).
function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value)
  }
  catch {
    return String(value)
  }
}

// Normalize whatever `execute` returns into an MCP tool result, so callers can
// return a plain string/object and still hand the agent a valid response.
function toToolResponse(value: unknown): WebMCPToolResponse {
  // Already a well-formed MCP tool result — pass it through untouched.
  if (value && typeof value === 'object' && Array.isArray((value as WebMCPToolResponse).content))
    return value as WebMCPToolResponse

  // `execute` returned nothing — report a successful, empty result.
  if (value === undefined || value === null)
    return { content: [] }

  // Strings map directly to a single text block.
  if (typeof value === 'string')
    return { content: [{ type: 'text', text: value }] }

  // Anything else (objects, arrays, numbers) is serialized to JSON text.
  return { content: [{ type: 'text', text: JSON.stringify(value) }] }
}

// Every failure becomes an explicit `isError` result, whatever was thrown — a
// thrown string or plain object must not read as success to the agent.
function toErrorResponse(error: unknown): WebMCPToolResponse {
  const text = error instanceof Error
    ? error.message
    : typeof error === 'string'
      ? error
      : safeStringify(error)
  return { content: [{ type: 'text', text }], isError: true }
}

/**
 * Register a [WebMCP](https://github.com/webmachinelearning/webmcp) tool and
 * tie its lifecycle to the current scope.
 *
 * The tool is registered when the composable runs (and whenever a discoverable
 * part — `name`, `description`, `inputSchema`, `annotations` or `enabled` —
 * changes) and unregistered automatically on scope dispose, so the tools an
 * agent sees stay in lockstep with what is on screen. Call it multiple times to
 * register multiple tools.
 *
 * The API is experimental (`document.modelContext`), so this feature-detects
 * and degrades to a no-op wherever it is absent.
 *
 * @see https://vueuse.org/useWebMCP
 * @see https://github.com/webmachinelearning/webmcp
 */
export function useWebMCP<Args = Record<string, any>, Result = unknown>(
  options: UseWebMCPOptions<Args, Result>,
): UseWebMCPReturn {
  const {
    document = defaultDocument,
    enabled = true,
  } = options

  const isSupported = useSupported(() => !!document && !!document.modelContext)
  const isRegistered = shallowRef(false)
  const error = shallowRef<Error | null>(null)

  let controller: AbortController | undefined

  function cleanup() {
    // Aborting the signal is how WebMCP unregisters a tool.
    controller?.abort()
    controller = undefined
    isRegistered.value = false
  }

  function register() {
    cleanup()
    error.value = null

    if (!isSupported.value || !toValue(enabled))
      return

    controller = new AbortController()

    try {
      document!.modelContext!.registerTool(
        {
          name: toValue(options.name),
          description: toValue(options.description),
          inputSchema: toValue(options.inputSchema),
          annotations: toValue(options.annotations),
          async execute(args: Args) {
            try {
              const result = await options.execute(args)
              const shaped = options.formatOutput ? options.formatOutput(result, args) : result
              // A returned Error gets the same treatment as a thrown one:
              // `onError`, then an `isError` result.
              if (shaped instanceof Error)
                throw shaped
              return toToolResponse(shaped)
            }
            catch (err) {
              options.onError?.(err)
              return toErrorResponse(err)
            }
          },
        },
        { signal: controller.signal },
      )
      isRegistered.value = true
    }
    catch (err) {
      // e.g. NotAllowedError when the `tools` permissions policy is disabled.
      error.value = err instanceof Error ? err : new Error(safeStringify(err))
      isRegistered.value = false
    }
  }

  // Only the parts an agent discovers trigger re-registration. The schema and
  // annotations are serialized so inline object literals don't churn every
  // change. `execute`/`formatOutput`/`onError` are read live at call time, so
  // a changing closure never forces a re-registration.
  watch(
    [
      isSupported,
      () => toValue(options.name),
      () => toValue(options.description),
      () => (toValue(options.inputSchema) ? JSON.stringify(toValue(options.inputSchema)) : ''),
      () => (toValue(options.annotations) ? JSON.stringify(toValue(options.annotations)) : ''),
      () => toValue(enabled),
    ],
    register,
    { immediate: true, flush: 'post' },
  )

  tryOnScopeDispose(cleanup)

  return {
    isSupported,
    isRegistered,
    error,
  }
}
