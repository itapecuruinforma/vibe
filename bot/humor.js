// ============================================================
// BOT — Vibe Humor
// Posta tirinhas, piadas curtas e humor inteligente
// Roda via GitHub Actions (cron diário)
// ============================================================

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const DB_URL           = 'https://controle-de-gasto-fc4e0-default-rtdb.firebaseio.com';
const BOT_EMAIL        = process.env.BOT_HUMOR_EMAIL;
const BOT_PASSWORD     = process.env.BOT_HUMOR_PASSWORD;

// ---- 50 piadas/humor curto (cicla a cada 50 dias) ----------------
const PIADAS = [
  `😂 Meu alarme toca às 6h. Eu acordo às 9h. Não sei como o tempo está conseguindo fazer isso com a matemática.

#humor #vida #vibe`,

  `😂 Cafeína: a razão pela qual eu sou funcionário em vez de criminoso.

#humor #café #vibe`,

  `😂 Hoje eu fiz tanto exercício físico que nem sei mais onde estão doendo as partes que nem sabia que existiam.

#humor #academia #vibe`,

  `😂 Adulto é quem compra detergente e fica feliz com o desconto.

#humor #adulto #vibe`,

  `😂 Meu plano era ser produtivo hoje. Meu segundo plano é pedir desculpas amanhã pelo primeiro não ter dado certo.

#humor #procrastinação #vibe`,

  `😂 Dinheiro não traz felicidade — mas traz comida. E comida me faz feliz. Então...

#humor #lógica #vibe`,

  `😂 O Wi-Fi caiu e agora eu estou conversando com as pessoas da minha casa. Horrível. Horrível mesmo.

#humor #tecnologia #vibe`,

  `😂 Amigo: "Você devia correr mais."
Eu: "Corro. Dos problemas."

#humor #sincero #vibe`,

  `😂 Minha dieta é interrompida apenas pelas refeições.

#humor #comida #vibe`,

  `😂 Gente, eu não tô brava, só tá chapado meu tom de voz.

#humor #feminino #vibe`,

  `😂 Bate foto minha sem avisar — automaticamente você vira meu inimigo mortal.

#humor #fotos #vibe`,

  `😂 O adulto começou quando comecei a achar ridículo o preço do supermercado.

#humor #maturidade #vibe`,

  `😂 "Você tá cansado?" Não, eu só tô com cara de quem aguenta mais 15 reuniões desnecessárias.

#humor #trabalho #vibe`,

  `😂 Meu pet me olha como se eu fosse a pessoa mais inteligente do mundo. Eu não discordo.

#humor #pets #vibe`,

  `😂 Diz aí: a sua mãe ligou hoje? Corre lá, só pra ter certeza.

#humor #família #vibe`,

  `😂 Não sei quem tá mais perdido: eu ou o Google quando pesquiso algo às 3 da manhã.

#humor #insônia #vibe`,

  `😂 Segunda-feira é só um contrato que eu não assinei mas tô sendo obrigada a cumprir.

#humor #segunda #vibe`,

  `😂 Cancelar plano é a terapia mais barata do mercado.

#humor #introvertido #vibe`,

  `😂 Meu sonho é ganhar tanto dinheiro que eu possa pagar alguém pra ser produtivo por mim.

#humor #trabalho #vibe`,

  `😂 A caixa do correio chegou. Abri. Era conta. Quero devolver.

#humor #adulto #vibe`,

  `😂 Eu tô vivo. Isso já é uma grande realização essa semana.

#humor #vida #vibe`,

  `😂 Estou numa dieta emocional: como tudo que aparece na minha frente quando estou triste.

#humor #alimentação #vibe`,

  `😂 Dormir é o meu hobby favorito. Também o mais barato.

#humor #sono #vibe`,

  `😂 Cada vez que vou dormir cedo, o universo me envia 17 pensamentos aleatórios às 3 da manhã.

#humor #insônia #vibe`,

  `😂 Comecei a semana com energia. Perdi na terça. Se alguém encontrar, devolve.

#humor #semana #vibe`,

  `😂 O gato da minha casa entende português melhor que meu marido.

#humor #pets #vibe`,

  `😂 "Faça algo que você ama." Amo dormir. Me pagam pra isso? Não? Então voltamos ao trabalho.

#humor #trabalho #vibe`,

  `😂 Eu não sou preguiçoso, estou em modo economia de energia.

#humor #preguiça #vibe`,

  `😂 Meu pai me ensinou duas coisas: respeitar os mais velhos e que o seu dinheiro nunca é nosso dinheiro.

#humor #família #vibe`,

  `😂 A grama do vizinho pode ser mais verde, mas a conta de água é maior. Fica aí na tua grama seca mesmo.

#humor #vida #vibe`,

  `😂 Acordei inspirada hoje. Fui pra cama de novo. Inspiração requer sono.

#humor #manhã #vibe`,

  `😂 Eu: vou dormir cedo hoje.
Meu cérebro às 23h: e se aquela música dos anos 2000...

#humor #insônia #vibe`,

  `😂 Exercício? Faço sim. Levanto a colher do prato até a boca com total dedicação.

#humor #academia #vibe`,

  `😂 Se "beleza interior" contasse, meu armário bagunçado seria lindo.

#humor #bagunça #vibe`,

  `😂 Sexta-feira: único dia em que "vou dormir cedo" significa "depois das 2 da manhã".

#humor #fim-de-semana #vibe`,

  `😂 Quando falo sozinha, estou tendo uma reunião com minha melhor conselheira.

#humor #solitário #vibe`,

  `😂 Esperança é entrar no supermercado com 50 reais e sair pensando que vai dar pra comprar a semana toda.

#humor #supermercado #vibe`,

  `😂 Minha memória é seletiva: letra de música dos anos 90 eu decoro. Onde deixei a chave do carro há 5 minutos, não.

#humor #memória #vibe`,

  `😂 Adulto: ficar feliz quando a roupa ainda cabe depois da secadora.

#humor #adulto #vibe`,

  `😂 Gasta R$200 no iFood mas economiza R$3 no estacionamento. Somos assim mesmo.

#humor #dinheiro #vibe`,

  `😂 Vou te contar uma mentira: "só mais 5 minutinhos no celular".

#humor #celular #vibe`,

  `😂 O que me mantém viva é o próximo fim de semana.

#humor #trabalho #vibe`,

  `😂 Tô com tanto sono que até meu sonho tá dormindo.

#humor #cansaço #vibe`,

  `😂 Tentei ler um livro de autoajuda. Ele me abandonou.

#humor #livros #vibe`,

  `😂 Meu batom dura mais que minha paciência em reuniões de família.

#humor #batom #vibe`,

  `😂 Comi tão bem hoje que nem minha alma quer fazer exercício.

#humor #comida #vibe`,

  `😂 Toda vez que alguém me pergunta "tá tudo bem?" eu travo igual Windows 98.

#humor #ansiedade #vibe`,

  `😂 Eu não uso despertador. Uso um misto de ansiedade matinal com dor nas costas.

#humor #manhã #vibe`,

  `😂 Na balança de ontem: -2kg. Na balança de hoje: +3kg. Quem faz essas contas, me explica.

#humor #balança #vibe`,

  `😂 Amigo de verdade é aquele que conhece todas as suas histórias embaraçosas e mesmo assim continua te chamando em público.

#humor #amizade #vibe`,
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
  const USERNAME = 'rexm';
  const NOME     = 'Rex';
  const BIO      = 'Humor pra espantar o cinza do dia 😂 Um sorriso por dia';
  const EMOJI    = '😂';

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

async function publicarPiada(uid, token) {
  const diaAtual = Math.floor(Date.now() / 86400000);
  const texto = PIADAS[diaAtual % PIADAS.length];

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
  console.log('🤖 Bot Humor iniciando...');

  if (!FIREBASE_API_KEY || !BOT_EMAIL || !BOT_PASSWORD) {
    throw new Error('Variáveis de ambiente faltando: FIREBASE_API_KEY, BOT_HUMOR_EMAIL, BOT_HUMOR_PASSWORD');
  }

  const { idToken, localId } = await signIn();
  console.log('✅ Login OK — UID:', localId);

  await ensureProfile(localId, idToken);

  const jaPostou = await jaPostouHoje(localId, idToken);
  if (jaPostou) {
    console.log('⏭️ Já postou hoje. Pulando.');
    return;
  }

  const texto = await publicarPiada(localId, idToken);
  await marcarPostoHoje(localId, idToken);
  console.log('✅ Postado com sucesso!');
  console.log('📝', texto.split('\n')[0]);
}

main().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
