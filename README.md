# PhotoAPP

A React Native photo gallery app built with Expo.

The app lets you:
- take photos with the device camera
- store photos locally in app storage
- view photos in a gallery
- create folders
- assign and remove photos from folders
- delete photos

## Setup

```bash
git clone <repository-url>
cd photoAPP
npm install
npm start
```

Choose your platform:

- `a` -> Android
- `i` -> iOS
- Scan QR Code with Expo Go app

Clear cache if needed: `npx expo start -c`

## Project Structure

- `index.js` - Entry point
- `App.js` - Root component, Redux Provider and navigation setup
- `screens/CameraScreen.js` - Camera capture flow
- `screens/ImageList.js` - Gallery and folder-filtered list
- `screens/FolderList.js` - Folder management
- `components/BigPicture.js` - Full image view and folder actions
- `components/ImageSlice.js` - Redux slice for images/folders
- `store/store.js` - Redux store configuration
- `assets/` - Static assets

## Running

```bash
npm start
npm run ios
npm run android
npm run web
```

## References

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/)
- [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)
- [Expo FileSystem](https://docs.expo.dev/versions/latest/sdk/filesystem/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
