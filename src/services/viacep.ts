import type { ViaCep } from "../types/viacep";

export async function getAddressByCep(rawCep: string): Promise<ViaCep | null> {
  const cep = rawCep.replace(/\D/g, ""); // mantém só números
  if (!cep) return null;

  const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  if (!res.ok) return null;

  const data = (await res.json()) as ViaCep | { erro: true };
  if ("erro" in data && data.erro) return null;

  return data as ViaCep;
}