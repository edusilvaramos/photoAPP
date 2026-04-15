import { Image, TouchableOpacity, StyleSheet } from "react-native";

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


const styles = StyleSheet.create({
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
