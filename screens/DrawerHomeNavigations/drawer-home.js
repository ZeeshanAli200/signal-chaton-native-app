import 'react-native-gesture-handler';
import { createDrawerNavigator } from "@react-navigation/drawer";
import AddChat from "../AddChat";
import Home from "../home";
import Profile from '../profile';
import JoinChat from '../JoinChat';

const DrawerHome = () => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator  >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="AddChat" component={AddChat} />
      <Drawer.Screen name="Join a Chat Room" component={JoinChat} options={{headerShown:false}} />

    </Drawer.Navigator>
  );
};
export default DrawerHome;
