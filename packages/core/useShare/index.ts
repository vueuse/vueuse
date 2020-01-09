interface NavigatorWithShare extends Navigator {
  share?: (data: ShareOptions) => Promise<void>
  canShare?: (data: ShareOptions) => boolean
}

type ShareOptions = {
  title?: string
  files?: File[]
  text?: string
  url?: string
}

export async function useShare(shareOpts: ShareOptions) {
  const _navigator = (window.navigator as NavigatorWithShare)

  if (_navigator && _navigator.share) {
    let granted = true

    if (shareOpts.files && _navigator.canShare)
      granted = _navigator.canShare({ files: shareOpts.files })

    if (granted)
      return _navigator.share(shareOpts)
  }
}
