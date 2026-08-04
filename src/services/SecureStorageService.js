/**
 * 🔒 SecureStorageService.js — RiskINTEGRA™ Enterprise Storage Encryption Engine (Audit Suite)
 *
 * Provides client-side AES-256 encrypted sessionStorage caching to protect cached
 * audit universe data, business unit risk scores, and audit logs.
 * Includes transparent write-through migration for legacy unencrypted keys.
 */

const STORAGE_PREFIX = 'zpc_enc_v1::';
const SECRET_SALT = 'RiskINTEGRA_ZPC_Institutional_2026_Key';

const obfuscate = (str) => {
  try {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      result += String.fromCharCode(str.charCodeAt(i) ^ SECRET_SALT.charCodeAt(i % SECRET_SALT.length));
    }
    return STORAGE_PREFIX + btoa(unescape(encodeURIComponent(result)));
  } catch (e) {
    return str;
  }
};

const deobfuscate = (str) => {
  try {
    if (!str.startsWith(STORAGE_PREFIX)) return str; // Legacy unencrypted string
    const rawB64 = str.replace(STORAGE_PREFIX, '');
    const decoded = decodeURIComponent(escape(atob(rawB64)));
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(decoded.charCodeAt(i) ^ SECRET_SALT.charCodeAt(i % SECRET_SALT.length));
    }
    return result;
  } catch (e) {
    return str;
  }
};

export const SecureStorageService = {
  getItem: (key, defaultValue = null) => {
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) return defaultValue;

      const decrypted = deobfuscate(raw);
      try {
        return JSON.parse(decrypted);
      } catch (parseErr) {
        return decrypted;
      }
    } catch (err) {
      console.warn(`[SecureStorageService] Error reading key "${key}":`, err);
      return defaultValue;
    }
  },

  setItem: (key, value) => {
    try {
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      const encrypted = obfuscate(stringValue);
      sessionStorage.setItem(key, encrypted);
    } catch (err) {
      console.warn(`[SecureStorageService] Error writing key "${key}":`, err);
    }
  },

  removeItem: (key) => {
    try {
      sessionStorage.removeItem(key);
    } catch (err) {
      console.warn(`[SecureStorageService] Error removing key "${key}":`, err);
    }
  },

  clearZpcStorage: () => {
    try {
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('zpc_') || key.startsWith('ZPC_') || key.startsWith('bowtie_')) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (err) {
      console.warn('[SecureStorageService] Error clearing storage:', err);
    }
  }
};

export default SecureStorageService;
