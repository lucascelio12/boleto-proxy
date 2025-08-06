import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// 📌 Consulta conta
app.get('/api/boleto/accounts', async (req, res) => {
  try {
    const response = await fetch('https://api.boletocloud.com/api/v1/accounts', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.BOLETOCLOUD_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Erro ao buscar contas: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao consultar a BoletoCloud:', error);
    res.status(500).json({ error: error.message });
  }
});

// 📌 Consulta boleto específico
app.get('/api/boleto/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`https://api.boletocloud.com/api/v1/boletos/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.BOLETOCLOUD_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error(`Erro ao consultar boleto ${id}:`, error);
    res.status(500).json({ error: 'Erro ao consultar boleto' });
  }
});

// ✅ Geração de boleto
app.post('/api/boleto', async (req, res) => {
  try {
    const boletoData = req.body;
    const response = await fetch('https://api.boletocloud.com/api/v1/boletos', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.BOLETOCLOUD_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(boletoData)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Erro ao gerar boleto:', error);
    res.status(500).json({ error: 'Erro ao gerar boleto' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Proxy rodando em http://localhost:${PORT}`);
});
