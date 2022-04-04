import firebaseApp from "./firebaseApp"
import Navigator from "./components/Navigator"
import theme from "./theme"
import useAuthUser from "./hooks/useAuthUser"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { getAuth, signOut } from "firebase/auth"
import { useSignInWithGoogle } from "react-firebase-hooks/auth"

const App = () => {
	const auth = getAuth(firebaseApp)

	const [user, userError] = useAuthUser()
	const [signInWithGoogle] = useSignInWithGoogle(auth)

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{user && <Navigator />}
			<button onClick={() => signInWithGoogle()}>Sign In</button>
			<button onClick={() => signOut(auth)}>Sign Out</button>
		</ThemeProvider>
	)
}

export default App
