import type { UserAgentMatch, UserAgentRule } from './types'

const SEARCHBOX_UA_REGEX = /alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/

const userAgentRules: UserAgentRule[] = [
  ['aol', /AOLShield\/([0-9\._]+)/],
  ['edge', /Edge\/([0-9\._]+)/],
  ['edge-ios', /EdgiOS\/([0-9\._]+)/],
  ['yandexbrowser', /YaBrowser\/([0-9\._]+)/],
  ['kakaotalk', /KAKAOTALK\s([0-9\.]+)/],
  ['samsung', /SamsungBrowser\/([0-9\.]+)/],
  ['silk', /\bSilk\/([0-9._-]+)\b/],
  ['miui', /MiuiBrowser\/([0-9\.]+)$/],
  ['beaker', /BeakerBrowser\/([0-9\.]+)/],
  ['edge-chromium', /EdgA?\/([0-9\.]+)/],
  [
    'chromium-webview',
    /(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/,
  ],
  ['chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
  ['phantomjs', /PhantomJS\/([0-9\.]+)(:?\s|$)/],
  ['crios', /CriOS\/([0-9\.]+)(:?\s|$)/],
  ['firefox', /Firefox\/([0-9\.]+)(?:\s|$)/],
  ['fxios', /FxiOS\/([0-9\.]+)/],
  ['opera-mini', /Opera Mini.*Version\/([0-9\.]+)/],
  ['opera', /Opera\/([0-9\.]+)(?:\s|$)/],
  ['opera', /OPR\/([0-9\.]+)(:?\s|$)/],
  ['pie', /^Microsoft Pocket Internet Explorer\/(\d+\.\d+)$/],
  ['pie', /^Mozilla\/\d\.\d+\s\(compatible;\s(?:MSP?IE|MSInternet Explorer) (\d+\.\d+);.*Windows CE.*\)$/],
  ['netfront', /^Mozilla\/\d\.\d+.*NetFront\/(\d.\d)/],
  ['ie', /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],
  ['ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
  ['ie', /MSIE\s(7\.0)/],
  ['bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/],
  ['android', /Android\s([0-9\.]+)/],
  ['ios', /Version\/([0-9\._]+).*Mobile.*Safari.*/],
  ['safari', /Version\/([0-9\._]+).*Safari/],
  ['facebook', /FB[AS]V\/([0-9\.]+)/],
  ['instagram', /Instagram\s([0-9\.]+)/],
  ['ios-webview', /AppleWebKit\/([0-9\.]+).*Mobile/],
  ['ios-webview', /AppleWebKit\/([0-9\.]+).*Gecko\)$/],
  ['curl', /^curl\/([0-9\.]+)$/],
  ['searchbot', SEARCHBOX_UA_REGEX],
]

/**
 *
 * @param userAgent
 * @returns a matched user agent of type UserAgentMatch
 */
export const matchUserAgent = (userAgent: string): UserAgentMatch => {
  return (
    userAgent !== ''
    && userAgentRules.reduce<UserAgentMatch>(
      (matched: UserAgentMatch, [browser, regex]) => {
        if (matched)
          return matched

        const uaMatch = regex.exec(userAgent)
        return !!uaMatch && [browser, uaMatch]
      },
      false,
    )
  )
}
