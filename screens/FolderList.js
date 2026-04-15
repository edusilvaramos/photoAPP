import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { setFolders, selectFolders } from "../components/ImageSlice";
import Entypo from "@expo/vector-icons/Entypo";
import CreateFolderModal from "../components/CreateFolderModal";
import { folderStyles as styles } from "../assets/style/styles";

const FOLDERS_KEY = "@folders";

export default function FolderList({ navigation }) {
  const dispatch = useDispatch();
  const folders = useSelector(selectFolders);
  const [modalVisible, setModalVisible] = useState(false);
  const [folderName, setFolderName] = useState("");

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      const stored = await AsyncStorage.getItem(FOLDERS_KEY);
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
      await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(newFolders));
      dispatch(setFolders(newFolders));
    } catch (error) {
      console.error("Error saving folders:", error);
    }
  };

  const createFolder = () => {
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
    saveFolders(updatedFolders);
    setFolderName("");
    setModalVisible(false);
  };

  const deleteFolder = (id) => {
    const updatedFolders = folders.filter(folder => folder.id !== id);
    saveFolders(updatedFolders);
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
              <Entypo name="folder-images" size={24} color="white" />
              <View style={styles.folderText}>
                <Text style={styles.folderName}>{item.name}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => deleteFolder(item.id)}
              style={styles.deleteBtn}
            >
              <Entypo name="trash" size={20} color="red" />
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
        <Entypo name="plus" size={28} color="black" />
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

