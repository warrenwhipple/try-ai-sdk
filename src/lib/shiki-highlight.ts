import {
  bundledLanguages,
  createHighlighter,
  type BundledLanguage,
  type Highlighter,
} from 'shiki'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

let highlighterP: Promise<Highlighter> | null = null

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterP) {
    highlighterP = createHighlighter({
      langs: [],
      themes: ['min-dark', 'min-light'],
      engine: createJavaScriptRegexEngine({ forgiving: true }),
    }).catch((err) => {
      highlighterP = null // let the next call retry
      throw err
    })
  }
  return highlighterP
}

const loadingLangP = new Map<string, Promise<void>>()

function isBundledLanguage(l: string): l is BundledLanguage {
  return l.toLowerCase() in bundledLanguages
}

/**
 * Syntax-highlight via a lazy-loaded **Shiki** singleton.
 * Dynamically import this helper (`await import()` or `React.lazy`) so the
 * heavyweight Shiki bundle is fetched only when highlighting is first needed.
 *
 * - Accepts canonical language IDs **and built-in aliases** (`js`, `ts`, …).
 * - Promise returns:
 *   - `null` when the language is not recognized.
 *   - `{ tokens, theme }` when the language is recognized.
 *
 * @example
 * ```tsx
 * const { highlight } = await import('@/lib/shiki-highlight')
 * const tokens = await highlight({ code, lang: 'ts' })
 * ```
 */
export async function highlight({
  code,
  lang,
}: {
  code: string
  lang: string
}) {
  const id = lang.toLowerCase()
  if (!isBundledLanguage(id)) return null

  const hi = await getHighlighter()

  if (!hi.getLoadedLanguages().includes(id)) {
    let lp = loadingLangP.get(id)
    if (!lp) {
      lp = hi.loadLanguage(id)
      loadingLangP.set(id, lp)
    }
    await lp
  }

  return hi.codeToTokens(code, {
    lang: id,
    themes: { light: 'min-light', dark: 'min-dark' },
  })
}
