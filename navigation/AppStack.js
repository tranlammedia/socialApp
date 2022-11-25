import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screen/HomeScreen'
import ChatScreen from '../screen/ChatScreen';
import ProfileScreen from '../screen/ProfileScreen';
import AddPostScreen from '../screen/AddPostScreen';
import MessagesScreen from '../screen/MessagesScreen';
import EditProfileScreen from '../screen/EditProfileScreen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator();

const FeedStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="RN Social"
      component={HomeScreen}
      options={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: '#2e64e5',
          fontFamily: 'Kufam-SemiBoldItalic',
          fontSize: 18,
        },
        headerStyle: {
          shadowColor: '#fff',
          elevation: 0,
        },
        headerRight: () => (
          <View style={{ marginRight: 10 }}>
            <FontAwesome.Button
              name="plus-circle"
              size={22}
              backgroundColor="#fff"
              color="#2e64e5"
              onPress={() => navigation.navigate('AddPost')}
            />
          </View>
        ),
      }}
    />
    <Stack.Screen
      name="AddPost"
      component={AddPostScreen}
      options={{
        title: '',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#2e64e515',
          shadowColor: '#2e64e515',
          elevation: 0,
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{ marginLeft: 15 }}>
            <Ionicons name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ),
      }}
    />
    <Stack.Screen
      name="HomeProfile"
      component={ProfileScreen}
      options={{
        title: '',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#fff',
          elevation: 0,
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{ marginLeft: 15 }}>
            <Ionicons name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ),
      }}
    />
  </Stack.Navigator>
);

const MessageStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen name="Messages" component={MessagesScreen} 
      options={({route}) => {
        getTabBarVisibility(route.name)
      }}
    />
    <Stack.Screen
      name="Chat"
      component={ChatScreen}
      options={({ route }) => {
        getTabBarVisibility(route.name)
        return (
          {
            title: route.params.userName,
            headerBackTitleVisible: false,
          }

        )
      }}
    />
  </Stack.Navigator>
);

const ProfileStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="InfoProfile"
      component={ProfileScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{
        headerTitle: 'Edit Profile',
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#fff',
          elevation: 0,
        },
      }}
    />
  </Stack.Navigator>
);

let isGetTabbar

const getTabBarVisibility = (route) => {
  if (route === 'Chat') {
    isGetTabbar = 'flex';
  } else {
    isGetTabbar = 'none'
  }
};

const fncGetTabbar = (route) =>{
  // console.log(route)
  return route
}

export default function AppStack() {

  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarActiveTintColor: '#2e64e5',
        headerShown: false
      })}
    >
      <Tab.Screen name='Home' component={FeedStack}
        options={() => ({
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={25} />
          ),
        })}
      />
      <Tab.Screen name='Message' component={MessageStack}
        options={({ route }) => ({
          // tabBarStyle: { display: fncGetTabbar(isGetTabbar) },
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbox-ellipses-outline"
              color={color}
              size={size}
            />
          ),
        })}
      />
      <Tab.Screen name='Profile' component={ProfileStack}
        options={() => ({
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons name="account-settings-outline" color={color} size={25} />
          ),
        })}
      />
    </Tab.Navigator>
  )
}