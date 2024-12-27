import { z } from 'zod'

export const signUpValuesSchema = z
  .object({
    name: z.string(),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirm_password: z.string(),
    dob: z.string(),
    mobile_no: z.string(),
    email: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords must match',
    path: ['confirmPassword'], // Error will be attached to confirmPassword
  })

export default signUpValuesSchema
