import { StrictMode } from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"

import App from "./App"
import AuthProvider from "./providers/AuthProvider"
import SnackbarProvider from "./providers/SnackbarProvider"
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
