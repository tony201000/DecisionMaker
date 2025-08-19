import { Slot } from "@radix-ui/react-slot"
import * as React from "react"
import { cn } from "@/lib/utils/decision-styles"

interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean
}

const VisuallyHidden = React.forwardRef<HTMLElement, VisuallyHiddenProps>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "span"
  return (
    <Comp
      ref={ref}
      className={cn("absolute h-px w-px p-0 -m-px overflow-hidden clip-[rect(0,0,0,0)] whitespace-nowrap border-0", className)}
      {...props}
    />
  )
})
VisuallyHidden.displayName = "VisuallyHidden"

export { VisuallyHidden }
