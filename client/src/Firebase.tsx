import "firebase/analytics"
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"
import "firebase/firestore"
import "firebase/storage"
import { isMobile } from "react-device-detect"
import { Redirect } from "./App"

const config = require("./serviceAccountKey.json")

class Firebase {
	private auth: typeof firebase.auth
	private auth_: firebase.auth.Auth
	public firestore: firebase.firestore.Firestore
	public storage: firebase.storage.Storage
	public database: firebase.database.Database

	constructor() {
		firebase.initializeApp(config)
		firebase.analytics()

		this.auth = firebase.auth
		this.auth_ = firebase.auth()
		this.firestore = firebase.firestore()
		this.database = firebase.database()
		this.storage = firebase.storage()
	}

	getCurrent() {
		return this.auth_.currentUser
	}

	/**
	 * Check if user is authenticated by looking at Firebase user object and redux state
	 * @throws Error if firebase user & redux user do not match
	 * @return Possible UID of current user
	 */
	isAuth(): string | undefined {
		return this.auth_.currentUser?.uid
	}

	onAuthStateChanged(
		user: firebase.Observer<any, Error> | ((a: firebase.User | null) => any)
	) {
		this.auth_.onAuthStateChanged(user)
	}

	EmailSignIn(email: string, password: string) {
		return this.auth_.signInWithEmailAndPassword(email, password)
	}

	EmailSignUp(eml: string, pswd: string) {
		return this.auth_.createUserWithEmailAndPassword(eml, pswd)
	}

	GoogleSignIn() {
		const GoogleProvider = new this.auth.GoogleAuthProvider()
		GoogleProvider.addScope("email")
		return this.auth_.signInWithPopup(GoogleProvider)
	}

	FacebookSignIn() {
		// TODO Implement after app is built
		const FacebookProvider = new this.auth.FacebookAuthProvider()
		FacebookProvider.addScope("email,picture")
		return this.auth_.signInWithPopup(FacebookProvider)
	}

	ForgotPassword(email: string) {
		return this.auth_.sendPasswordResetEmail(email)
	}

	CheckPassword(email: string, password: string): Promise<boolean> {
		const credential = this.auth.EmailAuthProvider.credential(
			email,
			password
		)
		return new Promise<boolean>((res, rej) => {
			this.auth_.currentUser
				?.reauthenticateWithCredential(credential)
				.then(() => res(true))
				.catch(() => res(false))
		})
	}

	ResetPassword(password: string) {
		return this.auth_.currentUser?.updatePassword(password)
	}

	SignOut() {
		return new Promise<string>((res, rej) => {
			const uid = this.auth_.currentUser?.uid
			if (!uid) rej()
			else this.auth_.signOut().then(() => res(uid))
		})
	}

	CheckRedirect(history: any, active: boolean | null, path?: string) {
		if (this.auth_.currentUser?.uid) {
			if (isMobile) {
				Redirect(history, "/mobile")
			} else if (active) {
				Redirect(history, "/active")
			} else {
				if (path) {
					Redirect(history, path)
				}
			}
		}
	}

	online() {
		return {
			isOnline: true,
			lastseen: new Date().getTime(),
			listening: "",
			typing: false
		}
	}

	offline() {
		return {
			isOnline: false,
			lastseen: new Date().getTime(),
			listening: "",
			typing: false
		}
	}
}

const app = new Firebase()
export default app
