"use client"

import { BookOpen, ShoppingCart, User } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/hooks/use-cart"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const { getItemCount } = useCart()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const cartItemCount = getItemCount()

  // Verificar se o usuário está logado ao carregar o componente e quando a rota muda
  useEffect(() => {
    checkUserLoggedIn()
  }, [pathname]) // Re-verificar quando a rota muda

  // Função para verificar se o usuário está logado
  const checkUserLoggedIn = () => {
    try {
      const user = localStorage.getItem("user")
      if (user) {
        const userData = JSON.parse(user)
        setIsLoggedIn(true)
        setUserName(userData.name || userData.nome || "Usuário")
        console.log("Usuário logado:", userData)
      } else {
        setIsLoggedIn(false)
        setUserName("")
        console.log("Nenhum usuário logado")
      }
    } catch (error) {
      console.error("Erro ao verificar login:", error)
      setIsLoggedIn(false)
    }
  }

  // Função para fazer logout
  const handleLogout = () => {
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    setUserName("")

    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta com sucesso.",
    })

    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <BookOpen className="h-6 w-6" />
            <span className="hidden md:inline-block">e-Livraria</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/carrinho">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {cartItemCount}
                </span>
              )}
              <span className="sr-only">Carrinho</span>
            </Button>
          </Link>
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Perfil</span>
                  {userName && (
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">Olá, {userName}</div>
                <DropdownMenuItem asChild>
                  <Link href="/perfil">Meu Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/pedidos">Meus Pedidos</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button>Entrar</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

