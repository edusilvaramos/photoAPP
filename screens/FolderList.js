import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { File } from "expo-file-system";
import { useDispatch, useSelector } from "react-redux";
import { setFolders, setImages, selectFolders, selectImages } from "../store/imageSlice";
import { STORAGE_KEYS } from "../store/storageKeys";
import Entypo from "@expo/vector-icons/Entypo";
import CreateFolderModal from "../components/CreateFolderModal";
import { folderStyles as styles, colors } from "../assets/style/styles";


export default function FolderList({ navigation }) {
  // dispatch to keep folders and images in sync across screens
  const dispatch = useDispatch();
  const folders = useSelector(selectFolders);
  const images = useSelector(selectImages);
  // controls create folder modal visibility and input value
  const [modalVisible, setModalVisible] = useState(false);
  const [folderName, setFolderName] = useState("");

  // load saved folders when screen mounts
  useEffect(() => {
    loadFolders();
  }, []);

  // async lets this function wait for storage read before updating redux
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

  // persists folders and keeps redux in sync
  const saveFolders = async (newFolders) => {
    try {
      // await makes sure folders are saved before continuing
      await AsyncStorage.setItem(STORAGE_KEYS.folders, JSON.stringify(newFolders));
      // update redux after storage write succeeds
      dispatch(setFolders(newFolders));
    } catch (error) {
      console.error("Error saving folders:", error);
    }
  };

  const createFolder = async () => {
    // prevent empty folder names
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
    // wait save to finish before clearing input and closing modal
    await saveFolders(updatedFolders);
    setFolderName("");
    setModalVisible(false);
  };

  // deletes folder, related files, and related map entries
  const confirmDeleteFolder = async (id) => {
    console.log('deleting folder:', id);
    const updatedFolders = folders.filter(folder => folder.id !== id);
    // wait folder save so storage and ui stay in sync
    await saveFolders(updatedFolders);

    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.imageFolders);
      const parsed = stored ? JSON.parse(stored) : {};

      const urisFromMap = Object.entries(parsed)
        .filter(([, folderId]) => folderId === id)
        .map(([uri]) => uri);

      const urisFromState = images
        .filter((image) => image.folderId === id)
        .map((image) => image.uri);

      // merge both sources to avoid missing stale entries
      const urisToDelete = [...new Set([...urisFromMap, ...urisFromState])];
      console.log('images to delete:', urisToDelete.length);

      // remove local image files that belonged to this folder
      for (const uri of urisToDelete) {
        try {
          const file = new File(uri);
          if (file.exists) {
            // await avoids moving on before file is really deleted
            await file.delete();
            console.log('file deleted:', uri);
          }
        } catch (error) {
          console.error("error deleting folder image file:", error);
        }
      }

      const cleanedMap = Object.fromEntries(
        Object.entries(parsed).filter(([, folderId]) => folderId !== id)
      );
      // wait map write before rebuilding redux image assignments
      await AsyncStorage.setItem(STORAGE_KEYS.imageFolders, JSON.stringify(cleanedMap));

      const deletedSet = new Set(urisToDelete);

      // remove deleted images from redux and normalize remaining assignments
      const reassignedImages = images
        .filter((image) => !deletedSet.has(image.uri))
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

  const deleteFolder = (id, name) => {
    Alert.alert(
      "Delete folder",
      `Delete "${name}" and all images inside it? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            confirmDeleteFolder(id);
          },
        },
      ]
    );
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
              onPress={() => deleteFolder(item.id, item.name)}
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

