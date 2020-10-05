import 'vue-tsx-support/enable-check'
import { RenderContext } from 'vue'
import { ofType } from 'vue-tsx-support'
import { defineComponent } from 'vue-demi'

export interface DocsProps {
  md: any
  class?: string
}

const ShowDocsFunc = ({ props }: RenderContext<DocsProps>) => {
  return (
    // @ts-ignore
    <div class={`markdown-body ${props.class || ''}`} domPropsInnerHTML={props.md.default} />
  )
}

export const ShowDocs: any = ofType<DocsProps>().convert(ShowDocsFunc as any)

export const redirect = (url: string) => defineComponent({
  setup() {
    window.open(url, '_blank')
    history.back()
  },
}) as any
