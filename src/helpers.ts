export const calcPrice = (owned: number, baseCost: number, costMultiplier: number, count: number): number => {
  if (count === 0) {
    return baseCost * Math.pow(costMultiplier, owned);
  } else {
    let finalCount = owned + count;
    return baseCost * (finalCount* Math.pow(costMultiplier, finalCount - 1) - owned * Math.pow(costMultiplier, owned - 1));
  }
}