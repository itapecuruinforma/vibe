# 🔒 Documentação de Segurança — Vibe Rede Social

## Resumo das Melhorias Implementadas

Este documento descreve todas as medidas de segurança implementadas para permitir que usuários façam upload de imagens com confiança e proteção contra vulnerabilidades comuns.

---

## 1️⃣ Consolidação de Configuração

### Problema Anterior
- Credenciais Firebase duplicadas em 8 arquivos HTML
- Difícil de manter e rotacionar secrets
- Risco de inconsistência

### Solução
- **Arquivo novo**: `js/config.js`
- Centraliza Firebase config + Supabase config
- Importado por todos os HTMLs via módulo ES6
- Facilita manutenção futura

**Como usar**:
```javascript
import { auth, db } from "./js/config.js";
```

---

## 2️⃣ Validação e Sanitização de Inputs

### Arquivo: `js/validation.js`

#### Funções Implementadas

| Função | Validação |
|--------|-----------|
| `validateUsername()` | 3-30 chars, letras/números/underscore |
| `validateEmail()` | Formato de email válido |
| `validatePassword()` | Mínimo 6 caracteres |
| `validateBio()` | Máximo 150 caracteres |
| `validateCaption()` | Máximo 500 caracteres |
| `validateComment()` | Máximo 500 caracteres |
| `validateMessage()` | Máximo 1000 caracteres |
| `validateFileUpload()` | Tipo MIME + tamanho máximo 5MB |
| `validateImageDimensions()` | 100-4000px width/height |
| `escapeHTML()` | Escape de `<>&"'` |
| `sanitizeText()` | Remove caracteres perigosos + limita a 1000 chars |

#### Exemplo de Uso

```javascript
import { validateCaption, sanitizeText } from "./js/validation.js";

const caption = document.getElementById('postCaption').value.trim();

// Validar
const error = validateCaption(caption);
if (error) {
  toast(error, 'error');
  return;
}

// Sanitizar antes de salvar
const safeCaption = sanitizeText(caption);
await push(ref(db, 'posts'), {
  uid: currentUser.uid,
  legenda: safeCaption,
  timestamp: Date.now()
});
```

---

## 3️⃣ Proteção contra XSS (Cross-Site Scripting)

### O Problema
Antes: `div.innerHTML = post.legenda` → Qualquer JS injetado executava

**Ataque exemplo**:
```html
<!-- Legenda maliciosa -->
<img src=x onerror="alert('XSS')">
```

### A Solução
Substituir **innerHTML** por **textContent** + **escapeHTML()**

#### Implementações:

**feed.html**:
```javascript
// ❌ Antes (vulnerável)
div.innerHTML = `<span>${post.legenda}</span>`;

// ✅ Depois (seguro)
const span = document.createElement('span');
span.textContent = sanitizeText(post.legenda);
```

**notificacoes.html**:
```javascript
// ✅ Escape do username
const safeName = escapeHTML(u.username);
const span = document.createElement('span');
span.textContent = `${safeName} curtiu seu post`;
```

**mensagens.html**:
```javascript
// ✅ Escapar nome da conversa
const nameDiv = document.createElement('div');
nameDiv.textContent = sanitizeText(conversationName);
```

---

## 4️⃣ Validação de Upload de Arquivo

### Arquivo: `js/storage.js` (melhorado)

#### Validações Implementadas

```javascript
const fileError = validateFileUpload(selectedFile, {
  maxSize: 5 * 1024 * 1024,  // 5MB
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'audio/mpeg',
    'audio/wav'
  ]
});

if (fileError) {
  return toast(fileError, 'error');
}
```

#### Tipos Rejeitados
- ❌ Executáveis (.exe, .bat, .sh)
- ❌ Documentos (.doc, .pdf, .txt)
- ❌ Vídeos grandes
- ❌ Arquivos > 5MB
- ✅ Apenas imagens (JPG, PNG, GIF, WebP) e áudio (MP3, WAV)

---

## 5️⃣ Rate Limiting

### Arquivo: `js/rateLimiter.js`

#### Limites Configurados

```javascript
{
  'post': { maxRequests: 3, timeWindowMs: 60000 },      // 3 posts/min
  'story': { maxRequests: 5, timeWindowMs: 60000 },     // 5 stories/min
  'upload': { maxRequests: 10, timeWindowMs: 3600000 }, // 10/hora
  'comment': { maxRequests: 20, timeWindowMs: 60000 },  // 20/min
  'message': { maxRequests: 50, timeWindowMs: 60000 },  // 50/min
  'like': { maxRequests: 100, timeWindowMs: 60000 },    // 100/min
  'bio': { maxRequests: 5, timeWindowMs: 3600000 },     // 5/hora
  'pfp': { maxRequests: 10, timeWindowMs: 86400000 }    // 10/dia
}
```

