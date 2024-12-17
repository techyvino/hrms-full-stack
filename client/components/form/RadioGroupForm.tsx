'use client'

import type { RadioGroupProps, RadioProps } from '@nextui-org/react'
import { Radio, RadioGroup } from '@nextui-org/react'
import type { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { cn } from '@/lib/utils'

export interface FormRadioGroupProps extends RadioGroupProps {
  name: string
  label: React.ReactNode
  options: ItemOption[]
  containerClassName?: HTMLDivElement['className']
  radioProps?: RadioProps
  valueKey: keyof ItemOption
  displayNameKey: keyof ItemOption
}

export const RadioGroupForm: FC<FormRadioGroupProps> = ({
  containerClassName = 'w-full',
  name,
  radioProps,
  options = [],
  valueKey = 'value',
  displayNameKey = 'label',
  ...rest
}) => {
  const { control, getFieldState, formState } = useFormContext()
  const { error } = getFieldState(name, formState)

  return (
    <div className={cn(containerClassName)}>
      <Controller
        key={name}
        control={control}
        name={name}
        render={({ field: { value: checkBoxValue, onChange, ...restField } }) => {
          return (
            <RadioGroup
              errorMessage={error?.message?.toString() || ''}
              isInvalid={!!error?.message?.toString() || undefined}
              orientation="horizontal"
              validationBehavior="native"
              value={checkBoxValue}
              onValueChange={(e) => {
                onChange(e)
              }}
              {...restField}
              {...rest}
            >
              {Array.isArray(options) &&
                options.map((option) => (
                  <Radio key={option?.[valueKey]} value={option?.[valueKey]?.toString()} {...radioProps}>
                    {option?.[displayNameKey] || 'NA'}
                  </Radio>
                ))}
            </RadioGroup>
          )
        }}
      />
    </div>
  )
}
