"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export function QueryProvider({ children }: { children: React.ReactNode }) {

  // Usamos useState para garantir que o cliente seja criado apenas uma vez durante todo o ciclo de vida da aplicação.
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000, // Aqui, 60.000ms = 1 minuto. Durante esse tempo, ele não refaz a busca se você mudar de tela.
            retry: 1, // Se uma requisição falhar, ele tentará refazer a busca automaticamente 1 vez antes de dar erro.
          },
        },
      })
  )

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
