---
category: '@RxJS'
---

# useSubject

Bind an RxJS [`Subject`](https://rxjs.dev/guide/subject) to a `ref` and propagate value changes both ways.

## Usage

```ts
import { useSubject } from '@vueuse/rxjs'
import { Subject } from 'rxjs'

const subject = new Subject()

// setup()
const subjectRef = useSubject(subject)
```

If you want to add custom error handling to a Subject that might error, you can supply an optional `onError` configuration. Without this, RxJS will treat any error in the supplied observable as an "unhandled error" and it will be thrown in a new call stack and reported to `window.onerror` (or `process.on('error')` if you happen to be in node).

```ts
import { useSubject } from '@vueuse/rxjs'
import { Subject } from 'rxjs'

const subject = new Subject()

// setup()
const subjectRef = useSubject(subject,
  {
    onError: (err) => {
      console.log(err.message) // "oops"
    },
  },
)
```
