import {
  bundledLanguages,
  createHighlighter,
  type BundledLanguage,
  type Highlighter,
} from 'shiki'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

let shikiPromise: Promise<Highlighter> | null = null

function isBundledLanguage(lang: string): lang is BundledLanguage {
  return lang in bundledLanguages
}

export async function highlight({
  code,
  lang,
}: {
  code: string
  lang: string
}) {
  if (!isBundledLanguage(lang)) return null
  if (!shikiPromise) {
    shikiPromise = createHighlighter({
      langs: [lang],
      themes: ['min-dark', 'min-light'],
      engine: createJavaScriptRegexEngine({ forgiving: true }),
    })
  }
  const shiki = await shikiPromise
  if (!shiki.getLoadedLanguages().includes(lang)) {
    await shiki.loadLanguage(lang)
  }
  return shiki.codeToTokens(code, {
    lang,
    themes: { light: 'min-light', dark: 'min-dark' },
  })
}
