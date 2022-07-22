import { async } from "@firebase/util";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
} from "react-native";
import { View } from "react-native";
import {
  Avatar,
  Button,
  Icon,
  ListItem,
  Tab,
  TabView,
} from "react-native-elements";
import AcceptedListChatItem from "../components/joinchatcomponents/acceptedListChat";
import RequestedListChatItem from "../components/joinchatcomponents/requestedListChat";
import UserListChatItem from "../components/joinchatcomponents/userlistchat";
import UserListItem from "../components/userListItem";
import {
  collection,
  onSnapshot,
  db,
  auth,
  doc,
  updateDoc,
  query,
  where,
} from "../firebase";
import DrawerHome from "./DrawerHomeNavigations/drawer-home";
import Home from "./home";

const JoinChat = ({ navigation }) => {
  const Tab = createMaterialBottomTabNavigator();
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator initialRouteName="Join Chats">
      <Drawer.Screen name="Home" component={DrawerHome} options={{headerShown:false}} />
      <Drawer.Screen name="Join Chats" component={JoinChats} />
      <Drawer.Screen name="Requested" component={Requested} />
      <Drawer.Screen name="Accepted" component={Accepted}  />
    </Drawer.Navigator>
    // <Tab.Navigator>
    //   <Tab.Screen
    //     name="Join Chats"
    //     component={JoinChats}
    //     options={{
    //       tabBarIcon: () => (
    //         <Icon name="wechat" type="antdesign" color={"#fff"} />
    //       ),
    //     }}
    //   />

    //   <Tab.Screen
    //     name="Requested"
    //     options={{
    //       tabBarIcon: () => (
    //         <Icon name="adduser" type="antdesign" color={"#fff"} />
    //       ),
    //     }}
    //     component={Requested}
    //   />
    //    <Tab.Screen
    //     name="Accepted"
    //     options={{
    //       tabBarIcon: () => (
    //         <Icon name="adduser" type="antdesign" color={"#fff"} />
    //       ),
    //     }}
    //     component={Accepted}
    //   />
    // </Tab.Navigator>
  );
};

export const JoinChats = ({ navigation }) => {
  const [allchats, setallchats] = useState({ isloading: true, allchat: [] });

  useEffect(() => {
    const ref = collection(db, "chats");
    const queryChats = query(
      ref,
      where("createdBy", "!=", auth?.currentUser?.uid)
    );
    const unsubscribe = onSnapshot(queryChats, (querySnapshot) => {
      return setallchats({
        isloading: false,
        allchat: querySnapshot?.docs
          ?.map((doc) => {
            return { id: doc.id, chat: doc.data() };
          })
          ?.filter(
            ({ chat }) =>
              !chat?.userRequests.find((id) => id === auth.currentUser.uid) &&
              !chat?.acceptedRequests.find((id) => id === auth.currentUser.uid)
          ),
      });
    });
    return unsubscribe;
  }, []);
  const JoinChat = async (id, chat) => {
    const reqRef = doc(db, `chats/${id}`);
    const updReqField = await updateDoc(reqRef, {
      userRequests: [...chat?.userRequests, auth.currentUser.uid],
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
          {allchats?.allchat?.map(({ id, chat }) => (
            <UserListChatItem id={id} chat={chat} JoinChat={JoinChat} />
          ))}
        </View>
      )}
    </View>
  );
};

export const Requested = ({ navigation }) => {
  const [reqchats, setreqchats] = useState({ isloading: true, reqchat: [] });

  useEffect(() => {
    const ref = collection(db, "chats");
    const queryChats = query(
      ref,
      where("createdBy", "!=", auth?.currentUser?.uid)
    );
    const unsubscribe = onSnapshot(queryChats, (querySnapshot) => {
      return setreqchats({
        isloading: false,
        reqchat: querySnapshot?.docs
          ?.map((doc) => {
            return { id: doc.id, chat: doc.data() };
          })
          ?.filter(({ chat }) =>
            chat?.userRequests.find((id) => id === auth.currentUser.uid)
          ),
      });
    });
    return unsubscribe;
  }, []);

  const CancelJoin = async (id, chat) => {
    const reqRef = doc(db, `chats/${id}`);
    let cloneReqArr = [...chat?.userRequests];
    let indexReq = cloneReqArr.indexOf(auth.currentUser.uid);
    cloneReqArr.splice(indexReq, 1);
    const updReqField = await updateDoc(reqRef, {
      userRequests: [...cloneReqArr],
    });
  };
  return (
    <View style={{ flex: 1 }}>
      {reqchats?.isloading ? (
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
          {reqchats?.reqchat?.map(({ id, chat }) => (
            <RequestedListChatItem
              id={id}
              chat={chat}
              CancelJoin={CancelJoin}
            />
          ))}
        </View>
      )}
    </View>
  );
};
export const Accepted = ({ navigation }) => {
  const [acceptedChats, setacceptedChats] = useState({
    isloading: true,
    acceptedChat: [],
  });

  useEffect(() => {
    const ref = collection(db, "chats");
    const queryChats = query(
      ref,
      where("createdBy", "!=", auth?.currentUser?.uid)
    );
    const unsubscribe = onSnapshot(queryChats, (querySnapshot) => {
      return setacceptedChats({
        isloading: false,
        acceptedChat: querySnapshot?.docs
          ?.map((doc) => {
            return { id: doc.id, chat: doc.data() };
          })
          ?.filter(({ chat }) =>
            chat?.acceptedRequests.find((id) => id === auth.currentUser.uid)
          ),
      });
    });
    return unsubscribe;
  }, []);
  return (
    <View>
      {acceptedChats?.isloading ? (
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
          {acceptedChats?.acceptedChat?.map(({ id, chat }) => (
            <AcceptedListChatItem id={id} chat={chat} />
          ))}
        </View>
      )}
    </View>
  );
};
export default JoinChat;
const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
