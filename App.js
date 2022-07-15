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

export default function App() {
  const Stack = createNativeStackNavigator();
  const globalScreen = {
    headerStyle: { backgroundColor: "#2C6BED" },
    headerTitleStyle: { color: "white" },
    headerTitleAlign: "center",
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreen}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="AddChat" component={AddChat} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="JoinChat" component={JoinChat} />
        <Stack.Screen name="Requests" component={RequestOnChat} />
      </Stack.Navigator>
    </NavigationContainer>
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
