import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, Icon, Input } from "react-native-elements";
import { db, addDoc, setDoc, collection, auth } from "../firebase";

const AddChat = ({ navigation }) => {
  const [chatName, setchatName] = useState("");
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a New Chat",
      headerRight:()=>(
        <TouchableOpacity onPress={()=>navigation.navigate('JoinChat')}>
          <Icon name="adduser" color={'white'} type="antdesign" />
        </TouchableOpacity>
          
      ),
      headerTintColor: "#fff",
      
    });
  }, []);
  const handleAddChat = async () => {
    if (chatName) {
      try {
        const chatRef = collection(db, "chats");
        const addChat = await addDoc(chatRef, {
          chatName: chatName,
          recent: "",
          userRequests:[],
          acceptedRequests:[],
          createdBy:auth.currentUser.uid
        });
        if (addChat) {
          navigation.goBack();
        }
      } catch (error) {}
    }
  };
  return (
    <View>
      <Input
        onChangeText={(val) => setchatName(val)}
        leftIcon={<Icon name="wechat" type="antdesign" />}
        placeholder="Enter a Chat Name"
      />
      <Button onPress={handleAddChat} title={"Create New Chat"} />
    </View>
  );
};

export default AddChat;
const styles = StyleSheet.create({});
