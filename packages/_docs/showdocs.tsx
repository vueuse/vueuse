import 'vue-tsx-support/enable-check'
import { RenderContext } from 'vue'
import { ofType } from 'vue-tsx-support'
import { createComponent } from '../api'

export interface DocsProps {
  md: any
}

const ShowDocsFunc = ({ props }: RenderContext<DocsProps>) => {
  return (
    // @ts-ignore
    <div class="markdown-body" domPropsInnerHTML={props.md.default} />
  )
}

export const ShowDocs: any = ofType<DocsProps>().convert(ShowDocsFunc as any)

export const redirect = (url: string) => createComponent({
  setup() {
    window.open(url, '_blank')
    history.back()
  },
}) as any
