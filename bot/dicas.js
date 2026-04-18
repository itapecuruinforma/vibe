// ============================================================
// BOT — Vibe Dicas Diárias
// Posta uma dica útil diferente todo dia no feed da Vibe
// Roda via GitHub Actions (cron diário, 30 min após curiosidades)
// ============================================================

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const DB_URL           = 'https://controle-de-gasto-fc4e0-default-rtdb.firebaseio.com';
const BOT_EMAIL        = process.env.BOT_EMAIL;
const BOT_PASSWORD     = process.env.BOT_PASSWORD;

// ---- 50 dicas (cicla a cada 50 dias) ----------------
const DICAS = [
  `💡 Dica: Beba mais água durante o dia! A hidratação melhora a concentração, energia e saúde da pele. Meta: 2-3 litros por dia.

#dica #saúde #bemvindo`,

  `💡 Dica: A regra 20-20-20 para os olhos: a cada 20 minutos de tela, olhe para algo a 20 metros de distância por 20 segundos. Reduz fadiga visual.

#dica #saúde #dicas`,

  `💡 Dica: Organize seu espaço antes de dormir. Um ambiente limpo e organizado melhora a qualidade do sono e da concentração no dia seguinte.

#dica #produtividade #organização`,

  `💡 Dica: Respire profundamente antes de situações estressantes. Inspire por 4 segundos, segure por 4, expire por 6. Reduz ansiedade imediatamente.

#dica #mindfulness #saúde`,

  `💡 Dica: Guarde seus pequenos momentos de felicidade! Tire fotos, escreva notas — é ótimo reler nos dias difíceis e apreciar a vida.

#dica #mentalidade #gratidão`,

  `💡 Dica: Primeira hora do dia é ouro. Evite redes sociais nos primeiros 30-60 minutos — seu foco será muito melhor.

#dica #produtividade #hábitos`,

  `💡 Dica: Coma devagar e mastigue bem. Você se sentirá saciado com menos comida, vai digerir melhor e aproveitar mais o sabor.

#dica #saúde #alimentação`,

  `💡 Dica: Escreva suas metas, não só pense nelas! O ato de escrever aumenta exponencialmente as chances de você realmente alcançá-las.

#dica #metas #sucesso`,

  `💡 Dica: Durma 7-9 horas por noite. Não é luxo, é essencial. Sono ruim afeta memória, imunidade, humor e tomada de decisões.

#dica #sono #saúde`,

  `💡 Dica: Comece seu dia com algo que você ama. Café quentinho, música legal, exercício — cria momentum positivo para as próximas horas.

#dica #hábitos #bem-estar`,

  `💡 Dica: Pratique a gratidão. Escreva ou pense em 3 coisas que você é grato todos os dias. Muda sua perspectiva e aumenta felicidade.

#dica #gratidão #mindfulness`,

  `💡 Dica: Movimento é medicina! Caminhe 30 minutos todos os dias. Não precisa ser academia — passeio, corrida leve ou dança funciona.

#dica #exercício #saúde`,

  `💡 Dica: Limite sessões de redes sociais a horários específicos. Não fica ao lado da cama e não é a primeira coisa que você acessa.

#dica #foco #bem-estar`,

  `💡 Dica: Entenda seu cronótipo. Você é matutino ou noturno? Organize tarefas importantes nos seus melhores horários do dia.

#dica #produtividade #hábitos`,

  `💡 Dica: Desafie-se diariamente, mas com realismo. Crescimento vem de sair da zona de conforto, não de saltos impossíveis.

#dica #desenvolvimento #mentalidade`,

  `💡 Dica: Conecte-se com pessoas que inspiram você. Ambiente muda tudo. Passe menos tempo com quem drena sua energia.

#dica #relacionamentos #crescimento`,

  `💡 Dica: Planeje suas refeições no fim de semana. Economiza tempo, dinheiro e reduz stress de decidir o que comer todo dia.

#dica #organização #saúde`,

  `💡 Dica: Aprender algo novo mantém seu cérebro jovem. Um idioma, instrumento, skill — pequenos passos criam grandes mudanças.

#dica #aprendizado #crescimento`,

  `💡 Dica: Seu celular é seu escravo, não o contrário. Apague notificações desnecessárias e deixe-o em outro cômodo enquanto trabalha.

#dica #foco #tecnologia`,

  `💡 Dica: Conte até 10 antes de responder quando estiver irritado. A maioria das explosões emocionais você vai arrepender depois.

#dica #emoções #relacionamentos`,

  `💡 Dica: Aproveite os finais de semana sem culpa! Descanse, divirta-se, recarregue. Você não precisa "ser produtivo" o tempo todo.

#dica #bem-estar #mentalidade`,

  `💡 Dica: Escove os dentes antes de comer açúcar = menos cáries. Ou melhor ainda: escolha frutas em vez de doces para satisfazer vontade.

#dica #saúde #dentes`,

  `💡 Dica: Problemas parecem maiores à noite. Se estiver muito estressado, durma e reavalie de manhã. Perspectiva muda tudo.

#dica #mentalidade #saúde`,

  `💡 Dica: Invista em qualidade, não quantidade. Uma roupinha boa dura, uma comida saudável alimenta, um livro bom inspira.

#dica #minimalismo #qualidade`,

  `💡 Dica: Diga não sem culpa quando algo não está alinhado com seus objetivos. Todo "não" é um "sim" para algo melhor.

#dica #produtividade #mentalidade`,

  `💡 Dica: Encontre seu "por quê". Quando sabe POR QUE está fazendo algo, é muito mais fácil permanecer consistente.

#dica #motivação #propósito`,

  `💡 Dica: Stretching por 10 minutos pela manhã melhora flexibilidade, circulação e postura — você sente a diferença na primeira semana.

#dica #exercício #saúde`,

  `💡 Dica: Leia a embalagem dos alimentos. Uma "imagem saudável" não significa que é nutritivo. Conhecimento é poder aqui.

#dica #alimentação #saúde`,

  `💡 Dica: Cultive um hobby que nada tenha a ver com sua profissão. Pintura, música, jardinagem — diversifica seu cérebro.

#dica #criatividade #bem-estar`,

  `💡 Dica: Comece conversas com estranhos. Qualidades incríveis moram em pessoas que você nunca conheceria se não tentasse.

#dica #relacionamentos #crescimento`,

  `💡 Dica: Guarde 10% do que ganha, sempre. Não é só sobre riqueza, é liberdade financeira e paz de espírito futura.

#dica #finanças #hábitos`,

  `💡 Dica: Respire pelo nariz, não pela boca. Aumenta oxigenação, aquece o ar e melhora foco. Parece pequeno, muda bastante.

#dica #saúde #respiração`,

  `💡 Dica: Desenvolva uma rotina noturna (skincare, leitura, meditação). Sinal para o corpo que é hora de desacelerar e descansar.

#dica #sono #hábitos`,

  `💡 Dica: Seu passado não define seu futuro. Cada novo dia é uma chance de ser quem você quer ser. Comece agora.

#dica #mentalidade #esperança`,

  `💡 Dica: Fotografe seus momentos, mas não perca o presente por causa da foto. Balance estar ali e registrar a memória.

#dica #mindfulness #vida`,

  `💡 Dica: Escolha um afirmação diária e repita durante o dia. "Eu sou capaz", "Mereço sucesso" — o cérebro acredita no que repete.

#dica #mentalidade #autoconfiança`,

  `💡 Dica: Organize sua mesa/espaço de trabalho no final do dia. Você começa o dia seguinte com energia renovada, não depressão.

#dica #produtividade #organização`,

  `💡 Dica: Tenha um "sim" padrão para experiências novas. Você crescerá muito mais em 5 anos dizendo sim a oportunidades.

#dica #crescimento #coragem`,

  `💡 Dica: A melhor hora para aprender é nos 30 primeiros minutos após acordar. Seu cérebro está fresco e receptivo.

#dica #aprendizado #produtividade`,

  `💡 Dica: Perdão é para sua paz, não para a outra pessoa. Solte o ressentimento — você merece leveza.

#dica #emoções #paz`,

  `💡 Dica: Movimentos lentos e conscientes (tai chi, yoga) são tão valiosos quanto treino intenso. Escute seu corpo, não compita.

#dica #exercício #mindfulness`,

  `💡 Dica: Tenha um amigo "accountability". Alguém para verificar se você está cumprindo objetivos. Responsabilidade aumenta sucesso.

#dica #comunidade #metas`,

  `💡 Dica: Coma alimentos da cor do arco-íris. Cada cor oferece nutrientes diferentes. Variedade = saúde máxima.

#dica #alimentação #saúde`,

  `💡 Dica: Seu corpo fala. Dor de cabeça frequente? Tensão nas costas? Pode ser estresse. Respire fundo, descanse, procure ajuda se persistir.

#dica #saúde #corpo`,

  `💡 Dica: Escute verdadeiramente quando alguém fala com você — sem pensar na sua resposta. Conexões reais crescem assim.

#dica #relacionamentos #comunicação`,

  `💡 Dica: Você não precisa ser perfeito. Bom é bom o bastante. Essa perfecção paralisa — progressão bate perfeição sempre.

#dica #mentalidade #ação`,

  `💡 Dica: Desidrate sua mente de vez em quando. Nenhuma música, ninguém falando, sem celular. Seu cérebro reset.

#dica #mindfulness #bem-estar`,

  `💡 Dica: Compre roupas que encaixam agora, não para o corpo que você quer. Vestuário confortável aumenta autoestima no presente.

#dica #moda #bem-estar`,

  `💡 Dica: Fale com seu "eu futuro" quando tomar decisões. "Eu de daqui 5 anos agradece essa escolha?" Perspectiva longa ajuda.

#dica #decisões #sabedoria`,

  `💡 Dica: Risos curam. Assista comédia, leia histórias engraçadas, passe tempo com pessoas divertidas. Saúde emocional importa.

#dica #felicidade #saúde`,

  `💡 Dica: Seu ambiente é um reflexo da sua mente. Uma casa caótica contribui para caos mental. Simples arrumação = paz.

#dica #organização #bem-estar`,

  `💡 Dica: O tempo voa. Documente pequenas coisas — nomes de amigos, lugares que visitou, coisas que aprendeu. Memórias valem ouro.

#dica #vida #gratidão`,
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
  const USERNAME = 'dicasdia';
  const NOME     = 'Dicas Dia';
  const BIO      = 'Dicas práticas para melhorar sua vida 🌱';
  const EMOJI    = '💡';

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

async function publicarDica(uid, token) {
  // Escolhe a dica com base no dia atual (determinístico, sem repetir por 50 dias)
  const diaAtual = Math.floor(Date.now() / 86400000);
  const texto = DICAS[diaAtual % DICAS.length];

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
  console.log('🤖 Bot Dicas iniciando...');

  if (!FIREBASE_API_KEY || !BOT_EMAIL || !BOT_PASSWORD) {
    throw new Error('Variáveis de ambiente faltando: FIREBASE_API_KEY, BOT_EMAIL, BOT_PASSWORD');
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

  const texto = await publicarDica(localId, idToken);
  await marcarPostoHoje(localId, idToken);
  console.log('✅ Postado com sucesso!');
  console.log('📝', texto.split('\n')[0]);
}

main().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
