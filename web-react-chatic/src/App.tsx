import { Navigate, Route, Routes } from "react-router-dom"

import { CssBaseline, ThemeProvider } from "@mui/material"

import ProtectedRoute from "./components/ProtectedRoute"
import Chat from "./pages/Chat"
import Login from "./pages/Login"
import theme from "./theme"

const _App = () => {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<main>
				<Routes>
					<Route
						path="/"
						element={
							<ProtectedRoute>
								<Navigate replace to="/chat" />
							</ProtectedRoute>
						}
					/>
					<Route path="chat" element={<ProtectedRoute />}>
						<Route index element={<Chat />} />
						<Route path=":chatId" element={<Chat />} />
					</Route>
					<Route path="login" element={<Login />} />
				</Routes>
			</main>
		</ThemeProvider>
	)
}

export default _App
