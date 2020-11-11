import firebase from 'firebase';
import { config } from './firebase.utils';

export const firebaseApp = firebase.initializeApp(config);

export default firebase;