"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Trash2, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/components/ui/use-toast"
import { FormaPagamento, type CheckoutData } from "@/types/book"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface EnderecoData {
  estado: string
  cidade: string
  rua: string
  numero: string
  bairro: string
}

export default function CartPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { items, removeFromCart, getTotal, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState<FormaPagamento>(FormaPagamento.CARTAO_CREDITO)
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const [endereco, setEndereco] = useState<EnderecoData>({
    estado: "",
    cidade: "",
    rua: "",
    numero: "",
    bairro: "",
  })

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      try {
        const parsedUser = JSON.parse(user)
        setUserData({
          name: parsedUser.name || parsedUser.nome || "",
          email: parsedUser.email || "",
        })
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error)
      }
    } else {
      router.push("/login")
    }
  }, [router])

  const subtotal = getTotal()
  const shipping = subtotal > 100 ? 0 : 15.9
  const total = subtotal + shipping

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEndereco((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const isEnderecoCompleto = () => {
    return (
      endereco.estado.trim() !== "" &&
      endereco.cidade.trim() !== "" &&
      endereco.rua.trim() !== "" &&
      endereco.numero.trim() !== "" &&
      endereco.bairro.trim() !== ""
    )
  }

  const handleCheckout = async () => {
    if (!userData) {
      toast({
        title: "Usuário não logado",
        description: "Você precisa estar logado para finalizar a compra.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho antes de finalizar a compra.",
        variant: "destructive",
      })
      return
    }

    if (!isEnderecoCompleto()) {
      toast({
        title: "Endereço incompleto",
        description: "Por favor, preencha todos os campos do endereço.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    const checkoutData: CheckoutData & { endereco: EnderecoData } = {
      user: userData.name,
      email: userData.email,
      valorTotal: total,
      carrinho: {
        itens: items,
      },
      formaPagamento: paymentMethod,
      endereco: endereco,
    }

    try {
      const response = await fetch("http://localhost:8080/v1/user/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      })

      if (response.ok) {
        setShowSuccessModal(true)

        clearCart()
      } else {
        const errorData = await response.json()
        toast({
          title: "Erro ao finalizar pedido",
          description: errorData.message || "Não foi possível processar seu pedido. Tente novamente mais tarde.",
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

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
    router.push("/")
  }

  return (
    <div className="container py-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Continuar comprando
      </Link>

      <h1 className="text-3xl font-bold mb-6">Carrinho de Compras</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">Seu carrinho está vazio</h2>
          <p className="text-muted-foreground mb-6">Adicione alguns livros para continuar</p>
          <Link href="/">
            <Button>Explorar livros</Button>
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <Image
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.titulo}
                      width={80}
                      height={120}
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1">
                      <Link href={`/livros/${item.id}`} className="font-medium hover:underline">
                        {item.titulo}
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.autor}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.editora} • {item.genero} • {item.ano}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-4">
                        <span className="font-medium">
                          {item.preco.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Endereço de Entrega</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado</Label>
                      <Input
                        id="estado"
                        name="estado"
                        placeholder="Ex: SP"
                        value={endereco.estado}
                        onChange={handleEnderecoChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input
                        id="cidade"
                        name="cidade"
                        placeholder="Ex: São Paulo"
                        value={endereco.cidade}
                        onChange={handleEnderecoChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rua">Rua</Label>
                    <Input
                      id="rua"
                      name="rua"
                      placeholder="Ex: Av. Paulista"
                      value={endereco.rua}
                      onChange={handleEnderecoChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numero">Número</Label>
                      <Input
                        id="numero"
                        name="numero"
                        placeholder="Ex: 1000"
                        value={endereco.numero}
                        onChange={handleEnderecoChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bairro">Bairro</Label>
                      <Input
                        id="bairro"
                        name="bairro"
                        placeholder="Ex: Centro"
                        value={endereco.bairro}
                        onChange={handleEnderecoChange}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumo do pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>
                    {subtotal.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frete</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Grátis</span>
                    ) : (
                      shipping.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    )}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>
                    {total.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>

                <div className="pt-4">
                  <h3 className="font-medium mb-2">Forma de pagamento</h3>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as FormaPagamento)}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value={FormaPagamento.CARTAO_CREDITO} id="credit" />
                      <Label htmlFor="credit">Cartão de Crédito</Label>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value={FormaPagamento.CARTAO_DEBITO} id="debit" />
                      <Label htmlFor="debit">Cartão de Débito</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={FormaPagamento.PIX} id="pix" />
                      <Label htmlFor="pix">Pix</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={isLoading || items.length === 0 || !isEnderecoCompleto()}
                >
                  {isLoading ? "Processando..." : "Finalizar compra"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}

      {}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              Pedido Finalizado com Sucesso!
            </DialogTitle>
            <DialogDescription>
              Seu pedido foi processado e será enviado em breve para o endereço informado.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">Você receberá um e-mail com os detalhes do seu pedido.</p>
          </div>
          <DialogFooter>
            <Button onClick={handleCloseSuccessModal} className="w-full">
              Continuar Comprando
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

