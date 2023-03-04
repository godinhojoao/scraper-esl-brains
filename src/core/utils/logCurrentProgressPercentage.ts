export function logCurrentProgressPercentage (logPrefix: string, current: number, total: number): void {
  if ((!current && current !== 0) || !total) { return console.log(`${logPrefix} 0%`) }
  const currentProgress = (current / total) * 100
  console.log(`${logPrefix} ${currentProgress.toFixed()}%`)
}
