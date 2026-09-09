import contributorsGenerated from './contributors.json'

export interface Contributor {
  name: string
  avatar: string
}

export interface TeamMember {
  name: string
  github: string
  twitter?: string
  bluesky?: string
  sponsors?: boolean
  description: string
  packages?: string[]
  functions?: string[]
}

export function getAvatarUrl(login: string) {
  return `https://avatars.githubusercontent.com/${login}?v=4`
}

export const contributors: Contributor[] = (contributorsGenerated as string[])
  .map(name => ({ name, avatar: getAvatarUrl(name) }))

function contributionRank(member: TeamMember) {
  const index = contributorsGenerated.indexOf(member.github)
  return index === -1 ? contributorsGenerated.length : index
}

export const team: TeamMember[] = [
  {
    name: 'Anthony Fu',
    github: 'antfu',
    twitter: 'antfu7',
    bluesky: 'antfu.me',
    sponsors: true,
    description: 'A fanatical open sourceror<br>Core team member of Vite & Vue<br>Working at NuxtLabs',
    packages: ['core'],
  },
  {
    name: 'Patak',
    github: 'patak-cat',
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
    name: 'Harlan Wilton',
    github: 'harlan-zw',
    twitter: 'harlan_zw',
    bluesky: 'harlanzw.com',
    sponsors: true,
    description: 'Building delightful open source<br>Nuxt freelance developer',
    packages: ['schema-org'],
  },
  {
    name: 'Alfred-Skyblue',
    github: 'Alfred-Skyblue',
    description: 'open source enthusiast',
    functions: [
      'useSortable',
    ],
  },
  {
    name: 'Doctorwu',
    github: 'Doctor-wu',
    twitter: 'Doctorwu666',
    bluesky: 'doctorwu.me',
    description: 'Dangerous Coder<br>Open source enthusiast',
  },

  {
    name: 'Tahul',
    github: 'Tahul',
    twitter: 'yaeeelglx',
    bluesky: 'yael.dev',
    sponsors: true,
    description: '',
    packages: ['motion', 'gesture', 'sound'],
  },
  {
    name: 'Bobbie Goede',
    github: 'BobbieGoede',
    twitter: 'BobbieGoede',
    bluesky: 'goede.dev',
    sponsors: true,
    description: '',
    packages: ['motion'],
  },
  {
    name: 'James Garbutt',
    github: '43081j',
    description: '',
  },
  {
    name: 'Robin',
    github: 'OrbisK',
    description: '',
  },
  {
    name: 'IlyaL',
    github: 'ilyaliao',
    description: 'All you need is a notepad and the world becomes your canvas.',
  },
  {
    name: 'Kevin Deng',
    github: 'sxzz',
    description: 'Seeking the meaning of existence.',
  },
  {
    name: 'Vida Xie',
    github: '9romise',
    description: 'Doing what I can to make things better',
  },
  {
    name: 'SerKo',
    github: 'serkodev',
    description: 'Coding for a lazier tomorrow.',
  },
  {
    name: 'sun0day',
    github: 'sun0day',
    description: 'lost in rust :)',
  },
]
  .sort((a, b) => contributionRank(a) - contributionRank(b))

export const emeriti: TeamMember[] = [
  {
    name: 'EGOIST',
    github: 'egoist',
    twitter: '_egoistlily',
    bluesky: 'egoist.dev',
    sponsors: true,
    description: '',
    packages: ['head'],
  },
  {
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
    name: 'anteriovieira',
    github: 'anteriovieira',
    twitter: 'anteriovieira',
    sponsors: false,
    description: '',
  },
  {
    name: 'Alex Kozack',
    github: 'cawa-93',
    twitter: 'alex_kozack',
    bluesky: 'kozack.me',
    sponsors: false,
    functions: ['useMediaControls'],
    description: 'Open Source Contributor from Ukraine',
  },
  {
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
