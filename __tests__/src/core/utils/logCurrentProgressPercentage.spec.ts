import { logCurrentProgressPercentage } from './../../../../src/core/utils/logCurrentProgressPercentage'

describe('logCurrentProgressPercentage', () => {
  let consoleSpy: any
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log');
  })

  test('Given 1 as current and 2 as total should return 50%', () => {
    logCurrentProgressPercentage('Result:', 1, 2)
    expect(consoleSpy).toHaveBeenCalledWith('Result: 50%');
  });

  test('Given 3 as current and 10 as total should return 33%', () => {
    logCurrentProgressPercentage('Result:', 3, 10)
    expect(consoleSpy).toHaveBeenCalledWith('Result: 30%');
  });

  test('Given 1 as current and 10 as total should return 10%', () => {
    logCurrentProgressPercentage('Result:', 1, 10)
    expect(consoleSpy).toHaveBeenCalledWith('Result: 10%');
  });

  test('Given 0 as current and 10 as total should return 0%', () => {
    logCurrentProgressPercentage('Result:', 0, 3)
    expect(consoleSpy).toHaveBeenCalledWith('Result: 0%');
  });

  test('Given 1 as current and 0 as total should return 0%', () => {
    logCurrentProgressPercentage('Result:', 1, 0)
    expect(consoleSpy).toHaveBeenCalledWith('Result: 0%');
  });

  test('Given 0 as current and 0 as total should return 0%', () => {
    logCurrentProgressPercentage('Result:', 0, 0)
    expect(consoleSpy).toHaveBeenCalledWith('Result: 0%');
  });
})
