import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyAV7EA39WBi-xah1CBjK87-qsTfXIzVZf0",
  authDomain: "rollmein-c1698.firebaseapp.com",
  projectId: "rollmein-c1698",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

export const SignInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    const object = {
      refreshToken: user.refreshToken,
      //@ts-ignore next line
      accessToken: user.accessToken,
      email: user?.email,
      firebaseUid: user?.uid,
      googleUid: user.providerData[0].uid
    }
    console.log('object', object)
    return object
  } catch (e) {
    console.error("error on google auth", e)
    return null
  }
}