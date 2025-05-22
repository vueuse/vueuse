import contributorsGenerated from './contributors.json'

export interface Contributor {
  name: string
  avatar: string
}

export interface TeamMember {
  avatar: string
  name: string
  github: string
  twitter?: string
  bluesky?: string
  sponsors?: boolean
  description: string
  packages?: string[]
  functions?: string[]
}

const contributorsAvatars: Record<string, string> = {}

function getAvatarUrl(name: string) {
  return `https://avatars.githubusercontent.com/${name}?v=4`
}

export const contributors = (contributorsGenerated as string[]).reduce((acc, name) => {
  contributorsAvatars[name] = getAvatarUrl(name)
  acc.push({ name, avatar: contributorsAvatars[name] })
  return acc
}, [] as Contributor[])

export const team: TeamMember[] = [
  {
    avatar: contributorsAvatars.antfu,
    name: 'Anthony Fu',
    github: 'antfu',
    twitter: 'antfu7',
    bluesky: 'antfu.me',
    sponsors: true,
    description: 'A fanatical open sourceror<br>Core team member of Vite & Vue<br>Working at NuxtLabs',
    packages: ['core'],
  },
  {
    avatar: contributorsAvatars['patak-dev'],
    name: 'Patak',
    github: 'patak-dev',
    twitter: 'patak_dev',
    bluesky: 'patak.dev',
    sponsors: true,
    functions: [
      'useRefHistory',
      'ignorableWatch',
    ],
    description: 'A collaborative being<br>Core team member of Vite<br>Team member of Vue',
  },
  {
    avatar: contributorsAvatars.wheatjs,
    name: 'wheatjs',
    github: 'wheatjs',
    twitter: 'wheatjs',
    bluesky: 'wheatjs.dev',
    sponsors: false,
    description: 'Software Developer<br>Open Source Contributor<br>Electrical Engineer.',
    functions: ['useFetch'],
    packages: ['components'],
  },
  {
    avatar: contributorsAvatars['harlan-zw'],
    name: 'Harlan Wilton',
    github: 'harlan-zw',
    twitter: 'harlan_zw',
    bluesky: 'harlanzw.com',
    sponsors: true,
    description: 'Building delightful open source<br>Nuxt freelance developer',
    packages: ['schema-org'],
  },
  {
    avatar: contributorsAvatars['Alfred-Skyblue'],
    name: 'Alfred-Skyblue',
    github: 'Alfred-Skyblue',
    description: 'open source enthusiast',
    functions: [
      'useSortable',
    ],
  },
  {
    avatar: contributorsAvatars['Doctor-wu'],
    name: 'Doctorwu',
    github: 'Doctor-wu',
    twitter: 'Doctorwu666',
    bluesky: 'doctorwu.me',
    description: 'Dangerous Coder<br>Open source enthusiast',
  },

  {
    avatar: contributorsAvatars.Tahul,
    name: 'Tahul',
    github: 'Tahul',
    twitter: 'yaeeelglx',
    bluesky: 'yael.dev',
    sponsors: true,
    description: '',
    packages: ['motion', 'gesture', 'sound'],
  },
  {
    avatar: contributorsAvatars.BobbieGoede,
    name: 'Bobbie Goede',
    github: 'BobbieGoede',
    twitter: 'BobbieGoede',
    bluesky: 'goede.dev',
    sponsors: true,
    description: '',
    packages: ['motion'],
  },
]
  .sort((pre, cur) => contributorsGenerated.findIndex(name => name === pre.github) - contributorsGenerated.findIndex(name => name === cur.github))

export const emeriti: TeamMember[] = [
  {
    avatar: contributorsAvatars.egoist,
    name: 'EGOIST',
    github: 'egoist',
    twitter: '_egoistlily',
    bluesky: 'egoist.dev',
    sponsors: true,
    description: '',
    packages: ['head'],
  },
  {
    avatar: contributorsAvatars.webfansplz,
    name: 'webfansplz',
    github: 'webfansplz',
    twitter: 'webfansplz',
    sponsors: false,
    functions: [
      'useDateFormat',
      'useAsyncQueue',
    ],
    description: 'FE Developer<br>Love open source',
  },
  {
    avatar: contributorsAvatars.anteriovieira,
    name: 'anteriovieira',
    github: 'anteriovieira',
    twitter: 'anteriovieira',
    sponsors: false,
    description: '',
  },
  {
    avatar: contributorsAvatars['cawa-93'],
    name: 'Alex Kozack',
    github: 'cawa-93',
    twitter: 'alex_kozack',
    bluesky: 'kozack.me',
    sponsors: false,
    functions: ['useMediaControls'],
    description: 'Open Source Contributor from Ukraine',
  },
  {
    avatar: contributorsAvatars.scottbedard,
    name: 'Scott Bedard',
    github: 'scottbedard',
    bluesky: 'scottbedard.net',
    sponsors: false,
    functions: [
      'useTransition',
      'useDocumentVisibility',
      'useElementVisibility',
    ],
    description: '',
  },
  {
    avatar: contributorsAvatars.sibbng,
    name: 'sibbng',
    github: 'sibbng',
    sponsors: false,
    description: '',
    functions: [
      'onClickOutside',
      'useStyleTag',
    ],
  },
  {
    avatar: contributorsAvatars.okxiaoliang4,
    name: 'Jelf',
    github: 'okxiaoliang4',
    twitter: 'okxiaoliang4',
    sponsors: false,
    functions: [
      'useElementByPoint',
      'useScreenSafeArea',
    ],
    description: '',
  },
  {
    avatar: contributorsAvatars.lstoeferle,
    name: 'lstoeferle',
    github: 'lstoeferle',
    twitter: '54ku1',
    sponsors: false,
    functions: [
      'useSwipe',
      'useUrlSearchParams',
    ],
    description: '',
  },
]
