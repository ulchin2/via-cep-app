import type { ViaCep } from "../types/viacep";

type Props = {
  data: ViaCep | null;
};

export default function CepResult({ data }: Props) {
  if (!data) return null;

  return (
    <div style={{ marginTop: 16 }}>
      <h2 style={{ marginBottom: 8 }}>Resultado</h2>
      <dl style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 8 }}>
        <dt>CEP</dt><dd>{data.cep}</dd>
        <dt>Logradouro</dt><dd>{data.logradouro || "-"}</dd>
        <dt>Complemento</dt><dd>{data.complemento || "-"}</dd>
        <dt>Bairro</dt><dd>{data.bairro || "-"}</dd>
        <dt>Cidade</dt><dd>{data.localidade || "-"}</dd>
        <dt>UF</dt><dd>{data.uf || "-"}</dd>
        <dt>DDD</dt><dd>{data.ddd || "-"}</dd>
        <dt>IBGE</dt><dd>{data.ibge || "-"}</dd>
        <dt>SIAFI</dt><dd>{data.siafi || "-"}</dd>
        <dt>GIA</dt><dd>{data.gia || "-"}</dd>
      </dl>
    </div>
  );
}
