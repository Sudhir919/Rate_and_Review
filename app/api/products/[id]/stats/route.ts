import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { calculateRatingDistribution, getMostUsedTags } from "@/lib/review-utils"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const productId = Number.parseInt(params.id)

    // Get all reviews for this product
    const reviews = await sql`
      SELECT rating, tags
      FROM reviews 
      WHERE product_id = ${productId} AND rating IS NOT NULL
    `

    const ratingDistribution = calculateRatingDistribution(reviews)
    const mostUsedTags = getMostUsedTags(reviews)

    const totalReviews = reviews.length
    const averageRating =
      totalReviews > 0 ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / totalReviews : 0

    return NextResponse.json({
      total_reviews: totalReviews,
      average_rating: Number(averageRating.toFixed(1)),
      rating_distribution: ratingDistribution,
      most_used_tags: mostUsedTags,
    })
  } catch (error) {
    console.error("Error fetching product stats:", error)
    return NextResponse.json({ error: "Failed to fetch product stats" }, { status: 500 })
  }
}
