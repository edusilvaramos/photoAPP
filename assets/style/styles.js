import { StyleSheet } from "react-native";

export const colors = {
  background: "#000",
  white: "#fff",
  black: "#000",
  textPrimary: "#fff",
  textSecondary: "#999",
  success: "green",
  danger: "red",
  surface: "#1a1a1a",
  surfaceAlt: "#333",
  buttonPrimary: "#e2e7ec",
  overlayLight: "rgba(255,255,255,0.5)",
  overlayDark: "rgba(0,0,0,0.7)",
  overlayDarkStrong: "rgba(0,0,0,0.8)",
  dangerOverlay: "rgba(255,0,0,0.7)",
  borderMuted: "#555",
};

export const cameraStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  camera: { flex: 1 },
  controls: { position: "absolute", bottom: 40, alignSelf: "center" },
  shutter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.white,
    borderWidth: 6,
    borderColor: colors.overlayLight,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionText: {
    marginBottom: 12,
    color: colors.textPrimary,
  },
  previewBox: { position: "absolute", bottom: 30, left: 20 },
  previewBoxRight: { position: "absolute", bottom: 30, right: 20 },
  preview: { width: 60, height: 60, borderRadius: 8 },
  galleryPhotos: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  // Legacy alias to avoid breaking screens that still use snake_case.
  gallery_photos: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
});

export const folderStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 10,
  },
  folderItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
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
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
  },
  folderDate: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 5,
  },
  deleteBtn: {
    padding: 10,
  },
  emptyText: {
    color: colors.textSecondary,
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
    backgroundColor: colors.buttonPrimary,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
});

export const imageStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listImages: {
    backgroundColor: colors.background,
  },
  listContent: {
    alignItems: "center",
  },
  folderListIcon: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
    position: "absolute",
    bottom: 40,
    right: 20,
  },
  // Legacy alias to avoid breaking screens that still use snake_case.
  icon_folderList: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
    position: "absolute",
    bottom: 40,
    right: 20,
  },
});

export const bigPictureStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
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
    backgroundColor: colors.overlayDark,
    borderRadius: 18,
    padding: 10,
  },
  removeButton: {
    position: "absolute",
    right: 20,
    bottom: 40,
    backgroundColor: colors.dangerOverlay,
    borderRadius: 18,
    padding: 10,
  },
  deleteButton: {
    position: "absolute",
    left: 20,
    bottom: 40,
    backgroundColor: colors.dangerOverlay,
    borderRadius: 18,
    padding: 10,
  },
});

export const addToFolderModalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.overlayDark,
  },
  modalContent: {
    width: "80%",
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  folderButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.surfaceAlt,
    marginBottom: 8,
  },
  folderText: {
    color: colors.textPrimary,
    marginLeft: 8,
  },
  emptyText: {
    color: colors.textSecondary,
    marginBottom: 12,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    alignItems: "center",
  },
  closeText: {
    color: colors.textPrimary,
  },
});

export const createFolderModalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.overlayDarkStrong,
  },
  modalContent: {
    width: "80%",
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderMuted,
    color: colors.textPrimary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: colors.surfaceAlt,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export const imageItemStyles = StyleSheet.create({
  image: {
    flexDirection: "row",
    alignItems: "center",
    margin: 2,
  },
  thumbnail: {
    width: 60,
    height: 60,
  },
});

