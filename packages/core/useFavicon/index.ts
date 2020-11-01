export function useFavicon(options: {
  baseUrl?: string
  rel?: string
  defaultIcon?: string
} = {}) {
  const {
    baseUrl = '/',
    rel = 'icon',
    defaultIcon = 'favicon.ico',
  } = options

  const setIcon = (icon: string) => {
    document.head.querySelectorAll<HTMLLinkElement>(`link[rel*="${rel}"]`).forEach((el: HTMLLinkElement) => {
      el.href = `${baseUrl}${icon}`
    })
  }

  const resetIcon = () => {
    document.head.querySelectorAll<HTMLLinkElement>(`link[rel*="${rel}"]`).forEach((el: HTMLLinkElement) => {
      el.href = `${baseUrl}${defaultIcon}`
    })
  }

  return {
    setIcon,
    resetIcon,
  }
}
