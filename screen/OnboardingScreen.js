/* eslint-disable prettier/prettier */
import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';

export default function OnboardingScreen({ navigation }) {
  return (
    <Onboarding
      onSkip={() => navigation.replace('LoginScreen')}
      onDone={() => navigation.navigate('LoginScreen')}
      pages={[
        {
          backgroundColor: '#fff',
          image: <Image source={require('../assets/onboarding.webp')} style={{ width: 300, height: 300 }} />,
          title: 'Onboarding',
          subtitle: 'Done with React Native Onboarding Swiper',
        },
        {
          backgroundColor: '#fff',
          image: <Image source={require('../assets/onboarding.webp')} style={{ width: 300, height: 300 }} />,
          title: 'Onboarding',
          subtitle: 'Done with React Native Onboarding Swiper',
        },
        {
          backgroundColor: '#fff',
          image: <Image source={require('../assets/onboarding.webp')} style={{ width: 300, height: 300 }} />,
          title: 'Onboarding',
          subtitle: 'Done with React Native Onboarding Swiper',
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({});
