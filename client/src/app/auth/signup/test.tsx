'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { CheckboxGroupForm } from '@/components/form/CheckboxGroupForm'
import { InputForm } from '@/components/form/InputForm'
import MultiTagSelectForm from '@/components/form/MultiTagSelectForm'
import { RadioGroupForm } from '@/components/form/RadioGroupForm'
import { SelectForm } from '@/components/form/SelectForm'
import { SwitchForm } from '@/components/form/SwitchForm'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'

const FormSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  password: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  is_manager: z.boolean(),
  type: z.string().min(1, { message: 'Required' }),
  items: z.array(z.string()).min(1, { message: 'Required' }),
  framework: z.array(z.string()).min(1, { message: 'Required' }),
  select: z.string().min(1, { message: 'Required' }),
})

export function EmpForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: 'test',
      password: 'password',
      is_manager: true,
      type: 'all',
      items: ['all', 'mentions'],
      framework: ['mentions', 'all'],
      select: 'none',
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log('data:', data)
  }

  const notifications = [
    {
      name: 'All new messages',
      value: 'all',
    },
    {
      name: 'Direct messages and mentions',
      value: 'mentions',
    },
    {
      name: 'Nothing',
      value: 'none',
    },
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <InputForm name="username" label="Username" />
        <InputForm name="password" label="Password" />
        <SwitchForm name="is_manager" label="Is Manager" />
        <RadioGroupForm name="type" label="Notify option" options={notifications} />
        <CheckboxGroupForm name="items" label="Notify option" options={notifications} />
        <MultiTagSelectForm label="Framework" name="framework" options={notifications} />
        <SelectForm name="select" label="Notify option" options={notifications} />
        <Button className="mt-5 w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  )
}
