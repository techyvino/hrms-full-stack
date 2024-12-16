import type { FC } from 'react'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { cn } from '@/lib/utils'
import { Input, InputProps } from '@nextui-org/react'

export interface InputFormProps extends InputProps {
  name: string
  containerClassName?: HTMLDivElement['className']
  label?: React.ReactNode
  description?: React.ReactNode
}

export const InputForm: FC<InputFormProps> = ({
  containerClassName = 'w-full',
  name = '',
  type = 'text',
  label = '',
  description = '',
  required,
  ...rest
}) => {
  const { control, getFieldState, formState } = useFormContext()

  const { error } = getFieldState(name, formState)

  return (
    <div className={cn(containerClassName)}>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange, ...restField } }) => (
          <Input
            fullWidth
            id={name}
            label={label}
            type={type}
            errorMessage={error?.message}
            isRequired={!!required}
            onChange={(e) => {
              const val = e.target?.value
              return onChange(type === 'number' && val ? `${Number(val)}` : val.trimStart())
            }}
            value={value || ''}
            validationBehavior="native"
            step="any"
            required={!!required}
            isInvalid={!!error?.message}
            {...restField}
            {...rest}
          />
        )}
      />
    </div>
  )
}
