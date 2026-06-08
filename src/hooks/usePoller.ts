import { useState, useEffect, useCallback, useRef } from 'react'

interface PollerResult<T> {
  data:    T | null
  error:   string | null
  loading: boolean
  refresh: () => void
}

/**
 * Polls an async function every `intervalMs` milliseconds.
 * The latest version of `fn` is always used — safe to pass a new reference
 * each render (e.g. from useCallback with deps).
 */
export function usePoller<T>(fn: () => Promise<T>, intervalMs = 5_000): PollerResult<T> {
  const [data,    setData]    = useState<T | null>(null)
  const [error,   setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fnRef    = useRef(fn)
  fnRef.current  = fn
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const run = useCallback(async () => {
    try {
      const result = await fnRef.current()
      setData(result)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    run()
    timerRef.current = setInterval(run, intervalMs)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [run, intervalMs])

  return { data, error, loading, refresh: run }
}
