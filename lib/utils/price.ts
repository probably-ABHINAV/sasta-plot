export type PriceFormat = 'lakh' | 'crore' | 'thousand' | 'raw'

export function formatPrice(price: number, format: PriceFormat = 'raw'): string {
  switch (format) {
    case 'lakh':
      return `₹${(price / 100000).toFixed(2)}L`
    case 'crore':
      return `₹${(price / 10000000).toFixed(2)}Cr`
    case 'thousand':
      return `₹${(price / 1000).toFixed(0)}K`
    case 'raw':
    default:
      return `₹${price.toLocaleString()}`
  }
}

export function calculatePriceFromFormatted(value: string, format: PriceFormat): number {
  const numericValue = parseFloat(value)
  if (isNaN(numericValue)) return 0
  
  switch (format) {
    case 'lakh':
      return numericValue * 100000
    case 'crore':
      return numericValue * 10000000
    case 'thousand':
      return numericValue * 1000
    case 'raw':
    default:
      return numericValue
  }
}

export function getPriceFormatSuggestion(price: number): PriceFormat {
  if (price >= 10000000) return 'crore'
  if (price >= 100000) return 'lakh'
  if (price >= 1000) return 'thousand'
  return 'raw'
}