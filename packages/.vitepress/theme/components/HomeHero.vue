<template>
  <header v-if="showHero" class="home-hero pt-25 pb-10 px-5">
    <!-- <figure v-if="$frontmatter.heroImage" class="figure">
      <img class="image" :src="$withBase($frontmatter.heroImage)" :alt="$frontmatter.heroAlt">
    </figure>

    <h1 v-if="hasHeroText" class="title">
      {{ heroText }}
    </h1>
    <p v-if="hasTagline" class="description">
      {{ tagline }}
    </p> -->

    <p align="center">
      <a href="https://github.com/vueuse/vueuse">
        <img v-show="isDark" src="/logo-vertical-dark.png" alt="VueUse - Collection of essential Vue Composition Utilities" height="300">
        <img v-show="!isDark" src="/logo-vertical.png" alt="VueUse - Collection of essential Vue Composition Utilities" height="300">
      </a>
      <br>
    </p>
    <div class="description">
      Collection of essential Vue Composition Utilities
    </div>

    <NavLink
      v-if="frontmatter.actionLink && frontmatter.actionText"
      :item="{ link: frontmatter.actionLink, text: frontmatter.actionText }"
      class="action"
    />

    <NavLink
      v-if="frontmatter.altActionLink && frontmatter.altActionText"
      :item="{
        link: frontmatter.altActionLink,
        text: frontmatter.altActionText
      }"
      class="action alt"
    />
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import NavLink from './NavLink.vue'

const { site, frontmatter } = useData()

const showHero = computed(() => {
  const {
    heroImage,
    heroText,
    tagline,
    actionLink,
    actionText,
  } = frontmatter.value
  return heroImage || heroText || tagline || (actionLink && actionText)
})

const heroText = computed(() => frontmatter.value.heroText || site.value.title)
</script>

<style scoped>
.home-hero {
  margin: 0rem 0 2.75rem;
  text-align: center;
}

@media (min-width: 420px) {
  .home-hero {
    margin: 0rem 0;
  }
}

@media (min-width: 720px) {
  .home-hero {
    margin: 0rem 0 4.25rem;
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
  line-height: 1.3;
  font-size: 1.2rem;
  color: var(--c-text-light);
}

.action {
  margin-top: 1.5rem;
  display: inline-block;
}

.action.alt {
  margin-left: 1.5rem;
}

@media (min-width: 420px) {
  .action {
    margin-top: 2rem;
    display: inline-block;
  }
}

.action :deep(.item) {
  display: inline-block;
  border-radius: 6px;
  padding: 0 18px;
  line-height: 40px;
  font-size: 1.1rem;
  font-weight: 500;
  border: 0;
  color: #ffffff;
  background-color: var(--c-brand);
  transition: background-color 0.1s ease;
}

.action :deep(.item:hover) {
  text-decoration: none;
  color: #ffffff;
  background-color: var(--c-brand-light);
}

.action.alt :deep(.item) {
  background-color: #476582;
}

.action.alt :deep(.item:hover) {
  background-color: #304a64;
}
</style>
