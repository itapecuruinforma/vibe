// ============================================
// RATE LIMITER — Proteção contra spam
// ============================================

/**
 * Classe para gerenciar rate limiting por usuário
 */
class RateLimiter {
  constructor() {
    this.limits = {
      // Chave: ação, valor: { maxRequests, timeWindowMs }
      'post': { maxRequests: 3, timeWindowMs: 60000 }, // 3 posts por minuto
      'story': { maxRequests: 5, timeWindowMs: 60000 }, // 5 stories por minuto
      'upload': { maxRequests: 10, timeWindowMs: 3600000 }, // 10 uploads por hora
      'comment': { maxRequests: 20, timeWindowMs: 60000 }, // 20 comentários por minuto
      'message': { maxRequests: 50, timeWindowMs: 60000 }, // 50 mensagens por minuto
      'like': { maxRequests: 100, timeWindowMs: 60000 }, // 100 curtidas por minuto
      'bio': { maxRequests: 5, timeWindowMs: 3600000 }, // 5 edições de bio por hora
      'pfp': { maxRequests: 10, timeWindowMs: 86400000 } // 10 mudanças de foto por dia
    };
  }

  /**
   * Checa se uma ação pode ser executada
   * @param {string} userId - ID do usuário
   * @param {string} action - Tipo de ação (post, comment, etc)
   * @returns {Object} { allowed: boolean, retryAfter: number (ms), message: string }
   */
  checkLimit(userId, action) {
    const limit = this.limits[action];
    if (!limit) {
      console.warn(`Rate limit não definido para ação: ${action}`);
      return { allowed: true, retryAfter: 0, message: '' };
    }

    const storageKey = `rateLimit_${userId}_${action}`;
    const now = Date.now();
    let timestamps = this.getTimestamps(storageKey);

    // Remove timestamps expirados
    timestamps = timestamps.filter(ts => now - ts < limit.timeWindowMs);

    // Checa se limite foi excedido
    if (timestamps.length >= limit.maxRequests) {
      const oldestTimestamp = timestamps[0];
      const retryAfter = Math.ceil((oldestTimestamp + limit.timeWindowMs - now) / 1000);
      return {
        allowed: false,
        retryAfter,
        message: `Aguarde ${retryAfter}s antes de tentar novamente`
      };
    }

    // Registra novo timestamp
    timestamps.push(now);
    localStorage.setItem(storageKey, JSON.stringify(timestamps));

    return { allowed: true, retryAfter: 0, message: '' };
  }

  /**
   * Obtem timestamps armazenados
   * @private
   */
  getTimestamps(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Reseta o rate limit para uma ação
   */
  reset(userId, action) {
    const storageKey = `rateLimit_${userId}_${action}`;
    localStorage.removeItem(storageKey);
  }

  /**
   * Reseta todos os rate limits de um usuário
   */
  resetUser(userId) {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(`rateLimit_${userId}_`)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Configura limites customizados
   */
  setLimit(action, maxRequests, timeWindowMs) {
    this.limits[action] = { maxRequests, timeWindowMs };
  }

  /**
   * Obtem info sobre uma ação rate-limited
   */
  getInfo(userId, action) {
    const limit = this.limits[action];
    if (!limit) return null;

    const storageKey = `rateLimit_${userId}_${action}`;
    const now = Date.now();
    let timestamps = this.getTimestamps(storageKey);

    // Remove timestamps expirados
    timestamps = timestamps.filter(ts => now - ts < limit.timeWindowMs);

    return {
      action,
      used: timestamps.length,
      limit: limit.maxRequests,
      percentUsed: Math.round((timestamps.length / limit.maxRequests) * 100),
      resetAt: timestamps.length > 0 ? new Date(timestamps[0] + limit.timeWindowMs) : null
    };
  }
}

// Instância global do rate limiter
const rateLimiter = new RateLimiter();

export { rateLimiter, RateLimiter };
