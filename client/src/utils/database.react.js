import * as firebase from 'firebase';

var config = {
        apiKey: "AIzaSyDphIBPBwGLP1hJ11itmwsIfxW0r80Milk",
        authDomain: "coindash-5ecb2.firebaseapp.com",
        databaseURL: "https://coindash-5ecb2.firebaseio.com",
        storageBucket: "coindash-5ecb2.appspot.com",
        messagingSenderId: "701609755063"
      };

firebase.initializeApp(config);
const database = firebase.database();

export default firebase;