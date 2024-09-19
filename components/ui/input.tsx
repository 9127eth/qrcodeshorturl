import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * A function to validate the input value.
   * Should return an error message string if invalid, or null if valid.
   */
  validateUrl?: (value: string) => string | null
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", validateUrl, ...props }, ref) => {
    const [error, setError] = React.useState<string | null>(null)

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      if (validateUrl) {
        const validationError = validateUrl(event.target.value)
        setError(validationError)
      }
    }

    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
            error ? "border-destructive" : ""
          )}
          ref={ref}
          onBlur={handleBlur}
          {...props}
        />
        {error && <p className="text-destructive text-sm mt-1">{error}</p>}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
