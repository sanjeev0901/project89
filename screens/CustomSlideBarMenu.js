import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import firebase from "firebase";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

export default class CustomSlideBarMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      light_theme: false,
    };
  }

  componentDidMount() {
    this.fetchUser();
  }

  fetchUser = () => {
    let theme;
    firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", (snapshot) => {
        theme = snapshot.val().current_theme;
        this.setState({ light_theme: theme === "light" ? true : false });
      });
    console.log(firebase.auth().currentUser.uid);
  };

  render() {
    let props = this.props;
    return (
      <View
        style={this.state.light_theme ? styles.container : styles.containerDark}
      >
        <SafeAreaView style={styles.droidSafeArea} />
        <Image
          source={require("../assets/logo.png")}
          style={styles.logoImage}
        />
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
      </View>
    );
  }
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ddb1f0",
  },
  containerDark: {
    flex: 1,
    backgroundColor: "#65cfc9",
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  logoImage: {
    width: RFValue(60),
    height: RFValue(60),
    alignItems: "center",
    marginLeft: "40%",
    marginTop: RFValue(20),
  },
});
