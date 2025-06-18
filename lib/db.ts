import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

export const sql = neon(process.env.DATABASE_URL)

export interface User {
  id: number
  email: string
  name: string
  created_at: string
}

export interface Product {
  id: number
  name: string
  description: string
  image_url: string
  price: number
  category: string
  created_at: string
}

export interface Review {
  id: number
  user_id: number
  product_id: number
  rating: number | null
  review_text: string | null
  photos: string[] | null
  tags: string[] | null
  created_at: string
  updated_at: string
  user_name?: string
  user_email?: string
}

export interface ProductWithStats extends Product {
  average_rating: number
  total_reviews: number
  rating_distribution: { [key: number]: number }
}

export interface ReviewWithUser extends Review {
  user_name: string
  user_email: string
  product_name?: string
}

export interface ReviewStats {
  total_reviews: number
  average_rating: number
  rating_distribution: { [key: number]: number }
  most_used_tags: Array<{ tag: string; count: number }>
}

export interface UserSession {
  id: number
  email: string
  name: string
}
