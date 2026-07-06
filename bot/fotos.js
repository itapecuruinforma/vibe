// ============================================================
// BOT — Vibe Fotos
// Posta uma foto diferente todo dia no feed da Vibe.
// Fase 1 (simples): puxa uma imagem do Unsplash por tema e monta
// uma legenda em português + crédito ao fotógrafo.
// (Futuro: pipeline multi-IA via n8n — geração + análise + legenda.)
// Roda via GitHub Actions (cron diário).
// ============================================================

const FIREBASE_API_KEY    = process.env.FIREBASE_API_KEY;
const DB_URL              = 'https://controle-de-gasto-fc4e0-default-rtdb.firebaseio.com';
const BOT_EMAIL           = process.env.BOT_FOTOS_EMAIL;
const BOT_PASSWORD        = process.env.BOT_FOTOS_PASSWORD;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// ---- Temas (query em inglês p/ Unsplash + legenda em português) ----
// Cicla a cada N dias de forma determinística (sem repetir tema seguido).
const TEMAS = [
  { query: 'nature landscape',    tag: 'natureza',   legenda: 'A natureza sempre dá um jeito de lembrar a gente do que importa. 🌿' },
  { query: 'sunset sky',          tag: 'pordosol',   legenda: 'Todo fim de dia é um recomeço disfarçado. 🌅' },
  { query: 'ocean beach',         tag: 'praia',      legenda: 'O mar não tem pressa — e ainda assim chega em todo lugar. 🌊' },
  { query: 'mountain landscape',  tag: 'montanha',   legenda: 'Às vezes a vista mais bonita vem depois da subida mais difícil. ⛰️' },
  { query: 'flowers bloom',       tag: 'flores',     legenda: 'Floresça no seu tempo. Ninguém apressa uma primavera. 🌸' },
  { query: 'forest green',        tag: 'floresta',   legenda: 'Respira fundo. A floresta faz isso o dia inteiro. 🌳' },
  { query: 'starry night sky',    tag: 'ceu',        legenda: 'Olhar pro céu à noite é lembrar do tamanho das coisas. ✨' },
  { query: 'rain window',         tag: 'chuva',      legenda: 'Tem dia que a melhor companhia é o barulho da chuva. 🌧️' },
  { query: 'green fields',        tag: 'campo',      legenda: 'O verde do campo acalma qualquer pressa. 🌾' },
  { query: 'lake reflection',     tag: 'lago',       legenda: 'Um lago parado é a natureza pedindo pra você respirar. 🏞️' },
  { query: 'desert dunes',        tag: 'deserto',    legenda: 'Até o silêncio do deserto tem sua própria beleza. 🏜️' },
  { query: 'autumn leaves',       tag: 'outono',     legenda: 'Aprender a soltar também é uma forma de crescer. 🍂' },
  { query: 'waterfall nature',    tag: 'cachoeira',  legenda: 'A água encontra sempre um caminho. Seja água. 💧' },
  { query: 'northern lights',     tag: 'aurora',     legenda: 'O céu resolveu se mostrar hoje. E que espetáculo. 🌌' },
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
  const USERNAME = 'biancarocha';
  const NOME     = 'Bianca Rocha';
  const BIO      = 'Colecionadora de bons ângulos 📸 Uma foto nova todo dia pra te inspirar.';
  const EMOJI    = '📸';

  const r1 = await fetch(`${DB_URL}/usuarios/${uid}.json?auth=${token}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: USERNAME, nome: NOME, bio: BIO, emoji: EMOJI }),
  });
  if (!r1.ok) {
    console.error('❌ Erro ao atualizar perfil:', await r1.text());
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

// Busca uma foto aleatória no Unsplash para o tema do dia.
async function buscarFoto(tema) {
  const url = `https://api.unsplash.com/photos/random`
    + `?query=${encodeURIComponent(tema.query)}`
    + `&orientation=squarish`
    + `&content_filter=high`
    + `&client_id=${UNSPLASH_ACCESS_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Unsplash falhou (' + res.status + '): ' + await res.text());
  const data = await res.json();

  const imagemUrl = data?.urls?.regular;
  const autor     = data?.user?.name || 'fotógrafo do Unsplash';
  if (!imagemUrl) throw new Error('Resposta do Unsplash sem imagemUrl');

  return { imagemUrl, autor };
}

async function publicarFoto(uid, token) {
  // Escolhe o tema com base no dia atual (determinístico)
  const diaAtual = Math.floor(Date.now() / 86400000);
  const tema = TEMAS[diaAtual % TEMAS.length];

  const { imagemUrl, autor } = await buscarFoto(tema);

  // Crédito ao fotógrafo é exigido pelas diretrizes da API do Unsplash.
  const legenda = `${tema.legenda}\n\n📷 Foto por ${autor} no Unsplash\n\n#${tema.tag} #foto #vibe`;

  const postId = `post_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const res = await fetch(`${DB_URL}/posts/${postId}.json?auth=${token}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      uid,
      tipo: 'foto',
      imagemUrl,
      legenda,
      timestamp: Date.now(),
    }),
  });

  if (!res.ok) throw new Error('Erro ao publicar: ' + await res.text());
  return { tema: tema.tag, autor };
}

// ---- Main --------------------------------------------------

async function main() {
  console.log('🤖 Bot Fotos iniciando...');

  if (!FIREBASE_API_KEY || !BOT_EMAIL || !BOT_PASSWORD || !UNSPLASH_ACCESS_KEY) {
    throw new Error('Variáveis de ambiente faltando: FIREBASE_API_KEY, BOT_FOTOS_EMAIL, BOT_FOTOS_PASSWORD, UNSPLASH_ACCESS_KEY');
  }

  const { idToken, localId } = await signIn();
  console.log('✅ Login OK — UID:', localId);

  await ensureProfile(localId, idToken);

  const jaPostou = await jaPostouHoje(localId, idToken);
  if (jaPostou) {
    console.log('⏭️ Já postou hoje. Pulando.');
    return;
  }

  const { tema, autor } = await publicarFoto(localId, idToken);
  await marcarPostoHoje(localId, idToken);
  console.log(`✅ Foto postada! Tema: ${tema} | por ${autor}`);
}

main().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
