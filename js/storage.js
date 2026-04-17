// ============================================
// SUPABASE STORAGE HELPER - COM VALIDAÇÕES
// ============================================

import { SUPABASE_CONFIG } from "./config.js";
import { validateFileUpload, validateImageDimensions } from "./validation.js";

const SUPABASE_URL = SUPABASE_CONFIG.url;
const ANON_JWT = SUPABASE_CONFIG.anonKey;
const BUCKET = SUPABASE_CONFIG.bucket;

/**
 * Faz upload de arquivo para Supabase Storage com validações
 * @param {File} file - Arquivo a fazer upload
 * @param {string} path - Caminho no storage (ex: posts/user123/file)
 * @param {Object} options - Opções de validação
 * @param {Function} onProgress - Callback de progresso (0-100)
 * @returns {Promise<string>} URL pública do arquivo
 */
export async function uploadFile(file, path, options = {}, onProgress = null) {
  // Validações
  const validation = validateFileUpload(file, options);
  if (validation) {
    return Promise.reject(new Error(validation));
  }

  // Validar dimensões se for imagem
  if (file.type.startsWith('image/')) {
    try {
      const dimensionError = await validateImageDimensions(file);
      if (dimensionError) {
        return Promise.reject(new Error(dimensionError));
      }
    } catch (e) {
      // Se falhar validação de dimensão, mas o arquivo é válido, continua
      console.warn('Aviso na validação de dimensões:', e);
    }
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`;

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = Math.round(e.loaded / e.total * 100);
        onProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 201) {
        const publicUrl = getPublicUrl(path);
        resolve(publicUrl);
      } else {
        let errorMsg = `Upload falhou: ${xhr.status}`;
        try {
          const errorData = JSON.parse(xhr.responseText);
          errorMsg += ` - ${errorData.message || xhr.responseText}`;
        } catch {
          errorMsg += ` - ${xhr.responseText || 'Erro desconhecido'}`;
        }
        reject(new Error(errorMsg));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Erro de rede no upload"));
    };

    xhr.ontimeout = () => {
      reject(new Error("Upload expirou - tente novamente"));
    };

    xhr.timeout = 30000; // 30 segundos

    xhr.open("PUT", url);
    xhr.setRequestHeader("Authorization", `Bearer ${ANON_JWT}`);
    xhr.setRequestHeader("x-upsert", "true");
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

    xhr.send(file);
  });
}

/**
 * Obtem URL pública de um arquivo
 * @param {string} path - Caminho do arquivo no storage
 * @returns {string} URL pública
 */
export function getPublicUrl(path) {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

/**
 * Gera um caminho único para um arquivo
 * @param {string} folder - Pasta de destino
 * @param {string} filename - Nome do arquivo
 * @returns {string} Caminho único (pasta/timestamp_random.ext)
 */
export function uniquePath(folder, filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 10);
  return `${folder}/${timestamp}_${random}.${ext}`;
}

/**
 * Remove arquivo do Supabase Storage
 * Nota: Requer implementação no backend por segurança
 * @param {string} path - Caminho do arquivo
 * @returns {Promise}
 */
export async function deleteFile(path) {
  // TODO: Implementar via Cloud Function ou backend
  // Para segurança, não usar client-side JWT para deletar
  console.warn('Deleção de arquivo deve ser feita via backend');
  return Promise.reject(new Error('Operação não disponível'));
}
