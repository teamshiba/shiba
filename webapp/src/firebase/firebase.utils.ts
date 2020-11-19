import firebase, {firestore} from "./index";
import {User} from "../domain/user";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const generateUserDocument = async (user: firebase.User | null,
                                           additionalData: firebase.firestore.DocumentData | undefined)
    : Promise<User | null> => {
    if (!user) return null;

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

const getUserDocument = async (uid: string): Promise<User | null> => {
    if (!uid) return null;
    try {
        const userDocument = await firestore.doc(`Users/${uid}`).get();

        return {
            uid,
            ...userDocument.data()
        } as User;
    } catch (error) {
        console.error("Error fetching user", error);
    }

    return null;
};
