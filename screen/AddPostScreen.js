import { ActivityIndicator, Alert, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useState, useContext } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FloatingAction } from "react-native-floating-action";
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

import { AddImage, InputField, InputWrapper, StatusWrapper, SubmitBtn, SubmitBtnText } from '../styles/AddPost'
import { AuthContext } from '../navigation/AuthProvider';

export default function AddPostScreen() {
  const { user } = useContext(AuthContext)

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [post, setPost] = useState(null);

  const actions = [
    {
      text: "Take photo",
      icon: <Ionicons name="camera-outline" size={25} />,
      name: "btTakePhoto",
      position: 1,
      color: '#9b59b6',
      buttonSize: 56,
      margin: 0,
    },
    {
      text: "Choose photo",
      icon: <Ionicons name="images-outline" size={25} />,
      name: "btChoosePhoto",
      position: 2,
      color: '#3498db',
      buttonSize: 56,
      margin: 0
    },
  ];
  const takePhotoFromCamera = () => {
    try {
      ImagePicker.openCamera({
        width: 1200,
        height: 780,
        cropping: true,
      }).then((image) => {
        // console.log(image);
        const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
        setImage(imageUri);
      });
    } catch (error) {
      alert(error);
    }
  };

  const choosePhotoFromLibrary = () => {
    try {
      ImagePicker.openPicker({
        width: 1200,
        height: 780,
        cropping: true,
      }).then((image) => {
        // console.log(image);
        const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
        setImage(imageUri);
      });
    } catch (error) {
      alert(error);
    }
  };

  const submitPost = async () => {
    const imageUrl = await uploadImage()
    console.log('image url: ', imageUrl)

    firestore()
      .collection('posts')
      .add({
        // name: 'Ada Lovelace',
        // age: 30,
        userId: user.uid,
        post: post,
        postImg: imageUrl,
        postTime: firestore.Timestamp.fromDate(new Date()),
        likes: null,
        comments: null
      })
      .then(() => {
        console.log('Post Added')
        setPost(null)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const uploadImage = async () => {
    if (image == null) {
      return null
    }

    const uploadUri = image; //uri image react-native-image-crop-picker
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1)

    // add timestamp to file name
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true)
    setTransferred(0)

    const storageRef = storage().ref(`photos/${filename}`)
    const task = storageRef.putFile(uploadUri)

    // set transferred state
    task.on('state_changed', taskSnapshot => {
      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100
      )
    });

    try {
      await task

      const url = await storageRef.getDownloadURL();

      setUploading(false)
      setImage(null)
      Alert.alert(
        'Image uploaded',
        'upload',
      )
      return url
    } catch (error) {
      console.log(error)
      return null
    }
  }

  return (
    <View style={styles.container}>
      <InputWrapper>
        {image != null ? <AddImage source={{ uri: image }} /> : null}

        <InputField
          placeholder="What's on your mind?"
          multiline
          numberOfLines={4}
          value={post}
          onChangeText={(content) => setPost(content)}
        />
        {uploading ? (
          <StatusWrapper>
            <Text>{transferred}% Completed!</Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </StatusWrapper>
        ) : (
          <SubmitBtn onPress={submitPost} disabled={!post}>
            <SubmitBtnText>Post</SubmitBtnText>
          </SubmitBtn>
        )}
      </InputWrapper>
      <FloatingAction
        actions={actions}
        // distanceToEdge={15}
        color={'#2e64e5'}
        actionsPaddingTopBottom={2}
        onPressItem={name => {
          switch (name) {
            case 'btTakePhoto':
              takePhotoFromCamera()
              break;
            case 'btChoosePhoto':
              choosePhotoFromLibrary()
              break;
          }
          // console.log(`selected button: ${name}`);
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
})