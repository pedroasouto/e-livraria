"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Book } from "@/types/book"
import { useCart } from "@/hooks/use-cart"

interface BookCardProps {
  book: Book
  discount?: number
}

export function BookCard({ book, discount }: BookCardProps) {
  const { addToCart } = useCart()

  const formattedPrice = book.preco.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  const discountedPrice = discount ? book.preco * (1 - discount / 100) : null
  const formattedDiscountedPrice = discountedPrice?.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  const handleAddToCart = () => {
    addToCart(book)
  }

  return (
    <Card className="overflow-hidden">
      <Link href={`/livros/${book.id}`}>
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={book.imageUrl || "/placeholder.svg"}
            alt={book.titulo}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
          {discount && <Badge className="absolute top-2 right-2 bg-primary">{discount}% OFF</Badge>}
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="space-y-1">
          <Link href={`/livros/${book.id}`} className="block">
            <h3 className="font-medium line-clamp-2 hover:underline">{book.titulo}</h3>
          </Link>
          <p className="text-sm text-muted-foreground">{book.autor}</p>
          <div className="flex items-center gap-2">
            {discount ? (
              <>
                <span className="font-bold">{formattedDiscountedPrice}</span>
                <span className="text-sm text-muted-foreground line-through">{formattedPrice}</span>
              </>
            ) : (
              <span className="font-bold">{formattedPrice}</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{book.genero}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" size="sm" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  )
}

