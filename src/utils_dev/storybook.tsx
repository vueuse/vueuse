import 'vue-tsx-support/enable-check'
import { RenderContext } from 'vue'
import { ofType } from 'vue-tsx-support'

export interface DocsProps {
  md: { default: string }
}

const ShowDocsFunc = ({ props }: RenderContext<DocsProps>) => (
  // @ts-ignore
  <div class="markdown-body" domPropsInnerHTML={props.md.default} />
)

export const ShowDocs = ofType<DocsProps>().convert(ShowDocsFunc as any)
