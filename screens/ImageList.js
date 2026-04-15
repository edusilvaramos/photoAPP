import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageItem from "../components/ImageItem";
import { Directory, Paths } from "expo-file-system";
import Entypo from "@expo/vector-icons/Entypo";
import { selectImages, setFolders, setImages } from "../components/ImageSlice";

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
    loadFoldersFromStorage();
    loadImagesFromStorage();
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
        const allowedUris = images
          .filter((image) => image.folderId === folderId)
          .map((image) => image.uri);

        photos = photos.filter((photo) => allowedUris.includes(photo.thumbnail));
      }

      setData(photos);
    } catch (error) {
      console.error("Erro ao carregar fotos:", error);
    }
  };

  const loadFoldersFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem("@folders");
      if (stored) {
        dispatch(setFolders(JSON.parse(stored)));
      }
    } catch (error) {
      console.error("Error loading folders:", error);
    }
  };

  const loadImagesFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem("@imageFolders");
      if (stored) {
        const parsed = JSON.parse(stored);
        const mapped = Object.entries(parsed).map(([uri, folderId]) => ({
          uri,
          folderId,
        }));
        dispatch(setImages(mapped));
      }
    } catch (error) {
      console.error("Error loading image-folder map:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
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
        style={styles.icon_folderList}
      >
        <Entypo
          name={folderId ? "images" : "folder-images"}
          size={24}
          color="black"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  listImages: {
    backgroundColor: "#000000",
  },
  listContent: {
    alignItems: "center",
  },
  icon_folderList: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
    position: "absolute",
    bottom: 40,
    right: 20,
  },
});
