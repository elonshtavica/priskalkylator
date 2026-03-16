import { BeraknadRad, PriceList } from '../types';

export function exportCSV(lista: PriceList, rader: BeraknadRad[]): void {
  const rubrik = [
    'FLM',
    'Inköpspris (SEK)',
    'Pris till kund (SEK)',
    'Marginal (SEK)',
    'Marginal (%)',
    'Pris exkl. bränsletillägg (SEK)',
    'Pris inkl. bränsletillägg (SEK)',
    'Bränsletillägg (SEK)',
  ];

  const formatNum = (n: number) => n.toFixed(2).replace('.', ',');

  const rows = rader.map(r => [
    r.flm,
    formatNum(r.inkopspris),
    formatNum(r.prisTillKund),
    formatNum(r.marginalSEK),
    formatNum(r.marginalProcent),
    formatNum(r.prisExklBransle),
    formatNum(r.prisInklBransle),
    formatNum(r.bransletillaggSEK),
  ]);

  const csvContent = [rubrik, ...rows]
    .map(r => r.map(c => `"${c}"`).join(';'))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${lista.namn}_${lista.manad || 'prislista'}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function skrivUt(lista: PriceList, rader: BeraknadRad[]): void {
  const formatNum = (n: number) =>
    new Intl.NumberFormat('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  const rader_html = rader
    .map(
      r => `
      <tr>
        <td>${r.flm}</td>
        <td>${formatNum(r.inkopspris)} kr</td>
        <td>${formatNum(r.prisTillKund)} kr</td>
        <td>${formatNum(r.marginalSEK)} kr</td>
        <td>${formatNum(r.marginalProcent)} %</td>
        <td>${formatNum(r.prisExklBransle)} kr</td>
        <td>${formatNum(r.prisInklBransle)} kr</td>
        <td>${formatNum(r.bransletillaggSEK)} kr</td>
      </tr>`
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html lang="sv">
    <head>
      <meta charset="UTF-8">
      <title>${lista.namn}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 11px; margin: 20px; }
        h1 { font-size: 16px; margin-bottom: 4px; }
        p { margin: 2px 0; color: #555; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th { background: #1e40af; color: white; padding: 6px 8px; text-align: left; font-size: 10px; }
        td { padding: 5px 8px; border-bottom: 1px solid #e5e7eb; }
        tr:nth-child(even) td { background: #f9fafb; }
      </style>
    </head>
    <body>
      <h1>${lista.namn}</h1>
      <p>Månad: ${lista.manad || '—'} &nbsp;|&nbsp; Bränsletillägg: ${lista.bransletillagg} %</p>
      <table>
        <thead>
          <tr>
            <th>FLM</th>
            <th>Inköpspris</th>
            <th>Pris till kund</th>
            <th>Marginal (SEK)</th>
            <th>Marginal (%)</th>
            <th>Exkl. bränsle</th>
            <th>Inkl. bränsle</th>
            <th>Bränsle (SEK)</th>
          </tr>
        </thead>
        <tbody>${rader_html}</tbody>
      </table>
    </body>
    </html>`;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  }
}
