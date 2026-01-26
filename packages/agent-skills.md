# Agent Skills

> [!IMPORTANT]
> 🧪 Experimental: VueUse Skills are currently experimental and under active development, feedbacks are welcome.

The [VueUse Skills](https://github.com/vueuse/skills) are AI Agent Skills maintained by the VueUse team.

After installing the skill, when you use an AI Agent to assist with developing Vue or Nuxt applications, it can automatically leverage the rich feature set provided by VueUse.

This allows the agent to accurately use VueUse functions **without requiring an internet connection or additional permissions**.

## Installation

```bash
npx skills add vueuse/skills
```

## Usage

### Using an Agent to Develop Vue Applications

Example prompt:

```
create a todo app with the following features:
- save todos to local storage
- show remains todo count on browser title
- add a copy button for each todo items
- infinite scrolling for this todo list
- dark / light mode
```

<details>
<summary>Output Snippet</summary>

```vue
<script setup lang="ts">
import {
  useClipboard,
  useColorMode,
  useInfiniteScroll,
  useLocalStorage,
  useTitle,
} from '@vueuse/core'
import { computed, ref } from 'vue'

interface Todo {
  id: number
  text: string
  done: boolean
}

const seedTexts = [
  'Review project goals',
  'Plan the next sprint',
  'Reply to client email',
]

const defaultTodos = Array.from({ length: 36 }, (_, index) => ({
  id: index + 1,
  text:
    seedTexts[index % seedTexts.length]
    + (index >= seedTexts.length ? ` #${index + 1}` : ''),
  done: index % 7 === 0,
}))

const todos = useLocalStorage<Todo[]>('focus-flow-todos', defaultTodos)
const nextId = ref(
  todos.value.reduce((max, todo) => Math.max(max, todo.id), 0) + 1,
)
const newTodo = ref('')

const totalCount = computed(() => todos.value.length)
const remainingCount = computed(() =>
  todos.value.filter(todo => !todo.done).length,
)
const completedCount = computed(
  () => totalCount.value - remainingCount.value,
)

useTitle(computed(() => `Todos (${remainingCount.value})`))

const mode = useColorMode({
  attribute: 'data-theme',
  disableTransition: false,
})
const isDark = computed(() => mode.value === 'dark')

function toggleMode() {
  mode.value = isDark.value ? 'light' : 'dark'
}

const { copy, copied, isSupported } = useClipboard()
const lastCopiedId = ref<number | null>(null)

async function handleCopy(todo: Todo) {
  await copy(todo.text)
  lastCopiedId.value = todo.id
}

const pageSize = 8
const visibleCount = ref(Math.min(pageSize, todos.value.length))
const visibleTodos = computed(() => todos.value.slice(0, visibleCount.value))

const listRef = ref<HTMLElement | null>(null)
const { isLoading } = useInfiniteScroll(
  listRef,
  () => {
    if (visibleCount.value < todos.value.length) {
      visibleCount.value = Math.min(
        visibleCount.value + pageSize,
        todos.value.length,
      )
    }
  },
  {
    distance: 120,
    canLoadMore: () => visibleCount.value < todos.value.length,
  },
)

function syncVisibleCount() {
  if (todos.value.length <= pageSize) {
    visibleCount.value = todos.value.length
    return
  }

  if (visibleCount.value === 0) {
    visibleCount.value = pageSize
    return
  }

  if (visibleCount.value > todos.value.length) {
    visibleCount.value = todos.value.length
  }
}

function addTodo() {
  const value = newTodo.value.trim()
  if (!value)
    return

  todos.value.unshift({
    id: nextId.value++,
    text: value,
    done: false,
  })
  newTodo.value = ''
  syncVisibleCount()
}

function removeTodo(id: number) {
  todos.value = todos.value.filter(todo => todo.id !== id)
  syncVisibleCount()
}
</script>

