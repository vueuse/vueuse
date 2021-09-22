import { getHighlighter } from 'shiki'

const htmlEscapes: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;',
}

function escapeHtml(html: string) {
  return html.replace(/[&<>"']/g, chr => htmlEscapes[chr])
}

export default async() => {
  const highlighter = await getHighlighter({
    themes: [
      'vitesse-dark',
      'vitesse-light',
    ],
  })

  return (code: string, lang: string) => {
    if (!lang || lang === 'text')
      return `<pre v-pre><code>${escapeHtml(code)}</code></pre>`

    const dark = highlighter
      .codeToHtml(code, lang, 'vitesse-dark')
      .replace('<pre class="shiki"', '<pre v-pre class="shiki shiki-dark"')
    const light = highlighter
      .codeToHtml(code, lang, 'vitesse-light')
      .replace('<pre class="shiki"', '<pre v-pre class="shiki shiki-light"')
    return dark + light
  }
}
