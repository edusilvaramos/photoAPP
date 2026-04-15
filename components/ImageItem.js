import { Image, TouchableOpacity } from "react-native";
import { imageItemStyles as styles } from "../assets/style/styles";

export default function imageItem(props) {
  return (
    <TouchableOpacity
      onPress={() =>
        props.navigation.navigate("BigPicture", { thumbnail: props.thumbnail })}
      style={styles.image}
    >
      <Image source={{ uri: props.thumbnail }} style={styles.thumbnail} />
    </TouchableOpacity>
  );
}
