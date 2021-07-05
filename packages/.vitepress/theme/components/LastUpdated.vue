<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useData } from 'vitepress'

const { theme, page } = useData()

const hasLastUpdated = computed(() => {
  const lu = theme.value.lastUpdated

  return lu !== undefined && lu !== false
})

const prefix = computed(() => {
  const p = theme.value.lastUpdated
  return p === true ? 'Last Updated' : p
})

const datetime = ref('')
onMounted(() => {
  // locale string might be different based on end user
  // and will lead to potential hydration mismatch if calculated at build time
  datetime.value = new Date(page.value.lastUpdated).toLocaleString('en-US')
})
</script>

<template>
  <p v-if="hasLastUpdated" class="last-updated">
    <span class="prefix">{{ prefix }}:</span>
    <span class="datetime">{{ datetime }}</span>
  </p>
</template>

<style scoped>
.last-updated {
  display: inline-block;
  margin: 0;
  line-height: 1.4;
  font-size: 0.9rem;
  color: var(--c-text-light);
}

@media (min-width: 960px) {
  .last-updated {
    font-size: 1rem;
  }
}

.prefix {
  display: inline-block;
  font-weight: 500;
}

.datetime {
  display: inline-block;
  margin-left: 6px;
  font-weight: 400;
}
</style>
