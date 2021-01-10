<template>
  <a
    class="nav-bar-title"
    :href="$site.base"
    :aria-label="`${$site.title}, back to home`"
  >
    <img
      v-if="$themeConfig.logo"
      class="logo"
      :src="$withBase($themeConfig.logo)"
      alt="Logo"
    >
    <span class="title">{{ $site.title }}</span>
  </a>
</template>

<style scoped>
.nav-bar-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--c-text);
  vertical-align: center;
}

.nav-bar-title:hover {
  text-decoration: none;
}

.logo {
  margin-right: .75rem;
  height: 2.2rem;
  vertical-align: middle;
}

.title {
  line-height: 2rem;
  vertical-align: middle;
}
</style>
