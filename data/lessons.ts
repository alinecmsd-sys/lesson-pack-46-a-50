
import { Lesson } from '../types';

export const lessons: Lesson[] = [
  {
    id: 46,
    title: 'Lesson 46',
    subtitle: 'Personality & Appearance',
    vocabulary: [
      {
        title: 'Personality',
        items: [
          { english: 'confident', portuguese: 'confiante' },
          { english: 'creative', portuguese: 'criativo' },
          { english: 'friendly', portuguese: 'amigável' },
          { english: 'funny', portuguese: 'engraçado' },
          { english: 'generous', portuguese: 'generoso' },
          { english: 'hardworking', portuguese: 'trabalhador' },
          { english: 'serious', portuguese: 'sério' },
          { english: 'shy', portuguese: 'tímido' },
          { english: 'talkative', portuguese: 'falante / tagarela' }
        ]
      },
      {
        title: 'Appearance',
        items: [
          { english: 'bald', portuguese: 'careca' },
          { english: 'middle-aged', portuguese: 'meia-idade' },
          { english: 'mustache', portuguese: 'bigode' },
          { english: 'short', portuguese: 'baixo' },
          { english: 'tall', portuguese: 'alto' },
          { english: 'elderly', portuguese: 'idoso' },
          { english: 'young', portuguese: 'jovem' },
          { english: 'fat', portuguese: 'gordo' },
          { english: 'thin', portuguese: 'magro' },
          { english: 'curly hair', portuguese: 'cabelo cacheado' },
          { english: 'straight hair', portuguese: 'cabelo liso' },
          { english: 'wavy hair', portuguese: 'cabelo ondulado' },
          { english: 'long hair', portuguese: 'cabelo longo' },
          { english: 'short hair', portuguese: 'cabelo curto' }
        ]
      }
    ],
    phrases: [
      { english: 'What are you like? I’m a friendly and talkative person.', portuguese: 'Como você é (personalidade)? Eu sou uma pessoa amigável e falante.' },
      { english: 'What’s she like? She’s shy, but friendly.', portuguese: 'Como ela é? Ela é tímida, mas amigável.' },
      { english: 'What are they like? They’re hardworking students.', portuguese: 'Como eles são? Eles são estudantes trabalhadores.' },
      { english: 'What do you look like? I’m short and overweight. I wear glasses.', portuguese: 'Como você é (aparência)? Eu sou baixo e acima do peso. Eu uso óculos.' },
      { english: 'What does he look like? He’s tall and thin. He has a mustache.', portuguese: 'Como ele é? Ele é alto e magro. Ele tem um bigode.' }
    ],
    explanation: 'Dica de Gramática: Usamos "be" (am/is/are) para descrever características gerais e "have/has" para partes do corpo específicas. Exemplo: "He is tall" (característica) vs "He has a mustache" (parte do corpo).',
    dialogue: [
      { speaker: 'A', text: 'Do you think our new boss is creative?' },
      { speaker: 'B', text: 'I think so. He has many new ideas.' },
      { speaker: 'A', text: 'Is he hardworking too?' },
      { speaker: 'B', text: 'I don’t think so. He arrives late every day.' }
    ],
    exercises: [
      { portuguese: 'Eu sou uma pessoa confiante.', correctAnswer: 'I am a confident person' },
      { portuguese: 'Como ela é? (Personalidade)', correctAnswer: 'What is she like' },
      { portuguese: 'Ele é alto e magro.', correctAnswer: 'He is tall and thin' },
      { portuguese: 'Ela tem cabelo cacheado.', correctAnswer: 'She has curly hair' },
      { portuguese: 'Nós somos estudantes trabalhadores.', correctAnswer: 'We are hardworking students' },
      { portuguese: 'Como ele é? (Aparência)', correctAnswer: 'What does he look like' },
      { portuguese: 'Eu sou baixo e uso óculos.', correctAnswer: 'I am short and I wear glasses' },
      { portuguese: 'Eles são tímidos, mas amigáveis.', correctAnswer: 'They are shy but friendly' },
      { portuguese: 'Meu pai tem um bigode.', correctAnswer: 'My father has a mustache' },
      { portuguese: 'Ela é uma pessoa criativa.', correctAnswer: 'She is a creative person' }
    ]
  },
  {
    id: 47,
    title: 'Lesson 47',
    subtitle: 'Phrasal Verbs (Housework)',
    vocabulary: [
      {
        title: 'Housework',
        items: [
          { english: 'pick up the magazines', portuguese: 'pegar as revistas' },
          { english: 'wipe off the counter', portuguese: 'limpar o balcão' },
          { english: 'clean out the closet', portuguese: 'esvaziar/limpar o armário' },
          { english: 'put away the dishes', portuguese: 'guardar a louça' },
          { english: 'clean up the yard', portuguese: 'limpar o quintal' },
          { english: 'take out the garbage', portuguese: 'tirar o lixo' },
          { english: 'hang up the clothes', portuguese: 'pendurar as roupas' },
          { english: 'drop off the dry cleaning', portuguese: 'deixar a lavagem a seco' }
        ]
      }
    ],
    explanation: 'Gramática: Phrasal Verbs separáveis. Quando usamos um substantivo, podemos dizer "take out the garbage" ou "take the garbage out". Porém, se usarmos um pronome (it/them), ele DEVE ficar no meio: "take it out". Nunca diga "take out it". \n\nClean out vs Clean up: "Clean out" significa limpar o interior de algo, removendo o que está dentro (ex: armário). "Clean up" é uma limpeza geral ou organização de um espaço.',
    phrases: [
      { english: 'I take out the garbage.', portuguese: 'Eu tiro o lixo.' },
      { english: 'I take the garbage out.', portuguese: 'Eu tiro o lixo.' },
      { english: 'I take it out.', portuguese: 'Eu o tiro.' },
      { english: 'The living room is a mess. Let’s clean it up.', portuguese: 'A sala está uma bagunça. Vamos limpá-la.' },
      { english: 'The garbage is full. Could you take it out, please?', portuguese: 'O lixo está cheio. Você poderia tirá-lo, por favor?' },
      { english: 'The magazines are on the floor. Would you pick them up?', portuguese: 'As revistas estão no chão. Você as pegaria?' }
    ],
    dialogue: [
      { speaker: 'A', text: 'The yard is really dirty after the storm.' },
      { speaker: 'B', text: 'I think so. We need to clean it up today.' },
      { speaker: 'A', text: 'Can you help me clean out the garage too?' },
      { speaker: 'B', text: 'I don’t think so. I have to drop off the dry cleaning first.' }
    ],
    exercises: [
      { portuguese: 'Eu tiro o lixo.', correctAnswer: 'I take out the garbage' },
      { portuguese: 'Eu o tiro (o lixo).', correctAnswer: 'I take it out' },
      { portuguese: 'Guarde a louça.', correctAnswer: 'Put away the dishes' },
      { portuguese: 'Limpe o balcão.', correctAnswer: 'Wipe off the counter' },
      { portuguese: 'Pendure as roupas.', correctAnswer: 'Hang up the clothes' },
      { portuguese: 'Vamos limpar o quintal.', correctAnswer: 'Let us clean up the yard' },
      { portuguese: 'Você pode pegá-las? (as revistas)', correctAnswer: 'Can you pick them up' },
      { portuguese: 'Eu preciso limpar o armário.', correctAnswer: 'I need to clean out the closet' },
      { portuguese: 'A sala está uma bagunça.', correctAnswer: 'The living room is a mess' },
      { portuguese: 'Deixe a lavagem a seco.', correctAnswer: 'Drop off the dry cleaning' }
    ]
  },
  {
    id: 48,
    title: 'Lesson 48',
    subtitle: 'How Questions & Health',
    vocabulary: [
      {
        title: 'Health Habits',
        items: [
          { english: 'eat a balanced diet', portuguese: 'comer uma dieta balanceada' },
          { english: 'wash your hands', portuguese: 'lavar suas mãos' },
          { english: 'protect your skin', portuguese: 'proteger sua pele' },
          { english: 'lift weights', portuguese: 'levantar pesos' },
          { english: 'go for a walk', portuguese: 'dar uma caminhada' },
          { english: 'exercise daily', portuguese: 'exercitar-se diariamente' },
          { english: 'get enough sleep', portuguese: 'dormir o suficiente' },
          { english: 'eat a good breakfast', portuguese: 'comer um bom café da manhã' }
        ]
      }
    ],
    phrases: [
      { english: 'How often do you exercise? I exercise daily.', portuguese: 'Com que frequência você se exercita? Eu me exercito diariamente.' },
      { english: 'How healthy is your diet? It is very healthy.', portuguese: 'Quão saudável é sua dieta? É muito saudável.' },
      { english: 'How much water do you drink? I drink two liters a day.', portuguese: 'Quanta água você bebe? Eu bebo dois litros por dia.' },
      { english: 'How many hours do you sleep? I sleep about eight hours.', portuguese: 'Quantas horas você dorme? Eu durmo cerca de oito horas.' },
      { english: 'How long do you walk? I walk for thirty minutes.', portuguese: 'Por quanto tempo você caminha? Eu caminho por trinta minutos.' },
      { english: 'How well do you play tennis? I play quite well.', portuguese: 'Quão bem você joga tênis? Eu jogo muito bem.' }
    ],
    dialogue: [
      { speaker: 'A', text: 'How often do you go for a walk?' },
      { speaker: 'B', text: 'I go for a walk every morning.' },
      { speaker: 'A', text: 'Do you think that is enough exercise?' },
      { speaker: 'B', text: 'I think so, but I also lift weights twice a week.' }
    ],
    exercises: [
      { portuguese: 'Com que frequência você lava as mãos?', correctAnswer: 'How often do you wash your hands' },
      { portuguese: 'Eu durmo o suficiente todas as noites.', correctAnswer: 'I get enough sleep every night' },
      { portuguese: 'Quantas horas você dorme?', correctAnswer: 'How many hours do you sleep' },
      { portuguese: 'Eu como um bom café da manhã.', correctAnswer: 'I eat a good breakfast' },
      { portuguese: 'Quão bem você cozinha?', correctAnswer: 'How well do you cook' },
      { portuguese: 'Eu bebo muita água.', correctAnswer: 'I drink a lot of water' },
      { portuguese: 'Por quanto tempo você corre?', correctAnswer: 'How long do you run' },
      { portuguese: 'Proteja sua pele do sol.', correctAnswer: 'Protect your skin from the sun' },
      { portuguese: 'Eu levanto pesos na academia.', correctAnswer: 'I lift weights at the gym' },
      { portuguese: 'Minha dieta é balanceada.', correctAnswer: 'My diet is balanced' }
    ]
  },
  {
    id: 49,
    title: 'Lesson 49',
    subtitle: 'Present Perfect (Experiences)',
    vocabulary: [
      {
        title: 'Experiences',
        items: [
          { english: 'act in a play', portuguese: 'atuar em uma peça' },
          { english: 'be on TV', portuguese: 'aparecer na TV' },
          { english: 'break a bone', portuguese: 'quebrar um osso' },
          { english: 'get seasick', portuguese: 'ficar enjoado no mar' },
          { english: 'lose your phone', portuguese: 'perder seu telefone' },
          { english: 'meet a famous person', portuguese: 'conhecer uma pessoa famosa' },
          { english: 'move to another city', portuguese: 'mudar-se para outra cidade' },
          { english: 'win an award', portuguese: 'ganhar um prêmio' }
        ]
      }
    ],
    phrases: [
      { english: 'Have you ever acted in a play? Yes, I have.', portuguese: 'Você já atuou em uma peça? Sim, já.' },
      { english: 'Has she ever been on TV? No, she hasn’t.', portuguese: 'Ela já apareceu na TV? Não, nunca.' },
      { english: 'Have they ever broken a bone? Yes, they have.', portuguese: 'Eles já quebraram um osso? Sim, já.' },
      { english: 'Have you ever gotten seasick? No, I haven’t.', portuguese: 'Você já ficou enjoado no mar? Não, nunca.' },
      { english: 'Has he ever lost his phone? Yes, he has.', portuguese: 'Ele já perdeu o telefone dele? Sim, já.' },
      { english: 'We have met a famous person before.', portuguese: 'Nós já conhecemos uma pessoa famosa antes.' },
      { english: 'She has moved to another city twice.', portuguese: 'Ela já se mudou para outra cidade duas vezes.' },
      { english: 'They have won an award for their work.', portuguese: 'Eles ganharam um prêmio pelo trabalho deles.' }
    ],
    dialogue: [
      { speaker: 'A', text: 'Have you ever met a famous person?' },
      { speaker: 'B', text: 'I think so. I saw a movie star at the airport.' },
      { speaker: 'A', text: 'Have you ever been on TV because of that?' },
      { speaker: 'B', text: 'I don’t think so. It was just a quick moment.' }
    ],
    exercises: [
      { portuguese: 'Você já quebrou um osso?', correctAnswer: 'Have you ever broken a bone' },
      { portuguese: 'Sim, eu já.', correctAnswer: 'Yes I have' },
      { portuguese: 'Não, eu nunca.', correctAnswer: 'No I have not' },
      { portuguese: 'Ela já ganhou um prêmio.', correctAnswer: 'She has won an award' },
      { portuguese: 'Eles já atuaram em uma peça.', correctAnswer: 'They have acted in a play' },
      { portuguese: 'Você já perdeu seu telefone?', correctAnswer: 'Have you ever lost your phone' },
      { portuguese: 'Nós nos mudamos para outra cidade.', correctAnswer: 'We have moved to another city' },
      { portuguese: 'Ele já apareceu na TV?', correctAnswer: 'Has he ever been on TV' },
      { portuguese: 'Eu nunca fiquei enjoado no mar.', correctAnswer: 'I have never gotten seasick' },
      { portuguese: 'Eles já conheceram uma pessoa famosa?', correctAnswer: 'Have they ever met a famous person' }
    ]
  },
  {
    id: 50,
    title: 'Lesson 50',
    subtitle: 'I’d Rather / I’d Rather Not',
    vocabulary: [
      {
        title: 'Actions & Verbs',
        items: [
          { english: 'hire hired', portuguese: 'contratar, contratado' },
          { english: 'judge judged', portuguese: 'julgar, julgado' },
          { english: 'apologize apologized', portuguese: 'pedir desculpas, pediu desculpas' },
          { english: 'starve starved', portuguese: 'passar fome, passou fome' },
          { english: 'steal stole', portuguese: 'roubar, roubou' },
          { english: 'die died', portuguese: 'morrer, morreu' },
          { english: 'focus focused', portuguese: 'focar, focado' },
          { english: 'lose lost', portuguese: 'perder, perdeu' },
          { english: 'save money', portuguese: 'economizar dinheiro' },
          { english: 'sit by the window', portuguese: 'sentar na janela' },
          { english: 'aisle', portuguese: 'corredor (em transportes)' }
        ]
      }
    ],
    phrases: [
      { english: 'I’d rather hire a professional.', portuguese: 'Eu preferiria contratar um profissional.' },
      { english: 'I’d rather not judge him without knowing the facts.', portuguese: 'Eu preferiria não julgá-lo sem saber os fatos.' },
      { english: 'She’d rather apologize than lose a friend.', portuguese: 'Ela preferiria pedir desculpas do que perder um amigo.' },
      { english: 'They’d rather starve than steal food.', portuguese: 'Eles prefeririam passar fome do que roubar comida.' },
      { english: 'We’d rather focus on the future.', portuguese: 'Nós preferiríamos focar no futuro.' },
      { english: 'He’d rather sit by the window than in the aisle.', portuguese: 'Ele preferiria sentar na janela do que no corredor.' },
      { english: 'I’d rather save money for a trip.', portuguese: 'Eu preferiria economizar dinheiro para uma viagem.' }
    ],
    dialogue: [
      { speaker: 'A', text: 'Would you like to sit in the aisle seat?' },
      { speaker: 'B', text: 'I don’t think so. I’d rather sit by the window.' },
      { speaker: 'A', text: 'Should we hire more staff for the project?' },
      { speaker: 'B', text: 'I think so. We need more people to focus on it.' }
    ],
    exercises: [
      { portuguese: 'Eu preferiria economizar dinheiro.', correctAnswer: 'I would rather save money' },
      { portuguese: 'Eu preferiria não julgá-la.', correctAnswer: 'I would rather not judge her' },
      { portuguese: 'Ele preferiria sentar no corredor.', correctAnswer: 'He would rather sit in the aisle' },
      { portuguese: 'Nós preferiríamos focar no trabalho.', correctAnswer: 'We would rather focus on work' },
      { portuguese: 'Eles prefeririam pedir desculpas.', correctAnswer: 'They would rather apologize' },
      { portuguese: 'Eu preferiria não contratar ninguém agora.', correctAnswer: 'I would rather not hire anyone now' },
      { portuguese: 'Ela preferiria morrer a roubar.', correctAnswer: 'She would rather die than steal' },
      { portuguese: 'Você preferiria sentar na janela?', correctAnswer: 'Would you rather sit by the window' },
      { portuguese: 'Eu preferiria não perder meu tempo.', correctAnswer: 'I would rather not lose my time' },
      { portuguese: 'Nós preferiríamos não passar fome.', correctAnswer: 'We would rather not starve' }
    ]
  }
];
