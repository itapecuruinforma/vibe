-- ============================================
-- SUPABASE RLS (Row Level Security) — Vibe
-- ============================================
-- Rodar no SQL Editor do projeto Supabase da Vibe (conta própria, separada do ACNET):
-- Dashboard -> SQL Editor -> cole tudo e clique em Run.
-- Pré-requisito: criar antes um bucket chamado "vibe" em Storage.
-- ============================================


-- ===============================================
-- 1. BUCKET "vibe" — policies de storage
-- ===============================================
-- IMPORTANTE sobre o modelo de auth da Vibe:
--   Os usuários da Vibe autenticam no FIREBASE, não no Supabase. O upload
--   (js/storage.js) usa apenas a chave anônima (anon/publishable). Portanto a
--   policy de INSERT precisa permitir o papel anônimo — NÃO exigir 'authenticated'
--   (senão todo upload volta 403). A proteção real fica no bucket:
--   file_size_limit + allowed_mime_types (seção 2).
--
-- Regras:
--   - Qualquer um pode LER (get) arquivos (posts/fotos são públicas)
--   - Qualquer um pode FAZER UPLOAD (insert) no bucket vibe (limitado por tipo/tamanho)

-- Remove policies antigas se existirem (idempotente)
DROP POLICY IF EXISTS "vibe_public_read"    ON storage.objects;
DROP POLICY IF EXISTS "vibe_auth_insert"    ON storage.objects;
DROP POLICY IF EXISTS "vibe_public_insert"  ON storage.objects;
DROP POLICY IF EXISTS "vibe_owner_update"   ON storage.objects;
DROP POLICY IF EXISTS "vibe_owner_delete"   ON storage.objects;


-- Leitura pública (necessário pra exibir imagens sem auth)
CREATE POLICY "vibe_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vibe');


-- Upload: liberado no bucket vibe (auth real é feita no Firebase).
-- A restrição de tipo/tamanho vem da config do bucket (seção 2).
CREATE POLICY "vibe_public_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'vibe');



-- ===============================================
-- 2. CONFIGURAÇÃO DO BUCKET
-- ===============================================
-- Dar UPDATE no bucket pra limitar tipos MIME permitidos
-- (prevenção contra upload de .exe disfarçado)

UPDATE storage.buckets
SET
  public = true,
  file_size_limit = 20971520,   -- 20MB
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'audio/mpeg',
    'audio/wav',
    'audio/webm',
    'audio/ogg'
  ]
WHERE id = 'vibe';


-- ===============================================
-- 3. VERIFICAÇÃO
-- ===============================================
-- Rodar pra conferir que as policies foram criadas:

SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage'
  AND policyname LIKE 'vibe_%';


-- Rodar pra conferir a config do bucket:
SELECT id, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE id = 'vibe';
