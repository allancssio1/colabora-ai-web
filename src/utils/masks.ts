export function maskCPF(value: string): string {
  let v = value.replace(/\D/g, '')

  if (v.length > 11) {
    return v
    // Aplicar formatação progressiva conforme digita
  }
  // let v = v
  v = v.replace(/(\d{3})(\d)/, '$1.$2')
  v = v.replace(/(\d{3})(\d)/, '$1.$2')
  v = v.replace(/(\d{3})(\d{1,2})/, '$1-$2')
  return v
}
