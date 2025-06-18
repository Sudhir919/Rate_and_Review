"use client"

import { useEffect, useState, useCallback } from "react"
import { ProductCard } from "@/components/product-card"
import { SearchFilters } from "@/components/search-filters"
import { UserAuth } from "@/components/user-auth"
import type { ProductWithStats } from "@/lib/db"
import { useSession } from "@/lib/session"

export default function HomePage() {
  const { session, loading: sessionLoading } = useSession()
  const [products, setProducts] = useState<ProductWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    query: "",
    category: "all",
    minRating: "",
    sortBy: "name",
  })

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.query) params.append("q", filters.query)
      if (filters.category !== "all") params.append("category", filters.category)
      if (filters.minRating) params.append("minRating", filters.minRating)
      if (filters.sortBy) params.append("sortBy", filters.sortBy)

      const response = await fetch(`/api/search?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  if (sessionLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Product Reviews & Ratings</h1>
        <p className="text-xl text-muted-foreground mb-6">Discover great products and share your experiences</p>

        {!session && (
          <div className="max-w-md mx-auto mb-8">
            <UserAuth />
          </div>
        )}
      </div>

      <div className="mb-8">
        <SearchFilters onFiltersChange={setFilters} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria or browse all products.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
