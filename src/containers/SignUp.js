import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { firebaseConfig } from '../../config.js'

firebase.initializeApp(firebaseConfig);
let db = firebase.firestore()

export default class SignupScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { // State used to create user and checks if passwords are the same
            email: "",
            password: "",
            passwordConfirm: "",
        };
    }

    onSignUp = () => {
        let ref = db.collection('users')
        if (this.state.password !== this.state.passwordConfirm) {
            Alert.alert("Passwords are not the same!");
            return;
        }
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password) // User is created with password and email
            .then((e) => { ref.doc(e.user.uid).set({Food: []}) }, (error) => { Alert.alert(error.message); }); // Immediately adds an empty array "Food" for the user to the Firestore

    }

    onLoginReturn = () => {
        var navActions = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: "Login"})]
        });
        this.props.navigation.dispatch(navActions);
    }

    render() {
        return (
            <View style={styles.container}>
                <ImageBackground source={require('../../assets/background.jpg')} style={{width: '100%', height: '100%'}}>
                <View style={styles.logoContainer}>
                  <Text style={styles.title}>Sign Up</Text>
                  <Image source={require('../../assets/potato.png')} style={styles.logo}/>
                </View>
                <View style={styles.textContainer}>
                  <TextInput style={styles.textInput}
                      value={this.state.email}
                      onChangeText={(text) => { this.setState({email: text}) }}
                      placeholder="Email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                  />
                  <TextInput style={styles.textInput}
                      value={this.state.password}
                      onChangeText={(text) => { this.setState({password: text}) }}
                      placeholder="Password"
                      secureTextEntry={true}
                      autoCapitalize="none"
                      autoCorrect={false}
                  />
                  <TextInput style={styles.textInput}
                      value={this.state.passwordConfirm}
                      onChangeText={(text) => { this.setState({passwordConfirm: text}) }}
                      placeholder="Password (confirm)"
                      secureTextEntry={true}
                      autoCapitalize="none"
                      autoCorrect={false}
                  />
                </View>
                <View style={styles.buttonContainers}>
                  <TouchableOpacity style={styles.buttonInput} onPress={this.onSignUp}>
                    <Text style={{color: 'black', fontSize: 14, textAlign: 'center'}}> Sign Up </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonInput} onPress={this.onLoginReturn}>
                    <Text style={{color: 'black', fontSize: 14, textAlign: 'center'}}> Return </Text>
                  </TouchableOpacity>
                </View>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  logoContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    marginTop: -30
  },
  logo: {
    width: 100,
    height: 110
  },
  title: {
    marginBottom: 10,
    fontSize: 20,
    textAlign: 'center'
  },
  textContainer: {
    padding: 20
  },
  textInput: {
    height: 40,
    backgroundColor: 'rgba(255,255,255, 0.9)',
    marginTop: 15,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  buttonContainers: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
  },
  buttonInput: {
    width: '50%',
    height: 40,
    backgroundColor: 'rgba(255,255,255, 0.9)',
    padding: 10,
    borderRadius: 4
  }
});
