// ============================================================
// BOT — Vibe Enigmas
// Posta um enigma/charada diferente todo dia no feed da Vibe
// Roda via GitHub Actions (cron diário, 30 min após dicas)
// ============================================================

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const DB_URL           = 'https://controle-de-gasto-fc4e0-default-rtdb.firebaseio.com';
const BOT_EMAIL        = process.env.BOT_EMAIL;
const BOT_PASSWORD     = process.env.BOT_PASSWORD;

// ---- 50 enigmas (cicla a cada 50 dias) ----------------
const ENIGMAS = [
  `🧩 ENIGMA DO DIA:

Tenho cidades, mas sem casas.
Tenho montanhas, mas sem árvores.
Tenho água, mas sem peixes.

O que sou? 🤔

💭 Pense antes de responder!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #raciocinio`,

  `🧩 ENIGMA DO DIA:

Quanto mais você tira, mais fico.
Quanto menos você tira, menos fico.

O que sou? 🤔

💭 Esse é clássico, mas nem todos acertam!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #charada`,

  `🧩 ENIGMA DO DIA:

Tenho cabeça e cauda, mas não tenho corpo.

O que sou? 🤔

💭 Uma chance em duas de acertar... ou não?
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #raciocinio`,

  `🧩 ENIGMA DO DIA:

Sou leve como uma pena, mas nem o mais forte consegue me segurar por mais de alguns minutos.

O que sou? 🤔

💭 Algo muito comum no seu dia a dia!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #charada`,

  `🧩 ENIGMA DO DIA:

Tenho um rosto e duas mãos, mas não tenho braços nem pernas.

O que sou? 🤔

💭 Você provavelmente me vê todos os dias!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #raciocinio`,

  `🧩 ENIGMA DO DIA:

Três maçãs estão em uma cesta.
Três pessoas pegam uma maçã cada.
Mas uma maçã continua na cesta.

Como é possível? 🤔

💭 Leia com atenção, a resposta está aqui!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #charada`,

  `🧩 ENIGMA DO DIA:

Tenho 88 teclas, mas não consigo escrever.

O que sou? 🤔

💭 Algo que faz muita gente feliz!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #musica`,

  `🧩 ENIGMA DO DIA:

Quanto mais quente fico, mais rápido corro.
Quando esfrio, paro de me mover.

O que sou? 🤔

💭 Você me usa provavelmente todos os dias!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #raciocinio`,

  `🧩 ENIGMA DO DIA:

Sou feito de água, mas se você me colocar em água, desapareço.

O que sou? 🤔

💭 Dica: é bem comum em dias frios!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #charada`,

  `🧩 ENIGMA DO DIA:

Tenho um nariz, mas não consigo cheirar.
Tenho orelhas, mas não consigo ouvir.
Tenho boca, mas não consigo falar.

O que sou? 🤔

💭 Você já deve ter comido um!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #raciocinio`,

  `🧩 ENIGMA DO DIA:

Quanto mais você a esvazia, mais pesada fica.

O que é? 🤔

💭 Muito comum em praias e na construção!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #charada`,

  `🧩 ENIGMA DO DIA:

Sou branco quando estou sujo e negro quando estou limpo.

O que sou? 🤔

💭 Muito comum em escolas e quadros!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #raciocinio`,

  `🧩 ENIGMA DO DIA:

Quanto mais você me alimenta, mais forte fico.
Quanto menos você me alimenta, mais fraco fico.

O que sou? 🤔

💭 Você precisa de mim para viver!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #charada`,

  `🧩 ENIGMA DO DIA:

Tenho chave, mas não abro nenhuma porta.
Tenho espaço, mas não tem ar.
Tenho entrada, mas ninguém entra.

O que sou? 🤔

💭 Muita gente tem uma em casa!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #raciocinio`,

  `🧩 ENIGMA DO DIA:

Sou sempre vindo depois de você, mas você nunca me vê.

O que sou? 🤔

💭 Especialmente durante o dia!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #charada`,

  `🧩 ENIGMA DO DIA:

Estou em você, em mim, mas não estou em ninguém mais.

O que sou? 🤔

💭 Uma parte muito importante!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #raciocinio`,

  `🧩 ENIGMA DO DIA:

Quanto mais você fala comigo, menos eu falo com você.

O que sou? 🤔

💭 Muito comum em conversas!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #charada`,

  `🧩 ENIGMA DO DIA:

Tenho cidades, mas sem pessoas.
Tenho montanhas, mas sem pedras.
Tenho água, mas sem peixe.

O que sou? 🤔

💭 Dica: é algo que você vê!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #raciocinio`,

  `🧩 ENIGMA DO DIA:

O que tem mãos, mas não consegue bater palmas?

🤔

💭 Relógio? Não... pense melhor!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #charada`,

  `🧩 ENIGMA DO DIA:

Qual é a coisa que quanto mais nomes tem, mais fraca fica?

🤔

💭 Pense em coisas com múltiplos nomes...
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #raciocinio`,

  `🧩 ENIGMA DO DIA:

Nunca entro em você, mas estou sempre com você.

O que sou? 🤔

💭 Especialmente quando você dorme!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #charada`,

  `🧩 ENIGMA DO DIA:

Tenho rosto e dois braços, mas nenhuma perna.
Ando, mas não tenho pés.

O que sou? 🤔

💭 Muito comum em casas!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #raciocinio`,

  `🧩 ENIGMA DO DIA:

Quanto mais seco fico, mais molhado você fica.

O que sou? 🤔

💭 Muito útil depois do banho!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #charada`,

  `🧩 ENIGMA DO DIA:

Tenho muitos dentes, mas nunca mastico.

O que sou? 🤔

💭 Algo que você usa na higiene!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #raciocinio`,

  `🧩 ENIGMA DO DIA:

Quanto mais você tira, maior fico.

O que sou? 🤔

💭 Dica: relacionado ao tamanho!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #charada`,

  `🧩 ENIGMA DO DIA:

Tenho um rosto redondo, números ao redor e duas mãos que se movem.
Mas não estou vivo.

O que sou? 🤔

💭 Você me consulta todo dia!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #raciocinio`,

  `🧩 ENIGMA DO DIA:

Sou feita de pão, mas você não pode comer.
Tenho boca, mas não consigo falar.

O que sou? 🤔

💭 Dica: é algo de teatro!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #charada`,

  `🧩 ENIGMA DO DIA:

Tenho um pescoço, mas sem cabeça.

O que sou? 🤔

💭 Algo muito comum em mesas!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #raciocinio`,

  `🧩 ENIGMA DO DIA:

Sou branco ou preto, redondo, mas não sou uma bola.
Você me coloca na panela quente.

O que sou? 🤔

💭 Muito popular no café da manhã!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #charada`,

  `🧩 ENIGMA DO DIA:

Tenho agulhas, mas não cosuro.

O que sou? 🤔

💭 Você me consulta para saber a hora!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #raciocinio`,

  `🧩 ENIGMA DO DIA:

Quanto mais você me corteja, mais fico.

O que sou? 🤔

💭 Dica: relacionado à honra!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #charada`,

  `🧩 ENIGMA DO DIA:

Tenho olhos, mas não posso ver.

O que sou? 🤔

💭 Algo muito comum na cozinha!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #raciocinio`,

  `🧩 ENIGMA DO DIA:

Sou um instrumento, mas não posso tocar música.
Tenho barbante, mas nenhuma melodia.

O que sou? 🤔

💭 Crianças adoram brincar comigo!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #charada`,

  `🧩 ENIGMA DO DIA:

Quanto mais você me observa, menos você me vê.

O que sou? 🤔

💭 Dica: está bem na sua frente!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #raciocinio`,

  `🧩 ENIGMA DO DIA:

Tenho uma língua, mas não consigo falar.
Tenho olhos (ou furos), mas não consigo ver.

O que sou? 🤔

💭 Algo que você calça todos os dias!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #charada`,

  `🧩 ENIGMA DO DIA:

Sou sempre branco, mas as pessoas me pintam de diferentes cores.

O que sou? 🤔

💭 Dica: está na sua casa!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #raciocinio`,

  `🧩 ENIGMA DO DIA:

Tenho um coração que não bate.

O que sou? 🤔

💭 Muito comum em frutas!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #charada`,

  `🧩 ENIGMA DO DIA:

Quanto mais escuro fico, mais você vê.
Quanto mais claro fico, menos você vê.

O que sou? 🤔

💭 Dica: no cinema, você me adora!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #raciocinio`,

  `🧩 ENIGMA DO DIA:

Tenho base redonda, mas nenhuma roda.
Tenho assentos, mas ninguém se senta.

O que sou? 🤔

💭 Algo que você vê em circos!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #charada`,

  `🧩 ENIGMA DO DIA:

Sou um animal com uma única cor, mas todos os meus filmes são pretos e brancos.

O que sou? 🤔

💭 Dica: famoso em Hollywood!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #raciocinio`,

  `🧩 ENIGMA DO DIA:

Tenho um rosto, mas ninguém consegue me ver o rosto.
Tenho uma mão que se move, mas não posso abraçar.

O que sou? 🤔

💭 Você me consulta frequentemente!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #charada`,

  `🧩 ENIGMA DO DIA:

Quanto mais você tira, mais queda.
Quanto menos você tira, mais subida.

O que sou? 🤔

💭 Dica: em edifícios!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #raciocinio`,

  `🧩 ENIGMA DO DIA:

Tenho uma língua que ninguém consegue ouvir.
Tenho um rosto, mas ninguém consegue me ver.

O que sou? 🤔

💭 Algo que você calça!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #charada`,

  `🧩 ENIGMA DO DIA:

Sou uma família com centenas de filhos.
Todos saem em uma linha reta.

O que sou? 🤔

💭 Muito comum em caixas!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #raciocinio`,

  `🧩 ENIGMA DO DIA:

Tenho uma cauda, mas não sou um animal.
Você pode me voar no vento.

O que sou? 🤔

💭 Crianças adoram brincar comigo!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #charada`,

  `🧩 ENIGMA DO DIA:

Quanto mais você me preenche, mais vazio eu fico.

O que sou? 🤔

💭 Dica: você me usa na bagagem!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #raciocinio`,

  `🧩 ENIGMA DO DIA:

Tenho olhos, nariz e boca, mas nenhuma inteligência.

O que sou? 🤔

💭 Muito popular em Halloween!
🕐 Volte amanhã para saber a resposta.

#enigma #desafio #charada`,
];

