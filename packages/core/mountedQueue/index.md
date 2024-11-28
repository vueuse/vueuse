---
category: Utilities
---

# useMountedQueue

Manage a queue of functions to be executed when a component is mounted and unmounted. Functions can be executed in order of priority.

## Usage

```ts
import { useMountedQueue } from '@vueuse/core'
import { ref } from 'vue'

const { addQueue, removeQueue } = useMountedQueue()

const logMessage = () => console.log('Component is mounted')
const logPriorityMessage = () => console.log('This is a high priority message')

// Add functions to the queue
addQueue(logMessage)
addQueue(logPriorityMessage, 1)

// Remove functions from the queue
removeQueue(logMessage)
```

## API

### addQueue

Add a function to the queue. If the component is already mounted, the function is executed immediately.

#### Parameters

- `fn` (`Function`): The function to add to the queue.
- `priority` (`number`, optional): The priority of the function, default is `0`. Higher priority functions are executed first.

### removeQueue

Remove a function from the queue.

#### Parameters

- `fn` (`Function`): The function to remove from the queue.

### Example

```ts
import { useMountedQueue } from '@vueuse/core'
import { ref } from 'vue'

const { addQueue, removeQueue } = useMountedQueue()

const logMessage = () => console.log('Component is mounted')
const logPriorityMessage = () => console.log('This is a high priority message')

// Add functions to the queue
addQueue(logMessage)
addQueue(logPriorityMessage, 1)

// Remove functions from the queue
removeQueue(logMessage)
```