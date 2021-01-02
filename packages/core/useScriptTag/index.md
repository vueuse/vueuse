# useScriptTag

> Async script tag loading.

## Usage

```js
import { useScriptTag } from '@vueuse/core'

const [twitchTag, removeTwitchTag] = useScriptTag('https://player.twitch.tv/js/embed/v1.js')
```

Load script tag on setup.
