import { defineConfig } from 'vitepress'
import llmstxt from 'vitepress-plugin-llms'

export default defineConfig({
  title: 'VueUse LLM Fixture',
  description: 'Fixture docs for verifying vitepress-plugin-llms output.',
  themeConfig: {
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Concepts', link: '/guide/concepts' },
        ],
      },
    ],
  },
  vite: {
    plugins: [
      llmstxt({
        injectLLMHint: false,
      }),
    ],
  },
})
