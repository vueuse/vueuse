import { h } from 'vue'
import type { FunctionalComponent, VNode } from 'vue'
import { useData, useRoute } from 'vitepress'
import type { DefaultTheme } from '../config'
import { isActive, joinUrl } from '../utils'

export interface Header {
  level: number
  title: string
  slug: string
}

interface HeaderWithChildren extends Header {
  children?: Header[]
}

export const SideBarLink: FunctionalComponent<{
  item: DefaultTheme.SideBarItem
  depth?: number
}> = (props) => {
  const route = useRoute()
  const { site, frontmatter } = useData()
  const depth = props.depth || 1
  const maxDepth = frontmatter.value.sidebarDepth || Infinity

  const headers = route.data.headers
  const text = props.item.text
  const link = resolveLink(site.value.base, props.item.link)
  const children = (props.item as DefaultTheme.SideBarGroup).children
  const active = isActive(route, props.item.link)
  const childItems
    = depth < maxDepth
      ? createChildren(active, children, headers, depth + 1)
      : null

  return h('li', { class: 'sidebar-link' }, [
    h(
      link ? 'a' : 'p',
      {
        class: { 'sidebar-link-item': true, active },
        href: link,
      },
      text,
    ),
    childItems,
  ])
}

function resolveLink(base: string, path?: string): string | undefined {
  if (path === undefined)
    return path

  // keep relative hash to the same page
  if (path.startsWith('#'))
    return path

  return joinUrl(base, path)
}

function createChildren(
  active: boolean,
  children?: DefaultTheme.SideBarItem[],
  headers?: Header[],
  depth = 1,
): VNode | null {
  if (children && children.length > 0) {
    return h(
      'ul',
      { class: 'sidebar-links' },
      children.map((c) => {
        return h(SideBarLink, { item: c, depth })
      }),
    )
  }

  return active && headers
    ? createChildren(false, resolveHeaders(headers), undefined, depth)
    : null
}

function resolveHeaders(headers: Header[]): DefaultTheme.SideBarItem[] {
  return mapHeaders(groupHeaders(headers))
}

function groupHeaders(headers: Header[]): HeaderWithChildren[] {
  headers = headers.map(h => Object.assign({}, h))
  let lastH2: HeaderWithChildren
  headers.forEach((h) => {
    if (h.level === 2)
      lastH2 = h

    else if (lastH2)
      (lastH2.children || (lastH2.children = [])).push(h)
  })
  return headers.filter(h => h.level === 2)
}

function mapHeaders(headers: HeaderWithChildren[]): DefaultTheme.SideBarItem[] {
  return headers.map(header => ({
    text: header.title,
    link: `#${header.slug}`,
    children: header.children ? mapHeaders(header.children) : undefined,
  }))
}
