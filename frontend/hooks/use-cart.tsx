"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Book as BaseBook } from "@/types/book"

interface Book extends BaseBook {
  quantity?: number
}
import { useToast } from "@/components/ui/use-toast"

interface CartContextType {
  items: Book[]
  addToCart: (book: Book) => void
  removeFromCart: (bookId: number) => void
  updateQuantity: (bookId: number, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const [items, setItems] = useState<Book[]>([])

  // Carregar o carrinho do localStorage ao iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Erro ao carregar o carrinho:", error)
      }
    }
  }, [])

  // Salvar o carrinho no localStorage quando for atualizado
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  // Adicionar um livro ao carrinho
  const addToCart = (book: Book) => {
    setItems((prev) => {
      // Verificar se o livro já está no carrinho
      const existingItemIndex = prev.findIndex((item) => item.id === book.id)

      if (existingItemIndex >= 0) {
        // Se já estiver, atualiza a quantidade
        const updatedItems = [...prev]
        const existingItem = updatedItems[existingItemIndex]
        const currentQuantity = (existingItem as any).quantity || 1
        const newQuantity = (book as any).quantity || 1

        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: currentQuantity + newQuantity,
        }

        toast({
          title: "Quantidade atualizada",
          description: `${book.titulo} agora tem ${currentQuantity + newQuantity} unidades no carrinho.`,
        })

        return updatedItems
      } else {
        toast({
          title: "Livro adicionado",
          description: `${book.titulo} foi adicionado ao seu carrinho.`,
        })

        const bookWithQuantity = {
          ...book,
          quantity: (book as any).quantity || 1,
        }

        return [...prev, bookWithQuantity]
      }
    })
  }

  const removeFromCart = (bookId: number) => {
    setItems((prev) => {
      const updatedItems = prev.filter((item) => item.id !== bookId)

      if (updatedItems.length < prev.length) {
        toast({
          title: "Livro removido",
          description: "O livro foi removido do seu carrinho.",
        })
      }

      return updatedItems
    })
  }

  const updateQuantity = (bookId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId)
      return
    }

    setItems((prev) => {
      return prev.map((item) => {
        if (item.id === bookId) {
          return { ...item, quantity }
        }
        return item
      })
    })
  }

  const clearCart = () => {
    setItems([])
    toast({
      title: "Carrinho limpo",
      description: "Todos os itens foram removidos do seu carrinho.",
    })
  }

  // Calcular o total do carrinho
  const getTotal = () => {
    return items.reduce((total, item) => {
      const quantity = (item as any).quantity || 1
      return total + item.preco * quantity
    }, 0)
  }

  const getItemCount = () => {
    return items.length
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }

  return context
}

