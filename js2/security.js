/**
 * SECURITY.JS - Funções de Segurança para Minecraft Início
 * Versão: 1.0.0
 * Data: 27 de Janeiro de 2026
 * 
 * Este arquivo contém funções essenciais de segurança:
 * - Sanitização de HTML
 * - Validação de entrada
 * - Proteção contra XSS
 * - Rate limiting
 */

/**
 * Sanitiza HTML usando DOMPurify
 * @param {string} html - HTML a sanitizar
 * @returns {string} HTML sanitizado
 */
function sanitizeHTML(html) {
  if (typeof DOMPurify === 'undefined') {
    console.error('DOMPurify não está carregado');
    return '';
  }
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'span'],
    ALLOWED_ATTR: ['href', 'title', 'target'],
    KEEP_CONTENT: true
  });
}

/**
 * Define innerHTML de forma segura
 * @param {HTMLElement} element - Elemento DOM
 * @param {string} html - HTML a inserir
 */
function setSafeInnerHTML(element, html) {
  if (!element) return;
  element.innerHTML = sanitizeHTML(html);
}

/**
 * Define textContent de forma segura (sem HTML)
 * @param {HTMLElement} element - Elemento DOM
 * @param {string} text - Texto a inserir
 */
function setSafeTextContent(element, text) {
  if (!element) return;
  element.textContent = String(text).trim();
}

/**
 * Valida nick do Minecraft
 * @param {string} nick - Nick a validar
 * @returns {boolean} True se válido
 */
function validateMinecraftNick(nick) {
  if (typeof nick !== 'string') return false;
  
  if (nick.length < 3 || nick.length > 16) return false;
  
  const regex = /^[a-zA-Z0-9_]+$/;
  return regex.test(nick);
}

/**
 * Valida URL
 * @param {string} url - URL a validar
 * @returns {boolean} True se válida
 */
function validateURL(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Valida email
 * @param {string} email - Email a validar
 * @returns {boolean} True se válido
 */
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida arquivo (tipo e tamanho)
 * @param {File} file - Arquivo a validar
 * @param {Array} allowedTypes - Tipos MIME permitidos
 * @param {number} maxSize - Tamanho máximo em bytes
 * @returns {object} {valid: boolean, error: string}
 */
function validateFile(file, allowedTypes = [], maxSize = 5242880) {
  if (!file) return { valid: false, error: 'Nenhum arquivo selecionado' };
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { valid: false, error: `Tipo de arquivo não permitido. Permitidos: ${allowedTypes.join(', ')}` };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: `Arquivo muito grande. Máximo: ${(maxSize / 1024 / 1024).toFixed(2)}MB` };
  }
  
  return { valid: true };
}

/**
 * Escapa caracteres especiais para evitar injeção
 * @param {string} str - String a escapar
 * @returns {string} String escapada
 */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}


/**
 * Remove scripts e eventos perigosos
 * @param {string} str - String a limpar
 * @returns {string} String limpa
 */
function removeScripts(str) {
  if (typeof str !== 'string') return '';
  
  str = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  str = str.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  str = str.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');
  
  return str;
}

/**
 * Valida e limpa entrada de usuário
 * @param {string} input - Entrada do usuário
 * @param {number} maxLength - Comprimento máximo
 * @returns {string} Entrada limpa
 */
function sanitizeUserInput(input, maxLength = 255) {
  if (typeof input !== 'string') return '';
  
  input = input.substring(0, maxLength);
  
  input = removeScripts(input);
  
  input = escapeHTML(input);
  
  input = input.trim();
  
  return input;
}


class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }
  
  isAllowed() {
    const now = Date.now();
    
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }
  
  reset() {
    this.requests = [];
  }
}


/**
 * Log de evento de segurança
 * @param {string} event - Tipo de evento
 * @param {object} data - Dados do evento
 */
function logSecurityEvent(event, data = {}) {
  const timestamp = new Date().toISOString();
  const log = {
    timestamp,
    event,
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...data
  };
  
  console.warn('[SECURITY]', log);
  
  if (window.location.hostname !== 'localhost') {
  }
}

/**
 * Detecta tentativa de XSS
 * @param {string} input - Entrada a verificar
 * @returns {boolean} True se suspeita de XSS
 */
function detectXSSAttempt(input) {
  if (typeof input !== 'string') return false;
  
  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /eval\(/i,
    /expression\(/i
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
}


/**
 * Criptografa dados simples (Base64)
 * @param {string} data - Dados a criptografar
 * @returns {string} Dados criptografados
 */
function encodeData(data) {
  return btoa(unescape(encodeURIComponent(data)));
}

/**
 * Descriptografa dados (Base64)
 * @param {string} data - Dados a descriptografar
 * @returns {string} Dados descriptografados
 */
function decodeData(data) {
  try {
    return decodeURIComponent(escape(atob(data)));
  } catch (e) {
    console.error('Erro ao descriptografar dados');
    return '';
  }
}

/**
 * Remove dados sensíveis de logs
 * @param {object} obj - Objeto a limpar
 * @returns {object} Objeto sem dados sensíveis
 */
function removeSensitiveData(obj) {
  const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'creditCard'];
  const cleaned = { ...obj };
  
  sensitiveKeys.forEach(key => {
    if (key in cleaned) {
      cleaned[key] = '***REDACTED***';
    }
  });
  
  return cleaned;
}

document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ Security.js carregado com sucesso');
  
  if (typeof DOMPurify === 'undefined') {
    console.warn('⚠️ DOMPurify não está carregado. Sanitização de HTML desabilitada.');
  }
  
  if (typeof jQuery !== 'undefined') {
    console.log('✅ jQuery ' + jQuery.fn.jquery + ' carregado');
  }
});

window.Security = {
  sanitizeHTML,
  setSafeInnerHTML,
  setSafeTextContent,
  validateMinecraftNick,
  validateURL,
  validateEmail,
  validateFile,
  escapeHTML,
  removeScripts,
  sanitizeUserInput,
  RateLimiter,
  logSecurityEvent,
  detectXSSAttempt,
  encodeData,
  decodeData,
  removeSensitiveData
};
