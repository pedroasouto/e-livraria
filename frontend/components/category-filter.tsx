"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

interface CategoryFilterProps {
  selectedGenre: string | null
  onSelectGenre: (genre: string | null) => void
  onClearFilters: () => void
}

export function CategoryFilter({ selectedGenre, onSelectGenre, onClearFilters }: CategoryFilterProps) {
  const { toast } = useToast()
  const [genres, setGenres] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchGenres()
  }, [])

  const fetchGenres = async () => {
    setIsLoading(true)
    try {
      setGenres([
        "Distopia",
        "Ficção",
        "Novel",
        "Romance",
        "Fantasia",
        "Aventura",
        "Filosofia",
        "Terror",
        "Historia",
      ])
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Categorias</h3>
        <Button variant="ghost" size="sm" className="h-8 text-sm" onClick={onClearFilters}>
          Limpar
        </Button>
      </div>
      <Separator />
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando categorias...</p>
      ) : (
        <div className="flex gap-2 overflow-auto pb-2 -mx-2 px-2">
          <Button
            variant={selectedGenre === null ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => onSelectGenre(null)}
          >
            {selectedGenre === null && <Check className="mr-1 h-3 w-3" />}
            All
          </Button>
          {genres.map((genre) => (
            <Button
              key={genre}
              variant={selectedGenre === genre ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => onSelectGenre(genre)}
            >
              {selectedGenre === genre && <Check className="mr-1 h-3 w-3" />}
              {genre}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

