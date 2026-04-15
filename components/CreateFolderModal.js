import { View, Text, TextInput, Modal, Button } from "react-native";
import { createFolderModalStyles as styles, colors } from "../assets/style/styles";

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
            placeholderTextColor={colors.textSecondary}
            value={folderName}
            onChangeText={setFolderName}
          />
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={onClose} color={colors.danger} />
            <Button title="Create" onPress={onCreateFolder} color={colors.success} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
