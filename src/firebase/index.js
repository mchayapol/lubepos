import firebase from 'firebase/app'
import firebaseConfig from './config'

require("firebase/firestore");

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  // firebase.firestore().settings({
  //     cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
  // });

  firebase.firestore().enablePersistence()
    .catch(function (err) {
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a a time.
        // ...
        console.err(err);
      } else if (err.code === 'unimplemented') {
        // The current browser does not support all of the
        // features required to enable persistence
        // ...
        console.err(err);
      }
    });
}

export default firebase