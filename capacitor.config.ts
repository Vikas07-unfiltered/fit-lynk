import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ba11fafa9d0146a9a3a8a5a872832141',
  appName: 'fit-lynk',
  webDir: 'dist',
  server: {
    url: 'https://ba11fafa-9d01-46a9-a3a8-a5a872832141.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;