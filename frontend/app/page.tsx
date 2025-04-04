"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookCard } from "@/components/book-card"
import { CategoryFilter } from "@/components/category-filter"
import type { Book } from "@/types/book"
import { useToast } from "@/components/ui/use-toast"

export default function Home() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [books, setBooks] = useState<Book[]>([])
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Buscar todos os livros ao carregar a página
  useEffect(() => {
    fetchBooks()
  }, [])

  // Buscar livros quando o gênero é alterado
  useEffect(() => {
    if (selectedGenre) {
      fetchBooksByGenre(selectedGenre)
    } else {
      fetchBooks()
    }
  }, [selectedGenre])

  // Função para buscar todos os livros
  const fetchBooks = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:8080/v1/library")

      if (response.ok) {
        const data = await response.json()

        // Adicionar URLs de imagens fictícias para os livros
        const booksWithImages = data.map((book: Book) => ({
          ...book,
          imageUrl: `/placeholder.svg?height=300&width=200`,
        }))

        setBooks(booksWithImages)
      } else {
        toast({
          title: "Erro ao buscar livros",
          description: "Não foi possível carregar os livros. Tente novamente mais tarde.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Função para buscar livros por gênero
  const fetchBooksByGenre = async (genre: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:8080/v1/library/books/genre?genre=${genre}`)

      if (response.ok) {
        const data = await response.json()

        // Adicionar URLs de imagens fictícias para os livros
        const booksWithImages = data.map((book: Book) => ({
          ...book,
          imageUrl: `/placeholder.svg?height=300&width=200`,
        }))

        setBooks(booksWithImages)

        if (booksWithImages.length === 0) {
          toast({
            title: "Nenhum resultado encontrado",
            description: `Não encontramos livros do gênero "${genre}".`,
          })
        }
      } else {
        toast({
          title: "Erro ao buscar livros",
          description: "Não foi possível carregar os livros. Tente novamente mais tarde.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Função para buscar livros por título ou autor
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(
        `http://localhost:8080/v1/library/books/search?titulo=${searchQuery}&autor=${searchQuery}`,
      )

      if (response.ok) {
        const data = await response.json()

        // Adicionar URLs de imagens fictícias para os livros
        const booksWithImages = data.map((book: Book) => ({
          ...book,
          imageUrl: `/placeholder.svg?height=300&width=200`,
        }))

        setBooks(booksWithImages)

        if (booksWithImages.length === 0) {
          toast({
            title: "Nenhum resultado encontrado",
            description: `Não encontramos livros para "${searchQuery}".`,
          })
        }
      } else {
        toast({
          title: "Erro ao buscar livros",
          description: "Não foi possível realizar a busca. Tente novamente mais tarde.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Função para limpar os filtros
  const clearFilters = () => {
    setSelectedGenre(null)
    setSearchQuery("")
    fetchBooks()
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Descubra seu próximo livro favorito</h1>
          <p className="text-muted-foreground">Explore nossa vasta coleção de livros em diversas categorias</p>
        </div>
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por título ou autor..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" variant="default">
            Buscar
          </Button>
          <Link href="/carrinho">
            <Button variant="outline" size="icon">
              <ShoppingCart className="h-4 w-4" />
              <span className="sr-only">Carrinho</span>
            </Button>
          </Link>
        </form>
        <div className="flex flex-col gap-6">
          <CategoryFilter
            selectedGenre={selectedGenre}
            onSelectGenre={setSelectedGenre}
            onClearFilters={clearFilters}
          />

          {isLoading ? (
            <div className="text-center py-12">
              <p>Carregando livros...</p>
            </div>
          ) : (
            <div className="grid gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {selectedGenre ? `Livros de ${selectedGenre}` : "Todos os Livros"}
                </h2>
              </div>
              {books.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum livro encontrado.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

