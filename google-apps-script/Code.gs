// ─────────────────────────────────────────────────────────────────────────────
// Orflie Onboarding — Google Apps Script
// Grava cada resposta em colunas individuais na planilha "Respostas"
// ─────────────────────────────────────────────────────────────────────────────

const SHEET_NAME = 'Respostas';

// Mapeamento fixo de colunas — adicione ou remova conforme o formulário
const COLUMNS = [
  // ── Metadados ─────────────────────────────────────────────────────────────
  { header: 'Recebido em',              path: '__meta.submittedAt' },

  // ── Seção 01 — Informações Gerais ─────────────────────────────────────────
  { header: 'Empresa',                  path: 'summary.companyName' },
  { header: 'CNPJ',                     path: 's01.CNPJ' },
  { header: 'Site',                     path: 's01.Site' },
  { header: 'Segmento',                 path: 'summary.companySegment' },
  { header: 'Tempo de Mercado',         path: 's01.Tempo de Mercado' },
  { header: 'Nº Colaboradores',         path: 's01.Nº de Colaboradores' },
  { header: 'Cidade / Estado',          path: 's01.Cidade / Estado' },
  { header: 'Faturamento Médio Anual',  path: 's01.Faturamento Médio Anual' },
  { header: 'Responsável',              path: 'summary.contactName' },
  { header: 'Cargo Responsável',        path: 's01.Cargo' },
  { header: 'Telefone',                 path: 'summary.contactPhone' },
  { header: 'E-mail',                   path: 'summary.contactEmail' },

  // ── Seção 02 — Posicionamento ─────────────────────────────────────────────
  { header: 'Posicionamento',           path: 's02.Como a empresa se posiciona no mercado' },
  { header: 'Diferencial Competitivo',  path: 's02.Principal diferencial competitivo' },
  { header: 'Percepção desejada',       path: 's02.Como a empresa quer ser percebida pelos clientes' },
  { header: 'Missão / Propósito',       path: 's02.Missão ou propósito declarado' },
  { header: 'Palavras que NÃO representam', path: 's02.Quais palavras NÃO representam a empresa' },

  // ── Seção 03 — Produtos ───────────────────────────────────────────────────
  { header: 'Produtos/Serviços',        path: 's03.products' },
  { header: 'Produto prioritário',      path: 's03.Produto/serviço prioritário neste projeto' },

  // ── Seção 04 — ICP ────────────────────────────────────────────────────────
  { header: 'Segmento-alvo',            path: 's04.Segmento-alvo' },
  { header: 'Porte do cliente',         path: 's04.Porte da empresa cliente' },
  { header: 'Faturamento do cliente',   path: 's04.Faixa de faturamento do cliente ideal' },
  { header: 'Região de atuação',        path: 's04.Região de atuação' },
  { header: 'Decisores',                path: 's04.Quem toma a decisão de compra' },
  { header: 'Cargo do decisor',         path: 's04.Cargo exato do decisor mais comum' },
  { header: 'Influenciador',            path: 's04.Existe um influenciador na jornada' },
  { header: 'Gatilho de compra',        path: 's04.Principal gatilho que leva o cliente a buscar a solução' },

  // ── Seção 05 — Dores ─────────────────────────────────────────────────────
  { header: 'Dores do cliente',         path: 's05.Principais dores do cliente que a empresa resolve' },
  { header: 'Impacto das dores',        path: 's05.Impacto financeiro/operacional dessas dores' },
  { header: 'Solução atual do cliente', path: 's05.Como o cliente resolve esse problema hoje' },

  // ── Seção 06 — Processo de Vendas ────────────────────────────────────────
  { header: 'Usa CRM?',                 path: 's06.A empresa utiliza CRM' },
  { header: 'Qual CRM',                 path: 's06.Qual CRM utiliza' },
  { header: 'Canais com leads',         path: 's06.Canais de comunicação com leads' },
  { header: 'Origem dos leads',         path: 's06.Como os leads chegam hoje' },
  { header: 'Funil de vendas',          path: 's06.Descreva as etapas do funil de vendas atual' },

  // ── Seção 07 — Equipe ────────────────────────────────────────────────────
  { header: 'Nº Vendedores',            path: 's07.Total de vendedores ativos' },
  { header: 'Estrutura da equipe',      path: 's07.Estrutura da equipe' },
  { header: 'Metas comerciais',         path: 's07.Metas comerciais atuais' },
  { header: 'Treinamento de vendas?',   path: 's07.O time tem treinamento de vendas regular' },

  // ── Seção 08 — Métricas ───────────────────────────────────────────────────
  { header: 'Ticket Médio',             path: 's08.Ticket Médio' },
  { header: 'Ciclo Médio de Vendas',    path: 's08.Ciclo Médio de Vendas' },
  { header: 'Taxa de Conversão',        path: 's08.Taxa de Conversão Média' },
  { header: 'Reuniões / mês',           path: 's08.Reuniões / mês' },
  { header: 'Novos clientes / mês',     path: 's08.Novos clientes / mês' },
  { header: 'Churn mensal',             path: 's08.Churn mensal' },
  { header: 'Métrica crítica',          path: 's08.Métrica mais crítica para melhorar' },

  // ── Seção 09 — Objeções ──────────────────────────────────────────────────
  { header: 'Objeções comuns',          path: 's09.As 5 objeções mais comuns na hora da venda' },
  { header: 'Objeção mais difícil',     path: 's09.Qual objeção é mais difícil de superar e por quê' },
  { header: 'Argumento que funciona',   path: 's09.Algum argumento que já funcionou bem para contornar objeções' },

  // ── Seção 10 — Concorrentes ───────────────────────────────────────────────
  { header: 'Concorrentes diretos',     path: 's10.Principais concorrentes diretos' },
  { header: 'O que concorrente faz melhor', path: 's10.O que os concorrentes fazem melhor' },
  { header: 'O que empresa faz melhor', path: 's10.O que a empresa faz melhor que os concorrentes' },
  { header: 'Por que perde para concorrente', path: 's10.Quando o cliente vai para o concorrente, qual o principal motivo' },

  // ── Seção 11 — Objetivos ─────────────────────────────────────────────────
  { header: 'Objetivos com Orflie',     path: 's11.O que a empresa espera alcançar' },
  { header: 'Meta de faturamento',      path: 's11.Meta de faturamento desejada' },
  { header: 'Prazo para resultados',    path: 's11.Prazo esperado para ver resultados' },
  { header: 'Como medirá sucesso',      path: 's11.Como o sucesso deste projeto será medido internamente' },

  // ── Seção 12 — Marketing ─────────────────────────────────────────────────
  { header: 'Investe em marketing?',    path: 's12.A empresa já investe em marketing' },
  { header: 'Canais de marketing',      path: 's12.Canais ativos' },
  { header: 'Investimento mídia paga',  path: 's12.Investimento mensal em mídia paga' },
  { header: 'Agência de marketing',     path: 's12.Agência de marketing ativa' },

  // ── Seção 13 — Materiais ─────────────────────────────────────────────────
  { header: 'Materiais que possui',     path: 's13.A empresa já possui' },
  { header: 'Material urgente',         path: 's13.Qual material precisa ser criado ou melhorado com urgência' },

  // ── Seção 14 — Aprovações ────────────────────────────────────────────────
  { header: 'Responsável interno',      path: 's14.Responsável interno pelo projeto' },
  { header: 'Cargo responsável interno',path: 's14.Cargo' },
  { header: 'Aprovador estratégico',    path: 's14.Responsável por aprovar decisões estratégicas' },
  { header: 'Outras partes consultadas',path: 's14.Outras partes que precisam ser consultadas' },

  // ── Seção 15 — Acessos ───────────────────────────────────────────────────
  { header: 'Acessos necessários',      path: 's15.Quais acessos a Orflie precisará' },
  { header: 'Restrições de acesso',     path: 's15.Restrições de acesso ou política de segurança' },

  // ── Seção 16 — Observações ───────────────────────────────────────────────
  { header: 'O que Orflie precisa saber', path: 's16.O que o time da Orflie precisa saber antes de começar' },
  { header: 'Maior frustração anterior', path: 's16.Qual foi a maior frustração com projetos comerciais anteriores' },
  { header: 'O que seria sucesso absoluto', path: 's16.O que tornaria este projeto um sucesso absoluto para você' },

  // ── Raw (backup) ──────────────────────────────────────────────────────────
  { header: 'Payload JSON Completo',    path: '__meta.rawPayload' },
];

