import {
  bundledLanguages,
  createHighlighter,
  type BundledLanguage,
  type Highlighter,
} from 'shiki'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

let shiki: Highlighter | null = null

export async function highlight({
  code,
  lang,
}: {
  code: string
  lang: string
}) {
  if (!(lang in bundledLanguages)) return null
  if (!shiki) {
    const newShiki = await createHighlighter({
      langs: [lang],
      themes: ['min-dark', 'min-light'],
      engine: createJavaScriptRegexEngine({ forgiving: true }),
    })
    if (!shiki) shiki = newShiki
  }
  if (!shiki.getLoadedLanguages().includes(lang)) {
    await shiki.loadLanguage(lang as BundledLanguage)
  }
  return shiki.codeToTokens(code, {
    lang: lang as BundledLanguage,
    themes: { light: 'min-light', dark: 'min-dark' },
  })
}
