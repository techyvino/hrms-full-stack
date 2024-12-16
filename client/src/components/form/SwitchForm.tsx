import { cn } from '@/lib/utils'
import { Switch, SwitchProps } from '@nextui-org/react'
import type { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

export interface SwitchFormProps extends SwitchProps {
  name: string
  label?: React.ReactNode
}

export const SwitchForm: FC<SwitchFormProps> = ({ name = '', label = '', className, ...rest }) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, ...restField } }) => {
        return (
          <Switch isSelected={value} {...rest} {...restField}>
            <span className={cn(className)}>{label || ''}</span>
          </Switch>
        )
      }}
    />
  )
}
