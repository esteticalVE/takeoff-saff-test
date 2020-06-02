import { useState, useCallback, useEffect } from 'react'

export function useAlert() {
  const [alert, setAlert] = useState(null)

  const clearAlert = useCallback(() => setAlert(null), [])

  useEffect(() => {
    const interval = setInterval(() => {
      clearAlert()
    }, 3000)
    return () => clearInterval(interval)
  }, [alert])

  return {
    alert,
    setAlert,
  }
}
