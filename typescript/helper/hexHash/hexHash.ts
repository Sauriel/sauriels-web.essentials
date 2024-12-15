export function hexHash(s: string): string {
  return (
    s
      .split("")
      // calculate 32bit hash
      .reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0)
      .toString(16)
  );
}
