---
category: Browser
---

# useWebNotification

Reactive [Notification](https://developer.mozilla.org/en-US/docs/Web/API/notification)

The Web Notification interface of the Notifications API is used to configure and display desktop notifications to the user.

## Usage

```ts
const {
  isSupported,
  notification,
  show,
  close,
  onClick,
  onShow,
  onError,
  onClose,
} = useWebNotification({
  title: 'Hello, VueUse world!',
  dir: 'auto',
  lang: 'en',
  renotify: true,
  tag: 'test',
})

if (isSupported.value)
  show()
```

This composable also utilizes the createEventHook utility from '@vueuse/shared`:

```ts
onClick((evt: Event) => {
  // Do something with the notification on:click event...
})

onShow((evt: Event) => {
  // Do something with the notification on:show event...
})

onError((evt: Event) => {
  // Do something with the notification on:error event...
})

onClose((evt: Event) => {
  // Do something with the notification on:close event...
})
```
