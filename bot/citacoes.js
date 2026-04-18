// ============================================================
// BOT — Vibe Citações
// Posta citações inspiradoras de pessoas famosas
// Roda via GitHub Actions (cron diário, 30 min após histórias)
// ============================================================

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const DB_URL           = 'https://controle-de-gasto-fc4e0-default-rtdb.firebaseio.com';
const BOT_EMAIL        = process.env.BOT_CITACOES_EMAIL;
const BOT_PASSWORD     = process.env.BOT_CITACOES_PASSWORD;

// ---- 50 citações de pessoas famosas (cicla a cada 50 dias) ----------------
const CITACOES = [
  `✨ CITAÇÃO DO DIA:

"O único jeito de fazer um trabalho excelente é amar o que você faz."

— Steve Jobs

#citação #trabalho #paixão`,

  `✨ CITAÇÃO DO DIA:

"A vida é o que acontece enquanto você está ocupado fazendo outros planos."

— John Lennon

#citação #vida #presença`,

  `✨ CITAÇÃO DO DIA:

"Seja você mesmo, todos os outros já estão ocupados."

— Oscar Wilde

#citação #autenticidade #identidade`,

  `✨ CITAÇÃO DO DIA:

"O futuro pertence àqueles que acreditam na beleza de seus sonhos."

— Eleanor Roosevelt

#citação #sonho #futuro`,

  `✨ CITAÇÃO DO DIA:

"Não é a montanha que você vencerá, mas a si mesmo."

— Jim Whittaker

#citação #desafio #superação`,

  `✨ CITAÇÃO DO DIA:

"Você não pode descobrir novas terras se não quiser perder de vista a costa."

— André Gide

#citação #risco #descoberta`,

  `✨ CITAÇÃO DO DIA:

"O sucesso é uma jornada, não um destino."

— Arthur Ashe

#citação #sucesso #jornada`,

  `✨ CITAÇÃO DO DIA:

"Tudo que você sempre quis está do outro lado do medo."

— George Addair

#citação #coragem #medo`,

  `✨ CITAÇÃO DO DIA:

"O menor ato de bondade é melhor que a maior intenção."

— Kahlil Gibran

#citação #bondade #ação`,

  `✨ CITAÇÃO DO DIA:

"Você é tanto quanto você acredita que é."

— Ford

#citação #mentalidade #crença`,

  `✨ CITAÇÃO DO DIA:

"O problema não é nunca ter fracassado, é nunca ter tentado."

— Bob Ross

#citação #tentativa #ousadia`,

  `✨ CITAÇÃO DO DIA:

"Educação é o caminho mais poderoso para mudar o mundo."

— Nelson Mandela

#citação #educação #mudança`,

  `✨ CITAÇÃO DO DIA:

"A melhor hora para plantar uma árvore foi há 20 anos. A segunda melhor é agora."

— Provérbio Chinês

#citação #tempo #ação`,

  `✨ CITAÇÃO DO DIA:

"A vida é 10% o que acontece e 90% como você reage."

— Charles R. Swindoll

#citação #perspectiva #reação`,

  `✨ CITAÇÃO DO DIA:

"O que sabemos é uma gota. O que ignoramos é um oceano."

— Isaac Newton

#citação #humildade #conhecimento`,

  `✨ CITAÇÃO DO DIA:

"Pessoas extraordinárias visualizam não o que é possível, mas o impossível."

— Cheri Carter-Scott

#citação #visão #possibilidade`,

  `✨ CITAÇÃO DO DIA:

"A melhor venda é aquela que faz o cliente ficar feliz."

— Zig Ziglar

#citação #valor #propósito`,

  `✨ CITAÇÃO DO DIA:

"Seus limites só existem em sua mente."

— David Goggins

#citação #limites #mentalidade`,

  `✨ CITAÇÃO DO DIA:

"O único fracasso real é não tentar."

— Tony Robbins

#citação #risco #tentativa`,

  `✨ CITAÇÃO DO DIA:

"Qualidade é não uma ação, é um hábito."

— Aristóteles

#citação #hábito #qualidade`,

  `✨ CITAÇÃO DO DIA:

"Você não pode agradar a todos, então agrade a si mesmo."

— Kanye West

#citação #autenticidade #decisão`,

  `✨ CITAÇÃO DO DIA:

"Acredite em si mesmo. Se você não acredita em si, quem vai?"

— Muuhammad Ali

#citação #autoconfiança #fé`,

  `✨ CITAÇÃO DO DIA:

"O caminho para mil milhas começa com um único passo."

— Lao Tzu

#citação #jornada #iniciativa`,

  `✨ CITAÇÃO DO DIA:

"Você merece uma vida que o torna feliz."

— Oprah Winfrey

#citação #felicidade #autoamor`,

  `✨ CITAÇÃO DO DIA:

"O segredo do sucesso é fazer as coisas que você ama."

— Richard Branson

#citação #paixão #sucesso`,

  `✨ CITAÇÃO DO DIA:

"Grandes realizações começam com sonhos grandes."

— Zig Ziglar

#citação #sonhos #ambição`,

  `✨ CITAÇÃO DO DIA:

"A melhor parte da vida é quando suas pegadas importam."

— David Brinkley

#citação #legado #impacto`,

  `✨ CITAÇÃO DO DIA:

"Você só vive uma vez. Certifique-se de que vale a pena."

— Mae West

#citação #vida #plenitude`,

  `✨ CITAÇÃO DO DIA:

"O tempo é dinheiro, então não o desperdice."

— Benjamin Franklin

#citação #tempo #produtividade`,

  `✨ CITAÇÃO DO DIA:

"Sejamos grato àqueles que nos ensinam."

— Johan Wolfgang Von Goethe

#citação #gratidão #aprendizado`,

  `✨ CITAÇÃO DO DIA:

"O sucesso não é final, o fracasso não é fatal."

— Winston Churchill

#citação #perseverança #sucesso`,

  `✨ CITAÇÃO DO DIA:

"Viva como se fosse morrer amanhã. Aprenda como se fosse viver para sempre."

— Gandhi

#citação #vida #sabedoria`,

  `✨ CITAÇÃO DO DIA:

"A única forma de fazer um ótimo trabalho é amar o que você faz."

— Steve Jobs

#citação #trabalho #paixão`,

  `✨ CITAÇÃO DO DIA:

"Você é mais corajoso do que acredita, mais forte do que parece, mais inteligente do que pensa."

— A.A. Milne

#citação #força #potencial`,

  `✨ CITAÇÃO DO DIA:

"Não importa quantas vezes você cai, o que importa é quantas vezes você se levanta."

— Oliver Goldsmith

#citação #resiliência #persistência`,

  `✨ CITAÇÃO DO DIA:

"Você pode não controlar todos os eventos que acontecem, mas você pode decidir não deixá-los afetá-lo."

— Maya Angelou

#citação #controle #paz`,

  `✨ CITAÇÃO DO DIA:

"Persista! Tudo é possível para quem ousas perseguir seus sonhos."

— Napoleon Bonaparte

#citação #persistência #ousadia`,

  `✨ CITAÇÃO DO DIA:

"Nunca desista. Grandes coisas levam tempo."

— Desconhecido

#citação #paciência #esperança`,

  `✨ CITAÇÃO DO DIA:

"Você é a soma de seus hábitos. Mude seus hábitos, mude sua vida."

— Jim Rohn

#citação #hábitos #transformação`,

  `✨ CITAÇÃO DO DIA:

"Tudo que você queria estava dentro de você o tempo todo."

— Margaret Fuller

#citação #potencial #despertar`,

  `✨ CITAÇÃO DO DIA:

"A vida é curta. Faça com que cada momento contar."

— Steve Jobs

#citação #vida #presença`,

  `✨ CITAÇÃO DO DIA:

"Você é responsável por sua própria felicidade."

— Desconhecido

#citação #responsabilidade #felicidade`,

  `✨ CITAÇÃO DO DIA:

"Acredite que você pode e você estará no meio do caminho."

— Theodore Roosevelt

#citação #crença #determinação`,

  `✨ CITAÇÃO DO DIA:

"Faça cada dia uma obra-prima."

— John Wooden

#citação #excelência #dia`,

  `✨ CITAÇÃO DO DIA:

"Você está aqui por uma razão. Encontre-a."

— Desconhecido

#citação #propósito #significado`,

  `✨ CITAÇÃO DO DIA:

"O melhor tempo para começar é agora."

— Desconhecido

#citação #ação #tempo`,

  `✨ CITAÇÃO DO DIA:

"Você é mais do que suficiente."

— Desconhecido

#citação #valor #autoestima`,

  `✨ CITAÇÃO DO DIA:

"Seja a mudança que você quer ver no mundo."

— Gandhi

#citação #mudança #ação`,

  `✨ CITAÇÃO DO DIA:

"Quanto mais você dá, mais volta."

— Desconhecido

#citação #generosidade #lei`,

  `✨ CITAÇÃO DO DIA:

"Você tem o poder de criar a vida que deseja."

— Wayne Dyer

#citação #criação #poder`,
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
  const USERNAME = 'citacoesdia';
  const NOME     = 'Citações Dia';
  const BIO      = 'Frases que transformam perspectivas ✨';
  const EMOJI    = '✨';

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

async function publicarCitacao(uid, token) {
  const diaAtual = Math.floor(Date.now() / 86400000);
  const texto = CITACOES[diaAtual % CITACOES.length];

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
  console.log('🤖 Bot Citações iniciando...');

  if (!FIREBASE_API_KEY || !BOT_EMAIL || !BOT_PASSWORD) {
    throw new Error('Variáveis de ambiente faltando: FIREBASE_API_KEY, BOT_CITACOES_EMAIL, BOT_CITACOES_PASSWORD');
  }

  const { idToken, localId } = await signIn();
  console.log('✅ Login OK — UID:', localId);

  await ensureProfile(localId, idToken);

  const jaPostou = await jaPostouHoje(localId, idToken);
  if (jaPostou) {
    console.log('⏭️ Já postou hoje. Pulando.');
    return;
  }

  const texto = await publicarCitacao(localId, idToken);
  await marcarPostoHoje(localId, idToken);
  console.log('✅ Postado com sucesso!');
  console.log('📝', texto.split('\n')[0]);
}

main().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
