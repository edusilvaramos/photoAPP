import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Provider } from "react-redux"
import { TouchableOpacity } from "react-native"
import Entypo from "@expo/vector-icons/Entypo"
import store from "./store/store"
import ImageList from "./screens/ImageList"
import FolderList from "./screens/FolderList"
import CameraScreen from "./screens/CameraScreen"
import BigPicture from "./components/BigPicture"

const Tab = createNativeStackNavigator()

// navigate to the camera screen
function goToCamera(navigation) {
  navigation.navigate("Camera")
}

// go back to the previous screen if there is one, otherwise go to camera !!
function goBackOrCamera(navigation) {
  if (navigation.canGoBack()) {
    navigation.goBack()
    return
  }

  goToCamera(navigation)
}


function renderBackButton(navigation) {
  return (
    <TouchableOpacity onPress={() => goBackOrCamera(navigation)} style={{ paddingHorizontal: 8 }}>
      <Entypo name="chevron-left" size={24} color="black" />
    </TouchableOpacity>
  )
}

// button opens camera from any screen
function renderCameraButton(navigation) {
  return (
    <TouchableOpacity onPress={() => goToCamera(navigation)} style={{ paddingHorizontal: 8 }}>
      <Entypo name="camera" size={22} color="black" />
    </TouchableOpacity>
  )
}

function screenOptions({ navigation, route }) {
  //hides default back button and adds my header buttons
  const isCameraScreen = route?.name === "Camera"

  return {
    headerBackVisible: false,
    headerLeft: () => (isCameraScreen ? null : renderBackButton(navigation)),
    headerRight: () => (isCameraScreen ? null : renderCameraButton(navigation)),
  }
}


export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator screenOptions={screenOptions}>
          <Tab.Screen name="Camera" component={CameraScreen}/>
          <Tab.Screen name="Gallery" component={ImageList} />
          <Tab.Screen name="FolderList" component={FolderList} /> 
          <Tab.Screen name="BigPicture" component={BigPicture} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
