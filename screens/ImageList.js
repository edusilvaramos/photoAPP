import { FlatList, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageItem from "../components/ImageItem";
import { Directory, Paths } from "expo-file-system";
import Entypo from "@expo/vector-icons/Entypo";
import { selectImages, setFolders, setImages } from "../store/imageSlice";
import { STORAGE_KEYS } from "../store/storageKeys";
import { imageStyles as styles, colors } from "../assets/style/styles";

export default function ImageList({ navigation, route }) {
  const [data, setData] = useState([]);
  const folderId = route?.params?.folderId;
  const folderName = route?.params?.folderName;
  const images = useSelector(selectImages);
  const dispatch = useDispatch();

  useEffect(() => {
    loadPhotos();
  }, [folderId, images]);

  useEffect(() => {
    loadStorageState();
  }, []);

  useEffect(() => {
    if (folderName) {
      navigation.setOptions({ title: folderName });
    }
  }, [folderName]);

  const loadPhotos = async () => {
    try {
      // Caso contrário, mostra todas as fotos da galeria
      const photosDir = new Directory(Paths.document, "gallery_photos");

      if (!photosDir.exists) {
        console.log("Pasta gallery_photos não existe ainda");
        return;
      }

      const files = await photosDir.list();
      let photos = files
        .filter((file) => file.name && file.name.endsWith(".jpg"))
        .map((file, index) => ({
          id: index.toString(),
          thumbnail: file.uri,
        }));

      if (folderId) {
        const allowedUris = new Set(images
          .filter((image) => image.folderId === folderId)
          .map((image) => image.uri));

        photos = photos.filter((photo) => allowedUris.has(photo.thumbnail));
      }

      setData(photos);
    } catch (error) {
      console.error("Erro ao carregar fotos:", error);
    }
  };

  const loadStorageState = async () => {
    try {
      const [storedFolders, storedMap] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.folders),
        AsyncStorage.getItem(STORAGE_KEYS.imageFolders),
      ]);

      const parsedFolders = storedFolders ? JSON.parse(storedFolders) : [];
      const validFolderIds = new Set(parsedFolders.map((folder) => folder.id));
      dispatch(setFolders(parsedFolders));

      const parsedMap = storedMap ? JSON.parse(storedMap) : {};
      const cleanedMap = Object.fromEntries(
        Object.entries(parsedMap).filter(([, assignedFolderId]) => validFolderIds.has(assignedFolderId))
      );

      if (Object.keys(cleanedMap).length !== Object.keys(parsedMap).length) {
        await AsyncStorage.setItem(STORAGE_KEYS.imageFolders, JSON.stringify(cleanedMap));
      }

      const mapped = Object.entries(cleanedMap).map(([uri, assignedFolderId]) => ({
        uri,
        folderId: assignedFolderId,
      }));
      dispatch(setImages(mapped));
    } catch (error) {
      console.error("Error loading storage state:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.listImages}
        contentContainerStyle={styles.listContent}
        numColumns={6}
        renderItem={({ item }) => (
          <ImageItem thumbnail={item.thumbnail} navigation={navigation} />
        )}
        data={data}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity
        onPress={() => {
          if (folderId) {
            navigation.navigate("Gallery");
          } else {
            navigation.navigate("FolderList");
          }
        }}
        style={styles.folderListIcon}
      >
        <Entypo
          name={folderId ? "images" : "folder-images"}
          size={24}
          color={colors.black}
        />
      </TouchableOpacity>
    </View>
  );
}
