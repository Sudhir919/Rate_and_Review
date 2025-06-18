import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import type { ProductWithStats } from "@/lib/db"
import Link from "next/link"

interface ProductCardProps {
  product: ProductWithStats
}

export function ProductCard({ product }: ProductCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
              ? "fill-yellow-200 text-yellow-200"
              : "text-gray-300"
        }`}
      />
    ))
  }

  // Convert average_rating to number and handle potential null/undefined values
  const averageRating = Number(product.average_rating) || 0
  const totalReviews = Number(product.total_reviews) || 0

  // Get product-specific placeholder based on category
  const getPlaceholderImage = (category: string) => {
    const placeholders = {
      Electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center",
      Clothing: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center",
      Lifestyle: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop&crop=center",
      Fitness: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&crop=center",
      Kitchen: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&crop=center",
      Footwear: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center",
    }
    return (
      placeholders[category as keyof typeof placeholders] ||
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center"
    )
  }

  const imageUrl = product.image_url || getPlaceholderImage(product.category)

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="aspect-square relative mb-4 bg-gray-50 rounded-md overflow-hidden group">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = getPlaceholderImage(product.category)
            }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
        </div>
        <CardTitle className="line-clamp-2 text-lg">{product.name}</CardTitle>
        <Badge variant="secondary" className="w-fit">
          {product.category}
        </Badge>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{product.description}</p>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">{renderStars(averageRating)}</div>
          <span className="text-sm font-medium">{averageRating > 0 ? averageRating.toFixed(1) : "No ratings"}</span>
          <span className="text-sm text-muted-foreground">
            ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
          </span>
        </div>

        <p className="text-2xl font-bold text-primary">${Number(product.price).toFixed(2)}</p>
      </CardContent>

      <CardFooter>
        <Link
          href={`/products/${product.id}`}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-center font-medium transition-colors inline-flex items-center justify-center"
        >
          View Details & Reviews
        </Link>
      </CardFooter>
    </Card>
  )
}
