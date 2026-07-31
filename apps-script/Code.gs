/**
 * ---------------------------------------------------------------------------
 * Maison Nunu — lead logger
 * ---------------------------------------------------------------------------
 * This file is NOT part of the Astro build. It is kept in the repo so the
 * Apps Script source is version controlled; it must be pasted into the Apps
 * Script editor attached to the client's Google Sheet.
 *
 * SETUP
 *  1. Create a Google Sheet. Add a tab named exactly "Leads".
 *  2. Extensions -> Apps Script. Paste this file in.
 *  3. Project Settings -> Script Properties, add:
 *       SECRET        a long random string (openssl rand -hex 24)
 *       NOTIFY_EMAIL  where lead alerts should go
 *  4. Run setupSheet() once to write the header row.
 *  5. Deploy -> New deployment -> Web app
 *       Execute as:     Me
 *       Who has access: Anyone
 *     "Anyone" is what makes it reachable from the Pages Function. The shared
 *     secret is what makes that safe.
 *  6. Copy the /exec URL into Cloudflare Pages as SHEET_WEBHOOK_URL, and the
 *     same SECRET as SHEET_SECRET.
 *
 * REMEMBER: editing this script does not update the live URL. Every change
 * needs Deploy -> Manage deployments -> Edit -> New version.
 */

var SHEET_NAME = 'Leads';

var HEADERS = [
  'Timestamp',
  'SKU',
  'Piece',
  'Page',
  'Referrer',
  'Country',
  'Device',
  'Name',
  'Note',
  'Status',
];

/** Run once from the editor to create the header row. */
function setupSheet() {
  var sheet = getSheet_();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  // Give the client one dropdown to maintain. Anything more elaborate than
  // this does not get used in practice.
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['New', 'Replied', 'Quoted', 'Won', 'Lost'], true)
    .setAllowInvalid(true)
    .build();
  sheet.getRange(2, HEADERS.length, sheet.getMaxRows() - 1, 1).setDataValidation(rule);
}

function doPost(e) {
  try {
    var props = PropertiesService.getScriptProperties();
    var expected = props.getProperty('SECRET');

    if (!e || !e.postData || !e.postData.contents) {
      return reply_('bad request');
    }

    var data = JSON.parse(e.postData.contents);

    // Reject anything not carrying the shared secret. The web app URL is
    // public by necessity, so this is the only thing standing between the
    // sheet and the open internet.
    if (!expected || data.secret !== expected) {
      return reply_('denied');
    }

    getSheet_().appendRow([
      new Date(),
      data.sku || '',
      data.label || '',
      data.page || '',
      data.referrer || '',
      data.country || '',
      deviceFrom_(data.userAgent),
      data.name || '',
      data.note || '',
      'New',
    ]);

    notify_(data);
    return reply_('ok');
  } catch (err) {
    // Never throw: a 500 here would show up as noise in Cloudflare's logs
    // without telling us anything useful.
    console.error('doPost failed: ' + err);
    return reply_('error');
  }
}

/**
 * Email alert.
 *
 * QUOTA: consumer gmail.com accounts allow 100 email RECIPIENTS per day;
 * Google Workspace allows 1,500. If the client ever approaches that, switch
 * this to a once-daily digest on a time-driven trigger rather than paying
 * for anything.
 */
function notify_(data) {
  var to = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL');
  if (!to) return;

  if (MailApp.getRemainingDailyQuota() < 5) {
    console.warn('email quota nearly exhausted; skipping alert');
    return;
  }

  var piece = data.label || 'General enquiry';
  var who = data.name ? data.name + ' — ' : '';

  var lines = [
    who + piece,
    'Reference: ' + (data.sku || '—'),
    'Page: ' + (data.page || '—'),
    'Country: ' + (data.country || '—'),
  ];

  if (data.note) {
    lines.push('', 'They said:', data.note);
  }

  if (!data.name) {
    lines.push(
      '',
      'This was a tap on an enquiry button, so we have no contact details —',
      'watch WhatsApp for the message.'
    );
  }

  MailApp.sendEmail({
    to: to,
    subject: 'New lead: ' + piece + ' (' + (data.sku || '—') + ')',
    body: lines.join('\n'),
  });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

function deviceFrom_(userAgent) {
  if (!userAgent) return '';
  if (/iPad|Tablet/i.test(userAgent)) return 'tablet';
  if (/Mobile|Android|iPhone/i.test(userAgent)) return 'mobile';
  return 'desktop';
}

function reply_(message) {
  return ContentService.createTextOutput(message).setMimeType(ContentService.MimeType.TEXT);
}
