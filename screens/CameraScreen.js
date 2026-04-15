import { useRef, useState } from "react";
import {
  View,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Directory, File, Paths } from "expo-file-system";
import Entypo from "@expo/vector-icons/Entypo";

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
        <Text style={{ marginBottom: 12 }}>
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
          style={styles.gallery_photos}
        >
          <Entypo name="images" size={24} color="black" />
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  controls: { position: "absolute", bottom: 40, alignSelf: "center" },
  shutter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "white",
    borderWidth: 6,
    borderColor: "rgba(255,255,255,0.5)",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  previewBox: { position: "absolute", bottom: 30, left: 20 },
  previewBoxRight: { position: "absolute", bottom: 30, right: 20 },
  preview: { width: 60, height: 60, borderRadius: 8 },
  gallery_photos: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    
  },
});
