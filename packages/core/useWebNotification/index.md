---
category: Browser
---

# useWebNotification

Reactive [Notification](https://developer.mozilla.org/en-US/docs/Web/API/notification)

The Web Notification interface of the Notifications API is used to configure and display desktop notifications to the user.

## Usage

```js
const {
  isSupported,
  notification,
  show,
  close,
} = useWebNotification(
  'Hello, VueUse world!',
  {
    dir: 'auto',
    lang: 'en',
    renotify: true,
  },
  {
    onClick: null,
    onShow: null,
    onError: null,
    onClose: null,
  },
)

show()

close()
```