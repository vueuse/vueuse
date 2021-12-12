import { reactive, toRefs } from 'vue-demi'

function objectFromStringKeyArray <T, K extends string = string>(keys: K[], defaultValue?: T) {
  const defaultObject: { [key in K]: T } = Object.create(null)
  return keys.reduce((r, key) => ({ ...r, [key]: defaultValue }), defaultObject)
}

export function useTemplateRefsWrap <ElementType extends HTMLElement | SVGElement | null>() {
  return function useTemplateRefs <RefNames extends string = string>(refNames: RefNames[]) {
    return toRefs(reactive<{ [key in RefNames]: ElementType | undefined }>(objectFromStringKeyArray(refNames)))
  }
}

export const useHtmlElementTemplateRefs = useTemplateRefsWrap<HTMLElement>()
export const useSvgElementTemplateRefs = useTemplateRefsWrap<SVGElement>()
