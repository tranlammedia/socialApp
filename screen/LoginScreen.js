/* eslint-disable prettier/prettier */
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext, useState } from 'react';
import AntDesign from "react-native-vector-icons/AntDesign";
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
import { AuthContext } from '../navigation/AuthProvider';

export default function LoginScreen({ navigation }) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const { login, googleLogin, fbLogin } = useContext(AuthContext)
	return (
		<View style={styles.container}>
			<Image source={require('../assets/onboarding.webp')} style={styles.logo}></Image>
			<Text style={styles.text}>RN Social App</Text>
			<FormInput
				labelValue={email}
				onChangeText={(email) => setEmail(email)}
				placeholderText='Email'
				iconType='user'
				keyboardType='email-address'
				autoCapitalize='none'
				autoCorrect={false}
			/>
			<FormInput
				labelValue={password}
				onChangeText={(password) => setPassword(password)}
				placeholderText='Password'
				iconType='lock'
				secureTextEntry={true}
			/>
			<FormButton
				buttonTitle='Sign In'
				onPress={() => login(email, password)}
			/>

			<TouchableOpacity
				style={styles.forgotButton}
				onPress={() => { }}
			>
				<Text style={styles.navButtonText}>Forgot Password?</Text>
			</TouchableOpacity>

			{Platform.OS === 'android' ? (
				<View>
					<SocialButton
						buttonTitle='Sign In with Facebook'
						btnType='facebook'
						color='#4867aa'
						backgroundColor='#e6eaf4'
						onPress={() => fbLogin()}
					/>

					<SocialButton
						buttonTitle='Sign In with Google'
						btnType='google'
						color='#de4d41'
						backgroundColor='#f5e7ea'
						onPress={() => googleLogin()}
					/>
				</View>
			) : null}

			<TouchableOpacity
				style={styles.forgotButton}
				onPress={() => navigation.navigate('SignupScreen')}
			>
				<Text style={styles.navButtonText}>Don't have an account? Create here</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#f9fafd',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	logo: {
		height: 150,
		width: 150,
		resizeMode: 'cover',
	},
	text: {
		fontFamily: 'Kufam-SemiBoldItalic',
		fontSize: 28,
		marginBottom: 10,
		color: '#051d5f',
	},
	navButton: {
		margin: 15
	},
	forgotButton: {
		marginVertical: 35,
	},
	navButtonText: {
		fontSize: 16,
		fontWeight: '500',
		color: '#2e64e5',
		fontFamily: 'Lato-Regular',
	}
});