// ---- Funções auxiliares ------------------------------------

async function signIn() {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: BOT_EMAIL, password: BOT_PASSWORD, returnSecureToken: true }),
    }
  );
  if (!res.ok) throw new Error('Login falhou: ' + await res.text());
  return res.json(); // { idToken, localId }
}

async function ensureProfile(uid, token) {
  const USERNAME = 'enigmasdia';
  const NOME     = 'Enigmas Dia';
  const BIO      = 'Desafie seu cérebro com enigmas diários 🧩';
  const EMOJI    = '🧩';

  // Atualiza o perfil (força atualização mesmo que já exista)
  const r1 = await fetch(`${DB_URL}/usuarios/${uid}.json?auth=${token}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: USERNAME, nome: NOME, bio: BIO, emoji: EMOJI }),
  });
  if (!r1.ok) {
    const err = await r1.text();
    console.error('❌ Erro ao atualizar perfil:', err);
  } else {
    console.log('✅ Perfil atualizado:', NOME);
  }

  // Registra o username (só funciona se ainda não existe)
  await fetch(`${DB_URL}/usernames/${USERNAME}.json?auth=${token}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(uid),
  });
}

async function jaPostouHoje(uid, token) {
  // Checa campo 'ultimoPostDia' no perfil do bot (dia do ano, ex: 20260418)
  const res = await fetch(`${DB_URL}/usuarios/${uid}/ultimoPostDia.json?auth=${token}`);
  const ultimoPostDia = await res.json();

  const hoje = new Date();
  const diaHoje = `${hoje.getUTCFullYear()}${String(hoje.getUTCMonth()+1).padStart(2,'0')}${String(hoje.getUTCDate()).padStart(2,'0')}`;

  console.log('Último post:', ultimoPostDia, '| Hoje:', diaHoje);
  return String(ultimoPostDia) === diaHoje;
}

