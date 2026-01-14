const nodemailer = require('nodemailer');

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  },
  body: JSON.stringify(body),
});

const getAllowedDomains = () => {
  const envDomains = process.env.ALLOWED_EMAIL_DOMAINS || process.env.ALLOWED_EMAIL_DOMAIN || '';
  return envDomains
    .split(',')
    .map(d => d.trim().toLowerCase())
    .filter(Boolean);
};

const domainAllowed = (email, allowedDomains) => {
  try {
    const parts = String(email).toLowerCase().split('@');
    const domain = parts[1];
    if (!domain) return false;
    if (!allowedDomains || allowedDomains.length === 0) return true; // no restriction
    return allowedDomains.some((allowedDomain) => {
      const normalized = String(allowedDomain || '').toLowerCase();
      if (!normalized) return false;
      if (normalized === '*') return true;
      if (normalized.startsWith('.')) {
        return domain.endsWith(normalized);
      }
      return domain === normalized;
    });
  } catch (e) {
    return false;
  }
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, { ok: true });
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method Not Allowed' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return jsonResponse(400, { error: 'Invalid JSON payload' });
  }

  const { to, subject, text, html, replyTo } = payload;
  if (!to || !subject || (!text && !html)) {
    return jsonResponse(400, { error: 'Missing required fields: to, subject, text|html' });
  }

  const allowedDomains = getAllowedDomains();
  if (!domainAllowed(to, allowedDomains)) {
    return jsonResponse(400, { error: `Email domain not allowed. Allowed: ${allowedDomains.join(', ')}` });
  }

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = (process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;

  if (!host || !port || !from) {
    return jsonResponse(500, { error: 'SMTP configuration missing (SMTP_HOST, SMTP_PORT, SMTP_FROM)' });
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
  });

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
      replyTo,
    });

    return jsonResponse(200, { ok: true, messageId: info.messageId });
  } catch (error) {
    return jsonResponse(500, { error: 'Failed to send email', details: String(error && error.message || error) });
  }
};
