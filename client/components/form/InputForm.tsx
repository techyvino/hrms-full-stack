import type { InputProps } from '@nextui-org/react'
import { Input } from '@nextui-org/react'
import type { FC } from 'react'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { cn } from '@/lib/utils'

export interface InputFormProps extends InputProps {
  name: string
  containerClassName?: HTMLDivElement['className']
  label?: React.ReactNode
}

export const InputForm: FC<InputFormProps> = ({
  containerClassName = 'w-full',
  name = '',
  type = 'text',
  label = '',
  required,
  ...rest
}) => {
  const { control, getFieldState, formState } = useFormContext()

  const { error } = getFieldState(name, formState)

  return (
    <div className={cn(containerClassName)}>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange, ...restField } }) => (
          <Input
            fullWidth
            errorMessage={error?.message}
            id={name}
            isInvalid={!!error?.message}
            isRequired={!!required}
            label={label}
            required={!!required}
            step="any"
            type={type}
            validationBehavior="native"
            value={value || ''}
            onChange={(e) => {
              const val = e.target?.value

              return onChange(type === 'number' && val ? `${Number(val)}` : val.trimStart())
            }}
            {...restField}
            {...rest}
          />
        )}
      />
    </div>
  )
}
