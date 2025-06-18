import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { extractTagsFromText } from "@/lib/review-utils"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, productId, rating, reviewText, photos } = body

    // Validation
    if (!userId || !productId) {
      return NextResponse.json({ error: "User ID and Product ID are required" }, { status: 400 })
    }

    if (!rating && !reviewText) {
      return NextResponse.json({ error: "Either rating or review text is required" }, { status: 400 })
    }

    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Check if user already reviewed this product
    const existingReview = await sql`
      SELECT id FROM reviews 
      WHERE user_id = ${userId} AND product_id = ${productId}
    `

    if (existingReview.length > 0) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 409 })
    }

    // Extract tags from review text
    const tags = reviewText ? extractTagsFromText(reviewText) : []

    // Insert review
    const [review] = await sql`
      INSERT INTO reviews (user_id, product_id, rating, review_text, photos, tags)
      VALUES (${userId}, ${productId}, ${rating || null}, ${reviewText || null}, ${photos || null}, ${tags})
      RETURNING *
    `

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")

    let query
    if (productId) {
      query = sql`
        SELECT 
          r.*,
          u.name as user_name,
          u.email as user_email
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.product_id = ${Number.parseInt(productId)}
        ORDER BY r.created_at DESC
      `
    } else {
      query = sql`
        SELECT 
          r.*,
          u.name as user_name,
          u.email as user_email,
          p.name as product_name
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        JOIN products p ON r.product_id = p.id
        ORDER BY r.created_at DESC
      `
    }

    const reviews = await query
    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}
