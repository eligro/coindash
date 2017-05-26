import * as firebase from 'firebase'

var config = {
  apiKey: 'AIzaSyCBkSV8inD-GlHbusHh8E6Omu-f_17Dvfo',
  authDomain: 'coindash-23ad2.firebaseapp.com',
  databaseURL: 'https://coindash-23ad2.firebaseio.com',
  projectId: 'coindash-23ad2',
  storageBucket: 'coindash-23ad2.appspot.com',
  messagingSenderId: '617542243973'
}

firebase.initializeApp(config)
export const database = firebase.database()

export default firebase
