import React, { useEffect } from "react";
import { Button, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
const RequestedListChatItem = ({ id, chat,CancelJoin }) => {
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
      <Button onPress={()=>CancelJoin(id,chat)} title="Cancel Request"/>
    </ListItem>

  );
};

export default RequestedListChatItem;
const styles = StyleSheet.create({
    container: {
      height: "100%",
    },
  });
  