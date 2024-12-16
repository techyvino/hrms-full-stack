import type { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { cn } from '@/lib/utils'
import { Textarea, TextAreaProps } from '@nextui-org/react'

export interface TextAreaFormProps extends TextAreaProps {
  name: string
  containerClassName?: HTMLDivElement['className']
  label?: React.ReactNode
}

export const TextAreaForm: FC<TextAreaFormProps> = ({
  containerClassName = 'w-full',
  name = '',
  label = '',
  isRequired = false,
  required,
  className,
  ...rest
}) => {
  const { control, formState, getFieldState } = useFormContext()

  const { error } = getFieldState(name, formState)

  return (
    <div className={cn(containerClassName)}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Textarea
            fullWidth
            id={name}
            label={label}
            isRequired={isRequired}
            required={isRequired}
            color={error?.message ? 'danger' : 'default'}
            isInvalid={!!error?.message}
            errorMessage={error?.message}
            {...field}
            {...rest}
          />
        )}
      />
    </div>
  )
}
