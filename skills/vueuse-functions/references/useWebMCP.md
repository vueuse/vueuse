---
category: Browser
---

# useWebMCP

Register a [WebMCP](https://github.com/webmachinelearning/webmcp) tool and tie its lifecycle to the current Vue scope.

WebMCP lets a page expose JavaScript functions as "tools" that an AI agent (browser-built-in, iframe-hosted, or extension) can discover and call, instead of scraping the DOM, the accessibility tree, or screenshots. `useWebMCP` wraps the imperative, `AbortSignal`-based registration API in a declarative composable: the tool is registered when the composable runs and **unregistered automatically when the scope is disposed**, so the set of tools an agent sees stays in lockstep with what is actually on screen.

::: warning Experimental
The WebMCP spec is `🧪` experimental and exposes the imperative API on `document.modelContext` (`registerTool` + an `AbortSignal` for unregistration). This composable feature-detects and degrades to a no-op everywhere the API is absent — check `isSupported` before relying on it.
:::

## Usage

```ts
import { useWebMCP } from '@vueuse/core'
import { shallowRef } from 'vue'

const todos = shallowRef<string[]>([])

const { isSupported, isRegistered, error } = useWebMCP({
  name: 'add-todo',
  description: 'Add a new item to the user\'s active todo list',
  inputSchema: {
    type: 'object',
    properties: {
      text: { type: 'string', description: 'The text content of the todo item' },
    },
    required: ['text'],
  },
  async execute({ text }) {
    todos.value = [...todos.value, text]
    return `Added todo item: "${text}" successfully.`
  },
})
```

The raw imperative API this wraps looks like:

```ts
const controller = new AbortController()

document.modelContext.registerTool({
  name: 'add-todo',
  description: 'Add a new item to the user\'s active todo list',
  inputSchema: { /* … */ },
  async execute({ text }) {
    return { content: [{ type: 'text', text: `Added todo item: "${text}".` }] }
  },
}, { signal: controller.signal })

// Unregister later:
controller.abort()
```

## Result normalization

Whatever `execute` returns is normalized into a valid MCP tool result:

- a **string** → `{ content: [{ type: 'text', text }] }`
- **`undefined`/`null`** (no return) → `{ content: [] }` (success, no payload)
- a value that is **already** `{ content: [...] }` → passed through untouched
- a **thrown value** — `Error` or not (`throw 'not signed in'`, `throw { code: 403 }`) → `{ content: [{ type: 'text', text }], isError: true }`, after `onError`. A failure must never read as success to the agent.
- a **returned `Error`** → treated exactly like a throw: `onError` fires, then an `isError` result
- anything else (object/array/number) → JSON-serialized into a text block

## Reactive & conditional registration

`name`, `description`, `inputSchema`, `annotations` and `enabled` accept refs or getters. Changing a discoverable field re-registers the tool; toggling `enabled` unregisters and re-registers it. `execute`, `formatOutput` and `onError` are read live at call time, so a changing closure never churns the registration.

```ts
import { useWebMCP } from '@vueuse/core'
import { shallowRef } from 'vue'

const signedIn = shallowRef(false)

useWebMCP({
  name: 'checkout',
  description: 'Complete the checkout for the current cart',
  enabled: signedIn, // only exposed to agents while signed in
  annotations: { readOnlyHint: false },
  execute() {
    // …
  },
  onError(err) {
    console.error('checkout tool failed', err)
  },
})
```

## Registering multiple tools

Call `useWebMCP` once per tool to register several — each call manages its own registration lifecycle.

```ts
import { useWebMCP } from '@vueuse/core'

useWebMCP({
  name: 'add-todo',
  description: 'Add a new item to the todo list',
  execute({ text }) {
    // …
  },
})

useWebMCP({
  name: 'clear-todos',
  description: 'Remove every item from the todo list',
  annotations: { readOnlyHint: false },
  execute() {
    // …
  },
})
```

## References

- [WebMCP explainer & spec (webmachinelearning/webmcp)](https://github.com/webmachinelearning/webmcp)
- [GoogleChromeLabs/use-webmcp-tool](https://github.com/GoogleChromeLabs/use-webmcp-tool) — the React hook this composable is modeled after

## Type Declarations

```ts
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
  registerTool: (
    tool: WebMCPToolDescriptor,
    options?: {
      signal?: AbortSignal
    },
  ) => void
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
export declare function useWebMCP<Args = Record<string, any>, Result = unknown>(
  options: UseWebMCPOptions<Args, Result>,
): UseWebMCPReturn
```
