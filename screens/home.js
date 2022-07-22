import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView, ScrollView } from "react-native";
import UserListItem from "../components/userListItem";
import { Avatar, Button, Icon, Input, ListItem } from "react-native-elements";
// import { ListItem } from "@rneui/themed";

import {
  auth,
  db,
  signOut,
  collection,
  onSnapshot,
  query,
  where,
} from "../firebase";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AddChat from "./AddChat";
import { useDispatch, useSelector } from "react-redux";
import { getMyChats } from "../redux/reducers/mychats";
const Home = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      title: "Home",
      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "black" },

      headerRight: () => (
        <View style={{ paddingHorizontal: 10 }}>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={{ fontWeight: "bold" }}>Log Out</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  const handleLogout = async () => {
    signOut(auth)
      .then((res) => navigation.replace("Login"))
      .catch((err) => console.log("err", err));
  };

  const Tab = createMaterialBottomTabNavigator();

  return (
    <>
      <Tab.Navigator>
        <Tab.Screen
          name="MyChat"
          component={MyChat}
          options={{
            tabBarIcon: () => (
              <Icon name="wechat" type="antdesign" color={"#fff"} />
            ),
          }}
        />
        <Tab.Screen
          name="JoinedChat"
          options={{
            tabBarIcon: () => (
              <Icon name="adduser" type="antdesign" color={"#fff"} />
            ),
          }}
          component={JoinedChat}
        />
      </Tab.Navigator>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
export const MyChat = ({ navigation }) => {
  const [search, setsearch] = useState("");
  const chats = useSelector((state) => state);
  console.log("chats", chats);
  const dispatch = useDispatch();

  const [allchats, setallchats] = useState({ isloading: true, allchat: [] });
  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "black" },

      headerLeft: () => (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: 80,
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity>
            <Avatar
              rounded
              icon={{ name: "user", type: "font-awesome" }}
              containerStyle={{ backgroundColor: "#2C6BED" }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAddChat}>
            <Avatar
              rounded
              icon={{ name: "pencil", type: "font-awesome" }}
              containerStyle={{ backgroundColor: "#2C6BED" }}
            />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={{ fontWeight: "bold" }}>Log Out</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);
  useEffect(() => {
    const ref = collection(db, "chats");
    const queryChats = query(
      ref,
      where("createdBy", "==", auth?.currentUser?.uid)
    );

    const unsubscribe = onSnapshot(queryChats, (querySnapshot) =>
      setallchats({
        isloading: false,
        allchat: querySnapshot?.docs?.map((doc) => {
          return { id: doc.id, chat: doc.data() };
        }),
      })
    );
    return unsubscribe;
  }, []);
  const handleAddChat = () => {
    navigation.navigate("AddChat");
  };
  const handleLogout = async () => {
    signOut(auth)
      .then((res) => navigation.replace("Login"))
      .catch((err) => console.log("err", err));
  };
  const goToChat = (id, chatname) => {
    navigation.navigate("ChatScreen", {
      id,
      chatname,
    });
  };
  const Drawer = createDrawerNavigator();

  return (
    <View style={{ flex: 1 }}>
      {allchats?.isloading ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator color={"#2C6BED"} size="large" />
        </View>
      ) : (
        <View>
          <Input
            value={search}
            leftIcon={{
              type: "font-awesome",
              name: "search",
              color: "#2C6BED",
            }}
            onChangeText={(val) => setsearch(val)}
            placeholder="Search Chat Rooms"
          />
          <ScrollView style={styles.container}>
            {allchats?.allchat
              ?.filter(({ chat }) =>
                !search ? chat : search && chat?.chatName?.includes(search)
              )
              ?.map(({ id, chat }) => (
                <UserListItem
                  key={id}
                  id={id}
                  chat={chat}
                  goToChat={goToChat}
                />
              ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};
export const JoinedChat = ({ navigation }) => {
  const [search, setsearch] = useState("");
  const [allchats, setallchats] = useState({ isloading: true, allchat: [] });
  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "black" },
      headerLeft: () => (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: 80,
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity>
            <Avatar
              rounded
              icon={{ name: "user", type: "font-awesome" }}
              containerStyle={{ backgroundColor: "#2C6BED" }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAddChat}>
            <Avatar
              rounded
              icon={{ name: "pencil", type: "font-awesome" }}
              containerStyle={{ backgroundColor: "#2C6BED" }}
            />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={{ fontWeight: "bold" }}>Log Out</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);
  useEffect(() => {
    const ref = collection(db, "chats");
    const queryChats = query(
      ref,
      where("acceptedRequests", "array-contains", auth?.currentUser?.uid)
    );

    const unsubscribe = onSnapshot(queryChats, (querySnapshot) =>
      setallchats({
        isloading: false,
        allchat: querySnapshot?.docs?.map((doc) => {
          return { id: doc.id, chat: doc.data() };
        }),
      })
    );
    return unsubscribe;
  }, []);
  const handleAddChat = () => {
    navigation.navigate("AddChat");
  };
  const handleLogout = async () => {
    signOut(auth)
      .then((res) => navigation.replace("Login"))
      .catch((err) => console.log("err", err));
  };
  const goToChat = (id, chatname) => {
    navigation.navigate("ChatScreen", {
      id,
      chatname,
    });
  };
  return (
    <View style={{ flex: 1 }}>
      {allchats?.isloading ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator color={"#2C6BED"} size="large" />
        </View>
      ) : (
        <View>
          <Input
            value={search}
            leftIcon={{
              type: "font-awesome",
              name: "search",
              color: "#2C6BED",
            }}
            onChangeText={(val) => setsearch(val)}
            placeholder="Search Chat Rooms"
          />
          <ScrollView style={styles.container}>
            {allchats?.allchat
              ?.filter(({ chat }) =>
                !search ? chat : search && chat?.chatName?.includes(search)
              )
              ?.map(({ id, chat }) => (
                <UserListItem
                  key={id}
                  id={id}
                  chat={chat}
                  goToChat={goToChat}
                />
              ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};
