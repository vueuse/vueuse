---
category: Browser
---

# useLeaderElection

Uses the [Web Locks API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API) to elect one tab as leader.

Use this composable to e.g. refresh a session only once even when multiple tabs of your application are open or multiple worker are running.

## Usage

```ts
import { useLeaderElection } from '@vueuse/core'

const { asLeader, isElected, isSupported } = useLeaderElection({ name: 'lock-name' })
// … later in your component
asLeader(() => {
  /* your code that only needs to be executed in one tab */
})
```

### Example: Shared Session

You can combine `useLeaderElection` with `useBroadcastChannel` to keep a shared session among all open tabs of your application.
If you log out in one tab you will be logged out in all tabs. Only one tab is responsible to refresh the shared session
periodically:

```ts
import { useBroadcastChannel, useIntervalFn, useLeaderElection } from '@vueuse/core'
import { computed, watch } from 'vue'

const { asLeader, isLeader } = useLeaderElection({ name: 'shared-session' })
interface Session { expires: number, username: string }
const { data, post } = useBroadcastChannel<Session | null | undefined, Session | null>({ name: 'shared-session' })
const { pause, resume } = useIntervalFn(() => {
  if (data.value === null) {
    pause()
    return
  }
  asLeader(async (signal) => {
    if (data.value === undefined || data.value?.expires > Date.now() - 1000 * 60 * 5) {
      pause()
      try {
        const newSession = (await fetch('/refresh/session', { signal, credentials: 'include' })).json()
        data.value = newSession
        post(newSession)
      }
      finally {
        resume()
      }
    }
  })
})
function logout() {
  data.value = null
  post(null)
}
const isLoggedIn = computed(() => !!data.value?.username)
watch(isLeader, (leader) => {
  if (leader) {
    resume()
  }
  else {
    pause()
  }
})
```
