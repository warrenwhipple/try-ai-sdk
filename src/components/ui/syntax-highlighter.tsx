"use client"

import React, { useEffect, useState } from "react"
import type { ThemedToken } from "shiki"

interface SyntaxHighlighterProps extends React.HTMLAttributes<HTMLPreElement> {
  children: string
  language: string
}

export const SyntaxHighlighter = React.memo(
  ({ children, language, ...props }: SyntaxHighlighterProps) => {
    const [tokens, setTokens] = useState<ThemedToken[][] | null>(null)

    useEffect(() => {
      let cancelled = false

      import("shiki").then(async ({ codeToTokens, bundledLanguages }) => {
        if (cancelled) return
        if (!(language in bundledLanguages)) return
        const result = await codeToTokens(children, {
          lang: language as keyof typeof bundledLanguages,
          defaultColor: false,
          themes: { light: "github-light", dark: "github-dark" },
        })
        if (cancelled) return
        setTokens(result.tokens)
      })

      return () => {
        cancelled = true
      }
    }, [children, language])

    if (!tokens) {
      return (
        <pre {...props}>
          <code>{children}</code>
        </pre>
      )
    }

    return (
      <pre {...props}>
        <code>
          {tokens.map((line, lineIndex) => (
            <React.Fragment key={lineIndex}>
              <span>
                {line.map((token, tokenIndex) => {
                  const style =
                    typeof token.htmlStyle === "string"
                      ? undefined
                      : token.htmlStyle

                  return (
                    <span
                      key={tokenIndex}
                      className="[color:var(--shiki-light)] [background-color:var(--shiki-light-bg)] dark:[color:var(--shiki-dark)] dark:[background-color:var(--shiki-dark-bg)]"
                      style={style}
                    >
                      {token.content}
                    </span>
                  )
                })}
              </span>
              {lineIndex !== tokens.length - 1 && "\n"}
            </React.Fragment>
          ))}
        </code>
      </pre>
    )
  }
)
SyntaxHighlighter.displayName = "SyntaxHighlighter"
