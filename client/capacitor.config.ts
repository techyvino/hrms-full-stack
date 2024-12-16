import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.hrms.app',
  appName: 'arvi-hrms-client',
  webDir: 'out',
  server: {
    url: 'http://192.168.0.108:5000',
    cleartext: true,
  },
}

export default config
