<template>
  <div class="nav-link">
    <a class="item" v-bind="linkProps">
      {{ item.text }} <OutboundLink v-if="isExternal" />
    </a>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import type { DefaultTheme } from '../config'
import { useNavLink } from '../composables/navLink'
import OutboundLink from './icons/OutboundLink.vue'

const props = defineProps<{
  item: DefaultTheme.NavItemWithLink
}>()

const propsRefs = toRefs(props)

const { props: linkProps, isExternal } = useNavLink(propsRefs.item)
</script>

<style scoped>
.item {
  display: block;
  padding: 0 1.5rem;
  line-height: 36px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vt-c-text);
  white-space: nowrap;
}

.item:hover,
.item.active {
  text-decoration: none;
  color: var(--vt-c-brand);
}

.item.external:hover {
  border-bottom-color: transparent;
  color: var(--vt-c-text);
}

@media (min-width: 720px) {
  .item {
    border-bottom: 2px solid transparent;
    padding: 0;
    line-height: 24px;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .item:hover,
  .item.active {
    border-bottom-color: var(--vt-c-brand);
    color: var(--vt-c-text);
  }
}
</style>
