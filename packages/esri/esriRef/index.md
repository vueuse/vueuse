---
category: @Esri
---

# esriRef

create a ref var with Accessor's property

## Usage

```js
import { esriRef } from '@vueuse/esri'

const map = new ArcGISMap({
  basemap: 'arcgis-topographic',
})
const view = new MapView({
  map,
  center: [113, 23],
  zoom: 6,
  container: 'esri-container',
})

const extent = esriRef(view, 'extent')
// extext is Ref

```
