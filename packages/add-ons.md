# Add-ons

The core package aims to be lightweight and dependence free. While the add-ons are wrapping popular packages into the consistent API style.

## Head - [`@vueuse/head`](https://github.com/vueuse/head) <carbon-link class="external-link"/>

Document head manager for Vue 3. SSR ready. Created and maintained by [@egoist](https://github.com/egoist)

## Motion - [`@vueuse/motion`](https://github.com/vueuse/motion) <carbon-link class="external-link"/>

**Vue Composables** putting your **components** in **motion**.

- 🏎 **Smooth animations** based on [**Popmotion**](https://popmotion.io/)
- 🎮 **Declarative** API
- 🚀 **Plug** & **play** with **10+ presets**
- ✅ Supports **Vue 2 & 3** using [**vue-demi**](https://github.com/antfu/vue-demi)
- 🚚 Supports **Nuxt** using [**nuxt-use-motion**](https://github.com/Tahul/nuxt-use-motion)
- ✨ Written in **TypeScript**
- 🏋️‍♀️ Lightweight with **<20kb** bundle size

> Created and maintained by [@Tahul](https://github.com/Tahul)

## Gesture - [`@vueuse/gesture`](https://github.com/vueuse/gesture) <carbon-link class="external-link"/>

**Vue Composables** making your app **interactive**

- 🚀 **Plug** & **play**
- 🕹 **Mouse** & **Touch** support
- 🎮 **Directives** support (**v-drag**, **v-pinch**, **v-move**...)
- ✨ Written in **TypeScript**
- ✅ Supports **Vue 2 & 3** using [**vue-demi**](https://github.com/antfu/vue-demi)
- 🤹 Plays well with [**vueuse/motion**](https://github.com/vueuse/motion) or **any other** animation solution

> Created and maintained by [@Tahul](https://github.com/Tahul)

## Sound - [`@vueuse/sound`](https://github.com/vueuse/sound) <carbon-link class="external-link"/>

Vue composables for playing sound effects.

- 👂 Lets your website **communicate** using 2 **human senses** instead of 1
- 🔥 Built with **Vue** Composition API
- ✅ Supports **Vue 2 & 3** using [**vue-demi**](https://github.com/antfu/vue-demi)
- 🚚 Supports **Nuxt** using [**nuxt-use-sound**](https://github.com/Tahul/nuxt-use-sound)
- ⚡️ **<1kb** bytes (gzip) in your **bundle**! **~10kb** loaded **async**.
- ✨ Built with **TypeScript**
- 🗣 Uses a powerful, battle-tested audio utility: [**Howler.js**](https://howlerjs.com/)

> Created and maintained by [@Tahul](https://github.com/Tahul)

## SchemaOrg - [`@vueuse/schema-org`](https://github.com/vueuse/schema-org) <carbon-link class="external-link"/>

Schema.org for Vue. Supports typed and automated Google Rich Results

- 😊 No Schema knowledge required, get up and running in minutes with minimal configuration
- ✨ 20+ Typed Schemas for best practice ([Google](https://developers.google.com/search/docs/advanced/structured-data/search-gallery), [Yoast](https://developer.yoast.com/features/schema/overview)) Rich Results
- 🧙 Automated Schema: `@id`, URL / date resolving, route meta and more
- 🤝 Integrations for [VitePress](https://vitepress.vue.com), [Nuxt](https://nuxtjs.org/), [Vitesse](https://nuxtjs.org/) and [Vite](https://vitejs.dev/) with auto-imports
- 🍞 Choose your preferred API: Composables or Components
- 🌳 SSR, tree-shaking and Schema inheritance ready

> Created and maintained by [@harlan-zw](https://github.com/harlan-zw)

<!--GENERATED LIST, DO NOT MODIFY MANUALLY-->
<!--ADDONS_LIST_STARTS-->

## Router - [`@vueuse/router`](https://vueuse.org/router/README.html)

Utilities for vue-router

- [`useRouteHash`](https://vueuse.org/router/useRouteHash/) — shorthand for a reactive `route.hash`
- [`useRouteParams`](https://vueuse.org/router/useRouteParams/) — shorthand for a reactive `route.params`
- [`useRouteQuery`](https://vueuse.org/router/useRouteQuery/) — shorthand for a reactive `route.query`

## Integrations - [`@vueuse/integrations`](https://vueuse.org/integrations/README.html)

Integration wrappers for utility libraries

- [`useAsyncValidator`](https://vueuse.org/integrations/useAsyncValidator/) — wrapper for [`async-validator`](https://github.com/yiminghe/async-validator)
- [`useAxios`](https://vueuse.org/integrations/useAxios/) — wrapper for [`axios`](https://github.com/axios/axios)
- [`useChangeCase`](https://vueuse.org/integrations/useChangeCase/) — reactive wrapper for [`change-case`](https://github.com/blakeembrey/change-case)
- [`useCookies`](https://vueuse.org/integrations/useCookies/) — wrapper for [`universal-cookie`](https://www.npmjs.com/package/universal-cookie)
- [`useDrauu`](https://vueuse.org/integrations/useDrauu/) — reactive instance for [drauu](https://github.com/antfu/drauu)
- [`useFocusTrap`](https://vueuse.org/integrations/useFocusTrap/) — reactive wrapper for [`focus-trap`](https://github.com/focus-trap/focus-trap)
- [`useFuse`](https://vueuse.org/integrations/useFuse/) — easily implement fuzzy search using a composable with [Fuse.js](https://github.com/krisk/fuse)
- [`useIDBKeyval`](https://vueuse.org/integrations/useIDBKeyval/) — wrapper for [`idb-keyval`](https://www.npmjs.com/package/idb-keyval)
- [`useJwt`](https://vueuse.org/integrations/useJwt/) — wrapper for [`jwt-decode`](https://github.com/auth0/jwt-decode)
- [`useNProgress`](https://vueuse.org/integrations/useNProgress/) — reactive wrapper for [`nprogress`](https://github.com/rstacruz/nprogress)
- [`useQRCode`](https://vueuse.org/integrations/useQRCode/) — wrapper for [`qrcode`](https://github.com/soldair/node-qrcode)
- [`useSortable`](https://vueuse.org/integrations/useSortable/) — wrapper for [`sortable`](https://github.com/SortableJS/Sortable)

## RxJS - [`@vueuse/rxjs`](https://vueuse.org/rxjs/README.html)

Enables RxJS reactive functions in Vue

- [`from`](https://vueuse.org/rxjs/from/) — / fromEvent
- [`toObserver`](https://vueuse.org/rxjs/toObserver/) — sugar function to convert a `ref` into an RxJS [Observer](https://rxjs.dev/guide/observer)
- [`useExtractedObservable`](https://vueuse.org/rxjs/useExtractedObservable/) — use an RxJS [`Observable`](https://rxjs.dev/guide/observable) as extracted from one or more composables
- [`useObservable`](https://vueuse.org/rxjs/useObservable/) — use an RxJS [`Observable`](https://rxjs.dev/guide/observable)
- [`useSubject`](https://vueuse.org/rxjs/useSubject/) — bind an RxJS [`Subject`](https://rxjs.dev/guide/subject) to a `ref` and propagate value changes both ways
- [`useSubscription`](https://vueuse.org/rxjs/useSubscription/) — use an RxJS [`Subscription`](https://rxjs.dev/guide/subscription) without worrying about unsubscribing from it or creating memory leaks
- [`watchExtractedObservable`](https://vueuse.org/rxjs/watchExtractedObservable/) — watch the values of an RxJS [`Observable`](https://rxjs.dev/guide/observable) as extracted from one or more composables

## Firebase - [`@vueuse/firebase`](https://vueuse.org/firebase/README.html)

Enables realtime bindings for Firebase

- [`useAuth`](https://vueuse.org/firebase/useAuth/) — reactive [Firebase Auth](https://firebase.google.com/docs/auth) binding
- [`useFirestore`](https://vueuse.org/firebase/useFirestore/) — reactive [Firestore](https://firebase.google.com/docs/firestore) binding
- [`useRTDB`](https://vueuse.org/firebase/useRTDB/) — reactive [Firebase Realtime Database](https://firebase.google.com/docs/database) binding

## fsApi - [`@vueuse/fsApi`](https://vueuse.org/fsApi/README.html)

Provides utilities for the filesystem on the client via the FileSystemAccessAPI.

- [`Directory`](https://vueuse.org/fsApi/Directory/) — a file-system directory handle class that wraps the [FileSystemAccessAPI](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)'s [FileSystemDirectoryHandle](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryHandle) class
- [`File`](https://vueuse.org/fsApi/File/) — a file-system handle class that wraps the [FileSystemAccessAPI](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)'s [FileSystemFileHandle](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle) class
- [`useDirectoryPicker`](https://vueuse.org/fsApi/useDirectoryPicker/) — open a handle for a selected Directory using the [FileSystemAccessAPI](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)'s [showDirectoryPicker](https://developer.mozilla.org/en-US/docs/Web/API/window/showDirectoryPicker) function
- [`useOpenFilePicker`](https://vueuse.org/fsApi/useOpenFilePicker/) — open files using the [FileSystemAccessAPI](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)'s [showOpenFilePicker](https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker) function
- [`useSaveFilePicker`](https://vueuse.org/fsApi/useSaveFilePicker/) — create and write local files using the [FileSystemAccessAPI](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)'s [showSaveFilePicker](https://developer.mozilla.org/en-US/docs/Web/API/window/showSaveFilePicker) function

## Electron - [`@vueuse/electron`](https://vueuse.org/electron/README.html)

Electron renderer process modules for VueUse

- [`useIpcRenderer`](https://vueuse.org/electron/useIpcRenderer/) — provides [ipcRenderer](https://www.electronjs.org/docs/api/ipc-renderer) and all of its APIs
- [`useIpcRendererInvoke`](https://vueuse.org/electron/useIpcRendererInvoke/) — reactive [ipcRenderer.invoke API](https://www.electronjs.org/docs/api/ipc-renderer#ipcrendererinvokechannel-args) result
- [`useIpcRendererOn`](https://vueuse.org/electron/useIpcRendererOn/) — use [ipcRenderer.on](https://www.electronjs.org/docs/api/ipc-renderer#ipcrendereronchannel-listener) with ease and [ipcRenderer.removeListener](https://www.electronjs.org/docs/api/ipc-renderer#ipcrendererremovelistenerchannel-listener) automatically on unmounted
- [`useZoomFactor`](https://vueuse.org/electron/useZoomFactor/) — reactive [WebFrame](https://www.electronjs.org/docs/api/web-frame#webframe) zoom factor
- [`useZoomLevel`](https://vueuse.org/electron/useZoomLevel/) — reactive [WebFrame](https://www.electronjs.org/docs/api/web-frame#webframe) zoom level

<!--ADDONS_LIST_ENDS-->
