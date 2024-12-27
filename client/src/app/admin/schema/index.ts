import { z } from 'zod'

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

export const punchLocation = z.object({
  area: z.string(),
  speed: z.null(),
  memUsed: z.number(),
  accuracy: z.number(),
  altitude: z.number(),
  diskFree: z.number(),
  latitude: z.number(),
  locality: z.string(),
  diskTotal: z.number(),
  isVirtual: z.boolean(),
  longitude: z.number(),
  timestamp: z.number(),
  postal_code: z.string(),
  realDiskFree: z.number(),
  realDiskTotal: z.number(),
  webViewVersion: z.string(),
  androidSDKVersion: z.number(),
})

export const punchDeviceInfo = z.object({
  platform: z.string(),
  os_version: z.string(),
  device_name: z.string(),
  device_model: z.string(),
  manufacturer: z.string(),
  operating_system: z.string(),
})

export const punchInfoResponseSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  clock_in: z.string(),
  clock_out: z.null(),
  clock_in_location: punchLocation,
  clock_out_location: punchLocation,
  clock_in_device: punchDeviceInfo,
  clock_out_device: punchDeviceInfo,
})

export type User = z.infer<typeof UserSchema>
export type UserListResponse = User[]

export type PunchInfoResponse = z.infer<typeof punchInfoResponseSchema>
export type PunchLocation = z.infer<typeof punchLocation>
export type PunchDeviceInfo = z.infer<typeof punchDeviceInfo>
