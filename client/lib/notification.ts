import { LocalNotifications } from '@capacitor/local-notifications'

export const getNotificationPermission = async () => {
  return await LocalNotifications.requestPermissions().catch((error) => console.error(error))
}

export const checkNotificationPermission = async () => {
  const status = await LocalNotifications.checkPermissions()

  return status?.display
}
