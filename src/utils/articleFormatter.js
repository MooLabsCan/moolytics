// Lightweight Markdown-ish formatter for article bodies.
// Mirrors the HTML conventions already used across src/pages/*.vue:
// curly quotes, em dashes, <h2>/<h3>/<p>/<ul>, **bold** -> <strong>, *italic* -> <em>.

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Neutralize Vue mustache syntax, since this text is embedded directly
    // into a .vue <template> as literal markup.
    .replace(/\{\{/g, '&#123;&#123;')
    .replace(/\}\}/g, '&#125;&#125;')
}

function smartenPunctuation(text) {
  let out = text

  // Em dashes: " - " or " -- " (spaced hyphens) -> " — ". Hyphenated compounds
  // like "post-reform" have no surrounding spaces, so they're untouched.
  out = out.replace(/ +--? +/g, ' — ')

  // Double quotes: alternate opening/closing per occurrence (works for
  // well-formed prose where quotes appear in pairs).
  let dq = 0
  out = out.replace(/"/g, () => (dq++ % 2 === 0 ? '“' : '”'))

  // Apostrophes/single quotes: opening only when preceded by whitespace/start
  // and not followed by whitespace (i.e. it's opening a quoted phrase);
  // otherwise treat as an apostrophe (contraction/possessive) -> closing form.
  out = out.replace(/(^|\s)'(\S)/g, '$1‘$2')
  out = out.replace(/'/g, '’')

  return out
}

export function formatInline(rawText) {
  let text = escapeHtml(rawText || '')
  // Bold before italic so `**x**` isn't first read as two `*x*` matches.
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>')
  text = smartenPunctuation(text)
  return text
}

export { smartenPunctuation }

// Splits raw text into blocks (blank-line separated) and converts each block
// into HTML: `#` heading lines are dropped (title is a separate field), `##`
// / `###` become h2/h3, `-`/`*` list blocks become <ul>, `---`/`***` alone on
// a line becomes <hr />, everything else is a paragraph (soft-wrapped lines
// within a block are joined with a space).
export function formatArticleBody(raw) {
  if (!raw || !raw.trim()) return ''

  const blocks = raw.replace(/\r\n/g, '\n').trim().split(/\n\s*\n+/)
  const html = []

  for (const rawBlock of blocks) {
    const block = rawBlock.trim()
    if (!block) continue

    if (/^(---|\*\*\*)$/.test(block)) {
      html.push('<hr />')
      continue
    }
    if (/^#\s+/.test(block)) {
      // Redundant with the Title field — intentionally skipped.
      continue
    }
    if (/^###\s+/.test(block)) {
      html.push(`<h3>${formatInline(block.replace(/^###\s+/, ''))}</h3>`)
      continue
    }
    if (/^##\s+/.test(block)) {
      html.push(`<h2>${formatInline(block.replace(/^##\s+/, ''))}</h2>`)
      continue
    }

    const lines = block.split('\n').map(l => l.trim()).filter(Boolean)
    const isList = lines.length > 0 && lines.every(l => /^[-*]\s+/.test(l))
    if (isList) {
      const items = lines.map(l => `<li>${formatInline(l.replace(/^[-*]\s+/, ''))}</li>`)
      html.push(`<ul>\n  ${items.join('\n  ')}\n</ul>`)
      continue
    }

    html.push(`<p>${formatInline(lines.join(' '))}</p>`)
  }

  return html.join('\n')
}

// Plain-text version of the first paragraph, for meta descriptions — strips
// tags produced by formatInline/formatArticleBody.
export function firstParagraphText(raw) {
  const html = formatArticleBody(raw)
  const match = html.match(/<p>(.*?)<\/p>/s)
  if (!match) return ''
  return match[1].replace(/<[^>]+>/g, '')
}
