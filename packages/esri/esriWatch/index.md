---
category: @Esri
---

# esriWatch

Accessor's esriWatch() in a scope lifecycle

## Usage

```js
import { esriWatch } from '@vueuse/esri'

const map = new ArcGISMap({
  basemap: 'arcgis-topographic',
})
const view = new MapView({
  map,
  center: [113, 23],
  zoom: 6,
  container: 'esri-container',
})

esriWatch(view, 'zoom', (val) => {
  // this callback will be executed when the view.zoom changed
})

```
