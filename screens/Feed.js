import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import * as firebase from "firebase";

import PostCard from "./PostCard";

let posts = require("./temp_posts.json");
let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf"),
};

export default class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      light_theme: false,
      posts: [],
    };
  }
  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
    this.fetchStories();
  }

  fetchStories = () => {
    firebase
      .database()
      .ref("/posts/")
      .on(
        "value",
        (snapshot) => {
          let posts = [];
          if (snapshot.val()) {
            Object.keys(snapshot.val()).forEach(function (key) {
              posts.push({
                key: key,
                value: snapshot.val()[key],
              });
            });
          }
          this.setState({ posts: posts });
          this.props.setUpdateToFalse();
        },
        function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        }
      );
  };

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

  renderItem = ({ item: post }) => {
    return <PostCard post={post} navigation={this.props.navigation} />;
  };

  keyExtractor = (item, index) => index.toString();

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View
          style={
            this.state.light_theme ? styles.container : styles.containerDark
          }
        >
          <SafeAreaView style={styles.droidSafeArea} />
          {/*<View style={styles.titleContainer}>*/}
          <View style={styles.titleContainer}>
            <Image
              source={require("../assets/logo.png")}
              style={{ width: 50, height: 50 }}
            />
            <Text
              style={
                this.state.light_theme ? styles.textStyle : styles.textStyleDark
              }
            >
              Spectagram
            </Text>
          </View>
          {/*</View>*/}
          {!this.state.posts[0] ? (
            <View style={styles.noStories}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.noStoriesText
                    : styles.noStoriesTextDark
                }
              >
                No Stories Available
              </Text>
            </View>
          ) : (
            <View style={styles.cardContainer}>
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.posts}
                renderItem={this.renderItem}
              />
            </View>
          )}
          <View style={{ flex: 0.08 }} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9df2e1",
  },
  containerDark: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#15193c",
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  textStyle: {
    fontSize: 35,
    fontFamily: "Bubblegum-Sans",
    color: "#4b92c4",
  },
  textStyleDark: {
    fontSize: 35,
    fontFamily: "Bubblegum-Sans",
    color: "#e63e3e",
  },
  titleContainer: {
    flexDirection: "row",
    marginTop: RFValue(50),
  },
  cardContainer: {
    flex: 0.85,
  },
  noStories: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noStoriesText: {
    position: "absolute",
    top: 9,
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans",
  },
  noStoriesTextDark: {
    position: "absolute",
    top: 9,
    color: "white",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans",
  },
});
