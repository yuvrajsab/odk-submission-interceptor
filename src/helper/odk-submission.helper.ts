export function validateData(data: string | number | null): string {
  if (data === null) {
    return 'NA';
  }
  if (typeof data === 'number') {
    return data.toString();
  }
  return data;
}
