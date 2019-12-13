import React, { Component } from "react";
import { SafeAreaView, View, Text, ScrollView, TextInput, Picker, Button, Alert, StyleSheet } from "react-native";
import { Card, Header, ListItem, Overlay } from 'react-native-elements'
import * as firebase from 'firebase';
import 'firebase/firestore';
import axios from 'axios';
import { firebaseConfig } from '../../config.js';
import dotenv from 'dotenv';
import bodyParser from 'body-parser'

dotenv.config()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { isVisible: false, allergies: [], foodType: null, foodName: null  }
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
  }

  componentDidMount() { // Users ingredients are immediately grabbed and displayed onmount
    let user = firebase.auth().currentUser.uid
    axios.get('https://' + process.env.FIREBASE_PROJECT_ID + `firebaseapp.com/getList/${user}`).then((e) => {
      const allergy = e.data.Food
      this.setState({ allergies: allergy })
    })
  }

  onAddList = () => { // Function to determine when a new ingredient is added
    let user = firebase.auth().currentUser.uid
    let foodType = this.state.foodType
    let foodName = this.state.foodName
    if (foodType != null && foodName != null) {
      axios.post('https://' + process.env.FIREBASE_PROJECT_ID + `firebaseapp.com/addList/${user}/${foodName}/${foodType}`).then((e) => {
        this.setState({ isVisible: false })
      }).then((f) => {
        axios.get('https://' + process.env.FIREBASE_PROJECT_ID + `firebaseapp.com/getList/${user}`).then((e) => {
          const allergy = e.data.Food
          this.setState({ allergies: allergy })
        })
      })
    }
    else {
      Alert.alert('The name of the food or food type is empty!')
    }
  }

  onSignOut = () => {
    firebase.auth().signOut();
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Header
          centerComponent={{ text: 'Your Allergies', style: { fontSize: 20, fontWeight: 'bold', color: '#fff' }}}
          leftComponent={{ icon: 'home', color: '#fff', onPress: this.onSignOut}}
          rightComponent={{ icon: 'add', color: '#fff', onPress: () => this.setState({isVisible: true}) }}
        />
        <Overlay // Overlay, when clicked shows the display for the user to add ingredients
          isVisible={this.state.isVisible}
          windowBackgroundColor="rgba(105,105,105, 0.9)"
          overlayBackgroundColor="white"
          width={343}
          height={500}
          style={styles.overlayContainer}
          borderRadius={5}
          onBackdropPress={() => this.setState({ isVisible: false })}
        >
          <View>
            <Text style={styles.addTitle} >Add Your Allergy</Text>
            <TextInput
              placeholder="Food Name"
              placeholderTextColor="#3897f1"
              value={this.state.foodName}
              onChangeText={(foodName) => this.setState({foodName})}
              style={styles.allergyFormTextInput} />
            <Picker // This is the list of types of food that a user can pick from, i.e. Dairy
              selectedValue={this.state.foodType}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({foodType: itemValue})
              }>
              <Picker.Item label="Nuts" value="Nuts" />
              <Picker.Item label="Fruits and Vegetables" value="Fruits and Vegetables" />
              <Picker.Item label="Dairy" value="Dairy" />
              <Picker.Item label="Meats and Fish" value="Meats and Fish" />
              <Picker.Item label="Grains" value="Grains" />
            </Picker>
            <Button
              title="Add Allergy"
              onPress={this.onAddList}
            />
          </View>
        </Overlay>
        <View style={styles.container}>
          <ScrollView style={styles.list}>
          {
            this.state.allergies.map((l, i) => {
              let image;
              if (l.FoodType === 'Nuts') {
                image = require('../../assets/nuts.jpg')
              }
              else if (l.FoodType === 'Meats and Fish') {
                image = require('../../assets/meats.jpg')
              }
              else if (l.FoodType === 'Dairy') {
                image = require('../../assets/dairy.jpg')
              }
              else if (l.FoodType === 'Fruits and Vegetables') {
                image = require('../../assets/vegetables.jpg')
              }
              else if (l.FoodType === 'Grains') {
                image = require('../../assets/grains.jpg')
              }
              return (
                <Card
                  image={image}
                  key={i}
                  title={l.Allergy}
                  featuredSubtitle={l.FoodType}
                  featuredSubtitleStyle={styles.featuredSubtitleStyle}
                />
            )})
          }
          </ScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  addTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30,
    marginTop: 20
  },
  featuredSubtitleStyle: {
    fontWeight: 'bold'
  },
  allergyFormTextInput: {
    height: 40,
    borderWidth: 0.5,
    color: 'black',
    paddingHorizontal: 10,
    borderRadius: 4,
    marginTop: 50,
    marginBottom: -10,
  },
});
