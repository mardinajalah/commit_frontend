export const getPagination = (
  current: number,
  total: number
): (number | string)[] => {
  const delta = 1;
  const range: (number | string)[] = [];
  const rangeWithDots: (number | string)[] = [];

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }

  let prev: number | undefined;
  for (let i of range) {
    if (prev !== undefined) {
      if (typeof i === "number" && typeof prev === "number") {
        if (i - prev === 2) {
          rangeWithDots.push(prev + 1);
        } else if (i - prev > 2) {
          rangeWithDots.push("...");
        }
      }
    }
    rangeWithDots.push(i);
    prev = i as number;
  }

  return rangeWithDots;
};
