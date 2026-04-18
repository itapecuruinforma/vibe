// ============================================================
// BOT — Vibe Curiosidades
// Posta uma curiosidade diferente todo dia no feed da Vibe
// Roda via GitHub Actions (cron diário)
// ============================================================

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const DB_URL           = 'https://controle-de-gasto-fc4e0-default-rtdb.firebaseio.com';
const BOT_EMAIL        = process.env.BOT_CURIOSIDADES_EMAIL;
const BOT_PASSWORD     = process.env.BOT_CURIOSIDADES_PASSWORD;

// ---- 50 curiosidades (cicla a cada 50 dias) ----------------
const CURIOSIDADES = [
  `💡 A Torre Eiffel cresce cerca de 15 cm no verão. O calor faz o ferro dilatar — e ela encolhe de volta no inverno.

#curiosidade #ciência #vibe`,

  `💡 Os polvos têm três corações: dois bombeiam sangue para as brânquias e um para o resto do corpo. E o sangue deles é azul.

#curiosidade #animais #vibe`,

  `💡 Mel nunca estraga. Arqueólogos encontraram mel com 3.000 anos nas pirâmides do Egito — ainda comestível.

#curiosidade #história #vibe`,

  `💡 Os flamingos nascem com penas cinzas. A cor rosa vem dos carotenoides dos camarões e algas que eles comem ao longo da vida.

#curiosidade #animais #vibe`,

  `💡 Se você removesse todo o espaço vazio entre os átomos do corpo humano, toda a humanidade caberia em um cubo de açúcar.

#curiosidade #física #vibe`,

  `💡 Um caracol pode dormir por até 3 anos durante períodos de seca ou frio extremo. Quando as condições melhoram, ele acorda normalmente.

#curiosidade #animais #vibe`,

  `💡 Os golfinhos dormem com apenas metade do cérebro de cada vez. A outra metade fica acordada para eles continuarem respirando.

#curiosidade #animais #ciência #vibe`,

  `💡 O cérebro humano usa cerca de 20% de toda a energia do corpo, mesmo pesando apenas 2% do peso total.

#curiosidade #corpo #ciência #vibe`,

  `💡 Oxford University é mais antiga que os impérios asteca e inca. Foi fundada em 1096 d.C., séculos antes das civilizações americanas floresceram.

#curiosidade #história #vibe`,

  `💡 A Lua se afasta da Terra cerca de 3,8 cm por ano. Daqui a 600 milhões de anos não haverá mais eclipses solares totais.

#curiosidade #espaço #vibe`,

  `💡 O coração humano gera pressão suficiente para jorrar sangue a mais de 9 metros de distância. É uma das bombas mais eficientes da natureza.

#curiosidade #corpo #ciência #vibe`,

  `💡 Um dia em Vênus é mais longo que um ano em Vênus. Ele leva mais tempo para girar em torno do próprio eixo do que para orbitar o Sol.

#curiosidade #espaço #vibe`,

  `💡 Os cogumelos compartilham mais DNA com os humanos do que com as plantas. Eles são, evolutivamente, nossos parentes distantes.

#curiosidade #ciência #natureza #vibe`,

  `💡 A palavra "robô" veio de uma peça de teatro tcheca de 1920. Em tcheco, "robota" significa "trabalho forçado".

#curiosidade #tecnologia #história #vibe`,

  `💡 O Brasil abriga cerca de 60% de toda a Floresta Amazônica do planeta. Somos guardiões do maior bioma tropical do mundo.

#curiosidade #brasil #natureza #vibe`,

  `💡 Saturno tem densidade tão baixa que flutuaria na água — se existisse um oceano grande o suficiente para colocá-lo.

#curiosidade #espaço #vibe`,

  `💡 Existem mais estrelas no universo do que grãos de areia em todas as praias e desertos da Terra somados.

#curiosidade #espaço #vibe`,

  `💡 O e-mail é mais antigo que a internet. Foi criado em 1971 por Ray Tomlinson — anos antes da World Wide Web existir.

#curiosidade #tecnologia #história #vibe`,

  `💡 Um raio contém energia suficiente para torrar cerca de 100.000 torradas. O problema é captá-la de forma útil.

#curiosidade #ciência #vibe`,

  `💡 A Grande Muralha da China não é visível a olho nu do espaço. É um dos maiores mitos populares da ciência moderna.

#curiosidade #história #vibe`,

  `💡 O nariz humano consegue detectar mais de 1 trilhão de odores diferentes. Mas curiosamente mal conseguimos nomear metade deles.

#curiosidade #corpo #ciência #vibe`,

  `💡 A Antártida é tecnicamente o maior deserto do mundo. Ela recebe menos precipitação anual do que o Deserto do Saara.

#curiosidade #geografia #natureza #vibe`,

  `💡 O primeiro SMS da história foi enviado em 3 de dezembro de 1992. A mensagem era simples: "Merry Christmas".

#curiosidade #tecnologia #história #vibe`,

  `💡 Cleopatra viveu mais perto no tempo da Pizza Hut do que das Pirâmides do Egito. As pirâmides já tinham 2.500 anos quando ela nasceu.

#curiosidade #história #vibe`,

  `💡 O Rio Amazonas libera no oceano cerca de 20% de toda a água doce despejada pelos rios do mundo — sozinho.

#curiosidade #brasil #natureza #vibe`,

  `💡 Um colibri bate as asas até 80 vezes por segundo. Seu coração chega a 1.200 batimentos por minuto em pleno voo.

#curiosidade #animais #natureza #vibe`,

  `💡 Os ossos humanos são mais resistentes que o concreto. Um fêmur suporta até 4 vezes mais compressão antes de quebrar.

#curiosidade #corpo #ciência #vibe`,

  `💡 A velocidade da luz percorre a circunferência da Terra 7 vezes em apenas 1 segundo — 300.000 km/s.

#curiosidade #física #ciência #vibe`,

  `💡 O nome "Brasil" provavelmente vem da árvore pau-brasil, usada pelos colonizadores para extrair corante vermelho.

#curiosidade #brasil #história #vibe`,

  `💡 Cada ser humano tem uma impressão de língua única, assim como as digitais dos dedos. Não existem duas iguais no mundo.

#curiosidade #corpo #ciência #vibe`,

  `💡 O polvo tem sangue azul porque usa hemocianina (com cobre) em vez de hemoglobina (com ferro) para transportar oxigênio.

#curiosidade #animais #ciência #vibe`,

  `💡 Os elefantes têm rituais fúnebres. Eles ficam horas ao redor dos seus mortos, tocando os ossos com a tromba.

#curiosidade #animais #natureza #vibe`,

  `💡 A Torre de Pisa não foi construída torta. Ela começou a inclinar durante a própria construção por causa do solo mole.

#curiosidade #história #vibe`,

  `💡 O código QR foi inventado no Japão em 1994 para rastrear peças de automóveis nas fábricas. Hoje está em tudo.

#curiosidade #tecnologia #história #vibe`,

  `💡 O mandarim é o idioma com mais falantes nativos no mundo. O inglês fica apenas em 3º lugar, atrás do espanhol.

#curiosidade #linguagem #cultura #vibe`,

  `💡 O Sol consome aproximadamente 620 milhões de toneladas de hidrogênio por segundo para gerar sua energia.

#curiosidade #espaço #ciência #vibe`,

  `💡 Manaus tem um teatro de ópera inaugurado em 1896, no coração da Amazônia. O Teatro Amazonas é uma das obras mais surpreendentes do Brasil.

#curiosidade #brasil #cultura #vibe`,

  `💡 O olho humano consegue distinguir cerca de 10 milhões de tonalidades de cores diferentes — mas não temos nome para todas.

#curiosidade #corpo #ciência #vibe`,

  `💡 Os elefantes têm medo de abelhas. Apicultores africanos usam colmeias como cerca para proteger plantações de elefantes invasores.

#curiosidade #animais #natureza #vibe`,

  `💡 A primeira fotografia da história foi tirada em 1826 por Nicéphore Niépce — e exigiu 8 horas de exposição à luz.

#curiosidade #história #tecnologia #vibe`,

  `💡 O coração de um camarão fica na cabeça — mais precisamente na região chamada cefalotórax.

#curiosidade #animais #ciência #vibe`,

  `💡 Ratos riem. Eles emitem sons de ultrassom que equivalem a gargalhadas quando fazem cócegas neles.

#curiosidade #animais #ciência #vibe`,

  `💡 O Brasil é o maior produtor e exportador de café do mundo há mais de 150 anos consecutivos.

#curiosidade #brasil #cultura #vibe`,

  `💡 O caracol de jardim tem cerca de 14.175 dentes, todos dispostos numa estrutura chamada rádula — sua "língua dentada".

#curiosidade #animais #natureza #vibe`,

  `💡 O céu de Marte ao entardecer é azul — exatamente o oposto do nosso, que fica laranja. As partículas de poeira invertem as cores.

#curiosidade #espaço #ciência #vibe`,

  `💡 Um polvinho recém-nascido tem menos de 3 mm — cabe numa colher de chá. E já nasce completamente independente da mãe.

#curiosidade #animais #natureza #vibe`,

  `💡 A Lua tem terremotos chamados "moonquakes". Eles duram muito mais que os da Terra porque não há água para amortecer as vibrações.

#curiosidade #espaço #ciência #vibe`,

  `💡 O WiFi foi desenvolvido acidentalmente. A tecnologia surgiu de pesquisas sobre detecção de mini buracos negros na Austrália nos anos 1990.

#curiosidade #tecnologia #história #vibe`,

  `💡 O Brasil é o único país das Américas que fala português. Todos os outros países da América do Sul falam espanhol.

#curiosidade #brasil #cultura #vibe`,

  `💡 Uma estrela de nêutrons tem densidade absurda — uma colher de chá do seu material pesaria cerca de 10 bilhões de toneladas.

#curiosidade #espaço #física #vibe`,

  `💡 As abelhas podem reconhecer rostos humanos. Elas usam o mesmo mecanismo cognitivo que nós para distinguir uma face da outra.

#curiosidade #animais #ciência #vibe`,
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
  const USERNAME = 'donagracas';
  const NOME     = 'Dona Graças';
  const BIO      = 'Curiosa desde criança 💡 Descobri uma nova hoje — vem ver!';
  const EMOJI    = '👵';

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

async function publicarCuriosidade(uid, token) {
  // Escolhe a curiosidade com base no dia atual (determinístico, sem repetir por 50 dias)
  const diaAtual = Math.floor(Date.now() / 86400000);
  const texto = CURIOSIDADES[diaAtual % CURIOSIDADES.length];

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
  console.log('🤖 Bot Curiosidades iniciando...');

  if (!FIREBASE_API_KEY || !BOT_EMAIL || !BOT_PASSWORD) {
    throw new Error('Variáveis de ambiente faltando: FIREBASE_API_KEY, BOT_CURIOSIDADES_EMAIL, BOT_CURIOSIDADES_PASSWORD');
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

  const texto = await publicarCuriosidade(localId, idToken);
  await marcarPostoHoje(localId, idToken);
  console.log('✅ Postado com sucesso!');
  console.log('📝', texto.split('\n')[0]);
}

main().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
