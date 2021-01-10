
# Add-ons

The core package aims to be lightweight and dependence free. While the add-ons are wrapping popular packages into the consistent API style.

<!--GENERATED LIST, DO NOT MODIFY MANUALLY-->
<!--ADDONS_LIST_STARTS-->

### Router ([`@vueuse/router`](https://vueuse.js.org/router/README.html))
Utilities for vue-router
  - [`useRouteHash`](https://vueuse.js.org/router/useRouteHash/) — shorthand for reactive route.hash
  - [`useRouteQuery`](https://vueuse.js.org/router/useRouteQuery/) — shorthand for reactive route.query



### Integrations ([`@vueuse/integrations`](https://vueuse.js.org/integrations/README.html))
Integration wrappers for utility libraries
  - [`useAxios`](https://vueuse.js.org/integrations/useAxios/) — wrapper for [`axios`](https://github.com/axios/axios)
  - [`useCookies`](https://vueuse.js.org/integrations/useCookies/) — wrapper for [`universal-cookie`](https://www.npmjs.com/package/universal-cookie)
  - [`useNProgress`](https://vueuse.js.org/integrations/useNProgress/) — reactive wrapper for [`nprogress`](https://github.com/rstacruz/nprogress)
  - [`useQRCode`](https://vueuse.js.org/integrations/useQRCode/) — wrapper for [`qrcode`](https://github.com/soldair/node-qrcode)



### RxJS ([`@vueuse/rxjs`](https://vueuse.js.org/rxjs/README.html))
Enables RxJS reactive functions in Vue
  - [`from`](https://vueuse.js.org/rxjs/from/) — two wrappers around of the original functions to allow use ref objects
  - [`toObserver`](https://vueuse.js.org/rxjs/toObserver/) — sugar function to convert a ref in an observer
  - [`useObservable`](https://vueuse.js.org/rxjs/useObservable/) — use an Observable
  - [`useSubscription`](https://vueuse.js.org/rxjs/useSubscription/) — uses subscriptions without worry about unsubscribing to it or memory leaks



### Firebase ([`@vueuse/firebase`](https://vueuse.js.org/firebase/README.html))
Enables realtime bindings for Firebase
  - [`useFirestore`](https://vueuse.js.org/firebase/useFirestore/) — reactive [Firestore](https://firebase.google.com/docs/firestore) binding
  - [`useRTDB`](https://vueuse.js.org/firebase/useRTDB/) — reactive [Firebase Realtime Database](https://firebase.google.com/docs/database) binding


<!--ADDONS_LIST_ENDS-->
