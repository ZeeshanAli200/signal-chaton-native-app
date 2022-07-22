import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
const UserListItem = ({ id, chat, goToChat }) => {
  console.log("goToChat",chat);
  return (
    <ListItem onPress={() => goToChat(id, chat)}>
      <Avatar
        rounded
        icon={{ name: "user", type: "font-awesome" }}
        containerStyle={{ backgroundColor: "#2C6BED" }}
      />
      <ListItem.Content>
        <ListItem.Title><Text>{chat?.chatName}</Text></ListItem.Title>
        <ListItem.Subtitle><Text>{chat?.recent}</Text></ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default UserListItem;
