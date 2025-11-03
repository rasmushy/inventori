export function parsePrice(input: string): number | undefined {
  const cleaned = input.replace(/[,\s]/g, '')
  if (cleaned === '') return undefined
  const value = Number(cleaned)
  if (Number.isNaN(value)) return undefined
  return Math.round(value * 100)
}

export function formatPrice(cents: number | undefined, currency = '€'): string {
  if (cents === undefined) return ''
  return `${currency}${(cents / 100).toFixed(2)}`
}

export function parseTags(input: string): string[] | undefined {
  const parts = input
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
  return parts.length ? parts : []
}

export function formatTags(tags: string[] | undefined): string {
  return (tags ?? []).join(', ')
}

export function extractYear(dateString: string | undefined): string | undefined {
  if (!dateString) return undefined
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return undefined
  return String(d.getUTCFullYear())
}


