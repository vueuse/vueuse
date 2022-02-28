export function createVersionParts(count: number): string[] {
  const output = []
  for (let ii = 0; ii < count; ii++)
    output.push('0')

  return output
}
