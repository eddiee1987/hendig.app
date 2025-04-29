"use client"

import { Toast } from "./toast"
import { useToast } from "./use-toast"

export function Toaster() {
  const { toasts, setToasts } = useToast()

  return (
    <>
      {toasts.map(({ id, title, description, variant }) => (
        <Toast
          key={id}
          variant={variant}
          onClose={() => 
            setToasts((current) => 
              current.filter((t) => t.id !== id)
            )
          }
        >
          {title && <div className="font-semibold">{title}</div>}
          {description && <div className="text-sm">{description}</div>}
        </Toast>
      ))}
    </>
  )
}

// Eksempel på bruk:
// import { useToast } from "./use-toast"
// const { toast } = useToast()
// toast({
//   title: "Suksess!",
//   description: "Endringene ble lagret",
//   variant: "success",
//   duration: 3000
// })
