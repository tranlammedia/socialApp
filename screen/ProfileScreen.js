import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import React, { useContext, useEffect, useState } from 'react'
import FormButton from '../components/FormButton'
import { AuthContext } from '../navigation/AuthProvider'
import PostCard from '../components/PostCard';

export default function ProfileScreen({ navigation, route }) {
  const { user, logout } = useContext(AuthContext)

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleted, setDeleted] = useState(false)
  const [userData, setUserData] = useState(null);

  // console.log(user)
  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(route.params ? route.params.userId : user.uid)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      })
  }

  useEffect(() => {
    getUser();
    fetchPosts()
    navigation.addListener('focus', ()=> setLoading(!loading))
  }, [deleted, navigation, loading])

  const fetchPosts = async () => {
    try {
      const list = []

      await firestore()
        .collection('posts')
        .where('userId', '==', route.params ? route.params.userId : user.uid)
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


  // console.log(route.params?.userId)
  // console.log(user.uid)
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <Image
          style={styles.userImg}
          source={{uri: userData ? 
            userData.userImg 
            || 
          'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'
           : 
          'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'}}
        />
        <Text style={styles.userName}>{userData ? userData.fname : 'Test'} {userData ? userData.lname : 'user'}</Text>
        {/* <Text style={styles.userName}>{route.params ? route.params.userId : user.uid}</Text> */}
        <Text style={styles.aboutUser}>
          {userData ? userData.about || 'No details added' : ''}
        </Text>
        <View style={styles.userBtnWrapper}>
          {route.params && route.params?.userId !== user.uid ? (
            <>
              <TouchableOpacity style={styles.userBtn} onPress={() => { }}>
                <Text style={styles.userBtnTxt}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.userBtn} onPress={() => { }}>
                <Text style={styles.userBtnTxt}>Follow</Text>
              </TouchableOpacity>
            </>

          ) : (
            <>
              <TouchableOpacity style={styles.userBtn} onPress={() => { navigation.navigate('EditProfile') }}>
                <Text style={styles.userBtnTxt}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.userBtn} onPress={() => logout()}>
                <Text style={styles.userBtnTxt}>Logout</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <View style={styles.userInfoWrapper}>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>{posts.length}</Text>
            <Text style={styles.userInfoSubTitle}>Posts</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>10,000</Text>
            <Text style={styles.userInfoSubTitle}>Followers</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>100</Text>
            <Text style={styles.userInfoSubTitle}>Following</Text>
          </View>
        </View>

        {posts.map((item) => {
          return <PostCard key={item.id} item={item} onDelete={handleDelete}></PostCard>
        })}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#666'
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  userBtn: {
    borderColor: '#2e64e5',
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  userBtnTxt: {
    color: '#2e64e5',
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  userInfoItem: {
    justifyContent: 'center',
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#666'
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
})