import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, onChange, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[80px] w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm ring-offset-slate-950 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50 text-slate-100",
                    className
                )}
                ref={ref}
                onChange={onChange}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

export { Textarea }
