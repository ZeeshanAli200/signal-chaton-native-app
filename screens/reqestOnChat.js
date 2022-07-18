import { async } from "@firebase/util";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Button, Text } from "react-native";
import { ScrollView, View } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import {
  db,
  doc,
  auth,
  collection,
  onSnapshot,
  query,
  where,
  updateDoc,
  getDocs,
} from "../firebase";

const RequestOnChat = ({ navigation, route }) => {
  const [userReq, setuserReq] = useState([]);
  const [userobj, setuserobj] = useState({ isLoading: true, users: [] });
  const [acceptedReq, setacceptedReq] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor: "#fff",
    });
  }, []);
  //   console.log(route.params?.chatid);
  useEffect(() => {
    const ref = collection(db, `chats`);
    const queryChats = query(ref, where("chatid", "==", route?.params?.chatid));
    const unsubscribe = onSnapshot(queryChats, (querySnapshot) => {
      let users = [],
        accepted = [];
      querySnapshot?.docs?.map((doc) => {
        users = [...users, ...doc.data()?.userRequests];
        accepted = [...accepted, ...doc.data()?.acceptedRequests];
      });
      setuserReq(users);
      setacceptedReq(accepted);
    });
    return unsubscribe;
  }, []);
  useEffect(() => {
    if (userReq?.length) {
      const ref = collection(db, "users");
      const queryChats = query(ref, where("uid", "in", userReq));

      const unsubscribe = onSnapshot(queryChats, (querySnapshot) => {
        let users = [];
        setuserobj({
          isLoading: false,
          users: querySnapshot?.docs?.map((doc) => {
            console.log("doc.data()>>>>>", doc.data());
            return {
              email: doc.data().email,
              userName: doc?.data()?.userName,
              uid: doc?.data().uid,
            };
          }),
        });
      });
      return unsubscribe;
      // const getReqUsers=async()=>{
      //     const q = query(collection(db, "users"), where("uid", "in", userReq));

      //     const querySnapshot = await getDocs(q);
      //     let users=[]
      //     querySnapshot.forEach((doc) => {
      //       // doc.data() is never undefined for query doc snapshots
      //       users=[...users,{ email: doc.data().email, userName: doc?.data()?.userName }]
      //       console.log(doc.id, " => ", doc.data());
      //     });
      //     setuserobj([...users])
      //   }
      // getReqUsers()
    } else {
      setuserobj([]);
    }
  }, [userReq]);

  console.log("userReq", userobj, userReq);

  const AcceptReq = async (userid) => {
    const reqRef = doc(db, `chats/${route?.params?.chatid}`);
    let cloneReqArr = [...userReq];
    let indexReq = cloneReqArr.indexOf(userid);
    cloneReqArr.splice(indexReq, 1);
    const updReqField = await updateDoc(reqRef, {
      userRequests: [...cloneReqArr],
      acceptedRequests: [...acceptedReq, userid],
    });
  };
  console.log("userobj", userobj);
  return (
    <ScrollView>
      {userobj?.isLoading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator color={"#2C6BED"} size="large" />
        </View>
      ) : (
        userobj?.users?.map(({ userName, uid }) => (
          <ListItem>
            <Avatar
              rounded
              icon={{ name: "user", type: "font-awesome" }}
              containerStyle={{ backgroundColor: "#2C6BED" }}
            />
            <ListItem.Content>
              <ListItem.Title>{userName}</ListItem.Title>
              {/* <ListItem.Subtitle>dasasdasdd</ListItem.Subtitle> */}
            </ListItem.Content>
            <Button onPress={() => AcceptReq(uid)} title="Accept" />
          </ListItem>
        ))
      )}
    </ScrollView>
  );
};

export default RequestOnChat;
