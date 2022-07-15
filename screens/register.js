import React, { useEffect, useLayoutEffect, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import { Button, Image, Input } from "react-native-elements";
import { auth, createUserWithEmailAndPassword, db,collection,addDoc } from "../firebase";
const Register = ({ navigation }) => {
  const [register, setRegister] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const handleToLogin = () => {
    navigation.navigate("Login");
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Login",
    });
  }, [navigation]);
  // console.log("navigation", auth);

  const handleRegisterField = (key, value) => {
    setRegister({ ...register, [key]: value });
  };
  const handleRegister = () => {
    if (register?.userName && register?.email && register.password) {
      createUserWithEmailAndPassword(auth, register.email, register.password)
        .then(async(resp) => {
          resp.user.displayName = register.userName;
          const refuser=collection(db,'users')
          const addUser=await addDoc(refuser,{
            email:register?.email,
            userName:register?.userName,
            uid:resp?.user?.uid
          })

        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <KeyboardAvoidingView style={styles.loginWrapper}>
      <Image
        source={{
          uri: "https://play-lh.googleusercontent.com/jCln_XT8Ruzp7loH1S6yM-ZzzpLP1kZ3CCdXVEo0tP2w5HNtWQds6lo6aLxLIjiW_X8",
        }}
        style={{ width: 200, height: 200 }}
      />
      <View style={styles.inputWrapper}>
        <Input
          placeholder="User Name"
          type="text"
          onChangeText={(val) => handleRegisterField("userName", val)}
        />
        <Input
          placeholder="Email"
          type="email"
          onChangeText={(val) => handleRegisterField("email", val)}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          type="password"
          onChangeText={(val) => handleRegisterField("password", val)}
        />
      </View>
      {/* <View style={styles.btnWrapper}> */}
      <Button
        containerStyle={styles.button}
        onPress={handleRegister}
        title={"Register"}
      />
      <Button
        onPress={handleToLogin}
        containerStyle={styles.button}
        title={"Login"}
        type="outline"
      />
      {/* </View> */}
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  loginWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 200,
    marginTop: 10,
  },
  inputWrapper: {
    width: 300,
  },
  btnWrapper: {
    width: "70%",
    justifyContent: "space-between",
  },
});
