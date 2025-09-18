interface HtmlRendererProps {
  html: string
  className?: string
}

export function HtmlRenderer({ html, className = "" }: HtmlRendererProps) {
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
  )
}
