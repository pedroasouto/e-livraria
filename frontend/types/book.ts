// Definição do tipo Book conforme o backend
export interface Book {
  id: number
  titulo: string
  autor: string
  editora: string
  genero: string
  ano: number
  paginas: number
  preco: number
  imageUrl?: string // Campo adicional para a imagem (não vem do backend)
}

// Enum para as formas de pagamento
export enum FormaPagamento {
  CARTAO_CREDITO = "CARTAO_CREDITO",
  CARTAO_DEBITO = "CARTAO_DEBITO",
  PIX = "PIX",
}

// Interface para o carrinho
export interface Carrinho {
  itens: Book[]
}

// Interface para o checkout
export interface CheckoutData {
  user: string
  email: string
  valorTotal: number
  carrinho: Carrinho
  formaPagamento: FormaPagamento
}

