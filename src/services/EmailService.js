const EmailService = {
  getSettings() {
    try {
      const raw = localStorage.getItem('emailSettings') || '{}';
      const parsed = JSON.parse(raw);
      return {
        allowedDomains: Array.isArray(parsed.allowedDomains) ? parsed.allowedDomains : [],
        defaultFromName: parsed.defaultFromName || 'OfficeOps',
      };
    } catch (e) {
      return { allowedDomains: [], defaultFromName: 'OfficeOps' };
    }
  },

  setSettings(settings) {
    const merged = { ...this.getSettings(), ...(settings || {}) };
    localStorage.setItem('emailSettings', JSON.stringify(merged));
    return merged;
  },

  async sendEmail({ to, subject, html, text, replyTo }) {
    const res = await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, html, text, replyTo }),
    });

    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(body.error || 'Failed to send email');
    }
    return body;
  },

  async sendTest(to) {
    return this.sendEmail({
      to,
      subject: 'SMTP Test - OfficeOps',
      text: 'This is a test email from OfficeOps SMTP integration.',
    });
  },

  async sendRegistrationWelcome({ to, name }) {
    const subject = 'Welcome to OfficeOps';
    const html = `<p>Hello ${name || ''},</p><p>Your account has been created successfully.</p>`;
    return this.sendEmail({ to, subject, html });
  },
};

export default EmailService;