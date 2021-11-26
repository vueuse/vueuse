---
category: Browser
---

# useNotification

Reactive [Notification](https://developer.mozilla.org/en-US/docs/Web/API/notification)

The Notification interface of the Notifications API is used to configure and display desktop notifications to the user.

## Usage

```ts
const { notification, showNotification } = useNotification(
  'Hello, world!',
  {
    dir: 'auto',
    lang: 'en',
    renotify: true
  },
  {
    onClick: null,
    onShow: null,
    onError: null,
    onClose: null,
  },
)

showNotification()
```