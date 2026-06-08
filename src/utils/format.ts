/** Round a float to N decimal places. */
export function round(value: number, decimals = 1): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

/** Duration tier for colour coding. */
export function durTier(ms: number): 'ok' | 'mid' | 'slow' {
  if (ms > 500) return 'slow'
  if (ms > 200) return 'mid'
  return 'ok'
}

/** CPU usage tier for colour coding. */
export function cpuTier(pct: number): 'ok' | 'mid' | 'high' {
  if (pct > 70) return 'high'
  if (pct > 40) return 'mid'
  return 'ok'
}