async function marcarPostoHoje(uid, token) {
  const hoje = new Date();
  const diaHoje = `${hoje.getUTCFullYear()}${String(hoje.getUTCMonth()+1).padStart(2,'0')}${String(hoje.getUTCDate()).padStart(2,'0')}`;

  await fetch(`${DB_URL}/usuarios/${uid}/ultimoPostDia.json?auth=${token}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Number(diaHoje)),
  });
}

async function publicarEnigma(uid, token) {
  // Escolhe o enigma com base no dia atual (determinístico, sem repetir por 50 dias)
  const diaAtual = Math.floor(Date.now() / 86400000);
  const texto = ENIGMAS[diaAtual % ENIGMAS.length];

  const postId = `post_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const res = await fetch(`${DB_URL}/posts/${postId}.json?auth=${token}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      uid,
      tipo: 'texto',
      texto,
      timestamp: Date.now(),
    }),
  });

  if (!res.ok) throw new Error('Erro ao publicar: ' + await res.text());
  return texto;
}

// ---- Main --------------------------------------------------

async function main() {
  console.log('🤖 Bot Enigmas iniciando...');

  if (!FIREBASE_API_KEY || !BOT_EMAIL || !BOT_PASSWORD) {
    throw new Error('Variáveis de ambiente faltando: FIREBASE_API_KEY, BOT_EMAIL, BOT_PASSWORD');
  }

  const { idToken, localId } = await signIn();
  console.log('✅ Login OK — UID:', localId);

  await ensureProfile(localId, idToken);

  // Proteção: não posta duas vezes no mesmo dia
  const jaPostou = await jaPostouHoje(localId, idToken);
  if (jaPostou) {
    console.log('⏭️ Já postou hoje. Pulando.');
    return;
  }

  const texto = await publicarEnigma(localId, idToken);
  await marcarPostoHoje(localId, idToken);
  console.log('✅ Postado com sucesso!');
  console.log('📝', texto.split('\n')[0]);
}

main().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
