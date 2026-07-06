// ============================================================
// BOT — Vibe Fotos: Tecnologia (persona Téo Nunes)
// Posta uma foto de tech todo dia no feed da Vibe.
// Puxa a imagem do Unsplash por sub-tema e monta legenda em
// português + crédito ao fotógrafo. Roda via GitHub Actions.
// ============================================================

const FIREBASE_API_KEY    = process.env.FIREBASE_API_KEY;
const DB_URL              = 'https://controle-de-gasto-fc4e0-default-rtdb.firebaseio.com';
const BOT_EMAIL           = process.env.BOT_FOTOS_TECNOLOGIA_EMAIL;
const BOT_PASSWORD        = process.env.BOT_FOTOS_TECNOLOGIA_PASSWORD;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const PERFIL = {
  username: 'teonunes',
  nome:     'Téo Nunes',
  bio:      'Vivendo no futuro 💻 Gadgets, código e o que há de novo em tech.',
  emoji:    '💻',
};

const TEMAS = [
  { query: 'technology gadget',      tag: 'gadgets',   legenda: 'O futuro chega primeiro pra quem tá de olho. 💻' },
  { query: 'laptop workspace',       tag: 'setup',     legenda: 'Um bom setup é meio caminho pra produtividade. 🖥️' },
  { query: 'smartphone modern',      tag: 'mobile',    legenda: 'A tecnologia que cabe no bolso e move o mundo. 📱' },
  { query: 'coding programming',     tag: 'codigo',    legenda: 'Por trás de cada app, milhares de linhas de código. 👨‍💻' },
  { query: 'circuit board tech',     tag: 'hardware',  legenda: 'A beleza escondida dentro das máquinas. 🔌' },
  { query: 'futuristic technology',  tag: 'futuro',    legenda: 'O amanhã já está sendo construído hoje. 🚀' },
  { query: 'robot artificial',       tag: 'ia',        legenda: 'Inteligência artificial: o assunto do momento. 🤖' },
  { query: 'headphones audio',       tag: 'audio',     legenda: 'Boa tecnologia também se ouve. 🎧' },
  { query: 'drone flying',           tag: 'drone',     legenda: 'Olhar o mundo de cima nunca foi tão acessível. 🛸' },
  { query: 'gaming setup',           tag: 'games',     legenda: 'Onde a tecnologia vira diversão. 🎮' },
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
  const legenda = `${tema.legenda}\n\n📷 Foto por ${autor} no Unsplash\n\n#${tema.tag} #tecnologia #vibe`;
  const postId = `post_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const res = await fetch(`${DB_URL}/posts/${postId}.json?auth=${token}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, tipo: 'foto', imagemUrl, legenda, timestamp: Date.now() }),
  });
  if (!res.ok) throw new Error('Erro ao publicar: ' + await res.text());
  return { tema: tema.tag, autor };
}

async function main() {
  console.log('🤖 Bot Fotos (Tecnologia) iniciando...');
  if (!FIREBASE_API_KEY || !BOT_EMAIL || !BOT_PASSWORD || !UNSPLASH_ACCESS_KEY) {
    throw new Error('Variáveis de ambiente faltando: FIREBASE_API_KEY, BOT_FOTOS_TECNOLOGIA_EMAIL, BOT_FOTOS_TECNOLOGIA_PASSWORD, UNSPLASH_ACCESS_KEY');
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
