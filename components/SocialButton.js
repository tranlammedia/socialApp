import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { windowHeight } from '../utils/Dimentions';


export default function SocialButton({ backgroundColor, buttonTitle, btnType, color, ...rest }) {
  let bgColor = backgroundColor

  return (
    <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: bgColor }]} {...rest}>
      <View style={styles.iconWrapper}>
        <FontAwesome name={btnType} size={22} color={color} style={styles.icon}></FontAwesome>
      </View>
      <View style={styles.btnTxtWrapper}>
        <Text style={[styles.buttonText, {color: color}]}>{buttonTitle}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 10,
    width: '100%',
    height: windowHeight / 15,
    padding: 10,
    flexDirection: 'row',
    borderRadius: 3,
  },
  iconWrapper:{
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontWeight: 'bold',
  },
  btnTxtWrapper:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Lato-Regular',
  }
})