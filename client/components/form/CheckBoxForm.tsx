'use client'
import { Controller, useFormContext } from 'react-hook-form'

import { cn } from '@/lib/utils'
import { Checkbox, CheckboxProps as NextUICheckboxProps } from '@nextui-org/react'

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
        name={name}
        control={control}
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
