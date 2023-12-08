export interface useUpdaterOptions {
  timer?: number
  path?: string
}
export class Updater {
  oldScript: string[]
  newScript: string[]
  dispatch: Record<string, Function[]>
  static instance: any
  static htmlPath: string
  static isInstance: boolean
  private constructor(options: useUpdaterOptions) {
    if (Updater.instance)
      throw new Error('Use Updater.getInstance() to get an instance.')

    if (!Updater.instance && !Updater.isInstance)
      throw new Error('Use Updater must call the getInstance method init')

    this.oldScript = []
    this.newScript = []
    this.dispatch = {}
    Updater.htmlPath = options?.path || '/main'
    this.init()
    this.timing(options?.timer)
  }

  static getInstance(options: useUpdaterOptions) {
    if (!Updater.instance) {
      Updater.isInstance = true
      Updater.instance = new Updater(options)
    }
    return Updater.instance
  }

  async init() {
    const html: string = await this.getHtml()
    this.oldScript = this.parserScript(html)
  }

  async getHtml() {
    const html = await fetch(Updater.htmlPath).then(res => res.text())
    return html
  }

  parserScript(html: string) {
    const reg = /<script(?:\s+[^>]*)?>(.*?)<\/script\s*>/gi
    return html.match(reg) as string[]
  }

  on(key: 'no-update' | 'update', fn: Function) {
    (this.dispatch[key] || (this.dispatch[key] = [])).push(fn)
    return this
  }

  compare(oldArr: string[], newArr: string[]) {
    const base = oldArr.length
    const arr = Array.from(new Set(oldArr.concat(newArr)))

    if (arr.length === base) {
      this.dispatch['no-update']
        && this.dispatch['no-update'].forEach((fn) => {
          fn()
        })
    }
    else {
      this.dispatch.update
        && this.dispatch.update.forEach((fn) => {
          fn()
        })
    }
  }

  timing(time = 10000) {
    setInterval(async () => {
      const newHtml = await this.getHtml()
      this.newScript = this.parserScript(newHtml)
      this.compare(this.oldScript, this.newScript)
    }, time)
  }
}

export interface Fn<T = any> {
  (...arg: T[]): T
}
export function useUpdater(timer = 10000, path?: useUpdaterOptions['path']): Fn[] {
  const updaterInstance = Updater.getInstance({ timer, path })
  const handleNoUpdate = (cb: Fn) => {
    updaterInstance.on('no-update', cb)
  }
  const handleUpdate = (cb: Fn) => {
    updaterInstance.on('update', cb)
  }
  return [handleNoUpdate, handleUpdate]
}
