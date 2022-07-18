import { async } from "@firebase/util";
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
import { Avatar, Button, ListItem, Tab, TabView } from "react-native-elements";
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

const JoinChat = ({ navigation }) => {
  const [allchats, setallchats] = useState({ isloading: true, allchat: [] });
  const [reqchats, setreqchats] = useState({ isloading: true, reqchat: [] });
  const [acceptedChats, setacceptedChats] = useState({
    isloading: true,
    acceptedChat: [],
  });
  const [index, setIndex] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Join Chat",
      headerTintColor: "#fff",
    });
  }, []);
  useEffect(() => {
    const ref = collection(db, "chats");
    const queryChats = query(
      ref,
      where("createdBy", "!=", auth?.currentUser?.uid)
    );
    const unsubscribe = onSnapshot(queryChats, (querySnapshot) => {
      if (index === 0) {
        return setallchats({
          isloading: false,
          allchats: querySnapshot?.docs
            ?.map((doc) => {
              return { id: doc.id, chat: doc.data() };
            })
            ?.filter(
              ({ chat }) =>
                !chat?.userRequests.find((id) => id === auth.currentUser.uid) &&
                !chat?.acceptedRequests.find(
                  (id) => id === auth.currentUser.uid
                )
            ),
        });
      } else if (index === 1) {
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
      } else if (index === 2) {
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
      }
    });
    return unsubscribe;
  }, [index]);
  const JoinChat = async (id, chat) => {
    const reqRef = doc(db, `chats/${id}`);
    const updReqField = await updateDoc(reqRef, {
      userRequests: [...chat?.userRequests, auth.currentUser.uid],
    });
  };
  const CancelJoin = async (id, chat) => {
    const reqRef = doc(db, `chats/${id}`);
    let cloneReqArr = [...chat?.userRequests];
    let indexReq = cloneReqArr.indexOf(auth.currentUser.uid);
    cloneReqArr.splice(indexReq, 1);
    const updReqField = await updateDoc(reqRef, {
      userRequests: [...cloneReqArr],
    });
  };

  console.log("allchats", acceptedChats);
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
              {allchats?.allchat?.map(({ id, chat }) => (
                <UserListChatItem id={id} chat={chat} JoinChat={JoinChat} />
              ))}
            </View>
          )}
        </TabView.Item>
        <TabView.Item style={{ width: "100%" }}>
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
              {reqchats?.reqchat?.map(({ id, chat }) => (
                <RequestedListChatItem
                  id={id}
                  chat={chat}
                  CancelJoin={CancelJoin}
                />
              ))}
            </View>
          )}
        </TabView.Item>
        <TabView.Item style={{ width: "100%" }}>
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
          title="Join Chats"
          titleStyle={{ fontSize: 12, color: "#2C6BED" }}
          icon={{ name: "timer", type: "ionicon", color: "#2C6BED" }}
        />
        <Tab.Item
          containerStyle={{ backgroundColor: "#fff" }}
          title="Requested"
          titleStyle={{ fontSize: 12, color: "#2C6BED" }}
          icon={{ name: "heart", type: "ionicon", color: "#2C6BED" }}
        />
        <Tab.Item
          containerStyle={{ backgroundColor: "#fff" }}
          title="Accepted"
          titleStyle={{ fontSize: 12, color: "#2C6BED" }}
          icon={{ name: "cart", type: "ionicon", color: "#2C6BED" }}
        />
      </Tab>
    </View>
  );
};

export default JoinChat;
const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
