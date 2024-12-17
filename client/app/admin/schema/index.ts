import { z } from 'zod'

import { responseSchema } from '@/services/zod'

export const UserSchema = z.object({
  id: z.number(),
  department: z.string(),
  designation: z.string(),
  email: z.string().email(),
  mobile_no: z.string(),
  gender: z.string(),
  joined_date: z.string(),
  live_tracker_enabled: z.boolean(),
  marital_status: z.string(),
  name: z.string(),
  status: z.string(),
  site_name: z.string(),
  role_name: z.string(),
})

export const getUserListResponse = responseSchema.omit({ message: true }).extend({
  data: z.array(UserSchema),
})

export type User = z.infer<typeof UserSchema>
export type UserListResponse = z.infer<typeof getUserListResponse>
