import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import { Button, Image, Input } from "react-native-elements";
import {
  auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "../firebase";

const Login = ({ navigation }) => {
  const [login, setlogin] = useState({
    email: "",
    password: "",
  });
  const handleToRegister = () => {
    navigation.navigate("Register");
  };

  const handleLogin = () => {
    if (login?.email && login.password) {
      const getLogin = signInWithEmailAndPassword(
        auth,
        login?.email,
        login?.password
      )
        .then((res) => {
          console.log({ res });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  ////////////////////// on auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authuser) => {
      if (authuser) {
        navigation.replace("Home");
      }
    });

    // unsubscribe();
    return unsubscribe;
  }, []);
  ////////////////////// on auth xstate
  const handleLoginFields = (key, value) => {
    setlogin({ ...login, [key]: value });
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
          placeholder="Email"
          type="email"
          onChangeText={(val) => handleLoginFields("email", val)}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          type="password"
          onChangeText={(val) => handleLoginFields("password", val)}
        />
      </View>
      {/* <View style={styles.btnWrapper}> */}
      <Button
        containerStyle={styles.button}
        onPress={handleLogin}
        title={"Login"}
      />
      <Button
        onPress={handleToRegister}
        containerStyle={styles.button}
        title={"Register"}
        type="outline"
      />
      {/* </View> */}
    </KeyboardAvoidingView>
  );
};

export default Login;

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
