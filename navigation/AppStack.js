import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../screen/HomeScreen'

const Stack = createStackNavigator()

export default function AppStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen name='HomeScreen' component={HomeScreen}/>
    </Stack.Navigator>
  )
}