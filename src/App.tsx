import Index from "./pages/Index"
import Login from "./pages/Login"
import Navigator from "./components/Navigator"
import theme from "./theme"
import useAuthUser from "./hooks/useAuthUser"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { Navigate, Route, Routes } from "react-router-dom"

const App = () => {
	const [user, userError] = useAuthUser()

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{user && <Navigator />}
			<Routes>
				<Route path="/" element={user ? <Index /> : <Navigate to="/login" />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</ThemeProvider>
	)
}

export default App
