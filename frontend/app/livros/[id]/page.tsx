"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Heart, Minus, Plus, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookCard } from "@/components/book-card"
import type { Book } from "@/types/book"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/components/ui/use-toast"

export default function BookPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [book, setBook] = useState<Book | null>(null)
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBookDetails()
  }, [params.id])

  const fetchBookDetails = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:8080/v1/library/books/${params.id}`)

      if (response.ok) {
        const data = await response.json()

        const bookWithImage = {
          ...data,
          imageUrl: `/placeholder.svg?height=600&width=400`,
        }

        setBook(bookWithImage)

        if (bookWithImage.genero) {
          fetchRelatedBooks(bookWithImage.genero)
        }
      } else {
        toast({
          title: "Erro ao buscar detalhes do livro",
          description: "Não foi possível carregar os detalhes do livro. Tente novamente mais tarde.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes do livro:", error)
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRelatedBooks = async (genre: string) => {
    try {
      const response = await fetch(`http://localhost:8080/v1/library/books/genre?genero=${genre}`)

      if (response.ok) {
        const data = await response.json()

        const booksWithImages = data
          .filter((relatedBook: Book) => relatedBook.id !== Number(params.id)) 
          .slice(0, 4) 
          .map((book: Book) => ({
            ...book,
            imageUrl: `/placeholder.svg?height=300&width=200`,
          }))

        setRelatedBooks(booksWithImages)
      }
    } catch (error) {
      console.error("Erro ao buscar livros relacionados:", error)
    }
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  const handleAddToCart = () => {
    if (book) {
      const bookWithQuantity = {
        ...book,
        quantity,
      }

      addToCart(bookWithQuantity)

      toast({
        title: "Livro adicionado ao carrinho",
        description: `${book.titulo} foi adicionado ao seu carrinho.`,
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container py-12 text-center">
        <p>Carregando detalhes do livro...</p>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Livro não encontrado</h2>
        <p className="mb-6">O livro que você está procurando não foi encontrado.</p>
        <Link href="/">
          <Button>Voltar para a loja</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Voltar para a loja
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <div className="aspect-[2/3] relative overflow-hidden rounded-lg border">
            <Image src={book.imageUrl || "/placeholder.svg"} alt={book.titulo} fill className="object-cover" />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-primary">{book.genero}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{book.autor}</span>
            </div>
            <h1 className="text-3xl font-bold">{book.titulo}</h1>
          </div>

          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">
                {book.preco.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
              <span className="text-sm text-muted-foreground">
                ou em até 10x de{" "}
                {(book.preco / 10).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={incrementQuantity}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 flex gap-2">
                <Button className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Adicionar ao carrinho
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">Adicionar aos favoritos</span>
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <Tabs defaultValue="descricao">
            <TabsList>
              <TabsTrigger value="descricao">Descrição</TabsTrigger>
              <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
            </TabsList>
            <TabsContent value="descricao" className="text-sm leading-relaxed">
              <p>
                {book.titulo} é um livro escrito por {book.autor} e publicado pela editora {book.editora}. Este livro
                pertence ao gênero {book.genero} e foi publicado no ano {book.ano}.
              </p>
            </TabsContent>
            <TabsContent value="detalhes">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="font-medium">Editora</p>
                  <p className="text-muted-foreground">{book.editora}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Ano de Publicação</p>
                  <p className="text-muted-foreground">{book.ano}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Gênero</p>
                  <p className="text-muted-foreground">{book.genero}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Páginas</p>
                  <p className="text-muted-foreground">{book.paginas}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">ID</p>
                  <p className="text-muted-foreground">{book.id}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {relatedBooks.length > 0 && (
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-semibold">Livros relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

