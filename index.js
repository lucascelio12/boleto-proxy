import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Consulta boleto específico
app.get('/api/boleto/:id', async (req, res) => {
  const { id } = req.params;

  const authHeader = 'Basic ' + Buffer.from(`${process.env.BOLETOCLOUD_API_TOKEN}:token`).toString('base64');

  try {
    const response = await fetch(`https://api.boletocloud.com/api/v1/boletos/${id}`, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
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
  const boletoData = req.body;

  const authHeader = 'Basic ' + Buffer.from(`${process.env.BOLETOCLOUD_API_TOKEN}:token`).toString('base64');

  try {
    const response = await fetch('https://api.boletocloud.com/api/v1/boletos', {
      method: 'POST',
      headers: {
        Authorization: authHeader,
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

// 🧪 Teste simples
app.get('/', (req, res) => {
  res.send('🚀 Proxy BoletoCloud rodando com sucesso!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Proxy rodando em http://localhost:${PORT}`);
});
