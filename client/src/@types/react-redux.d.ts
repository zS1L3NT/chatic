import "react-redux"

import { AppState } from "../ReduxStore"

declare module "react-redux" {
	interface DefaultRootState extends AppState {}
}