export function getDateOnly(date: Date): string {
  // 使用本地时区，格式化为 YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function today(): string {
  return getDateOnly(new Date());
}

export function tomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return getDateOnly(d);
}
