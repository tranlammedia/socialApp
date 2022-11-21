/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-quotes */
import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import OnboardingScreen from '../screen/OnboardingScreen';
import LoginScreen from '../screen/LoginScreen';
import SignupScreen from '../screen/SignupScreen';

const Stack = createStackNavigator();

export default function AuthStack() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null)
  let routeName;
  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then((value) => {
      if (value == null) {
        AsyncStorage.setItem('alreadyLaunched', 'true')
        setIsFirstLaunch(true)
      } else {
        setIsFirstLaunch(false)
      }
    })

    GoogleSignin.configure({
      webClientId: '76944306213-v3gas0qs1kaevt52m8r1oecp8omb4ipn.apps.googleusercontent.com',
    });
  }, [])
  if (isFirstLaunch == null) {
    return null
  } else if (isFirstLaunch == true) {
    routeName = 'OnboardingScreen'
  } else {
    routeName = 'LoginScreen'
  }
  return (
    <Stack.Navigator
      // screenOptions={{ headerShown: false }}
      initialRouteName={routeName}
    >
      <Stack.Screen name='OnboardingScreen' component={OnboardingScreen}
        options={{ header: () => null }}
      ></Stack.Screen>
      <Stack.Screen name='LoginScreen' component={LoginScreen}
        options={{ header: () => null }}
      ></Stack.Screen>
      <Stack.Screen name='SignupScreen' component={SignupScreen}
        options={({navigation}) => ({
          title: '',
          headerStyle: {
            backgroundColor: '#f9fafd',
            shadowColor: '#f9fafd',
            elevation: 0 // để dùng được trên ios
          },
          headerLeft: () => (
            <View style={{marginLeft: 10}}>
              <FontAwesome name='long-arrow-left' size={25} backgroundColor='#f9fafd' color='#333' onPress={()=> navigation.navigate('LoginScreen')}/>
            </View>
          )
        })}
      ></Stack.Screen>
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})