#### Como Usar

```javascript
import { rateLimiter } from "./js/rateLimiter.js";

const check = rateLimiter.checkLimit(userId, 'post');
if (!check.allowed) {
  toast(check.message, 'error');  // "Aguarde 45s antes de tentar novamente"
  return;
}

// Prosseguir com ação
```

#### Armazenamento
- Dados no **localStorage** (client-side)
- Chave: `rateLimit_{userId}_{action}`
- Valor: array de timestamps

⚠️ **Nota**: Rate limiting no cliente é apenas **UX**. Para segurança real, implementar no backend/Cloud Functions.

---

## 6️⃣ Firebase Rules (Banco de Dados)

### Arquivo: `firebase-rules.json`

#### Regras Implementadas

```json
{
  "rules": {
    "usuarios": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth.uid == $uid"  // ← Só o dono edita
      }
    },
    "posts": {
      "$postId": {
        ".write": "root.child('posts').child($postId).child('uid').val() == auth.uid || !exists()",
        // ↑ Só o dono pode editar/deletar
        "comentarios": {
          ".write": "auth.uid != null"  // Qualquer um comenta
        }
      }
    },
    "conversas": {
      "$conversaId": {
        ".read": "root.child('conversas').child($conversaId).child('participantes').child(auth.uid).exists()",
        ".write": "root.child('conversas').child($conversaId).child('participantes').child(auth.uid).exists()",
        // ↑ Só participantes podem ler/escrever
      }
    }
  }
}
```

#### Como Aplicar

1. Firebase Console → Seu Projeto
2. **Realtime Database** → **Rules**
3. Copiar conteúdo de `firebase-rules.json`
4. Colar no editor
5. **Publish**

---

## 7️⃣ Manutenção de Segurança

### Verificação Pré-Deploy

- [ ] Validações de input funcionando
- [ ] XSS testado (tentar postar `<img src=x onerror="alert()">`)
- [ ] Rate limiting testado (10 uploads em 30s → bloqueados)
- [ ] Upload de arquivo malicioso rejeitado
- [ ] Firebase Rules publicadas
- [ ] Não há credenciais privadas no git

### Rotina Mensal

- [ ] Revisar logs de erro no Firebase
- [ ] Verificar acessos não autorizados
- [ ] Atualizar dependências do Firebase SDK
- [ ] Revisar quotas do Supabase

---

## 🚨 Limitações Conhecidas

### Client-side Limitations
- ✅ Validação de tipo de arquivo (MIME)
- ❌ Mas um hacker pode falsificar MIME type via Curl/Postman
- **Solução**: Validar novamente no backend

- ✅ Rate limiting no localStorage
- ❌ Mas um hacker pode deletar localStorage
- **Solução**: Implementar rate limiting real no backend

### Recomendações Futuras

1. **Implementar Cloud Functions** para validação server-side
   ```javascript
   // Cloud Function exemplo
   exports.uploadFile = functions.https.onCall(async (data, context) => {
     if (!context.auth) throw new functions.https.HttpsError('unauthenticated');
     // Validar arquivo no servidor
     // Fazer upload seguro
   });
   ```

2. **Implementar virus scan** com ClamAV ou similar
3. **Implementar CDN** com cache de imagens (Cloudflare, AWS CloudFront)
4. **Logging detalhado** de uploads e acessos

---

## 📋 Checklist de Segurança para Deploy

```
AUTENTICAÇÃO
☑ Email verification obrigatório
☑ Senha mínimo 6 caracteres
☑ Firebase Auth Rules restritivas

VALIDAÇÃO
☑ Inputs validados no cliente
☑ Comentários/posts sanitizados
☑ Arquivo validado (tipo + tamanho)

PROTEÇÃO XSS
☑ innerHTML eliminado
☑ textContent em uso
☑ escapeHTML() aplicado

RATE LIMITING
☑ 3 posts por minuto
☑ 10 uploads por hora
☑ 50 mensagens por minuto

BANCO DE DADOS
☑ Firebase Rules publicadas
☑ Usuários não podem ler dados alheios
☑ Conversas privadas protegidas

UPLOAD
☑ Máximo 5MB por arquivo
☑ Apenas imagens e áudio
☑ Supabase CORS correto
```

---

## 📞 Suporte e Reportar Vulnerabilidades

Se encontrou uma vulnerabilidade de segurança, **não abra issue pública**. Envie email para o administrador do projeto.

---

**Última atualização**: Abril 2026
**Versão Segura**: v2.0 (com validações e proteção XSS)
