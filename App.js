import "react-native-gesture-handler";
import "react-native-reanimated";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/home";
import Login from "./screens/login";
import Register from "./screens/register";

import AddChat from "./screens/AddChat";
import ChatScreen from "./screens/ChatScreen";
import JoinChat from "./screens/JoinChat";
import RequestOnChat from "./screens/reqestOnChat";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerHome from "./screens/DrawerHomeNavigations/drawer-home";
import { Provider } from "react-redux";
import store from "./redux/store/store";

export default function App() {
  const Stack = createNativeStackNavigator();

  const globalScreen = {
    headerStyle: { backgroundColor: "#2C6BED" },
    headerTitleStyle: { color: "white" },
    headerTitleAlign: "center",
  };
  const Drawer = createDrawerNavigator();

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={globalScreen}>
          <Stack.Screen name="Login" component={Login} />

          <Stack.Screen
            name="DrawerHome"
            component={DrawerHome}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Register" component={Register} />
          {/* <Stack.Screen name="AddChat" component={AddChat} /> */}
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          {/* <Stack.Screen name="JoinChat" component={JoinChat} /> */}
          <Stack.Screen name="Requests" component={RequestOnChat} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
