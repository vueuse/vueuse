# useShare

> Reactive [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share). The Browser provides features that can share content in text or file.

> The `share` method has to be called following a user gesture like a button click. It can’t simply be called on page load for example. That’s in place to help prevent abuse.

## Usage

```js
import { useShare } from '@vueuse/core'

const { share, isSupported } = useShare()

function startShare() {
  share({
    title: 'Hello',
    text: 'Hello my friend!',
    url: location.href,
  })
}
```


### Passing a source ref

You can pass a `reactive` to it, changes from of the source reactive will be reflected to your sharing options.

```js {7}
import { reactive } from 'vue'
const shareOptions = reactive<ShareOptions>({ text: 'foo' })
const { share, isSupported } = useShare(shareOptions)

shareOptions.text = 'bar'

function startShare() {
  share()
}
```

