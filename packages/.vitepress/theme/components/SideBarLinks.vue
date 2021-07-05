<script setup lang="ts">
import { useSideBar } from '../composables/sideBar'
import { SideBarLink } from './SideBarLink'

const items = useSideBar()
</script>

<template>
  <ul v-if="items.length > 0" class="sidebar-links">
    <SideBarLink v-for="item, idx of items" :key="idx" :item="item" />
  </ul>
</template>
