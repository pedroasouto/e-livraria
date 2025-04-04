import { BookOpen, Facebook, Instagram, Twitter } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col gap-6 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <BookOpen className="h-6 w-6" />
              <span>e-Livraria</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Sua e-Livraria com os melhores títulos nacionais e internacionais.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-2">
              <h3 className="font-medium">Navegação</h3>
              <nav className="flex flex-col gap-2">
                <Link href="/" className="text-sm text-muted-foreground hover:underline">
                  Início
                </Link>
                <Link href="/categorias" className="text-sm text-muted-foreground hover:underline">
                  Categorias
                </Link>
                <Link href="/lancamentos" className="text-sm text-muted-foreground hover:underline">
                  Lançamentos
                </Link>
                <Link href="/mais-vendidos" className="text-sm text-muted-foreground hover:underline">
                  Mais Vendidos
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-medium">Suporte</h3>
              <nav className="flex flex-col gap-2">
                <Link href="/faq" className="text-sm text-muted-foreground hover:underline">
                  FAQ
                </Link>
                <Link href="/contato" className="text-sm text-muted-foreground hover:underline">
                  Contato
                </Link>
                <Link href="/devolucoes" className="text-sm text-muted-foreground hover:underline">
                  Devoluções
                </Link>
                <Link href="/envio" className="text-sm text-muted-foreground hover:underline">
                  Envio
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-medium">Legal</h3>
              <nav className="flex flex-col gap-2">
                <Link href="/termos" className="text-sm text-muted-foreground hover:underline">
                  Termos de Uso
                </Link>
                <Link href="/privacidade" className="text-sm text-muted-foreground hover:underline">
                  Política de Privacidade
                </Link>
                <Link href="/cookies" className="text-sm text-muted-foreground hover:underline">
                  Política de Cookies
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-6">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} e-Livraria. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

