// Rewrites `../{name}/index.md` links to point at the flattened `{name}.md` reference file.
export function rewriteFunctionLinks(md: string, prefix: string) {
  return md.replace(/\]\(\.\.\/([^/)]+)\/index\.md(#[^)]*)?\)/g, `](${prefix}$1.md$2)`)
}
