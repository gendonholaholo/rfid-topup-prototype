export interface CSVColumn<T> {
  header: string;
  accessor: (row: T) => string | number;
}

export function downloadCSV<T>(
  filename: string,
  columns: CSVColumn<T>[],
  data: T[]
): void {
  const headers = columns.map((c) => c.header);
  const rows = data.map((row) =>
    columns.map((col) => {
      const value = col.accessor(row);
      const str = String(value);
      // Escape values containing commas, quotes, or newlines
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    })
  );

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function csvFilename(prefix: string): string {
  const date = new Date().toISOString().split('T')[0];
  return `${prefix}_${date}.csv`;
}
