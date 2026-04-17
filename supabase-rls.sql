-- ============================================
-- SUPABASE RLS (Row Level Security) — Vibe
-- ============================================
-- Rodar no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/tdsisbsmdvzjotzuwqsn/sql
-- ============================================


-- ===============================================
-- 1. BUCKET "vibe" — policies de storage
-- ===============================================
-- Regras:
--   - Qualquer um pode LER (get) arquivos (posts/fotos são públicas)
--   - Só usuários autenticados podem FAZER UPLOAD (insert)
--   - Só o DONO do arquivo pode DELETAR (update/delete)
--   - O "owner" é inferido pelo path: uid/{auth.uid}/...

-- Remove policies antigas se existirem (idempotente)
DROP POLICY IF EXISTS "vibe_public_read"    ON storage.objects;
DROP POLICY IF EXISTS "vibe_auth_insert"    ON storage.objects;
DROP POLICY IF EXISTS "vibe_owner_update"   ON storage.objects;
DROP POLICY IF EXISTS "vibe_owner_delete"   ON storage.objects;


-- Leitura pública (necessário pra exibir imagens sem auth)
CREATE POLICY "vibe_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vibe');


-- Upload: só autenticado, e tamanho máx 20MB
CREATE POLICY "vibe_auth_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'vibe'
    AND auth.role() = 'authenticated'
    AND (metadata->>'size')::bigint < 20971520   -- 20 MB
  );


-- Update: só o owner do arquivo (owner_id é text no Supabase novo, precisa cast)
CREATE POLICY "vibe_owner_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'vibe' AND auth.uid()::text = owner_id)
  WITH CHECK (bucket_id = 'vibe' AND auth.uid()::text = owner_id);


-- Delete: só o owner
CREATE POLICY "vibe_owner_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'vibe' AND auth.uid()::text = owner_id);



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
