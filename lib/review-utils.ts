// Utility functions for review processing

export interface Review {
  rating: number
  tags: string[]
}

export function extractTagsFromText(text: string): string[] {
  if (!text) return []

  // Common positive and negative keywords for product reviews
  const positiveKeywords = [
    "excellent",
    "amazing",
    "great",
    "good",
    "perfect",
    "love",
    "best",
    "comfortable",
    "quality",
    "recommend",
    "fantastic",
    "awesome",
    "beautiful",
    "durable",
    "reliable",
    "fast",
    "easy",
    "convenient",
    "value",
    "worth",
  ]

  const negativeKeywords = [
    "terrible",
    "awful",
    "bad",
    "poor",
    "worst",
    "hate",
    "disappointing",
    "uncomfortable",
    "cheap",
    "flimsy",
    "slow",
    "difficult",
    "expensive",
    "broken",
    "defective",
    "useless",
    "waste",
  ]

  const featureKeywords = [
    "battery",
    "sound",
    "design",
    "price",
    "shipping",
    "packaging",
    "size",
    "color",
    "material",
    "weight",
    "durability",
    "performance",
    "fit",
  ]

  const allKeywords = [...positiveKeywords, ...negativeKeywords, ...featureKeywords]
  const words = text.toLowerCase().split(/\s+/)
  const foundTags: string[] = []

  // Find exact matches
  words.forEach((word) => {
    const cleanWord = word.replace(/[^\w]/g, "")
    if (allKeywords.includes(cleanWord) && !foundTags.includes(cleanWord)) {
      foundTags.push(cleanWord)
    }
  })

  // Find phrases (2-3 words)
  for (let i = 0; i < words.length - 1; i++) {
    const phrase2 = `${words[i]} ${words[i + 1]}`.replace(/[^\w\s]/g, "")
    const phrase3 = i < words.length - 2 ? `${words[i]} ${words[i + 1]} ${words[i + 2]}`.replace(/[^\w\s]/g, "") : ""

    // Common phrases in reviews
    const commonPhrases = [
      "battery life",
      "sound quality",
      "build quality",
      "value for money",
      "easy to use",
      "great product",
      "highly recommend",
      "perfect fit",
      "fast shipping",
      "good quality",
      "worth buying",
      "love it",
    ]

    if (commonPhrases.includes(phrase2) && !foundTags.includes(phrase2)) {
      foundTags.push(phrase2)
    }
    if (phrase3 && commonPhrases.includes(phrase3) && !foundTags.includes(phrase3)) {
      foundTags.push(phrase3)
    }
  }

  return foundTags.slice(0, 5) // Limit to 5 tags
}

export function calculateRatingDistribution(reviews: Review[]): { [key: number]: number } {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

  reviews.forEach((review) => {
    if (review.rating) {
      distribution[review.rating]++
    }
  })

  return distribution
}

export function getMostUsedTags(reviews: Review[]): Array<{ tag: string; count: number }> {
  const tagCounts: { [key: string]: number } = {}

  reviews.forEach((review) => {
    if (review.tags) {
      review.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    }
  })

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}
