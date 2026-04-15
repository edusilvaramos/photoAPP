import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { setFolders, selectFolders } from "../components/ImageSlice";
import Entypo from "@expo/vector-icons/Entypo";
import CreateFolderModal from "../components/CreateFolderModal";

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 10,
  },
  folderItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1a1a1a",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
  },
  folderInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  folderText: {
    marginLeft: 15,
    flex: 1,
  },
  folderName: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  folderDate: {
    color: "#999",
    fontSize: 12,
    marginTop: 5,
  },
  deleteBtn: {
    padding: 10,
  },
  emptyText: {
    color: "#999",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e2e7ec",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
});
