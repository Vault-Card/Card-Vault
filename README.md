# Card Vault
Welcome to Card Vault, the ultimate TCG platform. The following steps will walk you through setting up and running the project.

## Dependencies
### 1. Get an emulator for your OS/device:
   - [Android Studio](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [Xcode](https://docs.expo.dev/workflow/ios-simulator/) (Mac only)


### 2. Get npm:
Using a version manager (recommended):
   - Linux/Mac: https://github.com/nvm-sh/nvm
   - Windows: https://github.com/coreybutler/nvm-windows

Or manually installing:  
Nodejs - https://nodejs.org/en/download  
npm - `npm install -g npm`

### 3. Get cocao pods (Mac only):
https://guides.cocoapods.org/using/getting-started.html

## Setup project
Run the following commands to setup the project:

```bash
# Make sure you're in the client directory
cd ./client

# Install npm packages:
npm install

# Prebuild native Android and iOS projects:
npx expo prebuild

# Install pods (Mac only):
cd ios && pod install
```

### Vison Camera Permissions
Once the native projects are generated, make sure that the following lines exist in your native projects:

#### android/app/src/main/AndroidManifest.xml
```xml
<manifest>
   ...
   <uses-permission android:name="android.permission.CAMERA"/>
   ...
</manifest>
```

#### ios/CardVault/Info.plist
```xml
<plist>
   <dict>
      ...
      <key>NSCameraUsageDescription</key>
      <string>$(PRODUCT_NAME) needs access to your camera.</string>
      ...
   </dict>
</plist>
```

## Start the app
Make sure your emulator is running, or your physical device is connected, then run either:

```bash
# Android
npm run android


# iOS
npm run ios
and or
npx expo run
```
