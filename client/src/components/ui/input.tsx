import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps extends React.ComponentProps<'input'> {
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  classNames?: {
    base?: HTMLInputElement['className']
    inputWrapper?: HTMLInputElement['className']
    input?: HTMLInputElement['className']
    iconWrapper?: HTMLInputElement['className']
  }
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ classNames = {}, type, icon = null, iconPosition = 'right', ...props }, ref) => {
    return (
      <div className={classNames.base}>
        <div className={cn('relative', classNames.inputWrapper)}>
          <input
            type={type}
            className={cn(
              'flex h-9 w-full rounded-lg bg-gray-100 border-0 py-5 px-3 text-base shadow-sm transition-colors placeholder:text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              icon && iconPosition === 'left' ? 'pl-9 pr-4' : 'pr-9 pl-4',
              classNames.input
            )}
            ref={ref}
            {...props}
          />
          {icon && (
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2 scale-75',
                iconPosition === 'left' ? 'left-2' : 'right-2',
                classNames.iconWrapper
              )}
            >
              {icon}
            </div>
          )}
        </div>
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
