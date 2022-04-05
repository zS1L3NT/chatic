import App from "./App"
import React from "react"
import ReactDOM from "react-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter } from "react-router-dom"

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<App />
			</AuthProvider>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root")
)
