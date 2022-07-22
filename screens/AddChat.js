import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, Icon, Input } from "react-native-elements";
import { useDispatch } from "react-redux";
import { db, addDoc, setDoc, collection, auth ,doc,updateDoc} from "../firebase";
import { addNewChats } from "../redux/reducers/mychats";

const AddChat = ({ navigation }) => {
  const [chatName, setchatName] = useState("");
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a New Chat",
    });
  }, []);
  const dispatch=useDispatch()
  const handleAddChat = () => {
    if (chatName) {
        dispatch(addNewChats(navigation,chatName))
    }
  };
  return (
    <View style={styles.addChatWrapper}>
      <View style={styles.addChatInnerWrapper}>
      <Input
        onChangeText={(val) => setchatName(val)}
        leftIcon={<Icon name="wechat" type="antdesign" />}
        placeholder="Enter a Chat Name"
      />
      <Button onPress={handleAddChat} title={"Create New Chat"} />
      </View>
    </View>
  );
};

export default AddChat;
const styles = StyleSheet.create({
  addChatWrapper:{
    flex:1,
    justifyContent:"center",
    alignItems:'center',
   
  },
  addChatInnerWrapper:{
    width:"70%"
  }
});
