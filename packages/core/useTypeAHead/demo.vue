<script  lang="ts">
import { defineComponent, ref } from 'vue'
import { useTypeAHead } from '@vueuse/core'

export default defineComponent({
  setup() {
    const demoList = ref([
      { label: 'Amy', id: 'Amy', __th_disabled: true },
      { label: 'Ascy', id: 'Ascy' },
      { label: 'Acy', id: 'Acy', __th_skip: true },
      { label: 'Aty', id: 'Aty' },
      { label: 'A s', id: 'Al' },
      { label: 'Acys', id: 'Acy' },
      { label: 'vl', id: 'Alqw' },
      { label: 'cmy', id: 'A2my' },
      { label: 'ccy', id: 'Acqwey' },
      { label: 'vscy', id: 'Asrcy' },
      { label: 'bty', id: 'Aqwty' },
      { label: 'bl', id: 'Aasdl' },
      { label: 'Acasy', id: 'wdcy', __th_skip: true },
    ])
    const typeAHead = useTypeAHead(demoList, 'label')
    const activeIndex = ref<number>(-1)
    const handleKeyDown = (e: KeyboardEvent) => {
      activeIndex.value = typeAHead.match()(e)
    }
    const showList = ref<boolean>(false)
    return {
      showList,
      demoList,
      handleKeyDown,
      activeIndex,
    }
  },
})
</script>

<template>
  <div class="demo-typeahead">
    activeIndex: {{ activeIndex }}
    <div>
      <input class="demo-typeahead--input" @keydown="(e)=>handleKeyDown(e)" @focus="showList = true" @blur="showList = false">
      <ul v-show="showList" class="demo-typeahead--ul">
        <li
          v-for="(item,index) in demoList"
          :key="item.id"
          :class="activeIndex === index ? 'demo-typeahead--ul__active' : ''"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>
<style>
  .demo-typeahead{
    width: 400px;
    height: 100px;
    position: relative;
  }
  .demo-typeahead--input,
  .demo-typeahead--ul
  {
    position: absolute;
    background: white;
    width: 100%;
    border-radius: 4px;
  }
  .demo-typeahead--ul{
    z-index: 9999;
    top:50px
  }
  .demo-typeahead--ul li{
    list-style: none;
  }
  .demo-typeahead--ul__active{
    background: #3fb983;
    color: white;
    z-index: 2;
  }
</style>
