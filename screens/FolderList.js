import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { setFolders, setImages, selectFolders, selectImages } from "../store/imageSlice";
import { STORAGE_KEYS } from "../store/storageKeys";
import Entypo from "@expo/vector-icons/Entypo";
import CreateFolderModal from "../components/CreateFolderModal";
import { folderStyles as styles, colors } from "../assets/style/styles";


export default function FolderList({ navigation }) {
  const dispatch = useDispatch();
  const folders = useSelector(selectFolders);
  const images = useSelector(selectImages);
  const [modalVisible, setModalVisible] = useState(false);
  const [folderName, setFolderName] = useState("");

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.folders);
      if (stored) {
        dispatch(setFolders(JSON.parse(stored)));
      } else {
        dispatch(setFolders([]));
      }
    } catch (error) {
      console.error("Error loading folders:", error);
    }
  };

  const saveFolders = async (newFolders) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.folders, JSON.stringify(newFolders));
      dispatch(setFolders(newFolders));
    } catch (error) {
      console.error("Error saving folders:", error);
    }
  };

  const createFolder = async () => {
    if (folderName.trim() === "") {
      alert("Enter a name for the list");
      return;
    }

    const newFolder = {
      id: Date.now().toString(),
      name: folderName,
      createdAt: new Date().toLocaleDateString(),
    };

    const updatedFolders = [...folders, newFolder];
    await saveFolders(updatedFolders);
    setFolderName("");
    setModalVisible(false);
  };

  const deleteFolder = async (id) => {
    const updatedFolders = folders.filter(folder => folder.id !== id);
    await saveFolders(updatedFolders);

    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.imageFolders);
      const parsed = stored ? JSON.parse(stored) : {};
      const cleanedMap = Object.fromEntries(
        Object.entries(parsed).filter(([, folderId]) => folderId !== id)
      );
      await AsyncStorage.setItem(STORAGE_KEYS.imageFolders, JSON.stringify(cleanedMap));

      const reassignedImages = images
        .filter((image) => image.folderId == null || image.folderId !== id)
        .map((image) => {
          if (image.folderId == null) {
            return image;
          }

          const stillAssigned = cleanedMap[image.uri];
          return stillAssigned ? { ...image, folderId: stillAssigned } : { ...image, folderId: null };
        });

      dispatch(setImages(reassignedImages));
    } catch (error) {
      console.error("Error cleaning image-folder map:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={folders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.folderItem}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Gallery', { folderId: item.id, folderName: item.name })}
              style={styles.folderInfo}
            >
              <Entypo name="folder-images" size={24} color={colors.textPrimary} />
              <View style={styles.folderText}>
                <Text style={styles.folderName}>{item.name}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => deleteFolder(item.id)}
              style={styles.deleteBtn}
            >
              <Entypo name="trash" size={20} color={colors.danger} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No lists created yet</Text>
        }
      />

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.addButton}
      >
        <Entypo name="plus" size={28} color={colors.black} />
      </TouchableOpacity>

      <CreateFolderModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreateFolder={createFolder}
        folderName={folderName}
        setFolderName={setFolderName}
      />
    </View>
  );
}

