// Textos e números do site. Para mudar um texto, mude aqui.
// Valores em R$ milhões, salvo indicação.

const GRUPO = {
  nomes: "[nomes do grupo]",
  disciplina: "[nome da disciplina]",
  data: "[data da apresentação]",
};

const HISTORICO = {
  anos: ["2023", "2024", "2025"],
  series: {
    receita: { nome: "Receita líquida", valores: [32504, 37987, 40804], cor: "ouro" },
    lucro: { nome: "Lucro líquido", valores: [5732, 6043, 6376], cor: "verde" },
    ebitda: { nome: "EBITDA", valores: [7090, 8503, 9000], cor: "ouro" },
    capex: { nome: "CAPEX", valores: [1659, 1850, 2691], cor: "ouro" },
    divida: { nome: "Dívida bruta", valores: [2835, 3595, 4591], cor: "vermelho" },
    caixa: { nome: "Caixa e aplicações", valores: [7081, 7996, 7280], cor: "verde" },
  },
  botoes: [
    { id: "receita_lucro", rotulo: "Receita e lucro", series: ["receita", "lucro"] },
    { id: "ebitda", rotulo: "EBITDA", series: ["ebitda"] },
    { id: "capex", rotulo: "CAPEX", series: ["capex"] },
    { id: "divida_caixa", rotulo: "Dívida x caixa", series: ["divida", "caixa"] },
  ],
  margens: [
    ["Crescimento da receita", "-", "16,9%", "7,4%", ["Desacelerou", "amarelo"]],
    ["Margem bruta", "33,2%", "33,7%", "33,5%", ["Estável", "verde"]],
    ["Margem EBIT", "19,9%", "20,2%", "19,6%", ["Estável", "verde"]],
    ["Margem líquida", "17,6%", "15,9%", "15,6%", ["Leve queda", "amarelo"]],
    ["ROE", "33,1%", "27,2%", "36,6%", ["Alto", "verde"]],
    ["Caixa líquido (R$ mi)", "4.246", "4.401", "2.689", ["Positivo", "verde"]],
  ],
};

const AREAS = [
  ["Motores elétricos", "Motores para máquinas e indústrias"],
  ["Equipamentos industriais", "Automação e equipamentos para fábricas"],
  ["GTD (energia)", "Geração, transmissão e distribuição: transformadores e solar"],
  ["Tintas e vernizes", "Tintas industriais e vernizes"],
];

const POR_QUE = [
  ["Dívida menor que o caixa", ["Sim", "verde"]],
  ["Lucro estável em 3 anos", ["Sim", "verde"]],
  ["Dados completos na CVM", ["Sim", "verde"]],
  ["Recuperação judicial", ["Não está", "verde"]],
];

const CENARIO = [
  ["Selic", "13,75% ao ano, mantida pelo Copom em 04/11/2026", "Taxa de desconto maior, valor presente menor", ["Risco", "vermelho"]],
  ["Resultado do 4T25", "Receita de R$ 10,2 bi (queda de 5,3%) e lucro de R$ 1,59 bi (queda de 6,3%)", "Solar e câmbio pesaram no fim do ano", ["Risco", "vermelho"]],
  ["ROIC", "Caiu de 34,2% para 32,5%", "Caiu, mas continua muito alto", ["Atenção", "amarelo"]],
  ["CAPEX 2026", "R$ 3,6 bi: transformadores no México, EUA e Colômbia e fábrica de baterias (BESS)", "Prepara o crescimento, mas consome caixa agora", ["Oportunidade", "verde"]],
  ["Consenso 2026", "Receita +10%, EBITDA +9% e lucro +9%", "Base da nossa premissa de 2026", ["Oportunidade", "verde"]],
];

