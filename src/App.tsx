import Navigator from "./components/Navigator"
import theme from "./theme"
import useAuthUser from "./hooks/useAuthUser"
import { CssBaseline, ThemeProvider } from "@mui/material"
import Index from "./pages/Index"

const App = () => {
	const [user, userError] = useAuthUser()

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{user && <Navigator />}
			<Index />
		</ThemeProvider>
	)
}

export default App
