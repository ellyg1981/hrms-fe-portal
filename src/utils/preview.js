const logoUrl = `${window.location.origin}/uhamiaji_logo.png`;

const brandedTitle = (title) => (title ? `${title} | HRMS Portal` : 'HRMS Portal');

export function openDocument(url, title = 'Document') {
  const win = window.open('', '_blank');
  if (!win) return null;
  win.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${brandedTitle(title)}</title>
        <link rel="icon" type="image/png" href="${logoUrl}" />
        <style>
          html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; background: #f5f7fa; }
          embed { width: 100%; height: 100%; border: none; }
        </style>
      </head>
      <body>
        <iframe src="${url}" title="${title || 'Document'}" style="width: 100%; height: 100%; border: none;"></iframe>
      </body>
    </html>
  `);
  win.document.close();
  return win;
}

export function openBrandedHtml(html, title = 'HRMS Portal') {
  const win = window.open('', '_blank');
  if (!win) return null;
  let branded = html;
  if (!/<head>/i.test(branded)) {
    branded = `<!DOCTYPE html><html><head></head><body>${branded}</body></html>`;
  }
  branded = branded.replace(/<head>/i, `<head><meta charset="utf-8" /><title>${brandedTitle(title)}</title><link rel="icon" type="image/png" href="${logoUrl}" />`);
  // If a title already exists, replace it to keep the new one.
  branded = branded.replace(/<title>.*?<\/title>/i, `<title>${brandedTitle(title)}</title>`);
  win.document.open();
  win.document.write(branded);
  win.document.close();
  return win;
}
