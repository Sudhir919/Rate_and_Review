import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import type { Review } from "@/lib/db"
import { calculateRatingDistribution, getMostUsedTags } from "@/lib/review-utils"

interface RatingSummaryProps {
  reviews: Review[]
  averageRating: number
}

export function RatingSummary({ reviews, averageRating }: RatingSummaryProps) {
  const ratingDistribution = calculateRatingDistribution(reviews)
  const totalReviews = reviews.length
  const mostUsedTags = getMostUsedTags(reviews)

  // Ensure averageRating is a number
  const avgRating = Number(averageRating) || 0

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-6 w-6 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
              ? "fill-yellow-200 text-yellow-200"
              : "text-gray-300"
        }`}
      />
    ))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Rating Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-4xl font-bold mb-2">{avgRating > 0 ? avgRating.toFixed(1) : "N/A"}</div>
            <div className="flex items-center justify-center mb-2">{renderStars(avgRating)}</div>
            <p className="text-muted-foreground">
              Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>

          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm">{stars}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
                <Progress
                  value={totalReviews > 0 ? (ratingDistribution[stars] / totalReviews) * 100 : 0}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-8">{ratingDistribution[stars]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {mostUsedTags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Most Mentioned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mostUsedTags.map((tagData, index) => (
                <div key={index} className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-sm">
                    {tagData.tag}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {tagData.count} {tagData.count === 1 ? "mention" : "mentions"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
