import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    IconButton,
    Box,
    Menu,
    MenuItem,
  } from "@mui/material";
  import { Grid } from "@mui/material";
  import CloseIcon from "@mui/icons-material/Close";
  import DownloadIcon from "@mui/icons-material/Download";
  import type { ViaCep } from "../types/viacep";
  import { useState } from "react";
  import jsPDF from "jspdf";
  
  type Props = {
    open: boolean;
    onClose: () => void;
    data: ViaCep | null;
  };
  
  export default function CepDetailModal({ open, onClose, data }: Props) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    if (!data || "erro" in data) return null;
  
    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => setAnchorEl(null);
  
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
      doc.text(`Detalhes do CEP: ${data.cep}`, 10, y);
      y += 10;
      fields.forEach((f) => {
        doc.text(`${f.label}: ${data[f.value] || "-"}`, 10, y);
        y += 8;
      });
      doc.save(`${data.cep}.pdf`);
    };
  
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        aria-labelledby="cep-dialog-title"
        PaperProps={{
          sx: { borderRadius: 3, p: { xs: 2, sm: 3 } },
        }}
      >
        <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6">Detalhes do CEP</Typography>
            <IconButton
              aria-label="download"
              onClick={handleMenuClick}
              sx={{ ml: 1 }}
            >
              <DownloadIcon color="primary" />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={downloadTxt}>TXT</MenuItem>
              <MenuItem onClick={downloadPdf}>PDF</MenuItem>
            </Menu>
          </Box>
          <IconButton
            aria-label="fechar"
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
  
        <DialogContent dividers>
          <Box sx={{ px: { xs: 0, sm: 1 } }}>
            <Grid container spacing={2}>
              <Grid xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">CEP:</Typography>
                <Typography variant="body1">{data.cep}</Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">UF:</Typography>
                <Typography variant="body1">{data.uf}</Typography>
              </Grid>
              <Grid xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Logradouro:</Typography>
                <Typography variant="body1">{data.logradouro || "-"}</Typography>
              </Grid>
              <Grid xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Bairro:</Typography>
                <Typography variant="body1">{data.bairro || "-"}</Typography>
              </Grid>
              <Grid xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Cidade:</Typography>
                <Typography variant="body1">{data.localidade || "-"}</Typography>
              </Grid>
              <Grid xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Complemento:</Typography>
                <Typography variant="body1">{data.complemento || "-"}</Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">DDD:</Typography>
                <Typography variant="body1">{data.ddd}</Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">IBGE:</Typography>
                <Typography variant="body1">{data.ibge}</Typography>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
  
        <DialogActions sx={{ justifyContent: { xs: "center", sm: "flex-end" }, p: 2 }}>
          <Button onClick={onClose} variant="contained" size="large">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  