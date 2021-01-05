# useScriptTag

> Async script tag loading.

## Usage

```js
import { useScriptTag } from '@vueuse/core'

export default defineComponent({
  setup() {
    const { scriptTag } = useScriptTag(
      'https://player.twitch.tv/js/embed/v1.js',
      // This is called on script tag loaded.
      (el: HTMLScriptElement) => {
        new Twitch.Embed('twitch-embed', {
          width: 854,
          height: 480,
          channel: 'Tahul',
        })
      },
    )
  },

  template: html`<div
    id="twitch-embed"
    style="display: flex; justify-content: center; align-items: center;"
  />`,
})
```

Load script tag on component mount.

Script tag will automatically be removed when component unmount.

```js
import { ref, watch } from 'vue'
import { useScriptTag, useIntersectionObserver } from '@vueuse/core'

export default defineComponent({
  setup() {
    const twitchEmbed = ref<Element>()
    const twitchEmbedVisible = ref(false)

    const { scriptTag, load, unload } = useScriptTag(
      'https://player.twitch.tv/js/embed/v1.js',
      // This is called on script tag loaded.
      () => {
        new Twitch.Embed('twitch-embed', {
          width: 854,
          height: 480,
          channel: 'Tahul',
        })
      },
      {
        immediate: false,
      },
    )

    const { stop } = useIntersectionObserver(
      twitchEmbed,
      ([{ isIntersecting }]) => {
        twitchEmbedVisible.value = isIntersecting
      },
    )

    watch(
      twitchEmbedVisible.value,
      async(newVal) => {
        if (newVal) await load()
        else await unload()
      },
    )

    return {
      twitchEmbed,
    }
  },

  template: html`<div
    ref="twitch-embed"
    id="twitch-embed"
    style="display: flex; justify-content: center; align-items: center;"
  />`,
})
```

Load script tag when component is visible (or whenever you want).

Script tag will still be removed on component unmount.
