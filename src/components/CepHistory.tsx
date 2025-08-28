import { useMemo, useState } from "react";
import {
  Paper,
  List,
  ListItemButton,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Pagination,
  TextField,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import type { ViaCep } from "../types/viacep";
import jsPDF from "jspdf";

type Props = {
  history: ViaCep[];
  onSelect: (cep: ViaCep) => void;
  onDelete: (cep: string) => void;
};

export default function CepHistory({ history, onSelect, onDelete }: Props) {
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<ViaCep | null>(null);

  const itemsPerPage = 5;

  const normalize = (text: string) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const normalizeCep = (value: string) => value.replace(/\D/g, "");

  const filtered = useMemo(() => {
    const query = normalize(filter);
    return history.filter(
      (item) =>
        normalizeCep(item.cep).includes(normalizeCep(filter)) ||
        normalize(item.logradouro).includes(query) ||
        normalize(item.localidade).includes(query)
    );
  }, [filter, history]);

  const pageCount = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, item: ViaCep) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const downloadTxt = (item: ViaCep) => {
    handleMenuClose();
    const txt = `
CEP: ${item.cep}
Logradouro: ${item.logradouro || "-"}
Complemento: ${item.complemento || "-"}
Bairro: ${item.bairro || "-"}
Cidade: ${item.localidade || "-"}
UF: ${item.uf || "-"}
DDD: ${item.ddd || "-"}
IBGE: ${item.ibge || "-"}
SIAFI: ${item.siafi || "-"}
GIA: ${item.gia || "-"}
    `.trim();

    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${item.cep}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = (item: ViaCep) => {
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
    doc.text(`Resultado do CEP: ${item.cep}`, 10, y);
    y += 10;
    fields.forEach((f) => {
      doc.text(`${f.label}: ${item[f.value] || "-"}`, 10, y);
      y += 8;
    });
    doc.save(`${item.cep}.pdf`);
  };

  return (
    <Paper sx={{ mt: 4, p: 3 }} elevation={3}>
      <Typography variant="h6" gutterBottom>
        Histórico
      </Typography>

      <TextField
        fullWidth
        size="small"
        label="Filtrar histórico"
        variant="outlined"
        value={filter}
        onChange={(e) => {
          setPage(1);
          setFilter(e.target.value);
        }}
        sx={{ mb: 2 }}
      />

      {paginated.length > 0 ? (
        <List>
          {paginated.map((item) => (
            <ListItemButton
              key={item.cep}
              onClick={() => onSelect(item)}
              sx={{ pr: 14 }}
            >
              <ListItemText
                primary={`${item.cep} — ${item.localidade}/${item.uf}`}
                secondary={item.logradouro}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="download"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuClick(e, item);
                  }}
                >
                  <DownloadIcon color="primary" />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.cep);
                  }}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItemButton>
          ))}
        </List>
      ) : (
        <Typography color="text.secondary">Nenhum resultado encontrado</Typography>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => selectedItem && downloadTxt(selectedItem)}>TXT</MenuItem>
        <MenuItem onClick={() => selectedItem && downloadPdf(selectedItem)}>PDF</MenuItem>
      </Menu>

      {pageCount > 1 && (
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, value) => setPage(value)}
          sx={{ mt: 2, display: "flex", justifyContent: "center" }}
        />
      )}
    </Paper>
  );
}
