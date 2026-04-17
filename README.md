# 🔮 Vibe — Rede Social

Projeto de rede social completo com Firebase, com **segurança robusta** para uploads de imagens, validação de inputs e proteção contra XSS.

## 📁 Arquivos

| Arquivo | Função |
|---|---|
| `index.html` | Login / Cadastro |
| `feed.html` | Feed principal + Stories |
| `perfil.html` | Perfil público / editar |
| `buscar.html` | Busca de usuários |
| `notificacoes.html` | Notificações |
| `mensagens.html` | Lista de conversas |
| `chat.html` | Chat (texto, áudio, imagem) |
| `verificacao.html` | Tela de verificação de email |
| `css/global.css` | CSS global |

## ⚙️ Configuração no Firebase Console

Antes de testar, configure as **Regras do Realtime Database**:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

E as **Regras do Storage**:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🗄️ Estrutura do Banco

```
usuarios/{uid}
  username, emoji, bio, fotoPerfil, criadoEm
  seguidores/{uid}: true
  seguindo/{uid}: true

usernames/{username}: uid  ← para checar unicidade

posts/{postId}
  uid, imagemUrl, legenda, timestamp
  curtidas/{uid}: true
  comentarios/{id}: { uid, texto, timestamp }

stories/{storyId}
  uid, imagemUrl, timestamp
  visto/{uid}: true

conversas/{conversaId}
  tipo: "privado" | "grupo"
  nomeGrupo (grupos)
  participantes/{uid}: true (grupos)
  mensagens/{id}: { uid, texto/audioUrl/imagemUrl, timestamp }

notificacoes/{uid}/{id}
  tipo: "curtida" | "comentario" | "seguiu"
  de: uid
  postId (se aplicável)
  timestamp, lida
```

## ✅ Features implementadas

- 🔐 Auth completo (login, cadastro, verificação de email)
- 📸 Feed com posts + upload de imagem
- 📖 Stories (somem em 24h, barra de progresso, marcar como visto)
- ❤️ Curtidas com toggle
- 💬 Comentários em tempo real
- 👤 Perfil público (foto, bio, stats, grid de posts, curtidas)
- 👥 Seguir / deixar de seguir
- 🔔 Notificações (curtida, comentário, seguiu)
- 💌 Chat privado com texto, áudio e imagem
- 🔍 Busca de usuários
- 📲 Layout mobile-first responsivo

## 🚀 Como rodar

Basta abrir `index.html` em um servidor local (Live Server do VSCode funciona perfeitamente).

**Não abrir como arquivo:// — o Firebase requer servidor HTTP.**

---

## 🔒 SEGURANÇA — Melhorias Implementadas

### ✅ Consolidação de Credenciais
- Novo arquivo `js/config.js` centraliza todas as credenciais Firebase e Supabase
- Elimina duplicação em múltiplos HTMLs
- Facilita rotação de secrets no futuro

### ✅ Validação e Sanitização de Inputs
- Novo arquivo `js/validation.js` com funções de validação:
  - `validateCaption()` — legenda de posts (máx 500 caracteres)
  - `validateComment()` — comentários (máx 500 caracteres)
  - `validateMessage()` — mensagens de chat (máx 1000 caracteres)
  - `validateBio()` — bio do perfil (máx 150 caracteres)
  - `validateFileUpload()` — validação de tipo e tamanho de arquivo (máx 5MB)
  - `escapeHTML()` — escape de HTML entities para prevenir XSS
  - `sanitizeText()` — sanitização de texto removendo perigosas

### ✅ Proteção contra XSS (Cross-Site Scripting)
- Substituição de `innerHTML` por `textContent` em todos os pontos de renderização de dados do usuário
- Escaping de HTML entities em comentários, legendas, mensagens, bio, username
- Arquivos atualizados:
  - `feed.html` — posts, comentários, legendas
  - `perfil.html` — bio, nome, emoji
  - `chat.html` — mensagens de texto
  - `buscar.html` — usernames, bios
  - `notificacoes.html` — nomes em notificações
  - `mensagens.html` — nomes de conversas, preview de mensagens

### ✅ Validação de Upload de Arquivo
- Validação de **tipo MIME** — apenas imagens (JPEG, PNG, GIF, WebP) e áudio (MP3, WAV)
- Validação de **tamanho** — máximo 5MB por arquivo
- Validação de **dimensões de imagem** — entre 100x100 e 4000x4000 pixels
- Mensagens de erro detalhadas ao usuário

### ✅ Rate Limiting (Proteção contra Spam)
- Novo arquivo `js/rateLimiter.js` com controle de requisições por usuário
- Limites implementados:
  - **Posts**: 3 por minuto
  - **Stories**: 5 por minuto
  - **Uploads**: 10 por hora
  - **Comentários**: 20 por minuto
  - **Mensagens**: 50 por minuto
  - **Curtidas**: 100 por minuto
  - **Edição de bio**: 5 por hora
  - **Mudança de foto**: 10 por dia
- Feedback ao usuário com tempo de espera
- Armazenado em localStorage (clientside) + NECESSÁRIO implementar no backend para segurança real

### ✅ Melhorias no Storage.js
- Importa função de validação de arquivo
- Valida MIME type e tamanho antes do upload
- Headers de segurança (x-upsert)
- Error handling robusto com mensagens descritivas
- Timeout de 30 segundos no upload

### ✅ Exemplo Firebase Rules (Segurança do Banco)
- Arquivo `firebase-rules.json` fornecido como exemplo
- **IMPORTANTE**: Copiar e aplicar as rules no Firebase Console
- Rules incluem:
  - Cada usuário só lê seus próprios dados
  - Cada usuário só escreve em seus próprios dados
  - Posts: só o dono pode deletar
  - Conversas: só participantes podem ler/escrever
  - Notificações: só o proprietário pode ler

---

## 🛠️ Como Aplicar as Firebase Rules

1. Abra [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá para **Realtime Database** → **Rules**
4. Copie todo o conteúdo de `firebase-rules.json`
5. Cole nas rules do Firebase Console
6. Clique em **Publish**

```json
// Exemplo — não copie daqui, use firebase-rules.json
{
  "rules": {
    "usuarios": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth.uid == $uid"
      }
    }
  }
}
```

---

## ⚠️ Nota sobre Credenciais

As credenciais do Firebase (API Key) **são feitas para serem públicas** no client-side. Isso é normal e seguro para aplicações web, pois o real protection vem das **Firebase Rules** que restrictem quem pode ler/escrever cada dado.

Nunca compartilhe o arquivo `.env` ou credenciais privadas (private keys do service account).
