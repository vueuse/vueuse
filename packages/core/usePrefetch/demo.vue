<script setup lang="ts">
import { usePrefetch } from '@vueuse/core'

// prefetch style
usePrefetch('https://example.com/style.css', { as: 'style' })

// prefetch script
usePrefetch('https://example.com/js.js', { as: 'script' })

// prefetch font
usePrefetch('https://example.com/font.woff2', { as: 'font' })

// prefetch image with crossorigin
usePrefetch('https://example.com/image.jpg', {
  as: 'image',
  crossOrigin: 'anonymous',
})
</script>
