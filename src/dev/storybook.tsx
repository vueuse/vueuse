import 'vue-tsx-support/enable-check'
import { RenderContext } from 'vue'
import { ofType, TsxComponent } from 'vue-tsx-support'

export interface DocsProps {
  md: any
}

const ShowDocsFunc = ({ props }: RenderContext<DocsProps>) => {
  return (
    // @ts-ignore
    <div class="markdown-body" domPropsInnerHTML={props.md.default} />
  )
}

export const ShowDocs: TsxComponent<Vue, DocsProps, DocsProps, DocsProps, any> = ofType<DocsProps>().convert(ShowDocsFunc as any)
