import { PropsWithChildren } from "react"
import { Navigate, Outlet } from "react-router-dom"

import useAppSelector from "../hooks/useAppSelector"

const _ProtectedRoute = (props: PropsWithChildren<{}>) => {
	const user = useAppSelector(state => state.auth)
	return user ? (
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
