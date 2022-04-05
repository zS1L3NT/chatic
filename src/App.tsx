import AuthContext from "./contexts/AuthContext"
import Index from "./pages/Index"
import Login from "./pages/Login"
import Navigator from "./components/Navigator"
import theme from "./theme"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { Navigate, Route, Routes } from "react-router-dom"
import { useContext } from "react"

const App = () => {
	const user = useContext(AuthContext)

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{user && <Navigator />}
			<main>
				<Routes>
					<Route path="/" element={user ? <Index /> : <Navigate to="/login" />} />
					<Route path="/login" element={<Login />} />
				</Routes>
			</main>
		</ThemeProvider>
	)
}

export default App
