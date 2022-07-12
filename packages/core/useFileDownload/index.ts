export interface DownloadOptions {
  href: string | Blob
  fileName: string
  fileType: string
  onSuccess?: () => void
  onFail?: (e: any) => void
}

export function useFileDownload(options: DownloadOptions) {
  const {
    href,
    fileName,
    fileType,
    onSuccess,
    onFail,
  } = options
  const download = () => {
    const link = document.createElement('a')
    document.body.appendChild(link)
    link.style.display = 'none'
    link.download = `${fileName}.${fileType}`
    const blob = new Blob([href])
    const URL = window.URL || window.webkitURL
    link.href = URL.createObjectURL(blob)
    try {
      link.click()
      onSuccess?.()
    }
    catch (e) {
      onFail?.(e)
    }
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }
  return {
    download,
  }
}
