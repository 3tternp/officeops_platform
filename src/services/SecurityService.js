const SecurityService = {
  getSettings() {
    try {
      const raw = localStorage.getItem('securitySettings') || '{}';
      const parsed = JSON.parse(raw);
      return {
        twoFactorRequired: !!parsed.twoFactorRequired,
        mfaMethod: parsed.mfaMethod || 'email',
        otpTTLSeconds: typeof parsed.otpTTLSeconds === 'number' ? parsed.otpTTLSeconds : 300,
      };
    } catch (e) {
      return { twoFactorRequired: false, mfaMethod: 'email', otpTTLSeconds: 300 };
    }
  },

  setSettings(settings) {
    const prev = this.getSettings();
    const merged = { ...prev, ...(settings || {}) };
    localStorage.setItem('securitySettings', JSON.stringify(merged));
    return merged;
  },
};

export default SecurityService;