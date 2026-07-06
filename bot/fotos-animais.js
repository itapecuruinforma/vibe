// ============================================================
// BOT — Vibe Fotos: Animais & Pets (persona Duda Campos)
// Posta uma foto de bicho todo dia no feed da Vibe.
// Puxa a imagem do Unsplash por sub-tema e monta legenda em
// português + crédito ao fotógrafo. Roda via GitHub Actions.
// ============================================================

const FIREBASE_API_KEY    = process.env.FIREBASE_API_KEY;
const DB_URL              = 'https://controle-de-gasto-fc4e0-default-rtdb.firebaseio.com';
const BOT_EMAIL           = process.env.BOT_FOTOS_ANIMAIS_EMAIL;
const BOT_PASSWORD        = process.env.BOT_FOTOS_ANIMAIS_PASSWORD;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const PERFIL = {
  username: 'dudacampos',
  nome:     'Duda Campos',
  bio:      'Apaixonada por bichos 🐾 Uma dose de fofura no seu feed todo dia.',
  emoji:    '🐾',
};

// Sub-temas (query em inglês p/ Unsplash + legenda em português)
const TEMAS = [
  { query: 'cute dog',        tag: 'cachorro',  legenda: 'Ninguém te recebe em casa com tanta alegria quanto um cachorro. 🐶' },
  { query: 'cat kitten',      tag: 'gato',      legenda: 'Independentes, misteriosos e donos da casa. Gatos são assim. 🐱' },
  { query: 'baby animal',     tag: 'filhote',   legenda: 'Alerta de fofura: filhote no feed! 🥺' },
  { query: 'colorful bird',   tag: 'passaros',  legenda: 'A natureza caprichou nas cores dessa vez. 🐦' },
  { query: 'wildlife animal', tag: 'selvagem',  legenda: 'A vida selvagem tem uma beleza que não se domestica. 🦁' },
  { query: 'puppy dog',       tag: 'filhote',   legenda: 'Um par de olhinhos assim resolve qualquer dia ruim. 🐕' },
  { query: 'horse field',     tag: 'cavalo',    legenda: 'Força e liberdade num galope só. 🐴' },
  { query: 'panda bear',      tag: 'panda',     legenda: 'O bicho mais preguiçoso e fofo do planeta. 🐼' },
  { query: 'fox wild',        tag: 'raposa',    legenda: 'Esperta, elegante e linda de doer. 🦊' },
  { query: 'rabbit cute',     tag: 'coelho',    legenda: 'Orelhas grandes, coração maior ainda. 🐰' },
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
  const legenda = `${tema.legenda}\n\n📷 Foto por ${autor} no Unsplash\n\n#${tema.tag} #animais #vibe`;
  const postId = `post_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const res = await fetch(`${DB_URL}/posts/${postId}.json?auth=${token}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, tipo: 'foto', imagemUrl, legenda, timestamp: Date.now() }),
  });
  if (!res.ok) throw new Error('Erro ao publicar: ' + await res.text());
  return { tema: tema.tag, autor };
}

async function main() {
  console.log('🤖 Bot Fotos (Animais) iniciando...');
  if (!FIREBASE_API_KEY || !BOT_EMAIL || !BOT_PASSWORD || !UNSPLASH_ACCESS_KEY) {
    throw new Error('Variáveis de ambiente faltando: FIREBASE_API_KEY, BOT_FOTOS_ANIMAIS_EMAIL, BOT_FOTOS_ANIMAIS_PASSWORD, UNSPLASH_ACCESS_KEY');
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
