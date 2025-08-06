import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const API_BASE = 'https://api.boletocloud.com/api/v1';
const AUTH_HEADER = {
  Authorization: `Bearer ${process.env.BOLETOCLOUD_API_TOKEN}`,
  'Content-Type': 'application/json'
};

// 📌 Gerar boleto
app.post('/api/boleto', async (req, res) => {
  try {
    const boletoData = req.body;
    const response = await fetch(`${API_BASE}/boletos`, {
      method: 'POST',
      headers: AUTH_HEADER,
      body: JSON.stringify(boletoData)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Erro ao gerar boleto:', error);
    res.status(500).json({ error: 'Erro ao gerar boleto' });
  }
});

// 📌 Consultar boleto por ID
app.get('/api/boleto/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`${API_BASE}/boletos/${id}`, {
      method: 'GET',
      headers: AUTH_HEADER
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error(`Erro ao consultar boleto ${id}:`, error);
    res.status(500).json({ error: 'Erro ao consultar boleto' });
  }
});

// 📌 Listar boletos (com filtros opcionais via query string)
app.get('/api/boletos', async (req, res) => {
  try {
    const queryParams = new URLSearchParams(req.query).toString();
    const url = `${API_BASE}/boletos${queryParams ? '?' + queryParams : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: AUTH_HEADER
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Erro ao listar boletos:', error);
    res.status(500).json({ error: 'Erro ao listar boletos' });
  }
});

// 📌 Cancelar boleto
app.post('/api/boleto/:id/cancel', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`${API_BASE}/boletos/${id}/cancelar`, {
      method: 'POST',
      headers: AUTH_HEADER
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error(`Erro ao cancelar boleto ${id}:`, error);
    res.status(500).json({ error: 'Erro ao cancelar boleto' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Proxy rodando em http://localhost:${PORT}`);
});
