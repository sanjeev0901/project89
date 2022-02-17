import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import DropDownPicker from 'react-native-dropdown-picker';
import firebase from 'firebase';

export default class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewImage: 'image_1',
      dropdownHeight: 40,
      light_theme: true,
    };
  }

  componentDidMount = () => {
    this.fetchUser();
  };

  async addPosts() {
    if (this.state.caption) {
      let postData = {
        preview_image: this.state.previewImage,
        caption: this.state.caption,
        author: firebase.auth().currentUser.displayName,
        created_on: new Date(),
        author_uid: firebase.auth().currentUser.uid,
        likes: 0,
        is_liked:false
      };
      await firebase
        .database()
        .ref('/posts/' + Math.random().toString(36).slice(2))
        .set(postData)
        .then(function (snapshot) {});
      this.props.setUpdateToTrue();
      this.props.navigation.navigate('Feed');
    } else {
      Alert.alert(
        'Error',
        'All fields are required!',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    }
  }

  fetchUser = () => {
    let theme;
    firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid)
      .on('value', (snapshot) => {
        theme = snapshot.val().current_theme;
        this.setState({ light_theme: theme === 'light' ? true : false });
      });
  };
  render() {
    let preview_images = {
      image_1: require('../assets/image_1.jpg'),
      image_2: require('../assets/image_2.jpg'),
      image_3: require('../assets/image_3.jpg'),
      image_4: require('../assets/image_4.jpg'),
      image_5: require('../assets/image_5.jpg'),
      image_6: require('../assets/image_6.jpg'),
      image_7: require('../assets/image_7.jpg'),
    };
    return (
      <KeyboardAvoidingView
        style={this.state.light_theme ? styles.container : styles.containerDark}
        behavior="padding">
        <SafeAreaView style={styles.droidSafeArea} />
        <View style={styles.appTitle}>
          <View style={styles.appIcon}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.iconImage}></Image>
          </View>
          <View style={styles.appTitleTextContainer}>
            <Text
              style={
                this.state.light_theme
                  ? styles.appTitleText
                  : styles.appTitleTextDark
              }>
              New Post
            </Text>
          </View>
        </View>
        <View style={styles.fieldsContainer}>
          <ScrollView>
            <Image
              source={preview_images[this.state.previewImage]}
              style={styles.previewImage}></Image>
            <View style={{ height: RFValue(this.state.dropdownHeight) }}>
              <DropDownPicker
                items={[
                  { label: 'Image 1', value: 'image_1' },
                  { label: 'Image 2', value: 'image_2' },
                  { label: 'Image 3', value: 'image_3' },
                  { label: 'Image 4', value: 'image_4' },
                  { label: 'Image 5', value: 'image_5' },
                  { label: 'Image 6', value: 'image_6' },
                  { label: 'Image 7', value: 'image_7' },
                ]}
                defaultValue={this.state.previewImage}
                containerStyle={{
                  height: 40,
                  borderRadius: 20,
                  marginBottom: 10,
                }}
                onOpen={() => {
                  this.setState({ dropdownHeight: 170 });
                }}
                onClose={() => {
                  this.setState({ dropdownHeight: 40 });
                }}
                style={
                  this.state.light_theme
                    ? { backgroundColor: '#ebeb13' }
                    : { backgroundColor: '#e37764' }
                }
                itemStyle={{
                  justifyContent: 'flex-start',
                }}
                dropDownStyle={
                  this.state.light_theme
                    ? { backgroundColor: '#ebeb13' }
                    : { backgroundColor: '#e37764' }
                }
                labelStyle={{
                  color: 'white',
                  fontFamily: 'Bubblegum-Sans',
                }}
                arrowStyle={{
                  color: 'white',
                  fontFamily: 'Aerial',
                }}
                onChangeItem={(item) =>
                  this.setState({
                    previewImage: item.value,
                  })
                }
              />
            </View>
            <TextInput
              style={
                this.state.light_theme
                  ? [
                      styles.inputFont,
                      styles.inputFontExtra,
                      styles.inputTextBig,
                    ]
                  : [
                      styles.inputFontDark,
                      styles.inputFontExtra,
                      styles.inputTextBig,
                    ]
              }
              onChangeText={(caption) => this.setState({ caption })}
              placeholder={'Caption'}
              multiline={true}
              numberOfLines={4}
              placeholderTextColor={
                this.state.light_theme ? '#4b92c4' : '#e63e3e'
              }
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => this.addPosts()}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <View style={{ flex: 0.08 }} />
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9df2e1',
  },
  containerDark: {
    flex: 1,
    backgroundColor: '#15193c',
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35),
  },
  appTitle: {
    flex: 0.07,
    flexDirection: 'row',
  },
  appIcon: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: 'center',
  },
  appTitleText: {
    color: '#4b92c4',
    fontSize: RFValue(28),
    fontFamily: 'Bubblegum-Sans',
  },
  appTitleTextDark: {
    color: '#e63e3e',
    fontSize: RFValue(28),
    fontFamily: 'Bubblegum-Sans',
  },
  fieldsContainer: {
    flex: 0.85,
  },
  previewImage: {
    width: '93%',
    height: RFValue(250),
    alignSelf: 'center',
    borderRadius: RFValue(10),
    marginVertical: RFValue(10),
    resizeMode: 'contain',
  },
  inputFont: {
    height: RFValue(40),
    borderColor: '#ebeb13',
    borderWidth: RFValue(3),
    borderRadius: RFValue(10),
    paddingLeft: RFValue(10),
    fontSize: 20,
    color: '#4b92c4',
    fontFamily: 'Bubblegum-Sans',
  },
  inputFontDark: {
    height: RFValue(40),
    borderColor: '#e37764',
    borderWidth: RFValue(3),
    borderRadius: RFValue(10),
    paddingLeft: RFValue(10),
    fontSize: 20,
    color: '#e63e3e',
    fontFamily: 'Bubblegum-Sans',
  },
  inputFontExtra: {
    marginTop: RFValue(15),
  },
  inputTextBig: {
    textAlignVertical: 'top',
    padding: RFValue(5),
  },
  submitButton: {
    marginTop: RFValue(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontFamily: 'Bubblegum-Sans',
    color: '#1c7dc7',
    fontSize: 30,
  },
});
