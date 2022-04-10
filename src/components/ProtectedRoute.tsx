import { PropsWithChildren, useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"

import AuthContext from "../contexts/AuthContext"

const _ProtectedRoute = (props: PropsWithChildren<{}>) => {
	return useContext(AuthContext) ? (
		props.children ? (
			<>{props.children}</>
		) : (
			<Outlet />
		)
	) : (
		<Navigate replace to="/login" />
	)
}

export default _ProtectedRoute
