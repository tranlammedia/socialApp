import { Alert, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import FormButton from '../components/FormButton'
import Ionicons from "react-native-vector-icons/Ionicons";
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import { AuthContext } from '../navigation/AuthProvider'
import { Container, Card, UserInfo, UserImg, UserName, UserInfoText, PostTime, PostText, PostImg, InteractionWrapper, Interaction, InteractionText, Divider } from "../styles/FeedStyles";
import PostCard from '../components/PostCard';
import ShimmerEffect from '../components/ShimmerEffect';

const posts = [
  {
    id: '1',
    userName: 'Jenny Doe',
    userImg: require('../assets/users/user-3.png'),
    postTime: '4 mins ago',
    post:
      'Hey there, this is my test for a post of my social app in React Native.',
    postImg: require('../assets/posts/post-1.jpg'),
    liked: true,
    likes: '14',
    comments: '5',
  },
  {
    id: '2',
    userName: 'John Doe',
    userImg: require('../assets/users/user-1.png'),
    postTime: '2 hours ago',
    post:
      'Hey there, this is my test for a post of my social app in React Native.',
    postImg: 'none',
    liked: false,
    likes: '8',
    comments: '0',
  },
  {
    id: '3',
    userName: 'Ken William',
    userImg: require('../assets/users/user-4.png'),
    postTime: '1 hours ago',
    post:
      'Hey there, this is my test for a post of my social app in React Native.',
    postImg: require('../assets/posts/post-2.jpg'),
    liked: true,
    likes: '1',
    comments: '0',
  },
  {
    id: '4',
    userName: 'Selina Paul',
    userImg: require('../assets/users/user-6.png'),
    postTime: '1 day ago',
    post:
      'Hey there, this is my test for a post of my social app in React Native.',
    postImg: require('../assets/posts/post-3.jpg'),
    liked: true,
    likes: '22',
    comments: '4',
  },
  {
    id: '5',
    userName: 'Christy Alex',
    userImg: require('../assets/users/user-7.png'),
    postTime: '2 days ago',
    post:
      'Hey there, this is my test for a post of my social app in React Native.',
    postImg: 'none',
    liked: false,
    likes: '0',
    comments: '0',
  },
];

export default function HomeScreen({navigation}) {
  const { user, logout } = useContext(AuthContext)

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleted, setDeleted] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    fetchPosts()
    setDeleted(false)
  }, [deleted])

  const fetchPosts = async () => {
    try {
      const list = []

      await firestore()
        .collection('posts')
        .orderBy('postTime', 'desc')
        .get()
        .then((querySnapshot) => {
          // console.log('total: ', querySnapshot.size)
          querySnapshot.forEach(doc => {
            // console.log('post ID: ', doc.id, doc.data());
            const { post, postImg, postTime, userId, likes, comments } = doc.data()
            list.push(
              {
                id: doc.id,
                userId: userId,
                userName: 'Text name',
                userImg: 'https://cdn-icons-png.flaticon.com/512/25/25634.png',
                postTime: postTime,
                post: post,
                postImg: postImg,
                liked: false,
                likes,
                comments,
              }
            )
          });
        })
      // console.log(list)
      setPosts(list)
      if (loading) {
        setLoading(false);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = (postId) => {
    Alert.alert(
      'Delete post',
      'Are you sure?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: 'Confirm',
          onPress: () => deletePost(postId),
        },
      ],
      { cancelable: true }
    )
  }

  const deletePost = async (postId) => {
    await deleteStorageData(postId)
    deleteFirestoreData(postId)
    setDeleted(true)
  }

  const deleteStorageData = (postId) => {
    firestore().collection('posts')
      .doc(postId)
      .get()
      .then((documentSnapshot) => {
        // delete storage
        if (documentSnapshot.exists) {
          const { postImg } = documentSnapshot.data()
          if (postImg !== null) {
            const storageRef = storage().refFromURL(postImg)
            const imageRef = storage().ref(storageRef.fullPath)

            imageRef
              .delete()
              .then(() => {
                console.log(`${postImg} has been deleted successfully`)

              })
              .catch((error) => {
                console.log('Error while deleting the image. ', error)
              })
          }
        }
      })
  }

  const deleteFirestoreData = (postId) => {
    firestore().collection('posts')
      .doc(postId)
      .delete()
      .then(() => {
        Alert.alert('Post deleted', 'your post has been deleted successfully')
      })
      .catch((error) => {
        console.log('Error while deleting the post. ', error)
      })
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <ShimmerEffect />
      ) : (
        <Container>
          <FlatList
            data={posts}
            renderItem={({ item }) => <PostCard item={item} onDelete={handleDelete} onPress={() => navigation.navigate('HomeProfile', {userId: item.userId})}/>}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        </Container>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  text: {
    fontSize: 20,
    color: '#333333'
  },
})