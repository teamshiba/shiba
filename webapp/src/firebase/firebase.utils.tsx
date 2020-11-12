import firebase from "./index";
import "firebase/firestore";
import "firebase/auth";

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();

// eslint-disable-next-line
export const signInWithGoogle = () => {
    auth.signInWithPopup(provider);
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const generateUserDocument = async (user: firebase.User | null, additionalData: firebase.firestore.DocumentData | undefined) => {
    if (!user) return;

    const userRef = firestore.doc(`Users/${user.uid}`);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
        const {email, displayName, photoURL} = user;
        try {
            await userRef.set({
                displayName,
                email,
                photoURL,
                ...additionalData
            });
        } catch (error) {
            console.error("Error creating user document", error);
        }
    }
    return getUserDocument(user.uid);
};

const getUserDocument = async (uid: string) => {
    if (!uid) return null;
    try {
        const userDocument = await firestore.doc(`users/${uid}`).get();

        return {
            uid,
            ...userDocument.data()
        };
    } catch (error) {
        console.error("Error fetching user", error);
    }
};
