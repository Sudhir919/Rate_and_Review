"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star, X, Camera } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "@/lib/session"
import { UserAuth } from "./user-auth"
import { uploadImage, validateImageFile } from "@/lib/image-upload"

interface ReviewFormEnhancedProps {
  productId: number
  onReviewSubmitted: () => void
  existingReview?: any
}

export function ReviewFormEnhanced({ productId, onReviewSubmitted, existingReview }: ReviewFormEnhancedProps) {
  const { session } = useSession()
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState(existingReview?.review_text || "")
  const [photos, setPhotos] = useState<string[]>(existingReview?.photos || [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const { toast } = useToast()

  const handleStarClick = (starRating: number) => {
    setRating(starRating)
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setUploadingPhotos(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const validationError = validateImageFile(file)
        if (validationError) {
          throw new Error(validationError)
        }
        return uploadImage(file)
      })

      const uploadedPhotos = await Promise.all(uploadPromises)
      setPhotos((prev) => [...prev, ...uploadedPhotos])

      toast({
        title: "Success",
        description: `${uploadedPhotos.length} photo(s) uploaded successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload photos",
        variant: "destructive",
      })
    } finally {
      setUploadingPhotos(false)
    }
  }

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      toast({
        title: "Error",
        description: "Please sign in to submit a review.",
        variant: "destructive",
      })
      return
    }

    if (!rating && !reviewText.trim()) {
      toast({
        title: "Error",
        description: "Please provide either a rating or a review.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const url = existingReview ? `/api/reviews/${existingReview.id}` : "/api/reviews"
      const method = existingReview ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.id,
          productId,
          rating: rating || null,
          reviewText: reviewText.trim() || null,
          photos: photos.length > 0 ? photos : null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to submit review")
      }

      toast({
        title: "Success",
        description: existingReview
          ? "Your review has been updated successfully!"
          : "Your review has been submitted successfully!",
      })

      if (!existingReview) {
        setRating(0)
        setReviewText("")
        setPhotos([])
      }

      onReviewSubmitted()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit review",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sign in to write a review</CardTitle>
        </CardHeader>
        <CardContent>
          <UserAuth />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{existingReview ? "Edit Your Review" : "Write a Review"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`h-8 w-8 cursor-pointer transition-colors ${
                    i < (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 hover:text-yellow-200"
                  }`}
                  onClick={() => handleStarClick(i + 1)}
                  onMouseEnter={() => setHoverRating(i + 1)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
              {rating > 0 && <span className="ml-2 text-sm text-muted-foreground">{rating} out of 5 stars</span>}
            </div>
          </div>

          <div>
            <label htmlFor="reviewText" className="block text-sm font-medium mb-2">
              Review
            </label>
            <Textarea
              id="reviewText"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">{reviewText.length}/1000 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Photos (Optional)</label>
            <div className="space-y-4">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                  disabled={uploadingPhotos}
                />
                <label
                  htmlFor="photo-upload"
                  className={`flex items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    uploadingPhotos
                      ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {uploadingPhotos ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                      <span>Uploading photos...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="h-5 w-5" />
                      <span>Click to upload photos (max 5MB each)</span>
                    </>
                  )}
                </label>
              </div>

              {photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`Review photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting || uploadingPhotos} className="w-full">
            {isSubmitting ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
