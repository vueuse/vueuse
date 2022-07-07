---
category: '@Electron'
---

# isElectronEnv

Detect whether it is currently in an Electronic environment. 

Avoid `window.require is not a function` when using `window.require('electron')`.


## Usage

```ts
import { isElectronEnv, useIpcRenderer } from '@vueuse/electron'

if (isElectronEnv()) {
  const ipcRenderer = useIpcRenderer()
  const result = ipcRenderer.invoke<string>('custom-channel', 'some data')
}
```
