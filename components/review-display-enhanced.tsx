"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, User, Edit, Trash2, ThumbsUp, Flag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "@/lib/session"
import type { Review } from "@/lib/db"

interface ReviewDisplayEnhancedProps {
  reviews: Review[]
  onReviewUpdate: () => void
  onEditReview?: (review: Review) => void
}

export function ReviewDisplayEnhanced({ reviews, onReviewUpdate, onEditReview }: ReviewDisplayEnhancedProps) {
  const { session } = useSession()
  const [deletingReview, setDeletingReview] = useState<number | null>(null)
  const { toast } = useToast()

  const renderStars = (rating: number | null) => {
    if (!rating) return null

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
        ))}
        <span className="ml-1 text-sm font-medium">{rating}/5</span>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleDeleteReview = async (reviewId: number) => {
    if (!session) return

    setDeletingReview(reviewId)

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete review")
      }

      toast({
        title: "Success",
        description: "Your review has been deleted successfully.",
      })

      onReviewUpdate()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeletingReview(null)
    }
  }

  const canEditReview = (review: Review) => {
    return session && session.id === review.user_id
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
            <p className="text-muted-foreground">
              Be the first to review this product and help others make informed decisions!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Card key={review.id} className="relative">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{review.user_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(review.created_at)}
                    {review.updated_at !== review.created_at && <span className="ml-2 text-xs">(edited)</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {review.rating && renderStars(review.rating)}

                {canEditReview(review) && (
                  <div className="flex items-center gap-1 ml-4">
                    <Button variant="ghost" size="sm" onClick={() => onEditReview?.(review)} className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteReview(review.id)}
                      disabled={deletingReview === review.id}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      {deletingReview === review.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-destructive"></div>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {review.review_text && <p className="text-gray-700 mb-4 leading-relaxed">{review.review_text}</p>}

            {review.tags && review.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {review.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {review.photos && review.photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {review.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`Review photo ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => {
                        const modal = document.createElement("div")
                        modal.className =
                          "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                        modal.innerHTML = `
                          <div class="relative max-w-4xl max-h-full">
                            <img src="${photo}" alt="Review photo" class="max-w-full max-h-full object-contain rounded-lg" />
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
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Helpful
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Flag className="h-4 w-4 mr-1" />
                  Report
                </Button>
              </div>

              {review.rating && (
                <div className="text-sm text-muted-foreground">Rated {review.rating} out of 5 stars</div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
