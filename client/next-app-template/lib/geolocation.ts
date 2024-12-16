import { Capacitor, registerPlugin } from '@capacitor/core'
import type { Position } from '@capacitor/geolocation'
import { Geolocation } from '@capacitor/geolocation'
import type { BackgroundGeolocationPlugin, CallbackError, Location } from '@capacitor-community/background-geolocation'
import { type Address, NativeGeocoder } from '@capgo/nativegeocoder'

import { IsNative } from '@/lib/utils'

export const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>('BackgroundGeolocation')

type CallbackFunction = (location: Location | null, error: CallbackError | null) => void

type formateLocationParams = {
  address?: Address
  position?: Position
  location?: Location
}

export const formateLocationInfo = ({ address, position, location }: formateLocationParams) => {
  return {
    latitude: location?.latitude || position?.coords?.latitude || null,
    longitude: location?.longitude || position?.coords?.longitude || null,
    accuracy: location?.accuracy || position?.coords?.accuracy || null,
    timestamp: location?.time || position?.timestamp || null,

    locality: address?.locality || null,
    area: address?.subLocality || null,
    postal_code: address?.postalCode || null,

    speed: location?.speed || position?.coords?.speed || null,
    altitude: location?.altitude || position?.coords?.altitude || null,
  }
}

export const checkLocationPermission = async () => {
  if (IsNative) {
    return (await Geolocation.checkPermissions())?.location
  } else {
    return 'denied'
  }
}
export const reqLocationPermission = async () => {
  if (!IsNative) {
    return 'denied'
  }
  return await Geolocation.requestPermissions()
}
export const getCurrentLocation = async () => {
  if (!IsNative) {
    const position: Position = {} as Position
    // Use a Promise to wrap the navigator API
    navigator.geolocation.getCurrentPosition((pos) => {
      position.coords = pos.coords
      position.timestamp = pos.timestamp
    })
    return position
  }
  return await Geolocation.getCurrentPosition()
}

export const addLocationWatcher = async (
  callbackFn: CallbackFunction,
  backgroundMessage: string = 'Location tracking started...'
) => {
  if (Capacitor.isNativePlatform()) {
    return await BackgroundGeolocation.addWatcher(
      {
        backgroundMessage,
        requestPermissions: true,
        stale: true,
      },
      async (location, error) => {
        if (error) {
          if (error?.code === 'NOT_AUTHORIZED') {
            if (
              window.confirm(
                'This app needs your location, ' + 'but does not have permission.\n\n' + 'Open settings now?'
              )
            ) {
              BackgroundGeolocation.openSettings()
            }
          }
          console.error(error)
        }
        callbackFn(location ?? null, error ?? null)
      }
    )
  } else {
    console.info('This app can only be used in a native environment.')
    return ''
  }
}

export const removeLocationWatcher = async (id: string) => {
  return BackgroundGeolocation.removeWatcher({ id })
}

export const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
  if (Capacitor.isNativePlatform()) {
    const { addresses } = await NativeGeocoder.reverseGeocode({
      latitude,
      longitude,
      defaultLocale: 'en-IN',
    })
    return addresses?.[0]
  }
  return {} as Address
}

// Type declarations
export type LocationInfo = ReturnType<typeof formateLocationInfo>
