// ============================================================
// BOT — Vibe Motivação
// Posta mensagens motivacionais todo dia no feed da Vibe
// Roda via GitHub Actions (cron diário, 1h após enigmas)
// ============================================================

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const DB_URL           = 'https://controle-de-gasto-fc4e0-default-rtdb.firebaseio.com';
const BOT_EMAIL        = process.env.BOT_MOTIVACAO_EMAIL;
const BOT_PASSWORD     = process.env.BOT_MOTIVACAO_PASSWORD;

// ---- 50 mensagens motivacionais (cicla a cada 50 dias) ----------------
const MOTIVACOES = [
  `🌟 MOTIVAÇÃO DO DIA:

"Você é mais forte do que pensa. Já superou 100% dos piores dias que teve."

Cada obstáculo é uma chance de crescer. Não desista agora.

💪 Você consegue!

#motivação #força #superação`,

  `🌟 MOTIVAÇÃO DO DIA:

"O sucesso não é um destino, é uma jornada."

Aproveite cada passo, celebre pequenas vitórias, e mantenha o foco.

🚀 Siga em frente!

#motivação #jornada #foco`,

  `🌟 MOTIVAÇÃO DO DIA:

"Seus piores dias criaram sua maior força."

O que não te mata, te torna mais resiliente. Você é um sobrevivente.

💎 Você é valioso!

#motivação #resiliência #força`,

  `🌟 MOTIVAÇÃO DO DIA:

"Não compare seu começo com o meio de alguém."

Toda pessoa de sucesso começou do zero. Você está no caminho certo.

🌱 Paciência com o processo!

#motivação #comparação #foco`,

  `🌟 MOTIVAÇÃO DO DIA:

"Você não precisa ser perfeito para começar. Precisa começar para ser melhor."

Ação hoje > Perfeição amanhã.

⚡ Comece agora!

#motivação #ação #crescimento`,

  `🌟 MOTIVAÇÃO DO DIA:

"A vida é 10% o que acontece com você, 90% como você reage."

Você controla sua perspectiva. Mude isso e tudo muda.

👁️ Visão positiva!

#motivação #perspectiva #mentalidade`,

  `🌟 MOTIVAÇÃO DO DIA:

"Cansaço é temporário. Desistência é permanente."

Quando quiser parar, lembre-se por que começou.

💪 Persista!

#motivação #persistência #determinação`,

  `🌟 MOTIVAÇÃO DO DIA:

"Você é a única versão de você que o mundo precisa."

Suas diferenças são sua força. Seja autêntico.

✨ Brilhe!

#motivação #autenticidade #singularidade`,

  `🌟 MOTIVAÇÃO DO DIA:

"Fracasso é feedback, não final."

Cada "não" te aproxima de um "sim". Continue tentando.

🎯 Persistência vence!

#motivação #fracasso #crescimento`,

  `🌟 MOTIVAÇÃO DO DIA:

"Você é mais bravo do que o medo que sente."

Medo é normal. Agir apesar do medo é coragem.

🦁 Seja corajoso!

#motivação #coragem #medo`,

  `🌟 MOTIVAÇÃO DO DIA:

"Sua mentalidade é tudo. Mude a mente, mude a vida."

Pensamentos negativos = vida negativa. Escolha melhor.

🧠 Reprograme-se!

#motivação #mentalidade #pensamento`,

  `🌟 MOTIVAÇÃO DO DIA:

"Você é capaz de coisas que você ainda não sonhou."

Limite não existe, exceto na sua mente.

🚀 Sonhe maior!

#motivação #potencial #sonhos`,

  `🌟 MOTIVAÇÃO DO DIA:

"Investir em você mesmo é o melhor investimento que fará."

Sua educação, saúde, crescimento = retorno garantido.

💰 Invista em si!

#motivação #crescimento #investimento`,

  `🌟 MOTIVAÇÃO DO DIA:

"Seus hábitos definem seu futuro."

Pequenas mudanças hoje = grandes resultados amanhã.

📈 Mude hábitos!

#motivação #hábitos #futuro`,

  `🌟 MOTIVAÇÃO DO DIA:

"Você não é privilegiado o suficiente para dar up."

Você tem saúde, internet, oportunidades. Use-as.

🙏 Seja grato!

#motivação #gratidão #oportunidade`,

  `🌟 MOTIVAÇÃO DO DIA:

"Dormir bem é treinar para ser melhor."

Descanse sem culpa. Você merece recarregar.

😴 Durma bem!

#motivação #descanso #saúde`,

  `🌟 MOTIVAÇÃO DO DIA:

"Você é o responsável por sua felicidade."

Ninguém pode dar ou tirar seu poder. Você controla isso.

👑 Seu poder!

#motivação #responsabilidade #felicidade`,

  `🌟 MOTIVAÇÃO DO DIA:

"Estresse é sinal de que você quer mais. Use isso como combustível."

Transforme ansiedade em ação. Canalizar é a chave.

⚡ Canalize a energia!

#motivação #stress #ação`,

  `🌟 MOTIVAÇÃO DO DIA:

"Versão futura de você agradecerá pelas decisões de hoje."

Pense a longo prazo. Hoje é oportunidade de melhorar amanhã.

⏳ Pense futuro!

#motivação #futuro #decisões`,

  `🌟 MOTIVAÇÃO DO DIA:

"Você não compete com ninguém, compete com quem era ontem."

Seu único rival é o seu passado. Melhore disso.

🏆 Supere-se!

#motivação #autossuperação #competição`,

  `🌟 MOTIVAÇÃO DO DIA:

"A dor de disciplina sempre será menor que a dor do arrependimento."

Sacrifique agora, colha depois. Vale a pena.

💪 Seja disciplinado!

#motivação #disciplina #sacrifício`,

  `🌟 MOTIVAÇÃO DO DIA:

"Você não está atrasado, apenas em sua própria timeline."

Ignore relógios alheios. Sua jornada é única.

⏰ Sua velocidade!

#motivação #jornada #timing`,

  `🌟 MOTIVAÇÃO DO DIA:

"Falhar tentando é melhor que nunca tentar."

O mundo precisa do seu talento. Arrisque.

🎲 Atreva-se!

#motivação #risco #coragem`,

  `🌟 MOTIVAÇÃO DO DIA:

"Você é uma obra em progresso. Ainda não terminou."

Seu melhor ainda não chegou. Continue construindo.

🏗️ Construa-se!

#motivação #progresso #construção`,

  `🌟 MOTIVAÇÃO DO DIA:

"Inconsistência é o único inimigo real do sucesso."

Pequenas ações diárias > grandes promessas ocasionais.

📊 Seja consistente!

#motivação #consistência #sucesso`,

  `🌟 MOTIVAÇÃO DO DIA:

"Você é mais inteligente do que pensa. Você só não se deu a chance."

Estude, aprenda, cresça. Você é capaz.

🧠 Acredite em si!

#motivação #inteligência #aprendizado`,

  `🌟 MOTIVAÇÃO DO DIA:

"Pedir ajuda não é fraqueza, é estratégia."

Você não precisa fazer tudo sozinho. Comunidade existe.

🤝 Peça ajuda!

#motivação #comunidade #força`,

  `🌟 MOTIVAÇÃO DO DIA:

"Cada centavo poupado hoje é liberdade amanhã."

Paciência financeira = liberdade futura.

💵 Economize!

#motivação #finanças #futuro`,

  `🌟 MOTIVAÇÃO DO DIA:

"Você não é o que você fez errado, você é o que fez depois disso."

Redenção existe. Mude agora.

♻️ Recomeço!

#motivação #redenção #mudança`,

  `🌟 MOTIVAÇÃO DO DIA:

"A melhor hora para começar foi ontem. A segunda melhor é agora."

Pare de esperar. O momento é hoje.

⏱️ Comece agora!

#motivação #ação #tempo`,

  `🌟 MOTIVAÇÃO DO DIA:

"Você sobreviveu a 100% do seu piores momentos. Você é invencível."

O histórico prova sua força. Confie nisso.

🛡️ Você sobrevive!

#motivação #força #resiliência`,

  `🌟 MOTIVAÇÃO DO DIA:

"Resultado = Esforço × Tempo × Consistência"

Não é mágica, é fórmula. Faça as contas corretas.

➗ Use a fórmula!

#motivação #resultado #fórmula`,

  `🌟 MOTIVAÇÃO DO DIA:

"Seu vale mais que seus piores momentos."

Um mau dia não define uma vida boa. Siga em frente.

📍 Valor permanente!

#motivação #valor #perspectiva`,

  `🌟 MOTIVAÇÃO DO DIA:

"Quem você será é resultado de decisões que toma hoje."

Você está se construindo agora. Construa bem.

🔨 Construa!

#motivação #decisões #futuro`,

  `🌟 MOTIVAÇÃO DO DIA:

"Mudança é desconfortável, mas ela é necessária."

Crescimento não acontece na zona de conforto.

🌳 Cresça!

#motivação #mudança #crescimento`,

  `🌟 MOTIVAÇÃO DO DIA:

"Você não pode controlar tudo. Mas pode controlar seu esforço."

Foque no controlável. Solte o resto.

🎯 Foco!

#motivação #controle #esforço`,

  `🌟 MOTIVAÇÃO DO DIA:

"Sua história não terminou. Você ainda tem capítulos incríveis pra escrever."

Melhor ainda vem. Acredite.

📖 Sua história!

#motivação #história #futuro`,

  `🌟 MOTIVAÇÃO DO DIA:

"Você é o herói da sua própria história."

Não espere herói externo. Seja você.

🦸 Seja herói!

#motivação #agência #poder`,

  `🌟 MOTIVAÇÃO DO DIA:

"Pequenas ações consistentes criam resultados extraordinários."

Gigantismo é mito. Rotina é verdade.

🎬 Rotina wins!

#motivação #rotina #consistência`,

  `🌟 MOTIVAÇÃO DO DIA:

"Você merece descanso. Você merece felicidade. Você merece sucesso."

Pare de questionar seu valor. Você vale.

✨ Você merece!

#motivação #valor #merecimento`,

  `🌟 MOTIVAÇÃO DO DIA:

"Falhar é normal. Ficar caído não é."

Levante-se. Sempre. De novo.

🔄 Levante!

#motivação #resiliência #superação`,

  `🌟 MOTIVAÇÃO DO DIA:

"Você não precisa ser famoso para ser significante."

Significância é local. Impacte quem está perto.

🌟 Seja significante!

#motivação #significância #impacto`,

  `🌟 MOTIVAÇÃO DO DIA:

"Educação não termina na escola. Aprenda para sempre."

Aprendizado contínuo = vantagem eterna.

📚 Sempre aprenda!

#motivação #aprendizado #educação`,

  `🌟 MOTIVAÇÃO DO DIA:

"Você é mais feliz quando está progredindo. Então progride."

Estagnação mata felicidade. Mova-se.

📈 Progresse!

#motivação #progresso #felicidade`,

  `🌟 MOTIVAÇÃO DO DIA:

"Seu potencial é infinito. Seus limites são imaginários."

O único teto é aquele que você aceita.

🚀 Voe alto!

#motivação #potencial #limites`,

  `🌟 MOTIVAÇÃO DO DIA:

"Comparação rouba alegria. Foque apenas em você."

Sua jornada é pessoal. Corra sua corrida.

🏃 Sua corrida!

#motivação #comparação #foco`,
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
  const USERNAME = 'erikafvp';
  const NOME     = 'Érika';
  const BIO      = 'Dose diária de motivação 💪 Porque todo mundo precisa de um empurrão';
  const EMOJI    = '👩';

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

async function publicarMotivacao(uid, token) {
  const diaAtual = Math.floor(Date.now() / 86400000);
  const texto = MOTIVACOES[diaAtual % MOTIVACOES.length];

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
  console.log('🤖 Bot Motivação iniciando...');

  if (!FIREBASE_API_KEY || !BOT_EMAIL || !BOT_PASSWORD) {
    throw new Error('Variáveis de ambiente faltando: FIREBASE_API_KEY, BOT_MOTIVACAO_EMAIL, BOT_MOTIVACAO_PASSWORD');
  }

  const { idToken, localId } = await signIn();
  console.log('✅ Login OK — UID:', localId);

  await ensureProfile(localId, idToken);

  const jaPostou = await jaPostouHoje(localId, idToken);
  if (jaPostou) {
    console.log('⏭️ Já postou hoje. Pulando.');
    return;
  }

  const texto = await publicarMotivacao(localId, idToken);
  await marcarPostoHoje(localId, idToken);
  console.log('✅ Postado com sucesso!');
  console.log('📝', texto.split('\n')[0]);
}

main().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
