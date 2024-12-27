import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.hrms.app',
  appName: 'arvi-hrms-client',
  webDir: 'out',
  server: {
    url: 'https://hrms-full-stack.vercel.app/',
    cleartext: true,
  },
  plugins: {
    NativeSettings: {
      androidSettings: ['Location', 'Wifi', 'Bluetooth'],
      iosSettings: ['GPS', 'Bluetooth'],
    },
  },
}

export default config
