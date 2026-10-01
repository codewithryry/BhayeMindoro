import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bhaye.mindoro',
  appName: 'Bhaye Mindoro',
  // Vite production build output.
  webDir: 'dist',
  android: {
    // Never load the web app over plain HTTP.
    allowMixedContent: false,
  },
};

export default config;
