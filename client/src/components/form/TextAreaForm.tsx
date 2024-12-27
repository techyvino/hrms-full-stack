import type { TextAreaProps } from '@nextui-org/react'
import { Textarea } from '@nextui-org/react'
import type { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { cn } from '@/lib/utils'

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
  ...rest
}) => {
  const { control, formState, getFieldState } = useFormContext()

  const { error } = getFieldState(name, formState)

  return (
    <div className={cn(containerClassName)}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Textarea
            fullWidth
            color={error?.message ? 'danger' : 'default'}
            errorMessage={error?.message}
            id={name}
            isInvalid={!!error?.message}
            isRequired={isRequired}
            label={label}
            required={isRequired}
            {...field}
            {...rest}
          />
        )}
      />
    </div>
  )
}
