import App from "./App"
import FirebaseReduxProvider from "./components/FirebaseReduxProvider"
import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"

ReactDOM.render(
	<React.StrictMode>
		<FirebaseReduxProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</FirebaseReduxProvider>
	</React.StrictMode>,
	document.getElementById("root")
)
