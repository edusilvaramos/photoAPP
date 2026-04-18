import { Image, TouchableOpacity } from "react-native";
import { imageItemStyles as styles } from "../assets/style/styles";

export default function imageItem(props) {
  return (
    <TouchableOpacity
      // open full screen view and pass image and folder metadata
      onPress={() =>
        props.navigation.navigate("BigPicture", {
          thumbnail: props.thumbnail,
          folderId: props.folderId,
          folderName: props.folderName,
        })}
      style={styles.image}
    >
      {/* thumbnail uri comes from camera/gallery data */}
      <Image source={{ uri: props.thumbnail }} style={styles.thumbnail} />
    </TouchableOpacity>
  );
}
