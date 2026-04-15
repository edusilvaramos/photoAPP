import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Provider } from "react-redux"
import store from "./store/store"
// import camera from './components/Camera'
import ImageList from "./screens/ImageList"
import FolderList from "./screens/FolderList"
import CameraScreen from "./screens/CameraScreen"
import BigPicture from "./components/BigPicture"


export default function App() {
  
  const Tab = createNativeStackNavigator()

  return (
   <Provider store={store}>
     <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Camera" component={CameraScreen}/>
        <Tab.Screen name="Gallery" component={ImageList} />
        <Tab.Screen name="FolderList" component={FolderList} /> 
        <Tab.Screen name="BigPicture" component={BigPicture} />
      </Tab.Navigator>
     </NavigationContainer>
   </Provider>
  );
}
