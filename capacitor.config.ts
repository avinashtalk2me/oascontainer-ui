import { CapacitorConfig } from '@capacitor/cli';


const config: CapacitorConfig = {
  appId: 'com.oastrade.containermanifest',
  appName: 'OAS Container Manifest',
  webDir: 'build',
  bundledWebRuntime: false, 
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,
      "launchAutoHide": true,
      "androidScaleType": "CENTER_CROP",
      "androidSplashResourceName": "splash",
      "splashFullScreen": false,
      "splashImmersive": false
    }
  },
  "android": {
    "allowMixedContent": true
  }
};

export default config;
