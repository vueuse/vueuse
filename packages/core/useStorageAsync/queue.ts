export class TaskQueue {
  private readonly queue: ((() => Promise<void>) | null)[]
  private readonly emptyCallback: () => void

  constructor(callback?: () => void) {
    this.queue = [null, null]
    this.emptyCallback = callback ?? (() => {})
  }

  enqueue(task: () => Promise<void>) {
    this.queue[1] = task
    this.executeNext()
  }

  private executeNext(): void {
    if (this.queue[0] === null) {
      this.queue[0] = this.queue[1]
      this.queue[1] = null
    }
    else {
      return
    }
    if (this.queue[0] === null) {
      return this.emptyCallback()
    }

    this.queue[0]().finally(() => {
      this.queue[0] = null
      this.executeNext()
    })
  }
}
