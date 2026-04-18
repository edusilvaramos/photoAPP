import { FlatList, View, TouchableOpacity } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageItem from "../components/ImageItem";
import { Directory, Paths } from "expo-file-system";
import Entypo from "@expo/vector-icons/Entypo";
import { selectImages, setFolders, setImages } from "../store/imageSlice";
import { STORAGE_KEYS } from "../store/storageKeys";
import { imageStyles as styles, colors } from "../assets/style/styles";

export default function ImageList({ navigation, route }) {
  // keeps image data ready for flatlist rendering
  const [data, setData] = useState([]);
  // folder params are present only when opening gallery from a folder
  const folderId = route?.params?.folderId;
  const folderName = route?.params?.folderName;
  const images = useSelector(selectImages);
  const dispatch = useDispatch();

  // reload visible photos when target folder changes
  useEffect(() => {
    loadPhotos();
  }, [folderId]);

  // refresh redux and storage data every time this screen gets focus
  useFocusEffect(
    useCallback(() => {
      // async allows await so focus refresh runs in sequence
      const refresh = async () => {
        console.log("gallery screen");
        await loadStorageState();
      };

      refresh();

      return () => {};
    }, [folderId])
  );

  // update header title
  useEffect(() => {
    if (folderName) {
      navigation.setOptions({ title: folderName });
    }
  }, [folderName]);

  const loadPhotos = async (imagesState = images) => {
    try {
      // reads image files from local gallery folder and applies optional folder filter
      const photosDir = new Directory(Paths.document, "gallery_photos");

      if (!photosDir.exists) {
        console.log("Pasta gallery_photos não existe ainda");
        return;
      }

      const files = photosDir.list();
      let photos = files
        .filter((file) => file.name?.endsWith(".jpg"))
        .map((file) => ({
          id: file.uri,
          thumbnail: file.uri,
        }));

      if (folderId) {
        // only keep image uris assigned to the selected folder
        const allowedUris = new Set(imagesState
          .filter((image) => image.folderId === folderId)
          .map((image) => image.uri));

        photos = photos.filter((photo) => allowedUris.has(photo.thumbnail));
      }

      console.log(`total images: ${photos.length}`);

      setData(photos);
    } catch (error) {
      console.error("Erro ao carregar fotos:", error);
    }
  };

  // loads folders and image-folder map from storage and syncs redux state
  const loadStorageState = async () => {
    try {
      // promise.all reads both keys at the same time then waits for both !
      const [storedFolders, storedMap] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.folders),
        AsyncStorage.getItem(STORAGE_KEYS.imageFolders),
      ]);

      const parsedFolders = storedFolders ? JSON.parse(storedFolders) : [];
      const validFolderIds = new Set(parsedFolders.map((folder) => folder.id));
      dispatch(setFolders(parsedFolders));
      console.log(`total folders: ${parsedFolders.length}`);

      const parsedMap = storedMap ? JSON.parse(storedMap) : {};      
      // drop relations that point to folders that no longer exist
      const cleanedMap = Object.fromEntries(
        Object.entries(parsedMap).filter(([, assignedFolderId]) => validFolderIds.has(assignedFolderId))
      );

      if (Object.keys(cleanedMap).length !== Object.keys(parsedMap).length) {
        console.log('Cleaning orphan relations. Before:', Object.keys(parsedMap).length, 'After:', Object.keys(cleanedMap).length);
        // await ensures cleaned relations are persisted before mapping to redux
        await AsyncStorage.setItem(STORAGE_KEYS.imageFolders, JSON.stringify(cleanedMap));
      }

      // convert storage map object into redux array format
      const mapped = Object.entries(cleanedMap).map(([uri, assignedFolderId]) => ({
        uri,
        folderId: assignedFolderId,
      }));
      dispatch(setImages(mapped));
      // await ensures load order so list uses the latest mapping
      await loadPhotos(mapped);
    } catch (error) {
      console.error("error loading storage state:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.listImages}
        contentContainerStyle={styles.listContent}
        numColumns={6}
        renderItem={({ item }) => (
          <ImageItem
            thumbnail={item.thumbnail}
            navigation={navigation}
            folderId={folderId}
            folderName={folderName}
          />
        )}
        data={data}
        keyExtractor={(item) => item.id}
      />
      {!folderId && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("FolderList");
          }}
          style={styles.folderListIcon}
        >
          <Entypo
            name="folder-images"
            size={24}
            color={colors.black}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
