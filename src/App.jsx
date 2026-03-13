import React, { useMemo, useState, useCallback } from "react";

/* ─────────────────────────────────────────────
   SISTEMA DE ÍCONES SVG EMBUTIDO (sem lucide-react)
   viewBox 24x24, baseado em traço, 2px de traço
   ───────────────────────────────────────────── */
const ICON_PATHS = {
  bookOpen: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  brain: "M9.5 2a3.5 3.5 0 0 0-3 5.1A3.5 3.5 0 0 0 5 10.5 3.5 3.5 0 0 0 6 14a3.5 3.5 0 0 0 2.8 4A3.5 3.5 0 0 0 12 21a3.5 3.5 0 0 0 3.2-3 3.5 3.5 0 0 0 2.8-4 3.5 3.5 0 0 0 1-3.5 3.5 3.5 0 0 0-1.5-3.4A3.5 3.5 0 0 0 14.5 2 3.5 3.5 0 0 0 12 3.5 3.5 3.5 0 0 0 9.5 2zM12 3.5v17.5",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  globe: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  folderOpen: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2zM2 10h20",
  settings: "M12 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  settingsGear: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  bot: "M12 8V4H8M8 2h8M2 14a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zM9 16h.01M15 16h.01",
  penTool: "M12 19l7-7 3 3-7 7zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18z M2 2l7.586 7.586M11 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  checkCircle: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM9 12l2 2 4-4",
  sparkles: "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5zM19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75z",
  mic: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8",
  imagePlus: "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7M16 5h6M19 2v6M21 15l-5-5L5 21",
  fileText: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  clock: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2",
  panelsTopLeft: "M3 3h18a0 0 0 0 1 0 0v18a0 0 0 0 1 0 0H3a0 0 0 0 1 0 0V3zM3 9h18M9 21V9",
  workflow: "M3 3h4v4H3zM17 3h4v4h-4zM10 17h4v4h-4zM5 7v3a4 4 0 0 0 4 4h2M19 7v3a4 4 0 0 1-4 4h-2",
  laptop: "M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9M2 20h20M12 16v4",
  wrench: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  compass: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z",
  arrowRight: "M5 12h14M12 5l7 7-7 7",
  refreshCcw: "M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15",
  link2: "M9 17H7a5 5 0 0 1 0-10h2M15 7h2a5 5 0 0 1 0 10h-2M8 12h8",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  headphones: "M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z",
  table2: "M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18",
  camera: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  layoutGrid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  school: "M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5",
  share2: "M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98",
  lightbulb: "M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z",
  chevronDown: "M6 9l6 6 6-6",
  alertTriangle: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  layers: "M12 2l10 6.5v7L12 22 2 15.5v-7zM2 8.5l10 6.5 10-6.5M12 22V15",
  messageSquare: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  database: "M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3zM21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5",
};

