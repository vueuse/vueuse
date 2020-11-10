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

export function useShare() {
  const _navigator = (window.navigator as NavigatorWithShare)
  const isSupported = 'canShare' in _navigator

  const share = (shareOpts: ShareOptions) => {
    if (isSupported) {
      let granted = true

      if (shareOpts.files && _navigator.canShare)
        granted = _navigator.canShare({ files: shareOpts.files })

      if (granted)
        return _navigator.share!(shareOpts)
    }
  }

  return {
    isSupported,
    share,
  }
}
