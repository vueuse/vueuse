<script setup lang="ts">
import { ref } from 'vue-demi'
import HeightTransition from './HeightTransition.vue'
const show = ref(true)
</script>

<template>
  <div>
    <button class="" @click="show = !show">
      {{ show ? "Show less..." : "Show more..." }}
    </button>
    <HeightTransition>
      <p v-if="show" class="container--full-box">
        Text inside reusable Vue.js &lt;Transition&gt;. Basic &lt;p&gt; tag demo with padding, border, and margin.
      </p>
    </HeightTransition>
  </div>
</template>

<style scoped>
.container--full-box {
  /* background-color: rgb(0, 88, 4); */
  /* width: 10em; */
  padding-bottom: 1em; /* 1:1 Aspect Ratio */
  padding-top: 1em; /* 1:1 Aspect Ratio */
  margin-top: 1em;
  margin-bottom: 1em;
  border-top: 1em solid green;
  border-bottom: 1em solid green;
  position: relative; /* If you want text inside of it */
}
.container--height {
  background-color: rgb(0, 88, 4);
  height: 5em;
}
.container--height::before {
  content: "::before selector";
  background-color: rgba(216, 214, 215, 0.2);
  border: 3px solid rebeccapurple;
  padding-top: 2.65em;
  /* padding-left: 2em; */
}
</style>
