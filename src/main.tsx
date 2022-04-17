import { StrictMode } from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"

import App from "./App"
import SnackbarProvider from "./components/SnackbarProvider"
import { AuthProvider } from "./contexts/AuthContext"

ReactDOM.render(
	<StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<SnackbarProvider>
					<App />
				</SnackbarProvider>
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>,
	document.getElementById("root")
)
