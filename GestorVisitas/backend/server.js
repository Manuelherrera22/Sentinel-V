const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const qrService = require('./qr.service');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint para el bot de WhatsApp (Generar Token/QR)
// En un caso real, el bot de WA autenticaría esta llamada.
app.post('/api/qr/generate', async (req, res) => {
  try {
    const { visit_id, inmate_id, visitor_id } = req.body;
    if (!visit_id || !inmate_id || !visitor_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const qrData = await qrService.generateVisitToken(visit_id, inmate_id, visitor_id);
    res.json({ success: true, ...qrData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

// Endpoint para el panel de control (Validar Escaneo)
app.post('/api/qr/validate', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const result = await qrService.validateVisitToken(token);
    if (!result.valid) {
      return res.status(403).json({ error: result.error });
    }

    res.json({ success: true, data: result.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Validation failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend service running on port ${PORT}`);
});
