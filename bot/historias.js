// ============================================================
// BOT — Vibe Histórias
// Posta histórias inspiradoras curtas todo dia
// Roda via GitHub Actions (cron diário, 15 min após perguntas)
// ============================================================

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const DB_URL           = 'https://controle-de-gasto-fc4e0-default-rtdb.firebaseio.com';
const BOT_EMAIL        = process.env.BOT_HISTORIAS_EMAIL;
const BOT_PASSWORD     = process.env.BOT_HISTORIAS_PASSWORD;

// ---- 50 histórias inspiradoras (cicla a cada 50 dias) ----------------
const HISTORIAS = [
  `📖 HISTÓRIA DO DIA:

Uma menina nasceu sem braços. Seus pais queriam que ela fosse "normal".

Aos 8 anos, ela decidiu aprender a nadar.
Aos 12, competia em campeonatos.
Aos 16, bateu recordes nacionais.
Aos 20, foi para as Olimpíadas.

Hoje, ela inspira milhões.

Limitação não define potencial. Mentalidade define.

#história #inspiração #superação`,

  `📖 HISTÓRIA DO DIA:

Um homem pediu demissão de seu emprego bilionário.

Seus amigos: "Você é louco?"
Sua mãe: "Como vamos comer?"
Ele: "Tenho uma ideia."

Começou em um garagem.
Fracassou 5 vezes.
Na 6ª, criou império bilionário.

"Ninguém acredita até você acreditar", ele disse.

#história #coragem #empreendedorismo`,

  `📖 HISTÓRIA DO DIA:

Uma mulher com câncer terminal recebeu 6 meses de vida.

Em vez de desistir, criou lista de 100 sonhos.

Não realizou os 100.
Realizou 87.

Viveu 12 anos a mais.
Cada ano, novo sonho.

"Viver é escolher viver", era seu lema.

#história #esperança #vida`,

  `📖 HISTÓRIA DO DIA:

Um garoto era o mais pobre da escola.
Seus sapatos tinham buraco.
Todos riam dele.

Aos 15, começou a programar.
Aos 18, vendeu seu primeiro app.
Aos 22, criou empresa multimilionária.

Quando ficou rico, voltou à escola e pagou a faculdade de 50 coleguinhas.

"Eles que riam agora riem de alegria", disse.

#história #superação #generosidade`,

  `📖 HISTÓRIA DO DIA:

Um atleta sofreu acidente que paralisou suas pernas.

Médicos: "Nunca mais caminhará."
Ele: "Vou correr uma maratona."

Treinou 3 anos.
Na cadeira de rodas, cruzou a linha de chegada.

A multidão aplaudiu em pé.

"O corpo falha, mas a mente não", ele sussurrou.

#história #determinação #resiliência`,

  `📖 HISTÓRIA DO DIA:

Uma criança nasceu com síndrome de Down.

Seus pais foram diagnosticados com depressão.
Amigos sumiram.
Tudo parecia escuro.

Aos 10 anos, a criança perguntou: "Por que vocês estão tristes?"
"Porque você é diferente, querido."
"Mas diferente não é ruim, é só... diferente. Vocês me amam?"
"Sim, claro!"
"Então somos abençoados!"

A família llorou e começou a viver.

#história #amor #aceitação`,

  `📖 HISTÓRIA DO DIA:

Uma vovó aos 72 anos nunca havia aprendido a ler.

Um neto ofereceu-se para ensinar.
Ela chorava durante as aulas.

Aos 75, leu seu primeiro livro.
Aos 80, havia lido 300 livros.

"Nunca é tarde para aprender", ela escrevia em cartas para netos.

#história #aprendizado #esperança`,

  `📖 HISTÓRIA DO DIA:

Um homem foi abandonado pela família aos 10 anos.

Cresceu em orfanato.
Ninguém acreditava nele.
Ele acreditava em si mesmo.

Aos 30, criou ONG que salvou 10 mil crianças.

"Meu maior abandono foi minha maior bênção", dizia.

#história #propósito #impacto`,

  `📖 HISTÓRIA DO DIA:

Uma mulher perdeu seu marido, seus filhos, sua casa em um acidente.

Acordou no hospital sozinha.
Sem razão para viver.

Um médico sentou ao seu lado: "Por que você quer viver?"
Ela não respondeu.
Ele voltou toda manhã durante 30 dias fazendo a mesma pergunta.

No 31º dia, ela respondeu: "Para dar sentido à vida deles."

Hoje, ela voluntária em 5 ONGs.

#história #propósito #ressurreição`,

  `📖 HISTÓRIA DO DIA:

Um empresário endividado tinha 2 horas para pagar um empréstimo.

Seu banco: "Vamos executar."
Ele conhecia 1 pessoa rica: seu pior inimigo.

Orgulho vs. Sobrevivência.
Ele escolheu sobrevivência.

Pediu ajuda ao inimigo.
Inimigo emprestou e perdoou a dívida.

"Inimigos são amigos que ainda não descobrimos", ele aprendeu.

#história #humildade #redenção`,

  `📖 HISTÓRIA DO DIA:

Uma criança com autismo não falava até os 8 anos.

Seus pais não desistiram.
10 anos de terapia, amor infinito, paciência.

Aos 18, discursou na universidade.
Aos 25, era professor de autismo.

"O silêncio não significa nada. Significa que estou processando o universo", ele dizia.

#história #paciência #comunicação`,

  `📖 HISTÓRIA DO DIA:

Uma mulher foi traída pelos melhores amigos.
Traída pelo marido.
Traída pela empresa.

Quando pediu divorça, o marido soltou fofocas cruéis.

Seus piores dias: pensou em acabar com tudo.

Um estranho a abordou: "Parece que está sofrendo."
Ela chorou.
Ele ouviu.

Aquele estranho virou melhor amigo.
Sua vida começou de novo.

"Às vezes, um desconhecido é a porta para novo começo", dizia.

#história #renovação #conexão`,

  `📖 HISTÓRIA DO DIA:

Um homem tinha tumor incurável.

Médicos: "3 meses de vida."
Ele: "Vou passar os 3 meses vivendo."

Visitou 50 cidades.
Aprendeu 3 idiomas.
Amou mais que em 30 anos anteriores.

Viveu 7 anos a mais.
Cada momento foi infinito.

"Quantidade de vida é menos importante que qualidade", era seu mantra.

#história #vida #gratidão`,

  `📖 HISTÓRIA DO DIA:

Um menino viu sua mãe limpando casas para sustentá-lo.

Aos 10, jurou: "Vou tirar você dessa vida."

Estudou como louco.
Bolsa integral.
Faculdade sem pagar.
Primeiro emprego aos 20.

Aos 25, sua mãe nunca mais trabalhou.

Ela chorava vendo o filho abraçá-la: "Você cumpriu promessa."

#história #amor #dedicação`,

  `📖 HISTÓRIA DO DIA:

Uma menina foi diagnosticada com cegueira progressiva.

Perderia visão completamente em 5 anos.

Em vez de desistir: aprendeu Braille, aprendeu música, aprendeu piano.

Aos 18, era pianista premiada.
Aos 25, compôs sinfonia.
Aos 30, era maestrina.

"Visão é menos importante que visão de futuro", ela dizia no palco.

#história #adaptação #talento`,

  `📖 HISTÓRIA DO DIA:

Um velho tinha 60 anos quando descobriu que não sabia ler.

Sua vida: 60 anos de vergonha, silêncio, limitação.

Um projeto social ofereceu aulas.
Com 65 anos, leu seu primeiro livro.
Com 70, escreveu suas memórias.

"Nunca é tarde. Nunca", era o título do seu livro.

#história #aprendizado #redenção`,

  `📖 HISTÓRIA DO DIA:

Um casal foi diagnosticado infértil.

"Nunca terão filhos", disseram os médicos.

Eles não aceitaram.
Adotaram 8 crianças.

Ao final da vida, tinham 40 netos (dos 8 filhos adotivos).

"Filhos biológicos é acaso. Filhos adotivos é escolha. Escolhemos 8 vezes", riam.

#história #família #amor`,

  `📖 HISTÓRIA DO DIA:

Um executivo sofreu AVC e perdeu a fala.

Estava em depressão profunda quando sua filha pequena o visitou.

"Pai, você ainda me ama?"
Ele apontou para o coração.
"Então está tudo bem. Suas palavras já foram suficientes na minha vida."

Ele recomeçou a viver para ela.
1 ano depois, conseguiu falar novamente.

#história #amor #cura`,

  `📖 HISTÓRIA DO DIA:

Uma mulher foi abusada sexualmente na infância.

Carregou vergonha por 40 anos.
Aos 50, decidiu contar para sua filha.

Filha: "Mãe, você é a pessoa mais corajosa que conheço."

Juntas, criaram ONG para vítimas de abuso.

"Meu trauma se tornou missão", ela dizia para 1000 mulheres.

#história #cura #propósito`,

  `📖 HISTÓRIA DO DIA:

Um homem perdeu tudo numa falência.

Casa, carro, dinheiro, dignidade.

Dormia na rua.
Comia do lixo.

Um mendigo o viu chorando e ofereceu: "Quer compartilhar meu papelão?"

Aquele "mendigo" era ex-presidente de universidade.
Ambos dormiam lado a lado.

Semanas depois, ambos conseguiram emprego e reergueram suas vidas.

"O mais pobre pode ser o mais rico em compaixão", era a lição.

#história #humildade #humanidade`,

  `📖 HISTÓRIA DO DIA:

Uma menina com paralisia cerebral queria dançar.

Dizer: "Você não consegue" era cruel.
Assim, seus pais encontraram uma bailarina que a ensinou.

Aos 16, dançava com botas especiais.
Aos 18, competia em campeonato nacional.
Aos 20, ensinava outras crianças com deficiência a dançar.

"A deficiência é só um jeito diferente de mover", ela dizia graciosamente.

#história #inclusão #sonho`,

  `📖 HISTÓRIA DO DIA:

Um jovem era viciado em drogas.

Sua mãe o arrastou para terapia.
9 meses: sem progresso.
Sua mãe não desistiu.

10º mês: ele pediu ajuda.
Aos 2 anos sóbrio: trabalhava.
Aos 5 anos: sonhava.
Aos 10 anos: inspirava outros.

"Minha mãe nunca desistiu de mim. Por isso, nunca desisti de mim", dizia.

#história #recuperação #amor`,

  `📖 HISTÓRIA DO DIA:

Um homem foi diagnosticado com Parkinson.

Mãos tremendo, futuro incerto.

Pintor aposentado, isso era morte para ele.

Até que sua neta perguntou: "Avô, por que você não pinta com os dedos?"

Começou a pintar com dedos.
Suas obras ficaram ainda mais bonitas.
Hoje, expõe em galerias.

"A limitação é apenas uma nova oportunidade", ele descobriu.

#história #adaptação #criatividade`,

  `📖 HISTÓRIA DO DIA:

Uma mãe solteira trabalhou 3 empregos para sustentar 2 filhos.

Dormia 4 horas por noite.
Comia sobras.
Mas seus filhos tinham educação.

Aos 20, seus filhos se formaram.
Aos 25, pagavam suas contas.
Aos 30, ela aposentada com dignidade.

"Sacrifício hoje é tranquilidade amanhã", ela sussurrava para mães que sofriam.

#história #sacrifício #vitória`,

  `📖 HISTÓRIA DO DIA:

Um idoso perdeu sua esposa após 60 anos de casamento.

Caiu em depressão profunda.
Comida sem sabor, noites infinitas.

Seus netos o levaram para aula de computador no asilo.

Aos 78, aprendeu a usar WhatsApp.
Aos 80, criou grupo "Idosos da Internet".
Aos 82, tinha 500 amigos online.

A solidão virou comunidade.

#história #conexão #renovação`,

  `📖 HISTÓRIA DO DIA:

Uma criança foi bullizada por anos.

Magra, tímida, "estranha".
Todos riam.

Aos 15, decidiu: "Vou provar que sou especial."

Entrou em robótica.
Seu time venceu campeonato nacional.
Aos 18, criou startup.
Aos 25, bilionária.

Os que riam? Agora admiravam.

"Ódio é combustível para quem sabe transformar em energia", ela dizia.

#história #bullying #superação`,

  `📖 HISTÓRIA DO DIA:

Um casal perdeu filho de 5 anos.

Levou 2 anos para sair de casa.
3 anos para sorrir de novo.

Nesse 3º ano, visitaram orfanato.
Viram criança com olhar do seu filho falecido.

Adotaram aquela criança.

"Nosso luto virou amor. Nosso filho continua vivo em forma de irmão para outra criança", chorava de alegria.

#história #perda #renascimento`,

  `📖 HISTÓRIA DO DIA:

Um homem era alcoólatra aos 25 anos.

Seu pai o esbofeteou: "Você é fracasso!"
Ele fez pior: pediu desculpas e recusou ajuda.

Aos 30, quase morreu.

Acordou no hospital.
Seu pai abraçou-o: "Ainda acredito em você."

Aquele abraço mudou tudo.
30 anos sóbrio.
Salvou 100 pessoas do vício.

"Uma pessoa que crê em você pode trazer você de volta da morte", ele pregava.

#história #redenção #fé`,

  `📖 HISTÓRIA DO DIA:

Uma mulher era considerada "velha demais" aos 40.

Divorciou. Todos: "Quem quer mulher de 40?"

Aos 42, começou curso de dança.
Aos 45, abriu estúdio.
Aos 50, era referência nacional.

Se casou de novo com dançarino 5 anos mais novo.

"Idade é limitação que outros criam. Você escolhe se acredita", ela dançava.

#história #reinvenção #ousadia`,

  `📖 HISTÓRIA DO DIA:

Um garoto criado em favela queria ser astrômono.

Todos riam: "Aqui a gente nem sabe se vive até amanhã."

Ele estudava entre tiros.
Fazia aula em lan house à noite.
Dormia 3 horas.

Aos 22, entrou em universidade de ponta.
Aos 28, era pesquisador da NASA.

"Origem limita apenas se você deixa", dizia para 1000 crianças que o seguiam.

#história #educação #esperança`,

  `📖 HISTÓRIA DO DIA:

Um homem se viu no espelho aos 60 e não reconheceu.

Gordo, doente, amargo.

Naquele dia, decidiu: "Vou me amar como meu filho me ama."

Começou pequeno: 1 caminhada.
1 salada.
1 sorriso genuíno.

3 anos depois: 30kg a menos, cheio de energia, amigo de todos.

"Auto-amor não é vaidade, é sobrevivência", era seu segredo.

#história #saúde #amor-próprio`,

  `📖 HISTÓRIA DO DIA:

Uma menina era muda desde o nascimento.

Professora a obrigou a tentar falar durante 10 anos.

Todos desistiram. A menina não.

Aos 15, sussurrou a primeira palavra: "Obrigada."
Toda a sala chorou.

Aos 20, falava naturalmente.
Aos 30, era terapeuta de fala.

"Impossível é apenas o que você não tentou bastante", ela contava para seus pacientes.

#história #persistência #milagre`,

  `📖 HISTÓRIA DO DIA:

Um casal não podia ter filhos.

30 anos de tentativas, cada falha um pequeno morte.

Aos 50, desistiram.

6 meses depois: engravidaram naturalmente.

Menina nasceu em 2025.

"Às vezes, soltar é o que permite que as coisas cheguem", abraçavam sua filha miracle.

#história #esperança #milagre`,
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
  const USERNAME = 'historiasdia';
  const NOME     = 'Histórias Dia';
  const BIO      = 'Histórias que inspiram e transformam vidas 📖';
  const EMOJI    = '📖';

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

async function publicarHistoria(uid, token) {
  const diaAtual = Math.floor(Date.now() / 86400000);
  const texto = HISTORIAS[diaAtual % HISTORIAS.length];

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
  console.log('🤖 Bot Histórias iniciando...');

  if (!FIREBASE_API_KEY || !BOT_EMAIL || !BOT_PASSWORD) {
    throw new Error('Variáveis de ambiente faltando: FIREBASE_API_KEY, BOT_HISTORIAS_EMAIL, BOT_HISTORIAS_PASSWORD');
  }

  const { idToken, localId } = await signIn();
  console.log('✅ Login OK — UID:', localId);

  await ensureProfile(localId, idToken);

  const jaPostou = await jaPostouHoje(localId, idToken);
  if (jaPostou) {
    console.log('⏭️ Já postou hoje. Pulando.');
    return;
  }

  const texto = await publicarHistoria(localId, idToken);
  await marcarPostoHoje(localId, idToken);
  console.log('✅ Postado com sucesso!');
  console.log('📝', texto.split('\n')[0]);
}

main().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
