const SHEET_NAME = 'Respostas';
const SPREADSHEET_ID = '1KTSV9Bd2a13RBugGUaVjcl8QlGWtYIJ4bpOjmGZMb5Y';

function doGet() {
  return ContentService
    .createTextOutput('Apps Script online')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    // Usa openById para funcionar como script standalone (não precisa ser container-bound)
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

    ensureHeaders_(sheet);

    const payload = parsePayload_(e.parameter.payload);
    const row = [
      new Date(),
      e.parameter.company_name || '',
      e.parameter.contact_name || '',
      e.parameter.contact_email || '',
      e.parameter.contact_phone || '',
      e.parameter.company_segment || '',
      JSON.stringify(payload)
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() > 0) {
    return;
  }

  sheet.appendRow([
    'Recebido em',
    'Empresa',
    'Contato',
    'E-mail',
    'Telefone',
    'Segmento',
    'Payload JSON'
  ]);
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
