// ============================================================
// BOT — Vibe Desafios Criativos
// Posta desafios criativos para gerar engajamento
// Roda via GitHub Actions (cron diário, 1h após citações)
// ============================================================

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const DB_URL           = 'https://controle-de-gasto-fc4e0-default-rtdb.firebaseio.com';
const BOT_EMAIL        = process.env.BOT_EMAIL;
const BOT_PASSWORD     = process.env.BOT_PASSWORD;

// ---- 50 desafios criativos (cicla a cada 50 dias) ----------------
const DESAFIOS = [
  `🎨 DESAFIO DO DIA:

Fotografe 5 coisas de cores diferentes que você vê por aí.

Criatividade: mostrar a beleza nas cores do dia a dia.

Mande sua foto nos comentários! 📸

#desafio #criatividade #fotografia`,

  `🎨 DESAFIO DO DIA:

Desenhe seu sentimento AGORA em uma imagem (sem palavras).

Criatividade: expressar emoções através de arte.

Compartilhe nos comentários! 🎨

#desafio #arte #sentimento`,

  `🎨 DESAFIO DO DIA:

Escreva um poema de 4 linhas sobre sua pessoa favorita.

Criatividade: homenagear alguém com palavras.

Comente seu poema! 📝

#desafio #poesia #gratidão`,

  `🎨 DESAFIO DO DIA:

Tire uma selfie com sua expressão mais engraçada.

Criatividade: libertar o lado cômico de si.

Mande a foto nos comentários! 😂

#desafio #humor #diversão`,

  `🎨 DESAFIO DO DIA:

Crie um padrão visual interessante usando papéis de diferentes cores.

Criatividade: design e composição visual.

Mande a foto nos comentários! 🌈

#desafio #design #cores`,

  `🎨 DESAFIO DO DIA:

Escreva uma história de apenas 10 palavras.

Criatividade: ser conciso e impactante.

Comente sua história! 📖

#desafio #escrita #criatividade`,

  `🎨 DESAFIO DO DIA:

Fotografe "sombras" que parecem formas interessantes.

Criatividade: enxergar arte nas coisas simples.

Mande a foto nos comentários! 🌙

#desafio #fotografia #sombras`,

  `🎨 DESAFIO DO DIA:

Crie uma lista de 5 nomes criativos para um novo produto imagin´ario.

Criatividade: inovação e nomenclatura.

Comente os nomes! 💡

#desafio #criatividade #inovação`,

  `🎨 DESAFIO DO DIA:

Fotografe algo bonito e depois o mesmo ângulo de um jeito feio.

Criatividade: perspectiva muda tudo.

Mande as fotos nos comentários! 📸

#desafio #fotografia #perspectiva`,

  `🎨 DESAFIO DO DIA:

Escreva uma mensagem de amor para você mesmo.

Criatividade: auto-amor expresso.

Comente sua mensagem! 💌

#desafio #autoamor #gratidão`,

  `🎨 DESAFIO DO DIA:

Crie a canção mais estranha imaginável (descrição).

Criatividade: pensar fora da caixa musical.

Descreva sua música nos comentários! 🎵

#desafio #música #criatividade`,

  `🎨 DESAFIO DO DIA:

Tire foto com seu objeto favorito e explique por quê.

Criatividade: valorizar o significado pessoal.

Mande a foto e explicação! 📸

#desafio #fotografia #pessoal`,

  `🎨 DESAFIO DO DIA:

Desenhe um animal que não existe (híbrido criativo).

Criatividade: imaginar novas criaturas.

Mande o desenho nos comentários! 🦄

#desafio #arte #imaginação`,

  `🎨 DESAFIO DO DIA:

Escreva um diálogo entre 2 objetos inanimados.

Criatividade: dar voz a coisas.

Comente o diálogo! 💬

#desafio #escrita #criatividade`,

  `🎨 DESAFIO DO DIA:

Fotografe sua refeição de um jeito artístico (plating criativo).

Criatividade: arte culinária visual.

Mande a foto nos comentários! 🍽️

#desafio #fotografia #comida`,

  `🎨 DESAFIO DO DIA:

Crie um personagem inteiro: nome, traços, profissão, medo, sonho.

Criatividade: worldbuilding pessoal.

Descreva seu personagem! 🎭

#desafio #criatividade #personagem`,

  `🎨 DESAFIO DO DIA:

Fotografe 3 "janelas" diferentes (literal ou metafórica).

Criatividade: enxergar perspectivas.

Mande as fotos nos comentários! 🪟

#desafio #fotografia #perspectiva`,

  `🎨 DESAFIO DO DIA:

Escreva uma conversa fictícia com seu "eu" de 10 anos atrás.

Criatividade: reflexão através do tempo.

Comente a conversa! 💭

#desafio #reflexão #crescimento`,

  `🎨 DESAFIO DO DIA:

Crie um "meme" original sobre sua vida (humor visual).

Criatividade: humor e design.

Mande o meme nos comentários! 😂

#desafio #meme #humor`,

  `🎨 DESAFIO DO DIA:

Fotografe algo que representa cada sentimento seu de hoje.

Criatividade: mapear emoções visualmente.

Mande as fotos nos comentários! 📸

#desafio #fotografia #emoções`,

  `🎨 DESAFIO DO DIA:

Escreva uma resenha fictícia de um livro que NÃO EXISTE.

Criatividade: criar ficção dentro de ficção.

Comente a resenha! 📚

#desafio #ficção #criatividade`,

  `🎨 DESAFIO DO DIA:

Tire foto da sua mão fazendo "gesto criativo" (pose, sombra, pintura).

Criatividade: mãos contam histórias.

Mande a foto nos comentários! ✋

#desafio #fotografia #expressão`,

  `🎨 DESAFIO DO DIA:

Descreva uma cor usando apenas sensações (não nomes de cores).

Criatividade: sinestesia e descrição.

Comente sua descrição! 🌈

#desafio #linguagem #criatividade`,

  `🎨 DESAFIO DO DIA:

Crie um "slogan" para sua vida pessoal.

Criatividade: resumir sua essência.

Comente seu slogan! 💪

#desafio #filosofia #identidade`,

  `🎨 DESAFIO DO DIA:

Fotografe a luz mais interessante que você ver hoje.

Criatividade: luz como arte.

Mande a foto nos comentários! 💡

#desafio #fotografia #luz`,

  `🎨 DESAFIO DO DIA:

Escreva um "manual de instrução" para uma emoção (como se fosse um produto).

Criatividade: personificar abstratos.

Comente seu manual! 📋

#desafio #escrita #criatividade`,

  `🎨 DESAFIO DO DIA:

Crie um desenho usando apenas linhas retas (sem curvas).

Criatividade: limitação gera criatividade.

Mande o desenho nos comentários! 📐

#desafio #arte #minimalismo`,

  `🎨 DESAFIO DO DIA:

Fotografe seu "lugar favorito" de um ângulo novo.

Criatividade: familiaridade sob nova perspectiva.

Mande a foto nos comentários! 📸

#desafio #fotografia #lugares`,

  `🎨 DESAFIO DO DIA:

Escreva uma lista de "10 coisas que você gostaria de aprender a fazer."

Criatividade: sonhos em forma de lista.

Comente suas 10 coisas! 📝

#desafio #sonhos #aprendizado`,

  `🎨 DESAFIO DO DIA:

Crie um "sabor" novo e descreva como ele seria (fictício).

Criatividade: gastronomia imaginária.

Descreva seu sabor nos comentários! 🍰

#desafio #criatividade #gastronomia`,

  `🎨 DESAFIO DO DIA:

Fotografe algo "antes e depois" de mudança artística (pintura, organização, etc).

Criatividade: transformação visual.

Mande as fotos nos comentários! 🖼️

#desafio #fotografia #transformação`,

  `🎨 DESAFIO DO DIA:

Escreva uma "instrução de montagem" para um sentimento (humor, de forma criativa).

Criatividade: personificar abstratos com humor.

Comente suas instruções! 🔧

#desafio #humor #criatividade`,

  `🎨 DESAFIO DO DIA:

Crie um padrão decorativo usando fotos e sobreposição (colagem).

Criatividade: composição e design.

Mande sua colagem nos comentários! ✂️

#desafio #arte #colagem`,

  `🎨 DESAFIO DO DIA:

Fotografe "texturas" interessantes ao seu redor.

Criatividade: detalhe e composição.

Mande a foto nos comentários! 🎬

#desafio #fotografia #texturas`,

  `🎨 DESAFIO DO DIA:

Escreva um "diário de dia" em apenas 3 linhas poéticas.

Criatividade: síntese e poesia.

Comente seu diário! 📔

#desafio #poesia #reflexão`,

  `🎨 DESAFIO DO DIA:

Crie um "logo" para você mesmo (desenho minimalista que te represente).

Criatividade: identidade visual pessoal.

Mande seu logo nos comentários! 🎨

#desafio #design #identidade`,

  `🎨 DESAFIO DO DIA:

Fotografe "reflexos" (espelhos, água, vidro) de forma criativa.

Criatividade: dupla perspectiva visual.

Mande a foto nos comentários! 🪞

#desafio #fotografia #reflexos`,

  `🎨 DESAFIO DO DIA:

Escreva uma "carta de amor" para algo inusitado (um objeto, lugar, atividade).

Criatividade: afeto criativo.

Comente sua carta! 💌

#desafio #escrita #criatividade`,

  `🎨 DESAFIO DO DIA:

Crie um "soundtrack pessoal" (5 músicas que representam sua vida agora).

Criatividade: música narrativa.

Comente sua playlist! 🎵

#desafio #música #identidade`,

  `🎨 DESAFIO DO DIA:

Fotografe "simetria" (ou assimetria intencional) ao seu redor.

Criatividade: composição visual.

Mande a foto nos comentários! ⚖️

#desafio #fotografia #equilíbrio`,

  `🎨 DESAFIO DO DIA:

Escreva um "manifesto pessoal" (3-5 frases sobre quem você é/quer ser).

Criatividade: declaração de princípios.

Comente seu manifesto! 📢

#desafio #filosofia #identidade`,

  `🎨 DESAFIO DO DIA:

Crie um "mapa emocional" de sua semana (desenho que mostre seu humor).

Criatividade: mapeamento de emoções.

Mande seu mapa nos comentários! 🗺️

#desafio #arte #emoções`,

  `🎨 DESAFIO DO DIA:

Fotografe algo "bonito em ser imperfeito" (rachado, envelhecido, assimétrico).

Criatividade: beleza na imperfeição.

Mande a foto nos comentários! 🍂

#desafio #fotografia #wabi-sabi`,

  `🎨 DESAFIO DO DIA:

Escreva uma "receita" para felicidade (ingredientes + modo de fazer, criativo).

Criatividade: felicidade como arte.

Comente sua receita! 😊

#desafio #criatividade #felicidade`,

  `🎨 DESAFIO DO DIA:

Crie uma "série de fotos" que conta uma história (min. 3 fotos, sequência).

Criatividade: narrativa visual.

Mande a série nos comentários! 📸

#desafio #fotografia #narrativa`,

  `🎨 DESAFIO DO DIA:

Escreva um "obituário positivo" para um hábito ruim que quer abandonar.

Criatividade: celebrar mudança com humor.

Comente seu obituário! 💀

#desafio #mudança #humor`,

  `🎨 DESAFIO DO DIA:

Fotografe seu "pequeno tesouro" pessoal (objeto que significa muito).

Criatividade: fotografia contemplativa.

Mande a foto e conte a história! 💎

#desafio #fotografia #história`,
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
  return res.json();
}

