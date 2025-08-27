import { useState } from "react";
import CepSearch from "./components/CepSearch";
import CepResult from "./components/CepResult";
import { getAddressByCep } from "./services/viacep";
import type { ViaCep } from "./types/viacep";

export default function App() {
  const [data, setData] = useState<ViaCep | null>(null);

  const handleSearch = async (cep: string) => {
    const result = await getAddressByCep(cep);
    setData(result);
  };

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: "0 16px" }}>
      <h1>Consulta CEP (ViaCEP)</h1>
      <p style={{ color: "#666", marginBottom: 16 }}>
        Digite um CEP e clique em “Buscar” para ver os dados.
      </p>

      <CepSearch onSearch={handleSearch} />
      <CepResult data={data} />
    </div>
  );
}
