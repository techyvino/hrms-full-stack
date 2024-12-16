'use client'

import { Controller, useFormContext } from 'react-hook-form'

import { cn } from '@/lib/utils'
import { Select, SelectItem, SelectItemProps, SelectProps } from '@nextui-org/react'

export interface SelectFormProps extends SelectProps {
  name: string
  label: React.ReactNode
  options: ItemOption[]
  placeholder?: string
  noLabelText?: string
  description?: React.ReactNode
  isMultiple?: boolean
  containerClassName?: HTMLDivElement['className']
  selectItemProps?: SelectItemProps
  valueKey: keyof ItemOption
  displayNameKey: keyof ItemOption
}

export const SelectForm = ({
  containerClassName,
  name,
  label,
  description,
  selectItemProps,
  options = [],
  isLoading = false,
  isDisabled = false,
  isRequired = false,
  isMultiple = false,
  valueKey = 'value',
  displayNameKey = 'label',
  noLabelText = 'No Label',
  ...rest
}: SelectFormProps) => {
  const { control, getFieldState, formState } = useFormContext()

  const { error } = getFieldState(name, formState)

  return (
    <div className={cn(containerClassName)}>
      <Controller
        control={control}
        name={name}
        key={name}
        render={({ field: { value: selectedKey, onChange, ...restField } }) => {
          return (
            <Select
              label={label || ''}
              aria-labelledby="select"
              aria-label="select-input"
              isLoading={isLoading}
              isDisabled={isDisabled}
              color={error?.message ? 'danger' : 'default'}
              selectionMode={isMultiple ? 'multiple' : 'single'}
              isRequired={!!isRequired}
              errorMessage={error?.message?.toString() || ''}
              isInvalid={!!error?.message?.toString() || undefined}
              selectedKeys={isMultiple ? selectedKey : selectedKey ? [selectedKey] : []}
              onSelectionChange={(val) => {
                // For Single Selection
                const singleSelectVal = [...val][0] || ''
                isMultiple ? onChange([...val]) : onChange(singleSelectVal)
              }}
              description={description || ''}
              key={`select_${name}`}
              items={options || []}
              required={isRequired}
              {...restField}
              {...rest}
            >
              {(option: any) => (
                <SelectItem
                  {...selectItemProps}
                  key={option?.[valueKey]}
                  value={option?.[valueKey]}
                  textValue={option?.[displayNameKey] || ''}
                >
                  {option?.[displayNameKey] || noLabelText}
                </SelectItem>
              )}
            </Select>
          )
        }}
      />
    </div>
  )
}
