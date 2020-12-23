<template>
  <header v-if="showHero" class="home-hero">
    <figure v-if="$frontmatter.heroImage" class="figure">
      <img
        class="image"
        :src="$withBase($frontmatter.heroImage)"
        :alt="$frontmatter.heroAlt"
      >
    </figure>

    <h1 v-if="hasHeroText" class="title">{{ heroText }}</h1>
    <p v-if="hasTagline" class="description">{{ tagline }}</p>

    <NavLink v-if="hasAction" :item="action" class="action" />
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSiteDataByRoute, useFrontmatter } from 'vitepress'
import NavLink from './NavLink.vue'

const site = useSiteDataByRoute()
const data = useFrontmatter()

const showHero = computed(() => {
  return data.value.heroImage
    || hasHeroText.value
    || hasTagline.value
    || hasAction.value
})

const hasHeroText = computed(() => data.value.heroText !== null)
const heroText = computed(() => data.value.heroText || site.value.title)

const hasTagline = computed(() => data.value.tagline !== null)
const tagline = computed(() => data.value.tagline || site.value.description)

const hasAction = computed(() => data.value.actionLink && data.value.actionText)
const action = computed(() => ({
  link: data.value.actionLink,
  text: data.value.actionText,
}))
</script>

<style scoped>
.home-hero {
  margin: 2.5rem 0 2.75rem;
  padding: 0 1.5rem;
  text-align: center;
}

@media (min-width: 420px) {
  .home-hero {
    margin: 3.5rem 0;
  }
}

@media (min-width: 720px) {
  .home-hero {
    margin: 4rem 0 4.25rem;
  }
}

.figure {
  padding: 0 1.5rem;
}

.image {
  display: block;
  margin: 0 auto;
  width: auto;
  max-width: 100%;
  max-height: 280px;
}

.title {
  margin-top: 1.5rem;
  font-size: 2rem;
}

@media (min-width: 420px) {
  .title {
    font-size: 3rem;
  }
}

@media (min-width: 720px) {
  .title {
    margin-top: 2rem;
  }
}

.description {
  margin: 0;
  margin-top: .25rem;
  line-height: 1.3;
  font-size: 1.2rem;
  color: var(--c-text-light);
}

@media (min-width: 420px) {
  .description {
    line-height: 1.2;
    font-size: 1.6rem;
  }
}

.action {
  margin-top: 1.5rem;
}

@media (min-width: 420px) {
  .action {
    margin-top: 2rem;
  }
}

.action :deep(.item) {
  display: inline-block;
  border-radius: 4px;
  padding: 0 20px;
  line-height: 48px;
  font-size: 1rem;
  font-weight: 500;
  color: #ffffff;
  background-color: var(--c-brand);
  transition: background-color .1s ease;
}

.action :deep(.item:hover) {
  text-decoration: none;
  color: #ffffff;
  background-color: var(--c-brand-light);
}

@media (min-width: 420px) {
  .action :deep(.item) {
    padding: 0 24px;
    line-height: 56px;
    font-size: 1.2rem;
    font-weight: 500;
  }
}
</style>
