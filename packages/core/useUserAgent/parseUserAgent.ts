import { detectOperatingSystem } from './detectOperatingSystem'

import { matchUserAgent } from './matchUserAgent'

import { createVersionParts } from './utils'

import type { OperatingSystem, UserAgentMatch } from './types'

const REQUIRED_VERSION_PARTS = 3

export interface Browser {
  /**
   *
   * The browser name
   *
   */
  name: string | null
  /**
   *
   * The detected browser version
   *
   */
  version: string | null
  /**
   *
   * The detected Operating System
   *
   */
  os: OperatingSystem | null
}

export const parseUserAgent = (
  userAgent: string,
): Browser => {
  const matchedRule: UserAgentMatch = matchUserAgent(userAgent)

  if (!matchedRule) {
    return {
      name: null,
      version: null,
      os: null,
    }
  }

  const [name, match] = matchedRule

  let versionParts = match[1] && match[1].split('.').join('_').split('_').slice(0, 3)

  if (versionParts) {
    if (versionParts.length < REQUIRED_VERSION_PARTS) {
      versionParts = [
        ...versionParts,
        ...createVersionParts(REQUIRED_VERSION_PARTS - versionParts.length),
      ]
    }
  }
  else {
    versionParts = []
  }

  const version = versionParts.join('.')

  const os = detectOperatingSystem(userAgent)

  return {
    name,
    version,
    os,
  }
}
