import React from 'react';
import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../src/containers/Login.js';
import SignUpScreen from '../src/containers/SignUp.js'

const RootStackNavigator = createStackNavigator(
  {
    Login: { screen: LoginScreen },
    SignUp: { screen: SignUpScreen },

    Main: { screen: MainTabNavigator, },
  },
  {
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: 'normal',
      },
    }),
  }
);

export default createAppContainer(RootStackNavigator);
