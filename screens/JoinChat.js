import { async } from "@firebase/util";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
} from "react-native";
import { View } from "react-native";
import { Avatar, Button, ListItem, Tab } from "react-native-elements";
import UserListItem from "../components/userListItem";
import { collection, onSnapshot, db, auth, doc, updateDoc,query,where } from "../firebase";

const JoinChat = ({ navigation }) => {
  const [allchats, setallchats] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Join Chat",
      headerTintColor: "#fff",
    });
  }, []);
  const getunReqChats=()=>{

  }
  useEffect(() => {
    const ref = collection(db, "chats");
    const queryChats= query(ref,where('createdBy', '!=', auth?.currentUser?.uid))
    const unsubscribe = onSnapshot(queryChats, (querySnapshot) =>
      setallchats(
        querySnapshot?.docs
          ?.map((doc) => {
            return { id: doc.id, chat: doc.data() };
          })
          ?.filter(
            ({ chat }) =>
              !chat?.userRequests.find((id) => id === auth.currentUser.uid)
          )
      )
    );
    return unsubscribe;
  }, []);
  const JoinChat = async (id, chat) => {
    console.log("chat", id, chat);
    const reqRef = doc(db, `chats/${id}`);
    const updReqField = await updateDoc(reqRef, {
      userRequests: [
        ...chat?.userRequests,
         auth.currentUser.uid,
      ],
    });
  };
  return (
    // <SafeAreaView>
    //   <ScrollView style={styles.container}>
    //     {allchats?.map(({ id, chat }) => (
    //       <ListItem.Swipeable
    //         leftContent={
    //           <Button
    //             title="Info"
    //             onPress={() => reset()}
    //             icon={{ name: "info", color: "white" }}
    //             buttonStyle={{ minHeight: "100%" }}
    //           />
    //         }
    //         rightContent={
    //           <Button
    //             title="Join Chat"
    //             onPress={() => JoinChat(id, chat)}
    //             icon={{ name: "adduser", color: "white", type: "antdesign" }}
    //             buttonStyle={{ minHeight: "100%" }}
    //           />
    //         }
    //       >
    //         {/* <Icon name="My Icon" /> */}
    //         <Avatar
    //           rounded
    //           icon={{ name: "user", type: "font-awesome" }}
    //           containerStyle={{ backgroundColor: "#2C6BED" }}
    //         />
    //         <ListItem.Content>
    //           <ListItem.Title>{chat?.chatName}</ListItem.Title>
    //         </ListItem.Content>
    //         <ListItem.Chevron />
    //       </ListItem.Swipeable>
    //     ))}
    //   </ScrollView>
    // </SafeAreaView>
    <Tab
    // value={index}
    // onChange={(e) => setIndex(e)}
    
    indicatorStyle={{
      
      backgroundColor: 'white',
      height: 3
    }}
    
    variant="primary"
  >
    <Tab.Item containerStyle={{backgroundColor:'#2C6BED'}}
      title="Recent"
      titleStyle={{ fontSize: 12 }}
      icon={{ name: 'timer', type: 'ionicon', color: 'white' }}
    />
    <Tab.Item containerStyle={{backgroundColor:'#2C6BED'}}
      title="favorite"
      titleStyle={{ fontSize: 12 }}
      icon={{ name: 'heart', type: 'ionicon', color: 'white' }}
    />
    <Tab.Item containerStyle={{backgroundColor:'#2C6BED'}}
      title="cart"
      titleStyle={{ fontSize: 12 }}
      icon={{ name: 'cart', type: 'ionicon', color: 'white' }}
    />
  </Tab>
  );
};

export default JoinChat;
const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
