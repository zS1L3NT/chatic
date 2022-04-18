import { StrictMode } from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"

import App from "./App"
import SnackbarProvider from "./components/SnackbarProvider"
import { AuthProvider } from "./contexts/AuthContext"
import store from "./store"

ReactDOM.render(
	<StrictMode>
		<BrowserRouter>
			<Provider store={store}>
				<AuthProvider>
					<SnackbarProvider>
						<App />
					</SnackbarProvider>
				</AuthProvider>
			</Provider>
		</BrowserRouter>
	</StrictMode>,
	document.getElementById("root")
)
