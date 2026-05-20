import {
  BASE_OPTIONS,
  DIGIT_OPTIONS,
  SYMBOLS
} from "./constants.js";

export function createInitialState(
  digits
) {
  return new Array(digits).fill(0);
}

export function convertDecimalToState(
  value,
  base,
  digits
) {
  const maxValue =
    (
      BigInt(base) **
      BigInt(digits)
    ) - 1n;

  if (
    value < 0n ||
    value > maxValue
  ) {
    return null;
  }

  const result =
    new Array(digits).fill(0);

  let currentValue = value;

  for (
    let index = digits - 1;
    index >= 0;
    index--
  ) {
    result[index] =
      Number(
        currentValue %
        BigInt(base)
      );

    currentValue =
      currentValue /
      BigInt(base);
  }

  return result;
}

export function parseInputValue(
  value,
  base,
  digits
) {
  const normalized =
    value
      .trim()
      .toUpperCase();

  if (
    normalized.length === 0
  ) {
    return null;
  }

  if (
    normalized.length > digits
  ) {
    return null;
  }

  const parsedDigits = [];

  for (
    const symbol of normalized
  ) {
    const digitValue =
      SYMBOLS.indexOf(symbol);

    if (
      digitValue === -1 ||
      digitValue >= base
    ) {
      return null;
    }

    parsedDigits.push(
      digitValue
    );
  }

  while (
    parsedDigits.length < digits
  ) {
    parsedDigits.unshift(0);
  }

  return parsedDigits;
}

export function getDigitSymbol(
  value
) {
  return SYMBOLS[value];
}

export function getWeightExpression(
  base,
  exponent
) {
  return `
    ${base}<sup>${exponent}</sup>
  `;
}

export function getProductExpression(
  digit,
  exponent,
  base
) {
  return `
    ${getDigitSymbol(digit)}
    ×
    ${base}<sup>${exponent}</sup>
  `;
}

export function getContributionValue(
  digit,
  exponent,
  base
) {
  return (
    BigInt(digit) *
    (
      BigInt(base) **
      BigInt(exponent)
    )
  );
}

export function getDecimalValue(
  state,
  base,
  digits
) {
  let total = 0n;

  for (
    let i = 0;
    i < digits;
    i++
  ) {
    const digit =
      state[i];

    const exponent =
      digits - 1 - i;

    total +=
      getContributionValue(
        digit,
        exponent,
        base
      );
  }

  return total;
}

export function addPower(
  currentValue,
  exponent,
  direction,
  base,
  digits
) {
  const delta =
    BigInt(base) **
    BigInt(exponent);

  const modulus =
    BigInt(base) **
    BigInt(digits);

  const nextValue =
    (
      currentValue +
      (
        BigInt(direction) *
        delta
      )
    ) % modulus;

  return (
    nextValue +
    modulus
  ) % modulus;
}

export {
  BASE_OPTIONS,
  DIGIT_OPTIONS
};