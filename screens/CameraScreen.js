import { useRef, useState } from "react";
import {
  View,
  Button,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Directory, File, Paths } from "expo-file-system";
import Entypo from "@expo/vector-icons/Entypo";
import { cameraStyles as styles, colors } from "../assets/style/styles";

async function savePhotoInApp(photoUri) {
  // pasta privada do app: Documents/gallery_photos
  const photosDir = new Directory(Paths.document, "gallery_photos");
  await photosDir.create({ intermediates: true, idempotent: true });

  const src = new File(photoUri);
  const dest = new File(photosDir, `photo_${Date.now()}.jpg`);

  await src.copy(dest); // se preferir mover: await src.move(dest)

  return dest.uri;
}

export default function CameraScreen({ navigation }) {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [savedUri, setSavedUri] = useState(null);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>
          Precisamos da permissão da câmera.
        </Text>
        <Button title="Permitir câmera" onPress={requestPermission} />
      </View>
    );
  }

  const takeAndSave = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync();
    const uri = await savePhotoInApp(photo.uri);

    console.log("Saved in app:", uri);
    setSavedUri(uri);
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} />

      <View style={styles.controls}>
        <TouchableOpacity style={styles.shutter} onPress={takeAndSave} />
      </View>
      <View style={styles.previewBox}>
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
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("BigPicture", { thumbnail: savedUri });
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
