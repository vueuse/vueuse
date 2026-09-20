interface RawSponsor {
  name: string
  login: string
  avatar: string
  amount: number
  link: string | null
  org: boolean
}

export interface SponsorItem {
  name: string
  img: string
  url: string
}

export interface SponsorTier {
  tier: string
  size: 'big' | 'medium' | 'small' | 'mini' | 'xmini'
  items: SponsorItem[]
}

const SPONSORS_URL = 'https://cdn.jsdelivr.net/gh/antfu/static/sponsors.json'

function classifyTier(amount: number, login: string): { title: string, size: SponsorTier['size'] } | null {
  if (login === 'vercel')
    return { title: 'Special Sponsor', size: 'big' }
  if (amount >= 500)
    return { title: 'Platinum Sponsors', size: 'big' }
  if (amount >= 100)
    return { title: 'Gold Sponsors', size: 'medium' }
  if (amount >= 50)
    return { title: 'Silver Sponsors', size: 'small' }
  if (amount >= 10)
    return { title: 'Sponsors', size: 'mini' }
  return null
}

async function resolveWebsiteUrl(login: string, fallbackLink: string): Promise<string> {
  try {
    const response = await fetch(`https://api.github.com/users/${login}`)
    if (!response.ok)
      return fallbackLink
    const data = await response.json()
    if (data.blog) {
      return data.blog.startsWith('http') ? data.blog : `https://${data.blog}`
    }
  }
  catch {}
  return fallbackLink
}

const TIER_ORDER = ['Special Sponsor', 'Platinum Sponsors', 'Gold Sponsors', 'Silver Sponsors', 'Sponsors']

export default {
  async load(): Promise<SponsorTier[]> {
    let raw: RawSponsor[]
    try {
      raw = await fetch(SPONSORS_URL).then(r => r.json())
    }
    catch {
      return []
    }

    const eligible = raw.filter(s => s.link && s.amount >= 10)

    // Resolve website URLs from GitHub profiles for sponsors
    // that only link to github.com or opencollective.com
    const resolved = await Promise.all(
      eligible.map(async (sponsor) => {
        let url = sponsor.link!
        if (url.includes('github.com/') || url.includes('opencollective.com/')) {
          url = await resolveWebsiteUrl(sponsor.login, url)
        }
        return { ...sponsor, resolvedUrl: url }
      }),
    )

    const tierMap = new Map<string, SponsorTier>()

    for (const sponsor of resolved) {
      const tier = classifyTier(sponsor.amount, sponsor.login)
      if (!tier)
        continue

      if (!tierMap.has(tier.title)) {
        tierMap.set(tier.title, { tier: tier.title, size: tier.size, items: [] })
      }

      tierMap.get(tier.title)!.items.push({
        name: sponsor.name || sponsor.login,
        img: sponsor.avatar,
        url: sponsor.resolvedUrl,
      })
    }

    return TIER_ORDER
      .map(name => tierMap.get(name))
      .filter((t): t is SponsorTier => !!t && t.items.length > 0)
  },
}

declare const data: SponsorTier[]
export { data }