<template>
  <div class="page">
    <div class="shell">
      <header class="header">
        <div>
          <p class="eyebrow">
            Minimal todo tracker
          </p>
          <h1>Focus Flow</h1>
          <p class="subtitle">
            Keep a lightweight list, copy tasks with a click, and scroll as the
            list grows.
          </p>
        </div>
        <button class="btn ghost mode-toggle" type="button" @click="toggleMode">
          <span class="mode-dot" :class="{ dark: isDark }" />
          <span>{{ isDark ? 'Dark' : 'Light' }} mode</span>
        </button>
      </header>

      <form class="composer" @submit.prevent="addTodo">
        <div class="input-wrap">
          <input
            v-model="newTodo"
            type="text"
            maxlength="120"
            placeholder="Add a new task"
            aria-label="Add a new task"
          >
          <button class="btn primary" type="submit" :disabled="!newTodo.trim()">
            Add task
          </button>
        </div>
        <div class="stats">
          <div class="stat">
            <span>Total</span>
            <strong>{{ totalCount }}</strong>
          </div>
          <div class="stat">
            <span>Remaining</span>
            <strong>{{ remainingCount }}</strong>
          </div>
          <div v-if="completedCount" class="stat">
            <span>Done</span>
            <strong>{{ completedCount }}</strong>
          </div>
        </div>
      </form>

      <section class="list-card">
        <div class="list-head">
          <h2>Todo list</h2>
          <span class="list-hint">
            {{ visibleTodos.length }} / {{ totalCount }} shown
          </span>
        </div>
        <div ref="listRef" class="todo-list" aria-live="polite">
          <article
            v-for="(todo, index) in visibleTodos"
            :key="todo.id"
            class="todo-item"
            :class="{ done: todo.done }"
            :style="{ animationDelay: `${index * 0.03}s` }"
          >
            <label class="todo-check">
              <input v-model="todo.done" type="checkbox">
              <span class="checkmark" />
            </label>
            <p class="todo-text">
              {{ todo.text }}
            </p>
            <div class="todo-actions">
              <button
                class="btn ghost"
                type="button"
                :disabled="!isSupported"
                :title="isSupported ? 'Copy task text' : 'Clipboard not supported'"
                @click="handleCopy(todo)"
              >
                {{ copied && lastCopiedId === todo.id ? 'Copied' : 'Copy' }}
              </button>
              <button class="btn danger" type="button" @click="removeTodo(todo.id)">
                Remove
              </button>
            </div>
          </article>

          <p v-if="!visibleTodos.length" class="empty">
            No tasks yet. Add your first todo above.
          </p>

          <div v-if="visibleTodos.length" class="list-footer">
            <span class="footer-status">
              <span v-if="isLoading">Loading more...</span>
              <span v-else-if="visibleTodos.length < totalCount">
                Scroll to load more
              </span>
              <span v-else>All caught up</span>
            </span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

:root {
  color-scheme: light;
  --bg: #f6f7fb;
  --bg-spot: rgba(59, 130, 246, 0.18);
  --bg-spot-2: rgba(34, 197, 94, 0.18);
  --card: rgba(255, 255, 255, 0.92);
  --surface: rgba(255, 255, 255, 0.84);
  --border: rgba(148, 163, 184, 0.35);
  --text: #0f172a;
  --muted: #64748b;
  --accent: #2563eb;
  --accent-strong: #1d4ed8;
  --accent-soft: rgba(37, 99, 235, 0.18);
  --danger: #ef4444;
  --danger-soft: rgba(239, 68, 68, 0.15);
  --shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
  --radius: 22px;
}

:root[data-theme='dark'] {
  color-scheme: dark;
  --bg: #0b1222;
  --bg-spot: rgba(56, 189, 248, 0.18);
  --bg-spot-2: rgba(16, 185, 129, 0.16);
  --card: rgba(15, 23, 42, 0.86);
  --surface: rgba(15, 23, 42, 0.7);
  --border: rgba(148, 163, 184, 0.25);
  --text: #f8fafc;
  --muted: #94a3b8;
  --accent: #38bdf8;
  --accent-strong: #0ea5e9;
  --accent-soft: rgba(56, 189, 248, 0.2);
  --danger: #f87171;
  --danger-soft: rgba(248, 113, 113, 0.2);
  --shadow: 0 26px 70px rgba(2, 6, 23, 0.55);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family:
    'Sora',
    system-ui,
    -apple-system,
    sans-serif;
  color: var(--text);
  background:
    radial-gradient(900px circle at top left, var(--bg-spot), transparent 55%),
    radial-gradient(700px circle at bottom right, var(--bg-spot-2), transparent 50%), var(--bg);
  transition:
    background 0.4s ease,
    color 0.4s ease;
}

