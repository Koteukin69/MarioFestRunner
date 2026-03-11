export function randomCSharpInt(): number {
  const min = -2_147_483_648;
  const max = 2_147_483_647;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}