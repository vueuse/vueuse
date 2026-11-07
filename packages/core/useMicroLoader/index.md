---
category: State
---

# useMicroLoader

A composable that provides a smart loading state management with micro-loading detection. It helps prevent UI flicker for quick operations while ensuring a minimum loading time for better user experience. Particularly useful for handling both fast and slow network conditions, preventing unnecessary loading indicators on fast connections.

## Usage

```ts
import { useMicroLoader } from '@vueuse/core'

const isLoading = useMicroLoader(() => asyncTaskStatus.value === 'pending')
```

## Features

- Prevents UI flicker for quick operations (under `quickLoadingThresholdMs`)
- Ensures a minimum loading time for better UX
- Adapts to network conditions - won't show loading indicators on fast connections
- Handles both local operations and network requests efficiently

## Parameters

- `isLoadingRef`: A reactive reference or getter that indicates the loading state
- `options`: Optional configuration object
  - `minLoadingTimeMs`: Minimum duration (in milliseconds) that the loading state should be shown (default: 500ms)
  - `quickLoadingThresholdMs`: Time threshold (in milliseconds) below which loading state won't be shown (default: 300ms)

## Return Value

Returns a reactive reference that indicates whether the micro-loading state is active.

## Examples

### Basic Usage

```ts
const isLoading = ref(false)
const isMicroLoading = useMicroLoader(isLoading)
```

### Custom Configuration

```ts
const isLoading = ref(false)
const isMicroLoading = useMicroLoader(isLoading, {
  minLoadingTimeMs: 1000, // Show loading for at least 1 second
  quickLoadingThresholdMs: 500 // Don't show loading for operations under 500ms
})
```

### With Async Operations

```ts
const taskStatus = ref<'idle' | 'pending' | 'done'>('idle')
const isMicroLoading = useMicroLoader(() => taskStatus.value === 'pending')

async function performTask() {
  taskStatus.value = 'pending'
  await someAsyncOperation()
  taskStatus.value = 'done'
}
```

### Network-Aware Loading

```ts
const taskStatus = ref<'idle' | 'pending' | 'done'>('idle')
const isMicroLoading = useMicroLoader(() => taskStatus.value === 'pending', {
  // On fast networks, don't show loading for operations under 1 second
  quickLoadingThresholdMs: 1000,
  // Ensure loading state is shown for at least 500ms on slow networks
  minLoadingTimeMs: 500,
})

async function fetchData() {
  taskStatus.value = 'pending'
  try {
    await fetch('/api/data')
  }
  finally {
    taskStatus.value = 'done'
  }
}
```