#app {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(20px, 4vw, 48px);
}

.page {
  width: min(980px, 100%);
}

.shell {
  display: grid;
  gap: clamp(20px, 3vw, 28px);
  padding: clamp(20px, 4vw, 36px);
  border-radius: var(--radius);
  background: var(--card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  backdrop-filter: blur(18px);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.72rem;
  color: var(--muted);
  margin: 0 0 10px;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 3vw, 2.6rem);
}

.subtitle {
  margin: 10px 0 0;
  color: var(--muted);
  max-width: 520px;
}

.composer {
  display: grid;
  gap: 16px;
}

.input-wrap {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
}

input[type='text'] {
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: 1rem;
  transition:
    border 0.2s ease,
    box-shadow 0.2s ease;
}

input[type='text']:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.stat {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  background: var(--surface);
  border: 1px solid var(--border);
  font-size: 0.9rem;
  color: var(--muted);
}

.stat strong {
  font-family: 'Space Mono', ui-monospace, SFMono-Regular, monospace;
  color: var(--text);
  font-size: 0.95rem;
}

.list-card {
  display: grid;
  gap: 16px;
}

.list-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.list-head h2 {
  margin: 0;
  font-size: 1.2rem;
}

.list-hint {
  font-size: 0.85rem;
  color: var(--muted);
  font-family: 'Space Mono', ui-monospace, SFMono-Regular, monospace;
}

.todo-list {
  max-height: clamp(320px, 55vh, 520px);
  overflow-y: auto;
  display: grid;
  gap: 12px;
  padding: 6px;
  margin: -6px;
}

.todo-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 14px 16px;
  border-radius: 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  animation: fadeUp 0.4s ease both;
}

.todo-item.done {
  opacity: 0.7;
}

.todo-text {
  margin: 0;
  font-size: 0.98rem;
}

.todo-item.done .todo-text {
  text-decoration: line-through;
  color: var(--muted);
}

.todo-check {
  display: inline-flex;
  align-items: center;
}

.todo-check input {
  width: 18px;
  height: 18px;
  accent-color: var(--accent);
}

.checkmark {
  display: none;
}

.todo-actions {
  display: inline-flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.88rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn.primary {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  font-weight: 600;
}

.btn.primary:hover:not(:disabled) {
  background: var(--accent-strong);
  border-color: var(--accent-strong);
}

.btn.ghost:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent);
}

.btn.danger {
  border-color: transparent;
  color: var(--danger);
  background: var(--danger-soft);
}

.mode-toggle {
  white-space: nowrap;
}

.mode-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #facc15;
  box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.2);
}

.mode-dot.dark {
  background: #38bdf8;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
}

.empty {
  text-align: center;
  padding: 32px 12px;
  color: var(--muted);
  border-radius: 16px;
  border: 1px dashed var(--border);
}

.list-footer {
  text-align: center;
  font-size: 0.85rem;
  color: var(--muted);
  padding: 8px 0 12px;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 820px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .input-wrap {
    grid-template-columns: 1fr;
  }

  .todo-item {
    grid-template-columns: auto 1fr;
  }

  .todo-actions {
    grid-column: 1 / -1;
    justify-content: flex-end;
  }
}
</style>
```

</details>

### Asking the AI Agent How to Use VueUse

Example prompt:

```
which vueuse function can i use for local storage?
```

<details>
<summary>Output Snippet</summary>

Use `useStorage` (it defaults to `localStorage`), or the convenience wrapper `useLocalStorage`.

Example:

```ts
import { useLocalStorage, useStorage } from '@vueuse/core'

const state = useStorage('my-key', { hello: 'hi' }) // localStorage by default
const theme = useLocalStorage('theme', 'light')
```

</details>