function Ico({ name, className = "", style = {} }) {
  const d = ICON_PATHS[name];
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d={d} />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   FONTES + ESTILOS GLOBAIS
   ───────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;1,9..144,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
    .ff-display { font-family: 'Fraunces', Georgia, serif; }
    .ff-body { font-family: 'DM Sans', system-ui, sans-serif; }
    .ff-mono { font-family: 'JetBrains Mono', monospace; }
    * { font-family: 'DM Sans', system-ui, sans-serif; }
    .clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  `}</style>
);

/* ─────────────────────────────────────────────
   CORES
   ───────────────────────────────────────────── */
const C = {
  cream: "#FAF8F4", creamDark: "#F0EDE6", ink: "#1A1A1A", inkLight: "#6B6B6B",
  inkMuted: "#9B9B9B", border: "#E2DFD8", borderLight: "#ECEAE4",
  greenDeep: "#0A3D2E", greenMid: "#10a37f", greenLight: "#E8F5EE", roseAccent: "#E11D48",
};

/* ─────────────────────────────────────────────
   DADOS
   ───────────────────────────────────────────── */
const VERIFIED_DATE = "12 de março de 2026";
const LEVELS = [
  { key: "all", label: "Todos" }, { key: "fundamentos", label: "Fundamentos" },
  { key: "essencial", label: "Essencial" }, { key: "avançado", label: "Avançado" }, { key: "especialista", label: "Especialista" },
];

const CORE_FEATURES = [
  { title: "Pesquisa", ico: "globe", color: "#0284c7", description: "Resultados em tempo real na web para fatos atuais, preços, notícias, leis e qualquer coisa que mude.", when: "Qualquer coisa que possa ter mudado desde o limite de treinamento do modelo." },
  { title: "Pesquisa aprofundada", ico: "search", color: "#4f46e5", description: "Pesquisa documentada em várias etapas usando fontes da web, arquivos e apps conectados.", when: "Quando você precisa de um relatório com fontes, não de uma resposta rápida." },
  { title: "Projetos", ico: "folderOpen", color: "#059669", description: "Espaço de trabalho persistente com arquivos compartilhados, instruções personalizadas e memória da conversa.", when: "Qualquer trabalho ao qual você vai voltar: cursos, clientes, startups." },
  { title: "Memória", ico: "database", color: "#d97706", description: "Armazena preferências duradouras e contexto recorrente entre conversas.", when: "Preferências e padrões, não armazenamento exato de documentos." },
  { title: "Instruções personalizadas", ico: "settingsGear", color: "#57534e", description: "Regras sempre ativas para tom, formatação e estrutura das respostas.", when: "Quando você quer que cada chat siga suas regras por padrão." },
  { title: "Canvas", ico: "panelsTopLeft", color: "#334155", description: "Uma área visível de edição para textos e código, com ajustes pontuais em linha.", when: "Edição iterativa de textos longos ou código." },
  { title: "Tarefas", ico: "clock", color: "#7c3aed", description: "Agenda resultados para serem executados depois e envia notificações.", when: "Lembretes, briefings diários, resumos recorrentes." },
  { title: "Apps (conectores)", ico: "wrench", color: "#0d9488", description: "Conecta ferramentas externas para que o ChatGPT possa ler seus dados e agir sobre eles.", when: "Quando o melhor contexto está fora do chat." },
  { title: "Agente", ico: "workflow", color: "#16a34a", description: "Execução autônoma em navegadores, arquivos, código e apps conectados.", when: "Tarefas em várias etapas, sites e ações." },
  { title: "GPTs personalizados", ico: "bot", color: "#44403c", description: "Assistentes reutilizáveis com instruções estáveis e arquivos de conhecimento.", when: "Quando um fluxo de trabalho se repete com frequência suficiente para ser formalizado." },
  { title: "Voz", ico: "mic", color: "#e11d48", description: "Interação falada para pensar e explorar com menos atrito.", when: "Quando você quer pensar em voz alta ou fazer várias coisas ao mesmo tempo." },
  { title: "Imagens", ico: "imagePlus", color: "#c026d3", description: "Envie para análise, gere a partir de descrições e edite diretamente.", when: "Compreensão visual, criação ou refinamento." },
  { title: "Arquivos e dados", ico: "fileText", color: "#0891b2", description: "Envie PDFs, planilhas e documentos para análise com execução de código.", when: "Gráficos, resumos, cálculos." },
  { title: "Modelos", ico: "brain", color: "#65a30d", description: "Escolha entre modos mais rápidos, equilibrados ou com foco em raciocínio.", when: "Ajuste a potência à complexidade da tarefa." },
];

const ADDITIONAL_FEATURES = [
  { title: "Modo de estudo", ico: "school", color: "#059669", description: "Aprendizado guiado com perguntas e checagens de compreensão." },
  { title: "Gravar", ico: "headphones", color: "#0284c7", description: "Capture reuniões faladas e depois gere resumos." },
  { title: "Chats em grupo", ico: "users", color: "#7c3aed", description: "Convide outras pessoas para uma conversa e planejem juntos." },
  { title: "Links compartilhados", ico: "link2", color: "#57534e", description: "Compartilhe uma conversa por URL." },
  { title: "Edição de imagem", ico: "camera", color: "#c026d3", description: "Selecione e refine áreas de imagens geradas." },
  { title: "Tabelas interativas", ico: "table2", color: "#0891b2", description: "Inspecione dados enviados visualmente antes da análise." },
  { title: "Skills", ico: "share2", color: "#0d9488", description: "Fluxos reutilizáveis para trabalhos recorrentes com consistência." },
  { title: "Pulse", ico: "sparkles", color: "#4f46e5", description: "Pesquisa assíncrona que devolve resumos visuais." },
];

const TOOL_CHOOSER = [
  { goal: "Resposta rápida ou rascunho", tool: "Chat normal", ico: "messageSquare", reason: "Menor atrito." },
  { goal: "Informação atual", tool: "Pesquisa", ico: "globe", reason: "Qualquer coisa que possa ter mudado." },
  { goal: "Trabalho contínuo com arquivos", tool: "Projeto", ico: "folderOpen", reason: "Preserva contexto entre sessões." },
  { goal: "Editar um documento longo", tool: "Canvas", ico: "panelsTopLeft", reason: "Melhor para revisão pontual." },
  { goal: "Relatório com várias fontes", tool: "Pesquisa aprofundada", ico: "search", reason: "Síntese em várias etapas com citações." },
  { goal: "Tarefa online complexa", tool: "Agente", ico: "workflow", reason: "Passa por vários sites e ações." },
  { goal: "Saída recorrente", tool: "Tarefas", ico: "clock", reason: "Roda de forma assíncrona e avisa você." },
  { goal: "Mesmo fluxo com frequência", tool: "GPT ou Skill", ico: "bot", reason: "Transforma padrões em sistemas." },
];

const PROMPT_BLOCKS = [
  { label: "Objetivo", example: "Escreva um briefing de projeto de uma página para uma reunião com investidores.", color: "#10a37f" },
  { label: "Contexto", example: "A startup ainda não gera receita, está em Série A e atua em climate tech.", color: "#0284c7" },
  { label: "Restrições", example: "Menos de 400 palavras. Sem jargão. Sem marcadores.", color: "#7c3aed" },
  { label: "Formato", example: "Estruture assim: Problema, Solução, Tração, Pedido.", color: "#d97706" },
  { label: "Qualidade", example: "Escreva no nível de um associate da McKinsey, não como um modelo genérico.", color: "#e11d48" },
  { label: "Verificar", example: "Sinalize qualquer afirmação que precise de fonte.", color: "#334155" },
];

const GUIDE_SECTIONS = [
  { id:"mental-model", level:"fundamentos", number:"01", title:"Comece com o modelo mental certo", ico:"brain", color:"#65a30d",
    summary:"Trate o ChatGPT como um parceiro de raciocínio, não como um oráculo. A primeira resposta é um rascunho útil, não a verdade final. Considere toda saída como provisória até ser inspecionada.",
    whyItMatters:"A maior parte da frustração vem de expectativas erradas. Espere um bom primeiro rascunho, não certeza absoluta.",
    beginnerMoves:["Presuma que a primeira resposta é um rascunho. Leia com senso crítico.","Pergunte quais suposições foram feitas.","Use o ChatGPT para acelerar seu julgamento, não para substituí-lo."],
    advancedMoves:["Peça o contra-argumento mais forte.","Separe exploração, recomendação e revisão de risco em etapas.","Use como segunda opinião em decisões importantes."],
    commonMistakes:["Confiar em números sem verificar.","Assumir que silêncio significa confiança.","Copiar respostas palavra por palavra."],
    promptExamples:[{prompt:"Quais suposições você fez?",why:"Torna o raciocínio oculto mais visível."},{prompt:"O que um especialista cético questionaria aqui?",why:"Autoavaliação adversarial."},{prompt:"Qual é o argumento mais forte contra a sua recomendação?",why:"Evita viés de confirmação."},{prompt:"Classifique a confiança em cada afirmação de 1 a 5.",why:"Separa fatos de especulação."}],
    beforeAfter:{before:"Escreva um plano de negócios para uma cafeteria.",after:"Faça um plano de uma página para uma cafeteria de especialidade no centro de Boston. Público: estudantes de pós-graduação e pessoas que trabalham remoto. Sinalize qualquer ponto estimado em vez de comprovado por fonte.",improvement:"Acrescenta contexto, público, local e uma regra de verificação."},
    visual:"mental" },
  { id:"workspace", level:"fundamentos", number:"02", title:"Aprenda o espaço de trabalho antes de se prender aos prompts", ico:"laptop", color:"#059669",
    summary:"O ChatGPT moderno é um espaço de trabalho em camadas. Cada tipo de tarefa pertence a uma camada diferente. Um prompt razoável na camada certa funciona melhor do que um prompt brilhante na camada errada.",
    whyItMatters:"Escolher o espaço de trabalho certo é a decisão de maior impacto antes mesmo de digitar.",
    beginnerMoves:["Use chat normal para coisas pontuais e rápidas.","Use projeto para qualquer coisa à qual você vá voltar.","Use Chat Temporário para começar do zero."],
    advancedMoves:["Um projeto por curso, cliente ou iniciativa.","Use projetos como hubs de conhecimento de longo prazo.","Canvas para edição iterativa; chat para estratégia."],
    commonMistakes:["Abrir um chat novo toda vez em vez de voltar ao projeto.","Usar chat para documentos longos em vez de canvas.","Ignorar totalmente tarefas e agente."],
    promptExamples:[{prompt:"Isto deveria ficar em um chat, projeto ou GPT?",why:"O modelo escolhe o espaço certo."},{prompt:"Qual seria a estrutura ideal de projeto para o meu semestre?",why:"Planeja a arquitetura primeiro."},{prompt:"Que arquivos e instruções eu deveria adicionar?",why:"Melhora o contexto do projeto."}],
    beforeAfter:{before:"Eu sempre começo chats novos e perco o contexto.",after:"Crie um Projeto. Envie as referências. Defina instruções. Volte sempre ao mesmo projeto.",improvement:"Chats passageiros viram um espaço de trabalho persistente."},
    visual:"layers" },
  { id:"prompting", level:"fundamentos", number:"03", title:"Prompts: clareza vence esperteza", ico:"penTool", color:"#0284c7",
    summary:"Bons prompts funcionam como instruções operacionais. Linguagem sofisticada é opcional; restrições claras, não. O modelo não vê os critérios que estão na sua cabeça a menos que você escreva.",
    whyItMatters:"Prompts vagos geram respostas genéricas. Quase toda frustração vem de instruções pouco definidas.",
    beginnerMoves:["Nomeie o público e o uso de forma explícita.","Diga claramente o que conta como um bom resultado.","Especifique formato, tom, tamanho e o que evitar."],
    advancedMoves:["Peça primeiro o esboço, aprove, e só depois o texto final.","Separe fatos de interpretação.","Forneça uma rubrica para autoavaliação."],
    commonMistakes:["Prompts de três palavras esperando algo sob medida.","Muitas restrições ao mesmo tempo.","Usar 'você pode...?' em vez de instruções diretas."],
    promptExamples:[{prompt:"Objetivo: ___. Contexto: ___. Restrições: ___. Entregue: ___.",why:"Estrutura universal."},{prompt:"Primeiro faça o esboço. Ainda não redija.",why:"Evita reescrever uma estrutura errada."},{prompt:"Antes de escrever, diga o que você precisa saber.",why:"Faz o modelo pedir esclarecimentos."},{prompt:"Escreva como [papel] explicando para [público].",why:"Define tom e profundidade."}],
    beforeAfter:{before:"Escreva uma carta de apresentação.",after:"Carta de apresentação para vaga de Strategy Analyst na McKinsey. Estudante de pós-graduação em International Management, com experiência em SOP e CRM. Confiante, sem arrogância. 350 palavras. Sem usar \"Sou apaixonado por\".",improvement:"Função, contexto, tom, tamanho e restrição negativa."},
    visual:"prompt" },
  { id:"revision", level:"essencial", number:"04", title:"Fluxos de revisão superam a busca por perfeição de primeira", ico:"refreshCcw", color:"#7c3aed",
    summary:"O uso forte é iterativo: enquadrar, rascunhar, criticar, revisar e entregar. A maioria das pessoas recomeça quando deveria refinar.",
    whyItMatters:"Fazer tudo em uma tentativa limita a qualidade ao primeiro esforço. Revisar quase sempre traz um resultado melhor.",
    beginnerMoves:["Depois do rascunho, pergunte: 'O que está fraco ou faltando?'","Revise com um objetivo mais estreito.","Não recomece a menos que a direção esteja realmente errada."],
    advancedMoves:["Faça etapas fixas: estrutura, precisão, tom, síntese e embalagem final.","Peça autocrítica antes da reescrita.","Especifique taxas de compressão."],
    commonMistakes:["Reescrever manualmente em vez de pedir diagnóstico ao modelo.","Dar feedback vago como 'melhore isso'.","Fazer muitas rodadas sem foco."],
    promptExamples:[{prompt:"Por que sua resposta não atingiu o objetivo?",why:"Autodiagnóstico antes da revisão."},{prompt:"Revise para deixar a lógica mais afiada. Mantenha a estrutura.",why:"Restringe o escopo."},{prompt:"Reduza em 35% sem perder o essencial.",why:"Força priorização."},{prompt:"Avalie com estes critérios. Onde você ficou abaixo de 4/5?",why:"Autoavaliação estruturada."}],
    beforeAfter:{before:"Não está certo. Tente de novo.",after:"O argumento da seção 2 está circular. Reescreva usando um dado do relatório enviado. Mantenha o resto.",improvement:"Define o erro, o que precisa mudar e o que deve ser preservado."},
    visual:"workflow" },
  { id:"writing", level:"essencial", number:"05", title:"Escrever, reescrever e transformar", ico:"fileText", color:"#57534e",
    summary:"O ChatGPT se destaca em transformação: reescrever para públicos diferentes, mudar tom, resumir, reorganizar. Muitas vezes ele melhora melhor um texto existente do que cria algo do zero.",
    whyItMatters:"Grande parte da escrita profissional é transformação. É aqui que a IA costuma gerar mais retorno.",
    beginnerMoves:["Cole o texto original. Diga o que deve permanecer e o que deve mudar.","Especifique público, canal e tom.","Peça versões diferentes quando houver dúvida sobre o tom."],
    advancedMoves:["Versões contrastivas: formal, concisa, persuasiva.","Diagnóstico no nível da frase.","Transferência de estilo com preservação dos fatos."],
    commonMistakes:["Escrever do zero quando já existem anotações.","Aceitar a primeira opção de tom sem comparar.","Não dizer o que deve ser mantido."],
    promptExamples:[{prompt:"Reescreva para um e-mail a um professor: respeitoso, direto e sem enrolação.",why:"Transformação precisa."},{prompt:"Três versões: formal, concisa e persuasiva.",why:"Seleção por contraste."},{prompt:"Quais frases soam genéricas e por quê?",why:"Diagnóstico linha por linha."},{prompt:"Mantenha os fatos e a estrutura. Mude apenas o tom.",why:"Transformação com escopo definido."}],
    beforeAfter:{before:"Melhore este e-mail.",after:"Reescreva para o diretor do programa. Respeitoso e direto. Tire o jargão. Menos de 150 palavras. Mantenha os itens de ação.",improvement:"Público, tom, padrões a evitar, limite de tamanho e preservação."},
    visual:"writing" },
  { id:"files-data", level:"essencial", number:"06", title:"Arquivos, PDFs, planilhas e dados", ico:"table2", color:"#0891b2",
    summary:"O ChatGPT inspeciona arquivos, resume documentos, executa código em dados e produz gráficos. O ponto-chave é: primeiro descrever, depois analisar, e por fim concluir.",
    whyItMatters:"Inspecionar os dados antes de interpretar evita os erros mais comuns.",
    beginnerMoves:["Pergunte o que o arquivo contém antes de perguntar o que ele significa.","Peça primeiro uma auditoria dos campos.","Para PDFs, separe estrutura, argumento e evidência."],
    advancedMoves:["Exija um registro claro das suposições.","Peça para reescrever tabelas extraídas antes de concluir.","Use execução de código para bases maiores."],
    commonMistakes:["Pedir 'insights principais' logo de cara.","Confiar em rótulos de gráficos sem conferir.","Pressupor que a leitura de PDF é perfeita."],
    promptExamples:[{prompt:"Descreva: campos, intervalo de datas, valores ausentes e opções de análise.",why:"Auditoria antes da análise."},{prompt:"Extraia primeiro o argumento central antes de criticar.",why:"Compreensão antes de julgamento."},{prompt:"Liste todas as suposições usadas para este gráfico.",why:"Trilha de auditoria."},{prompt:"Escreva Python para limpar isso, execute e mostre o resultado.",why:"Análise reproduzível."}],
    beforeAfter:{before:"Quais são os principais insights desta planilha?",after:"Audite: colunas, tipos, intervalo de datas e valores ausentes. Proponha três análises em ordem de utilidade. Não execute nada até eu aprovar.",improvement:"Inspeção, proposta de análises e etapa de aprovação."},
    visual:"data" },
  { id:"search-research", level:"essencial", number:"07", title:"Pesquisa, pesquisa aprofundada e citações", ico:"search", color:"#4f46e5",
    summary:"Use pesquisa para respostas atuais com fontes. Use pesquisa aprofundada para relatórios em várias etapas. Qualquer tema atual, regulado ou que mude rápido não deve depender só da memória estática do modelo.",
    whyItMatters:"Sem pesquisa, o ChatGPT responde com base em um retrato congelado no tempo.",
    beginnerMoves:["Pesquise sempre que algo possa ter mudado.","Confira se as fontes citadas realmente sustentam as afirmações.","Prefira fontes primárias em temas de maior risco."],
    advancedMoves:["Peça: 'Separe fatos confirmados das suas inferências.'","Especifique tipo de fonte, região e horizonte de datas.","Use pesquisa aprofundada com escopo definido."],
    commonMistakes:["Confiar no conhecimento do modelo para fatos atuais.","Aceitar afirmações 'com fonte' sem abrir as fontes.","Usar pesquisa aprofundada para perguntas factuais simples."],
    promptExamples:[{prompt:"Pesquise. Use apenas fontes primárias.",why:"Busca ao vivo com restrição de qualidade."},{prompt:"Separe fatos de inferência. Rotule cada item.",why:"Transparência sobre o status do conhecimento."},{prompt:"O que aqui pode ficar desatualizado em seis meses?",why:"Sinaliza sensibilidade ao tempo."},{prompt:"Pesquisa aprofundada: [tema]. Escopo: [região, datas].",why:"Instrução clara da tarefa."}],
    beforeAfter:{before:"Qual é a última novidade sobre regulação de IA?",after:"Pesquise: regulação de IA, UE e EUA, nos últimos 30 dias. Use fontes primárias. Separe o que já entrou em vigor do que ainda é proposta.",improvement:"Escopo, período, qualidade e categorização."},
    visual:"research" },
  { id:"multimodal", level:"essencial", number:"08", title:"Voz, imagens e fluxos multimodais", ico:"imagePlus", color:"#c026d3",
    summary:"Voz, compreensão de imagem, geração e edição visual já são padrão. O segredo é ser específico: pedidos visuais vagos geram resultados genéricos.",
    whyItMatters:"O multimodal transforma o ChatGPT em ferramenta de análise visual, estúdio de imagem e parceiro de brainstorming sem usar só texto.",
    beginnerMoves:["Diga exatamente o que fazer com a imagem enviada.","Use voz quando a velocidade importa mais do que o acabamento.","Na geração de imagem, especifique assunto, enquadramento, clima e estilo."],
    advancedMoves:["Encadeie modos: analise, explique e depois crie notas.","Use crítica visual para revisão de design.","Faça edições delimitadas: selecione a área e descreva a mudança."],
    commonMistakes:["Enviar imagem sem nenhuma instrução.","Esperar fotorrealismo com descrição vaga.","Esquecer que o modo de voz mantém o mesmo contexto do texto."],
    promptExamples:[{prompt:"Extraia os itens do menu e organize por categoria.",why:"Extração específica."},{prompt:"Explique este gráfico para um executivo não técnico em 120 palavras.",why:"Análise com restrições."},{prompt:"Gere: vertical 9:16, cinematográfico, golden hour.",why:"Especificação no estilo de fotografia."},{prompt:"Troque o fundo por um estúdio branco. Mantenha o assunto.",why:"Edição com escopo definido."}],
    beforeAfter:{before:"Faça uma imagem legal para mim.",after:"16:9: cafeteria moderna em Tóquio ao entardecer. Fotografia de arquitetura, pouca profundidade de campo. Clima acolhedor. Balcão de madeira, máquina de espresso, luzes da cidade. Sem pessoas.",improvement:"Proporção, assunto, estilo, atmosfera, elementos e exclusões."},
    visual:"multimodal" },
  { id:"study-collab", level:"avançado", number:"09", title:"Estudo, gravação, grupos, links e skills", ico:"layoutGrid", color:"#0d9488",
    summary:"Recursos para aprender, registrar conteúdo falado, colaborar, compartilhar e formalizar fluxos de trabalho.",
    whyItMatters:"Aprender é diferente de só receber respostas. Colaborar também é diferente de usar o chat sozinho.",
    beginnerMoves:["Use o Modo de estudo para aprender, não apenas para receber respostas.","Use gravação para reuniões e aulas.","Use links compartilhados e chats em grupo para colaborar com clareza."],
    advancedMoves:["Use resumos de gravações como arquivos-fonte do projeto.","Transforme tarefas repetidas em skills.","Combine chats em grupo com projetos para ter contexto compartilhado."],
    commonMistakes:["Usar chat normal para estudar e atrapalhar o aprendizado.","Esquecer que o recurso de gravação existe.","Mandar print em vez de compartilhar o link."],
    promptExamples:[{prompt:"Em vez de me dar a resposta, faça perguntas para me testar.",why:"Abordagem pedagógica."},{prompt:"Transforme esta gravação em itens de ação e num rascunho de follow-up.",why:"Transformação com várias saídas."},{prompt:"Converta este fluxo de trabalho em uma Skill.",why:"Formaliza um processo."}],
    beforeAfter:{before:"Explique fotossíntese.",after:"Estou estudando para uma prova de biologia. Não explique agora. Faça perguntas para testar meu entendimento, do básico ao avançado. Corrija com explicações curtas.",improvement:"Entrega de resposta vira aprendizagem guiada."},
    visual:"collab" },
  { id:"personalization", level:"avançado", number:"10", title:"Memória, instruções, personalidade e chat temporário", ico:"database", color:"#d97706",
    summary:"Memória guarda contexto. Instruções definem regras. Personalidade ajusta estilo. Chat Temporário é uma sala limpa. Não são a mesma coisa.",
    whyItMatters:"Uma personalização mal configurada piora o resultado mais do que ajuda.",
    beginnerMoves:["Memória: preferências amplas e estáveis.","Instruções: regras globais de escrita e comportamento.","Chat Temporário: zero reaproveitamento de contexto."],
    advancedMoves:["Personalidade serve para textura, não para substituir instruções.","Prefira instruções específicas por projeto às globais quando fizer sentido.","Faça auditorias periódicas da memória."],
    commonMistakes:["Colocar tudo na memória em vez de usar Instruções.","Acúmulo de memória antiga ou irrelevante.","Usar personalidade para tentar mudar capacidade, não estilo."],
    promptExamples:[{prompt:"O que você se lembra sobre mim?",why:"Audita a memória."},{prompt:"Esqueça a preferência por tom formal.",why:"Limpeza pontual."},{prompt:"Quero uma conversa do zero. Sem preferências salvas.",why:"Modo sala limpa."}],
    beforeAfter:{before:"Tenho preferências na memória, mas os resultados continuam inconsistentes.",after:"Regras de comportamento ficam em Instruções. Fatos ficam na Memória. Regras de domínio ficam nas instruções do projeto.",improvement:"Separação correta entre camadas."},
    visual:"memory" },
  { id:"projects", level:"avançado", number:"11", title:"Projetos como seu sistema operacional", ico:"folderOpen", color:"#16a34a",
    summary:"Projetos transformam o ChatGPT em uma bancada de trabalho com contexto. Um projeto bem configurado supera quase qualquer interação isolada em um único chat.",
    whyItMatters:"Em trabalhos que duram várias sessões, projetos são a ferramenta organizacional de maior impacto.",
    beginnerMoves:["Um projeto por fluxo de trabalho. Dê nomes claros.","Envie apenas arquivos relevantes.","Escreva instruções do projeto."],
    advancedMoves:["Adicione resumos de conversas como arquivos-fonte.","Trabalhos semanais devem ficar no mesmo projeto, não em chats novos.","Crie um meta-projeto para produtividade pessoal."],
    commonMistakes:["Projetos demais, cada um muito estreito.","Enviar tudo e inflar o contexto.","Não definir instruções do projeto."],
    promptExamples:[{prompt:"Qual seria a estrutura ideal de projeto para o meu semestre?",why:"Planeja o espaço antes."},{prompt:"Redija um memo consistente com os trabalhos anteriores.",why:"Aproveita o contexto acumulado."},{prompt:"Resuma as decisões principais das últimas cinco conversas.",why:"Resumo vivo do trabalho."}],
    beforeAfter:{before:"Arquivos por toda parte, estou perdendo o controle.",after:"Um projeto por domínio. Referências. Instruções. Retorno contínuo. Resumos periódicos.",improvement:"Conversas espalhadas viram estrutura organizada."},
    visual:"project" },
  { id:"gpts", level:"avançado", number:"12", title:"Quando criar um GPT e quando não criar", ico:"bot", color:"#44403c",
    summary:"Isso faz sentido quando um fluxo se repete, tem instruções estáveis e realmente ganha valor com reutilização. Mas a maioria das pessoas cria cedo demais.",
    whyItMatters:"Criar um GPT cedo demais congela um fluxo ainda imaturo. Criar na hora certa transforma um processo comprovado em uma ferramenta de um clique.",
    beginnerMoves:["Salve prompts antes: o prompt é o protótipo.","Formalize só depois da terceira repetição.","Mantenha o propósito estreito. Um trabalho por GPT."],
    advancedMoves:["Quatro camadas: papel, instruções, conhecimento e ferramentas.","Defina regras explícitas de falha.","Faça testes adversariais."],
    commonMistakes:["Criar GPT para algo feito uma vez só.","Ser amplo demais: 'faz tudo'.","Não incluir arquivos de conhecimento."],
    promptExamples:[{prompt:"Transforme nosso fluxo de trabalho em um blueprint de GPT.",why:"Deriva da experiência real."},{prompt:"Crie instruções, esquema de entrada/saída e regras de falha.",why:"Especificação completa."},{prompt:"Quais casos-limite este GPT deveria lidar?",why:"Teste de robustez."}],
    beforeAfter:{before:"GPT para todos os meus e-mails.",after:"GPT para responder professores. Respeitoso e direto. Menos de 150 palavras. Pede contexto antes. Recusa agir sem confirmação. Arquivo enviado: guia de estilo.",improvement:"Escopo estreito, regras de segurança e referências."},
    visual:"gpt" },
  { id:"canvas", level:"avançado", number:"13", title:"Canvas para revisão de texto e código", ico:"panelsTopLeft", color:"#334155",
    summary:"Uma superfície visível de trabalho ao lado do chat. É melhor do que uma conversa linear quando o trabalho é um documento ou código que precisa de ajustes cirúrgicos.",
    whyItMatters:"Artefatos longos sofrem dentro do chat. No Canvas, o documento vira o centro do trabalho.",
    beginnerMoves:["Use Canvas para artefatos longos.","Um arquivo por finalidade.","Peça edições pontuais, não reescritas vagas."],
    advancedMoves:["Use chat para estratégia e canvas para execução.","Primeiro a arquitetura, depois diffs menores.","Use histórico de versões para comparar."],
    commonMistakes:["Usar chat para documentos longos.","Reescrever tudo quando só um parágrafo precisa ser corrigido.","Não usar canvas de código para depuração."],
    promptExamples:[{prompt:"Abra no canvas de escrita. Reescreva apenas a introdução.",why:"Edição com escopo definido."},{prompt:"Encontre erros lógicos. Corrija só essas linhas.",why:"Correção de código focada."},{prompt:"Mova a seção 3 antes da 2 e una a 4 com a 5.",why:"Reorganização estrutural."}],
    beforeAfter:{before:"Reescreva minha redação. [2000 palavras no chat]",after:"Abra no canvas. Ainda não altere. Marque as partes fortes e fracas. Depois eu digo o que editar.",improvement:"Primeiro inspeção, depois modificação."},
    visual:"canvas" },
  { id:"tasks-apps-agent", level:"especialista", number:"14", title:"Tarefas, apps, pulse e agente", ico:"workflow", color:"#16a34a",
    summary:"É a camada operacional. Tarefas rodam depois. Apps trazem dados. Pulse pesquisa de forma assíncrona. Agente executa trabalhos autônomos em várias etapas.",
    whyItMatters:"A maioria das pessoas usa só perguntas e respostas em tempo real. Esta camada transforma o ChatGPT em um sistema que trabalha por você.",
    beginnerMoves:["Tarefas: lembretes, briefings e resumos recorrentes.","Apps: quando a informação está no Drive, Slack ou e-mail.","Agente: fluxos com várias etapas que levariam 15 minutos ou mais manualmente."],
    advancedMoves:["Escreva prompts de agente como briefs de trabalho com pontos de parada.","Use Pulse para atualizações proativas de temas.","Combine Tarefas e Projetos para resumos automáticos semanais."],
    commonMistakes:["Nem saber que o Agente existe.","Dar instruções vagas ao agente sem regras de parada.","Usar Tarefas apenas para lembretes simples."],
    promptExamples:[{prompt:"Tarefa diária: às 8h, briefing sobre [tema], com os 3 pontos principais.",why:"Briefing proativo."},{prompt:"Faça análise competitiva usando fontes públicas e conectadas.",why:"Dados internos e externos juntos."},{prompt:"Agente: siga estas etapas. Pare antes de enviar qualquer coisa.",why:"Autonomia com checkpoint."}],
    beforeAfter:{before:"Confira cinco sites e compare preços.",after:"Agente: visite cinco concorrentes, extraia os preços e monte uma tabela. Pare se precisar de login. Sinalize preços desatualizados.",improvement:"Delegação com escopo e tratamento de erro."},
    visual:"agent" },
  { id:"model-choice", level:"especialista", number:"15", title:"Escolha de modelo e seleção de modo", ico:"compass", color:"#65a30d",
    summary:"Modos diferentes equilibram velocidade, profundidade de raciocínio e suporte a ferramentas. Combine a potência do modelo com o tipo de tarefa.",
    whyItMatters:"Usar sempre o modo mais forte desperdiça tempo. Nunca escalar de modo faz você perder profundidade quando precisa.",
    beginnerMoves:["Auto para o trabalho do dia a dia.","Escalone para modos mais fortes em lógica complexa ou síntese difícil.","O mais potente nem sempre é o melhor."],
    advancedMoves:["Use rápido para rascunho e profundo para revisão crítica.","Observe limitações de ferramentas em modos de raciocínio.","Comece leve e aumente no meio da conversa se necessário."],
    commonMistakes:["Usar o modo mais poderoso para tudo.","Culpar o modelo quando o problema era o modo.","Não conferir o que está disponível no seu plano."],
    promptExamples:[{prompt:"Quero uma resposta rápida primeiro e uma segunda passada mais profunda depois.",why:"Velocidade antes, profundidade depois."},{prompt:"Lógica complexa. Raciocínio estendido, passo a passo.",why:"Pede raciocínio mais cuidadoso."},{prompt:"Para esta tarefa, faz mais sentido rascunho rápido ou raciocínio cuidadoso?",why:"O modelo ajuda a escolher o modo."}],
    beforeAfter:{before:"Use sempre o modelo mais avançado.",after:"Auto para tarefas rápidas. Modo de raciocínio para lógica. Modo rápido para brainstorming.",improvement:"A potência passa a combinar com o tipo de trabalho."},
    visual:"models" },
  { id:"privacy-risk", level:"especialista", number:"16", title:"Privacidade, controle de dados e risco", ico:"shield", color:"#e11d48",
    summary:"Quanto mais capacidade, mais limites você precisa. Dados sensíveis exigem disciplina ao enviar. Resultados de alto risco exigem revisão humana.",
    whyItMatters:"Capacidade sem limites leva a exposição de dados ou confiança excessiva no sistema.",
    beginnerMoves:["Não envie conteúdo sensível de forma casual.","Remova identificadores antes de enviar arquivos.","Use Chat Temporário quando quiser o cenário mais limpo possível em privacidade."],
    advancedMoves:["Use uma política de envio em semáforo: vermelho, amarelo e verde.","Tenha revisão especializada antes de ações de alto risco.","Faça auditorias periódicas dos dados usados."],
    commonMistakes:["Enviar bases inteiras quando uma amostra bastaria.","Assumir que Chat Temporário significa que nada foi processado.","Tratar saídas de IA como decisão final em áreas reguladas."],
    promptExamples:[{prompt:"Quais partes aqui precisam de verificação por um especialista humano?",why:"Mostra os limites."},{prompt:"Ajude a anonimizar isto antes de eu enviar tudo.",why:"Preparação mais segura."},{prompt:"O que aqui é informação pessoal identificável? Remova isso.",why:"Detecção de PII."}],
    beforeAfter:{before:"Aqui está a lista completa de clientes, analise as tendências.",after:"Remova nomes, e-mails e telefones. Anonimize as empresas. Depois analise a receita por segmento.",improvement:"Remove identificadores e preserva o valor analítico."},
    visual:"privacy" },
];

/* ─────────────────────────────────────────────
   VISUAIS SVG DAS SEÇÕES
   ───────────────────────────────────────────── */
function SectionVisual({ type }) {
  const s = "fill-none stroke-current";
  const cls = "h-36 w-full";
  const col = C.greenDeep;
  const tx = (x, y, label, opts = {}) => <text x={x} y={y} textAnchor="middle" fill={col} style={{ fontSize: opts.size || 10, fontWeight: opts.bold ? 600 : 400, opacity: opts.dim ? 0.4 : 1 }}>{label}</text>;
  const V = {
    mental: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}><rect x="24" y="12" width="120" height="44" rx="12" className={s} strokeWidth="2"/><rect x="216" y="12" width="120" height="44" rx="12" className={s} strokeWidth="2"/><rect x="120" y="110" width="120" height="44" rx="12" className={s} strokeWidth="2"/><path d="M144 34h72" className={s} strokeWidth="1.5"/><path d="M84 56l60 54M276 56l-60 54" className={s} strokeWidth="1.5"/>{tx(84,39,"Seu objetivo",{bold:true})}{tx(276,39,"Rascunho da IA",{bold:true})}{tx(180,137,"Seu julgamento",{bold:true})}{tx(180,84,"analisar, decidir, agir",{dim:true,size:9})}</svg>,
    layers: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}>{[["40","8","280","24","Chat normal"],["54","38","252","24","Projetos + Canvas"],["68","68","224","24","Memória + Instruções"],["82","98","196","24","GPTs + Estudo + Skills"],["96","128","168","24","Tarefas + Apps + Agente"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(180,Number(y)+16,l,{bold:true,size:9})}</g>)}{tx(336,22,"simples",{dim:true,size:8})}{tx(336,146,"mais poderoso",{dim:true,size:8})}</svg>,
    prompt: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}>{[["18","8","Objetivo"],["126","8","Contexto"],["234","8","Regras"],["18","92","Formato"],["126","92","Qualidade"],["234","92","Verificar"]].map(([x,y,l])=><g key={l}><rect x={x} y={y} width="102" height="50" rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+51,Number(y)+30,l,{bold:true,size:11})}</g>)}</svg>,
    workflow: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["30","Plano"],["100","Rasc."],["170","Crítica"],["240","Revisão"],["310","Entrega"]].map(([x,l],i)=><g key={l}><circle cx={x} cy="60" r="22" className={s} strokeWidth="2"/>{tx(Number(x),64,l,{bold:true,size:9})}{i<4&&<path d={`M${Number(x)+22} 60h26`} className={s} strokeWidth="1.5"/>}</g>)}{tx(170,112,"cada etapa acrescenta precisão",{dim:true,size:9})}</svg>,
    writing: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><rect x="134" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><rect x="248" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><path d="M112 59h22M226 59h22" className={s} strokeWidth="1.5"/>{tx(66,38,"Original",{bold:true})}{tx(180,38,"Transformar",{bold:true})}{tx(294,38,"Saída",{bold:true})}</svg>,
    data: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="10" width="116" height="96" rx="10" className={s} strokeWidth="2"/><path d="M20 36h116M48 10v96M76 10v96M104 10v96M20 62h116M20 88h116" className={s} strokeWidth="1"/><rect x="186" y="18" width="24" height="70" rx="6" className={s} strokeWidth="2"/><rect x="220" y="40" width="24" height="48" rx="6" className={s} strokeWidth="2"/><rect x="254" y="28" width="24" height="60" rx="6" className={s} strokeWidth="2"/><rect x="288" y="48" width="24" height="40" rx="6" className={s} strokeWidth="2"/><path d="M182 100h136" className={s} strokeWidth="1.5"/>{tx(78,126,"1. Inspecionar",{dim:true,size:9})}{tx(252,126,"2. Concluir",{dim:true,size:9})}</svg>,
    research: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><circle cx="66" cy="58" r="32" className={s} strokeWidth="2"/><path d="M90 82l22 22" className={s} strokeWidth="2"/><rect x="170" y="10" width="144" height="28" rx="8" className={s} strokeWidth="2"/><rect x="170" y="50" width="144" height="28" rx="8" className={s} strokeWidth="2"/><rect x="170" y="90" width="144" height="28" rx="8" className={s} strokeWidth="2"/>{tx(242,29,"Primária",{bold:true})}{tx(242,69,"Secundária",{bold:true})}{tx(242,109,"Inferência",{bold:true})}<circle cx="326" cy="24" r="4" fill="#10a37f" stroke="none"/><circle cx="326" cy="64" r="4" fill="#F59E0B" stroke="none"/><circle cx="326" cy="104" r="4" fill="#E11D48" stroke="none" opacity="0.5"/></svg>,
    multimodal: <svg viewBox="0 0 360 130" className={cls} style={{ color: col }}>{[["36","Texto"],["120","Imagem"],["204","Voz"],["288","Editar"]].map(([x,l])=><g key={l}><rect x={x} y="20" width="52" height="52" rx="12" className={s} strokeWidth="2"/>{tx(Number(x)+26,50,l,{bold:true,size:9})}</g>)}<path d="M88 46h32M172 46h32M256 46h32" className={s} strokeWidth="1.5"/>{tx(180,102,"combine os modos",{dim:true,size:9})}</svg>,
    collab: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["18","24","64","42","Gravar"],["100","6","120","42","Estudar"],["100","78","120","42","Grupo"],["238","24","80","42","Compart."]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+26,l,{bold:true,size:10})}</g>)}<path d="M82 45h18M220 27h18M220 99h18" className={s} strokeWidth="1.5"/></svg>,
    memory: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["14","10","74","40","Memória"],["100","10","120","40","Instruções"],["232","10","108","40","Personalidade"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+25,l,{bold:true,size:10})}</g>)}<rect x="60" y="88" width="240" height="40" rx="12" className={s} strokeWidth="2"/>{tx(180,113,"Saída consistente",{bold:true})}<path d="M51 50l38 38M160 50v38M286 50l-38 38" className={s} strokeWidth="1.5"/></svg>,
    project: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="28" y="4" width="304" height="132" rx="16" className={s} strokeWidth="2"/><rect x="46" y="28" width="72" height="88" rx="8" className={s} strokeWidth="2"/><rect x="130" y="28" width="72" height="88" rx="8" className={s} strokeWidth="2"/><rect x="214" y="28" width="100" height="40" rx="8" className={s} strokeWidth="2"/><rect x="214" y="76" width="100" height="40" rx="8" className={s} strokeWidth="2"/>{tx(82,76,"Chats",{bold:true})}{tx(166,76,"Arquivos",{bold:true})}{tx(264,52,"Fontes",{bold:true,size:9})}{tx(264,100,"Regras",{bold:true,size:9})}</svg>,
    gpt: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["16","48","78","42","Papel"],["116","4","96","42","Conhecimento"],["116","94","96","42","Ferramentas"],["234","48","110","42","Regras"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+26,l,{bold:true,size:10})}</g>)}<path d="M94 69h22M212 25h22M212 115h22" className={s} strokeWidth="1.5"/><path d="M164 46v48" className={s} strokeWidth="1.5"/></svg>,
    canvas: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="4" width="320" height="132" rx="14" className={s} strokeWidth="2"/><path d="M20 32h320" className={s} strokeWidth="1.5"/><path d="M132 32v104M248 32v104" className={s} strokeWidth="1.2"/>{tx(76,22,"Estrutura",{bold:true,size:10})}{tx(190,22,"Rascunho",{bold:true,size:10})}{tx(290,22,"Edições",{bold:true,size:10})}</svg>,
    agent: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["10","48","60","40","Objetivo"],["90","6","64","40","Navegar"],["90","94","64","40","Arquivos"],["174","6","64","40","Apps"],["174","94","64","40","Código"],["258","48","80","40","Concluído"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="9" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+24,l,{bold:true,size:9})}</g>)}<path d="M70 68h20M122 46v48M154 26h20M154 114h20M238 26l20 40M238 114l20-40" className={s} strokeWidth="1.5"/></svg>,
    models: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["20","48","72","40","Auto"],["116","4","72","40","Rápido"],["116","96","72","40","Profundo"],["268","48","72","40","Pro"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+25,l,{bold:true,size:10})}</g>)}<path d="M92 68h24M188 24h80M188 116h80" className={s} strokeWidth="1.5"/><path d="M152 44v52" className={s} strokeWidth="1.5"/></svg>,
    privacy: <svg viewBox="0 0 360 150" className={cls} style={{ color: col }}><path d="M180 8l88 32v44c0 34-26 62-88 80-62-18-88-46-88-80V40l88-32z" className={s} strokeWidth="2"/><path d="M150 82l18 18 40-42" className={s} strokeWidth="2.2"/>{tx(180,142,"capacidade exige limites",{dim:true,size:9})}</svg>,
  };
  return V[type] || null;
}

/* ─────────────────────────────────────────────
   SUBCOMPONENTES
   ───────────────────────────────────────────── */
function FeatureCard({ title, ico, color, description, when }) {
  return (
    <div className="rounded-2xl border bg-white p-5 transition-shadow duration-200 hover:shadow-md" style={{ borderColor: C.border }}>
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: color + "14" }}><Ico name={ico} className="h-4 w-4" style={{ color }} /></div>
        <span className="ff-display text-[15px] font-semibold" style={{ color: C.ink }}>{title}</span>
      </div>
      <p className="text-[13px] leading-relaxed" style={{ color: C.inkLight }}>{description}</p>
      {when && <div className="mt-3 rounded-xl px-3 py-2 text-[12px] leading-relaxed" style={{ backgroundColor: C.cream, color: C.inkLight }}><span className="font-semibold" style={{ color: C.greenDeep }}>Quando usar: </span>{when}</div>}
    </div>
  );
}

function MiniFeature({ title, ico, color, description }) {
  return (
    <div className="rounded-2xl border bg-white p-4 transition-shadow hover:shadow-sm" style={{ borderColor: C.border }}>
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: color + "14" }}><Ico name={ico} className="h-3.5 w-3.5" style={{ color }} /></div>
        <span className="text-[13px] font-semibold" style={{ color: C.ink }}>{title}</span>
      </div>
      <p className="text-[12px] leading-relaxed" style={{ color: C.inkLight }}>{description}</p>
    </div>
  );
}

function BeforeAfterBlock({ data }) {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: C.border, backgroundColor: C.cream }}>
      <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Antes vs. Depois</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-red-400">Fraco</div>
          <div className="ff-mono break-words text-[12px] leading-relaxed" style={{ color: C.ink }}>{data.before}</div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-600">Forte</div>
          <div className="ff-mono break-words text-[12px] leading-relaxed" style={{ color: C.ink }}>{data.after}</div>
        </div>
      </div>
      <div className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed" style={{ color: C.greenDeep }}>
        <Ico name="lightbulb" className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span className="font-medium">{data.improvement}</span>
      </div>
    </div>
  );
}

function PromptExample({ prompt, why }) {
  return (
    <div className="rounded-xl border bg-white px-4 py-3" style={{ borderColor: C.borderLight }}>
      <div className="ff-mono break-words text-[12px] leading-relaxed" style={{ color: C.ink }}>{prompt}</div>
      <div className="mt-1.5 text-[11px] leading-snug" style={{ color: C.inkMuted }}>{why}</div>
    </div>
  );
}

function GuideSectionCard({ section, isExpanded, onToggle }) {
  return (
    <section id={section.id} className="scroll-mt-28 overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md" style={{ borderColor: C.border }}>
      <button onClick={onToggle} className="flex w-full items-start gap-4 p-5 text-left md:items-center md:p-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: section.color }}><Ico name={section.ico} className="h-5 w-5" /></div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>{section.number} &middot; {section.level.charAt(0).toUpperCase() + section.level.slice(1)}</div>
          <h3 className="ff-display text-[17px] font-semibold leading-snug md:text-[19px]" style={{ color: C.ink }}>{section.title}</h3>
          {!isExpanded && <p className="clamp-2 mt-1 text-[13px] leading-relaxed" style={{ color: C.inkLight }}>{section.summary}</p>}
        </div>
        <Ico name="chevronDown" className={`mt-1 h-5 w-5 shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} style={{ color: C.inkMuted }} />
      </button>
      {isExpanded && (
        <div className="border-t px-5 pb-7 pt-6 md:px-6" style={{ borderColor: C.borderLight }}>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <p className="text-[14px] leading-[1.8]" style={{ color: C.ink }}>{section.summary}</p>
              <div className="rounded-xl border p-4" style={{ borderColor: C.borderLight, backgroundColor: C.cream }}>
                <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Por que isso importa</div>
                <p className="mt-2 text-[13px] leading-[1.75]" style={{ color: C.ink }}>{section.whyItMatters}</p>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.greenDeep }}>Comece por aqui</div>
                <div className="space-y-2.5">{section.beginnerMoves.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="checkCircle" className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.greenMid }} /><span>{m}</span></div>)}</div>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Avançado</div>
                <div className="space-y-2.5">{section.advancedMoves.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="arrowRight" className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.inkMuted }} /><span>{m}</span></div>)}</div>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.roseAccent }}>Erros comuns</div>
                <div className="space-y-2.5">{section.commonMistakes.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="alertTriangle" className="mt-0.5 h-4 w-4 shrink-0 opacity-60" style={{ color: C.roseAccent }} /><span>{m}</span></div>)}</div>
              </div>
              <BeforeAfterBlock data={section.beforeAfter} />
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl border p-4" style={{ borderColor: C.borderLight, backgroundColor: C.cream }}>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Modelo visual</div>
                <SectionVisual type={section.visual} />
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Exemplos de prompt</div>
                <div className="space-y-2.5">{section.promptExamples.map((p, i) => <PromptExample key={i} {...p} />)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────
   PRINCIPAL
   ───────────────────────────────────────────── */
export default function ChatGPTMasterGuide() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [expanded, setExpanded] = useState(new Set(["mental-model"]));
  const toggleSection = useCallback((id) => { setExpanded(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }, []);
  const expandAll = useCallback(() => setExpanded(new Set(GUIDE_SECTIONS.map(s => s.id))), []);
  const collapseAll = useCallback(() => setExpanded(new Set()), []);

  const filteredSections = useMemo(() => GUIDE_SECTIONS.filter(s => {
    if (level !== "all" && s.level !== level) return false;
    if (!query.trim()) return true;
    return [s.title, s.summary, s.whyItMatters, ...s.beginnerMoves, ...s.advancedMoves, ...s.commonMistakes, ...s.promptExamples.map(p => p.prompt), s.beforeAfter.before, s.beforeAfter.after].join(" ").toLowerCase().includes(query.toLowerCase());
  }), [level, query]);

  const sectionsByLevel = useMemo(() => {
    const g = { fundamentos: [], essencial: [], avançado: [], especialista: [] };
    filteredSections.forEach(s => g[s.level]?.push(s));
    return g;
  }, [filteredSections]);
  const levelLabels = { fundamentos: "Fundamentos", essencial: "Habilidades centrais", avançado: "Recursos avançados", especialista: "Especialista" };

  return (
    <div className="ff-body min-h-screen" style={{ backgroundColor: C.cream, color: C.ink }}>
      <GlobalStyles />
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">

        {/* CABEÇALHO */}
        <header className="overflow-hidden rounded-3xl border" style={{ borderColor: C.borderLight, background: `linear-gradient(135deg, ${C.greenLight} 0%, ${C.cream} 40%, ${C.creamDark} 100%)` }}>
          <div className="grid gap-6 p-6 md:p-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-widest" style={{ borderColor: C.borderLight, color: C.greenDeep }}><Ico name="bookOpen" className="h-3.5 w-3.5" /> Referência prática</div>
              <h1 className="ff-display text-3xl font-medium leading-tight tracking-tight md:text-[44px] md:leading-tight" style={{ color: C.ink }}>Um Guia Completo do ChatGPT</h1>
              <p className="mt-4 max-w-lg text-[15px] leading-[1.8]" style={{ color: C.inkLight }}>O que cada ferramenta faz, quando usar e como obter resultados claramente melhores. Feito primeiro para usuários do dia a dia, com seções mais profundas para quem quiser avançar.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium shadow-sm" style={{ color: C.inkLight }}><Ico name="lightbulb" className="h-3 w-3" style={{ color: C.greenMid }} /> Verificado em {VERIFIED_DATE}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium shadow-sm" style={{ color: C.inkLight }}><Ico name="layers" className="h-3 w-3" style={{ color: C.greenMid }} /> 16 seções &middot; mais de 60 prompts</span>
              </div>
            </div>
            <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: C.borderLight }}>
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>O que o ChatGPT faz hoje</div>
              <svg viewBox="0 0 420 190" className="w-full" style={{ color: C.greenDeep }}>
                {[["16","4","120","38","Responde","chat, pesquisa"],["150","4","120","38","Organiza","projetos, memória"],["284","4","120","38","Cria","canvas, imagens"],["16","120","120","38","Ensina","estudo, gravação"],["150","120","120","38","Compartilha","grupos, links"],["284","120","120","38","Executa","tarefas, agente"]].map(([x,y,w,h,l,sub])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="9" className="fill-none stroke-current" strokeWidth="1.6"/><text x={Number(x)+Number(w)/2} y={Number(y)+18} textAnchor="middle" fill={C.greenDeep} style={{fontSize:10,fontWeight:600}}>{l}</text><text x={Number(x)+Number(w)/2} y={Number(y)+30} textAnchor="middle" fill={C.greenDeep} style={{fontSize:7,opacity:0.4}}>{sub}</text></g>)}
                <text x="210" y="84" textAnchor="middle" fill={C.greenDeep} style={{fontSize:9,fontWeight:600,opacity:0.25}}>a pilha completa</text>
                {[[136,23,150,23],[270,23,284,23],[76,42,76,120],[210,42,210,120],[344,42,344,120]].map(([x1,y1,x2,y2],i)=><line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.greenDeep} strokeWidth="1" opacity="0.15"/>)}
              </svg>
            </div>
          </div>
        </header>

        {/* SEIS PRINCÍPIOS */}
        <section className="mt-8">
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Seis princípios</div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[{ico:"penTool",t:"Peça com clareza",d:"Objetivo, contexto, restrições e formato."},{ico:"layoutGrid",t:"Escolha a camada certa",d:"Chat, projeto, canvas, pesquisa, agente."},{ico:"shield",t:"Verifique quando importar",d:"Pesquise em temas atuais ou de alto risco."},{ico:"refreshCcw",t:"Revise, não recomece",d:"Bons resultados vêm da segunda passada."},{ico:"bot",t:"Transforme o que funciona em sistema",d:"Projeto, GPT, tarefa ou skill."},{ico:"eye",t:"Use visuais para pensar mais rápido",d:"Tabelas, diagramas, capturas de tela."}].map(({ico,t,d})=>(
              <div key={t} className="flex gap-3 rounded-2xl border bg-white p-4" style={{borderColor:C.border}}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white" style={{backgroundColor:C.greenDeep}}><Ico name={ico} className="h-4 w-4"/></div>
                <div><div className="text-[13px] font-semibold" style={{color:C.ink}}>{t}</div><div className="mt-0.5 text-[12px] leading-relaxed" style={{color:C.inkLight}}>{d}</div></div>
              </div>
            ))}
          </div>
        </section>

        {/* ESCOLHA DA FERRAMENTA */}
        <section className="mt-8 overflow-hidden rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>Tabela de decisão</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>Que ferramenta você deve usar?</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border" style={{borderColor:C.borderLight}}>
            <table className="min-w-full text-left text-[13px]">
              <thead><tr style={{backgroundColor:C.cream}}><th className="whitespace-nowrap px-4 py-3 font-semibold" style={{color:C.ink}}>Seu objetivo</th><th className="whitespace-nowrap px-4 py-3 font-semibold" style={{color:C.ink}}>Melhor ferramenta</th><th className="hidden whitespace-nowrap px-4 py-3 font-semibold sm:table-cell" style={{color:C.ink}}>Por quê</th></tr></thead>
              <tbody>{TOOL_CHOOSER.map((r,i)=><tr key={r.goal} style={{backgroundColor:i%2===0?"#fff":C.cream}}><td className="px-4 py-3 font-medium" style={{color:C.ink}}>{r.goal}</td><td className="whitespace-nowrap px-4 py-3"><span className="inline-flex items-center gap-1.5 font-semibold" style={{color:C.greenDeep}}><Ico name={r.ico} className="h-3.5 w-3.5"/>{r.tool}</span></td><td className="hidden px-4 py-3 sm:table-cell" style={{color:C.inkLight}}>{r.reason}</td></tr>)}</tbody>
            </table>
          </div>
        </section>

        {/* FÓRMULA DE PROMPT */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>Padrão de prompt</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>Seis blocos que melhoram qualquer prompt</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROMPT_BLOCKS.map((b,i)=><div key={b.label} className="rounded-xl border p-4" style={{borderColor:C.borderLight,backgroundColor:C.cream}}>
              <div className="mb-1.5 flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold text-white" style={{backgroundColor:b.color}}>{i+1}</span><span className="text-[13px] font-semibold" style={{color:C.ink}}>{b.label}</span></div>
              <p className="ff-mono text-[11px] leading-relaxed" style={{color:C.inkLight}}>{b.example}</p>
            </div>)}
          </div>
        </section>

        {/* FERRAMENTAS PRINCIPAIS */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>Pilha de recursos</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>As ferramentas centrais do ChatGPT</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{CORE_FEATURES.map(f=><FeatureCard key={f.title} {...f}/>)}</div>
        </section>

        {/* ADICIONAIS */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>Muito ignorados</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>Recursos que a maioria dos usuários deixa passar</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{ADDITIONAL_FEATURES.map(f=><MiniFeature key={f.title} {...f}/>)}</div>
        </section>

        {/* NAVEGAÇÃO */}
        <section className="sticky top-0 z-20 mt-8 rounded-2xl border bg-white p-4 shadow-lg md:p-5" style={{borderColor:C.border}}>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative mr-auto">
              <Ico name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{color:C.inkMuted}}/>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Pesquisar..." className="w-full rounded-xl border py-2 pl-10 pr-3 text-[13px] outline-none sm:w-48" style={{borderColor:C.border,backgroundColor:C.cream}}/>
            </div>
            {LEVELS.map(l=><button key={l.key} onClick={()=>setLevel(l.key)} className="rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all" style={level===l.key?{backgroundColor:C.greenDeep,color:"#fff"}:{border:`1px solid ${C.border}`,color:C.inkLight}}>{l.label}</button>)}
            <button onClick={expandAll} className="rounded-lg border px-2.5 py-2 text-[11px] font-medium" style={{borderColor:C.border,color:C.inkLight}}>Expandir</button>
            <button onClick={collapseAll} className="rounded-lg border px-2.5 py-2 text-[11px] font-medium" style={{borderColor:C.border,color:C.inkLight}}>Recolher</button>
          </div>
        </section>

        {/* SEÇÕES DO GUIA */}
        <main className="mt-8 space-y-10">
          {Object.entries(sectionsByLevel).map(([lev, sections]) => {
            if (!sections.length) return null;
            return (<div key={lev}>
              <div className="mb-4 flex items-center gap-3"><div className="h-px flex-1" style={{backgroundColor:C.border}}/><span className="whitespace-nowrap text-[12px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>{levelLabels[lev]}</span><div className="h-px flex-1" style={{backgroundColor:C.border}}/></div>
              <div className="space-y-4">{sections.map(s=><GuideSectionCard key={s.id} section={s} isExpanded={expanded.has(s.id)} onToggle={()=>toggleSection(s.id)}/>)}</div>
            </div>);
          })}
        </main>

        {/* ESCOPO + MENSAGEM FINAL */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{borderColor:C.border}}>
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>Escopo</div>
            <h3 className="ff-display mt-2 text-[18px] font-medium" style={{color:C.ink}}>O que este guia cobre</h3>
            <div className="mt-4 space-y-2 text-[13px] leading-relaxed" style={{color:C.inkLight}}>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>Recursos voltados ao usuário, não administração enterprise.</div>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>Uso prático acima de curiosidades de produto.</div>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>A disponibilidade varia conforme o plano e a plataforma.</div>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-200 p-5 shadow-sm" style={{background:`linear-gradient(135deg, ${C.greenLight}, #F0FAF5)`}}>
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.greenDeep}}>Maior mudança de nível</div>
            <div className="mt-3 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{backgroundColor:C.greenDeep}}><Ico name="sparkles" className="h-5 w-5"/></div>
              <div>
                <div className="ff-display text-[16px] font-semibold" style={{color:C.greenDeep}}>Pare de perguntar "Como eu escrevo prompts melhores?"</div>
                <p className="mt-2 text-[13px] leading-[1.75] opacity-80" style={{color:C.greenDeep}}>Comece a perguntar "Qual camada do ChatGPT combina com este trabalho?" Essa mudança melhora o resultado mais do que truques de prompt.</p>
              </div>
            </div>
          </div>
        </section>

        {/* RODAPÉ */}
        <footer className="mt-8 overflow-hidden rounded-3xl p-6 text-white shadow-lg md:p-10" style={{background:"linear-gradient(135deg, #0A2A1F, #0D3B2E 40%, #143D30)"}}>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-emerald-300">Mensagem final</div>
              <h2 className="ff-display mt-2 text-2xl font-medium tracking-tight md:text-[28px]">Como é o verdadeiro domínio</h2>
              <p className="mt-4 max-w-xl text-[14px] leading-[1.85] text-emerald-100" style={{opacity:0.8}}>Escolha o modo certo. Defina a tarefa com clareza. Verifique o que importa. Revise com inteligência. Transforme acertos em sistemas reutilizáveis. Os melhores usuários são pensadores claros que, por acaso, também usam IA.</p>
              <p style={{ fontSize: 13, lineHeight: 1.7 }}>
              <br />
              Guia do Usuário do ChatGPT
              <br />
              © 2026 EugeneYip.com Todos os direitos reservados. 
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-[13px] font-semibold">Continue conferindo</div>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px] leading-relaxed text-emerald-200" style={{opacity:0.7}}>
                {["Capacidades","Preços","Notas de versão","Projetos","FAQ de memória","Canvas","Tarefas","Apps","Pesquisa","Pesquisa aprofundada","Modo de estudo","Gravação","Links compartilhados","Grupos","Skills","Agente","Voz","FAQ de imagens"].map(i=><div key={i} className="flex items-center gap-1.5"><div className="h-1 w-1 shrink-0 rounded-full bg-emerald-400" style={{opacity:0.5}}/>{i}</div>)}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
