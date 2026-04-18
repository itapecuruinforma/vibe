// ============================================================
// BOT — Vibe Perguntas
// Posta perguntas para gerar discussão no feed
// Roda via GitHub Actions (cron diário, 2h após enigmas)
// ============================================================

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const DB_URL           = 'https://controle-de-gasto-fc4e0-default-rtdb.firebaseio.com';
const BOT_EMAIL        = process.env.BOT_EMAIL;
const BOT_PASSWORD     = process.env.BOT_PASSWORD;

// ---- 50 perguntas para engajar (cicla a cada 50 dias) ----------------
const PERGUNTAS = [
  `❓ PERGUNTA DO DIA:

"Se você pudesse voltar no tempo e dar um conselho para seu 'eu' do passado, qual seria?"

💬 Comenta abaixo! Vamos aprender com nossas histórias.

#pergunta #reflexão #sabedoria`,

  `❓ PERGUNTA DO DIA:

"Qual foi o melhor conselho que você já recebeu?"

💬 Compartilhe! Pode ajudar alguém aqui.

#pergunta #conselho #comunidade`,

  `❓ PERGUNTA DO DIA:

"Qual é sua maior medo e como você está lidando com ele?"

💬 Vulnerabilidade cria conexão. Comente!

#pergunta #medo #força`,

  `❓ PERGUNTA DO DIA:

"Se tivesse só 3 amigos de verdade, como seria sua vida?"

💬 Qualidade > Quantidade. Comente sua opinião!

#pergunta #amizade #reflexão`,

  `❓ PERGUNTA DO DIA:

"O que você faria se não tivesse medo?"

💬 Sonhe alto! O que mudaria?

#pergunta #sonho #coragem`,

  `❓ PERGUNTA DO DIA:

"Qual hobby você gostaria de começar, mas nunca começou? Por quê?"

💬 Talvez alguém aqui possa ajudar! Comente!

#pergunta #hobby #motivação`,

  `❓ PERGUNTA DO DIA:

"Como você define sucesso? Seu? Não o de outros."

💬 Cada um tem sua própria métrica. Qual é a sua?

#pergunta #sucesso #reflexão`,

  `❓ PERGUNTA DO DIA:

"Qual foi o erro que você cometeu e que fez você crescer mais?"

💬 Fracasso é aprendizado. Compartilhe!

#pergunta #crescimento #erros`,

  `❓ PERGUNTA DO DIA:

"Se você pudesse ter uma conversa com alguém famoso, com quem seria?"

💬 Que pergunta você faria? Comente!

#pergunta #inspiração #sonho`,

  `❓ PERGUNTA DO DIA:

"O que você faria diferente se soubesse que não fracassaria?"

💬 Elimina o medo. O que viria?

#pergunta #ousadia #reflexão`,

  `❓ PERGUNTA DO DIA:

"Qual valor é mais importante pra você: dinheiro, saúde, relacionamentos ou liberdade?"

💬 Nem sempre conseguemos tudo. Qual é sua prioridade?

#pergunta #valores #vida`,

  `❓ PERGUNTA DO DIA:

"Qual foi o melhor dia da sua vida? O que o tornou especial?"

💬 Vamos celebrar as alegrias! Comente!

#pergunta #gratidão #felicidade`,

  `❓ PERGUNTA DO DIA:

"Se pudesse pedir uma habilidade para ganhar amanhã, qual seria?"

💬 Que super poder você quer?

#pergunta #habilidade #sonho`,

  `❓ PERGUNTA DO DIA:

"Qual é a crença que você tinha e que mudou completamente?"

💬 Crescimento é deixar morrer o que era errado. Comente!

#pergunta #mentalidade #mudança`,

  `❓ PERGUNTA DO DIA:

"O que você faria se tivesse um dia extra por semana?"

💬 Tempo é ouro. Como você usaria?

#pergunta #tempo #prioridades`,

  `❓ PERGUNTA DO DIA:

"Qual pessoa na sua vida você menos aprecia, mas deveria apreciar?"

💬 Às vezes ignoramos os melhores. Comente!

#pergunta #gratidão #relacionamentos`,

  `❓ PERGUNTA DO DIA:

"Se tivesse que escolher: 1000 amigos superficiais ou 3 amigos profundos?"

💬 Qualidade sempre ganha. Sua escolha?

#pergunta #amizade #relacionamentos`,

  `❓ PERGUNTA DO DIA:

"Qual seria seu 'plano B' se seu plano A falhasse?"

💬 Sempre bom ter alternativa. Qual é a sua?

#pergunta #planejamento #estratégia`,

  `❓ PERGUNTA DO DIA:

"O que você sabe hoje que gostaria de ter sabido aos 16?"

💬 Experiência é ouro. Compartilhe seu saber!

#pergunta #sabedoria #experiência`,

  `❓ PERGUNTA DO DIA:

"Qual hábito você deseja quebrar? Por que é difícil?"

💬 Hábitos definem vidas. Qual está te prendendo?

#pergunta #hábitos #mudança`,

  `❓ PERGUNTA DO DIA:

"Se você tivesse só 5 anos de vida, o que faria diferente?"

💬 Perspectiva muda tudo. Que insight você tem?

#pergunta #perspectiva #prioridades`,

  `❓ PERGUNTA DO DIA:

"Qual foi seu maior aprendizado esse ano?"

💬 2026 já trouxe lições! Qual foi a sua?

#pergunta #aprendizado #reflexão`,

  `❓ PERGUNTA DO DIA:

"Qual é a coisa que você mais teme que as pessoas descubram sobre você?"

💬 Vulnerabilidade = força. Comente se quiser!

#pergunta #medo #autenticidade`,

  `❓ PERGUNTA DO DIA:

"Se você pudesse voltar 5 anos atrás, o que continuaria fazendo?"

💬 Às vezes continuidade é melhor que mudança. Comente!

#pergunta #reflexão #tempo`,

  `❓ PERGUNTA DO DIA:

"Qual pessoa mudou sua vida? Como?"

💬 Pessoas impactam. Reconheça quem impactou você!

#pergunta #impacto #gratidão`,

  `❓ PERGUNTA DO DIA:

"Se fosse uma cor, qual seria? Por quê?"

💬 Criatividade! Use a imaginação! Comente!

#pergunta #criatividade #diversão`,

  `❓ PERGUNTA DO DIA:

"Qual é o seu maior arrependimento? E o que aprendeu?"

💬 Arrependimento é professor. Comente!

#pergunta #crescimento #reflexão`,

  `❓ PERGUNTA DO DIA:

"Se tivesse que ensinar uma lição de vida, qual seria?"

💬 Você tem sabedoria. Compartilhe!

#pergunta #sabedoria #ensinamento`,

  `❓ PERGUNTA DO DIA:

"Qual foi a última coisa que fez você sorrir genuinamente?"

💬 Alegria é contagiante! Comente!

#pergunta #alegria #gratidão`,

  `❓ PERGUNTA DO DIA:

"Se você fosse mais você mesmo, o que mudaria?"

💬 Autenticidade liberta. Que mudaria?

#pergunta #autenticidade #coragem`,

  `❓ PERGUNTA DO DIA:

"Qual é a coisa mais importante que você aprendeu sobre si mesmo?"

💬 Autoconhecimento é poder. Comente!

#pergunta #autoconhecimento #reflexão`,

  `❓ PERGUNTA DO DIA:

"Se pudesse conversar com você mesmo em 10 anos, o que diria?"

💬 Futuro presentes. Que mensagem deixaria?

#pergunta #futuro #reflexão`,

  `❓ PERGUNTA DO DIA:

"Qual é a sua zona de conforto? Está pronto para sair dela?"

💬 Crescimento exige saída. Você está?

#pergunta #crescimento #desafio`,

  `❓ PERGUNTA DO DIA:

"Se dinheiro não fosse problema, o que você faria?"

💬 Sonho é o segredo. Qual é seu?

#pergunta #sonho #liberdade`,

  `❓ PERGUNTA DO DIA:

"Qual foi a melhor decisão que tomou? Como a tomou?"

💬 Decisões moldam vidas. Qual foi a sua melhor?

#pergunta #decisões #reflexão`,

  `❓ PERGUNTA DO DIA:

"Se você morresse amanhã, qual era seu legado?"

💬 Heavy, mas importante. Qual seria?

#pergunta #legado #propósito`,

  `❓ PERGUNTA DO DIA:

"Qual é a qualidade que você mais admira nos outros?"

💬 Admiração revela valores. Qual é a sua?

#pergunta #valores #admiração`,

  `❓ PERGUNTA DO DIA:

"Se você tivesse que reinventar sua vida, como seria?"

💬 Mudança é possível. Que versão você criaria?

#pergunta #recomeço #mudança`,

  `❓ PERGUNTA DO DIA:

"Qual pessoa muda a sua perspectiva só por estar perto?"

💬 Pessoas elevam pessoas. Quem faz isso com você?

#pergunta #influência #relacionamentos`,

  `❓ PERGUNTA DO DIA:

"O que você faria hoje se tivesse coragem?"

💬 Coragem é ação apesar do medo. Você teria?

#pergunta #coragem #ação`,

  `❓ PERGUNTA DO DIA:

"Qual é a melhor parte de ser você?"

💬 Auto-apreciação é importante. Qual é?

#pergunta #autoestima #reflexão`,

  `❓ PERGUNTA DO DIA:

"Se você pudesse mudar uma coisa no mundo, qual seria?"

💬 Impacto começa com desejo. O que mudaria?

#pergunta #impacto #mundo`,

  `❓ PERGUNTA DO DIA:

"Qual é a lição que a vida ainda não te ensinou, mas você sabe que virá?"

💬 Intuição sabe. Qual é essa lição?

#pergunta #intuição #sabedoria`,

  `❓ PERGUNTA DO DIA:

"Se você fosse aniversariante hoje, qual seria seu desejo?"

💬 Sonhos realizam! Qual é seu?

#pergunta #desejo #celebração`,

  `❓ PERGUNTA DO DIA:

"Qual é a coisa que você mais gosta de fazer? Faz tempo que não faz?"

💬 Reativate. O que você ama? Comente!

#pergunta #paixão #ação`,

  `❓ PERGUNTA DO DIA:

"Se você tivesse que descrever sua vida em 3 palavras, quais seriam?"

💬 Síntese revela valor. Quais são suas 3?

#pergunta #reflexão #vida`,
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
  const USERNAME = 'perguntasdia';
  const NOME     = 'Perguntas Dia';
  const BIO      = 'Perguntas que geram reflexão e conexão 💭';
  const EMOJI    = '❓';

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

async function publicarPergunta(uid, token) {
  const diaAtual = Math.floor(Date.now() / 86400000);
  const texto = PERGUNTAS[diaAtual % PERGUNTAS.length];

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
  console.log('🤖 Bot Perguntas iniciando...');

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

  const texto = await publicarPergunta(localId, idToken);
  await marcarPostoHoje(localId, idToken);
  console.log('✅ Postado com sucesso!');
  console.log('📝', texto.split('\n')[0]);
}

main().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
