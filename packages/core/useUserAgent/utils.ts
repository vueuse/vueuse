export function createVersionParts(count: number): string[] {
  const output = []
  for (let i = 0; i < count; i++)
    output.push('0')

  return output
}
