import { useState } from "react";
import CepSearch from "./components/CepSearch";
import CepResult from "./components/CepResult";
import { getAddressByCep } from "./services/viacep";
import type { ViaCep } from "./types/viacep";

export default function App() {
  const [data, setData] = useState<ViaCep | null>(null);
  const [history, setHistory] = useState<ViaCep[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<String | null>(null);
  const [filter, setFilter] = useState("");

  const handleSearch = async (cep: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await getAddressByCep(cep);
      if (!result) {
        setError("Cep não encontrado ou inválido.");
      } else {
        setData(result);
        setHistory((prev) => [result, ...prev.filter((h) => h.cep !== result.cep)]);
      }
    } catch {
      setError("Erro ao consultar a API.");
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter((item) =>
    item.cep.includes(filter) ||
    item.logradouro.toLowerCase().includes(filter.toLowerCase()) ||
    item.localidade.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: "0 16px" }}>
      <h1>Consulta CEP (ViaCEP)</h1>
      <p style={{ color: "#666", marginBottom: 16 }}>
        Digite um CEP e clique em “Buscar”.
      </p>

      <CepSearch onSearch={handleSearch} />

      {loading && <p> 🔄 Carregando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && <CepResult data={data} />}

      {history.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2>Histórico</h2>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filtrar histórico..."
            style={{ marginBottom: 12, padding: 6, width: "100%" }}
          />

          <ul style={{ listStyle: "none", padding: 0 }}>
            {filteredHistory.map((item) => (
              <li
                key={item.cep}
                style={{
                  padding: "8px 12px",
                  borderBottom: "1px solid #ddd",
                  cursor: "pointer",
                }}
                onClick={() => setData(item)}
              >
                {item.cep} — {item.logradouro || "Sem logradouro"}, {item.localidade}/{item.uf}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