const PREMISSAS = [
  ["Crescimento da receita", "10%, 9%, 8%, 7%, 6% (2026 a 2030)", "2026 igual ao consenso, depois cai 1 ponto por ano", ["Mercado", "azul"]],
  ["Margem bruta", "33,5%", "Média de 2023 a 2025", ["Histórico", "verde"]],
  ["Margem EBIT", "19,5%", "Um pouco abaixo da média, por causa de solar e câmbio", ["Cautela", "amarelo"]],
  ["Alíquota de IR", "18%", "A média foi perto de 16% por causa do JCP", ["Cautela", "amarelo"]],
  ["CAPEX", "R$ 3,6 bi em 2026, depois 6%, 5%, 4,5% e 4% da receita", "Orçamento divulgado, depois volta à média", ["Empresa", "azul"]],
  ["Capital de giro", "35% da receita", "Média de 2023 a 2025", ["Histórico", "verde"]],
  ["Depreciação", "2,5% da receita", "Segue a tendência de alta", ["Histórico", "verde"]],
  ["Crescimento após 2030 (g)", "5% ao ano", "Inflação de uns 4% mais 1% real", ["Economia", "azul"]],
];

const RISCOS = [
  ["Juros caindo mais rápido", "Taxa de desconto menor aumenta o preço justo", ["Risco da tese", "vermelho"]],
  ["Transformadores e baterias acima do esperado", "Crescimento maior que os 10% a 6% projetados", ["Risco da tese", "vermelho"]],
  ["Câmbio favorecendo exportações", "Real mais fraco aumenta a receita em reais", ["Risco da tese", "vermelho"]],
  ["Horizonte de 5 anos", "Penaliza empresas que crescem por muito tempo, como a WEG", ["Limitação", "amarelo"]],
  ["Premissas cautelosas", "IR de 18% e margem EBIT de 19,5% reduzem um pouco o valor", ["Limitação", "amarelo"]],
];

const FONTES = [
  ["CVM", "DFP consolidada de 2023 e 2025"],
  ["RI da WEG", "Resultados do 4T25 e CAPEX de 2026"],
  ["Tesouro Direto", "Tesouro IPCA+ 2035 (juro real)"],
  ["Banco Central", "Copom (Selic) e boletim Focus"],
  ["Cotação", "R$ 51,11 por ação [conferir data e fonte]"],
  ["Beta", "0,75 [conferir fonte]"],
];

