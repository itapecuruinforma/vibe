# 🔮 Vibe — Rede Social

Projeto de rede social completo com Firebase.

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
