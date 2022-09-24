import type { VueUseFunction } from '@vueuse/metadata'

export const head: VueUseFunction[] = [
  {
    name: 'createHead',
    package: 'head',
    description: 'create the head manager instance.',
    category: '@Head',
    external: 'https://github.com/vueuse/head#api',
  },
  {
    name: 'useHead',
    package: 'head',
    description: 'update head meta tags reactively.',
    category: '@Head',
    external: 'https://github.com/vueuse/head#api',
  },
]

const motionDefaults = {
  package: 'motion',
  category: '@Motion',
}

export const motion: VueUseFunction[] = [
  {
    ...motionDefaults,
    name: 'useMotion',
    description: 'putting your components in motion.',
    external: 'https://motion.vueuse.org/api/use-motion.html',
  },
  {
    ...motionDefaults,
    name: 'useSpring',
    description: 'spring animations.',
    external: 'https://motion.vueuse.org/api/use-spring.html',
  },
  {
    ...motionDefaults,
    name: 'useMotionProperties',
    description: 'access Motion Properties for a target element.',
    external: 'https://motion.vueuse.org/api/use-motion-properties.html',
  },
  {
    ...motionDefaults,
    name: 'useMotionVariants',
    description: 'handle the Variants state and selection.',
    external: 'https://motion.vueuse.org/api/use-motion-variants.html',
  },
  {
    ...motionDefaults,
    name: 'useElementStyle',
    description: 'sync a reactive object to a target element CSS styling',
    external: 'https://motion.vueuse.org/api/use-element-style.html',
  },
  {
    ...motionDefaults,
    name: 'useElementTransform',
    description: 'sync a reactive object to a target element CSS transform.',
    external: 'https://motion.vueuse.org/api/use-element-transform.html',
  },
]

export const sound: VueUseFunction[] = [
  {
    name: 'useSound',
    package: 'sound',
    description: 'play sound effects reactively.',
    category: '@Sound',
    external: 'https://github.com/vueuse/sound#examples',
  },
]

export const schemaOrg: VueUseFunction[] = [
  {
    name: 'createSchemaOrg',
    package: 'schema-org',
    description: 'create the schema.org manager instance.',
    category: '@SchemaOrg',
    external: 'https://vue-schema-org.netlify.app/api/core/create-schema-org.html',
  },
  {
    name: 'useSchemaOrg',
    package: 'schema-org',
    description: 'update schema.org reactively.',
    category: '@SchemaOrg',
    external: 'https://vue-schema-org.netlify.app/api/core/use-schema-org.html',
  },
]

export const ecosystemFunctions = [
  ...head,
  ...motion,
  ...schemaOrg,
  ...sound,
]
