import { Paper, Typography, Grid, Button, Box, Menu, MenuItem } from "@mui/material";
import type { ViaCep } from "../types/viacep";
import { useState } from "react";
import jsPDF from "jspdf";

type Props = {
  data: ViaCep | null;
};

export default function CepResult({ data }: Props) {
  if (!data) return null;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  // TXT
  const downloadTxt = () => {
    handleMenuClose();
    const txt = `
CEP: ${data.cep}
Logradouro: ${data.logradouro || "-"}
Complemento: ${data.complemento || "-"}
Bairro: ${data.bairro || "-"}
Cidade: ${data.localidade || "-"}
UF: ${data.uf || "-"}
DDD: ${data.ddd || "-"}
IBGE: ${data.ibge || "-"}
SIAFI: ${data.siafi || "-"}
GIA: ${data.gia || "-"}
    `.trim();

    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.cep}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // PDF
  const downloadPdf = () => {
    handleMenuClose();
    const doc = new jsPDF();
    let y = 10;
    const fields: { label: string; value: keyof ViaCep }[] = [
      { label: "CEP", value: "cep" },
      { label: "Logradouro", value: "logradouro" },
      { label: "Complemento", value: "complemento" },
      { label: "Bairro", value: "bairro" },
      { label: "Cidade", value: "localidade" },
      { label: "UF", value: "uf" },
      { label: "DDD", value: "ddd" },
      { label: "IBGE", value: "ibge" },
      { label: "SIAFI", value: "siafi" },
      { label: "GIA", value: "gia" },
    ];
    doc.setFontSize(12);
    doc.text(`Resultado do CEP: ${data.cep}`, 10, y);
    y += 10;
    fields.forEach((f) => {
      doc.text(`${f.label}: ${data[f.value] || "-"}`, 10, y);
      y += 8;
    });
    doc.save(`${data.cep}.pdf`);
  };

  const fields: { label: string; value: keyof ViaCep }[] = [
    { label: "CEP", value: "cep" },
    { label: "Logradouro", value: "logradouro" },
    { label: "Complemento", value: "complemento" },
    { label: "Bairro", value: "bairro" },
    { label: "Cidade", value: "localidade" },
    { label: "UF", value: "uf" },
    { label: "DDD", value: "ddd" },
    { label: "IBGE", value: "ibge" },
    { label: "SIAFI", value: "siafi" },
    { label: "GIA", value: "gia" },
  ];

  return (
    <Paper elevation={3} sx={{ mt: 3, p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          mb: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Resultado da busca
        </Typography>
        <Button variant="outlined" size="small" onClick={handleMenuClick}>
          Download
        </Button>
        <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
          <MenuItem onClick={downloadTxt}>TXT</MenuItem>
          <MenuItem onClick={downloadPdf}>PDF</MenuItem>
        </Menu>
      </Box>

      <Grid container spacing={2}>
        {fields.map(({ label, value }) => (
          <Grid item xs={12} sm={6} key={value}>
            <Typography variant="subtitle2" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="body1">{data[value] || "-"}</Typography>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
