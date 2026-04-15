import { View, Text, StyleSheet, TextInput, Modal, Button } from "react-native";

export default function CreateFolderModal({ visible, onClose, onCreateFolder, folderName, setFolderName }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create New List</Text>
          <TextInput
            style={styles.input}
            placeholder="List name"
            placeholderTextColor="#999"
            value={folderName}
            onChangeText={setFolderName}
          />
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={onClose} color="red" />
            <Button title="Create" onPress={onCreateFolder} color="green" />
          </View>
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
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#555",
    color: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
