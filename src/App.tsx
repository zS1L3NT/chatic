import { useContext } from "react"
import { Navigate, Route, Routes } from "react-router-dom"

import { CssBaseline, ThemeProvider } from "@mui/material"

import AuthContext from "./contexts/AuthContext"
import Index from "./pages/Index"
import Login from "./pages/Login"
import theme from "./theme"

const _App = () => {
	const user = useContext(AuthContext)

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<main>
				<Routes>
					<Route path="/" element={user ? <Index /> : <Navigate to="/login" />} />
					<Route path="/login" element={<Login />} />
				</Routes>
			</main>
		</ThemeProvider>
	)
}

export default _App
