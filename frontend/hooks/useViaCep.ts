import { useState } from "react"

export interface CepData {
  logradouro: string
  bairro: string
  localidade: string
  uf: string
}

export function useViaCep() {
  const [loading, setLoading] = useState(false)

  async function fetchCep(cep: string): Promise<CepData | null> {
    const clean = cep.replace(/\D/g, "")
    if (clean.length !== 8) return null
    setLoading(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`)
      const json = await res.json()
      if (json.erro) return null
      return json as CepData
    } catch {
      return null
    } finally {
      setLoading(false)
    }
  }

  return { fetchCep, loading }
}
