"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2, Heart, ZoomIn } from "lucide-react"
import Link from "next/link"
import { ReviewFormEnhanced } from "@/components/review-form-enhanced"
import { ReviewDisplayEnhanced } from "@/components/review-display-enhanced"
import { RatingSummary } from "@/components/rating-summary"
import { UserAuth } from "@/components/user-auth"
import { useSession } from "@/lib/session"
import { useToast } from "@/hooks/use-toast"
import type { Product, Review } from "@/lib/db"

export default function ProductPage() {
  const params = useParams()
  const productId = Number.parseInt(params.id as string)
  const { session } = useSession()
  const { toast } = useToast()

  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [averageRating, setAverageRating] = useState(0)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [userReview, setUserReview] = useState<Review | null>(null)

  const fetchProductData = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data.product)
        setReviews(data.reviews)
        // Ensure averageRating is properly converted to number
        setAverageRating(Number(data.product.average_rating) || 0)

        // Find user's existing review
        if (session) {
          const existingReview = data.reviews.find((r: Review) => r.user_id === session.id)
          setUserReview(existingReview || null)
        }
      }
    } catch (error) {
      console.error("Error fetching product data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (productId) {
      fetchProductData()
    }
  }, [productId, session])

  const handleReviewSubmitted = () => {
    fetchProductData()
    setEditingReview(null)
  }

  const handleEditReview = (review: Review) => {
    setEditingReview(review)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: `Check out this product: ${product?.name}`,
          url: window.location.href,
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link copied!",
          description: "Product link has been copied to your clipboard.",
        })
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied!",
        description: "Product link has been copied to your clipboard.",
      })
    }
  }

  // Get product-specific placeholder based on category
  const getPlaceholderImage = (category: string) => {
    const placeholders = {
      Electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=600&fit=crop&crop=center",
      Clothing: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&crop=center",
      Lifestyle: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop&crop=center",
      Fitness: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop&crop=center",
      Kitchen: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop&crop=center",
      Footwear: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&crop=center",
    }
    return (
      placeholders[category as keyof typeof placeholders] ||
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop&crop=center"
    )
  }

  const handleImageClick = (imageUrl: string) => {
    const modal = document.createElement("div")
    modal.className = "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 cursor-pointer"
    modal.innerHTML = `
      <div class="relative max-w-4xl max-h-full">
        <img src="${imageUrl}" alt="Product image" class="max-w-full max-h-full object-contain rounded-lg" />
        <button class="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `
    modal.onclick = (e) => {
      if (e.target === modal || e.target === modal.querySelector("button")) {
        document.body.removeChild(modal)
      }
    }
    document.body.appendChild(modal)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-32"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-200 aspect-square rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-6 bg-gray-200 rounded w-32"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">Product not found</h3>
          <p className="text-muted-foreground mb-4">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  const imageUrl = product.image_url || getPlaceholderImage(product.category)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Heart className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="aspect-square mb-6 bg-gray-50 rounded-lg overflow-hidden relative group cursor-pointer">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = getPlaceholderImage(product.category)
                }}
                onClick={() => handleImageClick(imageUrl)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{product.name}</CardTitle>
                <Badge variant="secondary" className="mb-4">
                  {product.category}
                </Badge>
              </div>
              <div className="text-3xl font-bold text-primary">${Number(product.price).toFixed(2)}</div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Availability:</span>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  In Stock
                </Badge>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">SKU:</span>
                <span className="text-sm text-muted-foreground">PRD-{product.id.toString().padStart(4, "0")}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {reviews.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <RatingSummary reviews={reviews} averageRating={averageRating} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-6">{userReview ? "Your Review" : "Write a Review"}</h2>

          {session ? (
            <ReviewFormEnhanced
              productId={productId}
              onReviewSubmitted={handleReviewSubmitted}
              existingReview={editingReview || userReview}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Sign in to write a review</CardTitle>
              </CardHeader>
              <CardContent>
                <UserAuth />
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Reviews ({reviews.length})</h2>
          <ReviewDisplayEnhanced
            reviews={reviews}
            onReviewUpdate={handleReviewSubmitted}
            onEditReview={handleEditReview}
          />
        </div>
      </div>
    </div>
  )
}
