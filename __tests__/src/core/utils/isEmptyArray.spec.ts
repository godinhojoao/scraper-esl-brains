import { isEmptyArray } from './../../../../src/core/utils/isEmptyArray'

describe('IsEmptyArray', () => {
  test('Given empty array should return true', () => {
    expect(isEmptyArray([])).toBe(true);
  });

  test('Given array with length equals 3 should return false', () => {
    expect(isEmptyArray([1, 1, 1])).toBe(false);
  });

  test('Given array with length equals 2 and undefined values should return false', () => {
    expect(isEmptyArray([undefined, undefined])).toBe(false);
  });
})
