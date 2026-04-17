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

    xhr.timeout = 30000;

    xhr.open("POST", url);
    xhr.setRequestHeader("apikey", ANON_JWT);
    xhr.setRequestHeader("Authorization", `Bearer ${ANON_JWT}`);
    xhr.setRequestHeader("x-upsert", "true");
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

    xhr.send(file);
  });
}

/**
 * Obtem URL pública de um arquivo
 */
export function getPublicUrl(path) {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

/**
 * Gera um caminho único para um arquivo
 */
export function uniquePath(folder, filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 10);
  return `${folder}/${timestamp}_${random}.${ext}`;
}

/**
 * Remove arquivo do Supabase Storage (deve ser feito via backend)
 */
export async function deleteFile(path) {
  console.warn('Deleção de arquivo deve ser feita via backend');
  return Promise.reject(new Error('Operação não disponível'));
}
