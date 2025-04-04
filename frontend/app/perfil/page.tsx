"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, User, Package, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

interface UserData {
  name: string
  email: string
  id?: string | number
}

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkUserLoggedIn = () => {
      try {
        const user = localStorage.getItem("user")
        if (user) {
          const parsedUser = JSON.parse(user)
          setUserData({
            name: parsedUser.name || parsedUser.nome || "Usuário",
            email: parsedUser.email || "",
            id: parsedUser.id || "",
          })
        } else {
          toast({
            title: "Acesso negado",
            description: "Você precisa estar logado para acessar esta página.",
            variant: "destructive",
          })
          router.push("/login")
        }
      } catch (error) {
        console.error("Erro ao verificar login:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkUserLoggedIn()
  }, [router, toast])

  const handleLogout = () => {
    localStorage.removeItem("user")

    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta com sucesso.",
    })

    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="container py-12 text-center">
        <p>Carregando perfil...</p>
      </div>
    )
  }

  if (!userData) {
    return null 
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

      <div className="grid gap-6">
        <h1 className="text-3xl font-bold">Meu Perfil</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>{userData.name}</CardTitle>
                    <CardDescription>{userData.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <nav className="flex flex-col space-y-1">
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/perfil">
                      <User className="mr-2 h-4 w-4" />
                      Informações Pessoais
                    </Link>
                  </Button>
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/pedidos">
                      <Package className="mr-2 h-4 w-4" />
                      Meus Pedidos
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair da Conta
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>Visualize e atualize suas informações pessoais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Nome completo</h3>
                    <p className="text-sm text-muted-foreground border p-2 rounded-md">{userData.name}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Email</h3>
                    <p className="text-sm text-muted-foreground border p-2 rounded-md">{userData.email}</p>
                  </div>
                  {userData.id && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">ID do usuário</h3>
                      <p className="text-sm text-muted-foreground border p-2 rounded-md">{userData.id}</p>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Preferências</h3>
                  <p className="text-sm text-muted-foreground">
                    Você ainda não configurou suas preferências de leitura.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Editar Perfil
                </Button>
              </CardFooter>
            </Card>

            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo de Atividades</CardTitle>
                  <CardDescription>Veja um resumo das suas atividades recentes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                    <div className="space-y-1 p-4 border rounded-md">
                      <p className="text-2xl font-bold">0</p>
                      <p className="text-sm text-muted-foreground">Pedidos</p>
                    </div>
                    <div className="space-y-1 p-4 border rounded-md">
                      <p className="text-2xl font-bold">0</p>
                      <p className="text-sm text-muted-foreground">Livros Comprados</p>
                    </div>
                    <div className="space-y-1 p-4 border rounded-md">
                      <p className="text-2xl font-bold">0</p>
                      <p className="text-sm text-muted-foreground">Avaliações</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

