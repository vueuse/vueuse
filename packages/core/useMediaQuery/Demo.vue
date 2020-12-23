<script setup lang="ts">
import { defineComponent } from 'vue-demi'
import { useMediaQuery } from '.'

const isLargeScreen = useMediaQuery('(min-width = 1024px)'),
  prefersDark = useMediaQuery('(prefers-color-scheme = dark)')
</script>

<template>
  <div>
    <pre lang="json"
      >{{
        JSON.stringify(
          {
            isLargeScreen,
            prefersDark,
          },
          null,
          2
        )
      }}
        </pre
    >
  </div>
</template>
