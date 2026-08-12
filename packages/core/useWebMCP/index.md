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

const { isSupported, registered, error } = useWebMCP({
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

## References

- [WebMCP explainer & spec (webmachinelearning/webmcp)](https://github.com/webmachinelearning/webmcp)
- [GoogleChromeLabs/use-webmcp-tool](https://github.com/GoogleChromeLabs/use-webmcp-tool) — the React hook this composable is modeled after
