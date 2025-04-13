import { useState, useCallback } from 'react'

interface ToastOptions {
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<(ToastOptions & { id: string })[]>([])

  const toast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).slice(2)
    const newToast = { ...options, id }
    
    setToasts((currentToasts) => [...currentToasts, newToast])

    if (options.duration !== Infinity) {
      setTimeout(() => {
        setToasts((currentToasts) => 
          currentToasts.filter((toast) => toast.id !== id)
        )
      }, options.duration || 3000)
    }

    return {
      id,
      dismiss: () => setToasts((currentToasts) => 
        currentToasts.filter((toast) => toast.id !== id)
      )
    }
  }, [])

  return { toast, toasts, setToasts }
} 