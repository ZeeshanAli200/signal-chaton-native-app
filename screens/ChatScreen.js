import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  TextInput,
} from "react-native";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { Avatar, Input } from "react-native-elements";
import { color } from "react-native-elements/dist/helpers";
import {
  db,
  collection,
  auth,
  doc,
  addDoc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "../firebase";
import { ActivityIndicator } from "react-native";

const ChatScreen = ({ navigation, route }) => {
  const scrollViewRef = useRef();
  const [msg, setmsg] = useState("");
  const [allmsgs, setallmsgs] = useState({ isLoading: true, allmsg: [] });
  const [searchMsg, setsearchMsg] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "left",
      headerTitle: () => (
        <View style={styles.headerContainer}>
          <Avatar
            rounded
            icon={{ name: "user", type: "font-awesome" }}
            containerStyle={{ backgroundColor: "#2C6BED" }}
          />
          <Text style={styles.headerTitle}>
            {route.params?.chatname?.chatName}
          </Text>
        </View>
      ),

      headerTintColor: "#fff",
      headerRight: () => (
        <View style={{display:"flex",flexDirection:"row",alignItems:'center'}}>
          {route?.params?.chatname?.createdBy === auth.currentUser?.uid && (
            <TouchableOpacity
              style={styles.notificationWrapper}
              onPress={() =>
                navigation.navigate("Requests", {
                  chatid: route?.params?.id,
                })
              }
            >
              {route?.params?.chatname?.userRequests?.length ? (
                <View style={styles.notificationTextWrapper}>
                  <Text style={{ color: "#fff" }}>
                    {route?.params?.chatname?.userRequests?.length}
                  </Text>
                </View>
              ) : null}

              <Avatar
                rounded
                icon={{ name: "notification", type: "antdesign" }}
                containerStyle={{ backgroundColor: "#2C6BED" }}
              />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            // style={styles.notificationWrapper}
            onPress={() =>
             setsearchMsg(!searchMsg)
            }
          >
            { !searchMsg ? (
              <Avatar
                rounded
                icon={{ name: "search", type: "font-awesome" }}
                containerStyle={{ backgroundColor: "#2C6BED" }}
              />
            ) : (
              
              <View style={{ flexDirection:'row'}}>
                {/* <Input placeholder="search"/> */}
              <Text style={{ fontWeight: "bold", fontSize: 16, color: "#fff" }}>
                {" "}
                X
              </Text>
              </View>
            )}

         
          </TouchableOpacity>
        </View>
      ),
    });
  }, [searchMsg]);
  console.log("searchMsg",searchMsg);
  const handleSendMsg = async () => {
    try {
      if (msg) {
        console.log("displayname", auth.currentUser);
        let msgtemp = msg;
        setmsg("");
        const messageRef = collection(db, `chats/${route.params.id}/message`);
        const addmsg = await addDoc(messageRef, {
          userName: auth.currentUser.displayName,
          timeStamp: serverTimestamp(),
          email: auth.currentUser.email,
          message: msgtemp,
        });
        // console.log("addmsg",addmsg.);

        const latestChatRef = doc(db, "chats", route.params.id);
        await updateDoc(latestChatRef, {
          recent: msgtemp,
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    const ref = query(
      collection(db, `chats/${route.params.id}/message`),
      orderBy("timeStamp", "asc")
    );
    const unsubscribe = onSnapshot(ref, (querySnapshot) =>
      setallmsgs({
        isLoading: false,
        allmsg: querySnapshot?.docs?.map((doc) => {
          return { ...doc.data() };
        }),
      })
    );
    return unsubscribe;
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style={"light"} />
      {allmsgs?.isLoading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator color={"#2C6BED"} size="large" />
        </View>
      ) : (
        <KeyboardAvoidingView style={styles.container}>
          <ScrollView
            style={styles.scrollContainer}
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current.scrollToEnd({ animated: true })
            }
          >
            {allmsgs?.allmsg?.map(
              ({ userName, timeStamp, email, message }, indx) =>
                email === auth.currentUser.email ? (
                  <View style={styles.receiver} key={indx}>
                    <View style={styles.receiverTextWrapper}>
                      <Text style={styles.receiverText}>{message}</Text>
                    </View>
                    <Avatar
                      rounded
                      size={24}
                      icon={{ name: "user", type: "font-awesome" }}
                      containerStyle={{ backgroundColor: "#2C6BED" }}
                    />
                  </View>
                ) : (
                  <View style={styles.sender} key={indx}>
                    <Avatar
                      size={24}
                      rounded
                      icon={{ name: "user", type: "font-awesome" }}
                      containerStyle={{ backgroundColor: "#2C6BED" }}
                    />
                    <View style={styles.sendTextWrapper}>
                      <Text style={styles.sendText}>{userName}</Text>
                      <Text>{message}</Text>
                    </View>
                  </View>
                )
            )}
          </ScrollView>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputstyle}
              onChangeText={(val) => setmsg(val)}
              placeholder="Enter Message"
              value={msg}
              onSubmitEditing={handleSendMsg}
            />
            <TouchableOpacity onPress={handleSendMsg}>
              <Ionicons name="send" color={"#2C6BED"} size={24} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
      {/* {
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <ActivityIndicator color={"#2C6BED"} size="large"/>
        </View>
      } */}
    </SafeAreaView>
  );
};

export default ChatScreen;
const styles = StyleSheet.create({
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  headerTitle: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    // justifyContent:"center"
  },
  inputstyle: {
    flex: 1,
    bottom: 0,
    padding: 10,
    borderRadius: 30,
    marginRight: 15,
    height: 40,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: "#ECECEC",
  },
  scrollContainer: {
    //   margin:"auto"
  },
  receiver: {
    flexDirection: "row",
    maxWidth: "100%",
    paddingHorizontal: 15,

    alignItems: "center",

    marginBottom: 10,
    justifyContent: "flex-end",
    // position:"relative"
    // backgroundColor:"beige",
  },
  receiverText: {
    // padding: 10,
    // paddingHorizontal: 20,
    // backgroundColor: "#ECECEC",
    // borderRadius: 13,
    // maxWidth: 200,
    // marginRight: 5,
    // fontWeight:"bold"
  },
  receiverTextWrapper: {
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: "#ECECEC",
    borderRadius: 13,
    maxWidth: 200,
    marginRight: 5,
  },
  sender: {
    flexDirection: "row",
    justifyContent: "flex-start",
    maxWidth: "100%",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sendText: {
    // marginLeft: 5,
    // padding: 10,
    // paddingHorizontal: 20,
    // backgroundColor: "#ECECEC",
    // borderRadius: 13,
    // maxWidth: 200,
    color: "grey",
    fontSize: 12,
  },
  sendTextWrapper: {
    marginLeft: 5,
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: "#ECECEC",
    borderRadius: 13,
    maxWidth: 200,
  },
  notificationWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  notificationTextWrapper: {
    backgroundColor: "red",
    textAlign: "center",
    borderRadius: 20,
    height: 20,
    width: 20,
    position: "absolute",
    right: 0,
    zIndex: 2,

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