async function ensureProfile(uid, token) {
  const USERNAME = 'desafiodia';
  const NOME     = 'Desafio Dia';
  const BIO      = 'Desafios criativos diários para inspirar 🎨';
  const EMOJI    = '🎨';

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

  await fetch(`${DB_URL}/usernames/${USERNAME}.json?auth=${token}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(uid),
  });
}

async function jaPostouHoje(uid, token) {
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

async function publicarDesafio(uid, token) {
  const diaAtual = Math.floor(Date.now() / 86400000);
  const texto = DESAFIOS[diaAtual % DESAFIOS.length];

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
  console.log('🤖 Bot Desafios iniciando...');

  if (!FIREBASE_API_KEY || !BOT_EMAIL || !BOT_PASSWORD) {
    throw new Error('Variáveis de ambiente faltando: FIREBASE_API_KEY, BOT_EMAIL, BOT_PASSWORD');
  }

  const { idToken, localId } = await signIn();
  console.log('✅ Login OK — UID:', localId);

  await ensureProfile(localId, idToken);

  const jaPostou = await jaPostouHoje(localId, idToken);
  if (jaPostou) {
    console.log('⏭️ Já postou hoje. Pulando.');
    return;
  }

  const texto = await publicarDesafio(localId, idToken);
  await marcarPostoHoje(localId, idToken);
  console.log('✅ Postado com sucesso!');
  console.log('📝', texto.split('\n')[0]);
}

main().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
