// Localized two-digit number, e.g. 1 -> "01" / "۰۱"
export const formatIndex = (n, lang) =>
  new Intl.NumberFormat(lang, { minimumIntegerDigits: 2 }).format(n)
