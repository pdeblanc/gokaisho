export const range = (start: number, end: number): Array<number> => {
  const result: Array<number> = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};
