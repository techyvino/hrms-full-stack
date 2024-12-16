import { Device } from '@capacitor/device'

export const getDeviceInfo = async () => {
  const { operatingSystem, osVersion, model, name, ...info } = await Device.getInfo()
  return { device_model: model, device_name: name, operating_system: operatingSystem, os_version: osVersion, ...info }
}
