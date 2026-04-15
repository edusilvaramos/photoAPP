import { Image, TouchableOpacity, StyleSheet, View } from "react-native";
import { useState } from "react";
import { File } from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from '@expo/vector-icons/Feather';
import { assignImageToFolder, removeImageFromFolder, selectFolders, selectImages } from "./ImageSlice";
import AddToFolderModal from "./AddToFolderModal";

const IMAGE_FOLDERS_KEY = "@imageFolders";

export default function BigPicture({ route, navigation }) {
  const thumbnail = route?.params?.thumbnail;
  const dispatch = useDispatch();
  const folders = useSelector(selectFolders);
  const images = useSelector(selectImages);
  const [modalVisible, setModalVisible] = useState(false);

  const existing = images.find((img) => img.uri === thumbnail);
  const isAssigned = Boolean(existing?.folderId);

  const handleAssign = async (folderId) => {
    if (!thumbnail) return;
    dispatch(assignImageToFolder({ uri: thumbnail, folderId }));
    await saveImageFolderMap(thumbnail, folderId);
    setModalVisible(false);
  };

  const handleRemove = async () => {
    if (!thumbnail) return;
    dispatch(removeImageFromFolder({ uri: thumbnail }));
    await saveImageFolderMap(thumbnail, null);
    navigation.navigate("Gallery");
  };

  const handleDelete = async () => {
    if (!thumbnail) return;
    try {
      const file = new File(thumbnail);
      if (file.exists) {
        await file.delete();
      }
      dispatch(removeImageFromFolder({ uri: thumbnail }));
      await saveImageFolderMap(thumbnail, null);
      navigation.navigate("Gallery");
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const saveImageFolderMap = async (uri, folderId) => {
    try {
      const stored = await AsyncStorage.getItem(IMAGE_FOLDERS_KEY);
      const parsed = stored ? JSON.parse(stored) : {};
      if (folderId) {
        parsed[uri] = folderId;
      } else {
        delete parsed[uri];
      }
      await AsyncStorage.setItem(IMAGE_FOLDERS_KEY, JSON.stringify(parsed));
    } catch (error) {
      console.error("Error saving image-folder map:", error);
    }
  };

  return (
    <View style={styles.container}>
      {thumbnail && (
        <Image
          source={{ uri: thumbnail }}
          style={styles.image}
        />
      )}

      {thumbnail && !isAssigned && (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.addButton}
        >
          <Entypo name="folder-images" size={24} color="white" />
        </TouchableOpacity>
      )}

      {thumbnail && isAssigned && (
        <TouchableOpacity
          onPress={handleRemove}
          style={styles.removeButton}
        >
          <Feather name="folder-minus" size={24} color="black" />
        </TouchableOpacity>
      )}

      {thumbnail && (
        <TouchableOpacity
          onPress={handleDelete}
          style={styles.deleteButton}
        >
          <Entypo name="trash" size={22} color="white" />
        </TouchableOpacity>
      )}

      <AddToFolderModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        folders={folders}
        onSelectFolder={handleAssign}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  image: {
    width: "90%",
    height: "90%",
    resizeMode: "contain",
  },

  addButton: {
    position: "absolute",
    right: 20,
    bottom: 40,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 18,
    padding: 10,
  },
  removeButton: {
    position: "absolute",
    right: 20,
    bottom: 40,
    backgroundColor: "rgba(255,0,0,0.7)",
    borderRadius: 18,
    padding: 10,
  },
  deleteButton: {
    position: "absolute",
    left: 20,
    bottom: 40,
    backgroundColor: "rgba(255,0,0,0.7)",
    borderRadius: 18,
    padding: 10,
  },
});
