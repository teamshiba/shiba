import firebase from 'firebase';
import { config } from './config.jsx';

export const firebaseApp = firebase.initializeApp(config);

export default firebase;