'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

const Progress = React.forwardRef<
  HTMLProgressElement,
  React.ComponentPropsWithoutRef<'progress'>
>(({ className, value = 0, ...props }, ref) => (
  <progress
    ref={ref}
    max={100}
    value={value}
    className={cn('progress-track h-4 w-full overflow-hidden rounded-full', className)}
    {...props}
  />
))
Progress.displayName = 'Progress'

export { Progress }
