import theme from "./theme"
import { CssBaseline, ThemeProvider } from "@mui/material"

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
		</ThemeProvider>
	)
}

export default App
