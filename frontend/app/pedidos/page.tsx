"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, User, Package, LogOut, ShoppingBag, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { FormaPagamento } from "@/types/book"

interface UserData {
  name: string
  email: string
}

interface Pagamento {
  id: number
  user: string
  email: string
  valorTotal: number
  formaPagamento: FormaPagamento
  dataPagamento?: string 
}

export default function OrdersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Verificar se o usuário está logado e buscar pagamentos
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const user = localStorage.getItem("user")
        if (user) {
          const parsedUser = JSON.parse(user)
          const userEmail = parsedUser.email || ""

          setUserData({
            name: parsedUser.name || parsedUser.nome || "Usuário",
            email: userEmail,
          })

          if (userEmail) {
            await fetchPagamentos(userEmail)
          }
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
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao carregar seus dados.",
          variant: "destructive",
        })
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkUserLoggedIn()
  }, [router, toast])

  // Função para buscar pagamentos do usuário
  const fetchPagamentos = async (email: string) => {
    try {
      const response = await fetch(`http://localhost:8080/v1/user/pagamentos/${email}`)

      if (response.ok) {
        const data = await response.json()
        console.log("Pagamentos recebidos:", data)
        setPagamentos(data)
      } else {
        console.error("Erro ao buscar pagamentos:", response.status)
        toast({
          title: "Erro ao buscar pedidos",
          description: "Não foi possível carregar seu histórico de pedidos.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao buscar pagamentos:", error)
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor. Tente novamente mais tarde.",
        variant: "destructive",
      })
    }
  }

  const formatPaymentMethod = (method: FormaPagamento) => {
    switch (method) {
      case FormaPagamento.CARTAO_CREDITO:
        return "Cartão de Crédito"
      case FormaPagamento.CARTAO_DEBITO:
        return "Cartão de Débito"
      case FormaPagamento.PIX:
        return "PIX"
      default:
        return method
    }
  }

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
        <p>Carregando pedidos...</p>
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
        <h1 className="text-3xl font-bold">Meus Pedidos</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Coluna da esquerda - Informações do usuário */}
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
                <CardTitle>Histórico de Pedidos</CardTitle>
                <CardDescription>Veja todos os seus pedidos anteriores</CardDescription>
              </CardHeader>
              <CardContent>
                {pagamentos.length > 0 ? (
                  <div className="space-y-4">
                    {pagamentos.map((pagamento) => (
                      <Card key={pagamento.id} className="overflow-hidden">
                        <div className="bg-muted p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ShoppingBag className="h-4 w-4" />
                              <span className="font-medium">Pedido #{pagamento.id}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{pagamento.dataPagamento || "Data não disponível"}</span>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Valor Total</p>
                              <p className="text-lg font-bold">
                                {pagamento.valorTotal.toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                })}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Forma de Pagamento</p>
                              <p className="text-sm">{formatPaymentMethod(pagamento.formaPagamento)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                      <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Nenhum pedido encontrado</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Você ainda não realizou nenhum pedido em nossa loja.
                    </p>
                    <Button asChild>
                      <Link href="/">Começar a comprar</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

