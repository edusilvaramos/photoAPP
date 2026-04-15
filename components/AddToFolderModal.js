import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";

export default function AddToFolderModal({ visible, onClose, folders, onSelectFolder }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add to folder</Text>

          {folders.length === 0 && (
            <Text style={styles.emptyText}>No folders created yet</Text>
          )}

          {folders.length > 0 && (
            <FlatList
              data={folders}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => onSelectFolder(item.id)}
                  style={styles.folderButton}
                >
                  <Entypo name="folder-images" size={18} color="white" />
                  <Text style={styles.folderText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  folderButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#333",
    marginBottom: 8,
  },
  folderText: {
    color: "white",
    marginLeft: 8,
  },
  emptyText: {
    color: "#999",
    marginBottom: 12,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    alignItems: "center",
  },
  closeText: {
    color: "#fff",
  },
});