// ─────────────────────────────────────────────────────────────────────────────

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

    const payload = parsePayload_(e.parameter.payload);

    // Monta um objeto "flat" para lookup rápido por path
    const flat = buildFlatLookup_(payload, e);

    ensureHeaders_(sheet);

    const row = COLUMNS.map(col => flat[col.path] || '');
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

// ─────────────────────────────────────────────────────────────────────────────

function buildFlatLookup_(payload, e) {
  const flat = {};

  // Metadados
  flat['__meta.submittedAt'] = payload.submittedAt || new Date().toISOString();
  flat['__meta.rawPayload']  = e.parameter.payload || '';

  // Summary
  const s = payload.summary || {};
  flat['summary.companyName']    = s.companyName    || e.parameter.company_name    || '';
  flat['summary.companySegment'] = s.companySegment || e.parameter.company_segment || '';
  flat['summary.contactName']    = s.contactName    || e.parameter.contact_name    || '';
  flat['summary.contactPhone']   = s.contactPhone   || e.parameter.contact_phone   || '';
  flat['summary.contactEmail']   = s.contactEmail   || e.parameter.contact_email   || '';

  // Sections
  const sections = payload.sections || {};
  const sectionKeys = Object.keys(sections);

  sectionKeys.forEach((sectionTitle, idx) => {
    const prefix = 's' + String(idx + 1).padStart(2, '0');
    const sectionData = sections[sectionTitle] || {};

    Object.keys(sectionData).forEach(questionKey => {
      const value = sectionData[questionKey];
      const flatKey = prefix + '.' + questionKey;

      if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object') {
          // Tabela de produtos
          flat[prefix + '.products'] = value
            .map(p => [p.produto, p.ticketMedio ? 'Ticket: ' + p.ticketMedio : '', p.margem ? 'Margem: ' + p.margem : '', p.publicoPrincipal].filter(Boolean).join(' | '))
            .join('\n');
        } else {
          flat[flatKey] = value.join(', ');
        }
      } else {
        flat[flatKey] = String(value || '');
      }
    });
  });

  return flat;
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() > 0) return;
  sheet.appendRow(COLUMNS.map(col => col.header));

  // Formata o cabeçalho
  const headerRange = sheet.getRange(1, 1, 1, COLUMNS.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#1a1a2e');
  headerRange.setFontColor('#ff7a2f');
  sheet.setFrozenRows(1);
}

function parsePayload_(rawPayload) {
  if (!rawPayload) return {};
  try {
    return JSON.parse(rawPayload);
  } catch (err) {
    return { rawPayload: rawPayload, parseError: err.message };
  }
}