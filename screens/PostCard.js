import React, { Component } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import firebase from "firebase";

export default class Postcard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      light_theme: false,
      post_id: this.props.post.key,
      post_data: this.props.post.value,
      is_liked: false,
      likes: this.props.post.value.likes,
    };
  }

  isLikedTrue = () => {
    firebase
      .database()
      .ref("posts")
      .child(this.state.post_id)
      .child("is_liked")
      .set(true);
  };

  isLikedFalse = () => {
    firebase
      .database()
      .ref("posts")
      .child(this.state.post_id)
      .child("is_liked")
      .set(false);
  };

  checkIsLiked = async () => {
    firebase
      .database()
      .ref("/posts/")
      .child(this.state.post_id)
      .child("is_liked")
      .on("value", (snapshot) => {
        if (snapshot.val()) {
          this.setState({ is_liked: true });
        } else {
          this.setState({ is_liked: false });
        }
      });
  };

  likeAction = () => {
    if (this.state.is_liked) {
      firebase
        .database()
        .ref("posts")
        .child(this.state.post_id)
        .child("likes")
        .set(firebase.database.ServerValue.increment(-1));
      this.setState({ likes: (this.state.likes -= 1) });
      this.isLikedFalse();
    } else {
      firebase
        .database()
        .ref("posts")
        .child(this.state.post_id)
        .child("likes")
        .set(firebase.database.ServerValue.increment(+1));
      this.isLikedTrue();
      this.setState({ likes: (this.state.likes += 1) });
    }
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

  componentDidMount() {
    this.fetchUser();
    this.checkIsLiked();
  }

  render() {
    let post = this.state.post_data;
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          this.props.navigation.navigate("PostScreen", {
            author: post.author,
            caption: post.caption,
            likes: this.state.likes,
            post_id: this.state.post_id,
            is_liked: this.state.is_liked,
          });
        }}
      >
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
              {post.author}
            </Text>
          </View>
          <Image
            source={require("../assets/post.jpeg")}
            style={styles.postImage}
          />
          <View style={styles.captionContainer}>
            <Text style={styles.captionText}>{post.caption}</Text>
          </View>

          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={
                this.state.is_liked
                  ? styles.likeButtonLiked
                  : styles.likeButtonDisliked
              }
              onPress={() => this.likeAction()}
            >
              <Ionicons name={"heart"} size={RFValue(30)} color='white' />

              <Text style={styles.likeText}>{this.state.likes}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    width: RFValue(300),
    margin: RFValue(10),
    backgroundColor: "#ebeb13",
    borderRadius: RFValue(20),
  },
  cardContainerDark: {
    width: RFValue(300),
    margin: RFValue(10),
    backgroundColor: "#e37764",
    borderRadius: RFValue(20),
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  postImage: {
    resizeMode: "contain",
    width: "98%",
    alignSelf: "center",
    height: RFValue(250),
  },
  authorContainer: {
    justifyContent: "center",
    flexDirection: "row",
  },
  authorNameText: {
    fontSize: RFValue(25),
    fontFamily: "Bubblegum-Sans",
    color: "#39d117",
  },
  authorNameTextDark: {
    fontSize: RFValue(25),
    fontFamily: "Bubblegum-Sans",
    color: "#78cfb7",
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
});
