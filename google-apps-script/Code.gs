const SHEET_NAME = 'Respostas';
const SPREADSHEET_ID = '1KTSV9Bd2a13RBugGUaVjcl8QlGWtYIJ4bpOjmGZMb5Y';
const BASE_HEADERS = [
  'Recebido em',
  'Empresa',
  'Contato',
  'E-mail',
  'Telefone',
  'Segmento',
  'Payload JSON'
];

function doGet() {
  return ContentService
    .createTextOutput('Apps Script online')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
    const payload = parsePayload_(e && e.parameter ? e.parameter.payload : '');
    const flattenedAnswers = flattenPayload_(payload);

    ensureHeaders_(sheet, flattenedAnswers);

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const rowMap = buildRowMap_(e && e.parameter ? e.parameter : {}, payload, flattenedAnswers);
    const row = headers.map(header => rowMap[header] || '');

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function ensureHeaders_(sheet, flattenedAnswers) {
  const extraHeaders = Object.keys(flattenedAnswers);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(BASE_HEADERS.concat(extraHeaders));
    formatHeader_(sheet);
    return;
  }

  const currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const missingHeaders = extraHeaders.filter(header => currentHeaders.indexOf(header) === -1);

  if (missingHeaders.length === 0) {
    return;
  }

  const startColumn = currentHeaders.length + 1;
  sheet.getRange(1, startColumn, 1, missingHeaders.length).setValues([missingHeaders]);
  formatHeader_(sheet);
}

function buildRowMap_(params, payload, flattenedAnswers) {
  const summary = payload.summary || {};
  const rowMap = {
    'Recebido em': payload.submittedAt || new Date().toISOString(),
    'Empresa': summary.companyName || params.company_name || '',
    'Contato': summary.contactName || params.contact_name || '',
    'E-mail': summary.contactEmail || params.contact_email || '',
    'Telefone': summary.contactPhone || params.contact_phone || '',
    'Segmento': summary.companySegment || params.company_segment || '',
    'Payload JSON': params.payload || JSON.stringify(payload)
  };

  Object.keys(flattenedAnswers).forEach(header => {
    rowMap[header] = flattenedAnswers[header];
  });

  return rowMap;
}

function flattenPayload_(payload) {
  const result = {};
  const sections = payload.sections || {};

  Object.keys(sections).forEach(sectionTitle => {
    const sectionData = sections[sectionTitle] || {};

    Object.keys(sectionData).forEach(question => {
      const header = sectionTitle + ' - ' + question;
      result[header] = normalizeValue_(sectionData[question]);
    });
  });

  return result;
}

function normalizeValue_(value) {
  if (Array.isArray(value)) {
    if (value.length > 0 && typeof value[0] === 'object') {
      return value
        .map(item => {
          return Object.keys(item)
            .map(key => item[key])
            .filter(Boolean)
            .join(' | ');
        })
        .filter(Boolean)
        .join('\n');
    }

    return value.join(', ');
  }

  if (value && typeof value === 'object') {
    return JSON.stringify(value);
  }

  return value == null ? '' : String(value);
}

function formatHeader_(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#1a1a2e');
  headerRange.setFontColor('#ff7a2f');
  sheet.setFrozenRows(1);
}

function parsePayload_(rawPayload) {
  if (!rawPayload) {
    return {};
  }

  try {
    return JSON.parse(rawPayload);
  } catch (error) {
    return { rawPayload: rawPayload, parseError: error.message };
  }
}
