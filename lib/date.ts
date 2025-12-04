export function getDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function today(): string {
  return getDateOnly(new Date());
}

export function tomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return getDateOnly(d);
}
