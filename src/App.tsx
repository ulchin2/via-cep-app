import { useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Grid } from "@mui/material";
import CepSearch from "./components/CepSearch";
import CepResult from "./components/CepResult";
import CepHistory from "./components/CepHistory";
import CepDetailModal from "./components/CepDetailModal";
import type { ViaCep } from "./types/viacep";

export default function CepPage() {
  const [data, setData] = useState<ViaCep | null>(null);
  const [history, setHistory] = useState<ViaCep[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  async function handleSearch(cep: string) {
    const cleanCep = cep.replace(/\D/g, "");

    if (cleanCep.length !== 8) {
      setError("O CEP deve ter 8 dígitos.");
      setData(null);
      return;
    }

    try {
      setError(null);
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`
      );
      const result: ViaCep = await response.json();

      if ("erro" in result) {
        setError("CEP não encontrado.");
        setData(null);
        return;
      }

      setData(result);
      setHistory((prev) => {
        const exists = prev.some((item) => item.cep === result.cep);
        if (exists) return prev;
        return [result, ...prev];
      });
    } catch {
      setError("Não foi possível buscar o CEP. Verifique sua conexão.");
      setData(null);
    }
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: isDesktop ? "center" : "flex-start",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom align="center">
        Consulta de CEP
      </Typography>

      <Grid container spacing={3} sx={{ width: "100%" }}>
        <Grid item xs={12}>
          <CepSearch onSearch={handleSearch} />
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <CepResult data={data} />
        </Grid>

        <Grid item xs={12}>
          <CepHistory
            history={history}
            onSelect={(cep) => {
              setData(cep);
              setModalOpen(true);
            }}
            onDelete={(cep) =>
              setHistory(history.filter((item) => item.cep !== cep))
            }
          />
        </Grid>
      </Grid>

      <CepDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={data}
      />
    </Container>
  );
}
