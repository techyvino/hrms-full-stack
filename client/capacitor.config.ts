import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.arvihrms.com',
  appName: 'arvi-hrms',
  webDir: 'out',
  server: {
    url: 'http://192.168.0.107:5000',
    cleartext: true,
  },
}

export default config
