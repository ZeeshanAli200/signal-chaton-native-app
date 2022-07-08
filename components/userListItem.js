import React, { useEffect } from "react";
import { View } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
const UserListItem = ({ id, chat, goToChat }) => {
  return (
    <ListItem onPress={() => goToChat(id, chat)}>
      <Avatar
        rounded
        icon={{ name: "user", type: "font-awesome" }}
        containerStyle={{ backgroundColor: "#2C6BED" }}
      />
      <ListItem.Content>
        <ListItem.Title>{chat?.chatName}</ListItem.Title>
        <ListItem.Subtitle>{chat?.recent}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default UserListItem;
