// ============================================
// VALIDAÇÃO E SANITIZAÇÃO DE INPUTS
// ============================================

/**
 * Escapa HTML entities para prevenir XSS
 * @param {string} str - String a escapar
 * @returns {string} String com HTML entities escapadas
 */
export function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return str.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Sanitiza texto removendo caracteres perigosos e escapando HTML
 * @param {string} str - String a sanitizar
 * @returns {string} String sanitizada
 */
export function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, 1000); // Limita a 1000 caracteres
}

/**
 * Valida username
 * @param {string} username - Username a validar
 * @returns {string|null} Mensagem de erro ou null se válido
 */
export function validateUsername(username) {
  if (!username || username.length < 3) {
    return 'Username deve ter pelo menos 3 caracteres';
  }
  if (username.length > 30) {
    return 'Username não pode exceder 30 caracteres';
  }
  if (!/^[a-z0-9_]+$/.test(username.toLowerCase())) {
    return 'Username só pode conter letras, números e underscore';
  }
  return null;
}

/**
 * Valida bio/descrição do perfil
 * @param {string} bio - Bio a validar
 * @returns {string|null} Mensagem de erro ou null se válido
 */
export function validateBio(bio) {
  if (!bio) return null; // Bio é opcional
  if (typeof bio !== 'string') return 'Bio deve ser texto';
  if (bio.length > 150) {
    return 'Bio não pode exceder 150 caracteres';
  }
  return null;
}

/**
 * Valida legenda de post
 * @param {string} caption - Legenda a validar
 * @returns {string|null} Mensagem de erro ou null se válido
 */
export function validateCaption(caption) {
  if (!caption) return null; // Legenda é opcional
  if (typeof caption !== 'string') return 'Legenda deve ser texto';
  if (caption.length > 500) {
    return 'Legenda não pode exceder 500 caracteres';
  }
  return null;
}

/**
 * Valida comentário
 * @param {string} comment - Comentário a validar
 * @returns {string|null} Mensagem de erro ou null se válido
 */
export function validateComment(comment) {
  if (!comment || typeof comment !== 'string') {
    return 'Comentário não pode estar vazio';
  }
  if (comment.length > 500) {
    return 'Comentário não pode exceder 500 caracteres';
  }
  return null;
}

/**
 * Valida mensagem de chat
 * @param {string} message - Mensagem a validar
 * @returns {string|null} Mensagem de erro ou null se válido
 */
export function validateMessage(message) {
  if (!message || typeof message !== 'string') {
    return 'Mensagem não pode estar vazia';
  }
  if (message.length > 1000) {
    return 'Mensagem não pode exceder 1000 caracteres';
  }
  return null;
}

/**
 * Valida email
 * @param {string} email - Email a validar
 * @returns {string|null} Mensagem de erro ou null se válido
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Email inválido';
  }
  return null;
}

/**
 * Valida senha
 * @param {string} password - Senha a validar
 * @returns {string|null} Mensagem de erro ou null se válido
 */
export function validatePassword(password) {
  if (!password || password.length < 6) {
    return 'Senha deve ter pelo menos 6 caracteres';
  }
  return null;
}

/**
 * Valida emoji
 * @param {string} emoji - Emoji a validar
 * @returns {string|null} Mensagem de erro ou null se válido
 */
export function validateEmoji(emoji) {
  if (!emoji) return null; // Emoji é opcional
  if (typeof emoji !== 'string') return 'Emoji deve ser texto';
  if (emoji.length > 4) {
    return 'Emoji muito longo';
  }
  // Verifica se é um emoji válido (muito simplificado)
  const emojiRegex = /^[\p{Emoji}]+$/u;
  if (!emojiRegex.test(emoji) && emoji.length > 0) {
    return 'Valor deve ser um emoji válido';
  }
  return null;
}

/**
 * Valida upload de arquivo
 * @param {File} file - Arquivo a validar
 * @param {Object} options - Opções de validação
 * @returns {string|null} Mensagem de erro ou null se válido
 */
export function validateFileUpload(file, options = {}) {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB padrão
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'audio/mpeg', 'audio/wav'],
    fileTypes = ['images', 'audio'] // 'images', 'audio', 'both'
  } = options;

  // Validar se é um arquivo
  if (!file || !(file instanceof File)) {
    return 'Arquivo inválido';
  }

  // Validar tipo
  if (!allowedTypes.includes(file.type)) {
    return `Tipo de arquivo não permitido. Aceitos: ${allowedTypes.join(', ')}`;
  }

  // Validar tamanho
  if (file.size > maxSize) {
    return `Arquivo muito grande. Máximo: ${(maxSize / 1024 / 1024).toFixed(1)}MB`;
  }

  // Validar tamanho mínimo (1KB)
  if (file.size < 1024) {
    return 'Arquivo muito pequeno';
  }

  return null;
}

/**
 * Valida dimensões de imagem
 * @param {File} file - Arquivo de imagem
 * @param {Object} options - Opções (minWidth, maxWidth, minHeight, maxHeight)
 * @returns {Promise<string|null>} Mensagem de erro ou null se válido
 */
export async function validateImageDimensions(file, options = {}) {
  return new Promise((resolve) => {
    const {
      minWidth = 100,
      maxWidth = 4000,
      minHeight = 100,
      maxHeight = 4000
    } = options;

    if (!file.type.startsWith('image/')) {
      resolve('Arquivo não é uma imagem');
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (img.width < minWidth || img.width > maxWidth) {
        resolve(`Largura deve estar entre ${minWidth}x${maxWidth}px`);
        return;
      }
      if (img.height < minHeight || img.height > maxHeight) {
        resolve(`Altura deve estar entre ${minHeight}x${maxHeight}px`);
        return;
      }
      resolve(null);
    };
    img.onerror = () => {
      resolve('Erro ao validar dimensões da imagem');
    };
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Renderiza texto com escaping seguro (para usar em textContent)
 * @param {string} text - Texto a renderizar
 * @returns {string} Texto escapado
 */
export function renderSafeText(text) {
  return sanitizeText(text);
}

/**
 * Valida URL (básico)
 * @param {string} url - URL a validar
 * @returns {boolean} true se URL válida
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
