import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Button,
  Platform,
  SafeAreaView,
  Image,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';

import { RFValue } from 'react-native-responsive-fontsize';

import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';

let customFonts = {
  'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
  }

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  onSignIn = googleUser => {
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );

        // Sign in with credential from the Google user.
        firebase
          .auth()
          .signInWithCredential(credential)
          .then(function(result) {
            if (result.additionalUserInfo.isNewUser) {
              firebase
                .database()
                .ref("/users/" + result.user.uid)
                .set({
                  gmail: result.user.email,
                  profile_picture: result.additionalUserInfo.profile.picture,
                  locale: result.additionalUserInfo.profile.locale,
                  first_name: result.additionalUserInfo.profile.given_name,
                  last_name: result.additionalUserInfo.profile.family_name,
                  current_theme: "dark"
                })
                .then(function(snapshot) {});
            }
          })
          .catch(error => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
      } else {
        console.log("User already signed-in Firebase.");
      }
    });
  };

  signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        behaviour: "web",
        androidClientId:"428251011732-716grfss5bnq86fo3l77ic65pcd108g0.apps.googleusercontent.com",
  iosClientId:"428251011732-u3mpeaike4vhib56sdq6tmp008ppl108.apps.googleusercontent.com",
        scopes: ["profile", "email"]
      });

      if (result.type === "success") {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      console.log(e.message);
      return { error: true };
    }
  };

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.appIcon}></Image>
            <Text style={styles.appTitleText}>Spectagram</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.signInWithGoogleAsync();
              }}>
                <Image source={require('../assets/google_icon.png')} style={styles.googleIcon}/>
                <Text style={styles.googleText}>
                  Sign In With Google
                </Text>
              </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9df2e1"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  appTitle: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
  },
  appIcon: {
    width: RFValue(130),
    height: RFValue(130),
    resizeMode: "contain"
  },
  appTitleText: {
    color: "#4b92c4",
    textAlign: "center",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans"
  },
  buttonContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    width: RFValue(250),
    height: RFValue(50),
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: RFValue(30),
    backgroundColor: "#ebeb13"
  },
  googleIcon: {
    width: RFValue(30),
    height: RFValue(30),
    resizeMode: "contain"
  },
  googleText: {
    color: "black",
    fontSize: RFValue(20),
    fontFamily: "Bubblegum-Sans"
  },
});