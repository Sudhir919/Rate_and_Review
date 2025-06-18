import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const productId = Number.parseInt(params.id)

    // Get product details
    const [product] = await sql`
      SELECT 
        p.*,
        COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0)::float as average_rating,
        COUNT(r.id)::int as total_reviews
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
      WHERE p.id = ${productId}
      GROUP BY p.id
    `

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Get reviews for this product
    const reviews = await sql`
      SELECT 
        r.*,
        u.name as user_name,
        u.email as user_email
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ${productId}
      ORDER BY r.created_at DESC
    `

    return NextResponse.json({
      product,
      reviews,
    })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}
