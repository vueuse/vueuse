export const jointWindow = <Window>{
  addEventListener: (...args: Parameters<Window['addEventListener']>) => {
    window.addEventListener(...args)
    window.parent.addEventListener(...args)
  },
  removeEventListener: (...args: Parameters<Window['removeEventListener']>) => {
    window.removeEventListener(...args)
    window.parent.removeEventListener(...args)
  },
}
