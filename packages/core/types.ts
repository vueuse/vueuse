export * from './_configurable'

// common types

export interface Position {
  x: number
  y: number
}

export interface RenderableComponent {
  /**
   * The element that the component should be rendered as
   *
   * @default 'div'
   */
  as?: Object | string
}

export type PointerType = 'mouse' | 'touch' | 'pen'
