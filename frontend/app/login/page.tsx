"use client"

import type React from "react"

import { BookOpen } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

interface LoginData {
  email: string
  senha: string
}

interface RegisterData {
  name: string
  email: string
  senha: string
}

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("login")
  const [isLoading, setIsLoading] = useState(false)

  // Estados para o formulário de login
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    senha: "",
  })

  // Estados para o formulário de cadastro
  const [registerData, setRegisterData] = useState<RegisterData>({
    name: "",
    email: "",
    senha: "",
  })
  const [confirmPassword, setConfirmPassword] = useState("")

  // Verificar se o usuário já está logado
  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      // Se já estiver logado, redireciona para a página inicial
      router.push("/")
    }
  }, [router])

  // Função para lidar com o login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!loginData.email || !loginData.senha) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      console.log("Enviando requisição de login:", loginData)

      const response = await fetch("http://localhost:8080/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      })

      console.log("Status da resposta:", response.status)

      // Tenta obter o corpo da resposta como texto primeiro
      const responseText = await response.text()
      console.log("Resposta do servidor (texto):", responseText)

      // Tenta converter para JSON se possível
      let responseData
      try {
        responseData = responseText ? JSON.parse(responseText) : {}
        console.log("Resposta do servidor (JSON):", responseData)
      } catch (e) {
        console.log("A resposta não é um JSON válido")
        responseData = {}
      }

      if (response.ok) {
        // Armazena os dados do usuário no localStorage
        const userData = {
          ...responseData,
          email: loginData.email, // Garante que temos o email mesmo se o backend não retornar
        }

        localStorage.setItem("user", JSON.stringify(userData))

        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo à e-Livraria.",
        })

        // Força uma atualização da página para garantir que o Header seja atualizado
        window.location.href = "/"
      } else {
        toast({
          title: "Erro ao fazer login",
          description: responseData.message || "Email ou senha incorretos.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro durante o login:", error)

      // Verifica se o erro é devido a CORS
      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        toast({
          title: "Erro de conexão",
          description: "Problema de CORS ou servidor indisponível. Verifique se o backend está rodando.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Erro de conexão",
          description: "Não foi possível conectar ao servidor. Tente novamente mais tarde.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Função para lidar com o cadastro
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!registerData.name || !registerData.email || !registerData.senha) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      })
      return
    }

    if (registerData.senha !== confirmPassword) {
      toast({
        title: "Senhas não conferem",
        description: "A senha e a confirmação de senha devem ser iguais.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      console.log("Enviando requisição de cadastro:", registerData)

      const response = await fetch("http://localhost:8080/v1/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      })

      console.log("Status da resposta:", response.status)

      // Tenta obter o corpo da resposta como texto primeiro
      const responseText = await response.text()
      console.log("Resposta do servidor (texto):", responseText)

      // Tenta converter para JSON se possível
      let responseData
      try {
        responseData = responseText ? JSON.parse(responseText) : {}
        console.log("Resposta do servidor (JSON):", responseData)
      } catch (e) {
        console.log("A resposta não é um JSON válido")
        responseData = {}
      }

      // Se o status for 2xx, consideramos sucesso mesmo se não houver corpo na resposta
      if (response.ok) {
        // Armazena os dados do usuário no localStorage
        const userData = {
          ...responseData,
          name: registerData.name,
          email: registerData.email,
        }

        localStorage.setItem("user", JSON.stringify(userData))

        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Bem-vindo à e-Livraria.",
        })

        // Força uma atualização da página para garantir que o Header seja atualizado
        window.location.href = "/"
      } else {
        toast({
          title: "Erro ao cadastrar",
          description: responseData.message || "Não foi possível realizar o cadastro.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro durante o cadastro:", error)

      // Verifica se o erro é devido a CORS
      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        toast({
          title: "Erro de conexão",
          description: "Problema de CORS ou servidor indisponível. Verifique se o backend está rodando.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Erro de conexão",
          description: "Não foi possível conectar ao servidor. Tente novamente mais tarde.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Funções para atualizar os estados dos formulários
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRegisterData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <BookOpen className="h-10 w-10" />
          </div>
          <CardTitle className="text-2xl">Bem-vindo à e-Livraria</CardTitle>
          <CardDescription>Entre com sua conta ou crie uma nova para começar a comprar</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="senha">Senha</Label>
                    <Link href="/recuperar-senha" className="text-xs text-primary hover:underline">
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <Input
                    id="senha"
                    name="senha"
                    type="password"
                    value={loginData.senha}
                    onChange={handleLoginChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Seu nome completo"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-senha">Senha</Label>
                  <Input
                    id="register-senha"
                    name="senha"
                    type="password"
                    value={registerData.senha}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
          <p>
            Ao continuar, você concorda com nossos{" "}
            <Link href="/termos" className="text-primary hover:underline">
              Termos de Serviço
            </Link>{" "}
            e{" "}
            <Link href="/privacidade" className="text-primary hover:underline">
              Política de Privacidade
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

