# 🤖 Setup dos 10 Bots da Vibe

## 📌 Resumo do problema que isso resolve

Antes: todos os bots usavam o **mesmo login Firebase** → mesma UID → novos posts apareciam com o nome do último bot que rodou, e o campo `ultimoPostDia` era compartilhado, bloqueando os outros.

Agora: **cada bot tem seu próprio login Firebase** → UID diferente → perfil único → posts históricos preservados.

---

## 📋 Passo 1 — Emails + persona de cada bot

Cada bot tem uma **persona própria** (nome + username + bio) pra parecer uma pessoa real no feed:

| # | Bot | Email | Persona no feed |
|---|---|---|---|
| 1 | Curiosidades 💡 | `donagracas666@gmail.com` | **Dona Graças** (@donagracas) |
| 2 | Dicas 🌱 | `codoantonio24@gmail.com` | **Antônio Codó** (@antoniocodo) |
| 3 | Enigmas 🧩 | `elizabethmendesfvp@gmail.com` | **Elizabeth Mendes** (@elizabethmendes) |
| 4 | Motivação 💪 | `erikafvp3@gmail.com` | **Érika** (@erikafvp) |
| 5 | Perguntas ❓ | `fositafvo@gmail.com` | **Fosita** (@fosita) |
| 6 | Histórias 📖 | `joanafvp33@gmail.com` | **Joana** (@joanafvp) |
| 7 | Citações ✨ | `bocajose92@gmail.com` | **José da Boca** (@josebocajose) |
| 8 | Desafios 🎨 | `gimjoseano@gmail.com` | **Gim Joseano** (@gimjoseano) |
| 9 | Gratidão 🙏 | `lenefvo@gmail.com` | **Lene** (@lenefvo) |
| 10 | Humor 😂 | `rexm2110@gmail.com` | **Rex** (@rexm) |

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
| `BOT_CURIOSIDADES_EMAIL` | `donagracas666@gmail.com` |
| `BOT_CURIOSIDADES_PASSWORD` | (a senha da conta Vibe dela) |
| `BOT_DICAS_EMAIL` | `codoantonio24@gmail.com` |
| `BOT_DICAS_PASSWORD` | (senha) |
| `BOT_ENIGMAS_EMAIL` | `elizabethmendesfvp@gmail.com` |
| `BOT_ENIGMAS_PASSWORD` | (senha) |
| `BOT_MOTIVACAO_EMAIL` | `erikafvp3@gmail.com` |
| `BOT_MOTIVACAO_PASSWORD` | (senha) |
| `BOT_PERGUNTAS_EMAIL` | `fositafvo@gmail.com` |
| `BOT_PERGUNTAS_PASSWORD` | (senha) |
| `BOT_HISTORIAS_EMAIL` | `joanafvp33@gmail.com` |
| `BOT_HISTORIAS_PASSWORD` | (senha) |
| `BOT_CITACOES_EMAIL` | `bocajose92@gmail.com` |
| `BOT_CITACOES_PASSWORD` | (senha) |
| `BOT_DESAFIOS_EMAIL` | `gimjoseano@gmail.com` |
| `BOT_DESAFIOS_PASSWORD` | (senha) |
| `BOT_GRATIDAO_EMAIL` | `lenefvo@gmail.com` |
| `BOT_GRATIDAO_PASSWORD` | (senha) |
| `BOT_HUMOR_EMAIL` | `rexm2110@gmail.com` |
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
