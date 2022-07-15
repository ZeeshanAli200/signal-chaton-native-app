import React, { useEffect } from "react";
import { Text } from "react-native";
import { Button, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
const AcceptedListChatItem = ({ id, chat }) => {
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
      <Text>Accepted</Text>
      {/* <Button onPress={()=>CancelJoin(id,chat)} title="Cancel Request"/> */}
    </ListItem>

  );
};

export default AcceptedListChatItem;
const styles = StyleSheet.create({
    container: {
      height: "100%",
    },
  });
  