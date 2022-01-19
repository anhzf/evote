export const arrayChunks = <T>(array: T[], chunkSize: number) => {
  const chunks = [];
  let i = 0;
  while (i < array.length) {
    chunks.push(array.slice(i, i += chunkSize));
  }
  return chunks;
}
