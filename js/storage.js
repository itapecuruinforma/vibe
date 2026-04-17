// ============================================
// FIREBASE STORAGE HELPER - COM VALIDAÇÕES
// ============================================

import { storage } from "./config.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";
import { validateFileUpload, validateImageDimensions } from "./validation.js";

/**
 * Faz upload de arquivo para Firebase Storage com validações
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

  try {
    // Criar referência do arquivo
    const fileRef = ref(storage, path);

    // Fazer upload
    const snapshot = await uploadBytes(fileRef, file);

    // Obter URL pública
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return downloadUrl;
  } catch (error) {
    console.error('Erro no upload:', error);
    throw new Error(`Upload falhou: ${error.message}`);
  }
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
 * Remove arquivo do Firebase Storage
 * Nota: Requer implementação segura via Cloud Functions
 * @param {string} path - Caminho do arquivo
 * @returns {Promise}
 */
export async function deleteFile(path) {
  // TODO: Implementar via Cloud Function ou backend
  // Para segurança, não usar client-side JWT para deletar
  console.warn('Deleção de arquivo deve ser feita via backend');
  return Promise.reject(new Error('Operação não disponível'));
}
