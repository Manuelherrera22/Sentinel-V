const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'http://localhost:54321'; // Dummy default
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || 'dummy-key';
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-qr-tokens-development';

// Usamos Service Role para interactuar con tablas seguras de BD (bypass RLS localmente o como admin en backend)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

async function generateVisitToken(visit_id, inmate_id, visitor_id) {
  // Generar un JTI único
  const jti = crypto.randomUUID();
  
  // El token expira en 30 minutos
  const expiresInSeconds = 30 * 60;
  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

  // Crear JWT
  const payload = {
    visit_id,
    inmate_id,
    visitor_id,
    jti
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: expiresInSeconds });

  // Guardar token en BD para evitar re-uso
  const { error } = await supabase
    .from('qr_tokens')
    .insert([{
      jti,
      visit_id,
      expires_at: expiresAt.toISOString()
    }]);

  if (error) {
    throw new Error('Failed to save QR token to database: ' + error.message);
  }

  // En producción esto podría devolver una imagen QR, aquí devolvemos el raw token (y url scheme simulada)
  return {
    token,
    qr_data: `sentinel://visit/${token}`
  };
}

async function validateVisitToken(token) {
  try {
    // 1. Verificar firma y expiración del JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    const { jti, visit_id } = decoded;

    // 2. Verificar estado en base de datos (que no haya sido usado)
    const { data: qrTokens, error } = await supabase
      .from('qr_tokens')
      .select('*')
      .eq('jti', jti)
      .single();

    if (error || !qrTokens) {
      return { valid: false, error: 'Token not found in database' };
    }

    if (qrTokens.used_at) {
      return { valid: false, error: 'Token has already been used' };
    }

    // Opcional: Validar que la visita está aprobada
    const { data: visit, error: visitError } = await supabase
      .from('visits_schedule')
      .select('status')
      .eq('id', visit_id)
      .single();

    if (visitError || !visit || visit.status !== 'approved') {
       return { valid: false, error: 'Visit is not approved' };
    }

    // 3. Marcar token como usado
    await supabase
      .from('qr_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('jti', jti);

    // 4. Actualizar estado de visita a "in_progress" (ingresado)
    await supabase
      .from('visits_schedule')
      .update({ status: 'in_progress' })
      .eq('id', visit_id);

    return { valid: true, data: decoded };
  } catch (error) {
    // catch jwt errors (TokenExpiredError, JsonWebTokenError)
    return { valid: false, error: error.message };
  }
}

module.exports = {
  generateVisitToken,
  validateVisitToken
};
