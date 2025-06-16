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

      import("@/lib/shiki-highlight").then(async ({ highlight }) => {
        if (cancelled) return
        const result = await highlight({ code: children, lang: language })
        if (cancelled) return
        setTokens(result?.tokens || null)
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
