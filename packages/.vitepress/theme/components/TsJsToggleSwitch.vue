<script setup lang="ts">
import type { Ref } from 'vue'
import { computed, ref } from 'vue'
import { useRoute } from 'vitepress'
import { VTIconChevronDown, VTSwitch } from '@vue/theme'

const preferJsKey = 'vueuse-docs-prefer-js'

const hasStorage = typeof localStorage !== 'undefined'
function get(key: string, defaultValue = false): boolean {
  return hasStorage
    ? JSON.parse(localStorage.getItem(key) || String(defaultValue))
    : defaultValue
}
const preferJs = ref(get(preferJsKey))

const isOpen = ref(true)
const route = useRoute()

function useToggleFn(
  storageKey: string,
  state: Ref<boolean>,
  className: string,
) {
  if (typeof localStorage === 'undefined')
    return () => {}

  const classList = document.documentElement.classList
  return (value = !state.value) => {
    // eslint-disable-next-line no-cond-assign
    if ((state.value = value))
      classList.add(className)

    else
      classList.remove(className)

    localStorage.setItem(storageKey, String(state.value))
  }
}

const toggleJS = useToggleFn(preferJsKey, preferJs, 'prefer-js')

const show = computed(() => {
  return route.path.match(/^\/(shared|core|components|math|router|integrations|rxjs|firebase|electron)/)
})

function toggleOpen() {
  isOpen.value = !isOpen.value
}

function removeOutline(e: Event) {
  (e.target as HTMLElement).classList.add('no-outline')
}

function restoreOutline(e: Event) {
  (e.target as HTMLElement).classList.remove('no-outline')
}
</script>

<template>
  <div v-if="show" class="preference-switch">
    <button
      class="toggle"
      aria-label="preference switches toggle"
      aria-controls="preference-switches"
      :aria-expanded="isOpen"
      @click="toggleOpen"
      @mousedown="removeOutline"
      @blur="restoreOutline"
    >
      <span>Language Preference</span>
      <VTIconChevronDown class="vt-link-icon" :class="{ open: isOpen }" />
    </button>
    <div id="preference-switches" :hidden="!isOpen" :aria-hidden="!isOpen">
      <div class="switch-container">
        <label class="ts-label" @click="toggleJS(false)">
          Typescript
        </label>
        <VTSwitch
          class="api-switch"
          aria-label="prefer javscript api"
          :aria-checked="preferJs"
          @click="toggleJS()"
        />
        <label
          class="js-label" @click="toggleJS(true)"
        >Javascript</label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preference-switch {
  font-size: 12px;
  border-bottom: 1px solid var(--vt-c-divider-light);
  transition: border-color 0.5s, background-color 0.5s ease;
  margin-bottom: 20px;
  position: sticky;
  top: -0.5px;
  background-color: var(--vp-sidebar-bg-color);
  padding-top: 10px;
  z-index: 10;
}

.toggle {
  color: var(--vt-c-text-2);
  transition: color 0.5s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 2px;
  width: 100%;
  font-weight: 600;
}

.toggle:hover {
  color: var(--vt-c-text-1);
}

.no-outline {
  outline: 0;
}

.vt-link-icon {
  position: relative;
  top: 1px;
}

.vt-link-icon.open {
  transform: rotate(180deg);
}

#preference-switches {
  padding: 12px 16px;
  background-color: var(--vt-c-bg-soft);
  transition: background-color 0.5s;
  margin: 6px 0 12px;
  border-radius: 8px;
  font-weight: 600;
}

.switch-container {
  display: flex;
  align-items: center;
}

@media(max-width: 959px){
  .switch-container {
    /* padding: 0 1em; */
  }
}

.switch-container:nth-child(2) {
  margin-top: 10px;
}

.vt-switch {
  margin-right: 5px;
  transform: scale(0.8);
}

.switch-container label {
  transition: color 0.5s;
  cursor: pointer;
}

.switch-container .js-label {
  margin-right: 5px;
}
</style>

<style>
.js-api {
  display: none;
}

.prefer-js .ts-api {
  display: none;
}

.prefer-js .js-api {
  display: initial;
}

.prefer-js .api-switch .vt-switch-check {
  transform: translateX(18px);
}

.js-label,
.prefer-js .options-label {
  color: var(--vt-c-text-3);
}

.prefer-js .js-label {
  color: var(--vt-c-text-1);
}
</style>
