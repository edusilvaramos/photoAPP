import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { addToFolderModalStyles as styles, colors } from "../assets/style/styles";

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

          {/* show helper text when no folders exist yet */}
          {folders.length === 0 && (
            <Text style={styles.emptyText}>No folders created yet</Text>
          )}

          {/* show selectable folder list when data exists */}
          {folders.length > 0 && (
            <FlatList
              data={folders}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => onSelectFolder(item.id)}
                  style={styles.folderButton}
                >
                  <Entypo name="folder-images" size={18} color={colors.textPrimary} />
                  <Text style={styles.folderText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {/* close modal without selecting any folder */}
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
