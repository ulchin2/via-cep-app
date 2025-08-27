import { useState } from "react";

type Props = {
  onSearch: (cep: string) => void;
};

export default function CepSearch({ onSearch }: Props) {
  const [cep, setCep] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(cep);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
      <input
        value={cep}
        onChange={(e) => setCep(e.target.value)}
        placeholder="Digite o CEP (ex: 01001-000)"
        inputMode="numeric"
        style={{ padding: 8, flex: 1 }}
      />
      <button type="submit" style={{ padding: "8px 12px", cursor: "pointer" }}>
        Buscar
      </button>
    </form>
  );
}
