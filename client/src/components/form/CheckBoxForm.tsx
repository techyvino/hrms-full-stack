'use client'
import type { CheckboxProps as NextUICheckboxProps } from '@nextui-org/react'
import { Checkbox } from '@nextui-org/react'
import { Controller, useFormContext } from 'react-hook-form'

import { cn } from '@/lib/utils'

export interface CheckBoxProps extends NextUICheckboxProps {
  name: string
  label: React.ReactNode
  description?: React.ReactNode
  containerClassName?: HTMLDivElement['className']
}

export const CheckboxForm = ({ containerClassName, name, label, ...rest }: CheckBoxProps) => {
  const { control } = useFormContext()

  return (
    <div className={cn(containerClassName)}>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange, ...restField } }) => {
          return (
            <Checkbox isSelected={value} onValueChange={onChange} {...restField} {...rest}>
              {label}
            </Checkbox>
          )
        }}
      />
    </div>
  )
}
