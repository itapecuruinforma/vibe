// ============================================================
// BOT — Vibe Fotos: Gastronomia & Comida (persona Nina Prado)
// Posta uma foto de comida todo dia no feed da Vibe.
// Puxa a imagem do Unsplash por sub-tema e monta legenda em
// português + crédito ao fotógrafo. Roda via GitHub Actions.
// ============================================================

const FIREBASE_API_KEY    = process.env.FIREBASE_API_KEY;
const DB_URL              = 'https://controle-de-gasto-fc4e0-default-rtdb.firebaseio.com';
const BOT_EMAIL           = process.env.BOT_FOTOS_GASTRONOMIA_EMAIL;
const BOT_PASSWORD        = process.env.BOT_FOTOS_GASTRONOMIA_PASSWORD;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const PERFIL = {
  username: 'ninaprado',
  nome:     'Nina Prado',
  bio:      'De olho no que é bom de comer 🍽️ Um prato novo pra te dar fome todo dia.',
  emoji:    '🍽️',
};

const TEMAS = [
  { query: 'delicious food plate', tag: 'comida',     legenda: 'Comida boa é abraço que entra pela boca. 🍽️' },
  { query: 'coffee latte art',     tag: 'cafe',       legenda: 'Todo grande dia começa com um bom café. ☕' },
  { query: 'dessert cake',         tag: 'sobremesa',  legenda: 'Sempre tem espaço pra sobremesa. Sempre. 🍰' },
  { query: 'street food',          tag: 'comidaderua',legenda: 'A melhor comida às vezes tá na esquina. 🌮' },
  { query: 'healthy breakfast',    tag: 'cafedamanha',legenda: 'Um café da manhã caprichado muda o dia inteiro. 🥐' },
  { query: 'pizza',                tag: 'pizza',      legenda: 'Pizza: a resposta certa pra quase toda pergunta. 🍕' },
  { query: 'burger',               tag: 'hamburguer', legenda: 'Tem dia que só um bom hambúrguer resolve. 🍔' },
  { query: 'fresh fruit',          tag: 'frutas',     legenda: 'Colorido, doce e cheio de vida. 🍓' },
  { query: 'pasta italian',        tag: 'massa',      legenda: 'Uma massa fresquinha não erra nunca. 🍝' },
  { query: 'brunch table',         tag: 'brunch',     legenda: 'O brunch de fim de semana é sagrado. 🥞' },
];

async function signIn() {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: BOT_EMAIL, password: BOT_PASSWORD, returnSecureToken: true }) }
  );
  if (!res.ok) throw new Error('Login falhou: ' + await res.text());
  return res.json();
}

async function ensureProfile(uid, token) {
  const r1 = await fetch(`${DB_URL}/usuarios/${uid}.json?auth=${token}`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: PERFIL.username, nome: PERFIL.nome, bio: PERFIL.bio, emoji: PERFIL.emoji }),
  });
  if (!r1.ok) console.error('❌ Erro ao atualizar perfil:', await r1.text());
  else console.log('✅ Perfil atualizado:', PERFIL.nome);

  await fetch(`${DB_URL}/usernames/${PERFIL.username}.json?auth=${token}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(uid),
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
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Number(diaHoje)),
  });
}

async function buscarFoto(tema) {
  const url = `https://api.unsplash.com/photos/random`
    + `?query=${encodeURIComponent(tema.query)}&orientation=squarish&content_filter=high&client_id=${UNSPLASH_ACCESS_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Unsplash falhou (' + res.status + '): ' + await res.text());
  const data = await res.json();
  const imagemUrl = data?.urls?.regular;
  const autor = data?.user?.name || 'fotógrafo do Unsplash';
  if (!imagemUrl) throw new Error('Resposta do Unsplash sem imagemUrl');
  return { imagemUrl, autor };
}

async function publicarFoto(uid, token) {
  const diaAtual = Math.floor(Date.now() / 86400000);
  const tema = TEMAS[diaAtual % TEMAS.length];
  const { imagemUrl, autor } = await buscarFoto(tema);
  const legenda = `${tema.legenda}\n\n📷 Foto por ${autor} no Unsplash\n\n#${tema.tag} #gastronomia #vibe`;
  const postId = `post_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const res = await fetch(`${DB_URL}/posts/${postId}.json?auth=${token}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, tipo: 'foto', imagemUrl, legenda, timestamp: Date.now() }),
  });
  if (!res.ok) throw new Error('Erro ao publicar: ' + await res.text());
  return { tema: tema.tag, autor };
}

async function main() {
  console.log('🤖 Bot Fotos (Gastronomia) iniciando...');
  if (!FIREBASE_API_KEY || !BOT_EMAIL || !BOT_PASSWORD || !UNSPLASH_ACCESS_KEY) {
    throw new Error('Variáveis de ambiente faltando: FIREBASE_API_KEY, BOT_FOTOS_GASTRONOMIA_EMAIL, BOT_FOTOS_GASTRONOMIA_PASSWORD, UNSPLASH_ACCESS_KEY');
  }
  const { idToken, localId } = await signIn();
  console.log('✅ Login OK — UID:', localId);
  await ensureProfile(localId, idToken);
  if (await jaPostouHoje(localId, idToken)) { console.log('⏭️ Já postou hoje. Pulando.'); return; }
  const { tema, autor } = await publicarFoto(localId, idToken);
  await marcarPostoHoje(localId, idToken);
  console.log(`✅ Foto postada! Tema: ${tema} | por ${autor}`);
}

main().catch(err => { console.error('❌ Erro:', err.message); process.exit(1); });
