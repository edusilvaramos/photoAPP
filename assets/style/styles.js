import { StyleSheet } from "react-native";

export const colors = {
  background: "#000",
  white: "#fff",
  textPrimary: "#fff",
  textSecondary: "#999",
  surface: "#1a1a1a",
  buttonPrimary: "#e2e7ec",
  overlayLight: "rgba(255,255,255,0.5)",
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
    backgroundColor: colors.buttonPrimary,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
});

export const imageStyles = StyleSheet.create({
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
