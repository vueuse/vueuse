/**
 * Lookup table for different gamepad types.
 */

export const enum GamepadType {
  Unknown = 'Unknown',
  Xbox = 'Xbox',
  Playstation = 'Playstation',
  N64 = 'N64',
}

export function getGamepadType(gamepad: Gamepad): GamepadType {
  const id = gamepad.id.toLowerCase()

  if (id.includes('xbox'))
    return GamepadType.Xbox
  else if (id.includes('playstation'))
    return GamepadType.Unknown
  else
    return GamepadType.Unknown
  // else if (id.includes(''))
}
