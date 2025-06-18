import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const reviewId = Number.parseInt(params.id)
    const body = await request.json()
    const { rating, reviewText, photos } = body

    // Validation
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Extract tags from updated review text
    const { extractTagsFromText } = await import("@/lib/review-utils")
    const tags = reviewText ? extractTagsFromText(reviewText) : []

    const [updatedReview] = await sql`
      UPDATE reviews 
      SET 
        rating = ${rating || null},
        review_text = ${reviewText || null},
        photos = ${photos || null},
        tags = ${tags},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${reviewId}
      RETURNING *
    `

    if (!updatedReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    return NextResponse.json(updatedReview)
  } catch (error) {
    console.error("Error updating review:", error)
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const reviewId = Number.parseInt(params.id)

    const [deletedReview] = await sql`
      DELETE FROM reviews 
      WHERE id = ${reviewId}
      RETURNING *
    `

    if (!deletedReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Review deleted successfully" })
  } catch (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
  }
}
