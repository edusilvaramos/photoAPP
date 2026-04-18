import { useLayoutEffect, useRef, useState } from "react";
import {
  View,
  Button,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
// expo camera and file system
import { CameraView, useCameraPermissions } from "expo-camera";
import { Directory, File, Paths } from "expo-file-system";
import Entypo from "@expo/vector-icons/Entypo";
import { cameraStyles as styles, colors } from "../assets/style/styles";

async function savePhotoInApp(photoUri) {
  // creates app private directory if it doesn't exist
  const photosDir = new Directory(Paths.document, "gallery_photos");
  // idempotent prevents error if directory already exists
  photosDir.create({ intermediates: true, idempotent: true });
  const src = new File(photoUri);
  // timestamp ensures unique names and preserves creation order
  const dest = new File(photosDir, `photo_${Date.now()}.jpg`);

  src.copy(dest); // copies from camera cache to permanent app storage 
  return dest.uri;
}

// toggle between front and back camera, the button is rendered in the header 
function renderToggleCameraButton(onPress) {
  return (
    <TouchableOpacity onPress={onPress} style={{ paddingHorizontal: 8 }}>
      <Entypo name="cycle" size={22} color={colors.black} />
    </TouchableOpacity>
  );
}

export default function CameraScreen({ navigation }) {
  // stores the camera instance so we can trigger picture capture imperatively.
  const cameraRef = useRef(null);
  // permission user to use the camera
  const [permission, requestPermission] = useCameraPermissions();
  // controls switching between front and back camera
  const [facing, setFacing] = useState("back");
  // keeps the last saved photo to show a preview, so go to BigPicture 
  const [savedUri, setSavedUri] = useState(null);

  // switches between front and back camera
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  useLayoutEffect(() => {
    // injects toggle button into navigation header
    navigation.setOptions({
      headerRight: () => renderToggleCameraButton(toggleCameraFacing),
    });
  }, [navigation]);

  // if loading, render empty view to avoid errors
  if (!permission) return <View />;

  // if permission denied, show dialog and block camera
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>
          We need camera permission.
        </Text>
        <Button title="Allow Camera" onPress={requestPermission} />
      </View>
    );
  }

  // async/await is required because takePictureAsync and savePhotoInApp are
  // async operations, so I must wait for each promise to resolve before continuing
  const takeAndSave = async () => {
    // ref not mounted means camera not initialized - prevents crashes
    if (!cameraRef.current) return;

    // sequence: capture -> save permanently -> update preview
    const photo = await cameraRef.current.takePictureAsync();
    const uri = await savePhotoInApp(photo.uri);

    console.log("photo saved in app:", uri);
    // setSavedUri triggers re-render and displays thumbnail in preview
    setSavedUri(uri);
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />

      <View style={styles.controls}>
        <TouchableOpacity style={styles.shutter} onPress={takeAndSave} />
      </View>
      <View style={styles.previewBox}>
        {/* button to navigate to gallery from camera */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Gallery");
          }}
          style={styles.galleryPhotos}
        >
          <Entypo name="images" size={24} color={colors.black} />
        </TouchableOpacity>
      </View>
      {savedUri && (
        // only show preview when a photo has been captured
        <TouchableOpacity
          onPress={() => {
            // pass thumbnail and flag to BigPicture to know origin and enable editing
            navigation.navigate("BigPicture", {
              thumbnail: savedUri,
              fromCamera: true,
            });
          }}
        >
          <View style={styles.previewBoxRight}>
            <Image source={{ uri: savedUri }} style={styles.preview} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
