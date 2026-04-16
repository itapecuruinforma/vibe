// Supabase Storage helper
const SUPABASE_URL = "https://tdsisbsmdvzjotwqsn.supabase.co";
const ANON_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzc2MzgwNzcxLCJleHAiOjIwOTE3NDA3NzF9.j9W8pNSAydN0CmJxopeOvqNuHh1jEwuRSJQp_yuWXRs";
const BUCKET = "vibe";

export async function uploadFile(file, path, onProgress = null) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`;

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round(e.loaded / e.total * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 201) {
        resolve(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`);
      } else {
        reject(new Error(`Upload falhou: ${xhr.status} ${xhr.responseText}`));
      }
    };

    xhr.onerror = () => reject(new Error("Erro de rede no upload"));

    xhr.open("POST", url);
    xhr.setRequestHeader("Authorization", `Bearer ${ANON_JWT}`);
    xhr.setRequestHeader("x-upsert", "true");
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.send(file);
  });
}

export function getPublicUrl(path) {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

export function uniquePath(folder, filename) {
  const ext = filename.split('.').pop();
  return `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
}
