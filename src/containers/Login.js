import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import * as firebase from 'firebase';

export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
        };
    }

    onLogin = () => { // Firebase login, see Firebase docs for more
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => { }, (error) => { Alert.alert(error.message); });
    }

    onSignUp = () => { // Signup navigates to another page
        var navActions = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: "SignUp"})]
        });
        this.props.navigation.dispatch(navActions);
    }

    render() {
        return (
            <View style={styles.container}>
                <ImageBackground source={require('../../assets/background.jpg')} style={{width: '100%', height: '100%'}}>
                <View style={styles.logoContainer}>
                  <Image source={require('../../assets/potato.png')} style={styles.logo}/>
                  <Text style={styles.title}> An app that detects foods you're allergic to! </Text>
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
                </View>
                <View style={styles.buttonContainers}>
                  <TouchableOpacity style={styles.buttonInput} onPress={this.onLogin}>
                    <Text style={{color: 'black', fontSize: 14, textAlign: 'center'}}> Login </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonInput} onPress={this.onSignUp}>
                    <Text style={{color: 'black', fontSize: 14, textAlign: 'center'}}> Sign Up</Text>
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
    marginTop: 10,
    width: 200,
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
    marginBottom: 100
  },
  buttonInput: {
    width: '50%',
    height: 40,
    backgroundColor: 'rgba(255,255,255, 0.9)',
    padding: 10,
    borderRadius: 4
  }
});
