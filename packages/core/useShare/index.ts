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

const _navigator = (window.navigator as NavigatorWithShare)

export async function useShare<T>(shareOpts: ShareOptions) {
  if (_navigator && _navigator.share) {
    let granted = true

    if (shareOpts.files && _navigator.canShare)
      granted = _navigator.canShare({ files: shareOpts.files })

    if (granted) {
      _navigator.share(shareOpts)
        .then(() => console.log('Successful share'))
        .catch(err => console.log(err.message))
    }
  }
}
