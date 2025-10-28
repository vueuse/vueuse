/**
 * Formats a birth date input based on the specified division character.
 * @param division - The character to use as a separator (e.g., '-', '/').
 * @param e - The input event containing the raw birth date value.
 * @returns The formatted birth date string.
 */
export function useBirthFormatter(division: string, e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace(/\D/g, '')
  let formatted = ''

  if (raw.length <= 4)
    formatted = raw
  else if (raw.length <= 6)
    formatted = `${raw.slice(0, 4)}${division}${raw.slice(4)}`
  else
    formatted = `${raw.slice(0, 4)}${division}${raw.slice(4, 6)}${division}${raw.slice(6, 8)}`

  return formatted
}
