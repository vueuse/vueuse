<script setup lang="ts">
import { ref } from 'vue-demi'
import { useProjection } from '.'

const domainStart = ref(0)
const domainEnd = ref(10)
const valueStart = ref(0)
const valueEnd = ref(100)

const [useProjector] = useProjection(domainStart, domainEnd, valueStart, valueEnd)
const domain = ref(0)
const value = useProjector(domain)
</script>

<template>
  <div>
    <div>
      Projection from [{{ domainStart }}, {{ domainEnd }}] to [{{ valueStart }}, {{ valueEnd }}];
    </div>
    <div>
      <label for="domain">Domain: {{ domain }}</label>
      <input id="domain" v-model.number="domain" type="range" :min="domainStart" :max="domainEnd">
    </div>
    <div>
      Value: {{ value }}
    </div>
  </div>
</template>
