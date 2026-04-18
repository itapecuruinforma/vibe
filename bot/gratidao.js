// ============================================================
// BOT — Vibe Gratidão
// Posta mensagens diárias sobre gratidão e mindfulness
// Roda via GitHub Actions (cron diário)
// ============================================================

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const DB_URL           = 'https://controle-de-gasto-fc4e0-default-rtdb.firebaseio.com';
const BOT_EMAIL        = process.env.BOT_GRATIDAO_EMAIL;
const BOT_PASSWORD     = process.env.BOT_GRATIDAO_PASSWORD;

// ---- 50 mensagens de gratidão (cicla a cada 50 dias) ----------------
const MENSAGENS = [
  `🙏 Hoje eu sou grato por estar vivo.

Respirar, sentir, existir — já é um presente. Muita gente não terá esse privilégio amanhã.

#gratidão #mindfulness #vibe`,

  `🙏 Liste mentalmente 3 coisas boas que aconteceram hoje.

Por menores que pareçam. O cérebro muda quando você treina ele a enxergar o bom.

#gratidão #psicologia #vibe`,

  `🙏 A gratidão é o remédio mais barato e mais eficaz contra ansiedade.

Estudos mostram que agradecer diariamente reduz cortisol em até 23%.

#gratidão #saúdemental #vibe`,

  `🙏 Você acordou hoje. Alguém não teve essa chance.

Respeite o milagre de estar vivo. Faça dele algo bonito.

#gratidão #reflexão #vibe`,

  `🙏 Gratidão não é receber o que você quer.

É perceber o quanto você já tem — e quase não notava.

#gratidão #mindfulness #vibe`,

  `🙏 Agradeça pela chuva que molha seu cabelo.

Alguém no deserto paga caro pelo que você reclama.

#gratidão #perspectiva #vibe`,

  `🙏 Sua barriga cheia é privilégio.

1 em cada 10 pessoas no mundo vai dormir com fome hoje. Não desperdice nada.

#gratidão #realidade #vibe`,

  `🙏 A pessoa que te irritou hoje é professora.

Ela está mostrando onde você ainda precisa trabalhar dentro de si.

#gratidão #crescimento #vibe`,

  `🙏 Você está lendo este texto.

Isso significa: tem olhos, tem cérebro funcional, tem tempo livre, tem internet. Quatro milagres simultâneos.

#gratidão #perspectiva #vibe`,

  `🙏 Gratidão transforma o pouco em suficiente.

E o suficiente em abundância. Todo dia pratique.

#gratidão #mindset #vibe`,

  `🙏 Agradeça pelos problemas que você tem.

Eles significam que você está vivo e ainda tem coisas para resolver. Isso é um bom sinal.

#gratidão #reflexão #vibe`,

  `🙏 A pessoa que te ligou hoje escolheu você.

Entre milhares de contatos, pensou em você. Isso é amor em forma silenciosa.

#gratidão #relacionamentos #vibe`,

  `🙏 Quando você reclama, o universo entende "envia mais disso".

Quando agradece, o universo entende "manda mais". Teste 30 dias.

#gratidão #lei-da-atração #vibe`,

  `🙏 Seu corpo te obedeceu hoje.

Levantou, caminhou, respirou, pensou — sem reclamar. Agradeça antes de cobrar dele.

#gratidão #corpo #vibe`,

  `🙏 Se você tem um teto, comida e saúde — você é mais rico que 75% da humanidade.

Lembre disso antes de reclamar do básico.

#gratidão #riqueza #vibe`,

  `🙏 Agradecer é o oposto de comparar.

Comparação rouba alegria. Gratidão devolve. Escolha qual você quer cultivar.

#gratidão #psicologia #vibe`,

  `🙏 Hoje alguém rezou por você — e você nem sabe.

Isso é amor silencioso. Retribua sem precisar saber quem foi.

#gratidão #espiritualidade #vibe`,

  `🙏 A vida não te deve nada.

Tudo que ela te dá é bônus. Essa perspectiva muda tudo.

#gratidão #realidade #vibe`,

  `🙏 Suas mãos escreveram, seguraram, abraçaram hoje.

Agradeça a elas. Tem gente que gostaria de ter só 1 dia com as suas.

#gratidão #corpo #vibe`,

  `🙏 O café que você tomou hoje veio de muita gente.

Lavrador, motorista, torrefador, vendedor. Toda uma cadeia para você sentir um sabor.

#gratidão #perspectiva #vibe`,

  `🙏 Gratidão é memória do coração.

Quanto mais você agradece, mais sua vida se torna inesquecível.

#gratidão #reflexão #vibe`,

  `🙏 Agradeça a quem te magoou.

Eles te deram força, sabedoria e limites que hoje te protegem. Isso também é lição.

#gratidão #maturidade #vibe`,

  `🙏 O sol raiou hoje — mais uma vez — só pra você.

8 bilhões de pessoas e ele também aparece pra você. Não é loucura isso?

#gratidão #natureza #vibe`,

  `🙏 Você conseguiu dormir.

Milhões sofrem de insônia crônica. Sua cama é um presente raro.

#gratidão #sono #vibe`,

  `🙏 Seus pais escolheram te trazer ao mundo.

Independente de como tenha sido, sem essa escolha você não existiria. Isso merece reflexão.

#gratidão #família #vibe`,

  `🙏 Agradeça por ter voz.

Tem gente muda, tem gente silenciada. Sua voz é privilégio — use com propósito.

#gratidão #poder #vibe`,

  `🙏 Lembra daquela dor do ano passado?

Você superou. Vai superar a de hoje também. Gratidão também é confiar na sua história.

#gratidão #superação #vibe`,

  `🙏 Gratidão antes de dormir = sono melhor.

Ciência já comprovou. Anote 3 coisas boas antes de deitar esta noite.

#gratidão #sono #vibe`,

  `🙏 Agradeça pelas pessoas que saíram da sua vida.

Elas abriram espaço para as certas chegarem. Tudo tem seu tempo.

#gratidão #relacionamentos #vibe`,

  `🙏 A plantinha da sua casa agradece a água de todo dia.

As pessoas também. Regue quem você ama — com palavras, tempo, atenção.

#gratidão #amor #vibe`,

  `🙏 Você tem o luxo de escolher o que comer amanhã.

Para 800 milhões de pessoas, isso é um sonho distante. Não desperdice esse privilégio.

#gratidão #realidade #vibe`,

  `🙏 O professor que mudou sua vida provavelmente não sabe disso.

Mande uma mensagem agradecendo. Vai ser o presente da semana dele.

#gratidão #gestos #vibe`,

  `🙏 O silêncio também merece gratidão.

Em um mundo barulhento, encontrar silêncio é riqueza rara.

#gratidão #mindfulness #vibe`,

  `🙏 Agradeça por cada "não" que você recebeu.

Cada recusa te levou mais perto do "sim" certo. O universo tem timing.

#gratidão #destino #vibe`,

  `🙏 Quem acorda reclamando programa o dia pra dar errado.

Quem acorda agradecendo, programa o dia pra dar certo. Escolha sábia.

#gratidão #mindset #vibe`,

  `🙏 Sua cabeça tem seu próprio travesseiro todas as noites.

Tem gente dormindo na calçada. Gratidão pelo básico muda tudo.

#gratidão #realidade #vibe`,

  `🙏 O sorriso de um estranho hoje foi um presente.

Perceba, devolva, propague. Gentileza é viral quando alimentada.

#gratidão #gentileza #vibe`,

  `🙏 Agradeça ao corpo antes de exigir dele.

Se quer começar uma atividade física, comece dizendo "obrigado". Ele responde melhor.

#gratidão #corpo #vibe`,

  `🙏 Gratidão é a forma mais alta de oração.

Não pedir — agradecer. Isso muda tudo na sua conexão com o sagrado.

#gratidão #espiritualidade #vibe`,

  `🙏 A natureza te dá oxigênio grátis.

Imagine se você tivesse que pagar por cada respiração? Respire profundo e agradeça.

#gratidão #natureza #vibe`,

  `🙏 Você ama alguém e alguém te ama.

Mesmo que discretamente. Isso é ter vencido na vida, ainda que você não perceba.

#gratidão #amor #vibe`,

  `🙏 Os momentos simples são os melhores.

Um café, uma música, uma conversa boba. Guarde essas coisas no peito.

#gratidão #simplicidade #vibe`,

  `🙏 Sua história tem valor.

Tudo que você viveu te trouxe até aqui. Honre o caminho, mesmo os trechos difíceis.

#gratidão #jornada #vibe`,

  `🙏 Agradecimento faz o cérebro produzir dopamina e serotonina.

Você está literalmente se autocurando. De graça. Simples assim.

#gratidão #neurociência #vibe`,

  `🙏 Se você tem alguém para abraçar, você é rico.

Solidão é uma pandemia silenciosa. Quem tem companhia nem sempre percebe o milagre.

#gratidão #relacionamentos #vibe`,

  `🙏 A comida do almoço foi plantada meses antes.

Alguém suou pra te alimentar hoje. Respeite, saboreie, agradeça.

#gratidão #alimentação #vibe`,

  `🙏 Você está a 1 decisão de uma vida diferente.

Essa liberdade é um privilégio moderno raro. Agradeça antes de procrastinar.

#gratidão #liberdade #vibe`,

  `🙏 Um bom amigo vale mais que 1000 seguidores.

Se você tem um só, agradeça. Isso é rara riqueza no século 21.

#gratidão #amizade #vibe`,

  `🙏 Seu smartphone tem mais poder computacional que os computadores que levaram o homem à Lua.

E você usa ele pra reclamar. Agradeça o milagre que tem na palma da mão.

#gratidão #tecnologia #vibe`,

  `🙏 A cada manhã a vida te dá mais uma chance.

Não jogue fora. Faça hoje o que ontem você não fez. Gratidão em ação.

#gratidão #novo-começo #vibe`,
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
  const USERNAME = 'gratidaodia';
  const NOME     = 'Gratidão Dia';
  const BIO      = 'Gratidão transforma o pouco em suficiente 🙏';
  const EMOJI    = '🙏';

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

async function publicarMensagem(uid, token) {
  const diaAtual = Math.floor(Date.now() / 86400000);
  const texto = MENSAGENS[diaAtual % MENSAGENS.length];

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
  console.log('🤖 Bot Gratidão iniciando...');

  if (!FIREBASE_API_KEY || !BOT_EMAIL || !BOT_PASSWORD) {
    throw new Error('Variáveis de ambiente faltando: FIREBASE_API_KEY, BOT_GRATIDAO_EMAIL, BOT_GRATIDAO_PASSWORD');
  }

  const { idToken, localId } = await signIn();
  console.log('✅ Login OK — UID:', localId);

  await ensureProfile(localId, idToken);

  const jaPostou = await jaPostouHoje(localId, idToken);
  if (jaPostou) {
    console.log('⏭️ Já postou hoje. Pulando.');
    return;
  }

  const texto = await publicarMensagem(localId, idToken);
  await marcarPostoHoje(localId, idToken);
  console.log('✅ Postado com sucesso!');
  console.log('📝', texto.split('\n')[0]);
}

main().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
