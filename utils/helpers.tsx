export const generateFarmCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};