import { useState } from "react";
import { Paper, TextField, Button } from "@mui/material";

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
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", gap: 2, p: 2, alignItems: "center" }}
      elevation={3}
    >
      <TextField color="primary"
        value={cep}
        onChange={(e) => setCep(e.target.value)}
        label="Digite o CEP"
        placeholder="Ex: 01001-000"
        inputMode="numeric"
        fullWidth
      />
      <Button type="submit" variant="contained" size="large">
        Buscar
      </Button>
    </Paper>
  );
}
