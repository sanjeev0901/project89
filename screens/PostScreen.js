import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import firebase from "firebase";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf"),
};

export default class StoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      light_theme: false,
      likes: this.props.route.params.likes,
      post_id: this.props.route.params.post_id,
      is_liked: this.props.route.params.is_liked,
    };
  }
  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }
  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }
  goBackToFeed = () => {
    this.props.navigation.navigate("home");
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
  };

  render() {
    if (!this.props.route.params) {
      this.props.navigation.navigate("Home");
    } else if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View
          style={
            this.state.light_theme ? styles.container : styles.containerDark
          }
        >
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.titleContainer}>
            <View style={styles.goBackContainer}>
              <TouchableOpacity
                style={styles.goBackButton}
                onPress={() =>
                  this.props.navigation.navigate("Home", {
                    is_liked: this.state.is_liked,
                  })
                }
              >
                <Ionicons
                  name={
                    this.state.light_theme
                      ? "arrow-back-circle"
                      : "arrow-back-circle-outline"
                  }
                  size={RFValue(30)}
                  color='black'
                  style={styles.icons}
                />
              </TouchableOpacity>
            </View>

            <Image
              source={require("../assets/logo.png")}
              style={{ width: 50, height: 50 }}
            />
            <Text
              style={
                this.state.light_theme ? styles.textStyle : styles.textStyleDark
              }
            >
              Spectgram
            </Text>
          </View>
          <View
            style={
              this.state.light_theme
                ? styles.cardContainer
                : styles.cardContainerDark
            }
          >
            <View style={styles.authorContainer}>
              <Image
                source={require("../assets/profile_img.png")}
                style={styles.profileImage}
              />
              <Text
                style={
                  this.state.light_theme
                    ? styles.authorNameText
                    : styles.authorNameTextDark
                }
              >
                {this.props.route.params.author}
              </Text>
            </View>
            <View style={styles.captionContainer}>
              <Text style={styles.captionText}>
                {this.props.route.params.caption}
              </Text>
            </View>
            <View style={styles.actionContainer}>
              <View
                style={
                  this.state.is_liked
                    ? styles.likeButtonLiked
                    : styles.likeButtonDisliked
                }
              >
                <Ionicons name={"heart"} size={RFValue(30)} color='white' />
                <Text style={styles.likeText}>{this.state.likes}</Text>
              </View>
            </View>
          </View>
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
    marginTop: 10,
    fontFamily: "Bubblegum-Sans",
    color: "#4b92c4",
  },
  textStyleDark: {
    fontSize: 35,
    marginTop: 10,
    fontFamily: "Bubblegum-Sans",
    color: "#e63e3e",
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
  },
  cardContainer: {
    width: RFValue(350),
    backgroundColor: "#ebeb13",
    borderRadius: RFValue(20),
  },
  cardContainerDark: {
    width: RFValue(350),
    backgroundColor: "#e37764",
    borderRadius: RFValue(20),
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  authorContainer: {
    justifyContent: "center",
    flexDirection: "row",
  },
  authorNameText: {
    fontSize: RFValue(25),
    color: "#39d117",
    fontFamily: "Bubblegum-Sans",
  },
  authorNameTextDark: {
    fontSize: RFValue(25),
    color: "#78cfb7",
    fontFamily: "Bubblegum-Sans",
  },
  captionContainer: {
    marginLeft: 10,
  },
  captionText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: 20,
    color: "#000000",
    paddingTop: RFValue(10),
  },
  actionContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(10),
  },
  likeButtonLiked: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#eb3948",
    borderRadius: RFValue(30),
  },
  likeButtonDisliked: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderColor: "#eb3948",
    borderWidth: 2,
    borderRadius: RFValue(30),
  },
  likeText: {
    color: "white",
    fontFamily: "Bubblegum-Sans",
    fontSize: 25,
    marginLeft: 25,
    marginTop: 6,
  },
  goBackButton: {
    marginLeft: RFValue(-70),
    marginTop: 10,
  },
  icons: {
    width: RFValue(40),
    height: RFValue(40),
    color: "white",
  },
});
