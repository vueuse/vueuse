<script setup lang="ts">
import { defineComponent } from 'vue-demi'
import { useWindowScroll } from '.'

return useWindowScroll()
</script>

<template>
  <div>
    <note>See scroll values in the lower right corner of the screen.</note>
    <div
      style="
        position: absolute;
        top: 100%;
        left: 100%;
        width: 10000px;
        height: 10000px;
      "
    ></div>
    <div
      id="demo"
      style="
        position: fixed;
        bottom: 0;
        right: 0;
        padding: 1em 5em 1em 1.5em;
        min-width: 320px;
      "
    >
      <p>x: {{ x }}</p>
      <p>y: {{ y }}</p>
    </div>
  </div>
</template>
