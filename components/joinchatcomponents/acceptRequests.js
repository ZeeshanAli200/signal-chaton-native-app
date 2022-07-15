import React, { useEffect } from "react";
import { Button, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
const RequestReceivedItem = ({ id, chat,JoinChat }) => {
  console.log("goToChat",chat);
  return (
    <ListItem>
      <Avatar
        rounded
        icon={{ name: "user", type: "font-awesome" }}
        containerStyle={{ backgroundColor: "#2C6BED" }}
      />
      <ListItem.Content>
        <ListItem.Title>{chat?.chatName}</ListItem.Title>
        <ListItem.Subtitle>{chat?.recent}</ListItem.Subtitle>
      </ListItem.Content>
      <Button onPress={()=>JoinChat(id,chat)}title="Accept"/>
    </ListItem>

  );
};

export default RequestReceivedItem;
const styles = StyleSheet.create({
    container: {
      height: "100%",
    },
  });
  