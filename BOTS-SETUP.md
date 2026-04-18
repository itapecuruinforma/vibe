# 🤖 Setup dos 10 Bots da Vibe

## 📌 Resumo do problema que isso resolve

Antes: todos os bots usavam o **mesmo login Firebase** → mesma UID → novos posts apareciam com o nome do último bot que rodou, e o campo `ultimoPostDia` era compartilhado, bloqueando os outros.

Agora: **cada bot tem seu próprio login Firebase** → UID diferente → perfil único → posts históricos preservados.

---

## 📋 Passo 1 — Criar 10 emails (use o truque do Gmail)

O Gmail ignora o que vem depois do `+`. Então `mailsonnncc9+curiosidades@gmail.com` cai na **mesma caixa** que `mailsonnncc9@gmail.com`, mas o Firebase trata como email diferente.

**Crie estes 10 emails (na verdade, são aliases do seu email):**

| # | Bot | Email |
|---|---|---|
| 1 | Curiosidades 💡 | `mailsonnncc9+curiosidades@gmail.com` |
| 2 | Dicas 🌱 | `mailsonnncc9+dicas@gmail.com` |
| 3 | Enigmas 🧩 | `mailsonnncc9+enigmas@gmail.com` |
| 4 | Motivação 💪 | `mailsonnncc9+motivacao@gmail.com` |
| 5 | Perguntas ❓ | `mailsonnncc9+perguntas@gmail.com` |
| 6 | Histórias 📖 | `mailsonnncc9+historias@gmail.com` |
| 7 | Citações ✨ | `mailsonnncc9+citacoes@gmail.com` |
| 8 | Desafios 🎨 | `mailsonnncc9+desafios@gmail.com` |
| 9 | Gratidão 🙏 | `mailsonnncc9+gratidao@gmail.com` |
| 10 | Humor 😂 | `mailsonnncc9+humor@gmail.com` |

---

## 📋 Passo 2 — Cadastrar cada email na Vibe

Para cada um dos 10 emails:

1. Abra https://vibe-six-delta.vercel.app (ou seu link da Vibe)
2. Clique em **Cadastrar**
3. Preencha com o email do bot
4. Use uma **senha forte** (anote cada uma num arquivo separado!)
5. Qualquer username (o bot sobrescreve automaticamente ao rodar)
6. Confirme o cadastro

**Dica:** Use a mesma senha forte para todos, tipo `Vibe@Bot2026!` — facilita na hora de colar no GitHub.

---

## 📋 Passo 3 — Adicionar 20 secrets no GitHub

Vá em: **seu-repo → Settings → Secrets and variables → Actions → New repository secret**

### Secret compartilhado (já existe, não mexe):
- `FIREBASE_API_KEY`

### Novos 20 secrets (email + senha de cada bot):

| Nome do Secret | Valor |
|---|---|
| `BOT_CURIOSIDADES_EMAIL` | `mailsonnncc9+curiosidades@gmail.com` |
| `BOT_CURIOSIDADES_PASSWORD` | (a senha que você criou) |
| `BOT_DICAS_EMAIL` | `mailsonnncc9+dicas@gmail.com` |
| `BOT_DICAS_PASSWORD` | (senha) |
| `BOT_ENIGMAS_EMAIL` | `mailsonnncc9+enigmas@gmail.com` |
| `BOT_ENIGMAS_PASSWORD` | (senha) |
| `BOT_MOTIVACAO_EMAIL` | `mailsonnncc9+motivacao@gmail.com` |
| `BOT_MOTIVACAO_PASSWORD` | (senha) |
| `BOT_PERGUNTAS_EMAIL` | `mailsonnncc9+perguntas@gmail.com` |
| `BOT_PERGUNTAS_PASSWORD` | (senha) |
| `BOT_HISTORIAS_EMAIL` | `mailsonnncc9+historias@gmail.com` |
| `BOT_HISTORIAS_PASSWORD` | (senha) |
| `BOT_CITACOES_EMAIL` | `mailsonnncc9+citacoes@gmail.com` |
| `BOT_CITACOES_PASSWORD` | (senha) |
| `BOT_DESAFIOS_EMAIL` | `mailsonnncc9+desafios@gmail.com` |
| `BOT_DESAFIOS_PASSWORD` | (senha) |
| `BOT_GRATIDAO_EMAIL` | `mailsonnncc9+gratidao@gmail.com` |
| `BOT_GRATIDAO_PASSWORD` | (senha) |
| `BOT_HUMOR_EMAIL` | `mailsonnncc9+humor@gmail.com` |
| `BOT_HUMOR_PASSWORD` | (senha) |

### Os antigos `BOT_EMAIL` e `BOT_PASSWORD` podem ser deletados
Eles não são mais usados por nenhum workflow.

---

## 📋 Passo 4 — Rodar manualmente pra testar

Depois de adicionar todos os secrets:

1. GitHub → aba **Actions**
2. Clique em qualquer bot da lista (ex: "🤖 Bot — Curiosidades")
3. Botão **Run workflow** (canto direito) → Run
4. Espere uns 30s, abra a Vibe e veja o post aparecendo com o nome certo
5. Faça isso com todos os 10 bots

---

## 🕐 Cronograma diário (horário de Brasília)

| Horário | Bot |
|---|---|
| 09:00 | Curiosidades 💡 |
| 09:30 | Dicas 🌱 |
| 10:00 | Enigmas 🧩 |
| 10:30 | Motivação 💪 |
| 11:00 | Perguntas ❓ |
| 11:30 | Histórias 📖 |
| 12:00 | Citações ✨ |
| 12:30 | Desafios 🎨 |
| 13:00 | Gratidão 🙏 |
| 13:30 | Humor 😂 |

Feed populado com **1 post a cada 30 min** — ritmo bom para o engajamento não parecer spam.

---

## 🐛 Se algo der errado

- **Post com nome errado:** Verifica se o email do secret é o mesmo que cadastrou na Vibe.
- **Erro "Login falhou":** A senha do secret não confere. Teste logando manualmente na Vibe com essa conta.
- **Post não apareceu:** Rode o workflow manualmente (Actions → Run workflow) e veja o log.
- **"Already posted today":** Normal, cada bot posta 1x por dia. Espere o próximo dia ou apague manualmente o campo `ultimoPostDia` do usuário no Firebase.

---

*Última atualização: abril 2026*