// Notas do apresentador, uma por tela. Aparecem com a tecla N.
const NOTAS = {
  capa: [
    "Boa noite. Nós somos o grupo [nome] e a empresa que escolhemos foi a WEG, código WEGE3 na B3.",
    "No trabalho a gente faz o papel de analista de um fundo de ações. Olhamos os últimos três anos da empresa, projetamos o caixa dos próximos cinco anos e, no final, dizemos se o fundo deveria comprar, manter ou vender a ação.",
    "Já adiantando a conclusão: a WEG é uma empresa muito boa, mas no preço de hoje a ação está cara. O resto da apresentação mostra como a gente chegou nisso.",
    "Se perguntarem por que a WEG: ela tem mais caixa do que dívida, o lucro é estável, os dados estão completos na CVM e ela não está em recuperação judicial, que o professor proibiu.",
  ],
  empresa: [
    "A WEG é de Jaraguá do Sul, em Santa Catarina. Ela trabalha em quatro áreas: motores elétricos, que é a origem da empresa; equipamentos e automação para fábricas; a parte de energia, que a gente chama de GTD (geração, transmissão e distribuição), onde entram os transformadores e os projetos solares; e tintas e vernizes.",
    "Ela não é só brasileira. Tem fábricas no México, nos Estados Unidos, na China, na Índia e em outros países. Falamos que cerca de metade da receita vem do exterior. Esse número precisa ser conferido no site de relações com investidores (ri.weg.net) antes da apresentação. Se a banca pedir o número exato, a resposta honesta é que é aproximado.",
    "Por que escolhemos a WEG: tem mais caixa do que dívida, então o risco de quebrar é baixo. O lucro foi estável nos três anos. Os dados estão completos na CVM. E ela não está em recuperação judicial.",
    "Se perguntarem o que é recuperação judicial: é quando a empresa pede proteção na Justiça para renegociar dívidas que não consegue pagar. O professor proibiu porque o fluxo de caixa dessas empresas fica imprevisível.",
  ],
  historico: [
    "Esses números vêm das demonstrações financeiras consolidadas que a WEG entrega à CVM, a DFP. Tudo em milhões de reais. Os botões em cima do gráfico trocam o que aparece: receita e lucro, EBITDA, CAPEX ou dívida contra caixa.",
    "A receita foi de 32,5 bilhões em 2023 para 40,8 bilhões em 2025. O lucro líquido subiu de 5,7 para 6,4 bilhões. Mas o crescimento perdeu força: foi 16,9% em 2024 e 7,4% em 2025.",
    "As margens quase não mudaram. A bruta ficou perto de 33,5% e a margem EBIT perto de 20%. A margem líquida caiu um pouco, de 17,6% para 15,6%.",
    "O ROE de 2025 chama atenção porque pulou para 36,6%. Isso não quer dizer que a empresa ficou mais lucrativa. Em 2025 a WEG pagou 5,4 bilhões em dividendos, contra 2,9 bilhões em 2024, e boa parte foi extraordinária. Isso diminuiu o patrimônio líquido, que é o divisor do ROE, então o ROE subiu.",
    "Caixa líquido é o caixa mais aplicações menos a dívida bruta. Continua positivo, mas caiu em 2025 porque a dívida subiu e o investimento também: o CAPEX foi de 1,85 bilhão em 2024 para 2,69 bilhões em 2025.",
  ],
  cenario: [
    "Aqui é o que acontece fora da empresa e que mexe com a nossa análise.",
    "O ponto mais pesado é a Selic em 13,75% ao ano. O Copom manteve a taxa na reunião de 4 de novembro de 2026. Juro alto atrapalha de dois jeitos: deixa a taxa de desconto maior, o que reduz o valor presente da empresa, e deixa a renda fixa mais atraente do que a bolsa.",
    "O quarto trimestre de 2025 foi fraco. A receita foi de 10,2 bilhões, 5,3% menor que no mesmo trimestre de 2024, e o lucro foi de 1,59 bilhão, queda de 6,3%. Os motivos foram menos demanda por projetos solares e o câmbio.",
    "O ROIC é o retorno sobre o capital investido. Caiu de 34,2% para 32,5%, mas continua muito acima do custo de capital, por isso colocamos como atenção e não como risco.",
    "Do lado bom, a WEG aprovou 3,6 bilhões de investimento para 2026: fábricas de transformadores no México, nos EUA e na Colômbia e uma fábrica nova de baterias. BESS é a sigla para sistema de armazenamento de energia em baterias.",
    "E o mercado espera para 2026 receita 10% maior, EBITDA 9% maior e lucro 9% maior. Usamos esse consenso como a nossa premissa de crescimento para 2026.",
  ],
  premissas: [
    "Toda projeção depende dessas escolhas, então é aqui que a banca mais pode perguntar. A coluna da direita mostra de onde veio cada uma. Quando existia um número divulgado, como o consenso do mercado ou o orçamento de investimento da WEG, a gente usou. Quando não existia, usamos a média de 2023 a 2025. Em dois casos fomos mais cautelosos que a média.",
    "Crescimento: 10% em 2026, que é o consenso, e depois cai um ponto por ano até 6% em 2030. A ideia é que a empresa cresce bem, mas vai desacelerando.",
    "Margem EBIT de 19,5%: a média dos três anos foi perto de 19,9%. Usamos um pouco menos por causa do solar e do câmbio que pesaram no fim de 2025.",
    "Imposto de 18%: na média a WEG pagou uns 16%, porque usa juros sobre capital próprio (JCP). O JCP é um jeito de pagar o acionista que pode ser lançado como despesa, então reduz o imposto. Como isso pode mudar, usamos 18% por cautela.",
    "Capital de giro é o dinheiro preso em contas a receber e estoque, menos o que a empresa deve aos fornecedores. Quando a receita cresce, ele cresce junto e consome caixa.",
    "Crescimento depois de 2030 (o g) de 5% ao ano para sempre: 4% de inflação mais 1% de crescimento real. Não faz sentido uma empresa crescer para sempre muito acima da economia.",
  ],
  wacc: [
    "Essa é a taxa que usamos para trazer o caixa futuro para valor de hoje. Ela também é a nossa TMA, a taxa mínima de atratividade, ou seja, o retorno mínimo que vale a pena para o investidor. O botão mostra a conta um passo de cada vez.",
    "Passo 1: o juro livre de risco vem do Tesouro IPCA+ 2035, que paga 6,93% acima da inflação. Somando uma inflação esperada de 4%, do jeito certo, que é multiplicando (1,0693 vezes 1,04, menos 1), dá 11,21%.",
    "Passo 2: o custo do acionista (Ke) pelo CAPM. É o juro livre de risco mais o beta vezes o prêmio de risco do mercado, que usamos de 5%. O beta mede quanto a ação balança em relação à bolsa. Um beta de 0,75 quer dizer que ela oscila menos que o Ibovespa. Esse beta é uma estimativa e o grupo precisa conferir e citar a fonte.",
    "Passo 3: o custo da dívida (Kd). Usamos a Selic de 13,75%. Como os juros da dívida reduzem o imposto, tiramos 34% (25% de IR mais 9% de CSLL) e fica 9,08%.",
    "Se perguntarem por que 34% aqui e 18% na projeção: 34% é a alíquota cheia, que é o quanto cada real de juros economiza de imposto. Os 18% são o que a WEG paga de fato, que é menos por causa do JCP.",
    "Passo 4: os pesos. As ações valem 214,5 bilhões na bolsa e a dívida é de 4,6 bilhões, então quase tudo (97,9%) é capital do acionista. Por isso, mesmo se o Kd estivesse errado, o WACC quase não mudaria.",
    "Resultado: WACC de 14,83%.",
  ],
  fcff: [
    "FCFF é o fluxo de caixa livre da firma: o dinheiro que sobra da operação depois de pagar imposto e fazer os investimentos. É o que fica disponível para quem financia a empresa, tanto acionista quanto banco.",
    "Clicando em um ano, aparece a conta daquele ano. Pegamos o lucro operacional (EBIT) e tiramos o imposto. Somamos a depreciação de volta, porque ela é uma despesa que aparece no resultado mas não sai do caixa. Depois tiramos o CAPEX, que é o investimento em fábricas e máquinas, e o aumento do capital de giro.",
    "O fluxo sai de 3,9 bilhões em 2026 para 7,5 bilhões em 2030. Em 2026 ele fica bem abaixo do lucro (6,9 bilhões) por causa do CAPEX alto de 3,6 bilhões. A partir de 2027 o CAPEX volta para uns 6% da receita e o fluxo cresce mais rápido.",
    "Se perguntarem do capital de giro de 2026: o ponto de partida é o capital de giro real do balanço de 2025 (contas a receber mais estoques menos fornecedores). A partir daí ele passa a ser 35% da receita de cada ano.",
    "Valor terminal é o valor de todos os fluxos depois de 2030, crescendo 5% ao ano para sempre. Usamos a fórmula de Gordon: o FCFF de 2030 vezes 1,05, dividido por (WACC menos g). Dá 80 bilhões em 2030.",
  ],
  indicadores: [
    "Aqui é o resultado da análise de investimento. A pergunta é: se o fundo comprasse a WEG inteira pelo preço de hoje, o caixa que projetamos pagaria esse investimento?",
    "Investimento inicial (T0): é quanto custa a empresa inteira hoje na bolsa, o EV. São os 214,5 bilhões das ações menos 2,7 bilhões de caixa líquido, porque quem compra a empresa leva esse caixa junto. Dá 211,8 bilhões.",
    "As barras de baixo mostram o tamanho do problema. Os fluxos de cinco anos somam 28,5 bilhões. Mesmo trazendo para hoje tudo o que a empresa gera para sempre, com o valor terminal, chegamos a 58,4 bilhões. O preço é 211,8 bilhões.",
    "VPL: valor presente dos fluxos (58,4 bilhões) menos o investimento (211,8 bilhões) dá menos 153,4 bilhões. VPL negativo quer dizer que o preço pago é maior do que o caixa que a empresa vai gerar, trazido a valor de hoje.",
    "TIR: é a taxa que faz o VPL dar zero. Deu menos 13,5%. Ser negativa quer dizer que, pagando o preço de hoje e recebendo só o que projetamos, o investidor nem recupera o dinheiro. A regra é aprovar quando a TIR é maior que a TMA, e aqui ela está muito abaixo dos 14,8%.",
    "Payback simples: os fluxos de 2026 a 2030 somam 28,5 bilhões, longe dos 211,8. Se o fluxo continuar crescendo 5% ao ano depois de 2030, levaria uns 21 anos. Payback descontado: não se paga nunca, porque até o valor presente de todos os fluxos fica abaixo do preço de hoje.",
  ],
  rentabilidade: [
    "ROE é o lucro dividido pelo patrimônio líquido. Mostra quanto a empresa ganha para cada real dos acionistas. A WEG fica acima de 25% em todos os anos, o que é muito alto. Na projeção ele cai aos poucos porque a empresa guarda 45% do lucro (o resto vira dividendo), o patrimônio vai crescendo e cresce mais rápido do que o próprio lucro.",
    "Margem líquida é o lucro dividido pela receita. Fica em 15,3% em toda a projeção porque mantivemos as margens fixas nas premissas.",
    "ROI: usamos a fórmula pedida no enunciado, que é a receita menos o custo do produto vendido (CPV), dividido pelo CPV. Dá perto de 50% em todos os anos. Na prática isso é o lucro bruto dividido pelo custo, ou seja, um markup: para cada 1 real de custo, a WEG vende por cerca de 1,50. Não é o ROI clássico, que compara lucro com o dinheiro investido. Se a banca perguntar, a gente explica que seguiu o enunciado e sabe o que o número representa.",
  ],
  preco: [
    "Aqui está o número principal do trabalho. Pegamos o valor da firma pelo fluxo descontado, 58,4 bilhões. Somamos o caixa líquido de 2,7 bilhões e tiramos 1,1 bilhão dos minoritários. Minoritários são os sócios que têm parte de algumas empresas do grupo WEG, então essa parte não é do acionista da WEG. Sobram 60,0 bilhões para as ações. Dividindo pelas 4.197,3 milhões de ações, dá 14,29 reais por ação.",
    "Na bolsa a ação está em 51,11 reais. Pelo nosso modelo, ela está custando mais de três vezes o que vale. O potencial é de menos 72%.",
    "A tabela é a análise de sensibilidade. Ela mostra o preço justo se a gente mudar a taxa de desconto (linhas) e o crescimento depois de 2030 (colunas). Serve para ver se a conclusão depende muito de uma premissa. Passando o mouse em cima de uma célula aparece o cenário.",
    "O gráfico 3D mostra a mesma tabela. Cada barra é um cenário e o plano vermelho fica na altura da cotação de 51,11. Nenhuma barra atravessa o plano. Dá para girar arrastando com o mouse.",
    "O que ela mostra: mesmo no canto mais otimista, com WACC de 10% e crescimento de 7% ao ano para sempre, o preço justo fica em 44,92 reais, ainda abaixo dos 51,11. Ou seja, o mercado está pagando por um crescimento bem maior do que o que projetamos.",
  ],
  simulador: [
    "Essa tela é para responder pergunta da banca na hora. Ela faz as mesmas contas da planilha. Dá para mexer nos juros, no beta, no crescimento, na margem e na cotação, e ver o preço justo, o VPL e a TIR mudarem.",
    "Uma coisa que aparece aqui: mexer na Selic quase não muda nada. Isso porque a Selic só entra no custo da dívida, e a dívida é só 2% do total. O que pesa é o juro do Tesouro IPCA+, que entra no custo do acionista. Na vida real, quando a Selic cai, esse juro costuma cair junto.",
    "O quadro de baixo mostra o que o preço de hoje está pressupondo. Com as nossas premissas, para a ação valer 51,11 a WEG teria que crescer uns 12,7% ao ano para sempre depois de 2030, ou o investidor teria que aceitar um retorno de uns 7,8% ao ano, abaixo até do Tesouro.",
    "O botão de voltar coloca tudo de novo nas premissas do grupo.",
  ],
  recomendacao: [
    "Nossa recomendação é VENDA. Resumindo em uma frase: a WEG é uma empresa excelente, mas a ação está cara.",
    "Primeiro motivo: o preço justo de 14,29 reais é muito menor que os 51,11 da bolsa. Segundo: a TIR é negativa e o VPL também, então o investimento não passa na regra da TMA. Terceiro: nem na sensibilidade mais otimista o preço justo chega na cotação.",
    "Uma coisa que o grupo precisa decidir antes da apresentação: dá para defender MANUTENÇÃO em vez de VENDA. O argumento seria para quem já tem a ação e aposta no longo prazo, já que a empresa é muito boa e o nosso modelo só olha cinco anos. Se o grupo mudar, é só trocar no arquivo js/data.js (constante RECOMENDACAO). O professor aceita qualquer posição bem justificada.",
    "Se perguntarem como uma empresa tão boa pode ser venda: ser boa empresa e ser bom investimento são coisas diferentes. O que decide é o preço que você paga por ela.",
  ],
  riscos: [
    "Aqui mostramos o que faria a nossa recomendação estar errada. É bom ter isso pronto porque a banca costuma perguntar.",
    "Juros caindo mais rápido: se os juros caírem, a taxa de desconto cai e o preço justo sobe. Pela tabela de sensibilidade, com g de 5%, passar o WACC de 14% para 12% leva o preço justo de 15,66 para 20,29 reais. Ainda fica longe dos 51, mas ajuda.",
    "Transformadores e baterias crescendo mais do que o esperado: é para isso que a WEG está investindo 3,6 bilhões em 2026. Se essas fábricas derem certo, o crescimento pode ficar acima dos 10% a 6% que usamos.",
    "Câmbio: boa parte da receita vem de fora. Se o real ficar mais fraco, a receita em reais sobe.",
    "Limitação do modelo: o trabalho pede cinco anos de projeção. Para uma empresa que cresce há décadas, como a WEG, isso pesa contra, porque quase todo o valor fica jogado para a perpetuidade e com g de só 5%. O mercado provavelmente está olhando um prazo bem mais longo.",
    "Também fomos cautelosos em algumas premissas, como imposto de 18% e margem EBIT de 19,5%. Isso puxa o preço justo um pouco para baixo, mas não muda a conclusão.",
  ],
  fontes: [
    "Essas foram as fontes. Os números históricos são das demonstrações oficiais entregues à CVM. O cenário do quarto trimestre e o CAPEX de 2026 vieram do site de relações com investidores da WEG. O juro real do Tesouro IPCA+ 2035 veio do Tesouro Direto. A Selic e a expectativa de inflação vêm do Banco Central (Copom e boletim Focus).",
    "Antes de apresentar, o grupo precisa conferir a data e a fonte da cotação de 51,11 reais e a fonte do beta.",
    "Obrigado. Agora a gente abre para perguntas.",
  ],
};

// Recomendação do grupo. Trocar para "MANUTENÇÃO" se o grupo decidir assim.
const RECOMENDACAO = {
  palavra: "VENDA",
  frase: "Empresa excelente, ação cara.",
  motivos: [
    "Preço justo de R$ 14,29 contra R$ 51,11 na bolsa",
    "TIR de −13,5% contra TMA de 14,8%, e VPL negativo",
    "Nem no cenário mais otimista o preço justo chega a R$ 51",
  ],
};
