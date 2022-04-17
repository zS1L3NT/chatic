import { SnackbarProvider } from "notistack"
import { StrictMode } from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"

import App from "./App"
import { AuthProvider } from "./contexts/AuthContext"

ReactDOM.render(
	<StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<SnackbarProvider maxSnack={5}>
					<App />
				</SnackbarProvider>
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>,
	document.getElementById("root")
)
