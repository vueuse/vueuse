type ShareOptions = {
  title?: string
  files?: File[]
  text?: string
  url?: string
}

interface NavigatorWithShare {
  share?: (data: ShareOptions) => Promise<void>
  canShare?: (data: ShareOptions) => boolean
}

export function useShare(globalShareOpts?: ShareOptions) {
  const _navigator = (window.navigator as NavigatorWithShare)
  const isSupported = 'canShare' in _navigator

  const share = (shareOpts: ShareOptions = {}) => {
    if (isSupported) {
      const data = globalShareOpts || shareOpts
      let granted = true

      if (data.files && _navigator.canShare)
        granted = _navigator.canShare({ files: data.files })

      if (granted)
        return _navigator.share!(data)
    }
  }

  return {
    isSupported,
    share,
  }
}
