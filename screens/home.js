import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView, ScrollView } from "react-native";
import UserListItem from "../components/userListItem";
import {
  Avatar,
  Button,
  Icon,
  Input,
  ListItem,
  Tab,
  TabView,
} from "react-native-elements";
// import { ListItem } from "@rneui/themed";

import { auth, db, signOut, collection, onSnapshot } from "../firebase";
const Home = ({ navigation }) => {
  const [search, setsearch] = useState("");
  const [allchats, setallchats] = useState({ isloading: true, allchat: [] });
  const [index, setIndex] = useState(0);
  useEffect(() => {
    navigation.setOptions({
      title: "Signal",
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
    // const queryChats= query(ref,where('createdBy', '=', auth?.currentUser?.uid))

    const unsubscribe = onSnapshot(ref, (querySnapshot) =>
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
  console.log("displayName", auth.currentUser);
  return (
    <View style={{ flex: 1, justifyContent: "flex-end" }}>
      <TabView value={index} onChange={setIndex} animationType="spring">
        <TabView.Item style={{ width: "100%" }}>
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
                    !search && chat?.createdBy === auth?.currentUser?.uid
                      ? chat?.createdBy === auth?.currentUser?.uid
                      : search &&
                        chat?.createdBy === auth?.currentUser?.uid &&
                        chat?.chatName?.includes(search) &&
                        chat?.createdBy === auth?.currentUser?.uid
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
        </TabView.Item>
        <TabView.Item style={{ width: "100%" }}>
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
                    !search
                      ? chat?.acceptedRequests?.find(
                          (id) => id === auth.currentUser.uid
                        )
                      : search &&
                        chat?.acceptedRequests?.find(
                          (id) => id === auth.currentUser.uid
                        ) &&
                        chat?.chatName.includes(search)
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
        </TabView.Item>
      </TabView>
      <Tab
        value={index}
        onChange={(e) => setIndex(e)}
        indicatorStyle={{
          backgroundColor: "#2C6BED",
          height: 3,
        }}
        variant="primary"
      >
        <Tab.Item
          containerStyle={{ backgroundColor: "#fff" }}
          title="My Chats"
          titleStyle={{ fontSize: 12, color: "#2C6BED" }}
          icon={{ name: "timer", type: "ionicon", color: "#2C6BED" }}
        />
        <Tab.Item
          containerStyle={{ backgroundColor: "#fff" }}
          title="Joined Chats"
          titleStyle={{ fontSize: 12, color: "#2C6BED" }}
          icon={{ name: "heart", type: "ionicon", color: "#2C6BED" }}
        />
      </Tab>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
