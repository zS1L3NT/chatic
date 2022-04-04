import Navigator from "./components/Navigator"
import theme from "./theme"
import useAuthUser from "./hooks/useAuthUser"
import { CssBaseline, ThemeProvider } from "@mui/material"

const App = () => {
	const [user, userError] = useAuthUser()

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{user && <Navigator />}
		</ThemeProvider>
	)
}

export default App
