import React from "react";
import {
  ActivityIndicator,
  Button,
  Clipboard,
  FlatList,
  Image,
  Platform,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  ImageBackground
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Constants } from "expo";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import uuid from "uuid";
import * as firebase from 'firebase';
import axios from 'axios';
import 'firebase/firestore';
import dotenv from 'dotenv';
import bodyParser from 'body-parser'

dotenv.config()

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

export default class Camera extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null, // Variable to check if there is an image taken
      uploading: false, // Variable to check the current status of the response
      googleResponse: null, // Variable to check when the response is complete
      allergic: null // Variable to check if the user is allergic or not following response
    }
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
  }

  async componentDidMount() {
    await Permissions.askAsync(Permissions.CAMERA);
  }

  onChooseFood = (food) => { // Function to call when a user selects the correct food from the list
    let user = firebase.auth().currentUser.uid
    let url = process.env.FIREBASE_PROJECT_ID // url is the url of your firebase app, i.e. https://yourapp.firebaseapp.com
    axios.get('https://' + `${url}` + 'firebaseapp.com' + `/analyzeFood/${user}`, {item: food}, { headers: { 'Content-Type': 'application/json' }}).then((e) => {
      this.setState({allergic: e.data, googleResponse: null})
    })
  }

  render() {
    let IconComponent = Ionicons;
    let { image, allergic } = this.state;
    return (
      <ImageBackground source={require('../../assets/background.jpg')} style={{width: '100%', height: '100%'}}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'start' }}>
          <View style={styles.textContainers}>
            <Image source={require('../../assets/potato.png')} style={styles.logo}/>
            // Next few lines determine which graphic and text to show
            { (allergic == null || allergic == 'unclear') && (
              <Text style={styles.potatoText}> Click the camera to take a picture of your meal! </Text>
            )}
            { allergic == true && (
              <Text style={styles.potatoText}> You are allergic! You can click the camera to take another picture. </Text>
            )}
            { allergic == false && (
              <Text style={styles.potatoText}> You aren't allergic! You can click the camera to take another picture. </Text>
            )}
          </View>
          {this._renderImage()}
          {this._renderUploadingOverlay()}
          {this.state.googleResponse && (
                <Text style={{marginTop: -40}}> Please click the correct food! </Text>
          )}
          {this.state.googleResponse && ( // List of possible foods from analysis of the photo
                <FlatList
                  data={this.state.googleResponse.responses[0].labelAnnotations}
                  extraData={this.state}
                  style={{height: 50}}
                  keyExtractor={( item, index) => index.toString()}
                  renderItem={({ item, index }) => <Text onPress={() => this.onChooseFood(item.description)}>{index}: {item.description}</Text>}
                />
          )}
          {( image == null || allergic == true || allergic == false ) && (
            <TouchableOpacity onPress={this._takePhoto}>
               <IconComponent style={{alignItems: 'flex-end'}} name={'ios-camera'} size={60} color={'black'} onPress={this._takePhoto}/>
            </TouchableOpacity>
          )}
          {( image != null && allergic != true && allergic != false && !this.state.googleResponse ) && (
            <Button
              onPress={() => this.submitToGoogle()}
              title="Analyze!"
              style={{marginBottom: 100}}
            />
          )}
          <StatusBar barStyle="default" />
        </View>
      </ImageBackground>
    );
  }

  _renderUploadingOverlay = () => { // Function to show loading before reponse
    if (this.state.uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(0,0,0,0.4)',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}>
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  _renderImage = () => { // Function to render the image taken by user
    let { image } = this.state;
    if (!image) {
      return;
    }

    return (
      <View
        style={{
          width: 250,
          borderRadius: 3,
          elevation: 2,
        }}>
        <View
          style={{
            borderTopRightRadius: 3,
            borderTopLeftRadius: 3,
            shadowColor: 'rgba(0,0,0,1)',
            shadowOpacity: 0.2,
            shadowOffset: { width: 4, height: 4 },
            shadowRadius: 5,
            overflow: 'hidden',
            marginBottom: 60
          }}>
          <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
        </View>
      </View>
    );
  };

  _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    this._handleImagePicked(pickerResult);
    this.setState({allergic: 'unclear'}) // This changes the graphic shown
  };

  _handleImagePicked = async pickerResult => { // Image that is picked is uploaded to Firebase
    try {
      this.setState({ uploading: true });
      if (!pickerResult.cancelled) {
        uploadUrl = await uploadImageAsync(pickerResult.uri) // Callback to wait for the function to complete before returning for try catch
        this.setState({ image: uploadUrl});
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    } finally {
      this.setState({ uploading: false });
    }
  };

  submitToGoogle = async () => { // Runs the image through Google Cloud Vision API
    try {
      this.setState({ uploading: true });
      let { image } = this.state;
      let url = process.env.FIREBASE_PROJECT_ID
      image = 'gs://' + `${url}` + '.appspot.com/' + image.slice(73, 109)
      let body = JSON.stringify({
        requests: [
          {
            features: [
              { type: "LABEL_DETECTION", maxResults: 10 },
            ],
            image: {
              source: {
                imageUri: image
              }
            }
          }
        ]
      });
      let response = await fetch( // Awaits response until fetched
        "https://vision.googleapis.com/v1/images:annotate?key=" +
          `${process.env.GOOGLE_CLOUD_VISION_API}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          method: "POST",
          body: body
        }
      );
      let responseJson = await response.json(); // Then the response is set in the state and displayed
      console.log(responseJson);
      this.setState({
        googleResponse: responseJson,
        uploading: false
      });
    } catch (error) {
      console.log(error);
    }
  };

}
async function uploadImageAsync(uri) { // Function that uploads image to Firebase for later use
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function(e) {
      console.log(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const ref = firebase
    .storage()
    .ref()
    .child(uuid.v4());
  const snapshot = await ref.put(blob);

  blob.close();

  return await snapshot.ref.getDownloadURL();
}

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 90,
    marginBottom: -50
  },
  textContainers: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    marginTop: 50,
    marginLeft: -50
  },
  potatoText: {
    width: 200,
    fontSize: 14,
    marginTop: 20,
    marginBottom: 30,
    marginLeft: 10,
    fontWeight: 'bold'
  }
});
