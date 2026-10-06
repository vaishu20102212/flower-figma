const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
})[character])

const escapeCsv = (value) => {
  const text = String(value ?? '')
  return `"${text.replace(/"/g, '""')}"`
}

const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function exportTable({ title, filename, columns, rows, format }) {
  const data = rows.map((row) => columns.map((column) => column.value(row)))

  if (format === 'csv') {
    const csv = [
      columns.map((column) => escapeCsv(column.label)).join(','),
      ...data.map((row) => row.map(escapeCsv).join(',')),
    ].join('\r\n')
    downloadFile(`\uFEFF${csv}`, `${filename}.csv`, 'text/csv;charset=utf-8')
    return
  }

  if (format === 'excel') {
    const tableRows = [
      `<tr>${columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join('')}</tr>`,
      ...data.map((row) => `<tr>${row.map((value) => `<td>${escapeHtml(value)}</td>`).join('')}</tr>`),
    ].join('')
    const workbook = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head><body><table>${tableRows}</table></body></html>`
    downloadFile(`\uFEFF${workbook}`, `${filename}.xls`, 'application/vnd.ms-excel;charset=utf-8')
    return
  }

  if (format === 'print' || format === 'pdf') {
    const printWindow = window.open('', '_blank', 'noopener,noreferrer')
    if (!printWindow) {
      window.alert('The export window was blocked. Allow pop-ups and try again.')
      return
    }
    const tableRows = [
      `<tr>${columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join('')}</tr>`,
      ...data.map((row) => `<tr>${row.map((value) => `<td>${escapeHtml(value)}</td>`).join('')}</tr>`),
    ].join('')
    printWindow.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>body{font:14px Arial,sans-serif;padding:24px;color:#1e293b}h1{font-size:20px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #cbd5e1;padding:8px;text-align:left}th{background:#f1f5f9}@media print{body{padding:0}}</style></head><body><h1>${escapeHtml(title)}</h1><table>${tableRows}</table></body></html>`)
    printWindow.document.close()
    printWindow.focus()
    printWindow.setTimeout(() => printWindow.print(), 250)
    return
  }

  throw new Error(`Unsupported export format: ${format}`)
}
