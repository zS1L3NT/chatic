import store from "../store"
import { Provider } from "react-redux"

interface Props extends React.PropsWithChildren<{}> {}

const FirebaseReduxProvider = (_: Props) => {
	return (
		<Provider store={store}>
			<slot />
		</Provider>
	)
}

export default FirebaseReduxProvider
