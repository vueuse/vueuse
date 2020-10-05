# @vueuse/rxjs

[![NPM version](https://img.shields.io/npm/v/@vueuse/firebase?color=a1b858)](https://www.npmjs.com/package/@vueuse/rxjs)

> This is an add-on of [VueUse](https://github.com/antfu), enables of a natural way the use of rxjs.

[**Full Documents**](https://vueuse.js.org/)

## 📦 Install

### for Vue 3 ([vue-next](https://github.com/vuejs/vue-next))

<pre class='language-bash'>
npm i @vueuse/rxjs<b>@vue3</b> rxjs 
</pre>

### for Vue 2 with [composition-api](https://github.com/vuejs/composition-api) polyfill

<pre class='language-bash'>
npm i @vueuse/rxjs<b>@vue2</b> rxjs
</pre>

## ⚡ Functions

<!--GENERATED LIST, DO NOT MODIFY MANUALLY-->
<!--FUNCTIONS_LIST_STARTS-->

- Rxjs
  - [`from`](https://vueuse.js.org/?path=/story/add-ons-rxjs--from) — two wrappers around of the original functions to allow use ref objects
  - [`toObserver`](https://vueuse.js.org/?path=/story/add-ons-rxjs--toobserver) — sugar function to convert a ref in a observer
  - [`useObservable`](https://vueuse.js.org/?path=/story/add-ons-rxjs--useobservable) — use an Observable
  - [`useSubscription`](https://vueuse.js.org/?path=/story/add-ons-rxjs--usesubscription) — uses subscriptions without worry about unsubscribing to it or memory leaks

<!--FUNCTIONS_LIST_ENDS-->

You can checkout the full documents and live demos in [Storybook](https://vueuse.js.org/).


## 📄 Example

```ts
import { ref } from 'vue-demi'
import { fromEvent, from, useObservable } from '@vueuse/rxjs'
import { of, forkJoin } from 'rxjs'
import { ajax } from "rxjs/ajax"
import { take, mergeMap, concatAll, pluck, map, scan } from 'rxjs/operators'

const BASE_URL = 'https://jsonplaceholder.typicode.com'
const button = ref<HTMLButtonElement>(null)

const posts = useObservable(fromEvent(button, 'click').pipe(
  mergeMap(() => ajax.getJSON(`${BASE_URL}/posts`).pipe(
    concatAll(),
    take(4),
    mergeMap(({id, userId, title}) => forkJoin({
      id: of(id),
      comments: ajax.getJSON(`${BASE_URL}/posts/${id}/comments`).pipe(
        map(comments => comments.length)
      ),
      username: ajax.getJSON(`${BASE_URL}/users/${userId}`).pipe(
        pluck('username')
      )
    }), 2),
    scan((acc, curr) => [...acc, curr], [])
  ))
))
```
